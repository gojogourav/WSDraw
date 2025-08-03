import { WebSocket,WebSocketServer } from "ws";

export type ShapeType = "rectangle" | "circle";

export interface JoinMessage {
  type: "join";
  roomId: string;
  name: string;
}


export interface DrawMessage {
  type: "draw";
  roomId: string;
  name: string;
  payload: {
    Xin: number;
    Yin: number;
    Xout?: number;
    Yout?: number;
    radius?: number;
    shape: ShapeType;
    timestamp?: number;
  };
}


export interface CursorMessage {
  type: "cursor";
  roomId: string;
  name: string;
  payload: {
    x: number;
    y: number;
  };
}


export interface ErrorMessage {
  type: "error";
  message: string;
}


export interface UserJoinedMessage {
  type: "user_joined";
  roomId: string;
  name: string;
  payload: {
    message: string;
  };
}

export type ClientToServerMessage = JoinMessage | DrawMessage | CursorMessage;

export type ServerToClientMessage =
  | DrawMessage
  | CursorMessage
  | ErrorMessage
  | UserJoinedMessage;


export  interface BroadcastParams {
    roomId: string;
    message: ServerToClientMessage;
    exclude?: WebSocket;
}

