"use client";
import { Tool } from "./types";

interface ToolbarProps {
  tool: Tool;
  setTool: (t: Tool) => void;
  color: string;
  setColor: (c: string) => void;
  strokeWidth: number;
  setStrokeWidth: (w: number) => void;
  onUndo: () => void;
}

const tools: { id: Tool; label: string; icon: string }[] = [
  { id: "select", label: "Select", icon: "↖" },
  { id: "rectangle", label: "Rectangle", icon: "▭" },
  { id: "circle", label: "Circle", icon: "○" },
  { id: "line", label: "Line", icon: "╱" },
  { id: "arrow", label: "Arrow", icon: "→" },
  { id: "freehand", label: "Freehand", icon: "✏" },
  { id: "text", label: "Text", icon: "T" },
];

const strokeWidths = [2, 4, 6, 8];

export default function Toolbar({
  tool,
  setTool,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  onUndo,
}: ToolbarProps) {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 bg-white/90 backdrop-blur-md border border-neutral-200 rounded-2xl p-3 shadow-lg">
      {/* Tools */}
      {tools.map((t) => (
        <button
          key={t.id}
          onClick={() => setTool(t.id)}
          title={t.label}
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all
            ${
              tool === t.id
                ? "bg-blue-500 text-white shadow-md"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
        >
          {t.icon}
        </button>
      ))}

      <div className="w-full h-px bg-neutral-200 my-1" />

      {/* Color Picker */}
      <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-neutral-200">
        <div
          className="absolute inset-0 rounded-xl"
          style={{ backgroundColor: color }}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>

      <div className="w-full h-px bg-neutral-200 my-1" />

      {/* Stroke Width */}
      {strokeWidths.map((w) => (
        <button
          key={w}
          onClick={() => setStrokeWidth(w)}
          title={`Stroke ${w}px`}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all
            ${
              strokeWidth === w
                ? "bg-neutral-800 text-white"
                : "hover:bg-neutral-100"
            }`}
        >
          <div
            className="bg-neutral-800 rounded-full"
            style={{ width: w * 3, height: w * 3 }}
          />
        </button>
      ))}

      <div className="w-full h-px bg-neutral-200 my-1" />

      {/* Undo */}
      <button
        onClick={onUndo}
        title="Undo"
        className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-all"
      >
        ↩
      </button>
    </div>
  );
}
