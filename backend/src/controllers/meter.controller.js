import Meter from "../models/meter.model.js";
import { addMonths, parseISO, parse, isValid } from 'date-fns';

export const getMeters = async (req, res) => {
    try {

        const meters = await Meter.findAll({
            order: [['updatedAt', 'DESC']]
        });

        return res.status(200).json(meters);
    } catch (error) {
        console.error("Error in getMeters: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const addMeter = async (req, res) => {
    try {
        const { type, number, producer, comments, checkdate, nextcheckin, condition, editedBy } = req.body;

        const existingMeter = await Meter.findOne({
            where: {
                number: number,
                type: type
            }
        });

        if (existingMeter) {
            return res.status(400).json({ message: "Miernik już isnieje" });
        }

        let checkDateObj = parse(checkdate, 'dd.MM.yyyy', new Date());
        if (!isValid(checkDateObj)) {
          checkDateObj = parseISO(checkdate);
          if (!isValid(checkDateObj)) {
            return res.status(400).json({ message: "Niepoprawna data sprawdzenia" });
          }
        }

        const months = Number(nextcheckin);

        const nextCheckDate = isValid(checkDateObj) && !isNaN(months)
          ? addMonths(checkDateObj, months)
          : null;

        const newMeter = await Meter.create({
            type,
            number,
            producer,
            comments,
            checkdate: checkDateObj,
            nextcheckdate: nextCheckDate,
            nextcheckin,
            condition,
            editedBy,
        });

        const meters = await Meter.findAll({
            order: [['updatedAt', 'DESC']]
        });

        return res.status(200).json(meters);
    } catch (error) {
        console.error("Error in addMeter: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const deleteMeter = async (req, res) => {
    try {
        const { meterId } = req.params;

        await Meter.destroy({
            where: {
                id: meterId,
            }
        });

        const meters = await Meter.findAll({
            order: [['updatedAt', 'DESC']]
        });

        return res.status(200).json(meters);
    } catch (error) {
        console.error("Error in deleteMeter: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}

export const updateMeter = async (req, res) => {
    try {
        const { meterId } = req.params;
        const { type, number, producer, comments, checkdate, nextcheckin, condition, editedBy } = req.body;

        const existing = await Meter.findByPk(meterId);
        if (!existing) {
          return res.status(404).json({ message: "Nie znaleziono miernika" });
        }

        let checkDateObj = existing.checkdate;
        if (checkdate !== undefined) {
          let parsed = parse(checkdate, 'dd.MM.yyyy', new Date());
          if (!isValid(parsed)) {
            parsed = parseISO(checkdate);
          }
          if (!isValid(parsed)) {
            return res.status(400).json({ message: "Niepoprawna data sprawdzenia" });
          }
          checkDateObj = parsed;
        }

        let months = existing.nextcheckin;
        if (nextcheckin !== undefined) {
          const asNum = Number(nextcheckin);
          months = isNaN(asNum) ? null : asNum;
        }

        const nextCheckDate = (
          isValid(checkDateObj) &&
          typeof months === 'number'
        ) ? addMonths(checkDateObj, months) : null;

        const updatedData = {
          type:      type       !== undefined ? type       : existing.type,
          number:    number     !== undefined ? number     : existing.number,
          producer:  producer   !== undefined ? producer   : existing.producer,
          comments:  comments   !== undefined ? comments   : existing.comments,
          checkdate: checkdate  !== undefined ? checkDateObj : existing.checkdate,
          nextcheckin: months,
          nextcheckdate: nextCheckDate,
          condition: condition  !== undefined ? condition  : existing.condition,
          editedBy:  editedBy   !== undefined ? editedBy   : existing.editedBy,
        };

        const meter = await Meter.update(updatedData, {
            where: {
                id: meterId,
            }
        });

        const meters = await Meter.findAll({
            order: [['updatedAt', 'DESC']]
        });

        return res.status(200).json(meters);
    } catch (error) {
        console.error("Error in updateMeter: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const getMeter = async (req, res) => {
    try {
        const { meterId } = req.params;

        const meter = await Meter.findOne({
            where: {
                id: meterId,
            }
        });

        if (!meter) {
            return res.status(404).json({ message: "Nie znaleziono miernika" });
        }

        return res.status(200).json(meter);
    } catch (error) {
        console.error("Error in getMeter: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};