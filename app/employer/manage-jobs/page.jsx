import Sidebar from "../../../components/employer/Sidebar";
import TopNavbar from "../../../components/employer/TopNavbar";
import ManageJobsTable from "../../../components/manage-jobs/ManageJobsTable";

export default function ManageJobsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1">

        {/* Top Navbar */}
        <TopNavbar />

        <div className="p-8">

          {/* Heading */}
          <div className="mb-8">

            <h1 className="text-3xl font-bold text-gray-900">
              Manage Jobs
            </h1>

            <p className="text-gray-500 mt-2">
              View, edit and manage all your posted jobs.
            </p>

          </div>

          {/* Jobs Table */}
          <ManageJobsTable />

        </div>

      </main>

    </div>
  );
}