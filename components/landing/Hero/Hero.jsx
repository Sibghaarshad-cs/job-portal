import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";

export default function Hero() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">

          <HeroContent />

          <HeroImage />

        </div>

      </div>
    </section>
  );
}