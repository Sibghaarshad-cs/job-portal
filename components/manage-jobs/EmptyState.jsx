"use client";

import { BriefcaseBusiness } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmptyState() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">

      <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mx-auto">

        <BriefcaseBusiness
          size={38}
          className="text-violet-600"
        />

      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-6">
        No Jobs Posted Yet
      </h2>

      <p className="text-gray-500 mt-2">
        Start by posting your first job.
      </p>

      <button
        onClick={() => router.push("/employer/post-job")}
        className="mt-6 px-6 py-3 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition"
      >
        Post Job
      </button>

    </div>
  );
}
