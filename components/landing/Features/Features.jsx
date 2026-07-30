import FeatureCard from "./FeatureCard";
import { features } from "./featuresData";

export default function Features() {
  return (
    <section className="py-16 border-y border-gray-200 bg-white">

      <div className="max-w-7xl mx-auto px-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              {...feature}
            />
          ))}

        </div>

      </div>

    </section>
  );
}