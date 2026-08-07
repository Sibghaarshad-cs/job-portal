import Sidebar from "../../components/candidate/Sidebar";
import TopNavbar from "../../components/candidate/TopNavbar";
import SearchBar from "../../components/common/SearchBar";
import JobList from "../../components/common/JobList";

export default function JobsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1">

        {/* Top Navbar */}
        <TopNavbar />

        <div className="p-8 space-y-6">
          
          {/* Search bar directly on top */}
          <div className="max-w-7xl mx-auto">
            <SearchBar />
          </div>

          {/* Recommended Jobs */}
          <JobList />

        </div>

      </main>

    </div>
  );
}