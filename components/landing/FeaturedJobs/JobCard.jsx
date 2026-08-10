"use client";

import { useState } from "react";
import Link from "next/link";

export default function JobCard({
  title,
  company,
  location,
  salaryMin,
  salaryMax,
  salaryCurrency,
  category,
  jobType,
  postedDate,
}) {
  const [displayCurrency, setDisplayCurrency] = useState(
    salaryCurrency || "PKR"
  );

  return (
    <div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900">
          {title}
        </h3>

        <p className="text-gray-500 mt-1">
          {company}
        </p>
      </div>

      <span className="inline-block mt-5 bg-violet-100 text-violet-600 text-sm font-medium px-3 py-1 rounded-full">
        {jobType}
      </span>

      <div className="mt-6 space-y-2 text-sm text-gray-500">
        <p>{location}</p>
        <p>{postedDate}</p>
      </div>

      <div className="flex justify-between items-center mt-8">

        <div>
          <p className="text-gray-700 font-semibold">
            {salaryCurrency === "PKR" && "Rs "}
            {salaryCurrency === "USD" && "$"}
            {salaryCurrency === "EUR" && "€"}
            {salaryCurrency === "GBP" && "£"}

            {salaryMin.toLocaleString()} - {salaryMax.toLocaleString()}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-500">
              View in:
            </span>

            <select
              value={displayCurrency}
              onChange={(e) => setDisplayCurrency(e.target.value)}
              className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value={salaryCurrency || "PKR"}>
                {salaryCurrency || "PKR"}
              </option>

              <option value="PKR">PKR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        <Link
          href="/login"
          className="border border-violet-500 text-violet-600 px-4 py-2 rounded-lg hover:bg-violet-600 hover:text-white transition"
        >
          Apply Now
        </Link>

      </div>
    </div>
  );
}