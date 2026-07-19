// src/app/api/bookings/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ==========================================
// 1. GET: Fetch user-specific bookings (Live Sync)
// ==========================================
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    // 🔥 FIXED: Target database explicitly mapped to Panditji's dashboard
    const db = client.db("navodayapuja");

    const userBookings = await db
      .collection("bookings")
      .find({ email: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    const response = NextResponse.json({ bookings: userBookings }, { status: 200 });
    response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
    return response;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ==========================================
// 2. POST: Create a new booking in MongoDB (Panditji Sync)
// ==========================================
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const client = await clientPromise;
    // 🔥 FIXED: Naya data bhi ab seedhe "navodayapuja" DB mein hi insert hoga
    const db = client.db("navodayapuja");

    const newBooking = {
      ...body,
      email: session.user.email,
      userId: session.user.id || null,
      status: "pending", // Lowecase standard aligned with admin dynamic configuration
      createdAt: new Date(),
    };

    const result = await db.collection("bookings").insertOne(newBooking);

    return NextResponse.json({ 
      success: true, 
      message: "Booking saved successfully", 
      bookingId: result.insertedId 
    }, { status: 201 });

  } catch (error) {
    console.error("Error saving booking:", error);
    return NextResponse.json({ error: "Failed to process booking on server" }, { status: 500 });
  }
}

// ==========================================
// 3. DELETE: Clean Cancel operation via Query Parameter
// ==========================================
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("id");

    if (!bookingId) {
      return NextResponse.json({ error: "Missing booking ID parameter" }, { status: 400 });
    }

    const client = await clientPromise;
    // 🔥 FIXED: Direct targeted dynamic collection management
    const db = client.db("navodayapuja");

    const result = await db.collection("bookings").deleteOne({
      _id: new ObjectId(bookingId),
      email: session.user.email
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Booking not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Booking cancelled successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}