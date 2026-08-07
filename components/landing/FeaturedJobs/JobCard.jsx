import Link from "next/link";

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
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition duration-300">

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

        <p className="text-gray-700 font-semibold">
          ${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()}
        </p>

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