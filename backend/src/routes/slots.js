import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import {
  getSlots,
  getAvailability,
  getSlotById,
  createSlot,
  updateSlot,
  toggleSlot,
  deleteSlot
} from "../controllers/slotController.js";

const router = express.Router();

// Public routes
router.get("/", getSlots);
router.get("/availability", getAvailability);
router.get("/:id", getSlotById);

// Admin routes
router.post("/", requireAdmin, createSlot);
router.put("/:id", requireAdmin, updateSlot);
router.patch("/:id/toggle", requireAdmin, toggleSlot);
router.delete("/:id", requireAdmin, deleteSlot);

export default router;
