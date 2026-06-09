import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRouter from "./routes/authRouts";
import roomRouter from "./routes/roomRouts";
import cookieParser from "cookie-parser";
const PORT = process.env.PORT || 3001;

const app = express();
dotenv.config();
app.use(cookieParser());
// app.use(cors());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/auth", authRouter);
app.use("/room", roomRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from backend");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
