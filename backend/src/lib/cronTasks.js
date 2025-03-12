import cron from "node-cron";
import Meter from "../models/meter.model.js";
import { Sequelize, Op } from "sequelize";
import { sendEmail } from "./mailer.js";

cron.schedule("0 7 * * *", async () => {
  try {
    const meters = await Meter.findAll({
      where: {
        [Op.or]: [
          { inspectionExpiryDate: { [Op.eq]: Sequelize.literal("CURRENT_DATE + INTERVAL '1 day'") }},
          { nextInspectionDate: { [Op.eq]: Sequelize.literal("CURRENT_DATE + INTERVAL '1 day'") }}
        ]
      }
    });

    meters.forEach(device => {
      sendEmail(
        'piotr.eliks@wp.pl',
        `${device.name} - Zbliża się termin przeglądu`,
        `Zbliża się termin przeglądu dla urządzenia: ${device.name}`
      );
    });
  } catch (error) {
    console.error("Error in cron.schedule: ", error);
  }
}, {
  timezone: "Europe/Warsaw",
});
