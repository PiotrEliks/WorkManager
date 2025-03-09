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
        const { name, editedBy, inspectionExpiryDate, nextInspectionDate } = req.body;

        const existingMeter = await Meter.findOne({
            where: {
                name: name
            }
        });

        if (existingMeter) {
            return res.status(400).json({ message: "Meter already exists" });
        }

        const newMeter = await Meter.create({
            name,
            editedBy,
            inspectionExpiryDate,
            nextInspectionDate
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
        const { name, editedBy, inspectionExpiryDate, nextInspectionDate } = req.body;

        const updatedData = {};
        if (name) updatedData.name = name;
        if (editedBy) updatedData.editedBy = editedBy;
        if (inspectionExpiryDate) updatedData.inspectionExpiryDate = inspectionExpiryDate;
        if (nextInspectionDate) updatedData.nextInspectionDate = nextInspectionDate;

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