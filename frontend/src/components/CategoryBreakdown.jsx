import { useEffect, useState } from "react";
import { getCategoryAnalyticsAll } from "../api/categoryAnalytics";
import { BarChart3 } from "lucide-react";

export default function CategoryBreakdown() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchData = async (from, to) => {
    setLoading(true);
    try {
      let params = {};
      if (from && to) {
        params.from = from;
        params.to = to;
      } else {
        const now = new Date();
        params.month = now.getMonth() + 1;
        params.year = now.getFullYear();
      }
      const res = await getCategoryAnalyticsAll(params);
      setCategories(res.data || []);
    } catch (err) {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(dateFrom, dateTo);
    // eslint-disable-next-line
  }, [dateFrom, dateTo]);

  return (
    <div className="max-w-3xl mx-auto w-full mb-10">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-7 h-7 text-indigo-600" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Category-wise Money Spent
        </h2>
      </div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Category
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by category name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <input
            type="date"
            value={dateFrom}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <input
            type="date"
            value={dateTo}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No data for this period.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                  Category
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-emerald-700 uppercase tracking-wider whitespace-nowrap">
                  Income
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-rose-700 uppercase tracking-wider whitespace-nowrap">
                  Expense
                </th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Income Txns
                </th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Expense Txns
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories
                .filter((c) =>
                  c._id.toLowerCase().includes(search.toLowerCase())
                )
                .slice()
                .sort((a, b) => b.expense + b.income - (a.expense + a.income))
                .map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-2 font-medium text-gray-800 truncate max-w-[120px] sm:max-w-xs whitespace-nowrap">
                      {c._id}
                    </td>
                    <td className="px-3 py-2 text-right text-emerald-700 font-bold whitespace-nowrap">
                      ₹{c.income.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right text-rose-700 font-bold whitespace-nowrap">
                      ₹{c.expense.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-center text-xs text-emerald-600 whitespace-nowrap">
                      {c.incomeCount}
                    </td>
                    <td className="px-3 py-2 text-center text-xs text-rose-600 whitespace-nowrap">
                      {c.expenseCount}
                    </td>
                  </tr>
                ))}
              {/* Overall summary row */}
              {(() => {
                const filtered = categories.filter((c) =>
                  c._id.toLowerCase().includes(search.toLowerCase())
                );
                if (filtered.length === 0) return null;
                const totalIncome = filtered.reduce(
                  (sum, c) => sum + (c.income || 0),
                  0
                );
                const totalExpense = filtered.reduce(
                  (sum, c) => sum + (c.expense || 0),
                  0
                );
                const totalIncomeCount = filtered.reduce(
                  (sum, c) => sum + (c.incomeCount || 0),
                  0
                );
                const totalExpenseCount = filtered.reduce(
                  (sum, c) => sum + (c.expenseCount || 0),
                  0
                );
                return (
                  <tr className="bg-indigo-50 font-bold">
                    <td className="px-3 py-2 text-indigo-800 whitespace-nowrap">
                      Total
                    </td>
                    <td className="px-3 py-2 text-right text-emerald-800 whitespace-nowrap">
                      ₹{totalIncome.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right text-rose-800 whitespace-nowrap">
                      ₹{totalExpense.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-center text-emerald-800 whitespace-nowrap">
                      {totalIncomeCount}
                    </td>
                    <td className="px-3 py-2 text-center text-rose-800 whitespace-nowrap">
                      {totalExpenseCount}
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
