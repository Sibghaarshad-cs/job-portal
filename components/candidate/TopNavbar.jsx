"use client";

import { useRouter, usePathname } from "next/navigation";

export default function TopNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const isDashboard = pathname === "/jobs/dashboard";

  return (
    <div className="flex items-center justify-between bg-white px-8 py-5 border-b border-gray-200">
      {/* Left Side */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back!
        </h1>
        <p className="text-gray-500 mt-1">
          Find your dream job today.
        </p>
      </div>

      {/* Right Side */}
      <div>
        {isDashboard ? (
          <button
            onClick={() => router.push("/jobs")}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-xl font-medium transition"
          >
            Browse Jobs
          </button>
        ) : (
          <button
            onClick={() => router.push("/jobs/dashboard")}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-xl font-medium transition"
          >
            My Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
