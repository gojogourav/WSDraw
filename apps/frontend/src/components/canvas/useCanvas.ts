"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { Shape, Tool, Point } from "./types";
import { v4 as uuidv4 } from "uuid";
import { getStroke } from "perfect-freehand";

// Helper to convert perfect-freehand stroke points into an SVG path string
export function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"],
  );

  d.push("Z");
  return d.join(" ");
}

export function drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
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

      const stroke = getStroke(shape.points, {
        size: shape.width * 3,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
      });

      const pathData = getSvgPathFromStroke(stroke);
      ctx.fillStyle = shape.color;
      ctx.fill(new Path2D(pathData));
      break;
    }
    case "text": {
      ctx.fillStyle = shape.color;
      ctx.font = `${shape.width * 8}px sans-serif`;
      ctx.fillText(shape.text || "", shape.x1, shape.y1);
      break;
    }
  }
}

export function drawArrowHead(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
) {
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
}

export function useCanvas() {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

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

  const onWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Stop the whole webpage from scrolling

    if (e.ctrlKey || e.metaKey) {
      // Zoom logic goes here later
      return;
    }

    setPan((prevPan) => ({
      x: prevPan.x - e.deltaX,
      y: prevPan.y - e.deltaY,
    }));
  }, []);

  const redrawAll = useCallback(
    (shapesToDraw: Shape[]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Reset matrix to identity so clearRect wipes the actual physical screen
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 2. Apply camera transformations
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // 3. Draw infinite world
      shapesToDraw.forEach((shape) => drawShape(ctx, shape));
      ctx.restore();
    },
    [pan, zoom],
  );

  useEffect(() => {
    redrawAll(shapes);
  }, [redrawAll, shapes]);

  const getPoint = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): Point => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      return {
        x: (screenX - pan.x) / zoom,
        y: (screenY - pan.y) / zoom,
      };
    },
    [pan, zoom],
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const point = getPoint(e);

      setIsDrawing(true);
      startPoint.current = point;
      currentStrokeId.current = uuidv4();
      currentPoints.current = [point];
      lastSentIndex.current = 0;
    },
    [getPoint],
  );

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

        redrawAll(shapes);

        // Apply camera to the live preview context before filling the path
        ctx.save();
        ctx.translate(pan.x, pan.y);
        ctx.scale(zoom, zoom);

        const stroke = getStroke(currentPoints.current, {
          size: strokeWidth * 3,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        });

        const pathData = getSvgPathFromStroke(stroke);
        ctx.fillStyle = color;
        ctx.fill(new Path2D(pathData));
        ctx.restore();

        // Send network batch
        if (currentPoints.current.length - lastSentIndex.current >= 2) {
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

        ctx.save();
        ctx.translate(pan.x, pan.y);
        ctx.scale(zoom, zoom);
        drawShape(ctx, previewShape);
        ctx.restore();
      }
    },
    [
      isDrawing,
      tool,
      color,
      strokeWidth,
      shapes,
      redrawAll,
      getPoint,
      pan,
      zoom,
    ],
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
    [isDrawing, tool, color, strokeWidth, getPoint],
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
    onWheel, // <-- Crucial: Exporting the wheel listener!
    pan,
    setPan,
    zoom,
    setZoom,
    addShape,
    removeShape,
    loadShapes,
    undo,
    redrawAll,
  };
}
