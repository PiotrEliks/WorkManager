import express from "express";
import { addEq, getEq, deleteEq, updateEq, getEqById } from "../controllers/protectiveEquipment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, addEq);
router.get("/", protectRoute, getEq);
router.get("/:eqId", protectRoute, getEqById)
router.delete("/:eqId", protectRoute, deleteEq);
router.put("/:eqId", protectRoute, updateEq);

export default router;