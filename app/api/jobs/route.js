import { NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    const jobs = await prisma.job.findMany({
      where: {
        status: "Active",

        ...(userId && {
          userId: {
            not: Number(userId),
          },
        }),
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