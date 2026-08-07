import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "../../generated/prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import Sidebar from "../../../components/employer/Sidebar";
import TopNavbar from "../../../components/employer/TopNavbar";
import StatsCards from "../../../components/employer/StatsCards";
import RecentJobs from "../../../components/employer/RecentJobs";
import ApplicationStatus from "../../../components/employer/ApplicationStatus";
import RecentApplications from "../../../components/employer/RecentApplications";

const prisma = new PrismaClient();

async function getDashboardData() {
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get("userId")?.value;
  if (!userIdStr) {
    redirect("/login?next=/employer/dashboard");
  }
  const userId = Number(userIdStr);

  // Active jobs (status: "Active")
  const activeJobs = await prisma.job.count({
    where: { userId, status: "Active" },
  });

  // Total jobs posted
  const totalJobs = await prisma.job.count({
    where: { userId },
  });

  // Total applications for employer's jobs
  const totalApplications = await prisma.application.count({
    where: {
      job: { userId },
    },
  });

  // Hired applications (ACCEPTED)
  const hiredApplications = await prisma.application.count({
    where: {
      job: { userId },
      status: "ACCEPTED",
    },
  });

  // Fetch status breakdown
  const applicationsForStats = await prisma.application.findMany({
    where: {
      job: { userId },
    },
    select: {
      status: true,
    },
  });

  const statusCounts = {
    APPLIED: 0,
    INTERVIEW: 0,
    ACCEPTED: 0,
    REJECTED: 0,
  };
  applicationsForStats.forEach((app) => {
    if (statusCounts[app.status] !== undefined) {
      statusCounts[app.status]++;
    } else {
      const statusUpper = String(app.status).toUpperCase();
      if (statusCounts[statusUpper] !== undefined) {
        statusCounts[statusUpper]++;
      }
    }
  });

  // Fetch recent applications
  const recentApps = await prisma.application.findMany({
    where: {
      job: { userId },
    },
    orderBy: {
      appliedAt: "desc",
    },
    take: 5,
    include: {
      user: {
        select: {
          name: true,
        },
      },
      job: {
        select: {
          title: true,
        },
      },
    },
  });

  const formattedRecentApplications = recentApps.map((app) => ({
    id: app.id,
    applicant: app.user.name,
    job: app.job.title,
    status: app.status,
    appliedAt: app.appliedAt.toISOString(),
  }));

  return {
    stats: {
      activeJobs,
      totalJobs,
      totalApplications,
      hiredApplications,
    },
    statusCounts,
    recentApplications: formattedRecentApplications,
  };
}

export default async function EmployerDashboard() {
  const data = await getDashboardData();

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
          <StatsCards stats={data.stats} />

          {/* Recent Jobs + Application Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

            {/* Recent Job Posts */}
            <div className="lg:col-span-2">
              <RecentJobs />
            </div>

            {/* Application Status */}
            <div>
              <ApplicationStatus data={data.statusCounts} />
            </div>

          </div>

          {/* Recent Applications */}
          <div className="mt-8">
            <RecentApplications applications={data.recentApplications} />
          </div>

        </main>

      </div>

    </div>
  );
}