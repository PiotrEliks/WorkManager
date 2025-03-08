import express from "express";
import { addUser, deleteUser, getUsers, updateUser } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/user/add", protectRoute, addUser);
router.get("/all", protectRoute, getUsers);
router.delete("/user/delete/:userId", protectRoute, deleteUser);
router.put("/user/update/:userId", protectRoute, updateUser);

export default router;