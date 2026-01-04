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
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          type="number"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Select Category</option>
          {filteredCategories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Payment Method
        </label>
        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="upi">UPI</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="bank">Bank</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          name="date"
          value={form.date}
          onChange={handleChange}
          type="date"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
        >
          Add
        </button>
      </div>
    </form>
  );
}
