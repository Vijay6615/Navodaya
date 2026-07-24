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

const DATABASE_NAME = "navodayapuja";
const COLLECTION_NAME = "bookings";

// ==========================================
// GET: Logged-in user ki sirf Puja bookings
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

    const bookings = await client
      .db(DATABASE_NAME)
      .collection(COLLECTION_NAME)
      .find({
        email: userEmail,

        // Safety filter:
        // Seva type ka record galti se collection me ho to bhi na aaye
        bookingType: {
          $ne: "seva",
        },
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

    const formattedBookings = bookings.map((booking) => ({
      ...booking,
      _id: booking._id.toString(),
      bookingType: "puja",
    }));

    const response = NextResponse.json(
      {
        success: true,
        count: formattedBookings.length,
        bookings: formattedBookings,
      },
      { status: 200 }
    );

    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, max-age=0, must-revalidate"
    );

    return response;
  } catch (error) {
    console.error("GET PUJA BOOKINGS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch Puja bookings",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

// ==========================================
// POST: Sirf nayi Puja booking create karega
// ==========================================
export async function POST(request) {
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

    const pujaName = (
      body.pujaName ||
      body.puja ||
      ""
    ).trim();

    const customerName = (
      body.name ||
      body.customerName ||
      session.user.name ||
      ""
    ).trim();

    const phone = String(
      body.phone || ""
    ).trim();

    if (!pujaName) {
      return NextResponse.json(
        {
          success: false,
          error: "Puja name is required",
        },
        { status: 400 }
      );
    }

    if (!customerName) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer name is required",
        },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Phone number is required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const collection = client
      .db(DATABASE_NAME)
      .collection(COLLECTION_NAME);

    const now = new Date();

    const newBooking = {
      ...body,

      bookingType: "puja",

      pujaName,
      name: customerName,
      phone,

      email: userEmail,
      userId: session?.user?.id || null,
      userName:
        session?.user?.name || customerName,

      status: "pending",

      createdAt: now,
      updatedAt: now,
    };

    // Seva fields galti se aaye to remove kar do
    delete newBooking.sevaType;
    delete newBooking.sankalpName;
    delete newBooking.gotra;
    delete newBooking.bookingStatus;
    delete newBooking.paymentStatus;

    const result = await collection.insertOne(newBooking);

    const bookingId = result.insertedId.toString();

    let userEmailSent = false;
    let userEmailError = null;

    // User ko pending email
    try {
      const senderEmail =
        process.env.EMAIL_FROM?.trim();

      if (!senderEmail) {
        throw new Error(
          "EMAIL_FROM is missing"
        );
      }

      const appUrl = (
        process.env.NEXT_PUBLIC_APP_URL || ""
      ).replace(/\/$/, "");

      const dashboardUrl = appUrl
        ? `${appUrl}/my-bookings?tab=puja`
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

      const emailResponse =
        await resend.emails.send({
          from: senderEmail,
          to: userEmail,
          subject: `⌛ Booking Received - ${pujaName}`,
          html: emailHtml,
        });

      if (emailResponse?.error) {
        userEmailError =
          emailResponse.error.message ||
          "User email failed";
      } else {
        userEmailSent = true;
      }
    } catch (error) {
      userEmailError = error.message;

      console.error(
        "USER PUJA EMAIL ERROR:",
        error
      );
    }

    // Pandit Ji ko new Puja notification
    let adminEmailSent = false;
    let adminEmailError = null;

    try {
      const adminEmail =
        process.env.ADMIN_EMAIL?.trim();

      const senderEmail =
        process.env.EMAIL_FROM?.trim();

      if (!adminEmail) {
        throw new Error(
          "ADMIN_EMAIL is missing"
        );
      }

      if (!senderEmail) {
        throw new Error(
          "EMAIL_FROM is missing"
        );
      }

      const adminResponse =
        await resend.emails.send({
          from: senderEmail,
          to: adminEmail,

          subject: `🔔 New Puja Booking - ${pujaName}`,

          html: `
            <div style="background:#f8f4f0;padding:30px;font-family:Arial,sans-serif">
              <div style="max-width:620px;margin:auto;background:#ffffff;padding:32px;border-radius:16px;border:1px solid #eadfd7">
                <h2 style="color:#a8441b;margin-top:0">
                  New Puja Booking Received
                </h2>

                <p>
                  <strong>${customerName}</strong>
                  has booked a Puja.
                </p>

                <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />

                <p><strong>Puja:</strong> ${pujaName}</p>
                <p><strong>Email:</strong> ${userEmail}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Date:</strong> ${newBooking.date || "Not selected"}</p>
                <p><strong>Time:</strong> ${newBooking.timeSlot || newBooking.slot || "Flexible"}</p>
                <p><strong>Mode:</strong> ${newBooking.pujaType || "Offline"}</p>
                <p><strong>Amount:</strong> ${newBooking.price || "Free"}</p>
                <p><strong>Status:</strong> Pending</p>
                <p><strong>Booking ID:</strong> ${bookingId}</p>
              </div>
            </div>
          `,
        });

      if (adminResponse?.error) {
        adminEmailError =
          adminResponse.error.message ||
          "Admin email failed";
      } else {
        adminEmailSent = true;
      }
    } catch (error) {
      adminEmailError = error.message;

      console.error(
        "ADMIN PUJA EMAIL ERROR:",
        error
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Puja booking saved successfully",
        bookingId,
        bookingType: "puja",
        status: "pending",
        userEmailSent,
        userEmailError,
        adminEmailSent,
        adminEmailError,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST PUJA BOOKING ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create Puja booking",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

// ==========================================
// DELETE: User apni Puja booking cancel karega
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

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("id");

    if (!bookingId) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking ID is required",
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

    const collection = client
      .db(DATABASE_NAME)
      .collection(COLLECTION_NAME);

    const booking = await collection.findOne({
      _id: new ObjectId(bookingId),
      email: userEmail,
      bookingType: {
        $ne: "seva",
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Puja booking not found or access denied",
        },
        { status: 404 }
      );
    }

    const currentStatus = String(
      booking.status || "pending"
    )
      .toLowerCase()
      .trim();

    if (currentStatus === "completed") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Completed Puja booking cannot be cancelled",
        },
        { status: 400 }
      );
    }

    await collection.updateOne(
      {
        _id: new ObjectId(bookingId),
        email: userEmail,
      },
      {
        $set: {
          status: "cancelled",
          cancelledBy: "user",
          cancelledAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Puja booking cancelled successfully",
        bookingId,
        status: "cancelled",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "DELETE PUJA BOOKING ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to cancel Puja booking",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}