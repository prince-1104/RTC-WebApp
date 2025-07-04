"use client";

import { useState } from "react";

export type ToolType = "pencil" | "line" | "rectangle" | "eraser";

interface Props {
  currentTool: ToolType;
  setToolAction: (tool: ToolType) => void;
}

export default function DrawingToolSelector({ currentTool, setToolAction }: Props) {
  const tools: { type: ToolType; label: string }[] = [
    { type: "pencil", label: "✏️" },
    { type: "line", label: "➖" },
    { type: "rectangle", label: "⬛" },
    { type: "eraser", label: "🧽" },
  ];

  return (
    <div className="fixed left-4 top-20 flex flex-col gap-2 bg-white/70 p-2 rounded-xl shadow-md z-50">
      {tools.map((tool) => (
        <button
          key={tool.type}
          onClick={() => setToolAction(tool.type)}
          className={`p-2 rounded-md ${
            currentTool === tool.type ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
}
