import Category from "../models/Category.js";

/* ---------- GET CATEGORIES ---------- */
export const getCategories = async (req, res) => {
  const categories = await Category.find({ userId: req.user._id }).sort({
    name: 1,
  });

  res.status(200).json(categories);
};

/* ---------- CREATE CATEGORY ---------- */
export const createCategory = async (req, res) => {
  const { name, type, icon, color } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: "Name and type are required" });
  }

  try {
    const category = await Category.create({
      userId: req.user._id,
      name,
      type,
      icon,
      color,
    });
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res
        .status(400)
        .json({ message: "Category with this name already exists." });
    }
    console.error("Failed to create category:", err);
    res.status(500).json({ message: "Failed to create category." });
  }
};
