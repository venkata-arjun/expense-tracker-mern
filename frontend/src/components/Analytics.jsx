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

  if (!summary) return <p>Loading analytics...</p>;

  return (
    <div>
      <h3>Analytics</h3>

      <p>Total Income: ₹{summary.income}</p>
      <p>Total Expense: ₹{summary.expense}</p>
      <p>Savings: ₹{summary.savings}</p>

      <h4>Category Breakdown</h4>
      <ul>
        {categories.map((c) => (
          <li key={c._id}>
            {c._id}: ₹{c.total}
          </li>
        ))}
      </ul>
    </div>
  );
}
