import User from "../models/User.model.js";

export const addUser = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        console.log(fullName, email, password, role)

        const newUser = await User.create({
            fullName,
            email,
            password,
            role
        });

        res.status(200).json(newUser);
    } catch (error) {
        console.error("Error in addUser: ", error);
        res.status(500).json({ message: "Internal Server Error"});
    }
};