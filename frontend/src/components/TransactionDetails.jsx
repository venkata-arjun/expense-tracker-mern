import {
  Calendar,
  CreditCard,
  FileText,
  Clock,
  Trash2,
  Pencil,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  Wallet,
  NotepadText,
} from "lucide-react";

export default function TransactionDetails({
  tx,
  accountName,
  accountId,
  onEdit,
  onDelete,
  onClose,
}) {
  if (!tx) return null;
  const isIncome = tx.type === "income";

  return (
    <div className="relative p-6 bg-white rounded-2xl shadow-lg max-w-sm mx-auto">
      {/* Edit/Delete buttons - top right */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => onEdit?.(tx)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Edit transaction"
          aria-label="Edit"
        >
          <Pencil className="w-5 h-5 text-blue-600" />
        </button>
        <button
          onClick={() => onDelete?.(tx)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Delete transaction"
          aria-label="Delete"
        >
          <Trash2 className="w-5 h-5 text-red-600" />
        </button>
      </div>

      {/* Header: Icon, Type, Amount */}
      <div className="flex flex-col items-center mb-6 pt-2">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-md ${
            isIncome
              ? "bg-emerald-100 text-emerald-600"
              : "bg-rose-100 text-rose-600"
          }`}
        >
          {isIncome ? (
            <TrendingUp className="w-9 h-9" />
          ) : (
            <TrendingDown className="w-9 h-9" />
          )}
        </div>

        <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          {isIncome ? "Income" : "Expense"}
        </span>

        <div className="flex items-baseline justify-center gap-1 mt-2">
          <span
            className={`text-2xl font-bold ${
              isIncome ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {isIncome ? "+" : "−"}
          </span>
          <span
            className={`text-3xl font-bold break-words ${
              isIncome ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            ₹{Number(tx.amount).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Category - prominent */}
      <div className="text-center mb-6">
        <div className="text-xl font-semibold text-gray-800">{tx.category}</div>
      </div>

      {/* Details grid */}
      <div className="space-y-4 mb-8">
        {/* Date */}
        <div className="flex items-center gap-3 text-gray-700">
          <CalendarDays className="w-5 h-5 text-gray-500" />
          <div>
            <span className="text-sm font-medium text-gray-500">Date</span>
            <p className="text-base">
              {new Date(tx.date).toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Time (if needed separately) */}
        <div className="flex items-center gap-3 text-gray-700">
          <Clock className="w-5 h-5 text-gray-500" />
          <div>
            <span className="text-sm font-medium text-gray-500">Time</span>
            <p className="text-base">
              {new Date(tx.date).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Account */}
        <div className="flex items-center gap-3 text-gray-700">
          <Wallet className="w-5 h-5 text-gray-500" />
          <div>
            <span className="text-sm font-medium text-gray-500">Account</span>
            <p className="text-base font-medium">{accountName}</p>
          </div>
        </div>

        {/* Payment Mode */}
        {tx.mode && (
          <div className="flex items-center gap-3 text-gray-700">
            <CreditCard className="w-5 h-5 text-gray-500" />
            <div>
              <span className="text-sm font-medium text-gray-500">Mode</span>
              <p className="text-base">{tx.mode}</p>
            </div>
          </div>
        )}

        {/* Description */}
        {tx.description && (
          <div className="flex items-start gap-3 text-gray-700">
            <NotepadText className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <span className="text-sm font-medium text-gray-500">
                Description
              </span>
              <p className="text-base">{tx.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="w-full py-3 px-6 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors shadow-sm"
      >
        Close
      </button>
    </div>
  );
}
