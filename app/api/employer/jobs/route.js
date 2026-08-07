import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { message: "Please login first." },
        { status: 401 }
      );
    }

    const jobs = await prisma.job.findMany({
      where: {
        userId: Number(userId),
      },
      orderBy: {
        postedAt: "desc",
      },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}export async function POST(request) {
  try {
    // Read form data
    const body = await request.json();

    // Read logged-in user's ID from the cookie
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    // Check if the user is logged in
    if (!userId) {
      return NextResponse.json(
        {
          message: "Please login first.",
        },
        {
          status: 401,
        }
      );
    }

    // Save the job in the database
    const job = await prisma.job.create({
      data: {
        userId: Number(userId),

        title: body.title,
        companyName: body.companyName,
        companyLocation: body.companyLocation,
        location: body.location,
        category: body.category,
        jobType: body.jobType,
        description: body.description,
        requirements: body.requirements,
        salaryMin: Number(body.salaryMin),
        salaryMax: Number(body.salaryMax),

        status: "Active",
      },
    });

    return NextResponse.json(
      {
        message: "Job posted successfully",
        job,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}