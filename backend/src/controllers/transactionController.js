import Transaction from "../models/Transaction.js";

/* ---------- CREATE TRANSACTION ---------- */
export const createTransaction = async (req, res) => {
  const { type, amount, category, description, paymentMethod, date } = req.body;

  if (!type || !amount || !category || !paymentMethod || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const transaction = await Transaction.create({
    userId: req.user._id,
    type,
    amount,
    category,
    description,
    paymentMethod,
    date,
  });

  res.status(201).json(transaction);
};

/* ---------- GET TRANSACTIONS (FILTER + PAGINATION) ---------- */
export const getTransactions = async (req, res) => {
  const {
    type,
    category,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = req.query;

  const query = { userId: req.user._id };

  if (type) query.type = type;
  if (category) query.category = category;

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    Transaction.find(query).sort({ date: -1 }).skip(skip).limit(Number(limit)),
    Transaction.countDocuments(query),
  ]);

  res.status(200).json({
    data: transactions,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  });
};

/* ---------- UPDATE TRANSACTION ---------- */
export const updateTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true }
  );

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  res.status(200).json(transaction);
};

/* ---------- DELETE TRANSACTION ---------- */
export const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  res.status(200).json({ message: "Transaction deleted" });
};
