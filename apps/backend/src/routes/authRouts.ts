import * as express from "express";
import { getMe, loginUser } from "../controllers/authController";
import { registerUser } from "../controllers/authController";
const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/signup", registerUser);
authRouter.get("/me", getMe);

// authRouter.post("/logout",logou);

export default authRouter;
