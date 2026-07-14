"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Quote,
  Sparkles,
  Star,
} from "lucide-react";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const specializations = [
  "Vedic Rituals",
  "Havan",
  "Vastu Puja",
  "Navagraha Shanti",
  "Mahamrityunjay Jaap",
];

export default function AboutPanditjiPage() {
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageReady(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#28221f]">
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-[#fff5ef] blur-[100px]" />
          <div className="absolute -right-40 top-72 h-[440px] w-[440px] rounded-full bg-[#faf3ee] blur-[110px]" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-5 py-10 sm:px-8 md:py-16 lg:px-10 lg:py-20">
          <div
            className={`mb-12 text-center transition-all duration-1000 ease-out ${
              pageReady
                ? "translate-y-0 opacity-100"
                : "-translate-y-5 opacity-0"
            }`}
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.32em] text-[#a8441b] sm:text-[13px]">
              Mantra · Vidhi · Aastha
            </p>
            <div className="mx-auto mt-4 h-px w-12 bg-[#a8441b]/40" />
          </div>

          <div
            className={`mb-10 max-w-3xl transition-all delay-100 duration-1000 ease-out md:mb-14 ${
              pageReady
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            

            <h1
              className={`${displayFont.className} mt-5 text-[48px] font-semibold leading-[0.92] tracking-[-0.035em] sm:text-6xl lg:text-[78px]`}
            >
              Faith in every mantra.
            </h1>
          </div>

          <div className="grid items-stretch gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
            <div
              className={`group relative min-h-[500px] overflow-hidden bg-[#f5f0ec] transition-all delay-200 duration-1000 ease-out sm:min-h-[620px] ${
                pageReady
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-14 opacity-0"
              }`}
            >
              <img
                src="/images/panditji.jpg"
                alt="Pt. Jayprakash Shukla"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                  Vedic Scholar & Priest
                </p>

                <h2
                  className={`${displayFont.className} mt-2 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl`}
                >
                  Pt. Jayprakash Shukla
                </h2>
              </div>
            </div>

            <div
              className={`flex flex-col justify-center border border-[#eee8e2] bg-[#fffdfb] p-6 transition-all delay-300 duration-1000 ease-out sm:p-9 lg:p-12 ${
                pageReady
                  ? "translate-x-0 opacity-100"
                  : "translate-x-14 opacity-0"
              }`}
            >
              <div className="flex items-center gap-2 text-[#a8441b]">
                <BadgeCheck size={18} strokeWidth={1.7} />
                <span className="text-[11px] font-bold uppercase tracking-[0.16em]">
                  Certified Vedic Scholar & Priest
                </span>
              </div>

              <h2
                className={`${displayFont.className} mt-6 text-4xl font-semibold tracking-[-0.025em] sm:text-5xl`}
              >
                Pt. Jayprakash Shukla
              </h2>

              <div className="mt-6 flex flex-wrap gap-2">
                <TrustTag icon={<BookOpen size={14} />} label="Knowledge" />
                <TrustTag
                  icon={<Sparkles size={14} />}
                  label="Vedic Certified"
                />
                <TrustTag icon={<Star size={14} />} label="Trusted" />
              </div>

              <div className="mt-9 grid grid-cols-3 border-y border-[#e9e1dc]">
                <Stat value="30+" label="Years" />
                <Stat value="15K+" label="Pujas" border />
                <Stat value="4.9" label="Rating" />
              </div>

              <div className="relative mt-9">
                <Quote
                  size={30}
                  strokeWidth={1.2}
                  className="absolute -left-1 -top-2 text-[#eadbd2]"
                />

                <p className="relative pl-8 text-[14px] leading-7 text-[#625750] sm:text-[15px]">
                  With over 30 years of experience in sacred Vedic rituals,
                  Panditji performs every puja with proper vidhi and devotion —
                  bringing peace, prosperity and positivity into every
                  devotee&apos;s life.
                </p>
              </div>

              <div className="mt-9">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8d85]">
                  Specializations
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {specializations.map((item) => (
                    <span
                      key={item}
                      className="border border-[#e8ddd6] bg-white px-4 py-2 text-[12px] font-medium text-[#514640] transition duration-300 hover:-translate-y-0.5 hover:border-[#a8441b] hover:text-[#a8441b]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href="/pujas"
                  className="group inline-flex h-12 items-center justify-center gap-3 bg-[#a8441b] px-7 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-[#873514] hover:shadow-[0_14px_30px_rgba(168,68,27,0.22)]"
                >
                  Explore Pujas
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#eee8e2] bg-[#fffdfb]">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-10 lg:py-24">
          <div
            className={`transition-all delay-500 duration-1000 ease-out ${
              pageReady
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a8441b]">
              Sacred Philosophy
            </p>

            <h2
              className={`${displayFont.className} mt-5 text-4xl font-semibold leading-[0.98] tracking-[-0.025em] sm:text-5xl`}
            >
              Every mantra.
              <br />
              Every ritual.
              <br />
              With purpose.
            </h2>
          </div>

          <div
            className={`max-w-2xl transition-all delay-700 duration-1000 ease-out lg:pt-8 ${
              pageReady
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <p className="text-[16px] leading-8 text-[#6f635c] sm:text-[18px]">
              Vedic rituals are a sacred connection between mantra, intention
              and faith. Every sankalp and offering is performed with care,
              preserving the original Vedic process while helping every family
              experience the meaning, peace and devotion behind their puja.
            </p>

            <div className="mt-10 h-px w-full bg-[#e8dfda]" />

            <div className="mt-7 flex items-center gap-4">
              <span className="h-px w-8 bg-[#a8441b]/50" />
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#a8441b]">
                Mantra · Sankalp · Samarpan
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function TrustTag({ icon, label }) {
  return (
    <span className="flex items-center gap-2 border border-[#e8ddd6] bg-white px-3 py-2 text-[11px] font-semibold text-[#5f534c] transition duration-300 hover:border-[#a8441b]/50">
      <span className="text-[#a8441b]">{icon}</span>
      {label}
    </span>
  );
}

function Stat({ value, label, border = false }) {
  return (
    <div
      className={`py-6 text-center ${
        border ? "border-x border-[#e9e1dc]" : ""
      }`}
    >
      <p
        className={`${displayFont.className} text-3xl font-bold tracking-[-0.02em] text-[#a8441b] sm:text-4xl`}
      >
        {value}
      </p>

      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#93867e]">
        {label}
      </p>
    </div>
  );
}
