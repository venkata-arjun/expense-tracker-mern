import express from "express";
import {
  upsertBudget,
  getBudgets,
  deleteBudget,
} from "../controllers/budgetController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", upsertBudget);
router.get("/", getBudgets);
router.delete("/:id", deleteBudget);

export default router;
