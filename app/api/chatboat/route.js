import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        {
          error: "Please enter a job search.",
        },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
You are a job-search parser for a job portal.

Your ONLY job is to understand the user's message and extract job-search filters.

Return ONLY valid JSON.
Do not return markdown.
Do not return explanations.
Do not invent information.

Use EXACTLY this structure:

{
  "isJobSearch": true,
  "title": null,
  "location": null,
  "companyName": null,
  "category": null,
  "jobType": null,
  "salaryMin": null,
  "salaryMax": null
}

FIELD RULES:

1. title

Extract the job title when the user mentions one.

Examples:

"show me customer service jobs"
→ title = "customer service"

"find software engineer jobs"
→ title = "software engineer"

"frontend developer jobs"
→ title = "frontend developer"

2. location

Extract the job location.

Examples:

"jobs in Islamabad"
→ location = "Islamabad"

"find jobs in Lahore"
→ location = "Lahore"

"software jobs near Rawalpindi"
→ location = "Rawalpindi"

IMPORTANT:
Use the job's actual location field, not companyLocation.

3. companyName

Extract the company name.

Examples:

"jobs at Microsoft"
→ companyName = "Microsoft"

"show me jobs at ABC Technologies"
→ companyName = "ABC Technologies"

4. category

Extract the job category.

Examples:

"show me IT jobs"
→ category = "IT"

"marketing jobs"
→ category = "marketing"

"customer service category"
→ category = "customer service"

5. jobType

Extract the job type.

Examples:

"full time jobs"
→ jobType = "Full Time"

"part time jobs"
→ jobType = "Part Time"

"remote jobs"
→ jobType = "Remote"

"contract jobs"
→ jobType = "Contract"

6. salaryMin

Use salaryMin when the user gives a minimum salary.

Examples:

"jobs above 50000"
→ salaryMin = 50000

"jobs over 50000"
→ salaryMin = 50000

"jobs at least 50000"
→ salaryMin = 50000

"jobs above 100k"
→ salaryMin = 100000

7. salaryMax

Use salaryMax when the user gives a maximum salary.

Examples:

"jobs below 100000"
→ salaryMax = 100000

"jobs under 100000"
→ salaryMax = 100000

"jobs below 100k"
→ salaryMax = 100000

8. Salary ranges

"jobs between 50000 and 100000"

→ salaryMin = 50000
→ salaryMax = 100000

Convert:

50k → 50000
60k → 60000
80k → 80000
100k → 100000
120k → 120000
150k → 150000

IMPORTANT:

Only extract information that the user actually mentioned.

Do NOT guess.

Do NOT invent a company.

Do NOT invent a location.

Do NOT invent a salary.

Do NOT invent a job type.

COMBINATIONS:

If the user says:

"Find full time customer service jobs in Islamabad above 50000"

return:

{
  "isJobSearch": true,
  "title": "customer service",
  "location": "Islamabad",
  "companyName": null,
  "category": null,
  "jobType": "Full Time",
  "salaryMin": 50000,
  "salaryMax": null
}

If the user says:

"Find software engineer jobs at ABC in Lahore between 80000 and 120000"

return:

{
  "isJobSearch": true,
  "title": "software engineer",
  "location": "Lahore",
  "companyName": "ABC",
  "category": null,
  "jobType": null,
  "salaryMin": 80000,
  "salaryMax": 120000
}

If the user only says:

"show me jobs"

return:

{
  "isJobSearch": true,
  "title": null,
  "location": null,
  "companyName": null,
  "category": null,
  "jobType": null,
  "salaryMin": null,
  "salaryMax": null
}

UNRELATED QUESTIONS:

If the user asks something unrelated to finding jobs, set isJobSearch to false.

Example:

"what is the capital of Pakistan?"

return:

{
  "isJobSearch": false,
  "title": null,
  "location": null,
  "companyName": null,
  "category": null,
  "jobType": null,
  "salaryMin": null,
  "salaryMax": null
}

Another example:

"write me a poem"

return:

{
  "isJobSearch": false,
  "title": null,
  "location": null,
  "companyName": null,
  "category": null,
  "jobType": null,
  "salaryMin": null,
  "salaryMax": null
}

Return JSON ONLY.
          `,
        },
        {
          role: "user",
          content: message.trim(),
        },
      ],
    });

    const rawResponse =
      completion.choices[0]?.message?.content?.trim();

    console.log("GROQ RAW RESPONSE:", rawResponse);

    if (!rawResponse) {
      throw new Error("Groq returned an empty response.");
    }

    // Remove accidental markdown code fences
    const cleanedResponse = rawResponse
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsedResponse = JSON.parse(cleanedResponse);

    // Make sure all expected fields exist
    const response = {
      isJobSearch: parsedResponse.isJobSearch === true,
      title: parsedResponse.title ?? null,
      location: parsedResponse.location ?? null,
      companyName: parsedResponse.companyName ?? null,
      category: parsedResponse.category ?? null,
      jobType: parsedResponse.jobType ?? null,
      salaryMin: parsedResponse.salaryMin ?? null,
      salaryMax: parsedResponse.salaryMax ?? null,
    };

    console.log("GROQ PARSED RESPONSE:", response);

    return NextResponse.json({
      response,
    });
  } catch (error) {
    console.error("CHATBOT ERROR:", error);

    return NextResponse.json(
      {
        error: "Could not understand the job search.",
      },
      { status: 500 }
    );
  }
}