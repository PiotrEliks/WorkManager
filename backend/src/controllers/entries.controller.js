import Entry from '../models/entry.model.js';
import User from "../models/users.model.js";
import { Op } from 'sequelize';

export const getUserEntries = async (req, res) => {
    try {
        const { userId } = req.params;

        const entry = await Entry.findAll({
            where: {
                userId: userId,
            },
            order: [['timestamp', 'DESC']],
        });

        if (!entry) {
            return res.status(404).json({ message: "Nie znaleziono pracownika" });
        }

        return res.status(200).json(entry);
    } catch (error) {
        console.error("Error in getUserEntries: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const registerEntry = async (req, res) => {
  try {
    const { cardId } = req.body;
    console.log("Received cardId:", cardId);

    if (!cardId) {
      return res.status(400).json({ message: "Brak identyfikatora karty" });
    }

    const user = await User.findOne({ where: { cardId } });
    console.log("Found user:", user);

    if (!user) {
      return res.status(404).json({ message: "Nie znaleziono użytkownika z tą kartą" });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const lastEntry = await Entry.findOne({
      where: {
        userId: user.id,
        timestamp: {
          [Op.between]: [todayStart, todayEnd]
        }
      },
      order: [['timestamp', 'DESC']]
    });

    let type;
    if (!lastEntry || lastEntry.type === 'exit') {
      type = 'entry';
    } else {
      type = 'exit';
    }

    const newEntry = await Entry.create({
      userId: user.id,
      type
    });

    return res.status(201).json({
      message: `Zarejestrowano ${type === 'entry' ? 'wejście' : 'wyjście'}`,
      user: `${user.fullName}`,
      type,
      timestamp: newEntry.timestamp
    });

  } catch (error) {
    console.error("Błąd podczas rejestracji odbicia:", error);
    return res.status(500).json({ message: "Błąd serwera" });
  }
};