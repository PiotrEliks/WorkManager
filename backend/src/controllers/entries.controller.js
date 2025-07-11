import Entry from '../models/entry.model.js';

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