import WebSocket, { WebSocketServer } from "ws";
import {
  BroadcastParams,
  ConnectedUser,
  ServerToClientMessage,
} from "./types/serverToUserMessage";
import {
  addUserToRoom,
  clearTeacherAnnotations,
  deleteShapeFromRedis,
  getNextSequence,
  getRoomUsers,
  getShapesFromRedis,
  isRoomLocked,
  publishToRoom,
  removeUserFromRoom,
  saveShapeToRedis,
  setRoomLocked,
  subscriber,
} from "./redis";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import { uuid } from "uuidv4";
import {
  ClientToServerMessage,
  DrawingCompleteMessage,
  Role,
  ShapePayload,
} from "./types/userToServerMessage";
import { prisma } from "./prisma";

const wss = new WebSocketServer({ port: 6372 });
const rooms = new Map<string, Set<ConnectedUser>>();
const wsToUser = new Map<WebSocket, ConnectedUser>();

console.log("websocket server is running on - 6372");

const broadcast = ({ roomId, message, exclude }: BroadcastParams): void => {
  const clients = rooms.get(roomId);
  if (!clients) return;

  const data = JSON.stringify(message);
  clients.forEach((connectedUser) => {
    if (
      connectedUser.ws !== exclude &&
      connectedUser.ws.readyState === WebSocket.OPEN
    ) {
      connectedUser.ws.send(data);
    }
  });
};

const sendToClient = (ws: WebSocket, message: ServerToClientMessage): void => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
};

//auth

const getActiveUser = async (roomId: string) => {
  const users = await getRoomUsers(roomId);
  return users as { userId: string; name: string; role: Role }[];
};

const authenticateConnection = (req: IncomingMessage) => {
  try {
    const cookeisHeader = req.headers.cookie;
    if (!cookeisHeader) return null;

    const cookies = Object.fromEntries(
      cookeisHeader.split(";").map((c) => {
        const [k, v] = c.trim().split("=");

        return [k, decodeURIComponent(v || "")];
      }),
    );

    const token =
      cookies["access_token"] ||
      (req.headers.authorization?.split(" ")[1] ?? "");

    if (!token || !process.env.JWT_SECRET) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string;
    };
    if (!decoded.id) return null;

    return { userId: decoded.id };
  } catch (err) {
    console.log(`Error occured - ${err}`);
  }
};

subscriber.on("message", (channel, data) => {
  try {
    const message = JSON.parse(data) as ServerToClientMessage & {
      roomId: string;
      _originServerId: string;
    };

    if (message._originServerId === process.env.SERVER_ID) return;

    const { roomId } = message;
    broadcast({ roomId, message });
  } catch (err) {
    console.error(`Redis pub sub error - ${err} `);
  }
});

wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
  const auth = authenticateConnection(req);

  const userId = auth?.userId || `guest_${uuid()}`;
  const isGuest = !auth?.userId;

  console.log(`Client connected: ${userId} ${isGuest ? "(guest)" : ""}`);

  ws.on("message", async (data) => {
    try {
      const message: ClientToServerMessage = JSON.parse(String(data));
      switch (message.type) {
        case "join": {
          const { roomId, name, role } = message;

          const room = await prisma.room.findUnique({ where: { id: roomId } });

          if (!room) {
            sendToClient(ws, {
              type: "error",
              message: "Room not found",
              code: "ROOM_NOT_FOUND",
            });
            return;
          }

          const member = await prisma.roomMember.findUnique({
            where: { userId_roomId: { userId, roomId } },
          });

          const actualRole =
            room.adminId === userId
              ? "TEACHER"
              : isGuest
                ? "GUEST"
                : (member?.role ?? role);

          const canDraw = member?.canDraw ?? true;

          // const canDraw = await
          const connectedUser: ConnectedUser = {
            ws,
            userId,
            name,
            role: actualRole,
            roomId,
            canDraw,
          };

          if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());

            await subscriber.subscribe(`channel:room:${roomId}`);
          }

          rooms.get(roomId)?.add(connectedUser);
          const user = wsToUser.get(ws);

          if (user) {
            sendToClient(ws, {
              type: "error",
              message: "User already joined",
              code: "",
            });
            return;
          }

          wsToUser.set(ws, connectedUser);

          await addUserToRoom(roomId, userId, { userId, name, role });

          let shapes = await getShapesFromRedis(roomId);
          if (shapes.length === 0) {
            const dbShapes = await prisma.shape.findMany({
              where: { roomId },
              orderBy: { sequence: "asc" },
            });

            shapes = dbShapes;

            for (const shape of dbShapes) {
              await saveShapeToRedis(roomId, shape.id, shape);
            }
          }

          sendToClient(ws, {
            type: "canvas_state",
            roomId,
            payload: { shapes: shapes as ShapePayload[] },
          });

          const activeUsers = await getActiveUser(roomId);

          broadcast({
            roomId,
            message: {
              type: "user_joined",
              roomId,
              userId,
              name,
              role: isGuest ? "GUEST" : role,
              payload: {
                message: `${name} joined the room`,
                activeUsers,
              },
            },
            exclude: ws,
          });

          console.log(`User ${name} joined room ${roomId}`);
          break;
        }

        case "draw": {
          const { roomId, name, payload } = message;
          const locked = await isRoomLocked(roomId);

          const user = wsToUser.get(ws);

          if (locked && user?.role !== "TEACHER") {
            sendToClient(ws, {
              type: "error",
              message: "Room is locked. Only teacher can draw.",
              code: "ROOM_LOCKED",
            });
            return;
          }

          if (!user?.canDraw && user?.role !== "TEACHER") {
            sendToClient(ws, {
              type: "error",
              message: "You don't have draw permission",
              code: "NO_DRAW_PERMISSION",
            });

            return;
          }

          const sequence = await getNextSequence(roomId);
          const shapeId = payload.shapeId || uuid();

          const shapeData = {
            ...payload,
            shapeId,
            sequence,
            userId,
          };

          broadcast({
            roomId,
            message: { ...message, payload: shapeData },
            exclude: ws,
          });

          await saveShapeToRedis(roomId, shapeId, shapeData);

          await publishToRoom(roomId, {
            ...message,
            payload: shapeData,
            _originServerId: process.env.SERVER_ID,
          });

          prisma.shape
            .create({
              data: {
                id: shapeId,
                roomId,
                userId,
                type: payload.shapeType.toUpperCase() as any,
                x1: payload.x1,
                y1: payload.y1,
                x2: payload.x2 ?? 0,
                y2: payload.y2 ?? 0,
                radius: payload.radius ?? null,
                color: payload.color,
                width: payload.width,
                layer: payload.layer as any,
                text: payload.text ?? null,
                fontFamily: payload.fontFamily ?? null,
                imageUrl: payload.imageUrl ?? null,
                points: payload.points ?? [],
                sequence,
              },
            })
            .catch(console.error);

          break;
        }

        case "draw_partial": {
          const { roomId, name, payload } = message;
          broadcast({
            roomId,
            message: { ...message },
            exclude: ws,
          });

          break;
        }

        case "draw_complete": {
          const { roomId, name, payload } = message;

          const sequence = await getNextSequence(roomId);
          const shapeId = payload.shapeId;

          const shapeData = {
            ...payload,
            shapeId,
            points: payload.points,
            color: payload.color,
            width: payload.width,
            layer: payload.layer,
            sequence: sequence,
            userId,
          };

          await saveShapeToRedis(roomId, shapeId, shapeData);

          prisma.shape
            .create({
              data: {
                id: shapeId,
                roomId,
                userId,
                type: "FREEHAND",
                x1: payload.x1,
                y1: payload.y1,
                x2: payload.x2 ?? 0,
                y2: payload.y2 ?? 0,
                radius: payload.radius ?? null,
                color: payload.color,
                width: payload.width,
                layer: payload.layer as any,
                text: payload.text ?? null,
                fontFamily: payload.fontFamily ?? null,
                imageUrl: payload.imageUrl ?? null,
                points: payload.points ?? [],
                sequence,
              },
            })
            .catch(console.error);

          broadcast({
            roomId,
            message: {
              type: "draw_complete",
              roomId,
              userId,
              name,
              payload: shapeData,
            } as DrawingCompleteMessage,
            exclude: ws,
          });

          break;
        }

        case "cursor": {
          const { roomId, name, payload, strokeId } = message;

          broadcast({
            roomId,

            message: {
              type: "cursor",
              strokeId,
              roomId,
              userId,
              name,
              payload: {
                x: payload.x,
                y: payload.y,
              },
            },
            exclude: ws,
          });

          break;
        }

        case "undo": {
          const { roomId, shapeId } = message;

          await prisma.shape.updateMany({
            where: { id: shapeId, userId },
            data: { deletedAt: new Date() },
          });

          await deleteShapeFromRedis(roomId, shapeId);

          broadcast({
            roomId,
            message: {
              type: "undo_confirmed",
              roomId,
              shapeId,
            },
          });
          break;
        }

        case "redo": {
          const { roomId, shapeId } = message;

          await prisma.shape.updateMany({
            where: { id: shapeId, userId },
            data: { deletedAt: null },
          });

          const shape = await prisma.shape.findUnique({
            where: { id: shapeId },
          });

          if (shape) {
            await saveShapeToRedis(roomId, shapeId, shape);
          }

          broadcast({
            roomId,
            message: {
              type: "redo_confirmed",
              roomId,
              shapeId,
            },
          });

          break;
        }

        case "chat": {
          const { roomId, name, payload } = message;

          prisma.chat
            .create({
              data: {
                id: uuid(),
                message: payload.message,
                roomId,
                userId,
              },
            })
            .catch(console.error);

          broadcast({
            roomId,
            message: {
              type: "chat",
              roomId,
              userId,
              name,
              payload: {
                message: payload.message,
                timestamp: Date.now(),
              },
            },
          });

          break;
        }

        case "lock_room": {
          const { roomId, isLocked } = message;

          const user = wsToUser.get(ws);

          if (user?.role !== "TEACHER") {
            sendToClient(ws, {
              type: "error",
              message: "Only teacher can lock the room",
              code: "UNAUTHORIZED",
            });

            return;
          }

          await setRoomLocked(roomId, isLocked);

          await prisma.room.update({
            where: { id: roomId },
            data: { isLocked },
          });

          broadcast({
            roomId,
            message: {
              type: "room_locked",
              roomId,
              isLocked,
            },
          });

          break;
        }

        case "set_draw_permission": {
          const { roomId, targetUserId, canDraw } = message;

          const user = wsToUser.get(ws);

          if (user?.role !== "TEACHER") {
            sendToClient(ws, {
              type: "error",
              message: "Only teachers can set draw perimssions",
              code: "UNAUTHORIZED",
            });

            return;
          }

          await prisma.roomMember.updateMany({
            where: { userId: targetUserId, roomId },
            data: { canDraw },
          });

          broadcast({
            roomId,
            message: {
              type: "draw_permission",
              roomId,
              targetUserId,
              canDraw,
            },
          });
          break;
        }

        case "spotlight": {
          const { roomId, payload } = message;
          const user = wsToUser.get(ws);

          if (user?.role !== "TEACHER") {
            sendToClient(ws, {
              type: "error",
              message: "Only teachers can use spotlight",
              code: "UNAUTHORIZED",
            });
            return;
          }

          broadcast({
            roomId,
            message: {
              type: "spotlight",
              roomId,
              userId,
              payload,
            },
            exclude: ws,
          });
          break;
        }

        case "clear_annotations": {
          const { roomId } = message;
          const user = wsToUser.get(ws);

          if (user?.role !== "TEACHER") {
            sendToClient(ws, {
              type: "error",
              message: "Only teaches can clear annotations",
              code: "UNAUTHORIZED",
            });

            return;
          }

          await clearTeacherAnnotations(roomId);

          await prisma.shape.updateMany({
            where: { roomId, layer: "TEACHER" },
            data: {
              deletedAt: new Date(),
            },
          });

          broadcast({
            roomId,
            message: {
              type: "error",
              message: "Teacher annotations cleared",
              code: "ANNOTATIONS_CLEAERED",
            },
          });
          break;
        }

        default: {
          console.log("UNDEFINED MESSAGE TYPE");
          break;
        }
      }
    } catch (err) {
      console.error(`Failed to join user - ${err}`);

      sendToClient(ws, {
        type: "error",
        message: "Failed to proceess",
        code: "INTERNAL_SERVER_ERR",
      });
    }
  });

  ws.on("close", async () => {
    const user = wsToUser.get(ws);

    if (!user) return;

    const { roomId, userId, name } = user;

    rooms.get(roomId)?.delete(user);
    wsToUser.delete(ws);

    if (rooms.get(roomId)?.size === 0) {
      rooms.delete(roomId);
      await subscriber.unsubscribe(`channel:room:${roomId}`);
    }

    await removeUserFromRoom(roomId, userId);

    const activeUsers = await getActiveUser(roomId);

    broadcast({
      roomId,
      message: {
        type: "user_left",
        roomId,
        userId,
        name,
        payload: {
          message: `${name} left the room`,
          activeUsers,
        },
      },
    });

    console.log(`Client ${name} disconnected from room`);
  });

  ws.on("error", (err) => {
    console.error("Websocket error : ", err);
  });
});
