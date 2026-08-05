"use client";

export default function Error({
  error,
  reset,
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">

      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">

        <h2 className="text-3xl font-bold text-red-600">
          Something went wrong!
        </h2>

        <p className="text-gray-600 mt-4">
          We couldn't load the Post Job page.
        </p>

        <button
          onClick={() => reset()}
          className="mt-8 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-medium transition"
        >
          Try Again
        </button>

      </div>

    </div>
  );
}