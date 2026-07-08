import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

function generateBookingId() {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `NPJ-${year}-${random}`;
}

export async function POST(req) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Please login first" }, { status: 401 });
  }

  const body = await req.json();
  const { pujaName, pujaSlug, price, date, timeSlot, address, phone } = body;

  if (!pujaName || !date || !timeSlot || !phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("navodayapuja");

  const booking = {
    bookingId: generateBookingId(),
    userEmail: session.user.email,
    userName: session.user.name,
    pujaName,
    pujaSlug,
    price,
    date,
    timeSlot,
    address,
    phone,
    status: "pending",
    createdAt: new Date(),
  };

  const result = await db.collection("bookings").insertOne(booking);

  return NextResponse.json({
    success: true,
    bookingId: booking.bookingId,
    id: result.insertedId,
  });
}

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: "Please login first" },
      { status: 401 }
    );
  }

  const client = await clientPromise;
  const db = client.db("navodayapuja");

  const bookings = await db
    .collection("bookings")
    .find({ userEmail: session.user.email })
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
}