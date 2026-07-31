import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "../../generated/prisma/client";

const prisma = new PrismaClient();


export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      password,
      role,
    } = body;


    // Basic validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }


    // Check existing user

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });


    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email already exists",
        },
        {
          status: 400,
        }
      );
    }



    // Hash password

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );



    // Create user

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });



    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      {
        status: 201,
      }
    );


  } catch (error) {

    console.log(error);

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