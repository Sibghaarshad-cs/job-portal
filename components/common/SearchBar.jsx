"use client";

import { Search, MapPin } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    console.log({
      search,
      location,
    });

    // Later:
    // GET /api/jobs?search=&location=
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">

      {/* Search */}

      <div className="relative flex-1">

        <Search
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Job title, company, or keywords"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            h-16
            rounded-2xl
            border
            border-gray-200
            bg-white
            pl-14
            pr-5
            text-gray-700
            placeholder:text-gray-400
            outline-none
            focus:border-violet-500
            focus:ring-4
            focus:ring-violet-100
            transition
          "
        />

      </div>

      {/* Location */}

      <div className="relative lg:w-80">

        <MapPin
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="
            w-full
            h-16
            rounded-2xl
            border
            border-gray-200
            bg-white
            pl-14
            pr-5
            text-gray-700
            placeholder:text-gray-400
            outline-none
            focus:border-violet-500
            focus:ring-4
            focus:ring-violet-100
            transition
          "
        />

      </div>

      {/* Button */}

      <button
        onClick={handleSearch}
        className="
          h-16
          px-10
          rounded-2xl
          bg-gradient-to-r
          from-violet-600
          to-blue-600
          text-white
          font-semibold
          hover:opacity-95
          shadow-lg
          transition
        "
      >
        Search Jobs
      </button>

    </div>
  );
}