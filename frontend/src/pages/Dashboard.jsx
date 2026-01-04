import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTransactions } from "../api/transactions";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Analytics from "../components/Analytics";
import { getBudgets } from "../api/budgets";
import BudgetList from "../components/BudgetList";

import CategoryList from "../components/CategoryList";

const TABS = [
  { key: "budgets", label: "Budgets" },
  { key: "categories", label: "Categories" },
  { key: "analytics", label: "Analytics" },
  { key: "transactions", label: "Transactions" },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);
  const [activeTab, setActiveTab] = useState("budgets");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await getTransactions({ page: 1, limit: 10 });
      setTransactions(res.data.data);
    } catch (err) {
      console.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const now = new Date();
      const month = now.getMonth() + 1; // JS months are 0-based
      const year = now.getFullYear();
      const res = await getBudgets({ month, year });
      setBudgets(res.data);
    } catch (err) {
      console.error("Failed to fetch budgets");
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([fetchTransactions(), fetchBudgets()]);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user.name.split(" ")[0]}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage your finances with confidence
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`px-6 py-2 text-sm font-medium border-b-2 transition-colors duration-200 focus:outline-none ${
                activeTab === tab.key
                  ? "border-indigo-600 text-indigo-700 bg-gray-100"
                  : "border-transparent text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "budgets" && (
          <section>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7 mb-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-2 md:mb-0">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Active Budgets
                </h2>
                {budgets.length > 0 && (
                  <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm">
                    <span className="text-gray-700 font-medium">
                      Total Budgeted: ₹
                      {budgets.reduce((sum, b) => sum + (b.limit || 0), 0)}
                    </span>
                    <span className="text-gray-700 font-medium">
                      Remaining: ₹
                      {budgets.reduce(
                        (sum, b) => sum + ((b.limit || 0) - (b.spent || 0)),
                        0
                      )}
                    </span>
                  </div>
                )}
              </div>
              <BudgetList budgets={budgets} onBudgetAdded={fetchBudgets} />
            </div>
          </section>
        )}

        {activeTab === "categories" && <CategoryList />}

        {activeTab === "analytics" && (
          <section>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7 mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                Financial Analytics
              </h2>
              <Analytics />
            </div>
          </section>
        )}

        {activeTab === "transactions" && (
          <>
            <section className="mb-10">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7 hover:shadow-md transition-shadow duration-300">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Add New Transaction
                </h2>
                <TransactionForm onAdd={fetchTransactions} />
              </div>
            </section>
            <section>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Recent Transactions
                  </h2>
                  {loading && (
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-indigo-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading transactions...
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse bg-gray-100 rounded-xl h-20"
                      ></div>
                    ))}
                  </div>
                ) : (
                  <TransactionList
                    transactions={transactions}
                    onDelete={fetchTransactions}
                  />
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
