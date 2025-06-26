import express from "express";
import { addMeter, getMeters, deleteMeter, updateMeter, getMeter } from "../controllers/meter.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/meter/add", protectRoute, addMeter);
router.get("/all", protectRoute, getMeters);
router.get("/meter/:meterId", protectRoute, getMeter);
router.delete("/meter/delete/:meterId", protectRoute, deleteMeter);
router.put("/meter/update/:meterId", protectRoute, updateMeter);

export default router;