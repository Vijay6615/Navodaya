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

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emailValue(value, fallback = "Not provided") {
  if (value === null || value === undefined || value === "") {
    return escapeHtml(fallback);
  }

  return escapeHtml(value);
}

function formatCurrency(value, fallback = "Not provided") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value === "number") {
    return `₹${value.toLocaleString("en-IN")}`;
  }

  const stringValue = String(value).trim();

  if (stringValue.startsWith("₹")) {
    return stringValue;
  }

  const numericValue = Number(
    stringValue.replace(/[^\d.-]/g, "")
  );

  if (
    stringValue &&
    Number.isFinite(numericValue)
  ) {
    return `₹${numericValue.toLocaleString("en-IN")}`;
  }

  return stringValue || fallback;
}

function detailRow(label, value) {
  return `
    <tr>
      <td style="padding:9px 0;color:#81756e;font-size:13px;vertical-align:top;width:38%">
        ${escapeHtml(label)}
      </td>
      <td style="padding:9px 0;color:#2f2925;font-size:13px;font-weight:700;vertical-align:top;word-break:break-word">
        ${value}
      </td>
    </tr>
  `;
}

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
    // Booking email fail ho tab bhi DB booking safe rahegi.
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
        throw new Error("ADMIN_EMAIL is missing");
      }

      if (!senderEmail) {
        throw new Error("EMAIL_FROM is missing");
      }

      const appUrl = (
        process.env.NEXT_PUBLIC_APP_URL || ""
      ).replace(/\/$/, "");

      const panditDashboardUrl = appUrl
        ? `${appUrl}/pandit-dashboard`
        : "";

      const safePujaName = emailValue(pujaName);
      const safeCustomerName = emailValue(customerName);
      const safeUserEmail = emailValue(userEmail);
      const safePhone = emailValue(phone);
      const safeDate = emailValue(
        newBooking.date,
        "Not selected"
      );
      const safeTime = emailValue(
        newBooking.timeSlot ||
          newBooking.slot ||
          "Flexible"
      );
      const safeMode = emailValue(
        newBooking.pujaType ||
          newBooking.mode ||
          "Offline Puja"
      );
      const safeAddress = emailValue(
        newBooking.address,
        safeMode.toLowerCase().includes("online")
          ? "Online Puja"
          : "Not provided"
      );
      const safeSamagriOption = emailValue(
        newBooking.samagriOption,
        "Customer will arrange Puja Samagri"
      );
      const safeSamagriProvider = emailValue(
        newBooking.samagriProvidedBy,
        String(newBooking.samagriOption || "")
          .toLowerCase()
          .includes("pandit")
          ? "Pandit Ji"
          : "Customer"
      );
      const safeBasePrice = emailValue(
        formatCurrency(
          newBooking.basePrice ||
            newBooking.price
        )
      );
      const safeSamagriCharge = emailValue(
        formatCurrency(
          newBooking.samagriCharge,
          "₹0"
        )
      );
      const safeTotalPrice = emailValue(
        formatCurrency(
          newBooking.totalPrice ||
            newBooking.price
        )
      );
      const safeTransactionId = emailValue(
        newBooking.transactionId,
        safeMode.toLowerCase().includes("online")
          ? "Not provided"
          : "Pay on service"
      );
      const safeMessage = emailValue(
        newBooking.message,
        "No special instructions"
      );

      const safeSamagriItems =
        Array.isArray(newBooking.samagriItems) &&
        newBooking.samagriItems.length > 0
          ? newBooking.samagriItems
              .filter(Boolean)
              .map((item) => escapeHtml(item))
              .join(", ")
          : "No item list saved";

      const adminEmailHtml = `
        <div style="margin:0;padding:28px 14px;background:#f7f3ef;font-family:Arial,sans-serif;color:#2f2925">
          <div style="max-width:680px;margin:0 auto;overflow:hidden;border:1px solid #eadfd7;border-radius:22px;background:#ffffff">
            <div style="padding:26px 28px;background:linear-gradient(135deg,#7f2f12,#a8441b);color:#ffffff">
              <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#ffd9c3">
                Puja Dham Notification
              </p>
              <h1 style="margin:0;font-size:26px;line-height:34px">
                New Puja Booking Received
              </h1>
              <p style="margin:10px 0 0;font-size:14px;line-height:22px;color:#fff1e8">
                ${safeCustomerName} booked ${safePujaName}.
              </p>
            </div>

            <div style="padding:26px 28px">
              <div style="margin-bottom:20px;padding:16px;border:1px solid #f0e3da;border-radius:14px;background:#fffaf6">
                <p style="margin:0 0 5px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#a8441b">
                  Booking ID
                </p>
                <p style="margin:0;font-family:monospace;font-size:13px;font-weight:700;word-break:break-all;color:#3b332e">
                  ${escapeHtml(bookingId)}
                </p>
              </div>

              <h2 style="margin:0 0 8px;font-size:16px;color:#2f2925">
                Devotee & Schedule
              </h2>

              <table style="width:100%;border-collapse:collapse">
                ${detailRow("Puja", safePujaName)}
                ${detailRow("Devotee name", safeCustomerName)}
                ${detailRow("Email", safeUserEmail)}
                ${detailRow("Phone", safePhone)}
                ${detailRow("Puja mode", safeMode)}
                ${detailRow("Preferred date", safeDate)}
                ${detailRow("Preferred time", safeTime)}
                ${detailRow("Address", safeAddress)}
              </table>

              <div style="height:1px;margin:18px 0;background:#eee7e1"></div>

              <h2 style="margin:0 0 8px;font-size:16px;color:#2f2925">
                Samagri & Pricing
              </h2>

              <table style="width:100%;border-collapse:collapse">
                ${detailRow("Samagri option", safeSamagriOption)}
                ${detailRow("Samagri provider", safeSamagriProvider)}
                ${detailRow("Samagri items", safeSamagriItems)}
                ${detailRow("Base Puja price", safeBasePrice)}
                ${detailRow("Samagri charge", safeSamagriCharge)}
                ${detailRow("Total amount", safeTotalPrice)}
                ${detailRow("UTR / Payment", safeTransactionId)}
                ${detailRow("Status", "Pending")}
              </table>

              <div style="margin-top:18px;padding:16px;border-radius:14px;background:#f3f8f5">
                <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#397054">
                  Special Instructions
                </p>
                <p style="margin:0;font-size:13px;line-height:21px;color:#4e6256;white-space:pre-wrap;word-break:break-word">
                  ${safeMessage}
                </p>
              </div>

              ${
                panditDashboardUrl
                  ? `
                    <a
                      href="${escapeHtml(panditDashboardUrl)}"
                      style="display:inline-block;margin-top:22px;padding:13px 20px;border-radius:10px;background:#a8441b;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700"
                    >
                      Open Pandit Dashboard
                    </a>
                  `
                  : ""
              }
            </div>
          </div>
        </div>
      `;

      const adminResponse =
        await resend.emails.send({
          from: senderEmail,
          to: adminEmail,
          subject: `🔔 New Puja Booking - ${pujaName}`,
          html: adminEmailHtml,
        });

      if (adminResponse?.error) {
        adminEmailError =
          adminResponse.error.message ||
          "Admin email failed";
      } else {
        adminEmailSent = true;
        adminEmailId =
          adminResponse?.data?.id || null;
      }
    } catch (error) {
      adminEmailError =
        error?.message ||
        "Unknown admin email error";

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
        adminEmailId,
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