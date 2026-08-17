"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../../../components/employer/Sidebar";
import TopNavbar from "../../../components/employer/TopNavbar";

const STATUS_OPTIONS = [
  { value: "APPLIED", label: "Applied" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
];

const statusLabel = (status) =>
  STATUS_OPTIONS.find((option) => option.value === status)?.label || status;

const formatAppliedDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}${suffix} ${month} ${year}`;
};

export default function ApplicationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          Loading applications...
        </div>
      }
    >
      <ApplicationsPageContent />
    </Suspense>
  );
}

function ApplicationsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const jobId = searchParams.get("jobId");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true);
        setError(null);

        const target = jobId
          ? `/api/employer/applications?jobId=${jobId}`
          : "/api/employer/applications";

        const response = await fetch(target);

        if (response.status === 401) {
          router.push(
            `/login?next=${encodeURIComponent(
              `/employer/applications${jobId ? `?jobId=${jobId}` : ""}`
            )}`
          );
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load applications.");
        } else {
          setApplications(data);
        }
      } catch (err) {
        console.error("LOAD APPLICATIONS ERROR:", err);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, [jobId, router]);

  const updateStatus = async (applicationId, newStatus) => {
    setSavingId(applicationId);
    setError(null);

    try {
      const response = await fetch("/api/employer/applications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update status.");
      } else {
        setApplications((current) =>
          current.map((application) =>
            application.id === data.id ? data : application
          )
        );
      }
    } catch (err) {
      console.error("UPDATE STATUS ERROR:", err);
      setError("Failed to update status.");
    } finally {
      setSavingId(null);
    }
  };

  const applicationCount = applications.length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1">
        <TopNavbar />

        <div className="p-8">
          {/* ================= HEADER ================= */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    jobId
                      ? "/employer/manage-jobs"
                      : "/employer/dashboard"
                  )
                }
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                ← Back
              </button>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Applications Overview
                </h1>
              </div>
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          {loading ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              Loading applications...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-white p-6 text-center text-red-600 shadow-sm">
              {error}
            </div>
          ) : (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {applicationCount} Applications
                </h2>
              </div>

              <div className="space-y-4">
                {applications.length === 0 ? (
                  <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                    <p className="text-xl font-semibold text-gray-900">
                      No applications yet
                    </p>

                    <p className="mt-2 text-gray-500">
                      Once someone applies to your job, they'll appear here.
                    </p>
                  </div>
                ) : (
                  applications.map((application) => (
                    <div
                      key={application.id}
                      onClick={() =>
                        router.push(
                          `/employer/applications/${application.id}`
                        )
                      }
                      className="flex cursor-pointer flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                    >
                      {/* ================= APPLICANT INFO ================= */}
                      <div className="flex flex-1 items-start gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-100 text-xl font-semibold text-blue-700">
                          {application.user.name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </div>

                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            {application.user.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {application.user.email}
                          </p>

                          <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-4 w-4"
                              >
                                <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />

                                <path
                                  fillRule="evenodd"
                                  d="M2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0zm9.75-7.5a7.5 7.5 0 00-6.28 12.14A6.244 6.244 0 0112 15.75a6.244 6.244 0 015.03 1.89A7.5 7.5 0 0012 4.5z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>

                            Applied{" "}
                            {formatAppliedDate(application.appliedAt)}
                          </p>
                        </div>
                      </div>

                      {/* ================= ACTIONS ================= */}
                      <div className="flex flex-wrap items-center justify-end gap-3">
                        {/* DOWNLOAD RESUME */}
                        {application.resume ? (
                          <a
                            href={
                              application.resume.startsWith("http")
                                ? application.resume
                                : application.resume.startsWith("/")
                                ? application.resume
                                : `/${application.resume}`
                            }
                            download={
                              application.resume.split("/").pop() ||
                              `resume-${application.id}.pdf`
                            }
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                            className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                          >
                            Download Resume
                          </a>
                        ) : (
                          <span
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                            className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-500"
                          >
                            No Resume
                          </span>
                        )}

                        {/* CV SCORE */}
                        <div
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                          className="inline-flex items-center justify-center rounded-2xl border border-violet-200 bg-violet-50 px-5 py-3"
                        >
                          <span className="text-sm font-semibold text-violet-700">
                            CV Score:{" "}
                            {application.cvScore !== null &&
                            application.cvScore !== undefined
                              ? `${application.cvScore}%`
                              : "Not available"}
                          </span>
                        </div>

                        {/* STATUS */}
                        <div
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                          className="relative inline-flex min-w-[150px] items-center rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
                        >
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
                            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />

                            {statusLabel(application.status)}
                          </span>

                          <select
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            value={application.status}
                            onChange={(event) =>
                              updateStatus(
                                application.id,
                                event.target.value
                              )
                            }
                            disabled={savingId === application.id}
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>

                          <span className="pointer-events-none absolute right-3 text-gray-400">
                            ▾
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}