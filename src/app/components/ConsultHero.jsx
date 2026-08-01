"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Star,
} from "lucide-react";

const displayFont = {
  className: "font-display-en",
};

const hindiDisplayFont = {
  className: "font-display-hi",
};

import { useLanguage } from "../context/LanguageContext";



export default function ConsultHero() {
  const router = useRouter();

  const {
    language,
    t,
  } = useLanguage();

  const headingFontClass =
    language === "hi"
      ? hindiDisplayFont.className
      : displayFont.className;

  const headingLineHeight =
    language === "hi"
      ? "leading-[1.18] sm:leading-[1.14] md:leading-[1.1]"
      : "leading-[0.92]";

  return (
    <section className="relative overflow-hidden bg-[#fffdfb] px-5 py-20 md:py-28">
      {/* SOFT BACKGROUND */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-[#fff1e8] blur-[120px]" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 md:grid-cols-2 md:gap-20">
        {/* LEFT CONTENT */}
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#b97b66]" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a85c43]">
              {t("consultHero.eyebrow")}
            </p>
          </div>

          <h2
            className={`${headingFontClass} ${headingLineHeight} mt-6 text-[48px] font-semibold tracking-[-0.025em] text-[#2c2421] sm:text-[58px] md:text-[68px]`}
          >
            {t("consultHero.headingLine1")}

            <span className="block text-[#9a3f27]">
              {t("consultHero.headingLine2")}
            </span>
          </h2>

          <p className="mt-7 max-w-lg text-[14px] leading-7 text-[#756b66] md:text-[15px]">
            {t("consultHero.description")}
          </p>

          {/* DETAILS */}
          <div className="mt-8 grid grid-cols-3 border-y border-[#e8dfda] py-6">
            <div>
              <p
                className={`${headingFontClass} text-[28px] font-semibold text-[#342925]`}
              >
                30+
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#998a82]">
                {t("consultHero.years")}
              </p>
            </div>

            <div className="border-x border-[#e8dfda] px-5">
              <p
                className={`${headingFontClass} text-[28px] font-semibold text-[#342925]`}
              >
                20K+
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#998a82]">
                {t("consultHero.pujas")}
              </p>
            </div>

            <div className="pl-5">
              <p
                className={`${headingFontClass} text-[28px] font-semibold text-[#342925]`}
              >
                4.9
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#998a82]">
                {t("consultHero.rating")}
              </p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                router.push("/contact")
              }
              className="
                group inline-flex items-center justify-center gap-4
                bg-[#9a3f27] px-5 py-2.5
                text-[12px] font-semibold text-white
                shadow-[0_8px_20px_rgba(80,31,18,0.20)]
                transition-all duration-300
                hover:-translate-y-0.5 hover:bg-[#87351f]
              "
            >
              {t("consultHero.bookConsultation")}

              <ArrowRight
                size={15}
                strokeWidth={1.6}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/pujas")
              }
              className="
                group inline-flex items-center justify-center gap-4
                border border-[#d8c9c0] bg-transparent
                px-5 py-2.5 text-[12px] font-semibold text-[#4c3d36]
                transition-all duration-300
                hover:-translate-y-0.5 hover:border-[#9a3f27]
                hover:text-[#9a3f27]
              "
            >
              {t("consultHero.explorePujas")}

              <ArrowRight
                size={15}
                strokeWidth={1.6}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative">
          <div className="relative h-[480px] overflow-hidden md:h-[620px]">
            <img
              src="/images/family.jpg"
              alt={t("consultHero.imageAlt")}
              className="h-full w-full object-cover transition-transform duration-[1400ms] hover:scale-[1.03]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </div>

          {/* RATING CARD */}
          <div className="absolute -bottom-6 left-5 right-5 border border-[#eee5df] bg-[#fffdfb]/95 p-5 shadow-[0_18px_50px_rgba(55,32,21,0.16)] backdrop-blur-xl md:-left-12 md:right-auto md:w-[260px]">
            <div className="flex items-center gap-1 text-[#a85c43]">
              {[1, 2, 3, 4, 5].map(
                (item) => (
                  <Star
                    key={item}
                    size={14}
                    fill="currentColor"
                    strokeWidth={1.5}
                  />
                )
              )}
            </div>

            <p
              className={`${headingFontClass} mt-3 text-[24px] font-semibold leading-none text-[#302724]`}
            >
              {t("consultHero.trustedTitle")}
            </p>

            <p className="mt-2 text-[11px] leading-5 text-[#81736c]">
              {t(
                "consultHero.trustedDescription"
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}