"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Building2,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // Remove login cookie
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Redirect to landing page
    router.push("/");
  };

  const isActive = (path) => {
    if (path === "/jobs/dashboard") {
      return pathname === path;
    }
    return pathname === path;
  };

  const getLinkClasses = (path) => {
    const active = isActive(path);
    return `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
      active
        ? "bg-violet-600 text-white shadow-sm"
        : "text-gray-700 hover:bg-violet-50 hover:text-violet-600"
    }`;
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="px-8 py-8 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-violet-600">
          JobPortal
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Job Seeker Portal
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 px-4 space-y-2">
        <button 
          onClick={() => router.push("/jobs/dashboard")}
          className={getLinkClasses("/jobs/dashboard")}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </button>

        <button 
          onClick={() => router.push("/jobs")}
          className={getLinkClasses("/jobs")}
        >
          <BriefcaseBusiness size={20} />
          Browse Jobs
        </button>
      </nav>

      {/* Switch / Logout */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        <button 
          onClick={() => router.push("/employer/dashboard")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-violet-600 hover:bg-violet-50 font-medium transition"
        >
          <Building2 size={20} />
          Switch to Employer
        </button>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
