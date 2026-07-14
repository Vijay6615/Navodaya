import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();

    const email = body.email?.toLowerCase().trim();
    const otp = body.otp?.toString().trim();

    // ==========================================
    // VALIDATION
    // ==========================================
    if (!email || !otp) {
      return NextResponse.json(
        {
          message: "Email and OTP are required",
        },
        {
          status: 400,
        }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          message: "Please enter a valid 6-digit OTP",
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
    // FIND REGISTER OTP DATA
    // ==========================================
    const otpData = await db
      .collection("register_otps")
      .findOne({
        email,
      });

    if (!otpData) {
      return NextResponse.json(
        {
          message:
            "OTP not found. Please request a new OTP",
        },
        {
          status: 404,
        }
      );
    }

    // ==========================================
    // CHECK OTP EXPIRY
    // ==========================================
    const otpExpiryTime = new Date(
      otpData.otpExpires
    ).getTime();

    if (otpExpiryTime < Date.now()) {
      await db
        .collection("register_otps")
        .deleteOne({
          email,
        });

      return NextResponse.json(
        {
          message:
            "OTP expired. Please request a new OTP",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // VERIFY OTP
    // ==========================================
    if (otpData.otp !== otp) {
      return NextResponse.json(
        {
          message: "Invalid OTP",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // CHECK USER AGAIN
    // ==========================================
    const existingUser = await db
      .collection("users")
      .findOne({
        email,
      });

    if (existingUser) {
      await db
        .collection("register_otps")
        .deleteOne({
          email,
        });

      return NextResponse.json(
        {
          message: "Account already exists",
        },
        {
          status: 409,
        }
      );
    }

    // ==========================================
    // CREATE VERIFIED USER
    // PASSWORD IS ALREADY HASHED
    // ==========================================
    const result = await db
      .collection("users")
      .insertOne({
        name: otpData.name,
        email: otpData.email,

        password: otpData.password,

        emailVerified: new Date(),
        image: null,

        createdAt: new Date(),
        updatedAt: new Date(),
      });

    // ==========================================
    // DELETE USED OTP DATA
    // ==========================================
    await db
      .collection("register_otps")
      .deleteOne({
        email,
      });

    // ==========================================
    // SUCCESS
    // ==========================================
    return NextResponse.json(
      {
        message:
          "Email verified successfully",

        user: {
          id: result.insertedId.toString(),
          name: otpData.name,
          email: otpData.email,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "VERIFY REGISTER OTP ERROR:",
      error
    );

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