import ProtectiveEquipment from "../models/protectiveEquipment.model.js";

export const getEq = async (req, res) => {
    try {

        const equipment = await ProtectiveEquipment.findAll({
            order: [['updatedAt', 'DESC']]
        });

        return res.status(200).json(equipment);
    } catch (error) {
        console.error("Error in getEq: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const addEq = async (req, res) => {
    try {
        const { name, factoryNumber, protocolNumber, checkDate, nextCheckDate, comments, editedBy } = req.body;

        const existingEquipment = await ProtectiveEquipment.findOne({
            where: {
              factoryNumber: factoryNumber
            }
        });

        if (existingEquipment) {
            return res.status(400).json({ message: "Equipment already exists" });
        }

        const newEq = await ProtectiveEquipment.create({
            name,
            factoryNumber,
            protocolNumber,
            checkDate,
            nextCheckDate,
            comments,
            editedBy,
        });

        const equipment = await ProtectiveEquipment.findAll({
            order: [['updatedAt', 'DESC']]
        });

        return res.status(200).json(equipment);
    } catch (error) {
        console.error("Error in addMeter: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const deleteEq = async (req, res) => {
    try {
        const { eqId } = req.params;

        await ProtectiveEquipment.destroy({
            where: {
                id: eqId,
            }
        });

        const equipment = await ProtectiveEquipment.findAll({
            order: [['updatedAt', 'DESC']]
        });

        return res.status(200).json(equipment);
    } catch (error) {
        console.error("Error in deleteEq: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}

export const updateEq = async (req, res) => {
    try {
        const { eqId } = req.params;
        const { name, factoryNumber, protocolNumber, checkDate, nextCheckDate, comments, editedBy } = req.body;

        const updatedData = {};
        if (name) updatedData.name = name;
        if (factoryNumber) updatedData.factoryNumber = factoryNumber;
        if (protocolNumber) updatedData.protocolNumber = protocolNumber;
        if (checkDate) updatedData.checkDate = checkDate;
        if (nextCheckDate) updatedData.nextCheckDate = nextCheckDate;
        if (comments) updatedData.comments = comments;
        if (editedBy) updatedData.editedBy = editedBy;

        const eq = await ProtectiveEquipment.update(updatedData, {
            where: {
                id: eqId,
            }
        });

        const equipment = await ProtectiveEquipment.findAll({
            order: [['updatedAt', 'DESC']]
        });

        return res.status(200).json(equipment);
    } catch (error) {
        console.error("Error in updateEq: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};