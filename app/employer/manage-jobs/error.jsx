"use client";

export default function Error({ error, reset }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">

      <div className="bg-white border border-red-200 rounded-2xl shadow-sm p-8 text-center max-w-md">

        <h2 className="text-2xl font-bold text-red-600">
          Something went wrong
        </h2>

        <p className="text-gray-500 mt-3">
          {error.message}
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 px-6 py-3 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition"
        >
          Try Again
        </button>

      </div>

    </div>
  );
}