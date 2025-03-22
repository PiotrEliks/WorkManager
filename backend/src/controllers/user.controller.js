import Permission from "../models/permission.model.js";
import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import UserPermissions from '../models/userPermissions.model.js';
import { sendWelcomeEmail } from "../lib/mailer.js";
import { randomBytes } from 'crypto';

export const getUsers = async (req, res) => {
    try {

        const users = await User.findAll({
            include: Permission,
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
        const { fullName, email, role, permissions } = req.body;


        function generateRandomPassword(length = 12) {
            return randomBytes(length).toString('hex').slice(0, length);
        }

        const password = generateRandomPassword(12);

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

        if (permissions && permissions.length > 0) {
            const userPermissions = await Permission.findAll({
                where: {
                    id: permissions,
                }
            });
            await newUser.setPermissions(userPermissions);
        }

        const users = await User.findAll({
            include: Permission,
            order: [['updatedAt', 'DESC']]
        });

        sendWelcomeEmail(
            email,
            "Witaj w panelu elektropomiar.net.pl",
            fullName,
            password
        );

        return res.status(200).json(users);
    } catch (error) {
        console.error("Error in addUser: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        await UserPermissions.destroy({
            where: {
                user_id: userId
            }
        });

        await User.destroy({
            where: {
                id: userId,
            }
        });

        const users = await User.findAll({
            include: Permission,
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
        const { fullName, email, role, permissions } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedData = {};
        if (fullName) updatedData.fullName = fullName;
        if (email) updatedData.email = email;
        if (role) updatedData.role = role;

        await user.update(updatedData);

        if (permissions && permissions.length > 0) {
            const userPermissions = await Permission.findAll({
                where: {
                    id: permissions,
                }
            });

            if (userPermissions.length === 0) {
                return res.status(400).json({ message: 'Invalid permissions provided' });
            }
            await user.setPermissions(userPermissions);
        }

        const users = await User.findAll({
            include: Permission,
            order: [['updatedAt', 'DESC']]
        });

        return res.status(200).json(users);
    } catch (error) {
        console.error("Error in updateUser: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};