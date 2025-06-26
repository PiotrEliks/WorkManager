import Meter from "../models/meter.model.js";

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
            return res.status(400).json({ message: "Meter already exists" });
        }

        const newMeter = await Meter.create({
            type,
            number,
            producer,
            comments,
            checkdate,
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

        const updatedData = {};
        if (type) updatedData.type = type;
        if (number) updatedData.number = number;
        if (producer) updatedData.producer = producer;
        if (comments || comments === null) updatedData.comments = comments;
        if (checkdate) updatedData.checkdate = checkdate;
        if (nextcheckin) updatedData.nextcheckin = nextcheckin;
        if (condition || condition === null) updatedData.condition = condition;
        if (editedBy) updatedData.editedBy = editedBy;

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
            return res.status(404).json({ message: "Meter not found" });
        }

        return res.status(200).json(meter);
    } catch (error) {
        console.error("Error in getMeter: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};