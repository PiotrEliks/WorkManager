import Meter from "../models/meter.model.js";
import { addMonths, parseISO, parse, isValid } from 'date-fns';

export const getMeters = async (req, res) => {
    try {
        let { page = 1, pageSize = 10, fullData = false } = req.query;
        
        page = parseInt(page, 10);
        pageSize = parseInt(pageSize, 10);

        if (isNaN(page) || page < 1) {
            page = 1;
        }
        if (isNaN(pageSize) || pageSize < 1) {
            pageSize = 10;
        }

        const offset = (page - 1) * pageSize;

        if (fullData) {
            const meters = await Meter.findAll({
                order: [['updatedAt', 'DESC']],
            });
            console.log(meters)
            return res.status(200).json({ meters, totalItems: meters.length });
        }

        const { count, rows } = await Meter.findAndCountAll({
            order: [['updatedAt', 'DESC']],
            offset,
            limit: pageSize
        });

        return res.status(200).json({
            meters: rows,
            totalItems: count,
        });
    } catch (error) {
        console.error("Error in getMeters: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const addMeter = async (req, res) => {
    try {
        const { type, number, producer, comments, checkDate, nextCheckIn, condition, editedBy } = req.body;

        const existingMeter = await Meter.findOne({
            where: {
                number: number,
                type: type
            }
        });

        if (existingMeter) {
            return res.status(400).json({ message: "Miernik już isnieje" });
        }

        let checkDateObj = parse(checkDate, 'dd.MM.yyyy', new Date());
        if (!isValid(checkDateObj)) {
          checkDateObj = parseISO(checkDate);
          if (!isValid(checkDateObj)) {
            return res.status(400).json({ message: "Niepoprawna data sprawdzenia" });
          }
        }

        const months = Number(nextCheckIn);

        const nextCheckDate = isValid(checkDateObj) && !isNaN(months)
          ? addMonths(checkDateObj, months)
          : null;

        const newMeter = await Meter.create({
            type,
            number,
            producer,
            comments,
            checkDate: checkDateObj,
            nextCheckDate: nextCheckDate,
            nextCheckIn,
            condition,
            editedBy,
        });

        return res.status(201).json(newMeter);
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

        return res.status(204).send();
    } catch (error) {
        console.error("Error in deleteMeter: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}

export const updateMeter = async (req, res) => {
    try {
        const { meterId } = req.params;
        const { type, number, producer, comments, checkDate, nextCheckIn, condition, editedBy } = req.body;

        const existing = await Meter.findByPk(meterId);
        if (!existing) {
          return res.status(404).json({ message: "Nie znaleziono miernika" });
        }

        let checkDateObj = existing.checkDate;
        if (checkDate !== undefined) {
          let parsed = parse(checkDate, 'dd.MM.yyyy', new Date());
          if (!isValid(parsed)) {
            parsed = parseISO(checkDate);
          }
          if (!isValid(parsed)) {
            return res.status(400).json({ message: "Niepoprawna data sprawdzenia" });
          }
          checkDateObj = parsed;
        }

        let months = existing.nextCheckIn;
        if (nextCheckIn !== undefined) {
          const asNum = Number(nextCheckIn);
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
          checkDate: checkDate  !== undefined ? checkDateObj : existing.checkDate,
          nextCheckIn: months,
          nextCheckDate: nextCheckDate,
          condition: condition  !== undefined ? condition  : existing.condition,
          editedBy:  editedBy   !== undefined ? editedBy   : existing.editedBy,
        };

        const meter = await Meter.update(updatedData, {
            where: {
                id: meterId,
            }
        });

        return res.status(200).json(meter);
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