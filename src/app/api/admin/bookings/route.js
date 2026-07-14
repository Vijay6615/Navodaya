import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Please login first" },
        { status: 401 }
      );
    }

    if (session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Admin access only" },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db("navodayapuja");

    const bookings = await db
      .collection("bookings")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedBookings = bookings.map((booking) => ({
      ...booking,
      _id: booking._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      bookings: formattedBookings,
    });
  } catch (error) {
    console.error("ADMIN BOOKINGS ERROR:", error);

    return NextResponse.json(
      { error: "Unable to load bookings" },
      { status: 500 }
    );
  }
}