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

const app = express();

dotenv.config();
const PORT = process.env.PORT;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meters", meterRoutes);
app.use("/api/protectiveEquipment", ProtectiveEquipmentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    connectDB();
});