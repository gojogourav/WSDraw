import { WebSocket } from "ws";

export type ShapeType =
  | "rectangle"
  | "circle"
  | "line"
  | "freehand"
  | "text"
  | "image"
  | "arrow";

export type Layer = "STUDENT" | "TEACHER";

export type Role = "TEACHER" | "STUDENT" | "GUEST";

export interface ShapePayload {
  shapeId: string;
  shapeType: ShapeType;

  x1: number;
  y1: number;
  x2?: number;
  y2?: number;
  radius?: number;
  color: string;
  width: number;
  layer: Layer;
  text?: string;
  fontFamily?: string;
  imageUrl?: string;
  points?: {
    x: number;
    y: number;
  }[];
  sequence: number;
  timestamp: number;
}

export interface JoinMessage {
  type: "join";
  roomId: string;
  userId: string;
  name: string;
  role: Role;
}

export interface DrawMessage {
  type: "draw";
  roomId: string;
  userId: string;
  name: string;
  payload: ShapePayload;
}

// Streaming freehand points
export interface DrawPartialMessage {
  type: "draw_partial";
  roomId: string;
  userId: string;
  name: string;
  payload: {
    strokeId: string;
    points: { X: number; Y: number }[];
    color: string;
    width: number;
    layer: Layer;
  };
}

// final completed free hand points
//

export interface DrawingCompleteMessage {
  type: "draw_complete";
  roomId: string;
  userId: string;
  name: string;
  payload: {
    strokeId: string;
    points: { X: number; Y: number }[];
    color: string;
    width: number;
    layer: Layer;
    sequence: number;
  };
}

export interface CursorMessage {
  type: "cursor";
  roomId: string;
  userId: string;
  name: string;
  payload: {
    x: number;
    y: number;
  };
  strokeId: "abc-123"; // same ID as the partials
}

export interface UndoMessage {
  type: "undo";
  roomId: string;
  userId: string;
  shapeId: string; // shape to soft delete
}

export interface RedoMessage {
  type: "redo";
  roomId: string;
  userId: string;
  shapeId: string; // shape to restore
}

export interface ChatMessage {
  type: "chat";
  roomId: string;
  userId: string;
  name: string;
  payload: {
    message: string;
    timestamp: number;
  };
}

export interface LockRoomMessage {
  type: "lock_room"; // teacher mutes all drawing
  roomId: string;
  userId: string;
  isLocked: boolean;
}

export interface SetDrawPermissionMessage {
  type: "set_draw_permission"; // teacher controls per-user
  roomId: string;
  userId: string; // teacher
  targetUserId: string; // student being controlled
  canDraw: boolean;
}

export interface SpotlightMessage {
  type: "spotlight";
  roomId: string;
  userId: string;
  payload: {
    x: number;
    y: number;
    radius: number;
    active: boolean;
  };
}

export interface ClearAnnotationsMessage {
  type: "clear_annotations"; // teacher clears their layer
  roomId: string;
  userId: string;
}

export type ClientToServerMessage =
  | JoinMessage
  | DrawMessage
  | DrawPartialMessage
  | DrawingCompleteMessage
  | CursorMessage
  | UndoMessage
  | RedoMessage
  | ChatMessage
  | LockRoomMessage
  | SetDrawPermissionMessage
  | SpotlightMessage
  | ClearAnnotationsMessage;
