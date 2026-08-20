"use client";

import { useState } from "react";
import { Bot, X, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function JobChatbot() {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hi! I can help you find jobs by title, location, company, category, job type, or salary.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    // Show user message
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
      /*
        -----------------------------------------
        STEP 1
        Send user's message to chatbot API
        -----------------------------------------
      */

      const chatbotResponse = await fetch("/api/chatboat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const chatbotData = await chatbotResponse.json();

      console.log("CHATBOT API RESPONSE:", chatbotData);

      if (!chatbotResponse.ok) {
        throw new Error(
          chatbotData.error || "Could not understand your request."
        );
      }

      /*
        -----------------------------------------
        STEP 2
        Get the filters returned by backend
        -----------------------------------------

        Backend returns:

        {
          reply: "...",
          jobs: [...],
          filters: {...},
          searchData: {...},
          jobCount: 2
        }

        So we use searchData here.
      */

      const searchData = chatbotData.searchData;

      console.log("GROQ UNDERSTOOD:", searchData);

      if (!searchData) {
        throw new Error(
          "The chatbot did not return search information."
        );
      }

      /*
        -----------------------------------------
        STEP 3
        Check whether this is a job search
        -----------------------------------------
      */

      if (!searchData.isJobSearch) {
        setMessages((previous) => [
          ...previous,
          {
            role: "assistant",
            content:
              "🤖 I can only help you find jobs. Try something like \"Find customer service jobs in Islamabad\".",
          },
        ]);

        return;
      }

      /*
        -----------------------------------------
        STEP 4
        Create database search parameters
        -----------------------------------------
      */

      const params = new URLSearchParams();

      if (searchData.title) {
        params.set("title", searchData.title);
      }

      if (searchData.location) {
        params.set("location", searchData.location);
      }

      if (searchData.companyName) {
        params.set("companyName", searchData.companyName);
      }

      if (searchData.category) {
        params.set("category", searchData.category);
      }

      if (searchData.jobType) {
        params.set("jobType", searchData.jobType);
      }

      if (
        searchData.salaryMin !== null &&
        searchData.salaryMin !== undefined
      ) {
        params.set(
          "salaryMin",
          String(searchData.salaryMin)
        );
      }

      if (
        searchData.salaryMax !== null &&
        searchData.salaryMax !== undefined
      ) {
        params.set(
          "salaryMax",
          String(searchData.salaryMax)
        );
      }

      if (searchData.salaryCurrency) {
        params.set(
          "salaryCurrency",
          searchData.salaryCurrency
        );
      }

      const queryString = params.toString();

      console.log(
        "SEARCHING DATABASE:",
        queryString
      );

      /*
        -----------------------------------------
        STEP 5
        Search your REAL PostgreSQL database
        -----------------------------------------
      */

      const jobsResponse = await fetch(
        `/api/jobs?${queryString}`
      );

      const jobsData = await jobsResponse.json();

      if (!jobsResponse.ok) {
        throw new Error(
          jobsData.message || "Could not search jobs."
        );
      }

      console.log(
        "DATABASE MATCHES:",
        jobsData
      );

      /*
        -----------------------------------------
        STEP 6
        Update the existing JobList on the page
        -----------------------------------------
      */

      router.push(`?${queryString}`);

      /*
        -----------------------------------------
        STEP 7
        Display the reply already generated
        by the backend.
        
        We DO NOT call /api/chatboat again.
        -----------------------------------------
      */

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            chatbotData.reply ||
            (jobsData.length > 0
              ? `Found ${jobsData.length} matching job${
                  jobsData.length === 1
                    ? ""
                    : "s"
                }.`
              : "No matching jobs found. Try a different search."),
        },
      ]);
    } catch (error) {
      console.error("CHATBOT ERROR:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "❌ Sorry, I couldn't search for jobs right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ============================= */}
      {/* FRIENDLY ROBOT CHAT BUTTON */}
      {/* ============================= */}

      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Friendly message */}
          <div className="hidden sm:block rounded-2xl bg-white px-4 py-3 shadow-lg border border-violet-100">
            <p className="text-sm font-semibold text-slate-800">
              Ask Job Assistant
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Find your dream job! ✨
            </p>
          </div>

          {/* Robot button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Job Assistant"
            className="relative group h-16 w-16 rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 text-white shadow-xl shadow-violet-300/40 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-violet-400/50"
          >
            {/* Robot icon */}
            <Bot
              size={32}
              strokeWidth={1.8}
              className="transition-transform duration-300 group-hover:scale-110"
            />

            {/* Online indicator */}
            <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-green-400 border-2 border-white shadow-sm" />

            {/* Sparkles */}
            <Sparkles
              size={14}
              className="absolute -top-1 -left-1 text-yellow-300"
            />
          </button>
        </div>
      )}

      {/* ============================= */}
      {/* CHATBOT WINDOW */}
      {/* ============================= */}

      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[320px] h-[390px] bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-4 py-3 flex-shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={21} />

                <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-green-400 border border-white" />
              </div>

              <div>
                <h2 className="font-semibold text-sm">
                  Job Assistant
                </h2>

                <p className="text-xs text-violet-100 mt-0.5">
                  Find relevant jobs
                </p>
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Job Assistant"
              className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/20 transition"
            >
              <X size={18} />
            </button>
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
                  🔎 Searching jobs...
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
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Find jobs..."
                disabled={loading}
                className="flex-1 min-w-0 h-9 border border-gray-300 rounded-lg px-3 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={
                  loading || !message.trim()
                }
                className="h-9 w-9 flex-shrink-0 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}