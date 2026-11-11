import React from "react";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import clientPromise from "@/lib/mongodb";
import { resend } from "@/lib/resend";
import StoreOrderEmail from "@/emails/StoreOrderEmail";

export const dynamic = "force-dynamic";

const DATABASE_NAME = "navodayapuja";
const COLLECTION_NAME = "store_orders";

export async function POST(req) {
  try {
    const body = await req.json();

    const { customer, shippingAddress, items, pricing, paymentMethod, notes } =
      body;

    if (!customer?.fullName || !customer?.phone || !shippingAddress?.address) {
      return NextResponse.json(
        { message: "Missing required customer or shipping details" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Cart items cannot be empty" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);

    const orderId = `PD-STORE-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    const newOrder = {
      orderId,
      customer: {
        fullName: String(customer.fullName).trim(),
        phone: String(customer.phone).trim(),
        email: customer.email ? String(customer.email).trim() : "",
      },
      shippingAddress: {
        address: String(shippingAddress.address).trim(),
        landmark: shippingAddress.landmark
          ? String(shippingAddress.landmark).trim()
          : "",
        city: String(shippingAddress.city || "Mumbai").trim(),
        pincode: String(shippingAddress.pincode).trim(),
      },
      items,
      pricing: {
        subtotal: Number(pricing?.subtotal) || 0,
        deliveryFee: Number(pricing?.deliveryFee) || 0,
        total: Number(pricing?.total) || 0,
      },
      paymentMethod: paymentMethod || "cod",
      paymentStatus: "Pending",
      status: "Placed", // Placed, Packed, Dispatched, Delivered, Cancelled
      notes: notes ? String(notes).trim() : "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(newOrder);

    // Send confirmation emails asynchronously via Resend
    try {
      const senderEmail =
        process.env.EMAIL_FROM?.trim() || "Puja Dham <noreply@pujadham.co.in>";
      const adminEmail = process.env.ADMIN_EMAIL?.trim();

      const emailHtml = await render(
        React.createElement(StoreOrderEmail, {
          orderId: newOrder.orderId,
          customerName: newOrder.customer.fullName,
          phone: newOrder.customer.phone,
          shippingAddress: newOrder.shippingAddress,
          items: newOrder.items,
          pricing: newOrder.pricing,
          paymentMethod: newOrder.paymentMethod,
        })
      );

      // Email to Customer (if email provided)
      if (newOrder.customer.email && newOrder.customer.email.includes("@")) {
        await resend.emails.send({
          from: senderEmail,
          to: newOrder.customer.email,
          subject: `🛕 Order Confirmed - ${newOrder.orderId} | Puja Dham`,
          html: emailHtml,
        });
      }

      // Email to Admin
      if (adminEmail && adminEmail.includes("@")) {
        await resend.emails.send({
          from: senderEmail,
          to: adminEmail,
          subject: `📦 New Store Order (${newOrder.orderId}) - ₹${newOrder.pricing.total}`,
          html: emailHtml,
        });
      }
    } catch (emailErr) {
      console.error("Store Order Email Error (non-blocking):", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        order: {
          ...newOrder,
          _id: result.insertedId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Store Order Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to place store order",
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");
    const email = searchParams.get("email");

    if (!email && !phone) {
      return NextResponse.json({ success: true, orders: [] }, { status: 200 });
    }

    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);

    let query = {};
    if (email && phone) {
      query = {
        $or: [
          { "customer.email": { $regex: new RegExp(`^${email.trim()}$`, "i") } },
          { "customer.phone": phone.trim() },
        ],
      };
    } else if (email) {
      query = {
        "customer.email": { $regex: new RegExp(`^${email.trim()}$`, "i") },
      };
    } else if (phone) {
      query = { "customer.phone": phone.trim() };
    }

    const orders = await db
      .collection(COLLECTION_NAME)
      .find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    console.error("Fetch Store Orders Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
