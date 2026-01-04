import { useState, useEffect } from "react";
import { upsertBudget } from "../api/budgets";
import { getCategories } from "../api/categories";
import { Plus, X, Loader2, AlertCircle } from "lucide-react";

export default function BudgetList({ budgets, onBudgetAdded }) {
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ category: "", limit: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (showForm) {
      getCategories()
        .then((res) => setCategories(res.data || []))
        .catch(() => setCategories([]));
    }
  }, [showForm]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      await upsertBudget({
        category: form.category,
        limit: Number(form.limit),
        month,
        year,
      });
      setForm({ category: "", limit: "" });
      setShowForm(false);
      onBudgetAdded?.();
    } catch (err) {
      setError("Failed to save budget. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percent) => {
    if (percent >= 100) return "bg-red-600";
    if (percent >= 80) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStatusText = (percent) => {
    if (percent >= 100) return { text: "Over Budget", color: "text-red-600" };
    if (percent >= 80) return { text: "Almost There", color: "text-amber-600" };
    return { text: "On Track", color: "text-emerald-600" };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Your Budgets</h2>
          <p className="text-gray-600 mt-1">
            Track and manage your monthly spending limits
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
        >
          {showForm ? (
            <>
              <X className="w-5 h-5" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Add New Budget
            </>
          )}
        </button>
      </div>

      {/* Add Budget Form */}
      {showForm && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 transition-all duration-500 ease-out">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Set a New Budget
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-gray-900 font-medium"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly Limit (₹)
              </label>
              <input
                type="number"
                name="limit"
                value={form.limit}
                onChange={handleChange}
                min="1"
                required
                placeholder="e.g. 15,000"
                className="w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading || !form.category || !form.limit}
                className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving Budget...
                  </>
                ) : (
                  "Save Budget"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budgets List */}
      {budgets.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl mb-6">
            <div className="w-16 h-16 bg-gray-200 border-4 border-dashed border-gray-400 rounded-2xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No budgets yet
          </h3>
          <p className="text-gray-600 text-lg">
            Start tracking your expenses by creating your first budget
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {budgets.map((b) => {
            const percent = Math.min(b.percentUsed || 0, 100);
            const status = getStatusText(b.percentUsed || 0);

            return (
              <div
                key={b._id}
                className="group bg-white rounded-3xl shadow-lg border border-gray-100 p-7 hover:shadow-2xl hover:border-indigo-200 transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {b.category}
                    </h4>
                    <p className="text-gray-600 mt-1.5">
                      ₹{b.spent.toLocaleString()}{" "}
                      <span className="text-gray-400">of</span> ₹
                      {b.limit.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-extrabold text-gray-900">
                      {percent.toFixed(0)}%
                    </p>
                    <p className={`text-sm font-semibold ${status.color} mt-1`}>
                      {status.text}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressColor(
                        percent
                      )} shadow-md`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  {percent >= 100 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-xs font-bold text-white drop-shadow-md">
                        Over Limit!
                      </span>
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
