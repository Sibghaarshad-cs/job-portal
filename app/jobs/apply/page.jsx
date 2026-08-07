"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Mail, Phone, DollarSign, CalendarDays, FileText, UploadCloud, ArrowRight } from "lucide-react";

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ApplyPageContent />
    </Suspense>
  );
}

function ApplyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    resume: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resumeError, setResumeError] = useState("");

  useEffect(() => {
    async function load() {
      if (!jobId) return;
      setLoading(true);
      try {
        const [jobRes, userRes] = await Promise.all([
          fetch(`/api/jobs/${jobId}`),
          fetch(`/api/user/me`),
        ]);

        if (!jobRes.ok) throw new Error("Job not found");
        if (!userRes.ok) {
          router.push(`/login?next=${encodeURIComponent(`/jobs/apply?jobId=${jobId}`)}`);
          return;
        }

        const jobData = await jobRes.json();
        const userData = await userRes.json();

        setJob(jobData);
        setFormData((cur) => ({
          ...cur,
          name: userData.name || "",
          email: userData.email || "",
          contact: userData.contactNumber || "",
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [jobId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((cur) => ({ ...cur, [name]: value }));
    setErrors((cur) => ({ ...cur, [name]: "" }));
  };

  const [resumeFile, setResumeFile] = useState(null);
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setResumeFile(null);
      setResumeError("Resume must be 5MB or smaller.");
      setFormData((cur) => ({ ...cur, resume: "" }));
      return;
    }

    setResumeFile(file);
    setResumeError("");
    setFormData((cur) => ({ ...cur, resume: file.name }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("contact", formData.contact);
      if (resumeFile) {
        fd.append("resume", resumeFile, resumeFile.name);
      }

      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors({ general: data.message });
        setSubmitting(false);
        return;
      }

      alert("Application submitted successfully!");
      router.push("/jobs");
    } catch (err) {
      console.error(err);
      setErrors({ general: "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!job) return <div className="min-h-screen flex items-center justify-center">Job not found.</div>;

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 flex items-start">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-8 shadow">
        <div className="flex items-center gap-6 mb-8">
          <div className="rounded-2xl bg-violet-50 p-4 text-violet-700">
            <FileText size={30} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Job Application</h1>
            <p className="text-sm text-slate-600">Please fill in the details below to apply for this job.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-violet-700 mb-4">Personal Information</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm text-slate-700">Name</label>
                <div className="mt-2 relative rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" className="pl-10 py-1.5 leading-6 w-full bg-transparent outline-none text-sm" />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-700">Email</label>
                <div className="mt-2 relative rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email address" className="pl-10 py-1.5 leading-6 w-full bg-transparent outline-none text-sm" />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-700">Contact</label>
                <div className="mt-2 relative rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="contact" value={formData.contact} onChange={handleChange} placeholder="Enter your contact number" className="pl-10 py-2 leading-7 w-full bg-transparent outline-none text-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-violet-700 mb-4">Resume Upload</h2>

            <div className="mt-6">
              <label className="text-sm text-slate-700 mb-3 block">CV / Resume</label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-violet-300 bg-violet-50 px-6 py-6 text-center transition hover:border-violet-400 hover:bg-violet-100">
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFile} />
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-600">
                  <UploadCloud size={22} />
                </div>
                <div className="mt-3">
                  <p className="font-semibold text-violet-700">Click to upload your CV / Resume</p>
                  <p className="text-sm text-slate-500">PDF, DOC, DOCX (Max. 5MB)</p>
                </div>
                {formData.resume && <p className="mt-3 text-sm text-slate-900">Selected file: {formData.resume}</p>}
                {resumeError && <p className="mt-2 text-sm text-red-500">{resumeError}</p>}
              </label>
            </div>

            {errors.general && <p className="mt-4 text-sm text-red-500">{errors.general}</p>}

            <div className="mt-8">
              <button type="submit" disabled={submitting} className="mx-auto flex items-center gap-3 rounded-2xl bg-violet-600 px-6 py-3 text-white font-semibold hover:bg-violet-700 disabled:opacity-50">
                {submitting ? "Submitting..." : "Submit Application"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </form>

      </div>
    </main>
  );
}
