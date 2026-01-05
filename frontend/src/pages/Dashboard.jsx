import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTransactions } from "../api/transactions";
import { getBudgets } from "../api/budgets";
import { getAccounts } from "../api/accounts"; // Direct import

import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Analytics from "../components/Analytics";
import BudgetList from "../components/BudgetList";
import CategoryList from "../components/CategoryList";
import CategoryBreakdown from "../components/CategoryBreakdown";
import AccountList from "../components/AccountList";

import {
  LogOut,
  Wallet,
  Tag,
  BarChart3,
  PlusCircle,
  History,
  PiggyBank,
  List,
  PieChart,
  BookOpen,
  CreditCard,
  User as UserIcon,
  TrendingUp,
  TrendingDown,
  IndianRupee,
} from "lucide-react";
import { Link } from "react-router-dom";
import MobileSidebarNav from "../components/MobileSidebarNav";

const TABS = [
  { key: "budgets", label: "Budgets", icon: PiggyBank },
  { key: "accounts", label: "Accounts", icon: CreditCard },
  { key: "categories", label: "Categories", icon: List },
  { key: "category-breakdown", label: "Breakdown", icon: PieChart },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "create-transaction", label: "Add Transaction", icon: PlusCircle },
  { key: "transactions", label: "Transactions", icon: BookOpen },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("budgets");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await getTransactions({ page: 1, limit: 50 });
      setTransactions(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const res = await getBudgets({ month, year });
      setBudgets(res.data || []);
    } catch (err) {
      console.error("Failed to fetch budgets");
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await getAccounts();
      setAccounts(res.data || []);
    } catch (err) {
      setAccounts([]);
    }
  };

  useEffect(() => {
    Promise.all([fetchTransactions(), fetchBudgets(), fetchAccounts()]);
  }, []);

  const totalBudgeted = budgets.reduce((sum, b) => sum + (b.limit || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
  const totalRemaining = totalBudgeted - totalSpent;

  const refreshData = () => {
    fetchTransactions();
    fetchAccounts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Title */}
            <h1 className="text-xl font-bold text-gray-900 sm:hidden w-full text-center ml-10">
              Financial Dashboard
            </h1>

            {/* Desktop Title */}
            <h1 className="hidden sm:block text-2xl font-bold text-gray-900 text-center flex-1">
              Financial Dashboard
            </h1>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition"
                title="Profile"
              >
                <UserIcon className="w-5 h-5" />
              </Link>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation */}
      <MobileSidebarNav
        tabs={TABS}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Desktop Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "text-gray-600 hover:text-indigo-700 hover:bg-indigo-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Tab Title */}
        <h2 className="sm:hidden text-2xl font-bold text-gray-900 text-center mb-8">
          {TABS.find((t) => t.key === activeTab)?.label || "Dashboard"}
        </h2>

        {/* Budget Summary Cards - Only on Budgets Tab */}
        {activeTab === "budgets" && budgets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Total Budgeted */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">
                    Total Budgeted
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    ₹{totalBudgeted.toLocaleString("en-IN")}
                  </p>
                </div>
                <IndianRupee className="w-10 h-10 text-indigo-200" />
              </div>
            </div>

            {/* Total Spent */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">
                    Total Spent
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    ₹{totalSpent.toLocaleString("en-IN")}
                  </p>
                </div>
                <TrendingDown className="w-10 h-10 text-red-200" />
              </div>
            </div>

            {/* Remaining */}
            <div
              className={`rounded-2xl p-6 shadow-lg text-white ${
                totalRemaining >= 0
                  ? "bg-gradient-to-br from-green-500 to-green-600"
                  : "bg-gradient-to-br from-orange-500 to-orange-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">
                    {totalRemaining >= 0 ? "Remaining" : "Overspent"}
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    ₹{Math.abs(totalRemaining).toLocaleString("en-IN")}
                  </p>
                </div>
                {totalRemaining >= 0 ? (
                  <TrendingUp className="w-10 h-10 opacity-80" />
                ) : (
                  <TrendingDown className="w-10 h-10 opacity-80" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="p-6 lg:p-10">
            {activeTab === "budgets" && (
              <BudgetList budgets={budgets} onBudgetAdded={fetchBudgets} />
            )}

            {activeTab === "accounts" && (
              <AccountList accounts={accounts} fetchAccounts={fetchAccounts} />
            )}

            {activeTab === "categories" && <CategoryList />}

            {activeTab === "category-breakdown" && <CategoryBreakdown />}

            {activeTab === "analytics" && <Analytics />}

            {activeTab === "create-transaction" && (
              <div className="max-w-3xl mx-auto">
                <TransactionForm onAdd={refreshData} />
              </div>
            )}

            {activeTab === "transactions" && (
              <div>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="h-24 bg-gray-100 rounded-2xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <TransactionList
                    transactions={transactions}
                    onRefresh={refreshData}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
