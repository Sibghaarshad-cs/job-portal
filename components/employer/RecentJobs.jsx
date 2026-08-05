"use client";

import { useState, useEffect } from "react";
import {
  BriefcaseBusiness,
  MapPin,
  CalendarDays,
} from "lucide-react";

export default function RecentJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/employer/jobs");
        const data = await response.json();

        if (response.ok) {
          setJobs(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  const displayedJobs = showAll ? jobs : jobs.slice(0, 3);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Jobs Posted
        </h2>

        <p className="text-gray-500">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full">

      {/* Heading */}

      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Jobs Posted
      </h2>

      {/* No Jobs */}

      {jobs.length === 0 ? (
        <p className="text-gray-500">
          You haven't posted any jobs yet.
        </p>
      ) : (
        <>
          <div className="space-y-5">

            {displayedJobs.map((job) => (

              <div
                key={job.id}
                className="flex items-start gap-4 border-b border-gray-100 pb-5 last:border-none last:pb-0"
              >

                {/* Icon */}

                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">

                  <BriefcaseBusiness
                    className="text-violet-600"
                    size={24}
                  />

                </div>

                {/* Content */}

                <div className="flex-1">

                  <h3 className="font-semibold text-gray-900">
                    {job.title}
                  </h3>

                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">

                    <div className="flex items-center gap-1">
                      <MapPin size={15} />
                      {job.location}
                    </div>

                    <div className="flex items-center gap-1">
                      <CalendarDays size={15} />
                      {new Date(job.postedAt).toLocaleDateString()}
                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {jobs.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="mt-6 w-full text-center text-violet-600 font-semibold hover:text-violet-700 transition"
            >
              {showAll ? "Show Less ↑" : "View All Jobs ↓"}
            </button>
          )}
        </>
      )}

    </div>
  );
}