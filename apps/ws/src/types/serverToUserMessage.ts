import WebSocket from "ws";
import {
  ChatMessage,
  CursorMessage,
  DrawingCompleteMessage,
  DrawMessage,
  DrawPartialMessage,
  Role,
  ShapePayload,
  SpotlightMessage,
} from "./userToServerMessage";

export interface UserJoinedMessage {
  type: "user_joined";
  roomId: string;
  userId: string;
  name: string;

  role: Role;
  payload: {
    message: string;
    activeUsers: {
      userId: string;
      name: string;
      role: Role;
    }[];
  };
}

export interface UserLeftMessage {
  type: "user_left";
  roomId: string;
  userId: string;
  name: string;
  payload: {
    message: string;
    activeUsers: {
      userId: string;
      name: string;
      role: Role;
    }[];
  };
}

export interface CanvasStateMessage {
  type: "canvas_state"; // sent on join — full canvas replay
  roomId: string;
  payload: {
    shapes: ShapePayload[]; // all existing shapes from DB
  };
}

export interface RoomLockedMessage {
  type: "room_locked";
  roomId: string;
  isLocked: boolean;
}

export interface DrawPermissionMessage {
  type: "draw_permission";
  roomId: string;
  targetUserId: string;
  canDraw: boolean;
}

export interface UndoConfirmedMessage {
  type: "undo_confirmed";
  roomId: string;
  shapeId: string;
}
export interface RedoConfirmedMessage {
  type: "redo_confirmed";
  roomId: string;
  shapeId: string;
}
export interface ErrorMessage {
  type: "error";
  message: string;
  code?: string;
}

export type ServerToClientMessage =
  | DrawMessage
  | DrawPartialMessage
  | CursorMessage
  | UserJoinedMessage
  | UserLeftMessage
  | CanvasStateMessage
  | RoomLockedMessage
  | DrawPermissionMessage
  | UndoConfirmedMessage
  | RedoConfirmedMessage
  | DrawingCompleteMessage
  | ChatMessage
  | SpotlightMessage
  | ErrorMessage;

export interface BroadcastParams {
  roomId: string;
  message: ServerToClientMessage;
  exclude?: WebSocket;
}

export interface ConnectedUser {
  ws: WebSocket;
  userId: string;
  name: string;
  role: Role;
  roomId: string;
  canDraw: boolean;
}
