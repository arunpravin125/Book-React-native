import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouters } from "./Routes/authRoutes.js";
import { connectDB } from "./database/db.js";
import { bookRoutes } from "./Routes/bookRoutes.js";
import job from "./lib/cron.js";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
const PORT = process.env.PORT || 3001;

// every 14 min send api call on render
job.start();

app.use("/api/auth/", authRouters);
app.use("/api/books/", bookRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server sarted:", PORT);
});
