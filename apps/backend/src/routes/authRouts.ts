import * as express from "express";
import { loginUser } from "../controllers/authController";
import { registerUser } from "../controllers/authController";
const authRouter = express.Router();


authRouter.post("/login",loginUser);
authRouter.post("/register",registerUser);
authRouter.post("/logout");


export default authRouter;