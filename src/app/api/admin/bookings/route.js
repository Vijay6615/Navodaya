import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatBooking(booking, bookingType) {
  return {
    ...booking,
    _id: booking._id.toString(),
    bookingType,

    status:
      bookingType === "seva"
        ? booking.bookingStatus || "pending"
        : booking.status || "pending",

    paymentStatus:
      booking.paymentStatus || "pending",
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const sessionEmail = session?.user?.email
      ?.toLowerCase()
      .trim();

    const adminEmail = process.env.ADMIN_EMAIL
      ?.toLowerCase()
      .trim();

    if (!sessionEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Please login first",
        },
        { status: 401 }
      );
    }

    if (!adminEmail || sessionEmail !== adminEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Admin access only",
        },
        { status: 403 }
      );
    }

    const client = await clientPromise;

    const [pujaBookings, sevaBookings] =
      await Promise.all([
        client
          .db("navodayapuja")
          .collection("bookings")
          .find({})
          .sort({ createdAt: -1 })
          .toArray(),

        client
          .db("navodaya")
          .collection("seva_bookings")
          .find({})
          .sort({ createdAt: -1 })
          .toArray(),
      ]);

    const formattedPujas = pujaBookings.map(
      (booking) => formatBooking(booking, "puja")
    );

    const formattedSevas = sevaBookings.map(
      (booking) => formatBooking(booking, "seva")
    );

    const allBookings = [
      ...formattedPujas,
      ...formattedSevas,
    ].sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

    return NextResponse.json(
      {
        success: true,
        bookings: allBookings,
        counts: {
          total: allBookings.length,
          puja: formattedPujas.length,
          seva: formattedSevas.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ADMIN BOOKINGS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load bookings",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}