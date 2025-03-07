import express from "express";
import { addUser, deleteUser, getUsers, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/user/add", addUser);
router.get("/all", getUsers);
router.delete("/user/delete/:userId", deleteUser);
router.put("/user/update/:userId", updateUser);

export default router;