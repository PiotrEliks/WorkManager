import nodemailer from "nodemailer";
import cron from "node-cron";
import Meter from "../models/meter.model.js";
import { Sequelize, Op } from "sequelize";


console.log(process.env.NODEMAILER_EMAIL)
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
                    { inspectionExpiryDate: { [Op.eq]: Sequelize.fn(`CURRENT_DATE + INTERVAL '1 day'`) }},
                    { nextInspectionDate: { [Op.eq]: Sequelize.fn(`CURRENT_DATE + INTERVAL '1 day'`) }}
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