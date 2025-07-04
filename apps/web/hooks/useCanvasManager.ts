"use client";

import { RefObject, useCallback, useRef, useState } from "react";
import type { ToolType } from "../components/DrawingToolSelector";

interface Shape {
  shapeType: ToolType;
  shapeData: any;
}

export function useCanvasManager({
  canvasRef,
  tool,
  shapes,
  onSendDrawEventAction,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  tool: ToolType;
  shapes: Shape[];
  onSendDrawEventAction: (type: ToolType, data: any) => void;
}) {
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const isDrawing = useRef(false);
  const pencilPath = useRef<{ x: number; y: number }[]>([]);

  const getPos = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    return {
      x: e.clientX - (rect?.left || 0),
      y: e.clientY - (rect?.top || 0),
    };
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const pos = getPos(e);
    setStart(pos);
    isDrawing.current = true;

    if (tool === "pencil") {
      pencilPath.current = [pos];
    }
  }, [tool]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawing.current) return;
    const pos = getPos(e);

    if (tool === "pencil") {
      pencilPath.current.push(pos);

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      const path = pencilPath.current;
      ctx.strokeStyle = "#000";
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
     if (path.length >= 2) {
  const prev = path[path.length - 2]!;
  ctx.moveTo(prev.x, prev.y);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}


      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  }, [tool]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isDrawing.current || !start) return;
    isDrawing.current = false;

    const end = getPos(e);

    if (tool === "line" || tool === "rectangle") {
      const shapeData = {
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
        stroke: "#000",
      };
      onSendDrawEventAction(tool, shapeData);
    } else if (tool === "pencil") {
      onSendDrawEventAction("pencil", { path: pencilPath.current, stroke: "#000" });
    }

    setStart(null);
  }, [tool, start, onSendDrawEventAction]);

  const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
    ctx.strokeStyle = shape.shapeData.stroke || "#000";
    ctx.beginPath();

    if (shape.shapeType === "line") {
      const { x1, y1, x2, y2 } = shape.shapeData;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    } else if (shape.shapeType === "rectangle") {
      const { x1, y1, x2, y2 } = shape.shapeData;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    } else if (shape.shapeType === "pencil") {
      const { path } = shape.shapeData;
      if (path.length < 2) return;
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();
    }
  };

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((shape) => drawShape(ctx, shape));
  }, [shapes]);

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    renderCanvas,
  };
}
