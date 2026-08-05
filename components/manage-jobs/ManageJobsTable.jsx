"use client";

import { useEffect, useState } from "react";

import SearchBar from "./SearchBar";
import StatusFilter from "./StatusFilter";
import JobRow from "./JobRow";
import EmptyState from "./EmptyState";

export default function ManageJobsTable() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  useEffect(() => {
    fetchJobs();
  }, []);

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Placeholder (we'll connect these in the next step)

  async function handleDelete(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this job?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(`/api/employer/jobs/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);

      fetchJobs();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
  }
}
 async function handleToggleStatus(id) {
  try {
    const response = await fetch(
      `/api/employer/jobs/${id}`,
      {
        method: "PATCH",
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert(data.message);

      // Reload jobs
      fetchJobs();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
  }
}

  // Search

  let filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  // Status Filter

  if (status !== "ALL") {
    filteredJobs = filteredJobs.filter(
      (job) => job.status === status
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200">
        Loading jobs...
      </div>
    );
  }

  if (jobs.length === 0) {
    return <EmptyState />;
  }

 return (
  <div className="space-y-6">

    {/* Search + Filter (Outside Card) */}

    <div className="flex flex-col md:flex-row justify-between gap-4">

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <StatusFilter
        status={status}
        setStatus={setStatus}
      />

    </div>

    {/* Table */}

    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      {/* Header */}

      <div className="grid grid-cols-12 items-center px-8 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">

        <div className="col-span-5">
          Job Title
        </div>

        <div className="col-span-2 text-center">
          Status
        </div>

        <div className="col-span-2 text-center">
          Applicants
        </div>

        <div className="col-span-3 text-center">
          Actions
        </div>

      </div>

      {/* Rows */}

      {filteredJobs.length === 0 ? (

        <div className="p-8">
          <EmptyState />
        </div>

      ) : (

        filteredJobs.map((job) => (
          <JobRow
            key={job.id}
            job={job}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        ))

      )}

    </div>

  </div>
);
}