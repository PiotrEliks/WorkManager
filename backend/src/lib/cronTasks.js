import cron from "node-cron";
import Meter from "../models/meter.model.js";
import ProtectiveEquipment from "../models/protectiveEquipment.model.js";
import { Sequelize, Op } from "sequelize";
import { sendEmail } from "./mailer.js";
import User from "../models/users.model.js";

cron.schedule("0 7 * * *", async () => {
  try {
    const meters = await Meter.findAll({
      where: {
        [Op.or]: [
        //  { checkdate: { [Op.eq]: Sequelize.literal("CURRENT_DATE + INTERVAL '7 days'") }},
          { nextcheckdate: { [Op.eq]: Sequelize.literal("CURRENT_DATE + INTERVAL '7 days'") }}
        ]
      }
    });

    const equipment = await ProtectiveEquipment.findAll({
      where: {
        [Op.or]: [
        //  { checkDate: { [Op.eq]: Sequelize.literal("CURRENT_DATE + INTERVAL '7 days'") }},
          { nextCheckDate: { [Op.eq]: Sequelize.literal("CURRENT_DATE + INTERVAL '7 days'") }}
        ]
      }
    });

    const users = await User.findAll({
      where: {
        role: 'administrator'
      },
      attributes: ['email']
    });

    const emails = users.map(row => row.email);

    meters.forEach(meter => {
      const emailData = {
        name1: meter.type,
        name2: meter.number,
        name3: meter.producer,
        checkDate: meter.checkdate,
        nextCheckDate: meter.nextcheckdate
      };
      sendEmail(
        emails,
        `Zbliża się termin przeglądu miernika`,
        emailData
      );
    });

    equipment.forEach(eq => {
      const emailData = {
        name1: eq.name,
        name2: eq.factoryNumber,
        name3: eq.protocolNumber,
        checkDate: eq.checkDate,
        nextCheckDate: eq.nextCheckDate
      };
      sendEmail(
        emails,
        `Zbliża się termin przeglądu sprzętu ochronnego`,
        emailData
      );
    });
  } catch (error) {
    console.error("Error in cron.schedule: ", error);
  }
}, {
  timezone: "Europe/Warsaw",
});
