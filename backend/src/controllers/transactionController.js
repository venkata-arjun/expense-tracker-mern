import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";

/* ---------- CREATE TRANSACTION ---------- */
export const createTransaction = async (req, res) => {
  const { type, amount, category, description, account, date } = req.body;

  if (!type || !amount || !category || !account || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const acc = await Account.findById(account);
  if (!acc) {
    return res.status(400).json({ message: "Account not found" });
  }

  // Apply balance change ONCE
  if (type === "expense") acc.balance -= Number(amount);
  if (type === "income") acc.balance += Number(amount);

  await acc.save();

  const transaction = await Transaction.create({
    userId: req.user._id,
    type,
    amount,
    category,
    description,
    account,
    date,
  });

  res.status(201).json(transaction);
};

/* ---------- GET TRANSACTIONS ---------- */
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
  const existing = await Transaction.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!existing) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  const oldAccountId = existing.account.toString();
  const newAccountId = (req.body.account || existing.account).toString();

  const updated = await Transaction.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true }
  );

  // SAME ACCOUNT
  if (oldAccountId === newAccountId) {
    const acc = await Account.findById(oldAccountId);
    if (acc) {
      // revert old
      if (existing.type === "expense") acc.balance += Number(existing.amount);
      if (existing.type === "income") acc.balance -= Number(existing.amount);

      // apply new
      if (updated.type === "expense") acc.balance -= Number(updated.amount);
      if (updated.type === "income") acc.balance += Number(updated.amount);

      await acc.save();
    }
  }
  // ACCOUNT CHANGED
  else {
    const oldAcc = await Account.findById(oldAccountId);
    const newAcc = await Account.findById(newAccountId);

    if (oldAcc) {
      if (existing.type === "expense")
        oldAcc.balance += Number(existing.amount);
      if (existing.type === "income") oldAcc.balance -= Number(existing.amount);
      await oldAcc.save();
    }

    if (newAcc) {
      if (updated.type === "expense") newAcc.balance -= Number(updated.amount);
      if (updated.type === "income") newAcc.balance += Number(updated.amount);
      await newAcc.save();
    }
  }

  res.status(200).json(updated);
};

/* ---------- DELETE TRANSACTION (FIXED) ---------- */
export const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  const acc = await Account.findById(transaction.account);
  if (acc) {
    // REVERT EFFECT
    if (transaction.type === "expense")
      acc.balance += Number(transaction.amount);
    if (transaction.type === "income")
      acc.balance -= Number(transaction.amount);
    await acc.save();
  }

  await transaction.deleteOne();

  res.status(200).json({ message: "Transaction deleted" });
};
