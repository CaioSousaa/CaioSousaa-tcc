import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./database";
import authRoutes from "./routes/authRoutes";
import boardRoutes from "./routes/boardRoutes";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);

app.listen(3333, () => {
  console.log("Server running on port 3333");
});
