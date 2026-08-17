import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function analyzeCV({ cvText, jobTitle, jobDescription, jobRequirements }) {
  const prompt = `
You are an AI CV evaluator for a job portal.

Analyze the candidate's CV against the job information.

JOB TITLE:
${jobTitle}

JOB DESCRIPTION:
${jobDescription}

JOB REQUIREMENTS:
${jobRequirements}

CANDIDATE CV:
${cvText}

Evaluate ONLY these four areas:

1. Education relevance
2. Experience relevance
3. Skills alignment
4. Keyword match

For each area provide:
- score: integer from 0 to 100
- text: short explanation

Also provide an overallScore from 0 to 100.

Return ONLY valid JSON in exactly this structure:

{
  "educationRelevance": {
    "score": 0,
    "text": ""
  },
  "experienceRelevance": {
    "score": 0,
    "text": ""
  },
  "skillsAlignment": {
    "score": 0,
    "text": ""
  },
  "keywordMatch": {
    "score": 0,
    "text": ""
  },
  "overallScore": 0
}
`;

  const completion = await groq.chat.completions.create({
model: "openai/gpt-oss-120b",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: "You are a precise CV evaluator. Return only valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const responseText = completion.choices[0]?.message?.content || "";

const cleanedResponse = responseText
  .replace(/```json/gi, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(cleanedResponse);

  return JSON.parse(responseText);
}