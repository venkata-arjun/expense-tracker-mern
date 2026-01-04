import { deleteTransaction } from "../api/transactions";

export default function TransactionList({ transactions, onDelete }) {
  if (!transactions.length)
    return <p className="text-gray-500 text-center">No transactions</p>;

  return (
    <ul className="divide-y divide-gray-200 bg-white rounded-xl shadow-sm border border-gray-200">
      {transactions.map((tx) => (
        <li
          key={tx._id}
          className="flex items-center justify-between px-4 py-3"
        >
          <div>
            <span
              className={`font-semibold ${
                tx.type === "income" ? "text-green-600" : "text-red-600"
              }`}
            >
              {tx.category}
            </span>
            <span className="ml-2 text-gray-700">
              ₹{tx.amount}{" "}
              <span className="text-xs text-gray-400">({tx.type})</span>
            </span>
          </div>
          <button
            onClick={async () => {
              await deleteTransaction(tx._id);
              onDelete();
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
