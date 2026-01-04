export default function BudgetList({ budgets }) {
  if (!budgets.length) return <p>No budgets set</p>;

  return (
    <div>
      <h3>Budgets</h3>
      {budgets.map((b) => (
        <div key={b._id}>
          <strong>{b.category}</strong>
          <div>
            ₹{b.spent} / ₹{b.limit} ({b.percentUsed}%)
          </div>

          {b.percentUsed >= 100 && (
            <p style={{ color: "red" }}>Budget exceeded</p>
          )}

          {b.percentUsed >= 80 && b.percentUsed < 100 && (
            <p style={{ color: "orange" }}>Approaching limit</p>
          )}
        </div>
      ))}
    </div>
  );
}
