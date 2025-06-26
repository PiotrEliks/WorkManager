import express from "express";
import { addEq, getEq, deleteEq, updateEq, getEqById } from "../controllers/protectiveEquipment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", protectRoute, addEq);
router.get("/all", protectRoute, getEq);
router.get("/eq/:eqId", protectRoute, getEqById)
router.delete("/:eqId/delete", protectRoute, deleteEq);
router.put("/:eqId/update", protectRoute, updateEq);

export default router;