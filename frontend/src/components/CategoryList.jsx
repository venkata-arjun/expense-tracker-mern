import { useEffect, useState } from "react";
import { getCategories, createCategory } from "../api/categories";

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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7 mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
          Categories
        </h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancel" : "Add Category"}
        </button>
      </div>
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-3 rounded mb-4 space-y-2"
        >
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded mt-2"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Category"}
          </button>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Expense Categories
          </h3>
          {categories.filter((c) => c.type === "expense").length === 0 && (
            <div className="text-gray-500 text-sm">No expense categories</div>
          )}
          {categories
            .filter((c) => c.type === "expense")
            .map((cat) => (
              <div
                key={cat._id}
                className="bg-gray-100 rounded p-2 mb-2 flex items-center justify-between"
              >
                <span>{cat.name}</span>
              </div>
            ))}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Income Categories
          </h3>
          {categories.filter((c) => c.type === "income").length === 0 && (
            <div className="text-gray-500 text-sm">No income categories</div>
          )}
          {categories
            .filter((c) => c.type === "income")
            .map((cat) => (
              <div
                key={cat._id}
                className="bg-gray-100 rounded p-2 mb-2 flex items-center justify-between"
              >
                <span>{cat.name}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
