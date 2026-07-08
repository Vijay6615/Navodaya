"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const images = [
    "/images/narayan.jpg",
    "/images/jogiasan.jpg",
    "/images/akhand-ramayan-path.jpg",
    "/images/satyanarayan.jpg",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-visible">

      {/* 🔮 Gradient tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-700/70 via-rose-700/70 to-purple-800/70" />

      {/* 🌄 Smooth fade + zoom slideshow */}
      <div className="absolute inset-0">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`
              absolute inset-0 bg-cover bg-center
              transition-all duration-[1200ms] ease-out
              ${
                index === idx
                  ? "opacity-100 scale-105"
                  : "opacity-0 scale-100"
              }
            `}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>

      {/* 🌫️ Diya smoke */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-32 h-32 rounded-full bg-white/10 blur-3xl animate-[float_12s_infinite]"
          style={{
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 80}%`,
            animationDelay: `${i}s`,
          }}
        />
      ))}

      {/* ✨ Glow orbs */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 bg-amber-300 rounded-full blur-sm opacity-70 animate-[glow_6s_infinite]"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      {/* 💎 Glass card */}
      <div
        className="
          relative z-10 max-w-3xl text-center px-6 py-8
          rounded-3xl bg-white/5 border border-white/20
          shadow-[0_0_25px_rgba(0,0,0,0.25)]
        "
      >
        <span className="px-4 py-1 rounded-full text-sm font-semibold bg-white/20 text-white">
          🕉️ Authentic Vedic Rituals
        </span>

        <h1 className="mt-4 text-white text-4xl md:text-6xl font-extrabold leading-tight">
          Sacred Pujas for Every Occasion
        </h1>

        <p className="mt-3 text-white/90 text-lg">
          Experience authentic Vedic rituals performed with devotion, precision
          and blessings of divine energies.
        </p>

        {/* FIRST ROW — EXISTING BUTTONS */}
        <div className="mt-6 flex gap-3 justify-center flex-wrap">
          <a href="/contact">
            <button className="px-6 py-3 rounded-full font-semibold text-white bg-orange-500 hover:bg-amber-300 shadow-lg shadow-orange-500/40">
              Book a Puja →
            </button>
          </a>

          <a href="/pujas">
            <button className="px-6 py-3 rounded-full font-semibold text-white bg-orange-500 hover:bg-amber-300 shadow-lg shadow-orange-500/40">
              Explore Pujas
            </button>
          </a>
        </div>

        {/* NEW — SITA RAM BUTTON EXACTLY BELOW CENTER */}
        <div className="mt-3 flex justify-center">
          <a
            href="/sita-ram-counter"
            className="
              px-6 py-3
              rounded-full
              font-semibold
              text-white
              bg-orange-500
              hover:bg-amber-300
              shadow-lg
              shadow-orange-500/40
              transition-all
              duration-300
            "
          >
            Sita Ram Naam Jaap
          </a>
        </div>
      </div>

      {/* NEW — IMAGE CHANGING DOTS */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Show image ${idx + 1}`}
            onClick={() => setIndex(idx)}
            className={`
              rounded-full
              transition-all
              duration-300
              ${
                index === idx
                  ? "w-6 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }
            `}
          />
        ))}
      </div>
    </section>
  );
}