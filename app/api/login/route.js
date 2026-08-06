import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "../../generated/prisma/client";
import { loginSchema } from "../../../schemas/loginSchema";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Get request body
    const body = await request.json();

    // Validate data using Zod
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: result.error.issues[0].message,
        },
        {
          status: 400,
        }
      );
    }

    const { email, password } = result.data;

    // Find user by email
    // Find user by email
const user = await prisma.user.findUnique({
  where: {
    email,
  },
});

// Email not found
if (!user) {
  return NextResponse.json(
    {
      message: "Account not found. Please create an account first.",
    },
    {
      status: 404,
    }
  );
}

// Compare password
const isPasswordCorrect = await bcrypt.compare(
  password,
  user.password
);

// Wrong password
if (!isPasswordCorrect) {
  return NextResponse.json(
    {
      message: "Incorrect password.",
    },
    {
      status: 401,
    }
  );
}
   // Login successful

const response = NextResponse.json(
  {
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  },
  {
    status: 200,
  }
);

// Save logged-in user's ID in a cookie
response.cookies.set("userId", user.id.toString(), {
  httpOnly: true,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
});

return response;

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