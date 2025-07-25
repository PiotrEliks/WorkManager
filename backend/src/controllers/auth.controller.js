import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import Permission from "../models/permission.model.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: {
                email: email,
            },
            include: { model: Permission },
        });

        if (!user) {
           return res.status(404).json({ message: "Nie znaleziono użytkownika"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Nie prawidłowe dane logowania" });
        }

        generateToken(user.id, res);

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in login: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        res.status(200).json({ message: "Wylogowano" });
    } catch (error) {
        console.error("Error in logout: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.error("Error in checkAuth controller", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  export const changePassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const { password } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Hasło musi mieć przynajmniej 8 znaków' });
        }

        const hasLowerCase = /[a-z]/.test(password);
        if (!hasLowerCase) {
            return res.status(400).json({ message: 'Hasło musi mieć przynajmniej jedną małą literę' });
        }

        const hasUpperCase = /[A-Z]/.test(password);
        if (!hasUpperCase) {
            return res.status(400).json({ message: 'Hasło mus mieć przynajmniej jedną wielką literę' });
        }

        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        if (!hasSpecialChar) {
            return res.status(400).json({ message: 'Hasło musi mieć przynajmniej jeden znak specjalny' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await user.update({
            password: hashedPassword,
            changedDefaultPassword: true
        });

        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: Permission
        });

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in changePassword: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: Permission
    });
    if (!user) {
      return res.status(404).json({ error: "Nie znaleziono użytkownika" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getMe:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};