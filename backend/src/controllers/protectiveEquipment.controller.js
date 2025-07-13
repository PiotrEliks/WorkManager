import ProtectiveEquipment from "../models/protectiveEquipment.model.js";

export const getEq = async (req, res) => {
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
            const equipment = await ProtectiveEquipment.findAll({
                order: [['updatedAt', 'DESC']],
            });
            console.log(equipment)
            return res.status(200).json({ equipment, totalItems: equipment.length });
        }

        const { count, rows } = await ProtectiveEquipment.findAndCountAll({
            order: [['updatedAt', 'DESC']],
            offset,
            limit: pageSize
        });

        return res.status(200).json({
            equipment: rows,
            totalItems: count,
        });
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
            return res.status(400).json({ message: "Sprzęt już istnieje" });
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

        return res.status(201).json(newEq);
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

        return res.status(204).send();
    } catch (error) {
        console.error("Error in deleteEq: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}

export const updateEq = async (req, res) => {
    try {
        const { eqId } = req.params;
        const { name, factoryNumber, protocolNumber, checkDate, nextCheckDate, comments, editedBy } = req.body;

        const existing = await ProtectiveEquipment.findByPk(eqId);
        if (!existing) {
          return res.status(404).json({ message: "Nie znaleziono sprzętu" });
        }

        const updatedData = {};
        if (name) updatedData.name = name;
        if (factoryNumber) updatedData.factoryNumber = factoryNumber;
        if (protocolNumber) updatedData.protocolNumber = protocolNumber;
        if (checkDate) updatedData.checkDate = checkDate;
        if (nextCheckDate) updatedData.nextCheckDate = nextCheckDate;
        if (comments || comments === null) updatedData.comments = comments;
        if (editedBy) updatedData.editedBy = editedBy;

        const eq = await ProtectiveEquipment.update(updatedData, {
            where: {
                id: eqId,
            }
        });

        return res.status(200).json(eq);
    } catch (error) {
        console.error("Error in updateEq: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const getEqById = async (req, res) => {
    try {
        const { eqId } = req.params;

        const eq = await ProtectiveEquipment.findOne({
            where: {
                id: eqId,
            }
        });

        if (!eq) {
            return res.status(404).json({ message: "Nie znaleziono sprzętu" });
        }

        return res.status(200).json(eq);
    } catch (error) {
        console.error("Error in getEqById: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};