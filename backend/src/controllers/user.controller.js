import Permission from "../models/permission.model.js";
import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "../lib/mailer.js";
import { randomBytes } from "crypto";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: { model: Permission },
      order: [['updatedAt', 'DESC']]
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsers:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addUser = async (req, res) => {
  try {
    const { fullName, email, role, cardId, changedDefaultPassword, Permission: permissions } = req.body;

    function generateRandomPassword(length = 12) {
      return randomBytes(length).toString("hex").slice(0, length);
    }

    const password = generateRandomPassword(12);

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Użytkownik już istnieje" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || "worker",
      cardId: cardId || null,
      changedDefaultPassword: changedDefaultPassword || false
    });

    await Permission.create({
      userId: newUser.id,
      can_read: permissions?.can_read || false,
      can_write: permissions?.can_write || false,
      can_edit: permissions?.can_edit || false,
      can_delete: permissions?.can_delete || false
    });

    sendWelcomeEmail(email, "Witaj w panelu elektropomiar.net.pl", fullName, password);

    const users = await User.findAll({
      include: { model: Permission },
      order: [['updatedAt', 'DESC']]
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in addUser:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await Permission.destroy({ where: { userId } });
    await User.destroy({ where: { id: userId } });

    const users = await User.findAll({
      include: { model: Permission },
      order: [['updatedAt', 'DESC']]
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, email, role, cardId, changedDefaultPassword, Permission: permissions } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Nie znaleziono użytkownika" });
    }

    await user.update({
      fullName,
      email,
      role,
      cardId,
      changedDefaultPassword
    });

    const existingPermissions = await Permission.findOne({ where: { userId } });

    if (existingPermissions) {
      await existingPermissions.update({
        can_read: permissions?.can_read || false,
        can_write: permissions?.can_write || false,
        can_edit: permissions?.can_edit || false,
        can_delete: permissions?.can_delete || false
      });
    } else {
      await Permission.create({
        userId,
        can_read: permissions?.can_read || false,
        can_write: permissions?.can_write || false,
        can_edit: permissions?.can_edit || false,
        can_delete: permissions?.can_delete || false
      });
    }

    const users = await User.findAll({
      include: { model: Permission },
      order: [['updatedAt', 'DESC']]
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in updateUser:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
