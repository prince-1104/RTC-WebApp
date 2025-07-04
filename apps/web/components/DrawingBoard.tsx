"use client";

import { useEffect, useRef, useState } from "react";
import { useDrawingSocket } from "../hooks/useDrawingSocket";
import { useCanvasManager } from "../hooks/useCanvasManager";
import DrawingToolSelector, { ToolType } from "./DrawingToolSelector";

export default function DrawingBoard({ roomId, token }: { roomId: string; token: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<ToolType>("pencil");
  const [shapes, setShapes] = useState<any[]>([]);

  const { sendDrawEvent } = useDrawingSocket({
    token,
    roomId,
    onDrawEventAction: (event) => {
      setShapes((prev) => [...prev, event]);
    },
  });

  useEffect(() => {
    fetch(`http://localhost:3001/drawings/${roomId}`)
      .then((res) => res.json())
      .then((data) => setShapes(data.drawings));
  }, [roomId]);

  const {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    renderCanvas,
  } = useCanvasManager({
    canvasRef,
    tool,
    shapes,
    onSendDrawEventAction: sendDrawEvent,
  });

  useEffect(renderCanvas, [shapes]);

  return (
    <div>
      <DrawingToolSelector currentTool={tool} setToolAction={setTool} />
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border border-black"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
}
