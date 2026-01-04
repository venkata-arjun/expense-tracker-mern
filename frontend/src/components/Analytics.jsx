import { useEffect, useState } from "react";
import { getSummary, getCategoryAnalytics } from "../api/analytics";

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const now = new Date();
    const params = {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };

    const fetchAnalytics = async () => {
      const summaryRes = await getSummary(params);
      const categoryRes = await getCategoryAnalytics(params);

      setSummary(summaryRes.data);
      setCategories(categoryRes.data);
    };

    fetchAnalytics();
  }, []);

  if (!summary)
    return (
      <div className="text-center text-gray-500 py-6">Loading analytics...</div>
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0">
        <div className="flex-1 bg-green-50 rounded-lg p-4 text-center">
          <div className="text-lg font-semibold text-green-700">
            Total Income
          </div>
          <div className="text-2xl font-bold text-green-800">
            ₹{summary.income}
          </div>
        </div>
        <div className="flex-1 bg-red-50 rounded-lg p-4 text-center">
          <div className="text-lg font-semibold text-red-700">
            Total Expense
          </div>
          <div className="text-2xl font-bold text-red-800">
            ₹{summary.expense}
          </div>
        </div>
        <div className="flex-1 bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-lg font-semibold text-blue-700">Savings</div>
          <div className="text-2xl font-bold text-blue-800">
            ₹{summary.savings}
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-2">
          Category Breakdown
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {categories.map((c) => (
            <li
              key={c._id}
              className="bg-gray-100 rounded-lg px-4 py-2 flex justify-between items-center"
            >
              <span className="font-medium text-gray-700">{c._id}</span>
              <span className="font-semibold">₹{c.total}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
