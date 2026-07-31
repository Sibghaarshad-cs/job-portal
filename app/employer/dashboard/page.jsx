import Sidebar from "../../../components/employer/Sidebar";
import TopNavbar from "../../../components/employer/TopNavbar";
import StatsCards from "../../../components/employer/StatsCards";
import RecentJobs from "../../../components/employer/RecentJobs";
import ApplicationStatus from "../../../components/employer/ApplicationStatus";
import RecentApplications from "../../../components/employer/RecentApplications";

export default function EmployerDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">

        {/* Top Navbar */}
        <TopNavbar />

        {/* Page Content */}
        <main className="p-8">

          {/* Statistics Cards */}
          <StatsCards />

          {/* Recent Jobs + Application Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

            {/* Recent Job Posts */}
            <div className="lg:col-span-2">
              <RecentJobs />
            </div>

            {/* Application Status */}
            <div>
              <ApplicationStatus />
            </div>

          </div>

          {/* Recent Applications */}
          <div className="mt-8">
            <RecentApplications />
          </div>

        </main>

      </div>

    </div>
  );
}