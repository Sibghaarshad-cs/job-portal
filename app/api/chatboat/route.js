import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { message } = await request.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: `
You are a job search assistant for a job portal.

Your job is to understand what kind of job the user is looking for.

Extract these details from the user's message:

- keyword: job title or skill
- location: preferred job location
- jobType: full-time, part-time, remote, internship, etc.
- salaryMin: minimum salary if mentioned
- salaryMax: maximum salary if mentioned

Return ONLY valid JSON.

If something is not mentioned, use null.

Example:

User: Find React jobs in Islamabad

Return:
{
  "keyword": "React",
  "location": "Islamabad",
  "jobType": null,
  "salaryMin": null,
  "salaryMax": null
}

User: I want Python jobs in Lahore with salary above 100000

Return:
{
  "keyword": "Python",
  "location": "Lahore",
  "jobType": null,
  "salaryMin": 100000,
  "salaryMax": null
}
`,
        },

        {
          role: "user",
          content: message,
        },
      ],

      response_format: {
        type: "json_object",
      },
    });

    const response = completion.choices[0]?.message?.content;

    return NextResponse.json({
      response: JSON.parse(response),
    });
  } catch (error) {
    console.error("Groq error:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to communicate with Groq.",
      },
      { status: 500 }
    );
  }
}