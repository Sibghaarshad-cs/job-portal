"use client";

import {
  Building2,
  MapPin,
  CalendarDays,
} from "lucide-react";

export default function JobCard({
  title,
  company,
  location,
  salaryMin,
  salaryMax,
  category,
  jobType,
  postedDate,
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6">

      {/* Title */}
      <h3 className="text-2xl font-semibold text-gray-900">
        {title}
      </h3>

      {/* Company */}
      <div className="flex items-center gap-2 mt-2 text-gray-500">

        <Building2 size={16} />

        <span>{company}</span>

      </div>

      {/* Tags */}

      <div className="flex flex-wrap gap-3 mt-5">

        <span className="bg-green-100 text-green-700 text-sm px-4 py-1 rounded-full">
          {jobType}
        </span>

        <span className="bg-violet-100 text-violet-700 text-sm px-4 py-1 rounded-full">
          {category}
        </span>

      </div>

      {/* Bottom */}

      <div className="mt-8 flex items-end justify-between">

        <div>

          <div className="flex items-center gap-2 text-gray-500 text-sm">

            <MapPin size={16} />

            {location}

          </div>

          <div className="flex items-center gap-2 text-gray-500 text-sm mt-3">

            <CalendarDays size={16} />

            {postedDate}

          </div>

        </div>

        <div className="text-right">

          <h2 className="text-2xl font-bold text-violet-600">

            ${salaryMin} - ${salaryMax}

          </h2>

          <button
            className="
            mt-4
            border
            border-violet-600
            text-violet-600
            px-6
            py-2.5
            rounded-xl
            hover:bg-violet-600
            hover:text-white
            transition
            "
          >
            Apply Now
          </button>

        </div>

      </div>

    </div>
  );
}