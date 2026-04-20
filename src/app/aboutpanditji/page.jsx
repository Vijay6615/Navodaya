"use client";

import { useEffect, useState } from "react";
import {
  User,
  BadgeCheck,
  Star,
  BookOpen,
  Sparkles,
} from "lucide-react";

export default function AboutPanditjiPage() {

  // 🔁 IMAGE SLIDESHOW
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

  return (
    <section className="w-full min-h-screen py-12 px-4 bg-gradient-to-br from-orange-100 via-rose-50 to-yellow-100">

      {/* TITLE */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Meet Panditji
        </h1>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          Traditional rituals performed with devotion and authenticity 🙏
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* 🖼 IMAGE CARD (GLASS UI) */}
        <div className="max-w-sm mx-auto w-full backdrop-blur-xl bg-white/40 border border-white/30 rounded-3xl shadow-xl overflow-hidden">

          <div className="h-[350px] w-full">
            <img
              src={photos[index]}
              alt="Panditji"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4 text-center">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-center gap-2">
              <User size={18} /> PT. Jayprakash Shukla
            </h2>
          </div>
        </div>

        {/* 🧾 DETAILS */}
        <div className="space-y-6 text-center md:text-left backdrop-blur-xl bg-white/50 p-6 rounded-3xl border border-white/30 shadow-lg">

          <h2 className="text-2xl font-bold text-gray-800">
            PT. Jayprakash Shukla
          </h2>

          <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
            <BadgeCheck size={18} className="text-green-600" />
            Certified Vedic Scholar & Priest
          </p>

          {/* TAGS */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm flex items-center gap-1">
              <BookOpen size={14} /> Knowledge
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm flex items-center gap-1">
              <Sparkles size={14} /> Vedic Certified
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm flex items-center gap-1">
              <Star size={14} /> Trusted
            </span>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 text-center gap-4">
            <div>
              <p className="text-2xl font-bold text-orange-600">25+</p>
              <p className="text-gray-600 text-sm">Years</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">15000+</p>
              <p className="text-gray-600 text-sm">Pujas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">4.9★</p>
              <p className="text-gray-600 text-sm">Rating</p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-700">
            With over 20 years of experience in performing sacred Vedic rituals,
            Panditji ensures every puja is done with proper vidhi and devotion.
            Bringing peace, prosperity and positivity into your life.
          </p>

          {/* SPECIALIZATION */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Specializations</h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {[
                "Vedic Rituals",
                "Havan",
                "Vastu Puja",
                "Navagraha Shanti",
                "Mahamrityunjay Jaap",
              ].map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}