import EmployerSteps from "./EmployerSteps";
import JobSeekerSteps from "./JobSeekerSteps";

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 bg-white">

      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <JobSeekerSteps />

          <EmployerSteps />

        </div>

      </div>

    </section>
  );
}