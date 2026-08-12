"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import JobCard from "./JobCard";

export default function JobList() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);

      try {
        const queryString = searchParams.toString();
        const response = await fetch(
          `/api/jobs${queryString ? `?${queryString}` : ""}`
        );
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
  }, [searchParams]);

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
    All Job Listings
  </h2>

  <p className="text-gray-500 mt-2">
    Browse available positions from companies hiring  around the world.
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
              salaryCurrency={job.salaryCurrency}
              postedDate={new Date(job.postedAt).toLocaleDateString()}
              href={`/jobs/apply?jobId=${job.id}`}
            />
          ))}

        </div>
      )}

    </section>
  );
}