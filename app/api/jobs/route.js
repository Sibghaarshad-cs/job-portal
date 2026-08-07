import { NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim();
    const location = searchParams.get("location")?.trim();
    const category = searchParams.get("category")?.trim();
    const jobType = searchParams.get("jobType")?.trim();

    const excludeOwn = searchParams.get("excludeOwn");
    const shouldExcludeOwn =
      excludeOwn === null ? true : excludeOwn === "true";

    const where = {
      status: "Active",
      ...(category && { category }),
      ...(jobType && { jobType }),
      ...(location && {
        location: {
          contains: location,
          mode: "insensitive",
        },
      }),
      ...(userId && shouldExcludeOwn && {
        userId: {
          not: Number(userId),
        },
      }),
    };

    if (search) {
      where.AND = [
        {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              companyName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
      ];
    }

    const jobs = await prisma.job.findMany({
      where,
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