import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./database";
import authRoutes from "./routes/auth";
import boardRoutes from "./routes/boards";
import listsRoutes from "./routes/lists";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/boards", boardRoutes);
app.use("/boards/:boardId/lists", listsRoutes);

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    app.listen(3333, () => {
      console.log("Server running on port 3333");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
