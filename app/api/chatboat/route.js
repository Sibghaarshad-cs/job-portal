import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { PrismaClient } from "../../generated/prisma/client";
import { cookies } from "next/headers";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const prisma = new PrismaClient();

/* =========================================================
   STEP 1: Understand user's message -> job search filters
   ========================================================= */

async function extractFilters(message) {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `You are a job-search filter extractor for a job portal.

Return ONLY this JSON shape, nothing else:

{
  "isJobSearch": true,
  "title": null,
  "location": null,
  "companyName": null,
  "category": null,
  "jobType": null,
  "salaryMin": null,
  "salaryMax": null,
  "salaryCurrency": null
}

Rules:
- Only fill fields the user actually mentioned. Never guess or invent a value.
- location: use the job's own location, not the company's HQ.
- jobType: one of "Full Time", "Part Time", "Remote", "Contract".
- Salary numbers are numeric.
- "k"/"K" = thousand.
- "lakh"/"lac" = 100,000.
- Example: "100k" -> 100000.
- Example: "2.5 lakh" -> 250000.
- "above/over/more than/at least/minimum X" -> salaryMin = X.
- "below/under/less than/at most/maximum X" -> salaryMax = X.
- "between X and Y" / "X to Y" -> salaryMin = X, salaryMax = Y.
- salaryCurrency: only PKR, USD, EUR, GBP.
- Recognize:
  Rs/rupees -> PKR
  $/dollars -> USD
  €/euros -> EUR
  £/pounds -> GBP
- If no currency is mentioned, salaryCurrency MUST be null.
- Never assume PKR or USD.
- If the message isn't about finding a job, return isJobSearch: false with every other field null.
- Return JSON only. No markdown. No explanation.`,
      },
      {
        role: "user",
        content: message.trim(),
      },
    ],
  });

  const raw = completion.choices?.[0]?.message?.content?.trim();

  if (!raw) {
    throw new Error("Groq returned an empty response.");
  }

  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  return {
    isJobSearch: parsed.isJobSearch === true,

    title:
      typeof parsed.title === "string"
        ? parsed.title.trim() || null
        : null,

    location:
      typeof parsed.location === "string"
        ? parsed.location.trim() || null
        : null,

    companyName:
      typeof parsed.companyName === "string"
        ? parsed.companyName.trim() || null
        : null,

    category:
      typeof parsed.category === "string"
        ? parsed.category.trim() || null
        : null,

    jobType:
      typeof parsed.jobType === "string"
        ? parsed.jobType.trim() || null
        : null,

    salaryMin:
      typeof parsed.salaryMin === "number"
        ? parsed.salaryMin
        : null,

    salaryMax:
      typeof parsed.salaryMax === "number"
        ? parsed.salaryMax
        : null,

    salaryCurrency:
      typeof parsed.salaryCurrency === "string"
        ? parsed.salaryCurrency.trim().toUpperCase() || null
        : null,
  };
}

/* =========================================================
   STEP 2: Generate natural chatbot reply
   ========================================================= */

async function generateReply(filters, jobCount) {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.8,
    messages: [
      {
        role: "system",
        content: `You're a helpful assistant on a job portal's chat widget, replying to someone actively searching for jobs.

Talk like a real person giving them a quick, natural update — not a form, not a bot script.

You'll receive the filters that were used and how many jobs matched.

RULES:
- 1 sentence. Max 2 only if it genuinely needs it.
- Never start with "I found".
- Vary the opening.
- Emojis are optional.
- Don't list every filter like a form.
- Pick at most 1-2 details that matter and weave them into a normal sentence.
- Zero results is a normal, valid outcome.
- Never apologize for zero results.
- Suggest ONE concrete thing to try if there are no results.
- Never offer notifications, saved searches or alerts.
- Never invent details not present in the filters.
- Keep the response short and natural.

Examples:
"4 customer service roles just opened up in Islamabad."
"Plenty here — 12 remote listings to scroll through."
"Nothing above 100k PKR yet — try a lower range or a nearby city?"
"Just one finance opening in Karachi right now."
"6 live listings below, take a look."
"No React roles this round — a broader title like 'developer' might turn up more."
"Turned up 3 matches for part-time work in Lahore."
"Empty for that combo — dropping the salary filter might help."`,
      },
      {
        role: "user",
        content: JSON.stringify({
          filters,
          jobCount,
        }),
      },
    ],
  });

  return (
    completion.choices?.[0]?.message?.content?.trim() ||
    (jobCount > 0
      ? `Found ${jobCount} matching job${
          jobCount === 1 ? "" : "s"
        }.`
      : "No matching jobs found — try different filters.")
  );
}

/* =========================================================
   STEP 3: POST /api/chatboat
   ========================================================= */

