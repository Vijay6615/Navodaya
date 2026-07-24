import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

const DATABASE_NAME = "navodaya";
const COLLECTION_NAME = "seva_bookings";

function formatBooking(booking) {
  return {
    ...booking,
    _id: booking._id.toString(),
  };
}

// CREATE SEVA BOOKING
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
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

    if (
      !name?.trim() ||
      !phone?.trim() ||
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

      sevaType: sevaType.trim() || "Gau Seva",
      amount: numericAmount,

      userId: session.user.id || null,
      userEmail: session.user.email.toLowerCase(),
      userName: session.user.name || name.trim(),

      name: name.trim(),
      email: session.user.email.toLowerCase(),
      phone: phone.trim(),

      sankalpName: sankalpName.trim(),
      gotra: gotra.trim(),
      message: message.trim(),

      paymentStatus: "pending",
      bookingStatus: "pending",

      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(newBooking);

    return NextResponse.json(
      {
        success: true,
        message: "Seva booking created successfully.",
        booking: {
          ...newBooking,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Seva booking error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create Seva booking.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET USER OR ADMIN SEVA BOOKINGS
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login to view Seva bookings.",
        },
        { status: 401 }
      );
    }

    const client = await clientPromise;

    const collection = client
      .db(DATABASE_NAME)
      .collection(COLLECTION_NAME);

    const currentEmail =
      session.user.email.toLowerCase();

    const adminEmail =
      process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();

    const isAdmin =
      !!adminEmail &&
      currentEmail === adminEmail;

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

    return NextResponse.json(
      {
        success: true,
        isAdmin,
        count: bookings.length,
        bookings: bookings.map(formatBooking),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch Seva bookings error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch Seva bookings.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// UPDATE PAYMENT OR BOOKING STATUS
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login to update this booking.",
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

    const client = await clientPromise;

    const collection = client
      .db(DATABASE_NAME)
      .collection(COLLECTION_NAME);

    const currentEmail =
      session.user.email.toLowerCase();

    const adminEmail =
      process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();

    const isAdmin =
      !!adminEmail &&
      currentEmail === adminEmail;

    const objectId = new ObjectId(bookingId);

    const existingBooking =
      await collection.findOne({
        _id: objectId,
      });

    if (!existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message: "Seva booking not found.",
        },
        { status: 404 }
      );
    }

    const bookingEmail = (
      existingBooking.userEmail ||
      existingBooking.email ||
      ""
    ).toLowerCase();

    if (
      !isAdmin &&
      bookingEmail !== currentEmail
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

    // NORMAL USER PAYMENT SUBMIT
    if (!isAdmin && paymentStatus) {
      if (paymentStatus !== "submitted") {
        return NextResponse.json(
          {
            success: false,
            message:
              "User can only submit payment for verification.",
          },
          { status: 403 }
        );
      }

      updateData.paymentStatus = "submitted";
      updateData.paymentSubmittedAt =
        new Date();
    }

    // ADMIN PAYMENT STATUS UPDATE
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

    // ADMIN BOOKING STATUS UPDATE
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

    return NextResponse.json(
      {
        success: true,
        message:
          "Seva booking updated successfully.",
        booking: formatBooking(
          updatedBooking
        ),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Seva booking error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update Seva booking.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}