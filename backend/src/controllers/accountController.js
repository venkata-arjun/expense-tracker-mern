import Account from "../models/Account.js";

/* ---------- CREATE ACCOUNT ---------- */
export const createAccount = async (req, res) => {
  try {
    const { name, balance, type } = req.body;

    if (!name || balance === undefined || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (balance < 0) {
      return res.status(400).json({ message: "Balance cannot be negative" });
    }

    // Debug log
    console.log("Creating account with:", {
      userId: req.user?._id,
      name,
      balance,
      type,
    });

    const account = await Account.create({
      userId: req.user._id,
      name,
      balance,
      type,
    });

    res.status(201).json(account);
  } catch (error) {
    console.error("Account creation error:", error);
    res
      .status(500)
      .json({ message: "Failed to create account", error: error.message });
  }
};

/* ---------- GET ACCOUNTS ---------- */
export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user._id });
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch accounts" });
  }
};

/* ---------- UPDATE ACCOUNT ---------- */
export const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, balance, type } = req.body;

    const account = await Account.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { name, balance, type },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: "Failed to update account" });
  }
};

/* ---------- DELETE ACCOUNT ---------- */
export const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await Account.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete account" });
  }
};
