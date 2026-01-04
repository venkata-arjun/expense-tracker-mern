import { useEffect, useState } from "react";
import { getSummary, getCategoryAnalytics } from "../api/analytics";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  BarChart3,
} from "lucide-react";

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const params = {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [summaryRes, categoryRes] = await Promise.all([
          getSummary(params),
          getCategoryAnalytics(params),
        ]);
        setSummary(summaryRes.data);
        setCategories(categoryRes.data || []);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">
          No analytics data available for this month.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 sm:px-8 py-8 text-white">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Monthly Analytics</h2>
              <p className="text-indigo-100 mt-1 text-lg">
                Overview for{" "}
                {new Date().toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Total Income */}
            <div className="group bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-500">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-semibold text-emerald-700">
                Total Income
              </p>
              <p className="text-4xl font-extrabold text-emerald-800 mt-3">
                ₹{summary.income?.toLocaleString() || 0}
              </p>
            </div>

            {/* Total Expense */}
            <div className="group bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-500">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-2xl mb-5 group-hover:scale-110 transition-transform">
                <TrendingDown className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-semibold text-red-700">
                Total Expense
              </p>
              <p className="text-4xl font-extrabold text-red-800 mt-3">
                ₹{summary.expense?.toLocaleString() || 0}
              </p>
            </div>

            {/* Savings */}
            <div
              className={`group rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-500 ${
                summary.savings >= 0
                  ? "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200"
                  : "bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200"
              }`}
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 group-hover:scale-110 transition-transform ${
                  summary.savings >= 0 ? "bg-blue-500" : "bg-orange-500"
                }`}
              >
                <PiggyBank className="w-8 h-8 text-white" />
              </div>
              <p
                className={`text-lg font-semibold ${
                  summary.savings >= 0 ? "text-blue-700" : "text-orange-700"
                }`}
              >
                Net Savings
              </p>
              <p
                className={`text-4xl font-extrabold mt-3 ${
                  summary.savings >= 0 ? "text-blue-800" : "text-orange-800"
                }`}
              >
                ₹{Math.abs(summary.savings || 0).toLocaleString()}
                {summary.savings < 0 && (
                  <span className="text-lg ml-2">(Deficit)</span>
                )}
              </p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-indigo-600" />
              Category Breakdown
            </h3>

            {categories.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">
                  No transactions recorded this month
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((c) => (
                  <div
                    key={c._id}
                    className="group bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-800 truncate pr-4">
                        {c._id}
                      </span>
                      <span className="text-xl font-bold text-indigo-700">
                        ₹{c.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {c.count} transaction{c.count !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
