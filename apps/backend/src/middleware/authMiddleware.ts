import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

export interface AuthRequest<P = any, ResBody = any, ReqBody = any, ReqQuery = any> extends Request<P, ResBody, ReqBody, ReqQuery> {
    user?: { id: string }
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.access_token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "No authentication token provided" });
            return
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };

        if (!decoded || !decoded.id) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true },
        });

        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(401).json({ message: "Authentication failed" });
        return;
    }
}