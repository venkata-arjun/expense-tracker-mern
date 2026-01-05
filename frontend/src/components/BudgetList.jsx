import { useState, useEffect } from "react";
import { upsertBudget, deleteBudget } from "../api/budgets";
import { getCategories } from "../api/categories";
import { Plus, X, Loader2, AlertCircle, Pencil, Trash2 } from "lucide-react";
import Modal from "./Modal";

export default function BudgetList({
  budgets,
  onBudgetAdded,
  onEditBudget,
  onDeleteBudget,
}) {
  const [showForm, setShowForm] = useState(false);
  const [editBudget, setEditBudget] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ category: "", limit: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Prefill form when editing
  useEffect(() => {
    if (editBudget) {
      setForm({
        category: editBudget.category,
        limit: editBudget.limit.toString(),
      });
      setShowForm(true);
    }
  }, [editBudget]);

  // Load categories when form is opened
  useEffect(() => {
    if (showForm && categories.length === 0) {
      getCategories()
        .then((res) => setCategories(res.data || []))
        .catch(() => setCategories([]));
    }
  }, [showForm, categories.length]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const now = new Date();
      await upsertBudget({
        _id: editBudget?._id, // only sent when editing
        category: form.category,
        limit: Number(form.limit),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });

      setForm({ category: "", limit: "" });
      setShowForm(false);
      setEditBudget(null);
      onBudgetAdded?.();
    } catch (err) {
      setError("Failed to save budget. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (budget) => {
    setEditBudget(budget);
  };

  const handleDelete = async (budget) => {
    if (!window.confirm(`Delete budget for ${budget.category}?`)) return;

    try {
      await deleteBudget(budget._id);
      onBudgetAdded?.();
    } catch (err) {
      alert("Failed to delete budget.");
    }
  };

  const resetForm = () => {
    setForm({ category: "", limit: "" });
    setEditBudget(null);
    setShowForm(false);
    setError("");
  };

  const getProgressColor = (percent) => {
    if (percent >= 100) return "bg-red-600";
    if (percent >= 80) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStatus = (percent) => {
    if (percent >= 100) return { text: "Over Budget", color: "text-red-700" };
    if (percent >= 80)
      return { text: "Close to Limit", color: "text-amber-700" };
    return { text: "On Track", color: "text-emerald-700" };
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-8">
      {/* Header + Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Your Budgets
          </h2>
          <p className="mt-1.5 text-gray-600 text-base md:text-lg">
            Set monthly limits and track your spending
          </p>
        </div>

        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm transition-colors w-full sm:w-auto"
        >
          {showForm ? (
            <>
              <X size={18} /> Cancel
            </>
          ) : (
            <>
              <Plus size={18} /> Add Budget
            </>
          )}
        </button>
      </div>

      {/* Form (Add or Edit) */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-7">
          <h3 className="text-xl font-semibold text-gray-900 mb-5">
            {editBudget ? "Edit Budget" : "Create New Budget"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category
              </label>
              {editBudget ? (
                <input
                  type="text"
                  value={form.category}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium"
                />
              ) : (
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                >
                  <option value="">Select category</option>
                  {categories
                    .filter((cat) => cat.type === "expense")
                    .map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Monthly Limit (₹)
              </label>
              <input
                type="number"
                name="limit"
                value={form.limit}
                onChange={handleChange}
                min="1"
                required
                placeholder="e.g. 15000"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl text-sm">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || !form.category || !form.limit}
                className="flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {editBudget ? "Update Budget" : "Save Budget"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-3 px-6 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budgets Grid */}
      {budgets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-full mb-5">
            <Plus size={32} className="text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No budgets set yet
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Create your first budget to start tracking monthly spending limits.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {budgets.map((b) => {
            const percent = Math.min(b.percentUsed || 0, 100);
            const status = getStatus(percent);

            return (
              <div
                key={b._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6 hover:shadow-md hover:border-gray-300 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">
                      {b.category}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      ₹{b.spent.toLocaleString()} / ₹{b.limit.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(b)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(b)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="relative pt-1">
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-700 ${getProgressColor(
                        percent
                      )}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-2 text-gray-600">
                    <span>{percent.toFixed(0)}%</span>
                    <span className={status.color}>{status.text}</span>
                  </div>
                  {percent >= 100 && (
                    <div className="absolute -top-1 right-0 text-xs font-medium text-red-600">
                      Over limit!
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
