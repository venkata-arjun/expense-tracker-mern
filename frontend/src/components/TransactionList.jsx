import { useState, useMemo } from "react";
import { useAccounts } from "../api/useAccounts";
import Modal from "./Modal";
import TransactionForm from "./TransactionForm";
import TransactionDetails from "./TransactionDetails";
import { deleteTransaction } from "../api/transactions";
import {
  TrendingUp,
  TrendingDown,
  Search,
  ArrowUpDown,
  FileText,
  Trash2,
} from "lucide-react";

export default function TransactionList({ transactions = [], onRefresh }) {
  const [selectedTx, setSelectedTx] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTx, setDeleteTx] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { accounts, isLoading: accountsLoading } = useAccounts();

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortType, setSortType] = useState("amount"); // 'amount' or 'date'
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'

  const filteredTransactions = useMemo(() => {
    let result = transactions.filter((tx) => {
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch =
        searchLower === ""
          ? true
          : tx.category?.toLowerCase().includes(searchLower) ||
            tx.description?.toLowerCase().includes(searchLower) ||
            String(tx.amount).includes(searchLower);

      let matchesDate = true;
      if (dateFrom) {
        const txDate = new Date(tx.date).toISOString().split("T")[0];
        matchesDate = matchesDate && txDate >= dateFrom;
      }
      if (dateTo) {
        const txDate = new Date(tx.date).toISOString().split("T")[0];
        matchesDate = matchesDate && txDate <= dateTo;
      }

      return matchesSearch && matchesDate;
    });

    result.sort((a, b) => {
      if (sortType === "amount") {
        const valA = Number(a.amount);
        const valB = Number(b.amount);
        return sortOrder === "asc" ? valA - valB : valB - valA;
      } else if (sortType === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    return result;
  }, [transactions, searchTerm, dateFrom, dateTo, sortOrder, sortType]);

  const handleCardClick = (tx) => {
    setSelectedTx(tx);
    setShowDetails(true);
  };

  const handleDetailsClose = () => {
    setShowDetails(false);
    setSelectedTx(null);
  };

  const handleEdit = (tx) => {
    setEditTx(tx);
    setEditOpen(true);
    setShowDetails(false);
  };

  const handleDeleteClick = (tx) => {
    setDeleteTx(tx);
    setDeleteOpen(true);
    setShowDetails(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTx) return;
    try {
      await deleteTransaction(deleteTx._id);
      setDeleteOpen(false);
      setDeleteTx(null);
      onRefresh?.();
    } catch (err) {
      alert("Failed to delete transaction.");
    }
  };

  if (accountsLoading)
    return (
      <div className="text-center py-12 text-gray-500">
        Loading transactions...
      </div>
    );

  if (!transactions.length) {
    return (
      <div className="text-center py-16 px-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <FileText className="mx-auto w-14 h-14 text-gray-300 mb-5" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No transactions yet
        </h3>
        <p className="text-gray-600">
          Add your first income or expense to get started.
        </p>
      </div>
    );
  }

  const getAccountName = (accountId) =>
    accounts?.find((a) => a._id === accountId)?.name || "Unknown Account";

  return (
    <>
      {/* Modals remain the same – just minor button polish in delete modal */}
      <Modal
        open={showDetails}
        onClose={handleDetailsClose}
        size="sm"
        hideCloseButton
      >
        {selectedTx && (
          <TransactionDetails
            tx={selectedTx}
            accountName={getAccountName(selectedTx.account)}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onClose={handleDetailsClose}
          />
        )}
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} size="sm">
        {editTx && (
          <TransactionForm
            onAdd={() => {
              setEditOpen(false);
              onRefresh?.();
            }}
            initialData={editTx}
            isEdit
          />
        )}
      </Modal>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} size="sm">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600">
              <Trash2 className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Delete this transaction?
          </h3>
          <p className="text-gray-600 mb-2">This action cannot be undone.</p>
          <p className="font-medium text-gray-900 mb-8">
            {deleteTx?.category} — ₹
            {deleteTx && Number(deleteTx.amount).toLocaleString("en-IN")}
          </p>
          <div className="flex gap-4 w-full">
            <button
              onClick={() => setDeleteOpen(false)}
              className="flex-1 py-3 px-5 rounded-xl border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="flex-1 py-3 px-5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-7 h-7 md:w-8 md:h-8 text-indigo-600" />
            Transactions
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full hidden sm:inline">
              {filteredTransactions.length} of {transactions.length}
            </span>
          </h2>
        </div>

        {/* Filters – better stacking on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative col-span-1 sm:col-span-2 lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search category or note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-shadow shadow-sm hover:shadow"
            />
          </div>

          <input
            type="date"
            value={dateFrom}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none shadow-sm hover:shadow"
          />

          <input
            type="date"
            value={dateTo}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none shadow-sm hover:shadow"
          />

          <div className="flex gap-2 w-full sm:w-auto justify-start sm:justify-end mt-4 sm:mt-0">
            <button
              onClick={() => {
                if (sortType === "amount") {
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                } else {
                  setSortType("amount");
                  setSortOrder("desc");
                }
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow active:scale-[0.98] ${
                sortType === "amount" ? "ring-2 ring-blue-400" : ""
              }`}
            >
              Amount{" "}
              {sortType === "amount" ? (sortOrder === "desc" ? "↓" : "↑") : ""}
            </button>
            <button
              onClick={() => {
                if (sortType === "date") {
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                } else {
                  setSortType("date");
                  setSortOrder("desc");
                }
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow active:scale-[0.98] ${
                sortType === "date" ? "ring-2 ring-purple-400" : ""
              }`}
            >
              Date{" "}
              {sortType === "date" ? (sortOrder === "desc" ? "↓" : "↑") : ""}
            </button>
          </div>
        </div>

        {/* Transaction Cards */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-lg font-medium text-gray-700">
              No matching transactions
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Try changing filters or search term
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {filteredTransactions.map((tx) => {
              const isIncome = tx.type === "income";
              const bgColor = isIncome
                ? "bg-teal-50 hover:bg-teal-100/80"
                : "bg-rose-50 hover:bg-rose-100/80";
              const iconBg = isIncome ? "bg-teal-500" : "bg-rose-500";
              const amountColor = isIncome ? "text-teal-700" : "text-rose-700";

              return (
                <div
                  key={tx._id}
                  onClick={() => handleCardClick(tx)}
                  className={`rounded-xl border border-gray-200 p-4 sm:p-5 flex items-center justify-between cursor-pointer transition-all duration-150 shadow-sm hover:shadow-md active:scale-[0.995] ${bgColor}`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`p-3 rounded-lg ${iconBg}`}>
                      {isIncome ? (
                        <TrendingUp className="w-6 h-6 text-white" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-base sm:text-lg">
                        {tx.category}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                        {getAccountName(tx.account)}
                      </p>
                      {tx.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {tx.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-center min-w-[90px]">
                    <div className={`flex items-baseline gap-1 ${amountColor}`}>
                      <span className="text-lg sm:text-xl font-bold">
                        {isIncome ? "+" : "−"}
                      </span>
                      <span className="text-xl sm:text-2xl font-bold break-words">
                        ₹{Number(tx.amount).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {new Date(tx.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
