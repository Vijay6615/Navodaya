import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";

import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import { resend } from "@/lib/resend";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DATABASE_NAME = "navodaya";
const COLLECTION_NAME = "seva_bookings";

function formatBooking(booking) {
  return {
    ...booking,
    _id: booking._id.toString(),
  };
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ==========================================
// POST: Create new Seva booking
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
          message: "Please login before offering Seva.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      sevaType = "Gau Seva",
      amount,
      name,
      phone,
      sankalpName = "",
      gotra = "",
      message = "",
    } = body;

    const numericAmount = Number(amount);
    const cleanName = String(name || "").trim();
    const cleanPhone = String(phone || "").trim();
    const cleanSevaType =
      String(sevaType || "").trim() || "Gau Seva";

    if (
      !cleanName ||
      !cleanPhone ||
      !Number.isFinite(numericAmount) ||
      numericAmount < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Valid amount, name and phone number are required.",
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
      bookingType: "seva",

      sevaType: cleanSevaType,
      amount: numericAmount,

      userId: session?.user?.id || null,
      userEmail,
      userName:
        session?.user?.name || cleanName,

      name: cleanName,
      email: userEmail,
      phone: cleanPhone,

      sankalpName: String(
        sankalpName || ""
      ).trim(),

      gotra: String(gotra || "").trim(),

      message: String(message || "").trim(),

      paymentStatus: "pending",
      bookingStatus: "pending",

      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(
      newBooking
    );

    const bookingId = result.insertedId.toString();

    console.log(
      "✅ Seva booking saved:",
      bookingId
    );

    // ==========================================
    // Send notification email to Pandit Ji
    // Booking remains saved even if email fails
    // ==========================================
    let adminEmailSent = false;
    let adminEmailId = null;
    let adminEmailError = null;

    try {
      const adminEmail =
        process.env.ADMIN_EMAIL
          ?.toLowerCase()
          .trim();

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

      const appUrl = (
        process.env.NEXT_PUBLIC_APP_URL || ""
      ).replace(/\/$/, "");

      const dashboardUrl = appUrl
        ? `${appUrl}/pandit-dashboard`
        : "";

      const safeName = escapeHtml(cleanName);
      const safeEmail = escapeHtml(userEmail);
      const safePhone = escapeHtml(cleanPhone);
      const safeSevaType =
        escapeHtml(cleanSevaType);

      const safeSankalp = escapeHtml(
        newBooking.sankalpName ||
          "Not provided"
      );

      const safeGotra = escapeHtml(
        newBooking.gotra ||
          "Not provided"
      );

      const safeMessage = escapeHtml(
        newBooking.message ||
          "No special message"
      );

      const adminEmailResponse =
        await resend.emails.send({
          from: senderEmail,
          to: adminEmail,

          subject: `🐄 New Gau Seva - ${cleanSevaType}`,

          html: `
            <div
              style="
                margin:0;
                padding:32px 16px;
                background:#f7f1ec;
                font-family:Arial,sans-serif;
                color:#2f241f;
              "
            >
              <div
                style="
                  max-width:620px;
                  margin:0 auto;
                  background:#ffffff;
                  border:1px solid #eadfd7;
                  border-radius:20px;
                  overflow:hidden;
                "
              >
                <div
                  style="
                    padding:28px 32px;
                    background:#431407;
                    color:#ffffff;
                  "
                >
                  <p
                    style="
                      margin:0 0 8px;
                      font-size:11px;
                      letter-spacing:2px;
                      text-transform:uppercase;
                      color:#e5b99d;
                    "
                  >
                    Puja Dham Notification
                  </p>

                  <h1
                    style="
                      margin:0;
                      font-size:28px;
                    "
                  >
                    New Gau Seva Received
                  </h1>
                </div>

                <div style="padding:32px">
                  <p
                    style="
                      margin-top:0;
                      font-size:16px;
                      line-height:26px;
                    "
                  >
                    <strong>${safeName}</strong>
                    has offered
                    <strong>${safeSevaType}</strong>
                    of
                    <strong>₹${numericAmount}</strong>.
                  </p>

                  <div
                    style="
                      margin:24px 0;
                      padding:20px;
                      background:#fffaf6;
                      border:1px solid #f0e4db;
                      border-radius:14px;
                    "
                  >
                    <p>
                      <strong>Booking ID:</strong>
                      ${bookingId}
                    </p>

                    <p>
                      <strong>Seva:</strong>
                      ${safeSevaType}
                    </p>

                    <p>
                      <strong>Amount:</strong>
                      ₹${numericAmount}
                    </p>

                    <p>
                      <strong>Name:</strong>
                      ${safeName}
                    </p>

                    <p>
                      <strong>Email:</strong>
                      ${safeEmail}
                    </p>

                    <p>
                      <strong>Phone:</strong>
                      ${safePhone}
                    </p>

                    <p>
                      <strong>Sankalp Name:</strong>
                      ${safeSankalp}
                    </p>

                    <p>
                      <strong>Gotra:</strong>
                      ${safeGotra}
                    </p>

                    <p style="margin-bottom:0">
                      <strong>Message:</strong>
                      ${safeMessage}
                    </p>
                  </div>

                  <p>
                    <strong>Payment Status:</strong>
                    Pending
                  </p>

                  <p>
                    <strong>Booking Status:</strong>
                    Pending
                  </p>

                  ${
                    dashboardUrl
                      ? `
                        <a
                          href="${dashboardUrl}"
                          style="
                            display:inline-block;
                            margin-top:18px;
                            padding:13px 22px;
                            background:#a8441b;
                            color:#ffffff;
                            text-decoration:none;
                            border-radius:10px;
                            font-weight:bold;
                          "
                        >
                          Open Pandit Dashboard
                        </a>
                      `
                      : ""
                  }
                </div>
              </div>
            </div>
          `,
        });

      console.log(
        "📧 ADMIN SEVA EMAIL RESPONSE:",
        JSON.stringify(
          adminEmailResponse,
          null,
          2
        )
      );

      if (adminEmailResponse?.error) {
        adminEmailError =
          adminEmailResponse.error.message ||
          "Resend rejected admin email";

        console.error(
          "❌ Admin Seva email failed:",
          adminEmailResponse.error
        );
      } else {
        adminEmailSent = true;

        adminEmailId =
          adminEmailResponse?.data?.id ||
          null;

        console.log(
          "✅ Pandit Ji Seva email sent:",
          adminEmailId
        );
      }
    } catch (emailError) {
      adminEmailError =
        emailError?.message ||
        "Unknown admin email error";

      console.error(
        "❌ ADMIN SEVA EMAIL ERROR:",
        emailError
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Seva booking created successfully.",

        booking: {
          ...newBooking,
          _id: bookingId,
        },

        adminEmailSent,
        adminEmailId,
        adminEmailError,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "CREATE SEVA BOOKING ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to create Seva booking.",

        error:
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
// GET: User gets own Seva bookings
// Admin gets all Seva bookings
// ==========================================
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const currentEmail =
      session?.user?.email
        ?.toLowerCase()
        .trim();

    if (!currentEmail) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please login to view Seva bookings.",
        },
        { status: 401 }
      );
    }

    const adminEmail =
      process.env.ADMIN_EMAIL
        ?.toLowerCase()
        .trim();

    const isAdmin =
      Boolean(adminEmail) &&
      currentEmail === adminEmail;

    const client = await clientPromise;

    const collection = client
      .db(DATABASE_NAME)
      .collection(COLLECTION_NAME);

    const filter = isAdmin
      ? {}
      : {
          $or: [
            { userEmail: currentEmail },
            { email: currentEmail },
          ],
        };

    const bookings = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    const response = NextResponse.json({
      success: true,
      isAdmin,
      count: bookings.length,
      bookings: bookings.map(formatBooking),
    });

    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, max-age=0, must-revalidate"
    );

    return response;
  } catch (error) {
    console.error(
      "FETCH SEVA BOOKINGS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to fetch Seva bookings.",

        error:
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
// PATCH: User submits payment;
// Admin updates status/payment
// ==========================================
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    const currentEmail =
      session?.user?.email
        ?.toLowerCase()
        .trim();

    if (!currentEmail) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please login to update this booking.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      bookingId,
      paymentStatus,
      bookingStatus,
    } = body;

    if (
      !bookingId ||
      !ObjectId.isValid(bookingId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking ID.",
        },
        { status: 400 }
      );
    }

    const adminEmail =
      process.env.ADMIN_EMAIL
        ?.toLowerCase()
        .trim();

    const isAdmin =
      Boolean(adminEmail) &&
      currentEmail === adminEmail;

    const client = await clientPromise;

    const collection = client
      .db(DATABASE_NAME)
      .collection(COLLECTION_NAME);

    const objectId = new ObjectId(bookingId);

    const existingBooking =
      await collection.findOne({
        _id: objectId,
      });

    if (!existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Seva booking not found.",
        },
        { status: 404 }
      );
    }

    const ownerEmail = String(
      existingBooking.userEmail ||
        existingBooking.email ||
        ""
    )
      .toLowerCase()
      .trim();

    if (
      !isAdmin &&
      ownerEmail !== currentEmail
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You cannot update this booking.",
        },
        { status: 403 }
      );
    }

    const updateData = {
      updatedAt: new Date(),
    };

    if (!isAdmin && paymentStatus) {
      if (paymentStatus !== "submitted") {
        return NextResponse.json(
          {
            success: false,
            message:
              "Users can only submit payment for verification.",
          },
          { status: 403 }
        );
      }

      updateData.paymentStatus =
        "submitted";

      updateData.paymentSubmittedAt =
        new Date();
    }

    if (isAdmin && paymentStatus) {
      const allowedPaymentStatuses = [
        "pending",
        "submitted",
        "paid",
        "failed",
      ];

      if (
        !allowedPaymentStatuses.includes(
          paymentStatus
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid payment status.",
          },
          { status: 400 }
        );
      }

      updateData.paymentStatus =
        paymentStatus;

      if (paymentStatus === "paid") {
        updateData.paymentVerifiedAt =
          new Date();
      }
    }

    if (isAdmin && bookingStatus) {
      const allowedBookingStatuses = [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
      ];

      if (
        !allowedBookingStatuses.includes(
          bookingStatus
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid booking status.",
          },
          { status: 400 }
        );
      }

      updateData.bookingStatus =
        bookingStatus;

      if (bookingStatus === "completed") {
        updateData.completedAt =
          new Date();
      }
    }

    await collection.updateOne(
      {
        _id: objectId,
      },
      {
        $set: updateData,
      }
    );

    const updatedBooking =
      await collection.findOne({
        _id: objectId,
      });

    return NextResponse.json({
      success: true,
      message:
        "Seva booking updated successfully.",
      booking: formatBooking(
        updatedBooking
      ),
    });
  } catch (error) {
    console.error(
      "UPDATE SEVA BOOKING ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update Seva booking.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}