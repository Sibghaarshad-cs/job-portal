"use client";

import { useEffect, useState } from "react";
import JobCard from "./JobCard";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/jobs");
        const data = await response.json();

        if (response.ok) {
          setJobs(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 mt-16">
        <h2 className="text-4xl font-bold text-gray-900">
          Recommended Jobs
        </h2>

        <p className="mt-6 text-gray-500">
          Loading jobs...
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 mt-16">

      {/* Heading */}

      <div className="mb-8">

        <h2 className="text-4xl font-bold text-gray-900">
          Recommended Jobs
        </h2>

        <p className="text-gray-500 mt-2">
          Jobs that match your profile and interests
        </p>

      </div>

      {/* No Jobs */}

      {jobs.length === 0 ? (
        <p className="text-gray-500 text-lg">
          No jobs available.
        </p>
      ) : (

        /* Jobs Grid */

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {jobs.map((job) => (
            <JobCard
              key={job.id}
              title={job.title}
              company={job.companyName}
              location={job.location}
              category={job.category}
              jobType={job.jobType}
              salaryMin={job.salaryMin}
              salaryMax={job.salaryMax}
              postedDate={new Date(job.postedAt).toLocaleDateString()}
            />
          ))}

        </div>
      )}

    </section>
  );
}