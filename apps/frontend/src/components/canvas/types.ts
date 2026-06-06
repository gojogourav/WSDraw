export type Tool =
  | "rectangle"
  | "circle"
  | "line"
  | "freehand"
  | "arrow"
  | "text"
  | "select";

export interface Point {
  x: number;
  y: number;
}

export interface Shape {
  shapeId: string;
  shapeType: Tool;
  x1: number;
  y1: number;
  x2?: number;
  y2?: number;
  radius?: number;
  color: string;
  width: number;
  layer: "STUDENT" | "TEACHER";
  points?: Point[];
  text?: string;
  sequence: number;
  timestamp: number;
}
