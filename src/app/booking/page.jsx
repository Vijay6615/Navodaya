"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import emailjs from "@emailjs/browser";

export const dynamic = "force-dynamic";

function BookingForm() {
  const searchParams = useSearchParams();
  const selectedPuja = searchParams.get("puja") || "";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    address: "",
    puja: selectedPuja,
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        "service_lsuicww",
        "template_3zsnbxq",
        form,
        "gGm69Djy_97dOYF1O"
      )
      .then(() => {
        emailjs.send(
          "service_lsuicww",
          "template_autoreply123",
          form,
          "gGm69Djy_97dOYF1O"
        );

        setSent(true);
        setLoading(false);

        setForm({
          name: "",
          phone: "",
          email: "",
          date: "",
          address: "",
          puja: selectedPuja,
          message: "",
        });
      })
      .catch(() => {
        alert("Error sending booking request");
        setLoading(false);
      });
  };

  return (
    <section className="min-h-screen flex justify-center items-center px-5 bg-gradient-to-br from-orange-50 via-rose-50 to-yellow-50 relative">

      {/* subtle glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,140,0,0.25),transparent)]" />

      <div className="max-w-xl w-full relative bg-white/80 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl p-7">

        {/* header */}
        <div className="text-center mb-3">
          <span className="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700 font-semibold">
            Step 1 • Booking Details
          </span>

          <h1 className="text-3xl font-extrabold mt-2 text-gray-800">
            Book Your Puja 🙏
          </h1>

          <p className="text-gray-600">
            Fill your details — Panditji will contact you shortly
          </p>
        </div>

        {/* selected puja badge */}
        {selectedPuja && (
          <div className="mb-3 text-center">
            <p className="inline-block px-3 py-1 rounded-full bg-orange-600 text-white text-sm font-medium shadow">
              Selected Puja: {selectedPuja}
            </p>
          </div>
        )}

        {/* success alert */}
        {sent && (
          <div className="mb-4 text-center py-2 rounded-xl bg-green-100 text-green-700 font-semibold border border-green-300">
            ✔️ Booking request sent successfully
          </div>
        )}

        <form onSubmit={sendEmail} className="space-y-3">

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-400 outline-none"
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-400 outline-none"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-400 outline-none"
            required
          />

          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-400 outline-none"
            required
          />

          <input
            name="address"
            placeholder="Complete Address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-400 outline-none"
            required
          />

          <input
            name="puja"
            value={form.puja}
            readOnly
            className="w-full px-4 py-3 rounded-xl border bg-gray-100"
          />

          <textarea
            name="message"
            rows="3"
            placeholder="Any special instructions?"
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-400 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full py-3 rounded-full text-white font-bold tracking-wide shadow-lg transition 
              ${loading ? "bg-gray-400" : "bg-orange-600 hover:bg-orange-700"}
            `}
          >
            {loading ? "Sending..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading…</p>}>
      <BookingForm />
    </Suspense>
  );
}
