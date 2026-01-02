"use client";

import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";

export default function ContactPage() {

  // ------------ FORM STATE ------------
  const [form, setForm] = useState({
    name: "",
    surname: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    puja: "",
    message: "",
  });

  const [showList, setShowList] = useState(false);

  // ------------ TOAST STATE ------------
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "", message: "" });
    }, 4000);
  };

  // handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ------------ SEND EMAIL ------------
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        form,
        "YOUR_PUBLIC_KEY"
      )
      .then(() => {
        showToast("success", "Message sent successfully 🙏");

        setForm({
          name: "",
          surname: "",
          age: "",
          gender: "",
          email: "",
          phone: "",
          puja: "",
          message: "",
        });
      })
      .catch(() => {
        showToast("error", "Something went wrong 😔 Try again");
      });
  };

  // ---------- SCROLL ANIMATION ----------
  useEffect(() => {
    const items = document.querySelectorAll(".fade-up");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("visible")
        ),
      { threshold: 0.2 }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ---------- PUJA OPTIONS ----------
  const pujas = [
    "Ganesh Puja",
    "Satyanarayan Puja",
    "Rudrabhishek",
    "Mahamrityunjay Jaap",
    "Lakshmi Puja",
    "Griha Pravesh Puja",
    "Bhoomi Puja",
    "Vastu Shanti Puja",
    "Navagraha Shanti",
    "Kaal Sarp Dosh Puja",
    "Naamkaran Sanskar",
    "Mundan Sanskar",
    "Pitru Dosh Puja",
    "Shiv Puja / Rudrabhishek",
    "Durga Puja",
    "Vishnu Puja",
    "Rahu–Ketu Shanti Puja",
    "Dhan Prapti Havan",
    "Shanti Havan",
    "Saraswati Puja",
    "SundarKand Path",
    "Hanuman Chalisa Path",
    "Akhand Ramayan Path",
    "Office Opening Puja",
    
  ];

  return (
    <section className="min-h-screen w-full py-12 px-5 bg-gradient-to-br from-orange-50 via-rose-50 to-yellow-50">

      {/* 🌟 TOAST POPUP */}
      {toast.show && (
        <div
          className={`
            fixed top-6 right-6 z-[9999]
            px-5 py-3 rounded-2xl shadow-2xl
            text-white flex items-center gap-3 animate-slide
            ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}
          `}
        >
          <span className="text-xl">
            {toast.type === "success" ? "✅" : "⚠️"}
          </span>

          <p className="font-medium">{toast.message}</p>

          <button
            className="ml-3 text-white text-lg"
            onClick={() => setToast({ show: false })}
          >
            ✖
          </button>
        </div>
      )}

      {/* Title */}
      <div className="text-center mb-10 fade-up">
        <p className="text-orange-600 font-semibold">Contact Panditji</p>

        <h1 className="text-4xl font-extrabold text-gray-800 mt-1">
          Book Puja • Ask a Question • Get Guidance
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
          Fill the form below. We respond quickly 🙏
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* LEFT INFO */}
        <div className="fade-up rounded-3xl p-7 shadow-xl bg-white/80 backdrop-blur-xl border border-white/40">
          <h2 className="text-2xl font-bold text-gray-800 mb-5">
            📞 Contact Information
          </h2>

          <ul className="space-y-2 text-gray-700">
            <li>📍 Mumbai / Varanasi</li>
            <li>📞 +91 95949 43609</li>
            <li>💬 WhatsApp Available</li>
            <li>✉️ panditjipuja@gmail.com</li>
          </ul>

          <a
            href="https://wa.me/919594943609"
            className="inline-block mt-6 px-5 py-2 rounded-full bg-green-500 text-white hover:bg-green-600"
          >
            Chat on WhatsApp
          </a>
        </div>

        {/* RIGHT FORM */}
        <form
          onSubmit={sendEmail}
          className="fade-up rounded-3xl p-7 shadow-xl bg-white/90 backdrop-blur-xl border border-white/40"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            ✍️ Booking / Contact Form
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            <input name="name" placeholder="First Name" required
              value={form.name} onChange={handleChange} className="input" />

            <input name="surname" placeholder="Surname" required
              value={form.surname} onChange={handleChange} className="input" />

            <input name="age" type="number" placeholder="Age" required
              value={form.age} onChange={handleChange} className="input" />

            <select name="gender" required
              value={form.gender} onChange={handleChange} className="input">
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input name="email" type="email" placeholder="Email" required
              value={form.email} onChange={handleChange} className="input" />

            <input name="phone" placeholder="Phone Number" required
              value={form.phone} onChange={handleChange} className="input" />

            {/* 🔍 SEARCHABLE PUJA SELECT */}
            <div className="relative md:col-span-2">

              <input
                type="text"
                placeholder="Search or select Puja"
                value={form.puja}
                onChange={(e) => setForm({ ...form, puja: e.target.value })}
                onFocus={() => setShowList(true)}
                className="input"
              />

              {showList && (
                <div className="absolute w-full max-h-40 overflow-y-auto bg-white rounded-xl shadow-lg border z-50">

                  {pujas
                    .filter((p) =>
                      p.toLowerCase().includes(form.puja.toLowerCase())
                    )
                    .map((p, i) => (
                      <p
                        key={i}
                        className="px-3 py-2 cursor-pointer hover:bg-orange-100"
                        onClick={() => {
                          setForm({ ...form, puja: p });
                          setShowList(false);
                        }}
                      >
                        {p}
                      </p>
                    ))}
                </div>
              )}
            </div>
          </div>

          <textarea
            name="message"
            rows="4"
            placeholder="Describe your requirement"
            required
            value={form.message}
            onChange={handleChange}
            className="input mt-2"
          />

          <button
            type="submit"
            className="mt-4 w-full py-3 rounded-full bg-orange-600 text-white font-semibold hover:bg-orange-700"
          >
            Send Request 🙏
          </button>
        </form>
      </div>
    </section>
  );
}
