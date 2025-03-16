import express from "express";
import { addUser, deleteUser, getUsers, updateUser } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", protectRoute, addUser);
router.get("/all", protectRoute, getUsers);
router.delete("/:userId/delete", protectRoute, deleteUser);
router.put("/:userId/update", protectRoute, updateUser);

export default router;