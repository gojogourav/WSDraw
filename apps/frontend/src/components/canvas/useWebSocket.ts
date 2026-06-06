"use client";
import { useEffect, useRef, useCallback } from "react";
import { Shape } from "./types";

interface UseWebSocketProps {
  roomId: string;
  name: string;
  onCanvasState: (shapes: Shape[]) => void;
  onDrawShape: (shape: Shape) => void;
  onDrawPartial: (strokeId: string, points: { x: number; y: number }[]) => void;
  onUserJoined: (name: string) => void;
  onUserLeft: (name: string) => void;
  onUndoConfirmed: (shapeId: string) => void;
}

export function useWebSocket({
  roomId,
  name,
  onCanvasState,
  onDrawShape,
  onDrawPartial,
  onUserJoined,
  onUserLeft,
  onUndoConfirmed,
}: UseWebSocketProps) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:6372",
    );
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          roomId,
          userId: `guest_${Math.random().toString(36).slice(2)}`,
          name,
          role: "STUDENT",
        }),
      );
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "canvas_state":
          onCanvasState(message.payload.shapes);
          break;
        case "draw":
          onDrawShape(message.payload);
          break;
        case "draw_complete":
          onDrawShape(message.payload);
          break;
        case "draw_partial":
          onDrawPartial(message.payload.shapeId, message.payload.points || []);
          break;
        case "user_joined":
          onUserJoined(message.name);
          break;
        case "user_left":
          onUserLeft(message.name);
          break;
        case "undo_confirmed":
          onUndoConfirmed(message.shapeId);
          break;
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);

    return () => ws.close();
  }, [roomId, name]);

  const sendDraw = useCallback(
    (shape: Shape) => {
      wsRef.current?.send(
        JSON.stringify({
          type: "draw",
          roomId,
          userId: "guest",
          name,
          payload: shape,
        }),
      );
    },
    [roomId, name],
  );

  const sendDrawPartial = useCallback(
    (
      strokeId: string,
      points: { x: number; y: number }[],
      color: string,
      width: number,
    ) => {
      wsRef.current?.send(
        JSON.stringify({
          type: "draw_partial",
          roomId,
          userId: "guest",
          name,
          payload: {
            shapeId: strokeId,
            points,
            color,
            width,
            layer: "STUDENT",
          },
        }),
      );
    },
    [roomId, name],
  );

  const sendDrawComplete = useCallback(
    (shape: Shape) => {
      wsRef.current?.send(
        JSON.stringify({
          type: "draw_complete",
          roomId,
          userId: "guest",
          name,
          payload: shape,
        }),
      );
    },
    [roomId, name],
  );

  const sendUndo = useCallback(
    (shapeId: string) => {
      wsRef.current?.send(
        JSON.stringify({
          type: "undo",
          roomId,
          userId: "guest",
          shapeId,
        }),
      );
    },
    [roomId],
  );

  const sendCursor = useCallback(
    (x: number, y: number, strokeId: string) => {
      wsRef.current?.send(
        JSON.stringify({
          type: "cursor",
          roomId,
          userId: "guest",
          name,
          strokeId,
          payload: { x, y },
        }),
      );
    },
    [roomId, name],
  );

  return { sendDraw, sendDrawPartial, sendDrawComplete, sendUndo, sendCursor };
}
