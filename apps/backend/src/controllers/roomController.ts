import { Request, Response } from "express";
import { prisma } from "../prisma";
import { AuthRequest } from "../middleware/authMiddleware";

import { z } from "zod";

export const slugSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(30, "Slug must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Slug can only contain letters, numbers, underscores, and hyphens",
    ),
});

export const getUserId = (req: AuthRequest): string | null => {
  const user = req.user as { id: string } | undefined;
  return user?.id || null;
};

export const create = async (req: AuthRequest, res: Response) => {
  const validation = slugSchema.safeParse(req.body);

  if (!validation.success) {
    return res
      .status(400)
      .json({ errors: validation.error.flatten().fieldErrors });
  }

  const slug = validation.data.slug;
  const userId = getUserId(req);

  try {
    if (!slug || !userId) {
      return res.status(400).json({ message: "Slug or user not provided" });
    }
    const existingRoom = await prisma.room.findUnique({ where: { slug } });

    if (existingRoom) {
      return res
        .status(409)
        .json({ message: "Room with this slug already exists" });
    }
    const room = await prisma.room.create({
      data: {
        slug,
        adminId: userId,
        members: {
          create: { userId }, // creator auto-joins
        },
      },
      select: {
        id: true,
        slug: true,
        adminId: true,
        createdAt: true,
        members: {
          select: {
            userId: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Room Created SuccessFully",
      room,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create Room" });
    return;
  }
};

export const joinRoom = async (req: Request, res: Response) => {
  const validation = slugSchema.safeParse(req.body);

  if (!validation.success) {
    return res
      .status(400)
      .json({ errors: validation.error.flatten().fieldErrors });
  }

  const slug = validation.data.slug;
  const userId = getUserId(req);

  try {
    if (!slug || !userId) {
      res.status(400).json({ message: "Slug or user not provided" });
      return;
    }

    const room = await prisma.room.findUnique({ where: { slug } });
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    const existingMember = await prisma.roomMember.findUnique({
      where: {
        userId_roomId: { userId, roomId: room.id },
      },
    });

    if (existingMember) {
      res.status(200).json({ message: "Already a member", room });
      return;
    }

    await prisma.roomMember.create({
      data: { userId, roomId: room.id },
    });

    res.status(200).json({ message: "Joined room successfully", room });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to join the room" });
    return;
  }
};

export const getRoomBySlug = async (req: Request, res: Response) => {
  const validation = slugSchema.safeParse(req.body);

  if (!validation.success) {
    return res
      .status(400)
      .json({ errors: validation.error.flatten().fieldErrors });
  }

  const slug = validation.data.slug;
  try {
    if (!slug || slug.length <= 3) {
      return;
    }
    const room = await prisma.room.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        adminId: true,
        createdAt: true,
        members: {
          select: {
            user: {
              select: { id: true, name: true, email: true, photo: true },
            },
          },
        },
      },
    });

    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    res.status(200).json({ success: true, room });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch room" });
    return;
  }
};

export const getUserRooms = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const rooms = await prisma.roomMember.findMany({
      where: { userId },
      include: {
        room: { select: { id: true, slug: true, createdAt: true } },
      },
    });

    res.status(200).json({ success: true, rooms: rooms.map((r) => r.room) });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rooms" });
    return;
  }
};

export const leaveRoom = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const validation = slugSchema.safeParse(req.body);

  if (!validation.success) {
    return res
      .status(400)
      .json({ errors: validation.error.flatten().fieldErrors });
  }

  const slug = validation.data.slug;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const room = await prisma.room.findUnique({ where: { slug } });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    await prisma.roomMember.deleteMany({
      where: { userId, roomId: room.id },
    });

    return res
      .status(200)
      .json({ success: true, message: "Left the room successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to leave room" });
    return;
  }
};

export const RoomMembers = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const { slug } = req.params;
  const userId = getUserId(req);

  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  try {
  } catch (error) {}
};
