import express from "express";
import { addMeter, getMeters, deleteMeter, updateMeter, getMeter } from "../controllers/meter.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, addMeter);
router.get("/", protectRoute, getMeters);
router.get("/:meterId", protectRoute, getMeter);
router.delete("/:meterId", protectRoute, deleteMeter);
router.put("/:meterId", protectRoute, updateMeter);

export default router;