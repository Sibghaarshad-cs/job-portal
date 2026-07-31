"use client";
import { Plus } from "lucide-react";

export default function TopNavbar() {
  return (
    <div className="flex items-center justify-between bg-white px-8 py-5 border-b border-gray-200">

      {/* Left Side */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back!
        </h1>

        <p className="text-gray-500 mt-1">
           Here's what's happening today.
        </p>
      </div>

      {/* Right Side */}
      <button
        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-xl font-medium transition"
      >
        <Plus size={20} />
        Post New Job
      </button>

    </div>
  );
}