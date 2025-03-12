import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import meterRoutes from "./routes/meter.route.js";
import { connectDB } from "./lib/db.js";
import nodemailer from "nodemailer";
import cron from "node-cron";
import Meter from "./models/meter.model.js";
import { Sequelize, Op } from "sequelize";

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

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

async function sendNotificationEmail(meterName, email) {
    try {
        await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: `${meterName} - Zbliża się termin przeglądu`,
            text: "This is a notification from your device",
        });
        console.log("Message sent")
    } catch (error) {
        console.error("Error in sendNotification: ", error);
    }
};

cron.schedule("* * * * *", async () => {
    try {
        const meters = await Meter.findAll({
            where: {
                [Op.or]: [
                    { inspectionExpiryDate: { [Op.eq]: Sequelize.literal(`CURRENT_DATE + INTERVAL '1 day'`) }},
                    { nextInspectionDate: { [Op.eq]: Sequelize.literal(`CURRENT_DATE + INTERVAL '1 day'`) }}
                ]
            }
        });

        meters.forEach(device => {
            sendNotificationEmail(device.name, 'piotr.eliks@wp.pl');
          });
        console.log("Wykonano")
    } catch (error) {
        console.error("Error in cron.schedule: ", error);
    }
}, {
    timezone: "Europe/Warsaw"
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    connectDB();
});