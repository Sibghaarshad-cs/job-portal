"use client";

import Image from "next/image";
import SearchBar from "./SearchBar";

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 mt-8">
      <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm px-10 py-10">

        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left */}

          <div>

            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Find Your Dream Job
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              Discover opportunities that match your passion and skills.
            </p>

            <div className="mt-10">
              <SearchBar />
            </div>

          </div>

          {/* Right */}

          <div className="flex justify-center">

            <Image
              src="/images/hero-job.png"
              alt="Hero"
              width={350}
              height={280}
              priority
              className="object-contain"
            />

          </div>

        </div>

      </div>
    </section>
  );
}