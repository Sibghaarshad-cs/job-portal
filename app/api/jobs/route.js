import { NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        status: "Active",
      },
      orderBy: {
        postedAt: "desc",
      },
    });

    return NextResponse.json(jobs, {
      status: 200,
    });

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