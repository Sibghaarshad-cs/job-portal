"use client";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">

      {/* Logo */}
      <div className="px-8 py-8 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-violet-600">
          JobPortal
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Employer Portal
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 px-4 space-y-2">

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-600 text-white font-medium">
          <LayoutDashboard size={20} />
          Dashboard
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition">
          <BriefcaseBusiness size={20} />
          Post Job
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition">
          <ClipboardList size={20} />
          Manage Jobs
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition">
          <FileText size={20} />
          Applications
        </button>

      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition">
          <LogOut size={20} />
          Logout
        </button>
      </div>

    </aside>
  );
}