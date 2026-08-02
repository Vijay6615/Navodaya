"use client";

import Link from "next/link";
import Image from "next/image";

import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Quote,
  Sparkles,
  Star,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

const displayFont = {
  className: "font-display-en",
};

const hindiDisplayFont = {
  className: "font-display-hi",
};

const SPECIALIZATION_KEYS = [
  "vedicRituals",
  "havan",
  "vastuPuja",
  "navagrahaShanti",
  "mahamrityunjayJaap",
];

export default function AboutPanditjiPage() {
  const { language, t } = useLanguage();

  const headingFontClass =
    language === "hi"
      ? hindiDisplayFont.className
      : displayFont.className;

  const eyebrowClass =
    language === "hi"
      ? "tracking-[0.08em]"
      : "uppercase tracking-[0.32em]";

  const smallLabelClass =
    language === "hi"
      ? "tracking-[0.06em]"
      : "uppercase tracking-[0.16em]";

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#28221f]">
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-[#fff5ef] blur-[100px]" />
          <div className="absolute -right-40 top-72 h-[440px] w-[440px] rounded-full bg-[#faf3ee] blur-[110px]" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-5 py-10 sm:px-8 md:py-16 lg:px-10 lg:py-20">
          <div className="mb-12 text-center">
            <p
              className={`text-[12px] font-semibold text-[#a8441b] sm:text-[13px] ${eyebrowClass}`}
            >
              {t("aboutPandit.mantraLine")}
            </p>

            <div className="mx-auto mt-4 h-px w-12 bg-[#a8441b]/40" />
          </div>

          <div className="mb-10 max-w-3xl md:mb-14">
            <h1
              className={`${headingFontClass} mt-5 text-[48px] font-semibold ${
                language === "hi"
                  ? "leading-[1.18] tracking-normal"
                  : "leading-[0.92] tracking-[-0.035em]"
              } sm:text-6xl lg:text-[78px]`}
            >
              {t("aboutPandit.heroTitle")}
            </h1>
          </div>

          <div className="grid items-stretch gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
            <div className="group relative min-h-[500px] overflow-hidden bg-[#f5f0ec] sm:min-h-[620px]">
              <Image
                src="/images/panditji.jpg"
                alt={t("aboutPandit.imageAlt")}
                fill
                priority
                fetchPriority="high"
                quality={78}
                sizes="(max-width: 1023px) 100vw, 45vw"
                className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <p
                  className={`text-[10px] font-semibold text-white/70 ${
                    language === "hi"
                      ? "tracking-[0.06em]"
                      : "uppercase tracking-[0.2em]"
                  }`}
                >
                  {t("aboutPandit.role")}
                </p>

                <h2
                  className={`${headingFontClass} mt-2 text-3xl font-semibold ${
                    language === "hi"
                      ? "tracking-normal"
                      : "tracking-[-0.02em]"
                  } sm:text-4xl`}
                >
                  {t("aboutPandit.panditName")}
                </h2>
              </div>
            </div>

            <div className="flex flex-col justify-center border border-[#eee8e2] bg-[#fffdfb] p-6 sm:p-9 lg:p-12">
              <div className="flex items-center gap-2 text-[#a8441b]">
                <BadgeCheck
                  size={18}
                  strokeWidth={1.7}
                />

                <span
                  className={`text-[11px] font-bold ${smallLabelClass}`}
                >
                  {t("aboutPandit.certifiedRole")}
                </span>
              </div>

              <h2
                className={`${headingFontClass} mt-6 text-4xl font-semibold ${
                  language === "hi"
                    ? "tracking-normal"
                    : "tracking-[-0.025em]"
                } sm:text-5xl`}
              >
                {t("aboutPandit.panditName")}
              </h2>

              <div className="mt-6 flex flex-wrap gap-2">
                <TrustTag
                  icon={<BookOpen size={14} />}
                  label={t("aboutPandit.trust.knowledge")}
                />

                <TrustTag
                  icon={<Sparkles size={14} />}
                  label={t("aboutPandit.trust.vedicCertified")}
                />

                <TrustTag
                  icon={<Star size={14} />}
                  label={t("aboutPandit.trust.trusted")}
                />
              </div>

              <div className="mt-9 grid grid-cols-3 border-y border-[#e9e1dc]">
                <Stat
                  value="30+"
                  label={t("aboutPandit.stats.years")}
                  fontClass={headingFontClass}
                />

                <Stat
                  value="20K+"
                  label={t("aboutPandit.stats.pujas")}
                  border
                  fontClass={headingFontClass}
                />

                <Stat
                  value="4.9"
                  label={t("aboutPandit.stats.rating")}
                  fontClass={headingFontClass}
                />
              </div>

              <div className="relative mt-9">
                <Quote
                  size={30}
                  strokeWidth={1.2}
                  className="absolute -left-1 -top-2 text-[#eadbd2]"
                />

                <p className="relative pl-8 text-[14px] leading-7 text-[#625750] sm:text-[15px]">
                  {t("aboutPandit.biography")}
                </p>
              </div>

              <div className="mt-9">
                <p
                  className={`text-[10px] font-bold text-[#9a8d85] ${
                    language === "hi"
                      ? "tracking-[0.08em]"
                      : "uppercase tracking-[0.2em]"
                  }`}
                >
                  {t("aboutPandit.specializationsLabel")}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {SPECIALIZATION_KEYS.map((key) => {
                    const label = t(
                      `aboutPandit.specializations.${key}`
                    );

                    return (
                      <span
                        key={key}
                        className="border border-[#e8ddd6] bg-white px-4 py-2 text-[12px] font-medium text-[#514640] transition duration-300 hover:-translate-y-0.5 hover:border-[#a8441b] hover:text-[#a8441b]"
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href="/pujas"
                  className="group inline-flex h-12 items-center justify-center gap-3 bg-[#a8441b] px-7 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-[#873514] hover:shadow-[0_14px_30px_rgba(168,68,27,0.22)]"
                >
                  {t("aboutPandit.explorePujas")}

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

      <section
        className="border-t border-[#eee8e2] bg-[#fffdfb]"
        style={{
          contentVisibility: "auto",
          containIntrinsicSize: "700px",
        }}
      >
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-10 lg:py-24">
          <div>
            <p
              className={`text-[10px] font-bold text-[#a8441b] ${
                language === "hi"
                  ? "tracking-[0.08em]"
                  : "uppercase tracking-[0.22em]"
              }`}
            >
              {t("aboutPandit.philosophy.eyebrow")}
            </p>

            <h2
              className={`${headingFontClass} mt-5 text-4xl font-semibold ${
                language === "hi"
                  ? "leading-[1.2] tracking-normal"
                  : "leading-[0.98] tracking-[-0.025em]"
              } sm:text-5xl`}
            >
              {t("aboutPandit.philosophy.line1")}
              <br />
              {t("aboutPandit.philosophy.line2")}
              <br />
              {t("aboutPandit.philosophy.line3")}
            </h2>
          </div>

          <div className="max-w-2xl lg:pt-8">
            <p className="text-[16px] leading-8 text-[#6f635c] sm:text-[18px]">
              {t("aboutPandit.philosophy.description")}
            </p>

            <div className="mt-10 h-px w-full bg-[#e8dfda]" />

            <div className="mt-7 flex items-center gap-4">
              <span className="h-px w-8 bg-[#a8441b]/50" />

              <p
                className={`text-[12px] font-semibold text-[#a8441b] ${
                  language === "hi"
                    ? "tracking-[0.07em]"
                    : "uppercase tracking-[0.18em]"
                }`}
              >
                {t("aboutPandit.philosophy.mantraLine")}
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
      <span className="text-[#a8441b]">
        {icon}
      </span>

      {label}
    </span>
  );
}

function Stat({
  value,
  label,
  border = false,
  fontClass,
}) {
  return (
    <div
      className={`py-6 text-center ${
        border
          ? "border-x border-[#e9e1dc]"
          : ""
      }`}
    >
      <p
        className={`${fontClass} text-3xl font-bold tracking-[-0.02em] text-[#a8441b] sm:text-4xl`}
      >
        {value}
      </p>

      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#93867e]">
        {label}
      </p>
    </div>
  );
}