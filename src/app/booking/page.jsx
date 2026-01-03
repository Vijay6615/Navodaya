"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import emailjs from "@emailjs/browser";

// disable static prerendering (IMPORTANT FOR VERCEL)
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
    <section className="min-h-screen flex justify-center items-center bg-orange-50 px-5">
      <div className="max-w-xl w-full bg-white shadow-2xl rounded-2xl p-7">
        <h1 className="text-2xl font-bold text-center text-orange-600">
          Puja Booking Form 🙏
        </h1>

        <p className="text-center text-gray-600 mb-4">
          Selected Puja:{" "}
          <strong className="text-orange-700">{selectedPuja}</strong>
        </p>

        {sent && (
          <p className="text-green-600 text-center font-medium mb-3">
            ✅ Booking request sent successfully!
          </p>
        )}

        <form onSubmit={sendEmail}>
          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="input w-full mb-2"
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="input w-full mb-2"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="input w-full mb-2"
            required
          />

          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="input w-full mb-2"
            required
          />

          <input
            name="address"
            placeholder="Complete Address"
            value={form.address}
            onChange={handleChange}
            className="input w-full mb-2"
            required
          />

          <input
            name="puja"
            value={form.puja}
            readOnly
            className="input w-full mb-2 bg-gray-100"
          />

          <textarea
            name="message"
            rows="3"
            placeholder="Any special request?"
            value={form.message}
            onChange={handleChange}
            className="input w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full py-3 rounded-full text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {loading ? "Sending..." : "Confirm Booking 🙏"}
          </button>
        </form>
      </div>
    </section>
  );
}

// Suspense wrapper
export default function BookingPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading…</p>}>
      <BookingForm />
    </Suspense>
  );
}
