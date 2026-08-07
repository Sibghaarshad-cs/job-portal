"use client";

import { useState } from "react";
import { 
  BriefcaseBusiness, 
  MapPin, 
  Calendar, 
  Building2, 
  FileText, 
  Clock, 
  BadgeCheck, 
  XCircle, 
  Search 
} from "lucide-react";

export default function JobSeekerDashboardContent({ applications = [] }) {
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Counts
  const counts = {
    ALL: applications.length,
    APPLIED: applications.filter(app => app.status === "APPLIED").length,
    INTERVIEW: applications.filter(app => app.status === "INTERVIEW").length,
    ACCEPTED: applications.filter(app => app.status === "ACCEPTED").length,
    REJECTED: applications.filter(app => app.status === "REJECTED").length,
  };

  // Filter & Search Applications
  const filteredApplications = applications.filter((app) => {
    const matchesFilter = filter === "ALL" || app.status === filter;
    const matchesSearch = 
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case "APPLIED":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "INTERVIEW":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "ACCEPTED":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "REJECTED":
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "APPLIED":
        return "Applied";
      case "INTERVIEW":
        return "Interviewing";
      case "ACCEPTED":
        return "Accepted (Hired)";
      case "REJECTED":
        return "Rejected";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-950">My Applications</h1>
        <p className="text-gray-500 mt-1">Track and manage your submitted job applications.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Applications", count: counts.ALL, color: "bg-white border-slate-200 text-slate-800", icon: <FileText className="text-slate-500" size={20} /> },
          { label: "Applied", count: counts.APPLIED, color: "bg-white border-blue-200 text-blue-800", icon: <Clock className="text-blue-500" size={20} /> },
          { label: "Interviewing", count: counts.INTERVIEW, color: "bg-white border-amber-200 text-amber-800", icon: <BriefcaseBusiness className="text-amber-500" size={20} /> },
          { label: "Accepted", count: counts.ACCEPTED, color: "bg-white border-emerald-200 text-emerald-800", icon: <BadgeCheck className="text-emerald-500" size={20} /> },
          { label: "Rejected", count: counts.REJECTED, color: "bg-white border-rose-200 text-rose-800", icon: <XCircle className="text-rose-500" size={20} /> },
        ].map((card, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border ${card.color} shadow-sm flex flex-col justify-between h-28`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600">{card.label}</span>
              {card.icon}
            </div>
            <span className="text-3xl font-bold text-gray-900">{card.count}</span>
          </div>
        ))}
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-3xl border border-gray-200 shadow-sm">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {[
            { id: "ALL", label: "All", count: counts.ALL },
            { id: "APPLIED", label: "Applied", count: counts.APPLIED },
            { id: "INTERVIEW", label: "Interview", count: counts.INTERVIEW },
            { id: "ACCEPTED", label: "Accepted", count: counts.ACCEPTED },
            { id: "REJECTED", label: "Rejected", count: counts.REJECTED },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition ${
                filter === tab.id
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {tab.label}
              <span className={`inline-flex items-center justify-center text-xs px-2 py-0.5 rounded-full ${
                filter === tab.id ? "bg-violet-700 text-white" : "bg-gray-200 text-gray-700"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 rounded-full border border-gray-300 bg-white pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
          />
        </div>
      </div>

      {/* Applications Cards Grid */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900">No applications found</h3>
          <p className="text-gray-500 mt-2">
            {searchTerm 
              ? "We couldn't find any results matching your search terms." 
              : `You have no applications under the "${getStatusText(filter)}" status.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredApplications.map((app) => (
            <div key={app.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between border-l-4 border-l-violet-600">
              <div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{app.job.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5 text-gray-500 text-sm">
                      <Building2 size={15} />
                      <span className="font-medium">{app.job.companyName}</span>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${getStatusBadgeStyles(app.status)}`}>
                    {getStatusText(app.status)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="bg-violet-50 text-violet-700 text-xs px-3.5 py-1 rounded-full font-medium">
                    {app.job.jobType}
                  </span>
                  <span className="bg-gray-50 text-gray-700 text-xs px-3.5 py-1 rounded-full font-medium">
                    {app.job.category}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium col-span-2">
                    <MapPin size={14} className="flex-shrink-0" />
                    <span className="line-clamp-1">{app.job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                    <Calendar size={14} className="flex-shrink-0" />
                    Applied on {formatDate(app.appliedAt)}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-gray-400 text-[10px] uppercase font-semibold block">Salary Range</span>
                  <span className="text-base font-bold text-violet-600 block mt-0.5">
                    {app.job.salaryMin.toLocaleString()} - {app.job.salaryMax.toLocaleString()} PKR
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
