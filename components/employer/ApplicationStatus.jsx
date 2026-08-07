"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function ApplicationStatus({ data: statusCounts = {} }) {
  const chartData = [
    {
      name: "New",
      value: statusCounts?.APPLIED ?? 0,
      color: "#8B5CF6",
    },
    {
      name: "Interview",
      value: statusCounts?.INTERVIEW ?? 0,
      color: "#F59E0B",
    },
    {
      name: "Hired",
      value: statusCounts?.ACCEPTED ?? 0,
      color: "#10B981",
    },
    {
      name: "Rejected",
      value: statusCounts?.REJECTED ?? 0,
      color: "#EF4444",
    },
  ];

  const total = chartData.reduce((acc, item) => acc + item.value, 0);

  const pieData = total === 0 ? [{ name: "Empty", value: 1, color: "#E5E7EB" }] : chartData;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      {/* Heading */}

      <h2 className="text-xl font-semibold text-gray-900">
        Application Status
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Distribution of applications
      </p>

      {/* Donut Chart */}

      <div className="h-64 mt-6">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={pieData}
              dataKey="value"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={total === 0 ? 0 : 3}
            >

              {pieData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                />
              ))}

            </Pie>

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* Legend */}

      <div className="space-y-3 mt-2">

        {chartData.map((item) => (

          <div
            key={item.name}
            className="flex items-center justify-between"
          >

            <div className="flex items-center gap-3">

              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: item.color,
                }}
              />

              <span className="text-gray-600">
                {item.name}
              </span>

            </div>

            <span className="font-semibold">
              {item.value}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}