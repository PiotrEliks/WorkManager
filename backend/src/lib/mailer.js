import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

async function sendEmail(to, subject, text) {
    try {
      await transporter.sendMail({
        from: `"WorkManager" <${process.env.NODEMAILER_EMAIL}>`,
        to,
        subject,
        text,
      });
    } catch (error) {
      console.error("Error sending email:", error);
    }
};

export { sendEmail };