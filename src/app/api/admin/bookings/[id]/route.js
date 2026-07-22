import React from "react";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { render } from "@react-email/render";

import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import { resend } from "@/lib/resend";

import BookingPending from "@/emails/BookingPending";
import BookingConfirmed from "@/emails/BookingConfirmed";
import BookingRejected from "@/emails/BookingRejected";
import BookingCompleted from "@/emails/BookingCompleted";

const ALLOWED_STATUS = [
  "pending",
  "confirmed",
  "rejected",
  "cancelled",
  "completed",
];

// ==========================================
// PATCH: Update booking status and send email
// ==========================================
export async function PATCH(req, { params }) {
  try {
    // ==========================================
    // 1. Admin authentication
    // ==========================================
    const session = await getServerSession(authOptions);

    const sessionEmail = session?.user?.email
      ?.toLowerCase()
      .trim();

    const adminEmail = process.env.ADMIN_EMAIL
      ?.toLowerCase()
      .trim();

    if (
      !sessionEmail ||
      !adminEmail ||
      sessionEmail !== adminEmail
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized Access",
        },
        { status: 403 }
      );
    }

    // ==========================================
    // 2. Get booking ID
    // ==========================================
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Booking ID Parameter",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // 3. Read and validate request body
    // ==========================================
    const body = await req.json();

    const requestedStatus = body?.status
      ?.toLowerCase()
      .trim();

    const rejectionReason =
      body?.reason?.trim() ||
      body?.rejectionReason?.trim() ||
      "";

    if (
      !requestedStatus ||
      !ALLOWED_STATUS.includes(requestedStatus)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status",
          allowedStatus: ALLOWED_STATUS,
        },
        { status: 400 }
      );
    }

    // ==========================================
    // 4. Connect MongoDB
    // ==========================================
    const client = await clientPromise;
    const db = client.db("navodayapuja");

    const bookingsCollection =
      db.collection("bookings");

    // Supports MongoDB _id and custom bookingId
    const query = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { bookingId: id };

    // ==========================================
    // 5. Find existing booking
    // ==========================================
    const existingBooking =
      await bookingsCollection.findOne(query);

    if (!existingBooking) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Booking not found in navodayapuja database",
        },
        { status: 404 }
      );
    }

    const existingStatus = String(
      existingBooking.status || ""
    )
      .toLowerCase()
      .trim();

    // Prevent duplicate email for same status
    if (existingStatus === requestedStatus) {
      return NextResponse.json(
        {
          success: true,
          status: requestedStatus,
          emailSent: false,
          message: `Booking is already ${requestedStatus}`,
        },
        { status: 200 }
      );
    }

    // ==========================================
    // 6. Prepare update operation
    // ==========================================
    const updateOperation = {
      $set: {
        status: requestedStatus,
        updatedAt: new Date(),
      },
    };

    if (
      requestedStatus === "rejected" ||
      requestedStatus === "cancelled"
    ) {
      updateOperation.$set.rejectionReason =
        rejectionReason ||
        "The selected date or time slot is currently unavailable.";
    } else {
      updateOperation.$unset = {
        rejectionReason: "",
      };
    }

    // ==========================================
    // 7. Update booking status
    // ==========================================
    const updateResult =
      await bookingsCollection.updateOne(
        query,
        updateOperation
      );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking update failed",
        },
        { status: 404 }
      );
    }

    // ==========================================
    // 8. Fetch updated booking
    // ==========================================
    const updatedBooking =
      await bookingsCollection.findOne(query);

    if (!updatedBooking) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Booking updated but updated record could not be loaded",
        },
        { status: 500 }
      );
    }

    console.log(
      `✅ Booking status updated: ${requestedStatus}`
    );

    // ==========================================
    // 9. Select email template and subject
    // ==========================================
    let EmailTemplate = null;
    let emailSubject = "";

    switch (requestedStatus) {
      case "pending":
        EmailTemplate = BookingPending;
        emailSubject = `⌛ Booking Pending - ${
          updatedBooking.pujaName || "Puja Dham"
        }`;
        break;

      case "confirmed":
        EmailTemplate = BookingConfirmed;
        emailSubject = `✅ Booking Confirmed - ${
          updatedBooking.pujaName || "Puja Dham"
        }`;
        break;

      case "rejected":
      case "cancelled":
        EmailTemplate = BookingRejected;
        emailSubject = `❌ Booking Update - ${
          updatedBooking.pujaName || "Puja Dham"
        }`;
        break;

      case "completed":
        EmailTemplate = BookingCompleted;
        emailSubject = `🙏 Puja Completed - ${
          updatedBooking.pujaName || "Puja Dham"
        }`;
        break;

      default:
        EmailTemplate = null;
    }

    let emailSent = false;
    let emailId = null;
    let emailErrorMessage = null;

    // ==========================================
    // 10. Send email to actual booking user
    // ==========================================
    if (EmailTemplate) {
      try {
        const senderEmail =
          process.env.EMAIL_FROM?.trim();

        if (!senderEmail) {
          throw new Error(
            "EMAIL_FROM is missing in .env.local"
          );
        }

        const recipientEmail =
          updatedBooking.email?.trim();

        if (!recipientEmail) {
          throw new Error(
            "Booking recipient email is missing"
          );
        }

        const appUrl = (
          process.env.NEXT_PUBLIC_APP_URL || ""
        ).replace(/\/$/, "");

        const dashboardUrl = appUrl
          ? `${appUrl}/my-bookings`
          : "";

        const whatsappUrl =
          process.env.NEXT_PUBLIC_WHATSAPP_URL || "";

        const bookingId =
          updatedBooking.bookingId ||
          updatedBooking._id.toString();

        const emailHtml = await render(
          React.createElement(EmailTemplate, {
            booking: {
              ...updatedBooking,
              _id: updatedBooking._id.toString(),
              bookingId,
              status: requestedStatus,
            },

            reason:
              updatedBooking.rejectionReason || "",

            dashboardUrl,
            whatsappUrl,
          })
        );

        console.log(
          `📧 Sending ${requestedStatus} email to:`,
          recipientEmail
        );

        const emailResponse =
          await resend.emails.send({
            from: senderEmail,
            to: recipientEmail,
            subject: emailSubject,
            html: emailHtml,
          });

        console.log(
          `📧 ${requestedStatus.toUpperCase()} EMAIL RESPONSE:`,
          JSON.stringify(emailResponse, null, 2)
        );

        if (emailResponse?.error) {
          emailErrorMessage =
            emailResponse.error.message ||
            "Resend rejected the email";

          console.error(
            `❌ ${requestedStatus} email failed:`,
            emailResponse.error
          );
        } else {
          emailSent = true;
          emailId =
            emailResponse?.data?.id || null;

          console.log(
            `✅ ${requestedStatus} email accepted by Resend`
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
          `❌ ${requestedStatus} email sending failed:`,
          emailError
        );
      }
    }

    // ==========================================
    // 11. Return success response
    // ==========================================
    return NextResponse.json(
      {
        success: true,
        message: `Booking status updated to ${requestedStatus}`,
        status: requestedStatus,
        emailSent,
        emailId,
        emailError: emailErrorMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Admin PATCH error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Update failed",
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
// DELETE: Delete booking
// ==========================================
export async function DELETE(req, { params }) {
  try {
    // Admin authentication
    const session = await getServerSession(authOptions);

    const sessionEmail = session?.user?.email
      ?.toLowerCase()
      .trim();

    const adminEmail = process.env.ADMIN_EMAIL
      ?.toLowerCase()
      .trim();

    if (
      !sessionEmail ||
      !adminEmail ||
      sessionEmail !== adminEmail
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized Access",
        },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Target ID",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("navodayapuja");

    const query = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { bookingId: id };

    const result = await db
      .collection("bookings")
      .deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Admin DELETE error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Delete failed",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}