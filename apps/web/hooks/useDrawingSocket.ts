"use client";

import { useEffect, useRef } from "react";

type ShapeData = {
  [key: string]: any;
};

interface DrawEvent {
  type: "draw_event";
  roomId: string;
  shapeType: string;
  shapeData: ShapeData;
  fromUserId?: string;
}

export function useDrawingSocket({
  token,
  roomId,
  onDrawEventAction,
}: {
  token: string;
  roomId: string;
  onDrawEventAction: (event: DrawEvent) => void;
}) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token || !roomId) return;

    const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join_room", roomId }));
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === "draw_event") {
        onDrawEventAction(data);
      }
    };

    return () => {
      ws.send(JSON.stringify({ type: "leave_room", roomId }));
      ws.close();
    };
  }, [token, roomId]);

  const sendDrawEvent = (tool: string, data: any) => {
    const socket = wsRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("⚠ WebSocket not ready. State:", socket?.readyState);
      return;
    }

    socket.send(
      JSON.stringify({
        type: "draw_event",
        roomId,
        shapeType: tool, 
        shapeData: data,
      })
    );
  };

  return { sendDrawEvent };
}
