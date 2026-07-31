"use client";

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>

      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg"
      >
        Try Again
      </button>
    </div>
  );
}