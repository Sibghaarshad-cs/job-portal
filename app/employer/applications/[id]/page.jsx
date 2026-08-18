import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "../../../generated/prisma/client";
import Sidebar from "../../../../components/employer/Sidebar";
import TopNavbar from "../../../../components/employer/TopNavbar";

const prisma = new PrismaClient();

export default async function ApplicationDetailPage({ params }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  const { id } = await params;
  const applicationId = Number(id);

  // Check login
  if (!userId) {
    redirect(
      `/login?next=${encodeURIComponent(
        `/employer/applications/${applicationId}`
      )}`
    );
  }

  // Check valid application ID
  if (!Number.isInteger(applicationId) || applicationId <= 0) {
    redirect("/employer/applications");
  }

  // Get application
  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
    include: {
      user: true,
      job: true,
    },
  });

  // Check application exists and belongs to employer
  if (!application || application.job.userId !== Number(userId)) {
    redirect("/employer/applications");
  }

  const analysis = application.cvAnalysis || null;

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <TopNavbar />

        <div className="px-6 pb-10 pt-8 md:px-10 lg:px-12">
          {/* ================= PAGE HEADER ================= */}

          <div className="mb-8">
  {/* Header */}
  <div className="mt-8">
    <div className="flex items-center gap-4">
      <h1 className="text-[32px] font-bold tracking-[-0.5px] text-[#172B4D]">
        Application Details
      </h1>

      
    </div>

    <p className="mt-2 text-[15px] text-[#718096]">
      Applicant information and CV evaluation
    </p>
  </div>
