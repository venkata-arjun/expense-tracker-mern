import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, User as UserIcon } from "lucide-react";

export default function MobileSidebarNav({ tabs, activeTab, setActiveTab }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="sm:hidden">
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white shadow-md border border-gray-200"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="w-7 h-7 text-indigo-700" />
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
        >
          <nav
            className="absolute top-0 left-0 h-full w-64 bg-white shadow-2xl p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold text-indigo-700">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow"
                      : "text-gray-700 hover:bg-indigo-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
            {/* Profile link at bottom */}
            <button
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 text-gray-700 hover:bg-indigo-50 mt-8 border-t pt-6"
              style={{ marginTop: "auto" }}
            >
              <UserIcon className="w-5 h-5" />
              Profile
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
