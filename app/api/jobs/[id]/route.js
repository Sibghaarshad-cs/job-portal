import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

export async function GET(request, context) {
  try {
    const { id } = await context.params;

    const job = await prisma.job.findUnique({ where: { id: Number(id) } });

    if (!job) {
      return NextResponse.json({ message: "Job not found." }, { status: 404 });
    }

    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
