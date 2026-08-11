"use client";

import { useState } from "react";

export default function JobChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      {/* Chatbot window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-violet-600 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Job Assistant</h2>
              <p className="text-xs text-violet-100">
                Find jobs using natural language
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-xl hover:opacity-80"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 p-4 overflow-y-auto bg-gray-50">
            <div className="bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-700 max-w-[85%]">
              👋 Hi! I'm your Job Assistant.

              <br />

              <span className="text-gray-500">
                Tell me what kind of job you're looking for.
              </span>
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Find React jobs..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />

              <button
                type="button"
                className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-violet-600 text-white shadow-lg hover:bg-violet-700 transition flex items-center justify-center text-2xl"
        aria-label="Open job assistant"
      >
        🤖
      </button>
    </>
  );
}