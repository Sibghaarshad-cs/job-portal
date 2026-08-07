import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "../../../generated/prisma/client";
import Sidebar from "../../../../components/employer/Sidebar";
import TopNavbar from "../../../../components/employer/TopNavbar";

const prisma = new PrismaClient();

const formatAppliedDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${month} ${day}${suffix}, ${year} at ${hours}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;
};

export default async function ApplicationDetailPage({ params, searchParams }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const applicationId = Number(params?.id);
  const showResumePreview = searchParams?.viewResume === "1";

  if (!userId) {
    redirect("/login?next=/employer/applications");
  }

  if (!Number.isInteger(applicationId) || applicationId <= 0) {
    redirect("/employer/applications");
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      user: true,
      job: true,
    },
  });

  if (!application || application.job.userId !== Number(userId)) {
    redirect("/employer/applications");
  }

  const resumeFileName = application.resume?.split("/").pop() || "Resume.pdf";
  const resumeUrl = application.resume
    ? application.resume.startsWith("http")
      ? application.resume
      : application.resume.startsWith("/")
        ? application.resume
        : `/${application.resume}`
    : "#";
  const resumeExtension = resumeFileName.split(".").pop()?.toLowerCase() || "";
  const canPreviewInBrowser = ["pdf", "png", "jpg", "jpeg", "gif", "webp"].includes(resumeExtension);
  const previewHref = resumeUrl !== "#" ? resumeUrl : undefined;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1">
        <TopNavbar />
        <div className="p-8">
          <div className="mb-8 rounded-[32px] bg-white p-8 shadow-sm">
            <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/employer/applications"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  ← Back to Applications
                </Link>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">{application.job.title}</p>
                  <h1 className="mt-2 text-3xl font-bold text-slate-900">{application.user.name}</h1>
                  <p className="mt-2 text-sm text-slate-500">{application.user.email}</p>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Applied on</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{formatAppliedDate(application.appliedAt)}</p>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="mb-4 flex items-center gap-3 text-slate-900">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-200 text-xl">👤</span>
                  <div>
                    <h2 className="text-base font-semibold">Personal Information</h2>
                    <p className="text-sm text-slate-500">Name, email and contact.</p>
                  </div>
                </div>
                <div className="space-y-4 text-sm text-slate-700">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Name</p>
                    <p className="mt-2 font-semibold text-slate-900">{application.user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Email</p>
                    <p className="mt-2 font-semibold text-slate-900">{application.user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Contact</p>
                    <p className="mt-2 font-semibold text-slate-900">{application.user.contactNumber || "—"}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="mb-4 flex items-center gap-3 text-slate-900">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-200 text-xl">📄</span>
                  <div>
                    <h2 className="text-base font-semibold">Application Details</h2>
                    <p className="text-sm text-slate-500">Salary, availability and cover letter.</p>
                  </div>
                </div>
                <div className="space-y-4 text-sm text-slate-700">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Expected Salary (PKR)</p>
                    <p className="mt-2 font-semibold text-slate-900">{application.expectedSalary?.toLocaleString() || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Available From</p>
                    <p className="mt-2 font-semibold text-slate-900">{application.availableFrom ? new Date(application.availableFrom).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Cover Letter</p>
                    <div className="mt-2 rounded-3xl bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm">
                      {application.coverLetter || "No cover letter provided."}
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="mb-4 flex items-center gap-3 text-slate-900">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-200 text-xl">📄</span>
                  <div>
                    <h2 className="text-base font-semibold">CV / Resume</h2>
                    <p className="text-sm text-slate-500">Open the uploaded resume and return to the application list.</p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm">
                  <div>
                    <p className="font-semibold text-slate-900">{resumeFileName}</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">PDF • {application.resume ? "uploaded" : "not uploaded"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {application.resume ? (
                      <a
                        href={previewHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Download Resume
                      </a>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
                        No Resume
                      </span>
                    )}
                    {application.resume ? (
                      <a
                        href={resumeUrl}
                        download={resumeFileName}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                      >
                        Download
                      </a>
                    ) : null}
                  </div>
                </div>
                {showResumePreview && application.resume ? (
                  <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">Resume Preview</h3>
                        <p className="text-sm text-slate-500">The uploaded file will open in a new tab. Use the back link to return to the application details.</p>
                      </div>
                      <Link
                        href={`/employer/applications/${application.id}`}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        ← Back
                      </Link>
                    </div>
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                      <p className="text-base font-semibold text-slate-900">Your browser should open the resume in a new tab.</p>
                      <p className="mt-2 text-sm text-slate-500">If it does not, use the button below to download it directly.</p>
                      <div className="mt-4 flex justify-center gap-3">
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                        >
                          Open Resume
                        </a>
                        <a
                          href={resumeUrl}
                          download={resumeFileName}
                          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
