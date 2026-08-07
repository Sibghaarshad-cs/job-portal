"use client";

import {
  Users,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function JobRow({
  job,
  onDelete,
  onToggleStatus,
}) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-12 items-center px-8 py-5 border-b border-gray-200 hover:bg-gray-50 transition">

      {/* Job Title */}

      <div className="col-span-5">

        <h3 className="text-base font-semibold text-gray-900">
          {job.title}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {job.companyName}
        </p>

      </div>

      {/* Status */}

      <div className="col-span-2 flex justify-center">

        <span
          className={`px-4 py-1 rounded-full text-sm font-medium ${
            job.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {job.status}
        </span>

      </div>

      {/* Applicants */}

      <button
        onClick={() => router.push(`/employer/applications?jobId=${job.id}`)}
        className="col-span-2 flex justify-center items-center gap-2 text-violet-600 font-medium hover:bg-violet-50 rounded-full px-3 py-2 transition"
      >
        <Users size={18} />

        <span>{job._count?.applications ?? 0}</span>

      </button>

      {/* Actions */}

      <div className="col-span-3 flex justify-center items-center gap-6">

        {/* Edit */}

        <button
          onClick={() =>
            router.push(`/employer/post-job?id=${job.id}`)
          }
          className="text-blue-600 hover:text-blue-700"
        >
          <Pencil size={18} />
        </button>

        {/* Close */}

        <button
          onClick={() => onToggleStatus(job.id, job.status)}
          className="flex items-center gap-1 text-orange-600 hover:text-orange-700"
        >
          <X size={16} />

          {job.status === "Active"
            ? "Close"
            : "Reopen"}

        </button>

        {/* Delete */}

        <button
          onClick={() => onDelete(job.id)}
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 size={18} />
        </button>

      </div>

    </div>
  );
}