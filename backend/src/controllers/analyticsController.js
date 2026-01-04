import Transaction from "../models/Transaction.js";

/* ---------- MONTHLY SUMMARY ---------- */
export const getMonthlySummary = async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: "Month and year required" });
  }

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

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
