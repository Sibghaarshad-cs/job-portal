"use client";

import { useEffect, useState } from "react";
import JobCard from "../../common/JobCard";

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/jobs");

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();

        // Show only the latest 3 jobs
        setJobs(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    }

    fetchJobs();
  }, []);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-bold text-gray-900">
            Featured Jobs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              title={job.title}
              company={job.companyName}
              location={job.location}
              salaryMin={job.salaryMin}
              salaryMax={job.salaryMax}
              category={job.category}
              jobType={job.jobType}
              postedDate={new Date(job.postedAt).toLocaleDateString()}
            />
          ))}
        </div>
      </div>
    </section>
  );
}