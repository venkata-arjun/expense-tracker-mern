import { useState } from "react";
import { createTransaction } from "../api/transactions";

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    paymentMethod: "upi",
    date: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTransaction(form);
    onAdd();
    setForm({ ...form, amount: "", category: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Transaction</h3>

      <select name="type" value={form.type} onChange={handleChange}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        name="amount"
        type="number"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount"
        required
      />

      <input
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
        required
      />

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

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
      />

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
