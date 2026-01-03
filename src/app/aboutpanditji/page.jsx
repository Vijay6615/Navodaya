"use client";

import { useEffect, useState } from "react";

export default function AboutPanditjiPage() {
  /* 🔁 IMAGE SLIDESHOW */
  const photos = [
    
    "/images/panditji.jpg",
    "/images/ganesh.jpg",
    "/panditji.jpg",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  /* 👆 fade-up animation on scroll */
  useEffect(() => {
    const items = document.querySelectorAll(".fade-up");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.2 }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full min-h-screen py-12 bg-gradient-to-br from-orange-50 to-rose-50">

      {/* Title */}
      <div className="text-center mb-10 fade-up">
        {/* <p className="text-orange-600 font-semibold">About Our Guruji</p> */}
        <h1 className="text-4xl font-bold text-gray-800">
          Meet Panditji
        </h1>
        <p className="text-gray-600 mt-2">
          Traditional rituals performed with devotion, authenticity and precision.
        </p>
      </div>

      {/* 🔥 MAIN 2 SECTION LAYOUT */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* 🖼 IMAGE SECTION — FIXED SIZE */}
        <div className="relative w-full h-[420px] rounded-3xl overflow-hidden shadow-xl">

          <img
            key={index}
            src={photos[index]}
            alt="Panditji"
            className="
              w-full h-full
              object-cover
              transition-all duration-700 ease-out
              animate-fade-zoom
            "
          />

          {/* soft glow border */}
          <div className="absolute inset-0 rounded-3xl ring-2 ring-orange-400/40"></div>
        </div>

        {/* 🧾 TEXT SECTION */}
        <div className="space-y-5 px-3">

          <h2 className="text-2xl font-bold text-gray-800 fade-up">
            PT. Jayprakash Shukla
          </h2>

          <p className="text-gray-600 fade-up">
            Certified Vedic Scholar & Priest
          </p>

          <div className="flex flex-wrap gap-2 fade-up">
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
              📜 Deep Knowledge
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
              🛕 Vedic Certified
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
              ✔️ Trusted Priest
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 text-center fade-up">
            <div>
              <p className="text-3xl font-bold text-orange-600">25+</p>
              <p className="text-gray-600 text-sm">Years Experience</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-600">15000+</p>
              <p className="text-gray-600 text-sm">Pujas Performed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-600">4.9★</p>
              <p className="text-gray-600 text-sm">Client Rating</p>
            </div>
          </div>

          <p className="text-gray-700 fade-up">
            With over 20 years of dedicated service in performing sacred Vedic rituals,
            Panditji brings blessings, peace and prosperity to your home.
          </p>

          <h3 className="font-bold text-xl fade-up">Specializations</h3>
          <div className="flex flex-wrap gap-2 fade-up">
            {[
              "Vedic Rituals",
              "Havan",
              "Vastu Puja",
              "Navagraha Shanti",
              "Mahamrityunjay Jaap",
            ].map((t) => (
              <span key={t} className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
