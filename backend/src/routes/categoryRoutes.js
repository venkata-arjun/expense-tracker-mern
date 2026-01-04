import express from "express";
import {
  getCategories,
  createCategory,
} from "../controllers/categoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getCategories);
router.post("/", createCategory);

export default router;
