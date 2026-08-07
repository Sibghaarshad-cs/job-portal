import {
  BriefcaseBusiness,
  FileText,
  Users,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";

export default function StatsCards({ stats = {} }) {
  const activeJobs = stats?.activeJobs ?? 0;
  const totalJobs = stats?.totalJobs ?? 0;
  const totalApplications = stats?.totalApplications ?? 0;
  const hiredApplications = stats?.hiredApplications ?? 0;

  return (
   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

      {/* Active Jobs */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

        <div className="flex items-start gap-4">

          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
            <BriefcaseBusiness
              size={32}
              className="text-blue-600"
            />
          </div>

          <div>
            <h3 className="text-gray-700 font-semibold">
              Active Jobs
            </h3>

            <p className="text-5xl font-bold text-gray-900 mt-2">
              {activeJobs}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2 mt-6">

          <TrendingUp
            size={18}
            className="text-green-500"
          />

          

        </div>

      </div>
{/* Total Jobs Posted */}

<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

  <div className="flex items-start gap-4">

    <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">

      <FileText
        size={32}
        className="text-orange-600"
      />

    </div>

    <div>

      <h3 className="text-gray-700 font-semibold">
        Total Jobs Posted
      </h3>

      <p className="text-5xl font-bold text-gray-900 mt-2">
        {totalJobs}
      </p>

    </div>

  </div>

  <div className="flex items-center gap-2 mt-6">

    <TrendingUp
      size={18}
      className="text-green-500"
    />

   

  </div>

</div>
      {/* Total Applications */}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

        <div className="flex items-start gap-4">

          <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">

            <Users
              size={32}
              className="text-green-600"
            />

          </div>

          <div>

            <h3 className="text-gray-700 font-semibold">
              Total Applications
            </h3>

            <p className="text-5xl font-bold text-gray-900 mt-2">
              {totalApplications}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2 mt-6">

          <TrendingUp
            size={18}
            className="text-green-500"
          />

          
        </div>

      </div>

      {/* Hired Candidates */}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

        <div className="flex items-start gap-4">

          <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center">

            <BadgeCheck
              size={32}
              className="text-violet-600"
            />

          </div>

          <div>

            <h3 className="text-gray-700 font-semibold">
              Hired Candidates
            </h3>

            <p className="text-5xl font-bold text-gray-900 mt-2">
              {hiredApplications}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2 mt-6">

          <TrendingUp
            size={18}
            className="text-green-500"
          />

          
        </div>

      </div>

    </div>
  );
}