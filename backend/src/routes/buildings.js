import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import {
  getBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding
} from "../controllers/buildingController.js";

const router = express.Router();

// Public routes
router.get("/", getBuildings);
router.get("/:id", getBuildingById);

// Admin-only routes
router.post("/", requireAdmin, createBuilding);
router.put("/:id", requireAdmin, updateBuilding);
router.delete("/:id", requireAdmin, deleteBuilding);

export default router;
