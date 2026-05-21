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
    //it will bcome json object of x and y cordinates
  }[];
  sequence: number; // order of drawing
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

//freehand drawing - batch of freehand points
export interface DrawPartialMessage {
  type: "draw_partial";
  roomId: string;
  userId: string;
  name: string;
  payload: {
    strokeId: string; // unique ID for this stroke session
    points: { x: number; y: number }[];
    color: string;
    width: number;
    layer: Layer;
  };
}

export interface DrawCompleteMessage {
  type: "draw_complete";
  roomId: string;
  userId: string;
  name: string;
  payload: {
    strokeId: string;
    points: { x: number; y: number }[];
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
}

export interface UndoMessage {
  type: "undo";
  roomId: string;
  userId: string;
  shapeId: string; //delete a specific shape
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
  type: "lock_room"; // only teacher can draw
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
  | DrawCompleteMessage
  | CursorMessage
  | UndoMessage
  | RedoMessage
  | ChatMessage
  | LockRoomMessage
  | SetDrawPermissionMessage
  | SpotlightMessage
  | ClearAnnotationsMessage;
