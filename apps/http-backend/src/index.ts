import path from "path";
import { config } from "dotenv";

config({ path: path.resolve(__dirname, "../../../.env") });

import express, { Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";
import { middleware, metricsMiddleware } from "./middleware";
import { getMetrics, getContentType } from "./metrics";
import {
  createUserSchema,
  signinSchema,
  CreateRoomSchema,
} from "@repo/common/types";

const app = express();
app.use(cors());
app.use(express.json());
app.use(metricsMiddleware);


app.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid signup data" });
    return;
  }

  const { username, password, name } = parsed.data;

  const existingUser = await prismaClient.user.findUnique({
    where: { email: username },
  });

  if (existingUser) {
    res.status(409).json({ error: "User already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prismaClient.user.create({
    data: {
      email: username,
      password: hashedPassword,
      name,
    },
  });

  res.status(201).json({ userId: user.id });
});

// Signin route
app.post("/signin", async (req: Request, res: Response): Promise<void> => {
  const parsed = signinSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid signin data" });
    return;
  }

  const { username, password } = parsed.data;

  const user = await prismaClient.user.findUnique({
    where: { email: username },
  });

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

  res.status(200).json({ token });
});

// Create Room
app.post("/room", middleware, async (req: Request, res: Response): Promise<void> => {
  const parsed = CreateRoomSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid room data" });
    return;
  }

  // @ts-ignore: Added by middleware
  const userId: string = req.userId;

  const existing = await prismaClient.room.findUnique({
    where: { slug: parsed.data.name },
  });

  if (existing) {
    res.status(409).json({ error: "Room already exists" });
    return;
  }

  const room = await prismaClient.room.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.name,
      adminId: userId,
    },
  });

  res.status(201).json({ roomId: room.id });
});

// Get drawings by room
app.get("/drawings/:roomId", async (req: Request, res: Response): Promise<void> => {
  const roomId = Number(req.params.roomId);
  if (isNaN(roomId)) {
    res.status(400).json({ error: "Invalid room ID" });
    return;
  }

  const drawings = await prismaClient.drawEvent.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
  });

  res.status(200).json({ drawings });
});

app.get("/pattern-stats", async (_req: Request, res: Response): Promise<void> => {
  const completions = await prismaClient.drawEvent.findMany({
    where: { type: "completion" },
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  const byLabel: Record<string, number> = {};
  const recent: { id: number; roomId: number; detectedLabel: string; confidence: number; createdAt: string }[] = [];
  for (const e of completions) {
    const data = e.data as { detectedLabel?: string; confidence?: number } | null;
    const label = (data?.detectedLabel as string) ?? "unknown";
    byLabel[label] = (byLabel[label] ?? 0) + 1;
    if (recent.length < 20) {
      recent.push({
        id: e.id,
        roomId: e.roomId,
        detectedLabel: label,
        confidence: typeof data?.confidence === "number" ? data.confidence : 0,
        createdAt: e.createdAt.toISOString(),
      });
    }
  }
  res.status(200).json({ byLabel, recent });
});

app.get("/metrics", async (_req: Request, res: Response): Promise<void> => {
  res.set("Content-Type", getContentType());
  res.end(await getMetrics());
});

app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});
