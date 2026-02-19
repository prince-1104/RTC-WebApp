"use client";

export type ToolType = "pencil" | "line" | "rectangle" | "eraser";

interface Props {
  currentTool: ToolType;
  setToolAction: (tool: ToolType) => void;
}

const tools: { type: ToolType; label: string; title: string }[] = [
  { type: "pencil", label: "✏️", title: "Pencil (pattern detection)" },
  { type: "line", label: "➖", title: "Line" },
  { type: "rectangle", label: "⬛", title: "Rectangle" },
  { type: "eraser", label: "🧽", title: "Eraser" },
];

export default function DrawingToolSelector({ currentTool, setToolAction }: Props) {
  return (
    <div className="draw-tools">
      {tools.map((tool) => (
        <button
          key={tool.type}
          type="button"
          title={tool.title}
          onClick={() => setToolAction(tool.type)}
          className={currentTool === tool.type ? "active" : ""}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
}
