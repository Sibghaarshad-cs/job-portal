"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">

        <h1 className="text-3xl font-bold text-red-600">
          Something went wrong
        </h1>

        <p className="mt-3 text-gray-600">
          We couldn't load the jobs right now.
        </p>

        <button
          onClick={reset}
          className="mt-6 rounded-xl bg-violet-600 px-6 py-3 text-white hover:bg-violet-700 transition"
        >
          Try Again
        </button>

      </div>
    </div>
  );
}