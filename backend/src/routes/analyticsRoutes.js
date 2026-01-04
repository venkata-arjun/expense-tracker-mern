import express from "express";
import {
  getMonthlySummary,
  getCategoryBreakdown,
} from "../controllers/analyticsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/summary", getMonthlySummary);
router.get("/categories", getCategoryBreakdown);

export default router;
