import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import {
  getLots,
  getLotById,
  createLot,
  updateLot,
  deleteLot
} from "../controllers/lotController.js";

const router = express.Router();

// Public routes
router.get("/", getLots);
router.get("/:id", getLotById);

// Admin routes
router.post("/", requireAdmin, createLot);
router.put("/:id", requireAdmin, updateLot);
router.delete("/:id", requireAdmin, deleteLot);

export default router;
