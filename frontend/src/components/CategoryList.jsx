import { useEffect, useState } from "react";
import { getCategories, createCategory } from "../api/categories";
import { Plus, X, Loader2, AlertCircle, Tag } from "lucide-react";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", type: "expense" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createCategory(form);
      setForm({ name: "", type: "expense" });
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      setError("Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-100 rounded-lg">
            <Tag className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
            <p className="text-sm text-gray-600">
              Organize your income & expenses
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
        >
          {showForm ? (
            <>
              <X className="w-5 h-5" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Add Category
            </>
          )}
        </button>
      </div>

      {/* Add Category Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-5">
            Create New Category
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g., Groceries, Salary"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none text-gray-900 bg-white"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-700 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !form.name.trim()}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Category"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Categories */}
        <div>
          <div className="mb-5">
            <h3 className="text-xl font-semibold text-gray-900">
              Expense Categories
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {expenseCategories.length} total
            </p>
          </div>

          {expenseCategories.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <Tag className="mx-auto w-10 h-10 text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium">
                No expense categories yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenseCategories.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center justify-between p-4 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500 rounded-lg">
                      <Tag className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-rose-700 bg-rose-200 px-3 py-1 rounded-full">
                    Expense
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Income Categories */}
        <div>
          <div className="mb-5">
            <h3 className="text-xl font-semibold text-gray-900">
              Income Categories
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {incomeCategories.length} total
            </p>
          </div>

          {incomeCategories.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <Tag className="mx-auto w-10 h-10 text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium">
                No income categories yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomeCategories.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500 rounded-lg">
                      <Tag className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-200 px-3 py-1 rounded-full">
                    Income
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
