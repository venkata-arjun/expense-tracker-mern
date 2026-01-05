import Category from "../models/Category.js";
// GET ALL CATEGORIES WITH AMOUNT (even if 0 spent)
export const getCategoryBreakdownAll = async (req, res) => {
  const { month, year, from, to } = req.query;
  let start, end;
  if (from && to) {
    start = new Date(from);
    end = new Date(to);
    end.setDate(end.getDate() + 1); // include the end date
  } else if (month && year) {
    start = new Date(year, month - 1, 1);
    end = new Date(year, month, 1);
  } else {
    return res
      .status(400)
      .json({ message: "Month and year or from/to required" });
  }

  // Get all categories for user
  const categories = await Category.find({ userId: req.user._id }).sort({
    name: 1,
  });

  // Get income and expense per category
  const txAgg = await Transaction.aggregate([
    {
      $match: {
        userId: req.user._id,
        date: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: { category: "$category", type: "$type" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  // Map income/expense to category name
  const catMap = {};
  txAgg.forEach((s) => {
    const cat = s._id.category;
    const type = s._id.type;
    if (!catMap[cat])
      catMap[cat] = { income: 0, expense: 0, incomeCount: 0, expenseCount: 0 };
    if (type === "income") {
      catMap[cat].income = s.total;
      catMap[cat].incomeCount = s.count;
    } else if (type === "expense") {
      catMap[cat].expense = s.total;
      catMap[cat].expenseCount = s.count;
    }
  });

  // Build result: all categories, even if 0 spent/earned
  const result = categories.map((cat) => ({
    _id: cat.name,
    income: catMap[cat.name]?.income || 0,
    expense: catMap[cat.name]?.expense || 0,
    incomeCount: catMap[cat.name]?.incomeCount || 0,
    expenseCount: catMap[cat.name]?.expenseCount || 0,
    type: cat.type,
  }));

  res.status(200).json(result);
};
import Transaction from "../models/Transaction.js";

/* ---------- MONTHLY SUMMARY ---------- */
export const getMonthlySummary = async (req, res) => {
  const { month, year, from, to } = req.query;
  let start, end;
  if (from && to) {
    start = new Date(from);
    end = new Date(to);
    end.setDate(end.getDate() + 1); // include the end date
  } else if (month && year) {
    start = new Date(year, month - 1, 1);
    end = new Date(year, month, 1);
  } else {
    return res
      .status(400)
      .json({ message: "Month and year or from/to required" });
  }

  const summary = await Transaction.aggregate([
    {
      $match: {
        userId: req.user._id,
        date: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  let income = 0;
  let expense = 0;

  summary.forEach((s) => {
    if (s._id === "income") income = s.total;
    if (s._id === "expense") expense = s.total;
  });

  res.status(200).json({
    income,
    expense,
    savings: income - expense,
  });
};

/* ---------- CATEGORY BREAKDOWN ---------- */
export const getCategoryBreakdown = async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: "Month and year required" });
  }

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const breakdown = await Transaction.aggregate([
    {
      $match: {
        userId: req.user._id,
        type: "expense",
        date: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
    { $sort: { total: -1 } },
  ]);

  res.status(200).json(breakdown);
};
