import cron from "node-cron";
import addDays from "date-fns/addDays";
import format from "date-fns/format";
import Meter from "../models/meter.model.js";
import ProtectiveEquipment from "../models/protectiveEquipment.model.js";
import User from "../models/users.model.js";
import { sendEmail } from "./mailer.js";

const ENTITIES = [
  {
    model: Meter,
    templateSubject: "Zbliża się termin przeglądu miernika",
    mapRow: ({ type, number, producer, checkDate, nextCheckDate }) => ({
      name1: type,
      name2: number,
      name3: producer,
      checkDate,
      nextCheckDate,
    }),
  },
  {
    model: ProtectiveEquipment,
    templateSubject: "Zbliża się termin przeglądu sprzętu ochronnego",
    mapRow: ({ name, factoryNumber, protocolNumber, checkDate, nextCheckDate }) => ({
      name1: name,
      name2: factoryNumber,
      name3: protocolNumber,
      checkDate,
      nextCheckDate,
    }),
  },
];

cron.schedule(
  "0 7 * * *",
  async () => {
    try {
      const targetDate = format(addDays(new Date(), 7), "yyyy-MM-dd");
      
      const admins = await User.findAll({
        where: { role: "administrator" },
        attributes: ["email"],
      });
      const emails = admins.map(u => u.email);
      if (emails.length === 0) {
        console.warn("No admin emails found — skipping notifications.");
        return;
      }
      
      for (const { model, templateSubject, mapRow } of ENTITIES) {
        const items = await model.findAll({
          where: { nextCheckDate: targetDate },
        });
        
        if (!items.length) continue;
        
        for (const row of items) {
          const data = mapRow(row);
          await sendEmail(emails, templateSubject, data);
        }
      }
    } catch (err) {
      console.error("Error in scheduled check:", err);
    }
  },
  {
    timezone: "Europe/Warsaw",
  }
);
