"use client";

import { useState, useEffect } from "react";
import { BriefcaseBusiness, User, Building2, LogOut, LayoutDashboard, Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [mode, setMode] = useState("JOB_SEEKER");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes("userId="));
    if (pathname?.startsWith("/employer")) {
      setMode("EMPLOYER");
    } else {
      setMode("JOB_SEEKER");
    }
  }, [pathname]);

  const handleLogout = () => {
    // Remove login cookie
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    router.push("/");
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    if (newMode === "EMPLOYER") {
      router.push("/employer/dashboard");
    } else {
      router.push("/jobs");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        
        {/* Left Side */}
        <div className="flex items-center gap-8">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow">
              <BriefcaseBusiness size={22} />
            </div>

            <h1 className="text-3xl font-bold">
              <span className="text-black">Job</span>
              <span className="text-violet-600">Portal</span>
            </h1>
          </div>

          {/* Navigation Links for Candidate */}
          {isLoggedIn && mode === "JOB_SEEKER" && (
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => router.push("/jobs")}
                className={`text-sm font-semibold transition ${
                  pathname === "/jobs" ? "text-violet-600" : "text-gray-600 hover:text-violet-600"
                }`}
              >
                Browse Jobs
              </button>
              <button
                onClick={() => router.push("/jobs/dashboard")}
                className={`text-sm font-semibold transition ${
                  pathname === "/jobs/dashboard" ? "text-violet-600" : "text-gray-600 hover:text-violet-600"
                }`}
              >
                My Dashboard
              </button>
            </div>
          )}

        </div>

        {/* Center Mode Selector */}
        <div className="hidden lg:flex items-center gap-5 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm">

          <span className="text-sm font-medium text-gray-600">
            Current Mode:
          </span>

          <button
            onClick={() => handleModeSwitch("JOB_SEEKER")}
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
            onClick={() => handleModeSwitch("EMPLOYER")}
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
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-white font-medium transition hover:bg-violet-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className="text-gray-600 hover:text-violet-600 font-semibold text-sm transition"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-white font-semibold transition hover:bg-violet-700"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}