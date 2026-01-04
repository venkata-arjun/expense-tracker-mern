import { useEffect, useState } from "react";
import { createTransaction } from "../api/transactions";
import { getCategories } from "../api/categories";

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    paymentMethod: "upi",
    date: "",
    description: "",
  });

  const [categories, setCategories] = useState([]);

  /* ---------- FETCH CATEGORIES ---------- */
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();
      setCategories(res.data);
    };
    fetchCategories();
  }, []);

  /* ---------- HANDLE CHANGE ---------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    await createTransaction(form);
    onAdd();

    setForm({
      ...form,
      amount: "",
      category: "",
      description: "",
    });
  };

  /* ---------- FILTER CATEGORIES BY TYPE ---------- */
  const filteredCategories = categories.filter((c) => c.type === form.type);

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Transaction</h3>

      {/* TYPE */}
      <select name="type" value={form.type} onChange={handleChange}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      {/* AMOUNT */}
      <input
        name="amount"
        type="number"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount"
        required
      />

      {/* CATEGORY (DB ONLY) */}
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        {filteredCategories.map((c) => (
          <option key={c._id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      {/* PAYMENT METHOD */}
      <select
        name="paymentMethod"
        value={form.paymentMethod}
        onChange={handleChange}
      >
        <option value="upi">UPI</option>
        <option value="cash">Cash</option>
        <option value="card">Card</option>
        <option value="bank">Bank</option>
      </select>

      {/* DATE */}
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
      />

      {/* DESCRIPTION */}
      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
      />

      <button type="submit">Add</button>
    </form>
  );
}
