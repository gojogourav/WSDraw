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

const roomRouter = Router();

roomRouter.post("/", authMiddleware, create);
roomRouter.post("/join", authMiddleware, joinRoom);
roomRouter.get("/:slug", getRoomBySlug);

roomRouter.get("/:slug/shapes", authMiddleware, get);

roomRouter.get("/", authMiddleware, getUserRooms);
roomRouter.delete("/:slug/leave", authMiddleware, leaveRoom);

export default roomRouter;
