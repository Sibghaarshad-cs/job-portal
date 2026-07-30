import Link from "next/link";

export default function NavLinks() {
  return (
    <div className="hidden md:flex items-center gap-8">

      <Link href="/" className="text-violet-600 font-semibold">
        Home
      </Link>

      <Link
        href="/jobs"
        className="text-gray-700 hover:text-violet-600 transition"
      >
        Find Jobs
      </Link>

      <Link
        href="/employers"
        className="text-gray-700 hover:text-violet-600 transition"
      >
        For Employers
      </Link>

      <Link
        href="/about"
        className="text-gray-700 hover:text-violet-600 transition"
      >
        About
      </Link>

    </div>
  );
}