import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Calendar } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No user data found.</p>
        </div>
      </div>
    );
  }

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Light header background */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 h-32"></div>

          {/* Avatar centered on header */}
          <div className="relative px-8 -mt-12">
            <div className="w-28 h-28 bg-white rounded-full p-2 shadow-2xl mx-auto">
              <div className="w-full h-full bg-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="text-center mt-6 px-8 pb-10">
            <h1 className="text-3xl font-bold text-gray-900">
              {user.name || "User"}
            </h1>
            <p className="text-gray-600 mt-2 flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              {user.email}
            </p>

            {/* Joined Date */}
            <div className="mt-10 bg-gray-50 rounded-2xl p-5">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <Calendar className="w-6 h-6 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-semibold text-lg">{joinedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
