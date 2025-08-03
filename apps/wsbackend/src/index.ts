import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';
import { ClientToServerMessage } from './types/SocketEventTypes';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';
import { BroadcastParams } from './types/SocketEventTypes';



let _access_token = process.env.ACCESS_TOKEN;

const app = express();
app.use(cookieParser());
const rooms = new Map<string, Set<WebSocket>>();


const ws = new WebSocketServer({
    port: 6372
})


ws.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
    const cookiesHeader = req.headers.cookie;

    const cookies = cookiesHeader
        ? Object.fromEntries(cookiesHeader.split(";").map(c => {
            const [k, v] = c.trim().split("=");
            return [k, decodeURIComponent(v!)];
        }))
        : {};

    const access_token = cookies["access_token"];



    if (!access_token || !_access_token) {
        console.log("❌ No JWT cookie found");
        ws.close();
        return;
    }

    try {
        const decoded = await jwt.verify(access_token, _access_token) as { userId: string };

        if (!decoded?.userId) {
            console.log("❌ Invalid JWT payload");
            ws.close();
            return;
        }

        console.log(`✅ Client authenticated: ${decoded.userId}`);
    } catch (error) {
        console.log("❌ Invalid token : ", error);
        ws.close();
        return;
    }

    ws.on("message", async (data) => {
        try {
            const message: ClientToServerMessage = JSON.parse(String(data));

            switch (message.type) {
                case "join": {
                    const { roomId, name } = message;

                    if (!rooms.has(roomId)) {
                        rooms.set(roomId, new Set());

                    }
                    rooms.get(roomId)?.add(ws);
                    console.log(`User joined room: ${roomId}`);


                    broadcast(
                        {
                            roomId: roomId,
                            message: {
                                type: "user_joined",
                                roomId: roomId,
                                name,
                                payload: {
                                    message: `${name} joined the room`
                                }
                            },
                            exclude: ws,

                        }
                    );
                    break;
                };

                case 'draw': {
                    const { roomId, name, payload } = message;

                    if (!payload ||typeof !payload.Xin!=='number' ||typeof !payload.Yin !=='number' ||typeof !payload.shape!=='string') {
                        console.log('❌ Invalid draw payload');
                        return;

                    }
                    broadcast({
                        roomId: roomId,
                        message: {
                            type: 'draw',
                            roomId,
                            name,
                            payload: {
                                ...payload,
                                timestamp: payload.timestamp || Date.now()
                            },

                        },
                        exclude: ws
                    })

                    break;
                }

                case 'cursor': {
                    const { roomId, name, payload } = message;

                    broadcast({
                        roomId,
                        message: {
                            type: "cursor",
                            roomId,
                            name,
                            payload
                        },
                        exclude: ws

                    },

                    )

                    break;
                }
                default:
                    console.log('❌ Unknown message type');
                    break;
            }
        } catch (error) {
            console.log("❌ Failed to handle message:", error);

        }
    })

    ws.on("close", async () => {
        rooms.forEach((clients, roomId) => {
            clients.delete(ws);
            if (clients.size == 0) rooms.delete(roomId);
        });

        console.log("Client disconnected and removed from rooms");

    })
})

const broadcast = ({ roomId, message, exclude }: BroadcastParams) => {
    const clients = rooms.get(roomId);
    if (!clients) return;


    clients.forEach((client) => {
        if ((client !== exclude) && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }

    })
}

console.log('✅ WebSocket server running on port 6372');
