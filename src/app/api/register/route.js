import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const email = body.email?.toLowerCase().trim();
    const password = body.password;

    // ==========================================
    // VALIDATION
    // ==========================================
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        {
          message: "Please enter a valid name",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 6 characters",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // DATABASE
    // ==========================================
    const client = await clientPromise;
    const db = client.db();

    // ==========================================
    // CHECK EXISTING USER
    // ==========================================
    const existingUser = await db
      .collection("users")
      .findOne({
        email,
      });

    if (existingUser) {
      return NextResponse.json(
        {
          message: existingUser.password
            ? "Account already exists"
            : "This email is already linked with Google login",
        },
        {
          status: 409,
        }
      );
    }

    // ==========================================
    // HASH PASSWORD
    // ==========================================
    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // ==========================================
    // CREATE USER
    // ==========================================
    const result = await db
      .collection("users")
      .insertOne({
        name,
        email,
        password: hashedPassword,
        emailVerified: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    // ==========================================
    // SUCCESS
    // ==========================================
    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: result.insertedId.toString(),
          name,
          email,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

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