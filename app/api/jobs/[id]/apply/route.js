import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma/client";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function saveFile(file, filename) {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const safeName = `${Date.now()}-${filename.replace(/[^a-z0-9.\-]/gi, "_")}`;
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
      return NextResponse.json({ message: "Please login to apply." }, { status: 401 });
    }

    const job = await prisma.job.findUnique({ where: { id: Number(id) } });
    if (!job) {
      return NextResponse.json({ message: "Job not found." }, { status: 404 });
    }

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const name = formData.get("name")?.toString() || "";
      const email = formData.get("email")?.toString() || "";
      const contact = formData.get("contact")?.toString() || "";
      const expectedSalary = Number(formData.get("expectedSalary")?.toString() || 0);
      const availableFromRaw = formData.get("availableFrom")?.toString();
      const coverLetter = formData.get("coverLetter")?.toString() || "";
      const availableFrom = availableFromRaw ? new Date(availableFromRaw) : new Date();

      let resumePath = null;
      const resumeFile = formData.get("resume");
      if (resumeFile && resumeFile.size && resumeFile.name) {
        resumePath = await saveFile(resumeFile, resumeFile.name);
      }

      const application = await prisma.application.create({
        data: {
          jobId: Number(id),
          userId: Number(userId),
          status: "APPLIED",
          coverLetter,
          expectedSalary,
          availableFrom,
          resume: resumePath,
        },
      });

      return NextResponse.json({ message: "Application submitted successfully.", application }, { status: 201 });
    }

    // Fallback for JSON
    const body = await request.json();
    const application = await prisma.application.create({
      data: {
        jobId: Number(id),
        userId: Number(userId),
        status: "APPLIED",
        coverLetter: body.coverLetter || "",
        expectedSalary: Number(body.expectedSalary) || 0,
        availableFrom: body.availableFrom ? new Date(body.availableFrom) : new Date(),
        resume: body.resume || null,
      },
    });

    return NextResponse.json({ message: "Application submitted successfully.", application }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
