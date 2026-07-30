import Link from "next/link";

export default function AuthButtons() {
  return (
    <div className="flex items-center gap-4">

      <Link
        href="/login"
        className="text-gray-700 hover:text-violet-600 transition"
      >
        Login
      </Link>

      <Link
        href="/signup"
        className="bg-violet-600 text-white px-5 py-2 rounded-lg hover:bg-violet-700 transition"
      >
        Sign Up
      </Link>

    </div>
  );
}