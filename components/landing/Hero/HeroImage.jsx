import Image from "next/image";

export default function HeroImage() {
  return (
    <div className="flex justify-center">

      <Image
        src="/images/hero.png"
        alt="Hero Image"
        width={650}
        height={500}
        priority
      />

    </div>
  );
}