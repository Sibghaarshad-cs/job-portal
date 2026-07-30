import StatCard from "./StatCard";

import {
  Users,
  BriefcaseBusiness,
  FileText,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "100+",
    label: "Companies",
  },
  {
    icon: BriefcaseBusiness,
    value: "500+",
    label: "Jobs Posted",
  },
  {
    icon: FileText,
    value: "1000+",
    label: "Applications",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Success Rate",
  },
];

export default function Statistics() {
  return (
    <section className="px-6 py-10 bg-white">
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm">

        <div className="grid grid-cols-2 md:grid-cols-4">

          {stats.map((item, index) => (
            <StatCard
              key={item.label}
              icon={item.icon}
              value={item.value}
              label={item.label}
              showBorder={index !== stats.length - 1}
            />
          ))}

        </div>

      </div>
    </section>
  );
}