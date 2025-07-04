"use client";

import { useEffect, useRef, useState } from "react";

const WS_URL = "ws://localhost:8080";

export default function DrawPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const isDrawingRef = useRef(false);
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Safe browser-only access
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get("room");
    const tokenParam = params.get("token");

    if (!roomParam || !tokenParam) return;

    setRoomId(Number(roomParam));
    setToken(tokenParam);

    const ws = new WebSocket(`${WS_URL}?token=${tokenParam}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "draw_event") {
        drawFromData(msg.shapeData);
      }
    };

    ws.onclose = () => console.log("❌ WebSocket disconnected");
    return () => ws.close();
  }, []);

  const sendDrawEvent = (shapeData: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && roomId) {
      wsRef.current.send(
        JSON.stringify({
          type: "draw_event",
          roomId,
          shapeType: "pencil",
          shapeData,
        })
      );
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDrawingRef.current = true;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    ctx.lineTo(x, y);
    ctx.stroke();

    sendDrawEvent({ x, y });
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const drawFromData = (data: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-lg mb-4">Drawing Room: {roomId ?? "Not Set"}</h2>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border rounded shadow"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      {!connected && <p className="text-red-500 mt-2">Not connected to server</p>}
    </div>
  );
}
