import { WebSocket } from "ws";

interface ConnectionSession {
  userId: string;
}

const connections = new Map<WebSocket, ConnectionSession>();

export function registerConnection(ws: WebSocket, session: ConnectionSession) {
  connections.set(ws, session);
}

export function unregisterConnection(ws: WebSocket) {
  connections.delete(ws);
}

export function broadcastToRoom(roomId: number, message: any) {
  const payload = JSON.stringify(message);
  for (const [client] of connections.entries()) { 
    client.send(payload);
  }
}
