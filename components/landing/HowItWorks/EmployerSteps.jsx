import { Building2, Briefcase, ClipboardList, BadgeCheck } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: Building2,
    title: "Register",
    description: "Create your company account",
  },
  {
    id: 2,
    icon: Briefcase,
    title: "Post Job",
    description: "Post job openings in minutes",
  },
  {
    id: 3,
    icon: ClipboardList,
    title: "Review",
    description: "Review and shortlist candidates",
  },
  {
    id: 4,
    icon: BadgeCheck,
    title: "Hire",
    description: "Hire the best talent",
  },
];

export default function EmployerSteps() {
  return (
    <div className="bg-indigo-50 rounded-2xl p-8 shadow-sm flex-1">

      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow mb-6">
        <Building2 className="text-indigo-600" size={28} />
      </div>

      <h3 className="text-center text-xl font-bold text-indigo-700 mb-8">
        For Employers
      </h3>

      <div className="flex justify-between items-start relative">

        <div className="absolute top-5 left-10 right-10 border-t-2 border-dashed border-indigo-300"></div>

        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center w-28 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-semibold mb-4">
                {step.id}
              </div>

              <Icon size={22} className="text-indigo-600 mb-2" />

              <h4 className="font-semibold text-gray-900">{step.title}</h4>

              <p className="text-sm text-gray-500 mt-1">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}