import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import Permission from "../models/permission.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided"} );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Token Invalid"} );
    }

    const user = await User.findOne({
      where: {
        id: decoded.userId
      },
      attributes: { exclude: ['password'] },
      include: { model: Permission },
    });

    if (!user) {
      return res.status(404).json({ message: "Nie znaleziono użytkownika"} );
    }

    req.user = user;
    next();

  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};