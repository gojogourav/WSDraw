"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { Shape, Tool, Point } from "./types";
import { v4 as uuidv4 } from "uuid";

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [tool, setTool] = useState<Tool>("rectangle");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);

  const startPoint = useRef<Point | null>(null);
  const currentStrokeId = useRef<string>("");
  const currentPoints = useRef<Point[]>([]);
  const lastSentIndex = useRef(0);

  // Redraw all shapes
  const redrawAll = useCallback((shapesToDraw: Shape[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapesToDraw.forEach((shape) => drawShape(ctx, shape));
  }, []);

  useEffect(() => {
    redrawAll(shapes);
  }, [shapes, redrawAll]);

  const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (shape.shapeType) {
      case "rectangle": {
        const w = (shape.x2 ?? shape.x1) - shape.x1;
        const h = (shape.y2 ?? shape.y1) - shape.y1;
        ctx.strokeRect(shape.x1, shape.y1, w, h);
        break;
      }
      case "circle": {
        const radius =
          shape.radius ??
          Math.hypot(
            (shape.x2 ?? shape.x1) - shape.x1,
            (shape.y2 ?? shape.y1) - shape.y1,
          ) / 2;
        const cx = shape.x1 + ((shape.x2 ?? shape.x1) - shape.x1) / 2;
        const cy = shape.y1 + ((shape.y2 ?? shape.y1) - shape.y1) / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
      case "line":
      case "arrow": {
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2 ?? shape.x1, shape.y2 ?? shape.y1);
        ctx.stroke();
        if (shape.shapeType === "arrow") {
          drawArrowHead(
            ctx,
            shape.x1,
            shape.y1,
            shape.x2 ?? shape.x1,
            shape.y2 ?? shape.y1,
            shape.color,
          );
        }
        break;
      }
      case "freehand": {
        if (!shape.points || shape.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        shape.points.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();
        break;
      }
      case "text": {
        ctx.fillStyle = shape.color;
        ctx.font = `${shape.width * 8}px sans-serif`;
        ctx.fillText(shape.text || "", shape.x1, shape.y1);
        break;
      }
    }
  };

  const drawArrowHead = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
  ) => {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const size = 15;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - size * Math.cos(angle - Math.PI / 6),
      y2 - size * Math.sin(angle - Math.PI / 6),
    );
    ctx.lineTo(
      x2 - size * Math.cos(angle + Math.PI / 6),
      y2 - size * Math.sin(angle + Math.PI / 6),
    );
    ctx.closePath();
    ctx.fill();
  };

  const getPoint = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getPoint(e);
    setIsDrawing(true);
    startPoint.current = point;
    currentStrokeId.current = uuidv4();
    currentPoints.current = [point];
    lastSentIndex.current = 0;
  }, []);

  const onMouseMove = useCallback(
    (
      e: React.MouseEvent<HTMLCanvasElement>,
      onPartial?: (
        strokeId: string,
        points: Point[],
        color: string,
        width: number,
      ) => void,
      onCursor?: (x: number, y: number, strokeId: string) => void,
    ) => {
      const point = getPoint(e);

      onCursor?.(point.x, point.y, currentStrokeId.current);

      if (!isDrawing || !startPoint.current) return;

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      if (tool === "freehand") {
        currentPoints.current.push(point);

        // Draw locally
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = "round";
        ctx.beginPath();
        const pts = currentPoints.current;
        ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();

        // Send batch every 10 points
        if (currentPoints.current.length - lastSentIndex.current >= 10) {
          onPartial?.(
            currentStrokeId.current,
            currentPoints.current.slice(lastSentIndex.current),
            color,
            strokeWidth,
          );
          lastSentIndex.current = currentPoints.current.length;
        }
      } else {
        // Preview shape while dragging
        redrawAll(shapes);
        const previewShape: Shape = {
          shapeId: currentStrokeId.current,
          shapeType: tool,
          x1: startPoint.current.x,
          y1: startPoint.current.y,
          x2: point.x,
          y2: point.y,
          color,
          width: strokeWidth,
          layer: "STUDENT",
          sequence: 0,
          timestamp: Date.now(),
        };
        drawShape(ctx, previewShape);
      }
    },
    [isDrawing, tool, color, strokeWidth, shapes, redrawAll],
  );

  const onMouseUp = useCallback(
    (
      e: React.MouseEvent<HTMLCanvasElement>,
      onDraw?: (shape: Shape) => void,
      onComplete?: (shape: Shape) => void,
    ) => {
      if (!isDrawing || !startPoint.current) return;
      setIsDrawing(false);

      const point = getPoint(e);
      const shapeId = currentStrokeId.current;

      if (tool === "freehand") {
        const shape: Shape = {
          shapeId,
          shapeType: "freehand",
          x1: currentPoints.current[0]?.x ?? 0,
          y1: currentPoints.current[0]?.y ?? 0,
          points: currentPoints.current,
          color,
          width: strokeWidth,
          layer: "STUDENT",
          sequence: Date.now(),
          timestamp: Date.now(),
        };
        setShapes((prev) => [...prev, shape]);
        onComplete?.(shape);
      } else {
        const shape: Shape = {
          shapeId,
          shapeType: tool,
          x1: startPoint.current.x,
          y1: startPoint.current.y,
          x2: point.x,
          y2: point.y,
          color,
          width: strokeWidth,
          layer: "STUDENT",
          sequence: Date.now(),
          timestamp: Date.now(),
        };
        setShapes((prev) => [...prev, shape]);
        onDraw?.(shape);
      }

      currentPoints.current = [];
      startPoint.current = null;
    },
    [isDrawing, tool, color, strokeWidth],
  );

  const addShape = useCallback((shape: Shape) => {
    setShapes((prev) => {
      if (prev.find((s) => s.shapeId === shape.shapeId)) return prev;
      return [...prev, shape];
    });
  }, []);

  const removeShape = useCallback((shapeId: string) => {
    setShapes((prev) => prev.filter((s) => s.shapeId !== shapeId));
  }, []);

  const loadShapes = useCallback((incoming: Shape[]) => {
    setShapes(incoming);
  }, []);

  const undo = useCallback(() => {
    setShapes((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
  }, []);

  return {
    canvasRef,
    shapes,
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
    drawShape,
    redrawAll,
  };
}
