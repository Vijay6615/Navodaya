import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
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
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        { message: "Please enter a valid name" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          message: "Password must be at least 6 characters",
        },
        { status: 400 }
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
      .findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          message: existingUser.password
            ? "Account already exists"
            : "This email is already linked with Google login",
        },
        { status: 409 }
      );
    }

    // ==========================================
    // GENERATE OTP
    // ==========================================
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const otpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // ==========================================
    // HASH PASSWORD
    // ==========================================
    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // ==========================================
    // SAVE TEMP REGISTER DATA
    // ==========================================
    await db.collection("register_otps").updateOne(
      { email },
      {
        $set: {
          name,
          email,

          // Never save plain password
          password: hashedPassword,

          otp,
          otpExpires,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    // ==========================================
    // EMAIL TRANSPORTER
    // ==========================================
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // ==========================================
    // SEND OTP EMAIL
    // ==========================================
    await transporter.sendMail({
      from: `"Puja Dham" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: "Verify your Puja Dham account",

      html: `
        <div
          style="
            max-width:520px;
            margin:30px auto;
            padding:40px;
            font-family:Arial,sans-serif;
            background:#fffaf7;
            border:1px solid #eee4df;
          "
        >

          <h1
            style="
              color:#7a2e2e;
              text-align:center;
              margin-bottom:5px;
            "
          >
            PUJA DHAM
          </h1>

          <p
            style="
              text-align:center;
              color:#777;
              letter-spacing:3px;
              font-size:12px;
            "
          >
            MANTRA · VIDHI · AASTHA
          </p>

          <h2
            style="
              text-align:center;
              color:#222;
              margin-top:35px;
            "
          >
            Verify your email
          </h2>

          <p
            style="
              color:#666;
              text-align:center;
            "
          >
            Namaste ${name} 🙏
          </p>

          <p
            style="
              color:#666;
              text-align:center;
              line-height:1.6;
            "
          >
            Use the verification code below to complete
            your Puja Dham registration.
          </p>

          <div
            style="
              margin:30px auto;
              text-align:center;
              font-size:36px;
              font-weight:bold;
              letter-spacing:10px;
              color:#7a2e2e;
            "
          >
            ${otp}
          </div>

          <p
            style="
              color:#999;
              text-align:center;
              font-size:13px;
            "
          >
            This OTP is valid for 10 minutes.
          </p>

          <hr
            style="
              border:none;
              border-top:1px solid #eee;
              margin:30px 0;
            "
          />

          <p
            style="
              color:#aaa;
              text-align:center;
              font-size:12px;
              line-height:1.5;
            "
          >
            If you did not request this verification,
            you can safely ignore this email.
          </p>

        </div>
      `,
    });

    // ==========================================
    // SUCCESS
    // ==========================================
    return NextResponse.json(
      {
        message: "OTP sent successfully",
        email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "SEND REGISTER OTP ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to send OTP",
      },
      { status: 500 }
    );
  }
}