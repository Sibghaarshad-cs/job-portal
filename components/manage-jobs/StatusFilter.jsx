"use client";

export default function StatusFilter({ status, setStatus }) {
  return (
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
    >
      <option value="ALL">All Status</option>
      <option value="Active">Active</option>
      <option value="Closed">Closed</option>
    </select>
  );
}