"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JobChatbot() {
const router = useRouter();

const [message, setMessage] = useState("");

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
    Ask Groq to understand the user's request
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

  if (!chatbotResponse.ok) {
    throw new Error(
      chatbotData.error ||
        "Could not understand your request."
    );
  }

  const searchData = chatbotData.response;

  console.log("GROQ UNDERSTOOD:", searchData);

  /*
    -----------------------------------------
    STEP 2
    Check whether this is a job question
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
    STEP 3
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
    params.set(
      "companyName",
      searchData.companyName
    );
  }

  if (searchData.category) {
    params.set(
      "category",
      searchData.category
    );
  }

  if (searchData.jobType) {
    params.set(
      "jobType",
      searchData.jobType
    );
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
    STEP 4
    Search your REAL PostgreSQL database
    -----------------------------------------
  */

  const jobsResponse = await fetch(
    `/api/jobs?${queryString}`
  );

  const jobsData = await jobsResponse.json();

  if (!jobsResponse.ok) {
    throw new Error(
      jobsData.message ||
        "Could not search jobs."
    );
  }

  console.log(
    "DATABASE MATCHES:",
    jobsData
  );

  /*
    -----------------------------------------
    STEP 5
    Update the existing JobList on the page
    -----------------------------------------
  */

  router.push(`?${queryString}`);

  /*
    -----------------------------------------
    STEP 6
    No jobs
    -----------------------------------------
  */

  if (jobsData.length === 0) {
    setMessages((previous) => [
      ...previous,
      {
        role: "assistant",
        content:
          "❌ No relevant jobs found. Try another title, location, company, category, job type, or salary range.",
      },
    ]);

    return;
  }

  /*
    -----------------------------------------
    STEP 7
    Jobs found
    -----------------------------------------
  */

  let responseMessage =
    `✅ I found ${jobsData.length} relevant job${
      jobsData.length === 1 ? "" : "s"
    }.`;

  if (searchData.title) {
    responseMessage += ` Title: ${searchData.title}.`;
  }

  if (searchData.location) {
    responseMessage += ` Location: ${searchData.location}.`;
  }

  if (searchData.companyName) {
    responseMessage += ` Company: ${searchData.companyName}.`;
  }

  if (searchData.category) {
    responseMessage += ` Category: ${searchData.category}.`;
  }

  if (searchData.jobType) {
    responseMessage += ` Type: ${searchData.jobType}.`;
  }

  if (searchData.salaryMin !== null) {
    responseMessage += ` Minimum salary: ${searchData.salaryMin}.`;
  }

  if (searchData.salaryMax !== null) {
    responseMessage += ` Maximum salary: ${searchData.salaryMax}.`;
  }

  responseMessage +=
    " The matching jobs are shown below.";

  setMessages((previous) => [
    ...previous,
    {
      role: "assistant",
      content: responseMessage,
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
<div className="fixed bottom-5 right-5 z-50 w-[320px] h-[390px] bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden flex flex-col">

  {/* Header */}

  <div className="bg-violet-600 text-white px-4 py-3 flex-shrink-0">
    <h2 className="font-semibold text-sm">
      🤖 Job Assistant
    </h2>

    <p className="text-xs text-violet-100 mt-1">
      Find relevant jobs
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

);
}