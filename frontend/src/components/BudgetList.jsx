import { useState, useEffect } from "react";
import { upsertBudget } from "../api/budgets";
import { getCategories } from "../api/categories";
import { Plus, X, Loader2, AlertCircle } from "lucide-react"; // Optional: using lucide-react icons

export default function BudgetList({ budgets, onBudgetAdded }) {
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ category: "", limit: "" });
  // Category creation is now managed in CategoryList only
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (showForm) {
      getCategories()
        .then((res) => setCategories(res.data || []))
        .catch(() => setCategories([]));
    }
  }, [showForm]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setCatLoading(true);
    setCatError("");
    try {
      await createCategory(newCategory);
      const res = await getCategories();
      setCategories(res.data.data || []);
      setNewCategory({ name: "", type: "expense" });
      setShowAddCategory(false);
    } catch (err) {
      setCatError("Failed to create category. Try again.");
    } finally {
      setCatLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await upsertBudget({
        category: form.category,
        limit: Number(form.limit),
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
    if (percent >= 100) return "bg-red-500";
    if (percent >= 80) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Header + Add Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Your Budgets</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all duration-200"
        >
          {showForm ? (
            <>Cancel</>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Budget
            </>
          )}
        </button>
      </div>

      {/* Add Budget Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 transition-all duration-300">
          <h4 className="text-lg font-medium text-gray-900 mb-5">
            Create New Budget
          </h4>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="">Choose a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Limit (₹)
              </label>
              <input
                type="number"
                name="limit"
                value={form.limit}
                onChange={handleChange}
                min="1"
                required
                placeholder="e.g., 15000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Error & Submit */}
            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !form.category || !form.limit}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-xl shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
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
        <div className="text-center py-12 text-gray-500">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20 mx-auto mb-4" />
          <p className="text-lg font-medium">No budgets created yet</p>
          <p className="text-sm mt-1">Click "Add Budget" to get started</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {budgets.map((b) => {
            const percent = b.percentUsed || 0;
            return (
              <div
                key={b._id}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {b.category}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      ₹{b.spent.toLocaleString()} spent of ₹
                      {b.limit.toLocaleString()} limit
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-sm font-medium">
                    <span
                      className={
                        percent >= 100
                          ? "text-red-600"
                          : percent >= 80
                          ? "text-orange-600"
                          : "text-gray-600"
                      }
                    >
                      {percent.toFixed(0)}%
                    </span>
                    {percent >= 100 && (
                      <span className="text-red-600">Exceeded</span>
                    )}
                    {percent >= 80 && percent < 100 && (
                      <span className="text-orange-600">Near Limit</span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ease-out ${getProgressColor(
                        percent
                      )}`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
