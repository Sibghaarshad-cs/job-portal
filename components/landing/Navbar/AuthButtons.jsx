"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AuthButtons() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes("userId="));
  }, []);

  const handleLogout = () => {
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    router.refresh();
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/jobs")}
          className="text-gray-700 hover:text-violet-600 font-semibold transition"
        >
          Job Seeker Portal
        </button>

        <button
          onClick={() => router.push("/employer/dashboard")}
          className="bg-violet-600 text-white px-5 py-2 rounded-lg hover:bg-violet-700 font-semibold transition"
        >
          Employer Portal
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-semibold transition ml-2"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/login"
        className="text-gray-700 hover:text-violet-600 font-semibold transition"
      >
        Login
      </Link>

      <Link
        href="/signup"
        className="bg-violet-600 text-white px-5 py-2 rounded-lg hover:bg-violet-700 font-semibold transition"
      >
        Sign Up
      </Link>
    </div>
  );
}