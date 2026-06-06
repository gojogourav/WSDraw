"use client";
import { useEffect, useRef } from "react";
import { useCanvas } from "./useCanvas";
import { useWebSocket } from "./useWebSocket";
import Toolbar from "./ToolBar";
import { Shape } from "./types";

interface CanvasProps {
  roomId: string;
  name: string;
}

export default function Canvas({ roomId, name }: CanvasProps) {
  const {
    canvasRef,
    tool,
    setTool,
    color,
    setColor,
    strokeWidth,
    setStrokeWidth,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    addShape,
    removeShape,
    loadShapes,
    undo,
    redrawAll,
    shapes,
  } = useCanvas();

  const { sendDraw, sendDrawPartial, sendDrawComplete, sendUndo, sendCursor } =
    useWebSocket({
      roomId,
      name,
      onCanvasState: loadShapes,
      onDrawShape: addShape,
      onDrawPartial: (strokeId, points) => {
        // Draw partial freehand from other users
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        if (points.length < 2) return;
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      },
      onUserJoined: (n) => console.log(`${n} joined`),
      onUserLeft: (n) => console.log(`${n} left`),
      onUndoConfirmed: removeShape,
    });

  // Resize canvas to fill window
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      redrawAll(shapes);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [shapes]);

  const handleUndo = () => {
    const lastShape = shapes[shapes.length - 1];
    if (lastShape) {
      sendUndo(lastShape.shapeId);
      undo();
    }
  };

  return (
    <div className="relative w-screen h-screen bg-white overflow-hidden">
      {/* Toolbar */}
      <Toolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        onUndo={handleUndo}
      />

      {/* Room info */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/90 backdrop-blur-md border border-neutral-200 rounded-xl px-4 py-2 text-sm text-neutral-600 shadow-sm">
        Room:{" "}
        <span className="font-mono font-semibold text-neutral-900">
          {roomId}
        </span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        onMouseDown={onMouseDown}
        onMouseMove={(e) => onMouseMove(e, sendDrawPartial, sendCursor)}
        onMouseUp={(e) => onMouseUp(e, sendDraw, sendDrawComplete)}
        onMouseLeave={(e) => {
          if (tool === "freehand") {
            onMouseUp(e as any, sendDraw, sendDrawComplete);
          }
        }}
      />
    </div>
  );
}
