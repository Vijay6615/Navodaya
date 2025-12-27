"use client";

import { useState } from "react";

const pujaList = [
  "Griha Pravesh",
  "Satyanarayan Puja",
  "Wedding Ceremony",
  "Navagraha Puja",
  "Ganesh Puja",
  "Lakshmi Puja",
  "Mundan Sanskar",
  "Namkaran Sanskar",
  "Havan / Yagya",
];

const initialTestimonials = [
  {
    initials: "RK",
    name: "Rajesh Kumar",
    puja: "Griha Pravesh",
    rating: 5,
    message:
      "Panditji performed the Griha Pravesh puja for our new home with such devotion and precision.",
  },
  {
    initials: "PS",
    name: "Priya Sharma",
    puja: "Satyanarayan Puja",
    rating: 5,
    message:
      "The Satyanarayan Puja was beautifully conducted and explained.",
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [form, setForm] = useState({
    name: "",
    puja: "",
    rating: 5,
    message: "",
  });

  const submitReview = (e) => {
    e.preventDefault();
    if (!form.name || !form.puja || !form.message) return;

    const initials = form.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    setTestimonials([
      ...testimonials,
      { ...form, initials },
    ]);

    setForm({ name: "", puja: "", rating: 5, message: "" });
  };

  const deleteReview = (index) => {
    const updated = testimonials.filter((_, i) => i !== index);
    setTestimonials(updated);
  };

  return (
    <section className="testimonials">
      <h2>What Our Clients Say</h2>

      {/* TESTIMONIAL GRID */}
      <div className="testimonial-grid">
        {testimonials.map((t, i) => (
          <div className="testimonial-card" key={i}>
            <div className="testimonial-top">
              <div className="avatar">{t.initials}</div>
              <div>
                <h4>{t.name}</h4>
                <span>{t.puja}</span>
              </div>
            </div>

            <div className="stars">{"★".repeat(t.rating)}</div>

            <p>“{t.message}”</p>

            {/* DELETE BUTTON */}
            {i >= initialTestimonials.length && (
              <button
                className="delete-btn"
                onClick={() => deleteReview(i)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ADD COMMENT */}
      <div className="add-review">
        <h3>Add Your Comment</h3>

        <form onSubmit={submitReview}>
          <input
            placeholder="Your Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <select
            value={form.puja}
            onChange={(e) =>
              setForm({ ...form, puja: e.target.value })
            }
          >
            <option value="">Select Puja</option>
            {pujaList.map((puja, i) => (
              <option key={i} value={puja}>
                {puja}
              </option>
            ))}
          </select>

          <select
            value={form.rating}
            onChange={(e) =>
              setForm({ ...form, rating: Number(e.target.value) })
            }
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Stars
              </option>
            ))}
          </select>

          <textarea
            placeholder="Write your experience..."
            rows="4"
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
          />

          <button type="submit">Submit Review</button>
        </form>
      </div>
    </section>
  );
}
