import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import { adminLogin, adminLogout} from "../controllers/adminAuthController.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/logout", requireAdmin, adminLogout);

export default router;
