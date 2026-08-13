import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma/client";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { extractResumeText } from "../../../../../lib/extractResumeText";
import { analyzeCV } from "../../../../../lib/analyzeCV";

const prisma = new PrismaClient();

async function saveFile(file, filename) {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const safeName = `${Date.now()}-${filename.replace(
    /[^a-z0-9.\-]/gi,
    "_"
  )}`;

  const filePath = path.join(uploadsDir, safeName);

  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.promises.writeFile(filePath, buffer);

  return `/uploads/${safeName}`;
}

export async function POST(request, context) {
  try {
    const { id } = await context.params;

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { message: "Please login to apply." },
        { status: 401 }
      );
    }

    const job = await prisma.job.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!job) {
      return NextResponse.json(
        { message: "Job not found." },
        { status: 404 }
      );
    }

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      const name = formData.get("name")?.toString() || "";
      const email = formData.get("email")?.toString() || "";
      const contact = formData.get("contact")?.toString() || "";

      let resumePath = null;
      let cvScore = null;
      let cvAnalysis = null;

      const resumeFile = formData.get("resume");

      if (resumeFile && resumeFile.size && resumeFile.name) {
        // Save the uploaded CV
        resumePath = await saveFile(
          resumeFile,
          resumeFile.name
        );

        // Extract text from CV
        const resumeText = await extractResumeText(resumePath);

        console.log("========== CV TEXT ==========");
        console.log(resumeText);
        console.log("=============================");

        // Analyze CV against the job
        cvAnalysis = await analyzeCV({
          cvText: resumeText,
          jobTitle: job.title,
          jobDescription: job.description,
          jobRequirements: job.requirements,
        });

        console.log("========== CV ANALYSIS ==========");
        console.log(cvAnalysis);
        console.log("=================================");

        // Get overall score
        cvScore = cvAnalysis?.overallScore ?? null;

        console.log("CV SCORE:", cvScore);
      }

      // Create application and save CV analysis
      const application = await prisma.application.create({
        data: {
          jobId: Number(id),
          userId: Number(userId),
          status: "APPLIED",
          resume: resumePath,
          cvScore: cvScore,
          cvAnalysis: cvAnalysis,
        },
      });

      return NextResponse.json(
        {
          message: "Application submitted successfully.",
          application,
        },
        { status: 201 }
      );
    }

    // Fallback for JSON requests
    const body = await request.json();

    const application = await prisma.application.create({
      data: {
        jobId: Number(id),
        userId: Number(userId),
        status: "APPLIED",
        resume: body.resume || null,
        cvScore: null,
        cvAnalysis: null,
      },
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully.",
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("APPLICATION ERROR:", error);

    return NextResponse.json(
      {
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}