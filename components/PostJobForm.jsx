"use client";

import { jobSchema } from "../schemas/jobSchema";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  BriefcaseBusiness,
  MapPin,
  Building2,
  FileText,
  ClipboardList,
  Layers,
  Settings2,
  ChevronDown,
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
    salaryCurrency: "PKR",
    description: "",
    requirements: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showScoreSettings, setShowScoreSettings] = useState(false);

  // CV Evaluation Weights
  const [keywordWeight, setKeywordWeight] = useState(25);
  const [skillsWeight, setSkillsWeight] = useState(25);
  const [experienceWeight, setExperienceWeight] = useState(25);
  const [educationWeight, setEducationWeight] = useState(25);

  const totalWeight =
    keywordWeight +
    skillsWeight +
    experienceWeight +
    educationWeight;

  const weightsValid = totalWeight === 100;

  // Fetch existing job when editing
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
        salaryCurrency: data.salaryCurrency || "PKR",
        description: data.description || "",
        requirements: data.requirements || "",
      });

      // Load saved CV weights when editing
      setKeywordWeight(data.keywordWeight ?? 25);
      setSkillsWeight(data.skillsWeight ?? 25);
      setExperienceWeight(data.experienceWeight ?? 25);
      setEducationWeight(data.educationWeight ?? 25);
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

  // Handle weight input
  const handleWeightChange = (setter) => (e) => {
    const value = e.target.value;

    // Allow empty field while typing
    if (value === "") {
      setter(0);
      return;
    }

    const numberValue = Number(value);

    // Do not allow negative values
    if (numberValue < 0) {
      return;
    }

    // Do not allow values greater than 100
    if (numberValue > 100) {
      return;
    }

    setter(numberValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make sure weights equal 100
    if (!weightsValid) {
      setShowScoreSettings(true);
      return;
    }

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

    // Send job information + CV weights
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,

        keywordWeight,
        skillsWeight,
        experienceWeight,
        educationWeight,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      setLoading(false);
      return;
    }

    alert(
      jobId
        ? "Job updated successfully!"
        : "Job posted successfully!"
    );

    router.push("/employer/dashboard");

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 shadow-md text-xs"
    >
      {/* ================= HEADER ================= */}

      <div className="relative flex items-center justify-between px-6 py-4 border-b border-gray-200">
        {/* Left side */}

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
            <BriefcaseBusiness
              size={20}
              className="text-violet-600"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Post New Job
            </h1>

            <p className="text-xs text-gray-500">
              Fill in the details below.
            </p>
          </div>
        </div>

        {/* ================= SCORE SETTING ================= */}

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setShowScoreSettings(!showScoreSettings)
            }
            className="
              flex
              items-center
              gap-2
              rounded-lg
              border
              border-gray-200
              bg-white
              px-3
              py-2
              text-xs
              font-semibold
              text-gray-700
              shadow-sm
              hover:bg-gray-50
              transition
            "
          >
            <Settings2
              size={16}
              className="text-violet-600"
            />

            <span>Score Setting</span>

            <ChevronDown
              size={15}
              className={`transition-transform ${
                showScoreSettings ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* ================= DROPDOWN ================= */}

          {showScoreSettings && (
            <div
              className="
                absolute
                right-0
                top-12
                z-50
                w-80
                rounded-xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-xl
              "
            >
              {/* Title */}

              <div className="mb-5">
                <h2 className="text-sm font-bold text-gray-900">
                  CV Evaluation Weights
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Set how important each criterion is for this job.
                </p>
              </div>

              {/* ================= KEYWORD ================= */}

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-700">
                    Keyword Match
                  </label>

                  <span className="text-xs text-gray-400">
                    0–100%
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={keywordWeight}
                    onChange={handleWeightChange(
                      setKeywordWeight
                    )}
                    placeholder="Enter percentage"
                    className="
                      w-full
                      h-10
                      rounded-lg
                      border
                      border-gray-300
                      px-3
                      pr-10
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-violet-500
                    "
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    %
                  </span>
                </div>
              </div>

              {/* ================= SKILLS ================= */}

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-700">
                    Skills Alignment
                  </label>

                  <span className="text-xs text-gray-400">
                    0–100%
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={skillsWeight}
                    onChange={handleWeightChange(
                      setSkillsWeight
                    )}
                    placeholder="Enter percentage"
                    className="
                      w-full
                      h-10
                      rounded-lg
                      border
                      border-gray-300
                      px-3
                      pr-10
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-violet-500
                    "
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    %
                  </span>
                </div>
              </div>

              {/* ================= EXPERIENCE ================= */}

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-700">
                    Experience Relevance
                  </label>

                  <span className="text-xs text-gray-400">
                    0–100%
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={experienceWeight}
                    onChange={handleWeightChange(
                      setExperienceWeight
                    )}
                    placeholder="Enter percentage"
                    className="
                      w-full
                      h-10
                      rounded-lg
                      border
                      border-gray-300
                      px-3
                      pr-10
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-violet-500
                    "
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    %
                  </span>
                </div>
              </div>

              {/* ================= EDUCATION ================= */}

              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-700">
                    Education Relevance
                  </label>

                  <span className="text-xs text-gray-400">
                    0–100%
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={educationWeight}
                    onChange={handleWeightChange(
                      setEducationWeight
                    )}
                    placeholder="Enter percentage"
                    className="
                      w-full
                      h-10
                      rounded-lg
                      border
                      border-gray-300
                      px-3
                      pr-10
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-violet-500
                    "
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    %
                  </span>
                </div>
              </div>

              {/* ================= TOTAL ================= */}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-800">
                    Total Weight
                  </span>

                  <span
                    className={`text-lg font-bold ${
                      totalWeight === 100
                        ? "text-green-600"
                        : totalWeight > 100
                        ? "text-red-600"
                        : "text-orange-600"
                    }`}
                  >
                    {totalWeight}%
                  </span>
                </div>

                {/* Less than 100 */}

                {totalWeight < 100 && (
                  <p className="mt-2 text-xs font-medium text-orange-600">
                    Please assign {100 - totalWeight}% more
                    weight.
                  </p>
                )}

                {/* More than 100 */}

                {totalWeight > 100 && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    Total weight cannot exceed 100%.
                  </p>
                )}

                {/* Exactly 100 */}

                {totalWeight === 100 && (
                  <p className="mt-2 text-xs font-medium text-green-600">
                    ✓ Total weight is valid.
                  </p>
                )}
              </div>

              {/* ================= DONE ================= */}

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!weightsValid}
                  onClick={() =>
                    setShowScoreSettings(false)
                  }
                  className="
                    rounded-lg
                    bg-violet-600
                    px-5
                    py-2
                    text-xs
                    font-semibold
                    text-white
                    transition
                    hover:bg-violet-700
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= BODY ================= */}

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
          {/* Company Location */}

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

          {/* Job Location */}

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
          {/* Category */}

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
                <option value="">
                  Select Category
                </option>
                <option value="Software Development">
                  Software Development
                </option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Human Resources">
                  Human Resources
                </option>
                <option value="Customer Support">
                  Customer Support
                </option>
              </select>
            </div>

            {errors.category && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category}
              </p>
            )}
          </div>

          {/* Job Type */}

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
                <option value="">
                  Select Job Type
                </option>
                <option value="Full-Time">
                  Full-Time
                </option>
                <option value="Part-Time">
                  Part-Time
                </option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Internship">
                  Internship
                </option>
                <option value="Contract">
                  Contract
                </option>
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

          <div className="grid grid-cols-3 gap-4">
            {/* Minimum */}

            <div>
              <input
                type="number"
                name="salaryMin"
                placeholder="Minimum Salary"
                value={formData.salaryMin}
                onChange={handleChange}
                className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />

              {errors.salaryMin && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.salaryMin}
                </p>
              )}
            </div>

            {/* Maximum */}

            <div>
              <input
                type="number"
                name="salaryMax"
                placeholder="Maximum Salary"
                value={formData.salaryMax}
                onChange={handleChange}
                className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />

              {errors.salaryMax && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.salaryMax}
                </p>
              )}
            </div>

            {/* Currency */}

            <div>
              <select
                name="salaryCurrency"
                value={formData.salaryCurrency}
                onChange={handleChange}
                className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="PKR">
                  Rs (PKR)
                </option>
                <option value="USD">
                  $ (USD)
                </option>
                <option value="EUR">
                  € (EUR)
                </option>
                <option value="GBP">
                  £ (GBP)
                </option>
              </select>
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

        {/* ================= BUTTONS ================= */}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() =>
              router.push("/employer/dashboard")
            }
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || !weightsValid}
            className="
              px-6
              py-2
              rounded-lg
              bg-gradient-to-r
              from-violet-600
              to-fuchsia-500
              text-white
              text-sm
              font-semibold
              shadow-md
              hover:opacity-90
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
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