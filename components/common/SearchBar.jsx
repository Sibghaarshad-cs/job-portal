"use client";

import { Search, Layers, BriefcaseBusiness } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [jobType, setJobType] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (jobType) params.set("jobType", jobType);

    const queryString = params.toString();
    router.push(`/jobs${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">

      <div className="relative">

        <Layers
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full h-16 rounded-2xl border border-gray-200 bg-white pl-14 pr-5 text-gray-700 text-sm focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition"
        >
          <option value="">All Categories</option>
          <option value="Software Development">Software Development</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="Finance">Finance</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Customer Support">Customer Support</option>
        </select>

      </div>

      <div className="relative">

        <BriefcaseBusiness
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="w-full h-16 rounded-2xl border border-gray-200 bg-white pl-14 pr-5 text-gray-700 text-sm focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition"
        >
          <option value="">All Job Types</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

      </div>

      <div className="flex items-end">
        <button
          onClick={handleSearch}
          className="w-full h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold hover:opacity-95 shadow-lg transition"
        >
          Search Jobs
        </button>
      </div>
    </div>
  );
}