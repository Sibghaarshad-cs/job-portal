import Link from "next/link";
import { Search, BriefcaseBusiness } from "lucide-react";

export default function HeroButtons() {
  return (
    <div className="flex flex-wrap gap-4 mt-8">
      
      <Link
        href="/jobs"
        className="flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl hover:bg-violet-700 transition"
      >
        <Search size={18} />
        Find Jobs
      </Link>

      <Link
        href="/signup"
        className="flex items-center gap-2 border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100 transition"
      >
        <BriefcaseBusiness size={18} />
        Post a Job
      </Link>

    </div>
  );
}