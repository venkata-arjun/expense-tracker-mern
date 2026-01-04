import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTransactions } from "../api/transactions";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Analytics from "../components/Analytics";

import { getBudgets } from "../api/budgets";
import BudgetList from "../components/BudgetList";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);

  const fetchTransactions = async () => {
    setLoading(true);
    const res = await getTransactions({ page: 1, limit: 10 });
    setTransactions(res.data.data);
    setLoading(false);
  };

  const fetchBudgets = async () => {
    const res = await getBudgets();
    setBudgets(res.data.data);
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchTransactions();
        await fetchBudgets();
      } catch {
        console.error("Failed to load dashboard data");
      }
    })();
  }, []);

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>

      <Analytics />

      <TransactionForm onAdd={fetchTransactions} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <TransactionList
          transactions={transactions}
          onDelete={fetchTransactions}
        />
      )}
    </div>
  );
}
