import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* STEP 1: understand the user's message -> filters (accuracy matters, temp 0) */
async function extractFilters(message) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
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
- Salary numbers are numeric. "k"/"K" = thousand, "lakh"/"lac" = 100,000 (e.g. "100k" -> 100000, "2.5 lakh" -> 250000).
- "above/over/more than/at least/minimum X" -> salaryMin = X.
- "below/under/less than/at most/maximum X" -> salaryMax = X.
- "between X and Y" / "X to Y" -> salaryMin = X, salaryMax = Y.
- salaryCurrency: only PKR, USD, EUR, GBP. Recognize symbols/words: Rs/rupees->PKR, $/dollars->USD, €/euros->EUR, £/pounds->GBP.
  If no currency is mentioned, salaryCurrency MUST be null — never assume PKR or USD.
- If the message isn't about finding a job, return isJobSearch: false with every other field null.
- Return JSON only. No markdown, no explanation.`,
      },
      { role: "user", content: message.trim() },
    ],
  });

  const raw = completion.choices?.[0]?.message?.content?.trim();
  if (!raw) throw new Error("Groq returned an empty response.");

  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  return {
    isJobSearch: parsed.isJobSearch === true,
    title: typeof parsed.title === "string" ? parsed.title.trim() || null : null,
    location: typeof parsed.location === "string" ? parsed.location.trim() || null : null,
    companyName: typeof parsed.companyName === "string" ? parsed.companyName.trim() || null : null,
    category: typeof parsed.category === "string" ? parsed.category.trim() || null : null,
    jobType: typeof parsed.jobType === "string" ? parsed.jobType.trim() || null : null,
    salaryMin: typeof parsed.salaryMin === "number" ? parsed.salaryMin : null,
    salaryMax: typeof parsed.salaryMax === "number" ? parsed.salaryMax : null,
    salaryCurrency:
      typeof parsed.salaryCurrency === "string"
        ? parsed.salaryCurrency.trim().toUpperCase() || null
        : null,
  };
}

/* STEP 2: filters + result count -> natural reply (variety matters, temp 0.8) */
async function generateReply(filters, jobCount) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.8,
    messages: [
      {
        role: "system",
       content: `You're a helpful assistant on a job portal's chat widget, replying to someone actively searching for jobs. Talk like a real person giving them a quick, natural update — not a form, not a bot script.

You'll receive the filters that were used and how many jobs matched.

RULES:
- 1 sentence. Max 2 only if it genuinely needs it.
- Never start with "I found" — vary your opening every single time. No two replies should ever open the same way.
- Emojis are optional, never mandatory. Use one only if it genuinely fits the moment. Never force an emoji into a reply that doesn't need it.
- Don't list every filter like a form ("Title: X. Location: Y."). Pick at most 1-2 details that matter and weave them into a normal sentence, or skip specifics entirely if the number alone says enough.
- Zero results is a normal, valid outcome — not a failure. Never apologize or sound like you couldn't do something. Just state it plainly and suggest ONE concrete thing to try (a different title, a wider location, or dropping a filter).
- Never offer or promise anything the app doesn't actually do — no notifications, no saved searches, no alerts, no "I'll let you know." Only ever suggest the user search again with different words.
- Never invent details not present in the filters.
- Never reuse the same sentence, structure, or phrase you've used before — every reply should read freshly written.

Examples of the TONE to match (write your own wording each time, never copy these directly):
"4 customer service roles just opened up in Islamabad."
"Plenty here — 12 remote listings to scroll through."
"Nothing above 100k PKR yet — try a lower range or a nearby city?"
"Just one finance opening in Karachi right now."
"6 live listings below, take a look."
"No React roles this round — a broader title like 'developer' might turn up more."
"Turned up 3 matches for part-time work in Lahore."
"Empty for that combo — dropping the salary filter might help."`,
      },
      { role: "user", content: JSON.stringify({ filters, jobCount }) },
    ],
  });

  return (
    completion.choices?.[0]?.message?.content?.trim() ||
    (jobCount > 0
      ? `Found ${jobCount} matching job${jobCount === 1 ? "" : "s"}.`
      : "No matching jobs found — try different filters.")
  );
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (body.mode === "reply") {
      const reply = await generateReply(body.filters || {}, Number(body.jobCount) || 0);
      return NextResponse.json({ reply });
    }

    const { message } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Please enter a job search." }, { status: 400 });
    }

    const response = await extractFilters(message);
    console.log("GROQ PARSED RESPONSE:", response);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("CHATBOT ERROR:", error);
    return NextResponse.json({ error: "Could not understand the job search." }, { status: 500 });
  }
}