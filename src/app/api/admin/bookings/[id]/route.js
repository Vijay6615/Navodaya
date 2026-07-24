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

async function checkAdmin() {
  const session =
    await getServerSession(authOptions);

  const sessionEmail = session?.user?.email
    ?.toLowerCase()
    .trim();

  const adminEmail = process.env.ADMIN_EMAIL
    ?.toLowerCase()
    .trim();

  return {
    session,
    isAdmin:
      !!sessionEmail &&
      !!adminEmail &&
      sessionEmail === adminEmail,
  };
}

function getDatabaseAndCollection(
  client,
  bookingType
) {
  if (bookingType === "seva") {
    return {
      database: client.db("navodaya"),
      collectionName: "seva_bookings",
      statusField: "bookingStatus",
    };
  }

  return {
    database: client.db("navodayapuja"),
    collectionName: "bookings",
    statusField: "status",
  };
}

function getBookingQuery(id) {
  return ObjectId.isValid(id)
    ? {
        _id: new ObjectId(id),
      }
    : {
        bookingId: id,
      };
}

function getEmailTemplate(status) {
  switch (status) {
    case "pending":
      return {
        template: BookingPending,
        prefix: "⌛ Booking Pending",
      };

    case "confirmed":
      return {
        template: BookingConfirmed,
        prefix: "✅ Booking Confirmed",
      };

    case "rejected":
    case "cancelled":
      return {
        template: BookingRejected,
        prefix: "❌ Booking Update",
      };

    case "completed":
      return {
        template: BookingCompleted,
        prefix: "🙏 Booking Completed",
      };

    default:
      return {
        template: null,
        prefix: "",
      };
  }
}

