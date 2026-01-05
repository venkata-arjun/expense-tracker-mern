import express from "express";
import {
  getMonthlySummary,
  getCategoryBreakdown,
  getCategoryBreakdownAll,
} from "../controllers/analyticsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/summary", getMonthlySummary);
router.get("/categories", getCategoryBreakdown);
router.get("/categories/all", getCategoryBreakdownAll);

export default router;
