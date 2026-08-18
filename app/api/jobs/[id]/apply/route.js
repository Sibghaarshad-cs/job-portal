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

    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        {
          message: "Please login to apply.",
        },
        {
          status: 401,
        }
      );
    }

    // =====================================================
    // GET JOB
    // =====================================================

    const job = await prisma.job.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!job) {
      return NextResponse.json(
        {
          message: "Job not found.",
        },
        {
          status: 404,
        }
      );
    }

    const contentType = request.headers.get("content-type") || "";

    // =====================================================
    // HANDLE MULTIPART FORM DATA
    // =====================================================

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      const name = formData.get("name")?.toString() || "";
      const email = formData.get("email")?.toString() || "";
      const contact = formData.get("contact")?.toString() || "";

      let resumePath = null;
      let cvScore = null;
      let cvAnalysis = null;

      const resumeFile = formData.get("resume");

      // =====================================================
      // CHECK CV
      // =====================================================

      if (resumeFile && resumeFile.size && resumeFile.name) {
        // ===================================================
        // SAVE CV
        // ===================================================

        resumePath = await saveFile(
          resumeFile,
          resumeFile.name
        );

        // ===================================================
        // EXTRACT CV TEXT
        // ===================================================

        const resumeText = await extractResumeText(resumePath);

        console.log("========== CV TEXT ==========");
        console.log(resumeText);
        console.log("=============================");

        // ===================================================
        // SEND CV + JOB TO GROQ
        // ===================================================

        cvAnalysis = await analyzeCV({
          cvText: resumeText,
          jobTitle: job.title,
          jobDescription: job.description,
          jobRequirements: job.requirements,
        });

        console.log("========== CV ANALYSIS ==========");
        console.log(cvAnalysis);
        console.log("=================================");

        // ===================================================
        // GET RAW SCORES FROM GROQ
        // ===================================================

        const keywordScore = Number(
          cvAnalysis?.keywordMatch?.score ?? 0
        );

        const skillsScore = Number(
          cvAnalysis?.skillsAlignment?.score ?? 0
        );

        const experienceScore = Number(
          cvAnalysis?.experienceRelevance?.score ?? 0
        );

        const educationScore = Number(
          cvAnalysis?.educationRelevance?.score ?? 0
        );

        console.log("========== RAW CV SCORES ==========");
        console.log("Keyword Score:", keywordScore);
        console.log("Skills Score:", skillsScore);
        console.log("Experience Score:", experienceScore);
        console.log("Education Score:", educationScore);
        console.log("===================================");

        // ===================================================
        // GET EMPLOYER WEIGHTS FROM JOB
        // ===================================================

        const keywordWeight = Number(
          job.keywordWeight ?? 25
        );

        const skillsWeight = Number(
          job.skillsWeight ?? 25
        );

        const experienceWeight = Number(
          job.experienceWeight ?? 25
        );

        const educationWeight = Number(
          job.educationWeight ?? 25
        );

        console.log("========== EMPLOYER WEIGHTS ==========");
        console.log("Keyword Weight:", keywordWeight);
        console.log("Skills Weight:", skillsWeight);
        console.log(
          "Experience Weight:",
          experienceWeight
        );
        console.log(
          "Education Weight:",
          educationWeight
        );
        console.log("======================================");

        // ===================================================
        // CHECK THAT WEIGHTS EQUAL 100
        // ===================================================

        const totalWeight =
          keywordWeight +
          skillsWeight +
          experienceWeight +
          educationWeight;

        if (totalWeight !== 100) {
          return NextResponse.json(
            {
              message:
                "Invalid job evaluation weights. The total must equal 100%.",
            },
            {
              status: 400,
            }
          );
        }

        // ===================================================
        // CALCULATE WEIGHTED CONTRIBUTIONS
        // ===================================================

        const keywordContribution =
          (keywordScore * keywordWeight) / 100;

        const skillsContribution =
          (skillsScore * skillsWeight) / 100;

        const experienceContribution =
          (experienceScore * experienceWeight) / 100;

        const educationContribution =
          (educationScore * educationWeight) / 100;

        // ===================================================
        // CALCULATE FINAL CV SCORE
        // ===================================================

        const finalScore =
          keywordContribution +
          skillsContribution +
          experienceContribution +
          educationContribution;

        // Round to 2 decimal places
        cvScore = Number(finalScore.toFixed(2));

        console.log("========== WEIGHTED CV SCORE ==========");
        console.log(
          "Keyword Contribution:",
          keywordContribution
        );
        console.log(
          "Skills Contribution:",
          skillsContribution
        );
        console.log(
          "Experience Contribution:",
          experienceContribution
        );
        console.log(
          "Education Contribution:",
          educationContribution
        );
        console.log("FINAL CV SCORE:", cvScore);
        console.log("=======================================");
      }

      // =====================================================
      // CREATE APPLICATION
      // =====================================================

      const application = await prisma.application.create({
        data: {
          jobId: Number(id),
          userId: Number(userId),
          status: "APPLIED",
          resume: resumePath,
          cvScore: cvScore,
          cvAnalysis: cvAnalysis,
          contactNumber: contact,
        },
      });

      return NextResponse.json(
        {
          message: "Application submitted successfully.",
          application,
        },
        {
          status: 201,
        }
      );
    }

    // =====================================================
    // FALLBACK FOR JSON REQUESTS
    // =====================================================

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
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("APPLICATION ERROR:", error);

    return NextResponse.json(
      {
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}