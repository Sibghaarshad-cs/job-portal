
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-md px-8 py-6 flex items-center gap-4">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>

        <p className="text-lg font-medium text-gray-700">
          Loading Post Job Form...
        </p>
      </div>
    </div>
  );
}