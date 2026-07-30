import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="bg-violet-600 text-white p-2 rounded-lg">
        <BriefcaseBusiness size={22} />
      </div>

      <h1 className="text-2xl font-bold text-gray-900">
        JobPortal
      </h1>
    </Link>
  );
}