export async function POST(request) {
  try {
    const { message } = await request.json();

    /* ---------------------------------------------
       Validate message
       --------------------------------------------- */

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          error: "Please enter a job search message.",
        },
        {
          status: 400,
        }
      );
    }

    /* ---------------------------------------------
       Get logged-in user
       --------------------------------------------- */

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    /* ---------------------------------------------
       STEP 1:
       Extract filters using Groq
       --------------------------------------------- */

    const filters = await extractFilters(message);

    console.log("CHATBOT FILTERS:", filters);

    /* ---------------------------------------------
       If this isn't a job-search message
       --------------------------------------------- */

    if (!filters.isJobSearch) {
      return NextResponse.json({
        reply:
          "I can help you search for jobs by title, location, company, type, category, or salary.",

        jobs: [],

        filters,

        // Your existing JobChatbot.jsx expects this
        searchData: filters,

        jobCount: 0,
      });
    }

    /* ---------------------------------------------
       STEP 2:
       Get all active jobs
       --------------------------------------------- */

    const jobs = await prisma.job.findMany({
      where: {
        status: "Active",
      },
      orderBy: {
        postedAt: "desc",
      },
    });

    console.log("TOTAL ACTIVE JOBS:", jobs.length);

    /* ---------------------------------------------
       STEP 3:
       Filter jobs
       --------------------------------------------- */

    let matchingJobs = jobs;

    /* ---------------------------------------------
       TITLE
       --------------------------------------------- */

    if (filters.title) {
      const searchTitle = filters.title.toLowerCase();

      matchingJobs = matchingJobs.filter((job) =>
        job.title?.toLowerCase().includes(searchTitle)
      );
    }

    /* ---------------------------------------------
       LOCATION
       --------------------------------------------- */

    if (filters.location) {
      const searchLocation = filters.location.toLowerCase();

      matchingJobs = matchingJobs.filter((job) => {
        const jobLocation =
          job.location?.toLowerCase() || "";

        const companyLocation =
          job.companyLocation?.toLowerCase() || "";

        return (
          jobLocation.includes(searchLocation) ||
          companyLocation.includes(searchLocation)
        );
      });
    }

    /* ---------------------------------------------
       COMPANY
       --------------------------------------------- */

    if (filters.companyName) {
      const searchCompany =
        filters.companyName.toLowerCase();

      matchingJobs = matchingJobs.filter((job) =>
        job.companyName
          ?.toLowerCase()
          .includes(searchCompany)
      );
    }

    /* ---------------------------------------------
       CATEGORY
       --------------------------------------------- */

    if (filters.category) {
      const searchCategory =
        filters.category.toLowerCase();

      matchingJobs = matchingJobs.filter((job) =>
        job.category
          ?.toLowerCase()
          .includes(searchCategory)
      );
    }

    /* ---------------------------------------------
       JOB TYPE
       --------------------------------------------- */

    if (filters.jobType) {
      const requestedType = filters.jobType
        .toLowerCase()
        .replace(/-/g, " ")
        .trim();

      matchingJobs = matchingJobs.filter((job) => {
        const databaseType = job.jobType
          ?.toLowerCase()
          .replace(/-/g, " ")
          .trim();

        return databaseType === requestedType;
      });
    }

    /* ---------------------------------------------
       SALARY MINIMUM
       --------------------------------------------- */

    if (filters.salaryMin !== null) {
      matchingJobs = matchingJobs.filter((job) => {
        if (
          job.salaryMax === null ||
          job.salaryMax === undefined
        ) {
          return false;
        }

        return (
          Number(job.salaryMax) >=
          Number(filters.salaryMin)
        );
      });
    }

    /* ---------------------------------------------
       SALARY MAXIMUM
       --------------------------------------------- */

    if (filters.salaryMax !== null) {
      matchingJobs = matchingJobs.filter((job) => {
        if (
          job.salaryMin === null ||
          job.salaryMin === undefined
        ) {
          return false;
        }

        return (
          Number(job.salaryMin) <=
          Number(filters.salaryMax)
        );
      });
    }

    /* ---------------------------------------------
       SALARY CURRENCY
       --------------------------------------------- */

    if (filters.salaryCurrency) {
      matchingJobs = matchingJobs.filter((job) => {
        const jobCurrency =
          job.salaryCurrency?.toUpperCase() || "PKR";

        return (
          jobCurrency === filters.salaryCurrency
        );
      });
    }

    /* ---------------------------------------------
       Don't show the logged-in user's own jobs
       --------------------------------------------- */

    if (userId) {
      matchingJobs = matchingJobs.filter(
        (job) =>
          String(job.userId) !== String(userId)
      );
    }

    console.log(
      "MATCHING JOBS:",
      matchingJobs.length
    );

    /* ---------------------------------------------
       STEP 4:
       Generate natural chatbot response
       --------------------------------------------- */

    const reply = await generateReply(
      filters,
      matchingJobs.length
    );

    /* ---------------------------------------------
       STEP 5:
       Return response
       
       IMPORTANT:
       searchData is included because your existing
       JobChatbot.jsx expects:
       
       searchData.isJobSearch
       --------------------------------------------- */

    return NextResponse.json({
      reply,

      jobs: matchingJobs,

      filters,

      searchData: filters,

      jobCount: matchingJobs.length,
    });
  } catch (error) {
    console.error("CHATBOT ERROR:", error);

    return NextResponse.json(
      {
        error:
          "Could not understand the job search.",
      },
      {
        status: 500,
      }
    );
  }
}