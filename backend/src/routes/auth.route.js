import express from "express";
import { login, logout, checkAuth, changePassword } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/check", protectRoute, checkAuth);
router.put("/:userId", protectRoute, changePassword);

export default router;