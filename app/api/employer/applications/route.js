import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
const VALID_STATUSES = ["APPLIED", "INTERVIEW", "ACCEPTED", "REJECTED"];

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Please login first." }, { status: 401 });
    }

    const url = new URL(request.url);
    const jobId = url.searchParams.get("jobId");

    const applications = await prisma.application.findMany({
      where: {
        job: {
          userId: Number(userId),
        },
        ...(jobId ? { jobId: Number(jobId) } : {}),
      },
      orderBy: {
        appliedAt: "desc",
      },
      include: {
        user: true,
        job: true,
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Please login first." }, { status: 401 });
    }

    const body = await request.json();
    const applicationId = Number(body.applicationId);
    const status = String(body.status || "").toUpperCase();

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ message: "Invalid status." }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application || application.job.userId !== Number(userId)) {
      return NextResponse.json({ message: "Not authorized." }, { status: 403 });
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        user: true,
        job: true,
      },
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
