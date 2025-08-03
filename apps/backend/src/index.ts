import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRouter  from "./routes/authRouts";
import roomRouter from "./routes/roomRouts";

const PORT = process.env.PORT||5000;


const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());



app.use("/auth",authRouter);
app.use("/room",roomRouter);




app.get('/',(req:Request,res:Response)=>{
    res.send("Hello from backend");
})

app.listen(PORT,()=>{
  console.log(`Server running on http://localhost:${PORT}`);
    
})