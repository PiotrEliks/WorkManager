import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

async function sendEmail(to, subject, data) {
  try {
    const templatePath = path.join(__dirname, "emailTemplate.html");
    let template = fs.readFileSync(templatePath, "utf-8");

    template = template.replace("{{name1}}", data.name1);
    template = template.replace("{{name2}}", data.name2);
    template = template.replace("{{name3}}", data.name3);
    template = template.replace("{{checkDate}}", data.checkDate);
    template = template.replace("{{nextCheckDate}}", data.nextCheckDate);

    await transporter.sendMail({
      from: `"Panel elektropomiar.net.pl" <${process.env.NODEMAILER_EMAIL}>`,
      to,
      subject,
      html: template,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function sendWelcomeEmail(to, subject, fullName, password) {
  try {
    const templatePath = path.join(__dirname, "emailWelcomeTemplate.html");
    let template = fs.readFileSync(templatePath, "utf-8");

    template = template.replace(/{{fullName}}/g, fullName);
    template = template.replace(/{{email}}/g, to);
    template = template.replace(/{{subject}}/g, subject);
    template = template.replace(/{{password}}/g, password);
    await transporter.sendMail({
      from: `"Panel elektropomiar.net.pl" <${process.env.NODEMAILER_EMAIL}>`,
      to,
      subject,
      html: template,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export { sendEmail, sendWelcomeEmail };
