import z from "zod";
import { AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import { getUserId } from "./roomController";
import { prisma } from "../prisma";

export const chatSchema = z.object({
  roomId: z.string().uuid("Invalid Room ID"),
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message is too long"),
});

export const createChat = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const validation = chatSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({ errors: validation.error.flatten().fieldErrors });

      return;
    }

    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    const { message, roomId } = validation.data;

    const member = await prisma.roomMember.findUnique({
      where: { userId_roomId: { userId, roomId } },
    });

    if (!member) {
      res
        .status(403)
        .json({ message: "You must join the room to send messages" });
      return;
    }

    const chat = await prisma.chat.create({
      data: {
        roomId,
        userId,
        message,
      },
      include: {
        user: { select: { name: true, photo: true } }, // Include sender details for the frontend
      },
    });
    res.status(201).json({ success: true, chat });
    return;
  } catch (error) {
    console.error("Failed to send message:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const getChatsSchema = z.object({
  roomId: z.string().uuid("Invalid Room ID"),
});

export const getChats = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const validation = getChatsSchema.safeParse(req.params);

    if (!validation.success) {
      res.status(400).json({ errors: validation.error.flatten().fieldErrors });
      return;
    }

    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { roomId } = validation.data;

    // 1. Verify membership
    const member = await prisma.roomMember.findUnique({
      where: { userId_roomId: { userId, roomId } },
    });

    if (!member) {
      res.status(403).json({ message: "You must join the room to view chats" });

      return;
    }

    const chats = await prisma.chat.findMany({
      where: { roomId },
      include: {
        user: { select: { id: true, name: true, photo: true } },
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    res.status(200).json({ success: true, chats });
    return;
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
