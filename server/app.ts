import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import userRoute from "./routes/user";
import taskRoute from "./routes/task"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, authorization");
  next();
});
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user",userRoute)
app.use("/task", taskRoute);
// MongoDB connection
const connect = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "task-management",
    });
    console.log("Connected to MongoDB server");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

// Server setup
app.listen(PORT, () => {
  connect();
  console.log(`Server started on port ${PORT}`);
});
