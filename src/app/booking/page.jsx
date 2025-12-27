// src/app/booking/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const pujas = [
  "Ganesh Puja",
  "Satyanarayan Puja",
  "Griha Pravesh",
  "Wedding Ceremony",
];

export default function BookingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    puja: "",
    date: "",
    time: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    requirements: "",
    language: "English",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    router.push("/booking/confirmation");
  };

  return (
    <section className="page-section">
      <h1 className="page-title">Book Your Puja</h1>

      <form className="form-card booking-form" onSubmit={submit}>
        {/* Select Puja */}
        <div className="form-group">
          <label>Select Puja</label>
          <select
            name="puja"
            value={form.puja}
            onChange={handleChange}
            required
          >
            <option value="">Select a puja</option>
            {pujas.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="form-group">
          <label>Select Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Time slots */}
        <div className="form-group">
          <label>Select Time Slot</label>
          <div className="time-slots">
            {["6–8 AM", "8–10 AM", "4–6 PM", "6–8 PM"].map((t) => (
              <button
                key={t}
                type="button"
                className={
                  form.time === t ? "time-slot time-slot-active" : "time-slot"
                }
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    time: t,
                  }))
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Name / Phone / Email */}
        <div className="two-col">
          <div className="form-group">
            <label>Your Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email (optional)</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="you@example.com"
          />
        </div>

        {/* Address */}
        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            rows={3}
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Requirements & Language */}
        <div className="form-group">
          <label>Special Requirements (optional)</label>
          <textarea
            name="requirements"
            rows={3}
            value={form.requirements}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Language Preference</label>
          <select
            name="language"
            value={form.language}
            onChange={handleChange}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Tamil</option>
          </select>
        </div>

        <button className="btn-primary" type="submit">
          Confirm Booking
        </button>
      </form>
    </section>
  );
}
