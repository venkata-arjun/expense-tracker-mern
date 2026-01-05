import { useState } from "react";
import { createAccount, updateAccount, deleteAccount } from "../api/accounts";
import { Plus, Trash2, Pencil, X } from "lucide-react";

export default function AccountList({ accounts = [], fetchAccounts }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  const [addForm, setAddForm] = useState({
    name: "",
    balance: "",
    type: "cash",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    balance: "",
    type: "cash",
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.balance) return;

    setLoading(true);
    try {
      await createAccount({
        name: addForm.name.trim(),
        balance: Number(addForm.balance),
        type: addForm.type,
      });
      setAddForm({ name: "", balance: "", type: "cash" });
      setShowAddForm(false);
      fetchAccounts?.();
    } catch (err) {
      alert("Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.balance) return;

    setLoading(true);
    try {
      await updateAccount(editingAccount._id, {
        name: editForm.name.trim(),
        balance: Number(editForm.balance),
        type: editForm.type,
      });
      setEditingAccount(null);
      fetchAccounts?.();
    } catch (err) {
      alert("Failed to update account.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?"))
      return;

    try {
      await deleteAccount(id);
      fetchAccounts?.();
    } catch (err) {
      alert("Failed to delete account.");
    }
  };

  const openEdit = (acc) => {
    setEditingAccount(acc);
    setEditForm({
      name: acc.name,
      balance: acc.balance,
      type: acc.type,
    });
  };

  const closeModal = () => {
    setShowAddForm(false);
    setEditingAccount(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Accounts</h2>
          <p className="text-gray-600 mt-1">
            {accounts.length} account{accounts.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add Account
        </button>
      </div>

      {/* Accounts Grid */}
      {accounts.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No accounts yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((acc) => (
            <div
              key={acc._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {acc.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {acc.type === "upi"
                      ? "UPI"
                      : acc.type.charAt(0).toUpperCase() + acc.type.slice(1)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(acc)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                    title="Edit"
                  >
                    <Pencil className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(acc._id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-3xl font-extrabold text-gray-800">
                  ₹{Number(acc.balance).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button (Mobile Only) */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-6 right-6 sm:hidden bg-indigo-600 hover:bg-indigo-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition z-40"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Modal Overlay */}
      {(showAddForm || editingAccount) && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold">
                {editingAccount ? "Edit Account" : "Add New Account"}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={editingAccount ? handleEditSubmit : handleAddSubmit}
              className="p-6 space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  required
                  value={editingAccount ? editForm.name : addForm.name}
                  onChange={(e) =>
                    editingAccount
                      ? setEditForm({ ...editForm, name: e.target.value })
                      : setAddForm({ ...addForm, name: e.target.value })
                  }
                  placeholder="e.g., Cash Wallet, HDFC Savings"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  value={editingAccount ? editForm.type : addForm.type}
                  onChange={(e) =>
                    editingAccount
                      ? setEditForm({ ...editForm, type: e.target.value })
                      : setAddForm({ ...addForm, type: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="bank">Bank Account</option>
                  <option value="credit">Credit Card</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {editingAccount ? "Current Balance" : "Initial Balance"}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={editingAccount ? editForm.balance : addForm.balance}
                  onChange={(e) =>
                    editingAccount
                      ? setEditForm({ ...editForm, balance: e.target.value })
                      : setAddForm({ ...addForm, balance: e.target.value })
                  }
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition disabled:opacity-70"
                >
                  {loading
                    ? "Saving..."
                    : editingAccount
                    ? "Save Changes"
                    : "Add Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
