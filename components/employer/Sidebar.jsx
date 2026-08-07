"use client";

import { useRouter } from "next/navigation";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  LogOut,
} from "lucide-react";

export default function Sidebar() {

  const router = useRouter();


  const handleLogout = () => {

    // Remove login cookie
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to landing page
    router.push("/");
  };


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


        <button 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-600 text-white font-medium"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </button>


        <button 
          onClick={() => router.push("/employer/post-job")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition"
        >
          <BriefcaseBusiness size={20} />
          Post Job
        </button>


        <button
  onClick={() => router.push("/employer/manage-jobs")}
  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition"
>
  <ClipboardList size={20} />
  Manage Jobs
</button>

        <button 
          onClick={() => router.push("/employer/applications")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition"
        >
          <FileText size={20} />
          Applications
        </button>


      </nav>




    </aside>
  );
}