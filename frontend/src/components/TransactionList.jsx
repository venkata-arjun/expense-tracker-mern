import { deleteTransaction } from "../api/transactions";

export default function TransactionList({ transactions, onDelete }) {
  if (!transactions.length) return <p>No transactions</p>;

  return (
    <ul>
      {transactions.map((tx) => (
        <li key={tx._id}>
          <strong>{tx.category}</strong> — ₹{tx.amount} ({tx.type})
          <button
            onClick={async () => {
              await deleteTransaction(tx._id);
              onDelete();
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
