"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function ContactSection() {

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    puja: "",
    message: "",
  });

  const pujas = [
    "Satyanarayan Puja",
    "Griha Pravesh",
    "Navgrah Shanti",
    "Mahamrityunjay Jaap",
    "Rudrabhishek",
    "Lakshmi Puja",
    "Ganesh Puja",
    "Kaal Sarp Dosh Puja",
    "Navchandi Yagya",
    "Marriage Puja",
    "Vastu Shanti",
    "Naamkaran",
    "Mundan",
    "Pitru Dosh Puja",
    "Bhumi Pujan",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.send(
      "YOUR_SERVICE_ID",
      "YOUR_TEMPLATE_ID",
      form,
      "YOUR_PUBLIC_KEY"
    )
    .then(() => {
      alert("Message sent successfully ✅");
      setForm({
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        email: "",
        phone: "",
        puja: "",
        message: "",
      });
    })
    .catch(() => {
      alert("Failed to send ❌");
    });
  };

  return (
    <div className="contact-wrapper">

      {/* LEFT INFO */}
      <div className="contact-info">
        <h2>Contact Panditji</h2>
        <p>Fill the form to book puja or consultation</p>

        <ul className="contact-list">
          <li>📞 +91 9594943609</li>
          <li>✉️ panditji@puja.com</li>
          <li>📍 Mumbai, Maharashtra</li>
        </ul>
      </div>

      {/* RIGHT FORM */}
      <form className="contact-form" onSubmit={sendEmail}>

        <h3>Puja Booking Form</h3>

        <div className="two-input">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            required
            value={form.firstName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="lastName"
            placeholder="Surname"
            required
            value={form.lastName}
            onChange={handleChange}
          />
        </div>

        <div className="two-input">
          <input
            type="number"
            name="age"
            placeholder="Age"
            required
            value={form.age}
            onChange={handleChange}
          />

          <select
            name="gender"
            required
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          required
          value={form.phone}
          onChange={handleChange}
        />

        <select
          name="puja"
          required
          value={form.puja}
          onChange={handleChange}
        >
          <option value="">Select Puja</option>
          {pujas.map((p, i) => (
            <option key={i}>{p}</option>
          ))}
        </select>

        <textarea
          name="message"
          rows="4"
          placeholder="Message / Puja details"
          required
          value={form.message}
          onChange={handleChange}
        ></textarea>

        <button type="submit">Send Booking Request</button>
      </form>
    </div>
  );
}
