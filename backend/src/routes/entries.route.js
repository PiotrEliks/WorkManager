import express from "express";
import { getUserEntries } from "../controllers/entries.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:userId", protectRoute, getUserEntries);

export default router;