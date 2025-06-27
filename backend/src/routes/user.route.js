import express from "express";
import { addUser, deleteUser, getUsers, updateUser } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, addUser);
router.get("/", protectRoute, getUsers);
router.delete("/:userId", protectRoute, deleteUser);
router.put("/:userId", protectRoute, updateUser);

export default router;