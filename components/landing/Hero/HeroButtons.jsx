import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroButtons() {
  return (
    <div className="mt-8">
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-3 text-white font-medium shadow-md transition-all duration-300 hover:bg-violet-700 hover:shadow-lg"
      >
        Start Now
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}