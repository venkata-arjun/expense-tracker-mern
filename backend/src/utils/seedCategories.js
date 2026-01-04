import Category from "../models/Category.js";

const DEFAULT_CATEGORIES = [
  { name: "Food", type: "expense" },
  { name: "Rent", type: "expense" },
  { name: "Travel", type: "expense" },
  { name: "Shopping", type: "expense" },
  { name: "Salary", type: "income" },
  { name: "Freelance", type: "income" },
];

export const seedCategoriesForUser = async (userId) => {
  const existing = await Category.find({ userId });
  if (existing.length) return;

  const categories = DEFAULT_CATEGORIES.map((c) => ({
    ...c,
    userId,
  }));

  await Category.insertMany(categories);
};
