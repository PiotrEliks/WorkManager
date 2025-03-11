import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
    try {

        const users = await User.findAll({
            order: [['updatedAt', 'DESC']]
        });

        return res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUsers: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const addUser = async (req, res) => {
    try {
        const { fullName, email, role } = req.body;

        const password = "123456";
        console.log(fullName, email, role, password)

        const existingUser = await User.findOne({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role
        });

        const users = await User.findAll({
            order: [['updatedAt', 'DESC']]
        });

        return res.status(200).json(users);
    } catch (error) {
        console.error("Error in addUser: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId)

        await User.destroy({
            where: {
                id: userId,
            }
        });

        const users = await User.findAll({
            order: [['updatedAt', 'DESC']]
        });

        return res.status(200).json(users);
    } catch (error) {
        console.error("Error in deleteUser: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}

export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { fullName, email, role } = req.body;

        const updatedData = {};
        if (fullName) updatedData.fullName = fullName;
        if (email) updatedData.email = email;
        if (role) updatedData.role = role;

        const user = await User.update(updatedData, {
            where: {
                id: userId,
            }
        });

        const users = await User.findAll({
            order: [['updatedAt', 'DESC']]
        });

        return res.status(200).json(users);
    } catch (error) {
        console.error("Error in updateUser: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};