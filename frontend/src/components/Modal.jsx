import React from "react";

export default function Modal({ open, onClose, children, size = "md" }) {
  if (!open) return null;
  // size: "sm" | "md" | "lg"
  const sizeClass =
    size === "sm"
      ? "max-w-md w-full"
      : size === "lg"
      ? "max-w-2xl w-full"
      : "max-w-lg w-full";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
      <div
        className={`bg-white rounded-2xl shadow-xl p-3 sm:p-6 relative ${sizeClass}`}
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
