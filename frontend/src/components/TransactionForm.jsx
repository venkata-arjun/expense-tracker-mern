import { useEffect, useState, useRef } from "react";
import { createTransaction, updateTransaction } from "../api/transactions";
import { getCategories } from "../api/categories";
import { useAccounts } from "../api/useAccounts";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function TransactionForm({
  onAdd,
  initialData = null,
  isEdit = false,
  onCancel,
}) {
  // Split initial date/time
  let initialDate = "";
  let initialTime = "";
  if (initialData?.date) {
    const d = new Date(initialData.date);
    initialDate = d.toISOString().slice(0, 10);
    initialTime = d.toTimeString().slice(0, 5);
  }

  const [form, setForm] = useState({
    type: initialData?.type || "expense",
    amount: initialData?.amount || "",
    category: initialData?.category || "",
    account: initialData?.account || "",
    date: initialDate,
    time: initialTime,
    description: initialData?.description || "",
  });

  const [categories, setCategories] = useState([]);
  const { accounts } = useAccounts();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Hard guard against double submit
  const hasSubmitted = useRef(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getCategories();
        setCategories(res.data || []);
      } catch {
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hasSubmitted.current) return;

    hasSubmitted.current = true;
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      let dateTime;
      if (form.date && form.time) {
        dateTime = new Date(`${form.date}T${form.time}:00`).toISOString();
      } else {
        dateTime = new Date(`${form.date}T12:00:00`).toISOString();
      }

      const submitData = {
        ...form,
        date: dateTime,
      };
      delete submitData.time;

      if (isEdit && initialData?._id) {
        await updateTransaction(initialData._id, submitData);
      } else {
        await createTransaction(submitData);
        setSuccess(true);
        setForm({
          type: "expense",
          amount: "",
          category: "",
          account: "",
          date: "",
          time: "",
          description: "",
        });
        setTimeout(() => setSuccess(false), 2000);
      }

      onAdd?.(); // refresh parent data
    } catch {
      setError("Failed to save transaction. Please try again.");
      hasSubmitted.current = false; // allow retry
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === form.type);
  const isIncome = form.type === "income";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl mx-auto">
        <div className="rounded-t-3xl md:rounded-3xl min-h-screen md:min-h-0 px-4 py-8 md:px-8 md:py-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            {isEdit ? "Edit Transaction" : "Add New Transaction"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-7">
            {success && (
              <div className="flex items-center justify-center gap-2 text-emerald-600 font-semibold mb-2">
                <CheckCircle2 className="w-6 h-6" />
                Added!
              </div>
            )}

            {/* Type Toggle */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, type: "expense", category: "" }))
                }
                className={`py-4 rounded-2xl font-semibold ${
                  !isIncome ? "bg-rose-100 text-rose-700" : "bg-gray-100"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, type: "income", category: "" }))
                }
                className={`py-4 rounded-2xl font-semibold ${
                  isIncome ? "bg-emerald-100 text-emerald-700" : "bg-gray-100"
                }`}
              >
                Income
              </button>
            </div>

            {/* Amount */}
            <input
              name="amount"
              type="number"
              required
              min="0"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              onWheel={(e) => e.target.blur()}
              className="w-full p-4 border rounded-2xl"
              placeholder="Amount"
            />

            {/* Category */}
            <select
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              className="w-full p-4 border rounded-2xl"
            >
              <option value="">Select category</option>
              {filteredCategories.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Account */}
            <select
              name="account"
              required
              value={form.account}
              onChange={handleChange}
              className="w-full p-4 border rounded-2xl"
            >
              <option value="">Select account</option>
              {accounts.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>

            {/* Date & Time - always side by side, prevent collision */}
            <div className="flex gap-4 flex-wrap">
              <input
                type="date"
                name="date"
                required
                value={form.date}
                max={new Date().toISOString().slice(0, 10)}
                onChange={handleChange}
                className="min-w-[120px] flex-1 p-4 border rounded-2xl"
              />
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="min-w-[120px] flex-1 p-4 border rounded-2xl"
              />
            </div>

            {/* Description */}
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-4 border rounded-2xl"
              placeholder="Description (optional)"
            />

            {error && (
              <div className="text-red-600 text-center font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-600 text-center font-medium flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Transaction saved successfully!
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 border rounded-xl"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading
                  ? "Saving..."
                  : isEdit
                  ? "Save Changes"
                  : "Add Transaction"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
