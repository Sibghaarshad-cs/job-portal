import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="px-6 py-16 bg-white">
      <div className="max-w-7xl mx-auto">

        <div className="bg-gradient-to-r from-indigo-700 via-purple-600 to-fuchsia-600 rounded-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left Side */}
          <div>
            <h2 className="text-4xl font-bold text-white mb-3">
              Ready to start your journey?
            </h2>

            <p className="text-indigo-100 text-lg">
              Join thousands of professionals and companies today.
            </p>
          </div>

          {/* Right Side */}
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition"
          >
            Create Account
            <ArrowRight size={20} />
          </Link>

        </div>

      </div>
    </section>
  );
}