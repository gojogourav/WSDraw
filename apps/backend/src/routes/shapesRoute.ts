import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  create,
  deleteShape,
  updateShape,
} from "../controllers/shapeController";

const shapeRouter = Router();

shapeRouter.post("/", authMiddleware, create);
shapeRouter.put("/:id", authMiddleware, updateShape);
shapeRouter.delete("/:id", authMiddleware, deleteShape);

export default shapeRouter;
