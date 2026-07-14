"use client";

import { useEffect, useState } from "react";
import { Playfair_Display } from "next/font/google";
import { ChevronLeft, ChevronRight, CalendarCheck, Compass } from "lucide-react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
});

const TOTAL_SLIDES = 4;
const AUTOPLAY_MS = 12000;

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TOTAL_SLIDES);
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, []);

  const goTo = (i) => setIndex((i + TOTAL_SLIDES) % TOTAL_SLIDES);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  return (
    <>
    <section
      className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#fff8f1]"
    >
      {/* =====================================================
          BACKGROUND WALLPAPERS
          Har image ka apna alag block hai — jis image/opacity
          condition ko chhuye baaki sab wahi structure repeat hai,
          taaki har slide independently edit ho sake.
      ====================================================== */}

      {/* SLIDE 1 — Narayan Puja */}
      <div
        className={`
          absolute inset-0 bg-cover bg-center
          transition-opacity duration-[1800ms] ease-in-out
          ${index === 0 ? "opacity-100" : "opacity-0"}
        `}
        style={{
          backgroundImage: "url(/images/jivdanimata.png)",
          animation: index === 0 ? "heroZoom 7s ease-in-out forwards" : "none",
        }}
      />

      {/* SLIDE 2 — Homam & Yagna */}
      
      <div
        className={`
          absolute inset-0 bg-cover bg-center
          transition-opacity duration-[1800ms] ease-in-out
          ${index === 1 ? "opacity-100" : "opacity-0"}
        `}
        style={{
          backgroundImage: "url(/images/heropuja.png)",
          animation: index === 1 ? "heroZoom 7s ease-in-out forwards" : "none",
        }}
      />

      {/* SLIDE 3 — Akhand Ramayan Path */}
      <div
        className={`
          absolute inset-0 bg-cover bg-center
          transition-opacity duration-[1800ms] ease-in-out
          ${index === 2 ? "opacity-100" : "opacity-0"}
        `}
        style={{
          backgroundImage: "url(/images/gouseva.png)",
          animation: index === 2 ? "heroZoom 7s ease-in-out forwards" : "none",
        }}
      />

      {/* SLIDE 4 — Satyanarayan Puja */}
      <div
        className={`
          absolute inset-0 bg-cover bg-center
          transition-opacity duration-[1800ms] ease-in-out
          ${index === 3 ? "opacity-100" : "opacity-0"}
        `}
        style={{
          backgroundImage: "url(/images/naamjaap.png)",
          animation: index === 3 ? "heroZoom 7s ease-in-out forwards" : "none",
        }}
      />

      {/* Very light readability layer — images stay clear and colourful */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />

      {/* Soft warm glow accents */}
      <div className="pointer-events-none absolute -top-24 -left-16 w-[420px] h-[420px] rounded-full bg-[#ffb35c]/10 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-10 w-[460px] h-[460px] rounded-full bg-[#ff8a5c]/10 blur-[120px]" />

      {/* =====================================================
          ARROW NAVIGATION
      ====================================================== */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous puja"
        className="
          hidden md:flex
          absolute left-7 lg:left-10 top-1/2 -translate-y-1/2 z-30
          w-14 h-14 rounded-full items-center justify-center
          bg-[#fffdfb]/90 backdrop-blur-xl border border-white/70
          text-[#7c2d12] shadow-[0_14px_40px_rgba(43,20,9,0.18)]
          transition-all duration-500
          hover:bg-white hover:-translate-x-1 hover:scale-105
          hover:shadow-[0_18px_48px_rgba(43,20,9,0.24)]
          active:scale-95
        "
      >
        <ChevronLeft size={22} strokeWidth={2} />
      </button>

      <button
        type="button"
        onClick={next}
        aria-label="Next puja"
        className="
          hidden md:flex
          absolute right-7 lg:right-10 top-1/2 -translate-y-1/2 z-30
          w-14 h-14 rounded-full items-center justify-center
          bg-[#fffdfb]/90 backdrop-blur-xl border border-white/70
          text-[#7c2d12] shadow-[0_14px_40px_rgba(43,20,9,0.18)]
          transition-all duration-500
          hover:bg-white hover:translate-x-1 hover:scale-105
          hover:shadow-[0_18px_48px_rgba(43,20,9,0.24)]
          active:scale-95
        "
      >
        <ChevronRight size={22} strokeWidth={2} />
      </button>

      {/* =====================================================
          CONTENT
          Har slide ka apna poora, alag likha hua block —
          apna eyebrow, apna headline, apna sub-text, apna link.
          Sirf active wala mount hota hai, isliye mount hote hi
          fade-up animation khud replay ho jaata hai.
      ====================================================== */}
      <div className="relative z-20 max-w-3xl text-center px-6 sm:px-10">

        {/* ---------- SLIDE 1 CONTENT — Narayan Puja ---------- */}
        {index === 0 && (
          <div className="flex flex-col items-center">
            

            <span className="mt-3 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#e8973a] to-transparent [animation:heroDraw_0.9s_ease-out_0.15s_forwards]" />

            <h1
              className={`
                ${playfair.className}
                mt-5 text-white text-[2.1rem] leading-[1.15]
                sm:text-5xl sm:leading-[1.15]
                md:text-6xl md:leading-[1.12]
                font-bold whitespace-pre-line
                opacity-0 [animation:heroFadeUp_0.8s_ease-out_0.15s_forwards]
                [text-shadow:0_2px_20px_rgba(0,0,0,0.35)]
              `}
            >
              {"Invite Divine Grace\nInto Your Home"}
            </h1>

            

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 opacity-0 [animation:heroFadeUp_0.8s_ease-out_0.45s_forwards]">
              <a
                href="/pujas"
                className="
                  group relative overflow-hidden inline-flex items-center justify-center gap-3
                  px-4 py-2.5 text-white text-[12px] sm:text-[13px] font-semibold
                  bg-[#9a3f27] border border-[#8a351f]
                  shadow-[0_8px_20px_rgba(80,31,18,0.22)]
                  transition-all duration-300
                  hover:-translate-y-0.5 hover:bg-[#87351f]
                  hover:shadow-[0_12px_26px_rgba(80,31,18,0.28)]
                  active:scale-[0.97]
                "
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
                <Compass size={16} strokeWidth={2.2} />
                Explore Pujas
              </a>

              <a
                href="/contact"
                className="
                  inline-flex items-center justify-center gap-3 px-4 py-2.5
                  text-black text-[12px] sm:text-[13px] font-semibold
                  bg-[#f7f5f5] border border-[#8a351f]
                  shadow-[0_8px_20px_rgba(80,31,18,0.22)]
                  transition-all duration-300
                  hover:-translate-y-0.5 hover:bg-[#87351f]
                  hover:shadow-[0_12px_26px_rgba(80,31,18,0.28)]
                  active:scale-[0.97]
                "
              >
                <CalendarCheck size={16} strokeWidth={2.2} />
                Book a Puja
              </a>
            </div>

          </div>
        )}

        {/* ---------- SLIDE 2 CONTENT — Homam & Yagna ---------- */}
        {index === 1 && (
          <div className="flex flex-col items-center">
            

            <span className="mt-3 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#e8973a] to-transparent [animation:heroDraw_0.9s_ease-out_0.15s_forwards]" />

            <h1
              className={`
                ${playfair.className}
                mt-5 text-white text-[2.1rem] leading-[1.15]
                sm:text-5xl sm:leading-[1.15]
                md:text-6xl md:leading-[1.12]
                font-bold whitespace-pre-line
                opacity-0 [animation:heroFadeUp_0.8s_ease-out_0.15s_forwards]
                [text-shadow:0_2px_20px_rgba(0,0,0,0.35)]
              `}
            >
              {"Sankalp · Vidhi · Siddhi"}
            </h1>

            

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 opacity-0 [animation:heroFadeUp_0.8s_ease-out_0.45s_forwards]">
              <a
                href="/pujas"
                className="
                  group relative overflow-hidden inline-flex items-center justify-center gap-3
                  px-4 py-2.5 text-white text-[12px] sm:text-[13px] font-semibold
                  bg-[#9a3f27] border border-[#8a351f]
                  shadow-[0_8px_20px_rgba(80,31,18,0.22)]
                  transition-all duration-300
                  hover:-translate-y-0.5 hover:bg-[#87351f]
                  hover:shadow-[0_12px_26px_rgba(80,31,18,0.28)]
                  active:scale-[0.97]
                "
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
                <Compass size={16} strokeWidth={2.2} />
                Explore Pujas
              </a>

              
            </div>
          </div>
        )}

        {/* ---------- SLIDE 3 CONTENT — Akhand Ramayan Path ---------- */}
        {index === 2 && (
          <div className="flex flex-col items-center">
            

            <span className="mt-3 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#e8973a] to-transparent [animation:heroDraw_0.9s_ease-out_0.15s_forwards]" />

            <h1
              className={`
                ${playfair.className}
                mt-5 text-white text-[2.1rem] leading-[1.15]
                sm:text-5xl sm:leading-[1.15]
                md:text-6xl md:leading-[1.12]
                font-bold whitespace-pre-line
                opacity-0 [animation:heroFadeUp_0.8s_ease-out_0.15s_forwards]
                [text-shadow:0_2px_20px_rgba(0,0,0,0.35)]
              `}
            >
              {"Prem · Seva · Punya"}
            </h1>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 opacity-0 [animation:heroFadeUp_0.8s_ease-out_0.45s_forwards]">
              <a
                href="/gau-seva"
                className="
                  group relative overflow-hidden inline-flex items-center justify-center gap-3
                  px-4 py-2.5 text-white text-[12px] sm:text-[13px] font-semibold
                  bg-[#9a3f27] border border-[#8a351f]
                  shadow-[0_8px_20px_rgba(80,31,18,0.22)]
                  transition-all duration-300
                  hover:-translate-y-0.5 hover:bg-[#87351f]
                  hover:shadow-[0_12px_26px_rgba(80,31,18,0.28)]
                  active:scale-[0.97]
                "
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
                <Compass size={16} strokeWidth={2.2} />
                Explore Gau Seva
              </a>

              
            </div>
          </div>
        )}

        {/* ---------- SLIDE 4 CONTENT — Satyanarayan Puja ---------- */}
        {index === 3 && (
          <div className="flex flex-col items-center">
            

            <span className="mt-3 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#e8973a] to-transparent [animation:heroDraw_0.9s_ease-out_0.15s_forwards]" />

            <h1
              className={`
                ${playfair.className}
                mt-5 text-white text-[2.1rem] leading-[1.15]
                sm:text-5xl sm:leading-[1.15]
                md:text-6xl md:leading-[1.12]
                font-bold whitespace-pre-line
                opacity-0 [animation:heroFadeUp_0.8s_ease-out_0.15s_forwards]
                [text-shadow:0_2px_20px_rgba(0,0,0,0.35)]
              `}
            >
              {"Chant · Connect · Awaken"}
            </h1>

            

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 opacity-0 [animation:heroFadeUp_0.8s_ease-out_0.45s_forwards]">
              <a
                href="/sita-ram-counter"
                className="
                  group relative overflow-hidden inline-flex items-center justify-center gap-3
                  px-4 py-2.5 text-white text-[12px] sm:text-[13px] font-semibold
                  bg-[#9a3f27] border border-[#8a351f]
                  shadow-[0_8px_20px_rgba(80,31,18,0.22)]
                  transition-all duration-300
                  hover:-translate-y-0.5 hover:bg-[#87351f]
                  hover:shadow-[0_12px_26px_rgba(80,31,18,0.28)]
                  active:scale-[0.97]
                "
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
                <Compass size={16} strokeWidth={2.2} />
                Sita Ram Naam Jaap
              </a>

              
            </div>

            
          </div>
        )}
      </div>

      {/* =====================================================
          SLIDE INDICATOR DOTS — 4 alag buttons, ek dusre se
          independent, index state se jude hue
      ====================================================== */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        <button
          type="button"
          aria-label="Jivdanimata Puja"
          onClick={() => goTo(0)}
          className={`rounded-full transition-all duration-300 ${index === 0 ? "w-7 h-2 bg-[#e8973a]" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`}
        />
        <button
          type="button"
          aria-label="Show Homam & Yagna"
          onClick={() => goTo(1)}
          className={`rounded-full transition-all duration-300 ${index === 1 ? "w-7 h-2 bg-[#e8973a]" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`}
        />
        <button
          type="button"
          aria-label="Gau Seva"
          onClick={() => goTo(2)}
          className={`rounded-full transition-all duration-300 ${index === 2 ? "w-7 h-2 bg-[#e8973a]" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`}
        />
        <button
          type="button"
          aria-label="Sita Ram Naam Jaap"
          onClick={() => goTo(3)}
          className={`rounded-full transition-all duration-300 ${index === 3 ? "w-7 h-2 bg-[#e8973a]" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`}
        />
      </div>

      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroDraw {
          from { width: 0; }
          to { width: 72px; }
        }
        @keyframes heroZoom {
          from { transform: scale(1); }
          to { transform: scale(1.045); }
        }
        @keyframes heroMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; }
        }
      `}</style>
    </section>

    {/* COLORFUL MOVING MARQUEE — BELOW HERO */}
    {/* INFINITE SEAMLESS MOVING MARQUEE */}
  <div className="relative z-40 w-full overflow-hidden bg-gradient-to-r from-[#ff7a18] via-[#ffb347] to-[#ff5f6d] py-4">
    <div className="marquee-track flex w-max">
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className="flex shrink-0 items-center"
        >
          {[
            "✦ आपका संकल्प, हमारी सेवा",
            "✦ वैदिक पूजा एवं अनुष्ठान",
            "✦ सुख शांति एवं समृद्धि",
            "✦ सीता राम नाम जप",
            "✦ आपका संकल्प, हमारी सेवा",
            "✦ वैदिक पूजा एवं अनुष्ठान",
            "✦ सुख शांति एवं समृद्धि",
            "✦ सीता राम नाम जप",
          ].map((text, i) => (
            <span
              key={`${copy}-${i}`}
              className={`
                mx-8
                shrink-0
                whitespace-nowrap
                text-sm
                font-bold
                uppercase
                tracking-[0.25em]
                ${
                  i % 2 === 0
                    ? "text-white"
                    : "text-[#7c2d12]"
                }
              `}
            >
              {text}
            </span>
          ))}
        </div>
      ))}
    </div>
    </div>
    </>
  );
}