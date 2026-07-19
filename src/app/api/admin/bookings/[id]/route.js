import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { authOptions } from "@/lib/auth";

const ALLOWED_STATUS = ["pending", "confirmed", "cancelled", "completed"];

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (session?.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized Access" }, { status: 403 });
    }

    // Dynamic Route Parameters matching validation
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    if (!id) {
      return NextResponse.json({ error: "Missing Booking ID Parameter" }, { status: 400 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status || !ALLOWED_STATUS.includes(status.toLowerCase().trim())) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const client = await clientPromise;
    // 🔥 CENTRAL FIX: Aligned explicitly with the "navodayapuja" database instance
    const db = client.db("navodayapuja"); 

    // Dynamic type evaluation layer for structural safety
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { bookingId: id };
    const cleanStatus = status.toLowerCase().trim();

    const result = await db.collection("bookings").updateOne(query, {
      $set: { 
        status: cleanStatus, 
        updatedAt: new Date() 
      }
    });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Booking not found in navodayapuja db" }, { status: 404 });
    }

    return NextResponse.json({ success: true, status: cleanStatus });
  } catch (error) {
    console.error("Admin PATCH error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (session?.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized Access" }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: "Missing Target ID" }, { status: 400 });
    }

    const client = await clientPromise;
    // 🔥 CENTRAL FIX: Aligned explicitly with the "navodayapuja" database instance
    const db = client.db("navodayapuja"); 

    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { bookingId: id };
    const result = await db.collection("bookings").deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin DELETE error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}