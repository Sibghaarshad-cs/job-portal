"use client";

import { useRouter } from "next/navigation";
import { BriefcaseBusiness, ArrowRight } from "lucide-react";

export default function EmployerBanner({
  redirectTo = "/employer/dashboard",
}) {
  const router = useRouter();

  return (
    <section className="max-w-7xl mx-auto px-6 mt-10 mb-12">
      <div className="bg-gradient-to-r from-violet-50 via-white to-violet-50 border border-gray-200 rounded-3xl px-8 py-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center">
              <BriefcaseBusiness
                size={30}
                className="text-violet-600"
              />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Want to Hire Top Talent?
              </h2>

              <p className="text-gray-500 mt-2">
                Post jobs, manage applications and hire the best people for your company.
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push(redirectTo)}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold px-8 py-4 rounded-2xl hover:opacity-90 transition"
          >
            Become an Employer
            <ArrowRight size={18} />
          </button>

        </div>
      </div>
    </section>
  );
}