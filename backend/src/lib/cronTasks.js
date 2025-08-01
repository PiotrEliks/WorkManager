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
    templateSubject: "Zbliża się termin przeglądu mierników",
    mapItems: items => ({
      headers: ["Typ", "Nr.", "Producent", "Data sprawdz.", "Nast. sprawdz."],
      rows: items.map(({ type, number, producer, checkDate, nextCheckDate }) => [
        type,
        number,
        producer,
        checkDate,
        nextCheckDate
      ])
    }),
  },
  {
    model: ProtectiveEquipment,
    templateSubject: "Zbliża się termin przeglądu sprzętu ochronnego",
    mapItems: items => ({
      headers: ["Nazwa", "Nr. fabryczny", "Nr. protokołu", "Data sprawdz.", "Nast. sprawdz."],
      rows: items.map(({ name, factoryNumber, protocolNumber, checkDate, nextCheckDate }) => [
        name,
        factoryNumber,
        protocolNumber,
        checkDate,
        nextCheckDate
      ])
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
      
      for (const { model, templateSubject, mapItems } of ENTITIES) {
        const items = await model.findAll({
          where: { nextCheckDate: targetDate },
        });

        if (!items.length) continue;

        const mapped = mapItems(items);
        if (!mapped || !mapped.rows || !mapped.headers) {
          console.error("mapItems did not return expected structure.");
          continue;
        }

        await sendEmail(emails, templateSubject, {
          ...mapped,
          targetDate
        });
      }
    } catch (err) {
      console.error("Error in scheduled check:", err);
    }
  },
  {
    timezone: "Europe/Warsaw",
  }
);
