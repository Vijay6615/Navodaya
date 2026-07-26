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

function buildSevaEmailHtml({
  heading,
  intro,
  bookingId,
  sevaType,
  amount,
  name,
  email,
  phone,
  sankalpName,
  gotra,
  message,
  paymentStatus,
  bookingStatus,
  buttonLabel,
  buttonUrl,
}) {
  return `
    <div style="margin:0;padding:28px 14px;background:#f7f3ef;font-family:Arial,sans-serif;color:#2f2925">
      <div style="max-width:680px;margin:0 auto;overflow:hidden;border:1px solid #eadfd7;border-radius:22px;background:#ffffff">
        <div style="padding:26px 28px;background:linear-gradient(135deg,#431407,#7f2f12);color:#ffffff">
          <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#e9bca2">
            Puja Dham Notification
          </p>
          <h1 style="margin:0;font-size:26px;line-height:34px">
            ${escapeHtml(heading)}
          </h1>
          <p style="margin:10px 0 0;font-size:14px;line-height:22px;color:#fbe6da">
            ${intro}
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

          <table style="width:100%;border-collapse:collapse">
            ${detailRow("Seva", escapeHtml(sevaType))}
            ${detailRow("Amount", `₹${Number(amount).toLocaleString("en-IN")}`)}
            ${detailRow("Devotee name", escapeHtml(name))}
            ${detailRow("Email", escapeHtml(email))}
            ${detailRow("Phone", escapeHtml(phone))}
            ${detailRow("Sankalp name", escapeHtml(sankalpName || "Not provided"))}
            ${detailRow("Gotra", escapeHtml(gotra || "Not provided"))}
            ${detailRow("Payment status", escapeHtml(paymentStatus))}
            ${detailRow("Booking status", escapeHtml(bookingStatus))}
          </table>

          <div style="margin-top:18px;padding:16px;border-radius:14px;background:#fffaf2">
            <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#a8441b">
              Prayer / Message
            </p>
            <p style="margin:0;font-size:13px;line-height:21px;color:#5f554f;white-space:pre-wrap;word-break:break-word">
              ${escapeHtml(message || "No special message")}
            </p>
          </div>

          ${
            buttonUrl
              ? `
                <a
                  href="${escapeHtml(buttonUrl)}"
                  style="display:inline-block;margin-top:22px;padding:13px 20px;border-radius:10px;background:#a8441b;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700"
                >
                  ${escapeHtml(buttonLabel)}
                </a>
              `
              : ""
          }
        </div>
      </div>
    </div>
  `;
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
    // Email notifications:
    // 1) Pandit Ji ko new Seva alert
    // 2) User ko booking received confirmation
    // Email fail ho tab bhi database booking safe rahegi.
    // ==========================================
    const appUrl = (
      process.env.NEXT_PUBLIC_APP_URL || ""
    ).replace(/\/$/, "");

    const panditDashboardUrl = appUrl
      ? `${appUrl}/pandit-dashboard`
      : "";

    const userDashboardUrl = appUrl
      ? `${appUrl}/my-bookings?tab=seva`
      : "";

    let adminEmailSent = false;
    let adminEmailId = null;
    let adminEmailError = null;

    let userEmailSent = false;
    let userEmailId = null;
    let userEmailError = null;

    const senderEmail =
      process.env.EMAIL_FROM?.trim();

    // Pandit Ji notification
    try {
      const adminEmail =
        process.env.ADMIN_EMAIL
          ?.toLowerCase()
          .trim();

      if (!adminEmail) {
        throw new Error("ADMIN_EMAIL is missing");
      }

      if (!senderEmail) {
        throw new Error("EMAIL_FROM is missing");
      }

      const adminEmailHtml = buildSevaEmailHtml({
        heading: "New Gau Seva Received",
        intro: `<strong>${escapeHtml(cleanName)}</strong> has offered <strong>${escapeHtml(cleanSevaType)}</strong> of <strong>₹${numericAmount.toLocaleString("en-IN")}</strong>.`,
        bookingId,
        sevaType: cleanSevaType,
        amount: numericAmount,
        name: cleanName,
        email: userEmail,
        phone: cleanPhone,
        sankalpName: newBooking.sankalpName,
        gotra: newBooking.gotra,
        message: newBooking.message,
        paymentStatus: "Pending",
        bookingStatus: "Pending",
        buttonLabel: "Open Pandit Dashboard",
        buttonUrl: panditDashboardUrl,
      });

      const adminEmailResponse =
        await resend.emails.send({
          from: senderEmail,
          to: adminEmail,
          subject: `🐄 New Gau Seva - ${cleanSevaType}`,
          html: adminEmailHtml,
        });

      if (adminEmailResponse?.error) {
        adminEmailError =
          adminEmailResponse.error.message ||
          "Resend rejected admin email";
      } else {
        adminEmailSent = true;
        adminEmailId =
          adminEmailResponse?.data?.id || null;
      }
    } catch (emailError) {
      adminEmailError =
        emailError?.message ||
        "Unknown admin email error";

      console.error(
        "ADMIN SEVA EMAIL ERROR:",
        emailError
      );
    }

    // User confirmation
    try {
      if (!senderEmail) {
        throw new Error("EMAIL_FROM is missing");
      }

      const userEmailHtml = buildSevaEmailHtml({
        heading: "Your Seva Has Been Received",
        intro: `Namaste <strong>${escapeHtml(cleanName)}</strong>. Your <strong>${escapeHtml(cleanSevaType)}</strong> request has been saved and is pending verification.`,
        bookingId,
        sevaType: cleanSevaType,
        amount: numericAmount,
        name: cleanName,
        email: userEmail,
        phone: cleanPhone,
        sankalpName: newBooking.sankalpName,
        gotra: newBooking.gotra,
        message: newBooking.message,
        paymentStatus: "Pending",
        bookingStatus: "Pending",
        buttonLabel: "View My Seva Booking",
        buttonUrl: userDashboardUrl,
      });

      const userEmailResponse =
        await resend.emails.send({
          from: senderEmail,
          to: userEmail,
          subject: `🙏 Seva Received - ${cleanSevaType}`,
          html: userEmailHtml,
        });

      if (userEmailResponse?.error) {
        userEmailError =
          userEmailResponse.error.message ||
          "Resend rejected user email";
      } else {
        userEmailSent = true;
        userEmailId =
          userEmailResponse?.data?.id || null;
      }
    } catch (emailError) {
      userEmailError =
        emailError?.message ||
        "Unknown user email error";

      console.error(
        "USER SEVA EMAIL ERROR:",
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
        userEmailSent,
        userEmailId,
        userEmailError,
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