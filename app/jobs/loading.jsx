export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="h-12 w-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

        <p className="mt-4 text-gray-600 text-lg">
          Loading jobs...
        </p>
      </div>
    </div>
  );
}