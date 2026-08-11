import { NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET(request) {
try {
const cookieStore = await cookies();
const userId = cookieStore.get("userId")?.value;

const { searchParams } = new URL(request.url);

const title = searchParams.get("title")?.trim();
const location = searchParams.get("location")?.trim();
const companyName = searchParams.get("companyName")?.trim();
const category = searchParams.get("category")?.trim();
const jobType = searchParams.get("jobType")?.trim();

const salaryMinParam = searchParams.get("salaryMin");
const salaryMaxParam = searchParams.get("salaryMax");

const salaryMin =
  salaryMinParam !== null &&
  salaryMinParam !== "" &&
  !Number.isNaN(Number(salaryMinParam))
    ? Number(salaryMinParam)
    : null;

const salaryMax =
  salaryMaxParam !== null &&
  salaryMaxParam !== "" &&
  !Number.isNaN(Number(salaryMaxParam))
    ? Number(salaryMaxParam)
    : null;

/*
  --------------------------------------------------
  NORMALIZE JOB TYPE
  --------------------------------------------------

  Database:
    Full-Time
    Part-Time

  Groq:
    Full Time
    Part Time

  Convert both to the same format.
*/

let normalizedJobType = jobType;

if (jobType) {
  const type = jobType.toLowerCase().replace(/[\s_-]/g, "");

  if (type === "fulltime") {
    normalizedJobType = "Full-Time";
  } else if (type === "parttime") {
    normalizedJobType = "Part-Time";
  } else if (type === "remote") {
    normalizedJobType = "Remote";
  } else if (type === "contract") {
    normalizedJobType = "Contract";
  }
}

/*
  --------------------------------------------------
  BUILD FILTERS
  --------------------------------------------------
*/

const AND = [];

/*
  Don't show jobs posted by current user.
*/

if (userId) {
  AND.push({
    userId: {
      not: Number(userId),
    },
  });
}

/*
  Only active jobs.
*/

AND.push({
  status: "Active",
});

/*
  --------------------------------------------------
  TITLE
  --------------------------------------------------
*/

if (title) {
  AND.push({
    title: {
      contains: title,
      mode: "insensitive",
    },
  });
}

/*
  --------------------------------------------------
  LOCATION
  --------------------------------------------------

  Search BOTH:

    location
    companyLocation

  Example:

    user asks "jobs in Islamabad"

  It can match:

    location = Islamabad

  OR

    companyLocation = Islamabad
*/

if (location) {
  AND.push({
    location: {
      contains: location,
      mode: "insensitive",
    },
  });
}
/*
  --------------------------------------------------
  COMPANY NAME
  --------------------------------------------------
*/

if (companyName) {
  AND.push({
    companyName: {
      contains: companyName,
      mode: "insensitive",
    },
  });
}

/*
  --------------------------------------------------
  CATEGORY
  --------------------------------------------------
*/

if (category) {
  AND.push({
    category: {
      contains: category,
      mode: "insensitive",
    },
  });
}

/*
  --------------------------------------------------
  JOB TYPE
  --------------------------------------------------
*/

if (normalizedJobType) {
  AND.push({
    jobType: {
      contains: normalizedJobType,
      mode: "insensitive",
    },
  });
}

/*
  --------------------------------------------------
  SALARY
  --------------------------------------------------

  "above 100000"

  means:

  job's maximum salary must be >= 100000


  "below 100000"

  means:

  job's minimum salary must be <= 100000


  "between 80000 and 120000"

  means:

  job salary range must overlap
  with user's requested range.
*/

if (salaryMin !== null) {
  AND.push({
    salaryMax: {
      gte: salaryMin,
    },
  });
}

if (salaryMax !== null) {
  AND.push({
    salaryMin: {
      lte: salaryMax,
    },
  });
}

const where = {
  AND,
};

console.log("JOB SEARCH FILTER:", where);

const jobs = await prisma.job.findMany({
  where,

  orderBy: {
    postedAt: "desc",
  },
});

console.log("MATCHING JOBS:", jobs.length);

return NextResponse.json(jobs, {
  status: 200,
});

} catch (error) {
console.error("JOBS API ERROR:", error);

return NextResponse.json(
  {
    message: "Something went wrong while searching jobs.",
  },
  {
    status: 500,
  }
);

}
}