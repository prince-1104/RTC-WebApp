import client from "prom-client";

export const register = new client.Registry();

client.collectDefaultMetrics({
  register,
  prefix: "excalidraw_ws_",
});

export const wsConnectionsActive = new client.Gauge({
  name: "excalidraw_ws_connections_active",
  help: "Number of active WebSocket connections",
  registers: [register],
});

export const drawEventsTotal = new client.Counter({
  name: "excalidraw_draw_events_total",
  help: "Total draw events received",
  labelNames: ["shape_type"],
  registers: [register],
});

export const activeRoomsGauge = new client.Gauge({
  name: "excalidraw_ws_active_rooms",
  help: "Number of rooms with at least one participant",
  registers: [register],
});

export function getMetrics(): Promise<string> {
  return register.metrics();
}

export function getContentType(): string {
  return register.contentType;
}
