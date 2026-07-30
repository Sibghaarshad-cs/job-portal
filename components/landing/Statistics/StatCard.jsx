import React from "react";

export default function StatCard({
  icon: Icon,
  value,
  label,
  showBorder = true,
}) {
  return (
    <div
      className={`flex items-center justify-center gap-4 px-6 py-5 ${
        showBorder ? "border-r border-gray-200" : ""
      }`}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
        <Icon size={24} className="text-indigo-600" />
      </div>

      {/* Text */}
      <div>
        <h3 className="text-3xl font-bold text-indigo-600">{value}</h3>
        <p className="text-gray-600">{label}</p>
      </div>
    </div>
  );
}