// Delete a budget by id and userId
export const deleteBudget = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const deleted = await Budget.findOneAndDelete({ _id: id, userId });
  if (!deleted) {
    return res.status(404).json({ message: "Budget not found" });
  }
  res.status(200).json({ message: "Budget deleted" });
};
import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";

/* ---------- CREATE / UPDATE BUDGET ---------- */
export const upsertBudget = async (req, res) => {
  const { category, month, year, limit } = req.body;

  if (!category || !month || !year || limit === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const budget = await Budget.findOneAndUpdate(
    {
      userId: req.user._id,
      category,
      month,
      year,
    },
    {
      limit,
    },
    { new: true, upsert: true }
  );

  res.status(200).json(budget);
};

/* ---------- GET BUDGETS WITH USAGE ---------- */
export const getBudgets = async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: "Month and year required" });
  }

  const budgets = await Budget.find({
    userId: req.user._id,
    month,
    year,
  });

  const results = [];

  for (const budget of budgets) {
    const spentAgg = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          category: budget.category,
          type: "expense",
          date: {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const spent = spentAgg[0]?.total || 0;

    results.push({
      ...budget.toObject(),
      spent,
      remaining: Math.max(budget.limit - spent, 0),
      percentUsed:
        budget.limit === 0 ? 0 : Math.round((spent / budget.limit) * 100),
    });
  }

  res.status(200).json(results);
};
