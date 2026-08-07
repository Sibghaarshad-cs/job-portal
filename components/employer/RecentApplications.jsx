"use client";

function formatRelativeTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function RecentApplications({ applications = [] }) {

  function statusClasses(status) {
    const s = String(status || "").toUpperCase();
    switch (s) {
      case "NEW":
      case "APPLIED":
        return "bg-blue-100 text-blue-700";

      case "IN_REVIEW":
        return "bg-purple-100 text-purple-700";

      case "INTERVIEW":
        return "bg-orange-100 text-orange-700";

      case "HIRED":
      case "ACCEPTED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function statusText(status) {
    const s = String(status || "").toUpperCase();
    switch (s) {
      case "NEW":
      case "APPLIED":
        return "New";

      case "IN_REVIEW":
        return "In Review";

      case "INTERVIEW":
        return "Interview";

      case "HIRED":
      case "ACCEPTED":
        return "Hired";

      case "REJECTED":
        return "Rejected";

      default:
        return status;
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mt-8">

      {/* Heading */}

      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Recent Applications
      </h2>

      {/* List */}

      <div className="space-y-4">

        {applications.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">
            No applications received yet.
          </div>
        ) : (
          applications.map((application) => (

            <div
              key={application.id}
              className="flex items-center justify-between border border-gray-100 rounded-xl px-5 py-4 hover:bg-gray-50 transition"
            >

              {/* Left */}

              <div className="flex items-center gap-4">

                {/* Avatar */}

                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 text-white flex items-center justify-center font-semibold">

                  {application.applicant
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}

                </div>

                {/* Name */}

                <div>

                  <h3 className="font-semibold text-gray-900">
                    {application.applicant}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {application.job}
                  </p>

                </div>

              </div>

              {/* Right */}

              <div className="flex items-center gap-8">

                <p className="text-sm text-gray-500">
                  {formatRelativeTime(application.appliedAt)}
                </p>

                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${statusClasses(
                    application.status
                  )}`}
                >
                  {statusText(application.status)}
                </span>

              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}