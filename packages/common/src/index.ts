import { z } from "zod";

export const createUserSchema = z.object({
    username: z.string()
    .min(3, "username must be at least 3 characters")
    .max(20, "username must not exceed 20 characters")
    .trim(),

    password: z.string()
    .min(6, "Password must be atleast 6 characters log"),

    name: z.string()
    .min(1, "Name can't be empty")
    .max(50)
    .trim(),
});


export const signinSchema = z.object({
    username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .trim(),

  password: z.string()
    .min(6, "Password must be at least 6 characters long"), 
});



export const CreateRoomSchema = z.object({
    name: z.string()
    .min(3, "Room name must be at least 3 characters")
    .max(20, "Room name must not exceed 20 characters")
    .trim(),
})

export const DrawEventSchema = z.object({
    roomId: z.number(),
    shapeType: z.string(),
    shapeData: z.any()
});

export type DrawEvent = z.infer<typeof DrawEventSchema>;