import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import meterRoutes from "./routes/meter.route.js";
import ProtectiveEquipmentRoutes from "./routes/protectiveEquipment.route.js"
import { connectDB } from "./lib/db.js";
import "./lib/cronTasks.js"
import path from 'path';

const app = express();

dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["https://workmanager-xlsf.onrender.com", "http://test.elektropomiar.net.pl"],
    default: "https://workmanager-xlsf.onrender.com",
    //origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meters", meterRoutes);
app.use("/api/protectiveEquipment", ProtectiveEquipmentRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    connectDB();
});