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
            include: Permission,
        });

        if (!user) {
           return res.status(404).json({ message: "User not found"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user.id, res);

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in login: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  export const changePassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const { password } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        const hasLowerCase = /[a-z]/.test(password);
        if (!hasLowerCase) {
            return res.status(400).json({ message: 'Password must have at least one small letter' });
        }

        const hasUpperCase = /[A-Z]/.test(password);
        if (!hasUpperCase) {
            return res.status(400).json({ message: 'Password must have at least one capital letter' });
        }

        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        if (!hasSpecialChar) {
            return res.status(400).json({ message: 'Password must have at least one special character' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await user.update({
            password: hashedPassword,
            passwordChanged: true
        });

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error in changePassword: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};