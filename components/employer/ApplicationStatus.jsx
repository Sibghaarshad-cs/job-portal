"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function ApplicationStatus() {

  // Dummy data
  // Later this will come from Prisma

  const data = [
    {
      name: "New",
      value: 14,
      color: "#8B5CF6",
    },
    {
      name: "In Review",
      value: 9,
      color: "#3B82F6",
    },
    {
      name: "Interview",
      value: 5,
      color: "#F59E0B",
    },
    {
      name: "Hired",
      value: 3,
      color: "#10B981",
    },
  ];

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
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
            >

              {data.map((entry) => (
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

        {data.map((item) => (

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