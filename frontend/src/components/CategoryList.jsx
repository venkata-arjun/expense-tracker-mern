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
    const res = await getCategories();
    setCategories(res.data || []);
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
      setError("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 sm:px-8 py-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur">
                <Tag className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">Categories</h2>
                <p className="text-indigo-100 mt-1 text-sm sm:text-base">
                  Organize your income & expenses
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center justify-center gap-3 px-6 py-3.5 bg-white/20 hover:bg-white/30 backdrop-blur rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto"
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
        </div>

        {/* Add Category Form */}
        {showForm && (
          <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-br from-indigo-50/50 to-purple-50/30">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Create New Category
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Groceries, Salary, Freelance"
                  className="w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-5 py-3 rounded-xl border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading || !form.name.trim()}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
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

        {/* Categories List */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Expense Categories */}
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Expense Categories
                </h3>
                <p className="text-gray-600 mt-1">
                  {expenseCategories.length} total
                </p>
              </div>

              {expenseCategories.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full mb-4">
                    <Tag className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    No expense categories yet
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {expenseCategories.map((cat) => (
                    <div
                      key={cat._id}
                      className="group flex items-center justify-between p-5 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl hover:shadow-lg hover:border-red-300 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-red-500 rounded-xl">
                          <Tag className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-semibold text-gray-800">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-red-600 bg-red-100 px-3 py-1.5 rounded-full">
                        Expense
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Income Categories */}
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Income Categories
                </h3>
                <p className="text-gray-600 mt-1">
                  {incomeCategories.length} total
                </p>
              </div>

              {incomeCategories.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full mb-4">
                    <Tag className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    No income categories yet
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {incomeCategories.map((cat) => (
                    <div
                      key={cat._id}
                      className="group flex items-center justify-between p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl hover:shadow-lg hover:border-emerald-300 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-emerald-500 rounded-xl">
                          <Tag className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-semibold text-gray-800">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full">
                        Income
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
