"use client";

export default function RecentApplications() {

  // Dummy data
  // Later this will come from Prisma

  const applications = [
    {
      id: 1,
      applicant: "David Jackson",
      job: "Financial Analyst",
      status: "NEW",
      applied: "3 days ago",
    },
    {
      id: 2,
      applicant: "Sarah Johnson",
      job: "DevOps Engineer",
      status: "IN_REVIEW",
      applied: "3 days ago",
    },
    {
      id: 3,
      applicant: "Michael Thompson",
      job: "Sales Manager",
      status: "INTERVIEW",
      applied: "3 days ago",
    },
  ];

  function statusClasses(status) {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-700";

      case "IN_REVIEW":
        return "bg-purple-100 text-purple-700";

      case "INTERVIEW":
        return "bg-orange-100 text-orange-700";

      case "HIRED":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function statusText(status) {
    switch (status) {
      case "NEW":
        return "New";

      case "IN_REVIEW":
        return "In Review";

      case "INTERVIEW":
        return "Interview";

      case "HIRED":
        return "Hired";

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

        {applications.map((application) => (

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
                {application.applied}
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

        ))}

      </div>

    </div>
  );
}