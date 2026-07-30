import Link from "next/link";
import JobCard from "./JobCard";
import { jobs } from "./jobsData";

export default function FeaturedJobs() {
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
              job={job}
            />
          ))}

        </div>

      </div>

    </section>
  );
}