export async function PATCH(
  request,
  { params }
) {
  try {
    const { isAdmin } = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized Access",
        },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Booking ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const bookingType =
      body?.bookingType === "seva"
        ? "seva"
        : "puja";

    const requestedStatus = body?.status
      ?.toLowerCase()
      .trim();

    const paymentStatus = body?.paymentStatus
      ?.toLowerCase()
      .trim();

    const rejectionReason =
      body?.reason?.trim() ||
      body?.rejectionReason?.trim() ||
      "";

    if (
      requestedStatus &&
      !ALLOWED_STATUS.includes(
        requestedStatus
      )
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

    const allowedPaymentStatuses = [
      "pending",
      "submitted",
      "paid",
      "failed",
    ];

    if (
      paymentStatus &&
      !allowedPaymentStatuses.includes(
        paymentStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment status",
        },
        { status: 400 }
      );
    }

    if (
      !requestedStatus &&
      !paymentStatus
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Status or payment status is required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const {
      database,
      collectionName,
      statusField,
    } = getDatabaseAndCollection(
      client,
      bookingType
    );

    const collection =
      database.collection(collectionName);

    const query = getBookingQuery(id);

    const existingBooking =
      await collection.findOne(query);

    if (!existingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: `${
            bookingType === "seva"
              ? "Seva"
              : "Puja"
          } booking not found`,
        },
        { status: 404 }
      );
    }

    const updateData = {
      updatedAt: new Date(),
    };

    if (requestedStatus) {
      updateData[statusField] =
        requestedStatus;

      if (
        requestedStatus === "rejected" ||
        requestedStatus === "cancelled"
      ) {
        updateData.rejectionReason =
          rejectionReason ||
          "The booking has been cancelled by Pandit Ji.";
      } else {
        updateData.rejectionReason = "";
      }

      if (
        bookingType === "seva" &&
        requestedStatus === "confirmed" &&
        existingBooking.paymentStatus ===
          "submitted"
      ) {
        updateData.paymentStatus = "paid";
        updateData.paymentVerifiedAt =
          new Date();
      }

      if (
        requestedStatus === "completed"
      ) {
        updateData.completedAt =
          new Date();
      }
    }

    if (paymentStatus) {
      updateData.paymentStatus =
        paymentStatus;

      if (paymentStatus === "paid") {
        updateData.paymentVerifiedAt =
          new Date();
      }
    }

    await collection.updateOne(
      query,
      {
        $set: updateData,
      }
    );

    const updatedBooking =
      await collection.findOne(query);

    let emailSent = false;
    let emailError = null;

    if (requestedStatus) {
      try {
        const recipientEmail = (
          updatedBooking.email ||
          updatedBooking.userEmail ||
          ""
        ).trim();

        const senderEmail =
          process.env.EMAIL_FROM?.trim();

        const {
          template: EmailTemplate,
          prefix,
        } = getEmailTemplate(
          requestedStatus
        );

        if (
          recipientEmail &&
          senderEmail &&
          EmailTemplate
        ) {
          const appUrl = (
            process.env
              .NEXT_PUBLIC_APP_URL || ""
          ).replace(/\/$/, "");

          const dashboardUrl = appUrl
            ? `${appUrl}/my-bookings?tab=${bookingType}`
            : "";

          const whatsappUrl =
            process.env
              .NEXT_PUBLIC_WHATSAPP_URL ||
            "";

          const bookingName =
            bookingType === "seva"
              ? updatedBooking.sevaType ||
                "Gau Seva"
              : updatedBooking.pujaName ||
                updatedBooking.puja ||
                "Puja";

          const emailBooking = {
            ...updatedBooking,

            _id:
              updatedBooking._id.toString(),

            bookingId:
              updatedBooking.bookingId ||
              updatedBooking._id.toString(),

            status: requestedStatus,

            pujaName: bookingName,

            pujaType:
              bookingType === "seva"
                ? "Seva"
                : updatedBooking.pujaType,

            price:
              bookingType === "seva"
                ? `₹${updatedBooking.amount}`
                : updatedBooking.price,

            date:
              bookingType === "seva"
                ? new Date(
                    updatedBooking.createdAt
                  ).toLocaleDateString(
                    "en-IN"
                  )
                : updatedBooking.date,

            timeSlot:
              bookingType === "seva"
                ? "Flexible"
                : updatedBooking.timeSlot,
          };

          const html = await render(
            React.createElement(
              EmailTemplate,
              {
                booking: emailBooking,

                reason:
                  updatedBooking
                    .rejectionReason || "",

                dashboardUrl,
                whatsappUrl,
              }
            )
          );

          const response =
            await resend.emails.send({
              from: senderEmail,
              to: recipientEmail,

              subject: `${prefix} - ${bookingName}`,

              html,
            });

          if (response?.error) {
            emailError =
              response.error.message;
          } else {
            emailSent = true;
          }
        }
      } catch (error) {
        emailError = error.message;

        console.error(
          "Status email error:",
          error
        );
      }
    }

    return NextResponse.json(
      {
        success: true,

        message: `${
          bookingType === "seva"
            ? "Seva"
            : "Puja"
        } booking updated successfully`,

        bookingType,
        status:
          requestedStatus ||
          updatedBooking[statusField],

        paymentStatus:
          updatedBooking.paymentStatus,

        emailSent,
        emailError,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "ADMIN PATCH ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Update failed",

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

export async function DELETE(
  request,
  { params }
) {
  try {
    const { isAdmin } = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized Access",
        },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const id = resolvedParams?.id;

    const body = await request
      .json()
      .catch(() => ({}));

    const bookingType =
      body?.bookingType === "seva"
        ? "seva"
        : "puja";

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing booking ID",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const {
      database,
      collectionName,
    } = getDatabaseAndCollection(
      client,
      bookingType
    );

    const result = await database
      .collection(collectionName)
      .deleteOne(getBookingQuery(id));

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${
        bookingType === "seva"
          ? "Seva"
          : "Puja"
      } booking deleted successfully`,
    });
  } catch (error) {
    console.error(
      "ADMIN DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Delete failed",
      },
      { status: 500 }
    );
  }
}