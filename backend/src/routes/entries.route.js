import express from "express";
import { getUserEntries, registerEntry } from "../controllers/entries.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:userId", protectRoute, getUserEntries);
router.post("/", registerEntry);

export default router;