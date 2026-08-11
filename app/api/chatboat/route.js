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
          content:
            "You are a helpful job search assistant for a job portal.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const response = completion.choices[0]?.message?.content;

    return NextResponse.json({
      response,
    });
  } catch (error) {
    console.error("Groq error:", error);

    return NextResponse.json(
      {
        error: "Failed to communicate with Groq.",
      },
      { status: 500 }
    );
  } 
}