</div>

          {/* ================= PERSONAL INFORMATION ================= */}

          <section className="mb-8 overflow-hidden rounded-[22px] bg-white shadow-[0_4px_20px_rgba(23,43,77,0.06)]">
            {/* Card Header */}
            <div className="border-b border-[#EDF2F7] px-7 py-6">
              <div className="flex items-center gap-4">
                {/* Header Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F1FF] text-[#2563EB]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 20.25a7.5 7.5 0 0115 0"
                    />
                  </svg>
                </div>

                <div>
                  <h2 className="text-[20px] font-bold text-[#172B4D]">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-sm text-[#7B8794]">
                    Applicant contact details
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid gap-4 p-6 md:grid-cols-3">
              {/* NAME */}
              <ContactCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 20.25a7.5 7.5 0 0115 0"
                    />
                  </svg>
                }
                label="Name"
                value={application.user.name}
                iconClass="bg-[#E8F1FF] text-[#2563EB]"
              />

              {/* PHONE */}
              <ContactCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 00-1.173.417l-.97 1.293a1.125 1.125 0 01-1.21.38 12.035 12.035 0 01-7.193-7.193 1.125 1.125 0 01.38-1.21l1.293-.97c.363-.272.529-.735.417-1.173L6.716 3.1A1.125 1.125 0 005.625 2.25H4.25A2.25 2.25 0 002 4.5v2.25z"
                    />
                  </svg>
                }
                label="Phone"
                value={application.contactNumber}
                iconClass="bg-[#ECFDF5] text-[#059669]"
              />

              {/* EMAIL */}
              <ContactCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.986 1.862l-7.5 5a2.25 2.25 0 01-2.528 0l-7.5-5A2.25 2.25 0 012.25 6.993V6.75"
                    />
                  </svg>
                }
                label="Email"
                value={application.user.email}
                iconClass="bg-[#F4EEFF] text-[#7C3AED]"
              />
            </div>
          </section>

          {/* ================= CV EVALUATION ================= */}

          <section>
            <div className="mb-5">
              <h2 className="text-[21px] font-semibold text-[#172B4D]">
                CV Evaluation
              </h2>

              <p className="mt-1 text-sm text-[#7B8794]">
                How the applicant&apos;s CV matches this position
              </p>
            </div>

            {!analysis ? (
              <div className="rounded-[20px] bg-white p-10 text-center shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <p className="font-medium text-[#172B4D]">
                  CV analysis not available
                </p>

                <p className="mt-1 text-sm text-[#7B8794]">
                  This application does not have a CV analysis result yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* EDUCATION */}

                <EvaluationRow
                  icon="🎓"
                  title="Education Relevance"
                  description="Education match with the position"
                  text={
                    analysis.educationRelevance?.text ||
                    "No information available."
                  }
                 score={
  ((analysis.educationRelevance?.score ?? 0) *
    application.job.educationWeight) / 100
}
maxScore={application.job.educationWeight}
                  iconBg="bg-[#EEF4FF]"
                  scoreBg="bg-[#EEF4FF]"
                  scoreText="text-[#2563EB]"
                />

                {/* EXPERIENCE */}

                <EvaluationRow
                  icon="💼"
                  title="Experience Relevance"
                  description="Experience match with the position"
                  text={
                    analysis.experienceRelevance?.text ||
                    "No information available."
                  }
                 score={
  ((analysis.experienceRelevance?.score ?? 0) *
    application.job.experienceWeight) / 100
}
maxScore={application.job.experienceWeight}
                  iconBg="bg-[#ECFDF5]"
                  scoreBg="bg-[#ECFDF5]"
                  scoreText="text-[#059669]"
                />

                {/* SKILLS */}

                <EvaluationRow
                  icon="⭐"
                  title="Skills Alignment"
                  description="Skills match with the position"
                  text={
                    analysis.skillsAlignment?.text ||
                    "No information available."
                  }
                 score={
  ((analysis.skillsAlignment?.score ?? 0) *
    application.job.skillsWeight) / 100
}
maxScore={application.job.skillsWeight}
                  iconBg="bg-[#F4EEFF]"
                  scoreBg="bg-[#F4EEFF]"
                  scoreText="text-[#7C3AED]"
                />

                {/* KEYWORDS */}

                <EvaluationRow
                  icon="🔑"
                  title="Keyword Match"
                  description="Required keywords found in the CV"
                  text={
                    analysis.keywordMatch?.text ||
                    "No information available."
                  }
                 score={
  ((analysis.keywordMatch?.score ?? 0) *
    application.job.keywordWeight) / 100
}
maxScore={application.job.keywordWeight}
                  iconBg="bg-[#FFF7E6]"
                  scoreBg="bg-[#FFF7E6]"
                  scoreText="text-[#D97706]"
                />

                {/* OVERALL SCORE */}

                <div className="mt-5 rounded-[20px] bg-white px-7 py-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#172B4D]">
                        Overall CV Score
                      </h3>

                      <p className="mt-1 text-sm text-[#7B8794]">
                        Overall match for this position
                      </p>
                    </div>

                    <div className="flex h-[86px] w-[86px] items-center justify-center rounded-full bg-[#F1EAFF]">
                      <span className="text-2xl font-semibold text-[#7C3AED]">
  {application.cvScore ?? 0}%
</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   CONTACT CARD
========================================================= */

function ContactCard({ icon, label, value, iconClass }) {
  return (
    <div className="rounded-[18px] border border-[#EDF2F7] bg-[#F8FAFD] px-5 py-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <p className="text-[11px] font-bold uppercase tracking-[1.2px] text-[#8492A6]">
        {label}
      </p>

      <p className="mt-2 break-words text-[17px] font-semibold text-[#172B4D]">
        {value || "Not provided"}
      </p>
    </div>
  );
}

/* =========================================================
   EVALUATION ROW
========================================================= */

function EvaluationRow({ 
  icon, 
  title, 
  description, 
  text, 
  score,
  maxScore,
  iconBg, 
  scoreBg, 
  scoreText, 
}) {
  return (
    <div className="rounded-[20px] bg-white px-6 py-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        {/* LEFT */}

        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] ${iconBg} text-lg`}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <h3 className="text-[16px] font-semibold text-[#172B4D]">
              {title}
            </h3>

            <p className="mt-1 text-sm text-[#7B8794]">
              {description}
            </p>

            <p className="mt-3 text-[14px] leading-6 text-[#52667A]">
              {text}
            </p>
          </div>
        </div>

        {/* SCORE */}

        <div
          className={`flex h-[72px] w-[82px] shrink-0 flex-col items-center justify-center rounded-[16px] ${scoreBg}`}
        >
          <span className={`text-[21px] font-semibold ${scoreText}`}>
           {score ?? 0}%
          </span>

          <span className={`mt-0.5 text-[11px] font-medium ${scoreText}`}>
            Score
          </span>
        </div>
      </div>
    </div>
  );
}