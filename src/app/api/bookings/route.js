// src/app/api/bookings/route.js

import React from "react";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { render } from "@react-email/render";

import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import { resend } from "@/lib/resend";
import BookingPending from "@/emails/BookingPending";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ==========================================
// 1. GET: Fetch logged-in user's bookings
// ==========================================
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const userEmail = session?.user?.email
      ?.toLowerCase()
      .trim();

    if (!userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("navodayapuja");

    const userBookings = await db
      .collection("bookings")
      .find({ email: userEmail })
      .sort({ createdAt: -1 })
      .toArray();

    const response = NextResponse.json(
      {
        success: true,
        bookings: userBookings,
      },
      { status: 200 }
    );

    response.headers.set(
      "Cache-Control",
      "no-store, max-age=0, must-revalidate"
    );

    return response;
  } catch (error) {
    console.error(
      "❌ Error fetching bookings:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// 2. POST: Create booking and send Pending email
// ==========================================
export async function POST(request) {
  try {
    // ==========================================
    // Check authenticated user
    // ==========================================
    const session = await getServerSession(authOptions);

    const userEmail = session?.user?.email
      ?.toLowerCase()
      .trim();

    if (!userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // ==========================================
    // Read booking request body
    // ==========================================
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid booking data",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Connect MongoDB
    // ==========================================
    const client = await clientPromise;
    const db = client.db("navodayapuja");

    const bookingsCollection =
      db.collection("bookings");

    // ==========================================
    // Prepare booking data
    // ==========================================
    const newBooking = {
      ...body,

      // Always use authenticated user's email
      email: userEmail,

      userId: session?.user?.id || null,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // ==========================================
    // Save booking in MongoDB
    // ==========================================
    const result =
      await bookingsCollection.insertOne(
        newBooking
      );

    const bookingId =
      result.insertedId.toString();

    console.log(
      "✅ Booking saved in MongoDB:",
      bookingId
    );

    // ==========================================
    // Email result variables
    // ==========================================
    let emailSent = false;
    let emailId = null;
    let emailErrorMessage = null;

    // ==========================================
    // Send Pending booking email
    // Email failure will not delete booking
    // ==========================================
    try {
      const senderEmail =
        process.env.EMAIL_FROM?.trim();

      if (!senderEmail) {
        throw new Error(
          "EMAIL_FROM is missing in .env.local"
        );
      }

      const appUrl = (
        process.env.NEXT_PUBLIC_APP_URL || ""
      ).replace(/\/$/, "");

      const dashboardUrl = appUrl
        ? `${appUrl}/my-bookings`
        : "";

      const whatsappUrl =
        process.env.NEXT_PUBLIC_WHATSAPP_URL ||
        "";

      const emailHtml = await render(
        React.createElement(BookingPending, {
          booking: {
            ...newBooking,
            _id: bookingId,
            bookingId:
              newBooking.bookingId ||
              bookingId,
            status: "pending",
          },

          dashboardUrl,
          whatsappUrl,
        })
      );

      console.log(
        "📧 Sending Pending email to:",
        userEmail
      );

      const emailResponse =
        await resend.emails.send({
          from: senderEmail,

          // Actual booking user's email
          to: userEmail,

          subject: `⌛ Booking Received - ${
            newBooking.pujaName ||
            "Puja Dham"
          }`,

          html: emailHtml,
        });

      console.log(
        "📧 PENDING EMAIL RESPONSE:",
        JSON.stringify(
          emailResponse,
          null,
          2
        )
      );

      if (emailResponse?.error) {
        emailErrorMessage =
          emailResponse.error.message ||
          "Resend rejected the email";

        console.error(
          "❌ Pending email failed:",
          emailResponse.error
        );
      } else {
        emailSent = true;

        emailId =
          emailResponse?.data?.id || null;

        console.log(
          "✅ Pending email accepted by Resend"
        );

        console.log(
          "📧 Resend Email ID:",
          emailId
        );
      }
    } catch (emailError) {
      emailErrorMessage =
        emailError?.message ||
        "Unknown email error";

      console.error(
        "❌ Pending email sending failed:",
        emailError
      );
    }

    // ==========================================
    // Booking success response
    // ==========================================
    return NextResponse.json(
      {
        success: true,
        message:
          "Booking saved successfully",
        bookingId,
        status: "pending",
        emailSent,
        emailId,
        emailError: emailErrorMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "❌ Error saving booking:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to process booking on server",

        details:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

// ==========================================
// 3. DELETE: Cancel user's own booking
// ==========================================
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    const userEmail = session?.user?.email
      ?.toLowerCase()
      .trim();

    if (!userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(
      request.url
    );

    const bookingId =
      searchParams.get("id");

    if (!bookingId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing booking ID parameter",
        },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(bookingId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid booking ID",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("navodayapuja");

    const result = await db
      .collection("bookings")
      .deleteOne({
        _id: new ObjectId(bookingId),
        email: userEmail,
      });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Booking not found or you are not authorized",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Booking cancelled successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "❌ Error deleting booking:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",

        details:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}