import { z } from "zod";
import { AuthRequest } from "../middleware/authMiddleware";
import { getUserId, slugSchema } from "./roomController";
import { Response } from "express";
import { prisma } from "../prisma";
import { Prisma } from "../../generated/prisma";

// const getSlugId = (req: AuthRequest): string | null => {};

export const shapeSchema = z.object({
  roomId: z.string().uuid("Invalid Room ID"),
  type: z.enum([
    "RECTANGLE",
    "CIRCLE",
    "LINE",
    "FREEHAND",
    "TEXT",
    "IMAGE",
    "ARROW",
  ]),
  x1: z.float64(),
  y1: z.float64(),
  x2: z.float64(),
  y2: z.float64(),
  radius: z.float64().nullable().default(null),
  points: z.any().nullable().default(null),
  color: z.string().default("#000000"),
  width: z.number().default(2),
  text: z.string().nullable().default(null),
  fontFamily: z.string().nullable().default(null),
  imageUrl: z.string().nullable().default(null),
  layer: z.enum(["STUDENT", "TEACHER"]).default("STUDENT"),
  sequence: z.number(),
});

export const create = async (req: AuthRequest, res: Response) => {
  const validation = shapeSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ errors: validation.error.flatten().fieldErrors });
    return;
  }

  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const { roomId, ...shapeData } = validation.data;

  try {
    const member = await prisma.roomMember.findUnique({
      where: {
        userId_roomId: { userId, roomId },
      },
    });

    if (!member) {
      return res
        .status(403)
        .json({ message: "You are not a member of this room" });
    }

    if (!member.canDraw) {
      return res
        .status(403)
        .json({ message: "You don't have permission to draw" });
    }

    const shape = await prisma.shape.create({
      data: {
        roomId,
        userId,
        ...shapeData,
      },
    });

    return res.status(201).json({
      message: "Shape created successfully",
      shape,
    });
  } catch (error) {
    console.error("Failed to create shape:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while creating shape" });
  }
};

export const getShapesSchema = z.object({
  roomId: z.string().uuid("Invalid Room ID"),
});

export const get = async (req: AuthRequest, res: Response) => {
  const validation = getShapesSchema.safeParse(req.body);

  if (!validation.success) {
    return res
      .status(400)
      .json({ errors: validation.error.flatten().fieldErrors });
  }

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const { roomId } = validation.data;

  try {
    const member = await prisma.roomMember.findUnique({
      where: {
        userId_roomId: { userId, roomId },
      },
    });

    if (!member) {
      return res
        .status(403)
        .json({ message: "You are not a member of this room" });
    }

    const shapes = await prisma.shape.findMany({
      where: { roomId: roomId },

      orderBy: { sequence: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch room shapes:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while fetching shapes" });
  }
};

export const updateShapeSchema = shapeSchema.partial().omit({
  roomId: true,
  type: true,
});

//
//
// UPDATE THE SHAPE
//
//

export const updateShape = async (req: AuthRequest, res: Response) => {
  const { shapeId } = req.params;
  const validation = updateShapeSchema.safeParse(req.body);

  if (!validation.success) {
    return res
      .status(400)
      .json({ errors: validation.error.flatten().fieldErrors });
  }

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const shape = await prisma.shape.findUnique({
      where: { id: shapeId },
    });

    if (!shape) {
      return res.status(404).json({ message: "Shape not found" });
    }

    const member = await prisma.roomMember.findUnique({
      where: { userId_roomId: { userId, roomId: shape.roomId } },
    });

    if (!member || !member.canDraw) {
      return res
        .status(403)
        .json({ message: "You don't have permission to edit this room" });
    }

    const updatedShape = await prisma.shape.update({
      where: { id: shapeId },
      data: validation.data as Prisma.ShapeUpdateInput,
    });

    return res.status(200).json({
      message: "Shape updated successfully",
      shape: updatedShape,
    });
  } catch (error) {
    console.error("Failed to update shape:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while updating shape" });
  }
};

//
//SOFT DELETING THA SHAPES
//
//
//
export const deleteShape = async (req: AuthRequest, res: Response) => {
  const { shapeId } = req.params;
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const shape = await prisma.shape.findUnique({
      where: { id: shapeId },
    });

    if (!shape) {
      return res.status(404).json({ message: "Shape not found" });
    }

    const member = await prisma.roomMember.findUnique({
      where: { userId_roomId: { userId, roomId: shape.roomId } },
    });

    if (!member) {
      return res
        .status(403)
        .json({ message: "You don't have permission to modify this room" });
    }

    const deletedShape = await prisma.shape.update({
      where: { id: shapeId },
      data: { deletedAt: new Date() },
    });

    return res.status(200).json({
      message: "Shape deleted successfully",
      shape: deletedShape,
    });
  } catch (error) {
    console.error("Failed to delete shape:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while deleting shape" });
  }
};
