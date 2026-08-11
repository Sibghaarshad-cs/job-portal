"use client";

import { useState } from "react";

export default function JobChatbot() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! How can I help you find a job?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    // Show user's message immediately
    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatboat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Show Groq's response
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
         content: JSON.stringify(data.response, null, 2),
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't process your request. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-3">

        {messages.map((item, index) => (
          <div
            key={index}
            className={`flex ${
              item.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${
                item.role === "user"
                  ? "bg-violet-600 text-white"
                  : "bg-white border border-gray-200 text-gray-700"
              }`}
            >
              {item.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-500">
              Thinking...
            </div>
          </div>
        )}

      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
        <div className="flex gap-2 items-center">

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Find React jobs..."
            disabled={loading}
            className="flex-1 min-w-0 h-9 border border-gray-300 rounded-lg px-3 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100"
          />

          <button
            type="button"
            onClick={sendMessage}
            disabled={loading || !message.trim()}
            className="h-9 w-9 flex-shrink-0 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ➤
          </button>

        </div>
      </div>

    </div>
  );
}