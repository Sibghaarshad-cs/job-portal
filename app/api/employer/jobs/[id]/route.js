import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

/* ===========================
   GET ONE JOB (Edit)
=========================== */

export async function GET(request, context) {
  try {
    const { id } = await context.params;

    const cookieStore = await cookies();
    const userId = Number(cookieStore.get("userId")?.value);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const job = await prisma.job.findFirst({
      where: {
        id: Number(id),
        userId,
      },
    });

    if (!job) {
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(job, { status: 200 });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

/* ===========================
   UPDATE JOB STATUS
=========================== */

export async function PATCH(request, context) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const cookieStore = await cookies();
    const userId = Number(cookieStore.get("userId")?.value);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check that the job belongs to the logged-in employer
    const job = await prisma.job.findFirst({
      where: {
        id: Number(id),
        userId,
      },
    });

    if (!job) {
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      );
    }

    const updatedJob = await prisma.job.update({
      where: {
        id: Number(id),
      },
      data: {
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
      },
    });

    return NextResponse.json(
      {
        message: "Job updated successfully",
        job: updatedJob,
      },
      {
        status: 200,
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
/* ===========================
   DELETE JOB
=========================== */

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;

    const cookieStore = await cookies();
    const userId = Number(cookieStore.get("userId")?.value);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const job = await prisma.job.findFirst({
      where: {
        id: Number(id),
        userId,
      },
    });

    if (!job) {
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      );
    }

    await prisma.job.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json(
      {
        message: "Job deleted successfully",
      },
      {
        status: 200,
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