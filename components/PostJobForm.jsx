"use client";

import { jobSchema } from "../schemas/jobSchema";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  BriefcaseBusiness,
  MapPin,
  Building2,
  DollarSign,
  FileText,
  ClipboardList,
  Layers,
} from "lucide-react";

export default function PostJobForm() {
 const router = useRouter();
const searchParams = useSearchParams();

const jobId = searchParams.get("id");


  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    companyLocation: "",
    location: "",
    category: "",
    jobType: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
  if (jobId) {
    fetchJob();
  }
}, [jobId]);

async function fetchJob() {
  try {
   const response = await fetch(`/api/employer/jobs/${jobId}`);


    if (!response.ok) {
      const error = await response.json();
      alert(error.message);
      return;
    }

    const data = await response.json();

    setFormData({
      title: data.title || "",
      companyName: data.companyName || "",
      companyLocation: data.companyLocation || "",
      location: data.location || "",
      category: data.category || "",
      jobType: data.jobType || "",
      salaryMin: data.salaryMin?.toString() || "",
      salaryMax: data.salaryMax?.toString() || "",
      description: data.description || "",
      requirements: data.requirements || "",
    });

  } catch (error) {
    console.error("Error fetching job:", error);
  }
}

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrors({});

    const result = jobSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((error) => {
        fieldErrors[error.path[0]] = error.message;
      });

      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

   const url = jobId
  ? `/api/employer/jobs/${jobId}`
  : "/api/employer/jobs";

const method = jobId ? "PATCH" : "POST";

const response = await fetch(url, {
  method,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(formData),
});

const data = await response.json();

if (!response.ok) {
  alert(data.message);
  setLoading(false);
  return;
}

alert(jobId ? "Job updated successfully!" : "Job posted successfully!");

router.push("/employer/dashboard");

setLoading(false);
  };

  return (
    <form
  onSubmit={handleSubmit}
  className="w-full max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 shadow-md text-xs"
>

      {/* Header */}

      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">

        <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">

          <BriefcaseBusiness
            size={20}
            className="text-violet-600"
          />

        </div>

        <div>

          <h1  className="text-3xl font-bold text-center text-gray-900">
            Post New Job
          </h1>

          <p className="text-xs text-gray-500">
            Fill in the details below.
          </p>

        </div>

      </div>

      {/* Body */}

      <div className="p-6 space-y-4">

        {/* Row 1 */}

        <div className="grid grid-cols-2 gap-4">

          {/* Job Title */}

          <div>

            <label className="block text-xs font-semibold mb-1">
              Job Title
            </label>

            <div className="relative">

              <BriefcaseBusiness
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="title"
                placeholder="Frontend Developer"
                value={formData.title}
                onChange={handleChange}
                className="w-full h-10 rounded-lg border border-gray-300 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />

            </div>

            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title}
              </p>
            )}

          </div>

          {/* Company Name */}

          <div>

            <label className="block text-xs font-semibold mb-1">
              Company Name
            </label>

            <div className="relative">

              <Building2
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="companyName"
                placeholder="Google"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full h-10 rounded-lg border border-gray-300 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />

            </div>

            {errors.companyName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.companyName}
              </p>
            )}

          </div>

        </div>

        {/* Row 2 */}

        <div className="grid grid-cols-2 gap-4">

          <div>

            <label className="block text-xs font-semibold mb-1">
              Company Location
            </label>

            <div className="relative">

              <Building2
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="companyLocation"
                placeholder="Islamabad"
                value={formData.companyLocation}
                onChange={handleChange}
                className="w-full h-10 rounded-lg border border-gray-300 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />

            </div>

            {errors.companyLocation && (
              <p className="text-red-500 text-xs mt-1">
                {errors.companyLocation}
              </p>
            )}

          </div>

          <div>

            <label className="block text-xs font-semibold mb-1">
              Job Location
            </label>

            <div className="relative">

              <MapPin
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="location"
                placeholder="Lahore"
                value={formData.location}
                onChange={handleChange}
                className="w-full h-10 rounded-lg border border-gray-300 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />

            </div>

            {errors.location && (
              <p className="text-red-500 text-xs mt-1">
                {errors.location}
              </p>
            )}

          </div>

        </div>

        {/* Row 3 */}

        <div className="grid grid-cols-2 gap-4">

          <div>

            <label className="block text-xs font-semibold mb-1">
              Category
            </label>

            <div className="relative">

              <Layers
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full h-10 rounded-lg border border-gray-300 pl-10 pr-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Select Category</option>
                <option value="Software Development">Software Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Customer Support">Customer Support</option>
              </select>

            </div>

            {errors.category && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category}
              </p>
            )}

          </div>

          <div>

            <label className="block text-xs font-semibold mb-1">
              Job Type
            </label>

            <div className="relative">

              <BriefcaseBusiness
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full h-10 rounded-lg border border-gray-300 pl-10 pr-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Select Job Type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>

            </div>

            {errors.jobType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.jobType}
              </p>
            )}

          </div>

        </div>
                {/* Salary */}

        <div>

          <label className="block text-xs font-semibold mb-1">
            Salary Range
          </label>

          <div className="grid grid-cols-2 gap-4">

            <div>

              <div className="relative">

                <DollarSign
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="number"
                  name="salaryMin"
                  placeholder="Minimum Salary"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  className="w-full h-10 rounded-lg border border-gray-300 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />

              </div>

              {errors.salaryMin && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.salaryMin}
                </p>
              )}

            </div>

            <div>

              <div className="relative">

                <DollarSign
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="number"
                  name="salaryMax"
                  placeholder="Maximum Salary"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  className="w-full h-10 rounded-lg border border-gray-300 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />

              </div>

              {errors.salaryMax && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.salaryMax}
                </p>
              )}

            </div>

          </div>

        </div>

        {/* Description + Requirements */}

        <div className="grid grid-cols-2 gap-4">

          {/* Description */}

          <div>

            <label className="block text-xs font-semibold mb-1">
              Job Description
            </label>

            <div className="relative">

              <FileText
                size={16}
                className="absolute top-3 left-3 text-gray-400"
              />

              <textarea
                rows={3}
                name="description"
                placeholder="Describe the role..."
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
              />

            </div>

            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description}
              </p>
            )}

          </div>

          {/* Requirements */}

          <div>

            <label className="block text-xs font-semibold mb-1">
              Requirements
            </label>

            <div className="relative">

              <ClipboardList
                size={16}
                className="absolute top-3 left-3 text-gray-400"
              />

              <textarea
                rows={3}
                name="requirements"
                placeholder="Required skills..."
                value={formData.requirements}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
              />

            </div>

            {errors.requirements && (
              <p className="text-red-500 text-xs mt-1">
                {errors.requirements}
              </p>
            )}

          </div>

        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">

          <button
            type="button"
            onClick={() => router.push("/employer/dashboard")}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button type="submit">
  {loading
    ? jobId
      ? "Updating..."
      : "Posting..."
    : jobId
    ? "Update Job"
    : "Post Job"}
</button>

        </div>

      </div>

    </form>
  );
}