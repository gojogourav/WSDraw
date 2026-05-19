import { Router } from "express";
import {
  create,
  joinRoom,
  getRoomBySlug,
  getUserRooms,
  leaveRoom,
} from "../controllers/roomController";
import { authMiddleware } from "../middleware/authMiddleware";
import shapeRouter from "./shapesRoute";
import { get } from "../controllers/shapeController";
import { createChat, getChats } from "../controllers/chatController";

const chatRouter = Router();

chatRouter.post("/", authMiddleware, createChat);

chatRouter.get("/:roomId", authMiddleware, getChats);

export default chatRouter;
