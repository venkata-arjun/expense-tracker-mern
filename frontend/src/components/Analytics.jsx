import { useEffect, useState } from "react";
import { getSummary } from "../api/analytics";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  BarChart3,
} from "lucide-react";

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  // Date range state
  const today = new Date();
  // Default: current month
  const defaultFrom = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const defaultTo = today.toISOString().slice(0, 10);
  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);

  useEffect(() => {
    // Only fetch if fromDate <= toDate
    if (fromDate > toDate) return;
    const params = { from: fromDate, to: toDate };
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const summaryRes = await getSummary(params);
        setSummary(summaryRes.data);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [fromDate, toDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-14 h-14 text-indigo-600 animate-spin mx-auto mb-6" />
          <p className="text-gray-600 font-medium text-xl">
            Loading your analytics...
          </p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen px-4 py-20 bg-gray-50 text-center">
        <p className="text-gray-500 text-xl max-w-md mx-auto">
          No analytics data available for this month.
        </p>
      </div>
    );
  }

  let rangeLabel = "";
  if (fromDate === toDate) {
    rangeLabel = new Date(fromDate).toLocaleDateString();
  } else {
    rangeLabel = `${new Date(fromDate).toLocaleDateString()} to ${new Date(
      toDate
    ).toLocaleDateString()}`;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 px-0 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white rounded-none sm:rounded-3xl shadow-none sm:shadow-xl border-0 sm:border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-7 sm:px-8 sm:py-12 md:py-14 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="p-3 sm:p-4 bg-white/20 rounded-2xl backdrop-blur w-fit mx-auto sm:mx-0">
                <BarChart3 className="w-9 h-9 sm:w-12 sm:h-12" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold">
                  Analytics
                </h2>
                <p className="text-indigo-100 mt-2 sm:mt-3 text-base sm:text-xl">
                  Overview for {rangeLabel}
                </p>
              </div>
            </div>
            {/* Date Range Picker */}
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <div>
                <label className="block text-indigo-100 text-sm mb-1">
                  From
                </label>
                <input
                  type="date"
                  className="rounded-lg px-3 py-2 text-indigo-900"
                  value={fromDate}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-indigo-100 text-sm mb-1">To</label>
                <input
                  type="date"
                  className="rounded-lg px-3 py-2 text-indigo-900"
                  value={toDate}
                  min={fromDate}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-2 py-5 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8 sm:mb-12">
              {/* Total Income */}
              <div className="group bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-3xl mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <p className="text-xl font-semibold text-emerald-700">
                  Total Income
                </p>
                <p className="text-4xl sm:text-5xl font-extrabold text-emerald-800 mt-4">
                  ₹{summary.income?.toLocaleString() || 0}
                </p>
              </div>

              {/* Total Expense */}
              <div className="group bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-3xl mb-6 group-hover:scale-110 transition-transform">
                  <TrendingDown className="w-10 h-10 text-white" />
                </div>
                <p className="text-xl font-semibold text-red-700">
                  Total Expense
                </p>
                <p className="text-4xl sm:text-5xl font-extrabold text-red-800 mt-4">
                  ₹{summary.expense?.toLocaleString() || 0}
                </p>
              </div>

              {/* Net Savings */}
              <div
                className={`group rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 ${
                  summary.savings >= 0
                    ? "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200"
                    : "bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200"
                }`}
              >
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 group-hover:scale-110 transition-transform ${
                    summary.savings >= 0 ? "bg-blue-500" : "bg-orange-500"
                  }`}
                >
                  <PiggyBank className="w-10 h-10 text-white" />
                </div>
                <p
                  className={`text-xl font-semibold ${
                    summary.savings >= 0 ? "text-blue-700" : "text-orange-700"
                  }`}
                >
                  Net Savings
                </p>
                <p
                  className={`text-4xl sm:text-5xl font-extrabold mt-4 ${
                    summary.savings >= 0 ? "text-blue-800" : "text-orange-800"
                  }`}
                >
                  ₹{Math.abs(summary.savings || 0).toLocaleString()}
                  {summary.savings < 0 && (
                    <span className="block text-xl mt-2">(Deficit)</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
