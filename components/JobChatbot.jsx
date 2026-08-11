"use client";

import { useState } from "react";

export default function JobChatbot() {
  const [message, setMessage] = useState("");

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[320px] h-[390px] bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden flex flex-col">

      {/* Header */}
      <div className="bg-violet-600 text-white px-4 py-3 flex-shrink-0">
        <h2 className="font-semibold text-sm">
          🤖 Job Assistant
        </h2>

        <p className="text-xs text-violet-100 mt-1">
          Find jobs using natural language
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
        <div className="bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-700">
          <p>
            👋 Hi! How can I help you find a job?
          </p>

          <p className="text-gray-500 text-xs mt-2">
            Try something like:
          </p>

          <p className="text-violet-600 text-xs mt-1">
            "Find React jobs in Islamabad"
          </p>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
        <div className="flex gap-2 items-center">

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Find React jobs..."
            className="flex-1 min-w-0 h-9 border border-gray-300 rounded-lg px-3 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <button
            type="button"
            className="h-9 w-9 flex-shrink-0 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition flex items-center justify-center"
          >
            ➤
          </button>

        </div>
      </div>

    </div>
  );
}