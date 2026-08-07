import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "../../generated/prisma/client";
import Sidebar from "../../../components/candidate/Sidebar";
import TopNavbar from "../../../components/candidate/TopNavbar";
import JobSeekerDashboardContent from "../../../components/common/JobSeekerDashboardContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const prisma = new PrismaClient();

export default async function JobSeekerDashboard() {
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get("userId")?.value;
  if (!userIdStr) {
    redirect("/login?next=/jobs/dashboard");
  }
  const userId = Number(userIdStr);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    redirect("/login?next=/jobs/dashboard");
  }

  const applications = await prisma.application.findMany({
    where: { userId },
    include: {
      job: true,
    },
    orderBy: {
      appliedAt: "desc",
    },
  });

  const serializedApplications = applications.map((app) => ({
    id: app.id,
    status: app.status,
    appliedAt: app.appliedAt.toISOString(),
    job: {
      id: app.job.id,
      title: app.job.title,
      companyName: app.job.companyName,
      location: app.job.location,
      jobType: app.job.jobType,
      category: app.job.category,
      salaryMin: app.job.salaryMin,
      salaryMax: app.job.salaryMax,
    },
  }));

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1">
        <TopNavbar />
        <div className="p-8">
          <JobSeekerDashboardContent applications={serializedApplications} />
        </div>
      </main>
    </div>
  );
}
