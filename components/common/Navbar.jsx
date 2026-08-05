"use client";

import { useState } from "react";
import { BriefcaseBusiness, User, Building2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const [mode, setMode] = useState("JOB_SEEKER");

  const handleLogout = () => {
    // Later:
    // Call logout API
    // Clear cookies/session

    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        
        {/* Left Side */}
        <div className="flex items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow">
              <BriefcaseBusiness size={22} />
            </div>

            <h1 className="text-3xl font-bold">
              <span className="text-black">Job</span>
              <span className="text-violet-600">Portal</span>
            </h1>
          </div>

        </div>

        {/* Center */}
        <div className="hidden lg:flex items-center gap-5 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm">

          <span className="text-sm font-medium text-gray-600">
            Current Mode:
          </span>

          <button
            onClick={() => setMode("JOB_SEEKER")}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${
              mode === "JOB_SEEKER"
                ? "bg-violet-100 text-violet-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <User size={16} />
            Job Seeker
          </button>

          <button
            onClick={() => setMode("EMPLOYER")}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${
              mode === "EMPLOYER"
                ? "bg-violet-100 text-violet-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Building2 size={16} />
            Employer
          </button>

        </div>

        {/* Right Side */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-white font-medium transition hover:bg-violet-700"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>
    </nav>
  );
}