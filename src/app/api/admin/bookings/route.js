import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatBooking(booking, bookingType) {
  if (bookingType === "store") {
    return {
      ...booking,
      _id: booking._id.toString(),
      bookingType: "store",
      bookingCategory: "Store Order",
      pujaName: `Store Order (${booking.items?.length || 0} items)`,
      pujaHindiName: `सामग्री ऑर्डर (${booking.items?.length || 0} सामग्री)`,
      name: booking.customer?.fullName || "Devotee",
      userName: booking.customer?.fullName || "Devotee",
      phone: booking.customer?.phone || "",
      email: booking.customer?.email || "",
      userEmail: booking.customer?.email || "",
      city: booking.shippingAddress?.city || "Mumbai",
      address: `${booking.shippingAddress?.address || ""}${
        booking.shippingAddress?.landmark
          ? `, Near ${booking.shippingAddress.landmark}`
          : ""
      }, ${booking.shippingAddress?.city || ""} - ${
        booking.shippingAddress?.pincode || ""
      }`.trim(),
      amount: booking.pricing?.total || 0,
      totalAmount: booking.pricing?.total || 0,
      totalPrice: booking.pricing?.total ? `₹${booking.pricing.total}` : "₹0",
      paymentMethod: booking.paymentMethod || "cod",
      status: booking.status || "placed",
      paymentStatus: booking.paymentStatus || "pending",
      date: booking.createdAt,
    };
  }

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

    const [pujaBookings, sevaBookings, storeOrders] =
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

        client
          .db("navodayapuja")
          .collection("store_orders")
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

    const formattedStore = storeOrders.map(
      (order) => formatBooking(order, "store")
    );

    const allBookings = [
      ...formattedPujas,
      ...formattedSevas,
      ...formattedStore,
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
          store: formattedStore.length,
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
