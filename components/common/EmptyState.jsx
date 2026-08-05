"use client";

import { SearchX } from "lucide-react";

export default function EmptyState() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-16 text-center">

        <div className="flex justify-center">

          <div className="w-24 h-24 rounded-full bg-violet-100 flex items-center justify-center">

            <SearchX
              size={48}
              className="text-violet-600"
            />

          </div>

        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-8">
          No Jobs Found
        </h2>

        <p className="text-gray-500 mt-3">
          We couldn't find any jobs matching your search.
          Try different keywords or another location.
        </p>

        <button
          className="
            mt-8
            bg-violet-600
            text-white
            px-8
            py-3
            rounded-xl
            hover:bg-violet-700
            transition
          "
        >
          Browse All Jobs
        </button>

      </div>

    </section>
  );
}