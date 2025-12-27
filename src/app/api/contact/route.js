import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function POST(req) {
  try {
    // 🔗 Database connect
    await connectDB();

    // 📩 Frontend se data lena
    const data = await req.json();

    // 📝 MongoDB me save karna
    await Contact.create(data);

    // ✅ Success response
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (error) {
    console.error(error);

    // ❌ Error response
    return new Response(
      JSON.stringify({ success: false, message: "Server Error" }),
      { status: 500 }
    );
  }
}
