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
    const templatePath = path.join(__dirname, "emailReminderTemplate.html");
    let template = fs.readFileSync(templatePath, "utf-8");

    const headersHtml = data.headers.map(h => `<th style="padding: 10px; border: 1px solid #ddd;">${h}</th>`).join("");
    const rowsHtml = data.rows.map(row => `
      <tr>${row.map(cell => `<td style="padding: 10px; border: 1px solid #ddd;">${cell}</td>`).join("")}</tr>
    `).join("");

    template = template.replace(/{{subject}}/g, subject);
    template = template.replace(/{{targetDate}}/g, data.targetDate);
    template = template.replace(/{{headers}}/g, headersHtml);
    template = template.replace(/{{rows}}/g, rowsHtml);

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
