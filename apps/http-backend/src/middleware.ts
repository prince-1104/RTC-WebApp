import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { httpRequestDuration, httpRequestsTotal } from "./metrics";

export function middleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { userId: string };
    (req as Request & { userId?: string }).userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = performance.now();
  const route = (req.route?.path as string | undefined) ?? req.path;
  res.on("finish", () => {
    const duration = (performance.now() - start) / 1000;
    const status = String(res.statusCode);
    httpRequestDuration.observe({ method: req.method, route, status }, duration);
    httpRequestsTotal.inc({ method: req.method, route, status });
  });
  next();
}
