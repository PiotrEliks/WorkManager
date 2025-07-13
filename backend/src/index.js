import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import meterRoutes from "./routes/meter.route.js";
import ProtectiveEquipmentRoutes from "./routes/protectiveEquipment.route.js";
import entriesRoutes from "./routes/entries.route.js";
//import { connectDB } from "./lib/db.js";
import "./lib/cronTasks.js"
import path from 'path';
import { syncDb } from './models/index.js';

const app = express();

dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["https://panel.elektropomiar.net.pl"],
    default: "https://panel.elektropomiar.net.pl",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meters", meterRoutes);
app.use("/api/protectiveEquipment", ProtectiveEquipmentRoutes);
app.use("/api/entries", entriesRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    syncDb();
});