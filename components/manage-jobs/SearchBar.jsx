"use client";

import { Search } from "lucide-react";

export default function SearchBar({ search, setSearch }) {
  return (
    <div className="relative flex-1">

      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full h-12 rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
      />

    </div>
  );
}