import { WebSocket } from "ws";
import { prismaClient } from "@repo/db/client";

interface DrawEventMessage {
  type: "draw_event";
  roomId: number;
  shapeType: string;
  shapeData: any;
}

export async function handleDrawEvent(
  msg: DrawEventMessage,
  ws: WebSocket,
  userId: string,
  broadcastToRoom: (roomId: number, message: any) => void
) {
  const { roomId, shapeType, shapeData } = msg;

  await prismaClient.drawEvent.create({
    data: {
      roomId,
      userId,
      type: shapeType,
      data: shapeData,
    },
  });

  broadcastToRoom(roomId, {
    type: "draw_event",
    roomId,
    shapeType,
    shapeData,
    userId,
  });
}
