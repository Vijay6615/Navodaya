"use client";

import { PUJAS } from "../../pujasData";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import PujaSchema from "@/app/components/PujaSchema";
import { useLanguage } from "../../context/LanguageContext";

import {
  X,
  Sparkles,
  ArrowRight,
  Star,
  Clock3,
  BadgeCheck,
  ShieldCheck,
  CheckCircle2,
  CalendarDays,
  Users,
  PackageCheck,
  Plus,
  Minus,
  Video,
  Home,
} from "lucide-react";

const displayFont = {
  className: "font-display-en",
};

const hindiDisplayFont = {
  className: "font-display-hi",
};


function getHindiField(item, field) {
  if (!item || typeof item !== "object") {
    return undefined;
  }

  const capitalizedField =
    field.charAt(0).toUpperCase() +
    field.slice(1);

  return (
    item[`${field}Hi`] ??
    item[`hindi${capitalizedField}`] ??
    item?.hi?.[field]
  );
}

function getHindiSection(item, section) {
  if (!item || typeof item !== "object") {
    return undefined;
  }

  const capitalizedSection =
    section.charAt(0).toUpperCase() +
    section.slice(1);

  return (
    item[`${section}Hi`] ??
    item[`hindi${capitalizedSection}`] ??
    item?.hi?.[section]
  );
}

function getLocalizedPuja(puja, language) {
  if (!puja || language !== "hi") {
    return puja;
  }

  const localizedBestTime =
    getHindiSection(puja, "bestTime");

  const localizedSamagri =
    getHindiSection(puja, "samagri");

  const localizedTravel =
    getHindiSection(puja, "travel");

  return {
    ...puja,

    name:
      getHindiField(puja, "name") ??
      puja.name,

    category:
      getHindiField(puja, "category") ??
      puja.category,

    shortDescription:
      getHindiField(
        puja,
        "shortDescription"
      ) ?? puja.shortDescription,

    description:
      getHindiField(
        puja,
        "description"
      ) ?? puja.description,

    duration:
      getHindiField(puja, "duration") ??
      puja.duration,

    benefits:
      getHindiField(puja, "benefits") ??
      puja.benefits,

    whoShouldPerform:
      getHindiField(
        puja,
        "whoShouldPerform"
      ) ?? puja.whoShouldPerform,

    bestTime: {
      ...(puja.bestTime || {}),
      ...(localizedBestTime || {}),
    },

    includes:
      getHindiField(puja, "includes") ??
      puja.includes,

    samagri: {
      ...(puja.samagri || {}),
      ...(localizedSamagri || {}),
    },

    travel: {
      ...(puja.travel || {}),
      ...(localizedTravel || {}),
    },

    bookingProcess:
      getHindiField(
        puja,
        "bookingProcess"
      ) ?? puja.bookingProcess,

    faq:
      getHindiField(puja, "faq") ??
      puja.faq,
  };
}

function getReadableKey(key) {
  return String(key || "")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (character) =>
      character.toUpperCase()
    )
    .trim();
}

/* SiddhiStar-style accordion item:
   beige active header, circular plus/minus button and smooth opening content. */
function CollapsibleSection({ title, open, onToggle, children }) {
  return (
    <section className="border-b border-[#ece8e1] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors duration-300 sm:px-6 sm:py-6 ${
          open ? "bg-[#fff2dc]" : "bg-white hover:bg-[#fffaf3]"
        }`}
      >
        <span className="pr-2 text-base font-semibold leading-7 text-[#26221f] sm:text-lg md:text-xl">
          {title}
        </span>

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            open
              ? "bg-[#c8891b] text-white"
              : "bg-[#f2f3f5] text-[#7f858c]"
          }`}
        >
          {open ? <Minus size={20} strokeWidth={2} /> : <Plus size={20} strokeWidth={2} />}
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#f1e8dc] bg-[#fffdf9] px-5 py-5 sm:px-6 sm:py-6">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PujaDetail() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { language, t } = useLanguage();

  const headingFontClass =
    language === "hi"
      ? hindiDisplayFont.className
      : displayFont.className;

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // These detail-heavy sections are collapsed by default (on every screen size)
  // so the page doesn't feel so long. Content is untouched — just tucked behind a tap.
  const [openIncludes, setOpenIncludes] = useState(false);
  const [openSamagri, setOpenSamagri] = useState(false);
  const [openTravel, setOpenTravel] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);
  const [openProcess, setOpenProcess] = useState(false);

  const slug = params?.slug;

  const puja = useMemo(() => {
    return PUJAS.find(
      (p) => p?.slug?.toLowerCase() === slug?.toLowerCase()
    );
  }, [slug]);

  const relatedPujas = useMemo(() => {
    if (!puja?.relatedPujas) return [];

    return PUJAS.filter((item) =>
      puja.relatedPujas.includes(item.slug)
    );
  }, [puja]);

  const localizedPuja = useMemo(
    () => getLocalizedPuja(puja, language),
    [puja, language]
  );

  const localizedRelatedPujas =
    useMemo(
      () =>
        relatedPujas.map((item) =>
          getLocalizedPuja(
            item,
            language
          )
        ),
      [relatedPujas, language]
    );

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const formatPrice = (price) => {
    if (!price) return "";
    if (typeof price === "number") {
      return `₹${price.toLocaleString("en-IN")}`;
    }
    return price;
  };

  if (!puja) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffdfb]">
        <div className="text-center max-w-sm p-6 bg-white rounded-3xl border border-[#f0e6dd] shadow-sm">
          <h2 className={`${headingFontClass} text-3xl font-bold text-[#252525]`}>
            {t("pujaDetails.notFound.title")}
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            {t("pujaDetails.notFound.description")}
          </p>
          <Link
            href="/pujas"
            className="mt-6 inline-flex rounded-full bg-[#a8441b] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8c3816]"
          >
            {t("pujaDetails.notFound.back")}
          </Link>
        </div>
      </main>
    );
  }

  const displayPuja =
    localizedPuja || puja;

  const handleBooking = (type) => {
    if (status === "loading") return;
    if (!session) {
      setShowLoginModal(true);
      return;
    }
    router.push(
      `/booking?slug=${encodeURIComponent(puja.slug)}&type=${encodeURIComponent(type)}`
    );
  };

  return (
    <>
      <PujaSchema
        name={puja.name}
        description={
          puja.description ||
          puja.shortDescription
        }
        image={puja.image}
        slug={puja.slug}
        mode={
          puja.onlineAvailable
            ? "online"
            : "offline"
        }
        price={
          puja.onlinePrice ||
          puja.offlinePrice
        }
      />

      <main className="min-h-screen bg-[#fffdfb] text-[#28221f]">
        <section className="mx-auto max-w-[1320px] px-4 py-6 pb-28 md:py-10 lg:pb-10">
          
          <Link
            href="/pujas"
            className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a8441b] bg-orange-50 px-4 py-2 rounded-full border border-orange-100 transition hover:bg-orange-100"
          >
            {t("pujaDetails.allPujas")}
          </Link>

          {/* HERO GRID SECTION */}
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            
            {/* LEFT HERO IMAGE PANEL */}
            <div className="lg:col-span-5 relative overflow-hidden rounded-[32px] border border-[#f0e6dd] bg-[#fffaf6] shadow-[0_15px_45px_rgba(54,37,28,0.04)]">
              <img
                src={displayPuja.image}
                alt={displayPuja.name}
                className="h-[300px] sm:h-[420px] lg:h-[500px] w-full object-cover"
              />
              <div className="absolute left-4 top-4">
                <span className="rounded-full bg-[#a8441b] px-4 py-1.5 text-xs font-bold text-white shadow-md uppercase tracking-wider">
                  {displayPuja.category}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold shadow-md backdrop-blur">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span>{displayPuja.rating}</span>
                  <span className="text-gray-400 font-normal">({displayPuja.reviews})</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold shadow-md backdrop-blur">
                  <Clock3 size={14} className="text-[#a8441b]" />
                  <span>{displayPuja.duration}</span>
                </div>
              </div>
            </div>

            {/* RIGHT HERO ACTION PANEL */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h1 className={`${headingFontClass} text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[#252525]`}>
                {displayPuja.name}
              </h1>

              <p className="mt-4 text-sm sm:text-base leading-7 text-gray-500 max-w-2xl">
                {displayPuja.shortDescription}
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {[
                  { icon: BadgeCheck, color: "text-green-600 bg-green-50/70 border-green-100", text: t("pujaDetails.trust.verifiedPandits") },
                  { icon: ShieldCheck, color: "text-blue-600 bg-blue-50/70 border-blue-100", text: t("pujaDetails.trust.secureBooking") },
                  { icon: Star, color: "text-amber-600 bg-amber-50/70 border-amber-100", text: t("pujaDetails.trust.trusted") }
                ].map((tag, i) => (
                  <div key={i} className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold ${tag.color}`}>
                    <tag.icon size={15} className="shrink-0" />
                    <span>{tag.text}</span>
                  </div>
                ))}
              </div>

              {/* TWO DYNAMIC BOOKING CARDS — compact, icon-led, quick to scan */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2">

                {/* Online option wrapper */}
                <div className="group rounded-3xl border border-orange-100 bg-white p-4 shadow-[0_10px_30px_rgba(54,37,28,0.03)] transition duration-300 hover:-translate-y-1 hover:border-[#d9c5b9] hover:shadow-[0_18px_36px_rgba(168,68,27,.1)]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 border border-green-100">
                        <Video size={16} className="text-green-600" />
                      </div>
                      <h3 className="truncate text-base font-bold text-[#252525]">{t("pujaDetails.booking.onlinePuja")}</h3>
                    </div>
                    <span className="shrink-0 rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-[9px] font-bold text-green-700 whitespace-nowrap">{t("pujaDetails.booking.liveVideo")}</span>
                  </div>

                  <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#a8441b]">
                    {formatPrice(displayPuja.onlinePrice)}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                    <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
                      <Home size={12} className="text-[#a8441b] shrink-0" />
                      {t("pujaDetails.booking.attendFromHome")}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
                      <Users size={12} className="text-[#a8441b] shrink-0" />
                      {t("pujaDetails.booking.familySankalp")}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBooking("online")}
                    disabled={!displayPuja.onlineAvailable}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#a8441b] px-4 py-2.5 text-xs font-bold text-white transition group-hover:bg-[#8d3816] disabled:bg-gray-200 disabled:text-gray-400"
                  >
                    <span>{t("pujaDetails.booking.bookOnline")}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* Offline option wrapper */}
                <div className="group rounded-3xl border border-orange-100 bg-white p-4 shadow-[0_10px_30px_rgba(54,37,28,0.03)] transition duration-300 hover:-translate-y-1 hover:border-[#d9c5b9] hover:shadow-[0_18px_36px_rgba(168,68,27,.1)]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 border border-blue-100">
                        <Home size={16} className="text-blue-600" />
                      </div>
                      <h3 className="truncate text-base font-bold text-[#252525]">{t("pujaDetails.booking.offlinePuja")}</h3>
                    </div>
                    <span className="shrink-0 rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[9px] font-bold text-blue-700 whitespace-nowrap">{t("pujaDetails.booking.homeVisitBadge")}</span>
                  </div>

                  <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#a8441b]">
                    {formatPrice(displayPuja.offlinePrice)}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                    <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
                      <BadgeCheck size={12} className="text-[#a8441b] shrink-0" />
                      {t("pujaDetails.booking.panditVisits")}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
                      <PackageCheck size={12} className="text-[#a8441b] shrink-0" />
                      {t("pujaDetails.booking.materialsIncluded")}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBooking("offline")}
                    disabled={!displayPuja.offlineAvailable}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full border border-[#a8441b] bg-white px-4 py-2.5 text-xs font-bold text-[#a8441b] transition hover:bg-[#a8441b] hover:text-white disabled:border-gray-200 disabled:text-gray-400"
                  >
                    <span>{t("pujaDetails.booking.requestHomeVisit")}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* BLOCK INTERACTION PACK: Structured layouts to keep details brief and clean */}
          <div className="mt-12 space-y-8 max-w-[960px]">
            
            {/* ABOUT SECTION */}
            <article className="rounded-3xl border border-[#f0e6dd] bg-white p-6 md:p-8 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-[#a8441b]" />
                <h2 className={`${headingFontClass} text-2xl md:text-3xl font-bold text-[#252525]`}>{t("pujaDetails.sections.about")}</h2>
              </div>
              <p className="text-sm md:text-base leading-7 md:leading-8 text-gray-500 whitespace-pre-line">
                {displayPuja.description}
              </p>
            </article>

            {/* BENEFITS LIST GRID */}
            <section>
              <div className="mb-6 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-green-600" />
                <h2 className={`${headingFontClass} text-2xl md:text-3xl font-bold text-[#252525]`}>{t("pujaDetails.sections.benefits")}</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {displayPuja.benefits?.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50/40 p-4 transition duration-300 hover:bg-green-50">
                    <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm font-medium text-gray-700 leading-6">{benefit}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* SUITABILITY INFO */}
            <section>
              <div className="mb-6 flex items-center gap-2">
                <Users size={20} className="text-[#a8441b]" />
                <h2 className={`${headingFontClass} text-2xl md:text-3xl font-bold text-[#252525]`}>{t("pujaDetails.sections.whoShouldPerform")}</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {displayPuja.whoShouldPerform?.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-2xl border border-orange-100 bg-orange-50/30 p-4">
                    <BadgeCheck size={16} className="text-[#a8441b] shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm font-medium text-gray-700 leading-6">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CRITICAL CONFIG TIMING TABS */}
            <section>
              <div className="mb-6 flex items-center gap-2">
                <CalendarDays size={20} className="text-[#a8441b]" />
                <h2 className={`${headingFontClass} text-2xl md:text-3xl font-bold text-[#252525]`}>{t("pujaDetails.sections.bestTime")}</h2>
              </div>
              <div className="grid gap-4 grid-cols-3">
                {[
                  {
                    label: t(
                      "pujaDetails.timing.recommendedDays"
                    ),
                    value:
                      displayPuja.bestTime
                        ?.days,
                    icon: CalendarDays,
                  },
                  {
                    label: t(
                      "pujaDetails.timing.ritualDuration"
                    ),
                    value:
                      displayPuja.bestTime
                        ?.duration,
                    icon: Clock3,
                  },
                  {
                    label: t(
                      "pujaDetails.timing.frequency"
                    ),
                    value:
                      displayPuja.bestTime
                        ?.frequency,
                    icon: BadgeCheck,
                  },
                ].map((box, i) => (
                  <div key={i} className="rounded-2xl border border-[#f0e6dd] bg-white p-4 shadow-sm text-center sm:text-left">
                    <box.icon size={22} className="text-[#a8441b] mb-2 mx-auto sm:mx-0" />
                    <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{box.label}</h4>
                    <p className="mt-1 text-xs sm:text-sm font-semibold text-gray-700 leading-5">{box.value || t("pujaDetails.common.flexible")}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ALL DETAIL DROPDOWNS — SAME UI AS THE REFERENCE FAQ */}
            <div className="overflow-hidden rounded-2xl border border-[#ece8e1] bg-white shadow-sm">
              <CollapsibleSection
                title={t("pujaDetails.accordions.includes")}
                open={openIncludes}
                onToggle={() => setOpenIncludes((v) => !v)}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {displayPuja.includes?.map((item, index) => (
                    <div key={index} className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
                      <CheckCircle2 size={15} className="shrink-0 text-green-600" />
                      <span className="text-xs font-medium text-gray-600 sm:text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                title={t("pujaDetails.accordions.samagri")}
                open={openSamagri}
                onToggle={() => setOpenSamagri((v) => !v)}
              >
                <div className="rounded-2xl border border-[#f0e6dd] bg-white p-5 shadow-sm">
                  <div className="mb-6 grid grid-cols-2 gap-4 rounded-2xl bg-gray-50 p-4 text-center sm:grid-cols-3">
                    <div>
                      <h4 className="text-[9px] font-bold uppercase text-gray-400">{t("pujaDetails.samagri.mode")}</h4>
                      <p className="mt-0.5 text-xs font-bold text-gray-700 sm:text-sm">{displayPuja.samagri?.mode || t("pujaDetails.common.included")}</p>
                    </div>
                    <div>
                      <h4 className="text-[9px] font-bold uppercase text-gray-400">{t("pujaDetails.samagri.extraCharge")}</h4>
                      <p className="mt-0.5 text-xs font-bold text-[#a8441b] sm:text-sm">{formatPrice(displayPuja.samagri?.extraCharge) || t("pujaDetails.common.nil")}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <h4 className="text-[9px] font-bold uppercase text-gray-400">{t("pujaDetails.samagri.checklist")}</h4>
                      <p className="mt-0.5 text-xs font-bold text-gray-700 sm:text-sm">{displayPuja.samagri?.checklistProvided ? t("pujaDetails.common.yes") : t("pujaDetails.common.no")}</p>
                    </div>
                  </div>

                  {displayPuja.samagri?.note && (
                    <p className="mb-4 px-1 text-xs italic text-gray-400">{t("pujaDetails.common.note")}: {displayPuja.samagri.note}</p>
                  )}

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {displayPuja.samagri?.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 rounded-xl border border-orange-100/40 bg-orange-50/50 px-3 py-2">
                        <CheckCircle2 size={13} className="shrink-0 text-[#a8441b]" />
                        <span className="truncate text-xs font-medium text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                title={t("pujaDetails.accordions.travel")}
                open={openTravel}
                onToggle={() => setOpenTravel((v) => !v)}
              >
                <div className="grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
                  {[
                    {
                      title: t(
                        "pujaDetails.travel.transitMode"
                      ),
                      val:
                        displayPuja.travel?.mode ||
                        t(
                          "pujaDetails.travel.cabAuto"
                        ),
                    },
                    {
                      title: t(
                        "pujaDetails.travel.withinCity"
                      ),
                      val:
                        formatPrice(
                          displayPuja.travel?.city
                        ) ||
                        t(
                          "pujaDetails.common.included"
                        ),
                    },
                    {
                      title: t(
                        "pujaDetails.travel.outstation"
                      ),
                      val:
                        formatPrice(
                          displayPuja.travel
                            ?.outsideCity
                        ) ||
                        t(
                          "pujaDetails.travel.variable"
                        ),
                    },
                  ].map((card, idx) => (
                    <div key={idx} className="rounded-2xl border border-[#f0e6dd] bg-white p-4 shadow-sm">
                      <h4 className="text-[9px] font-bold uppercase text-gray-400">{card.title}</h4>
                      <p className="mt-1 text-xs font-bold text-gray-700 sm:text-sm">{card.val}</p>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                title={t("pujaDetails.accordions.priceBreakdown")}
                open={openPrice}
                onToggle={() => setOpenPrice((v) => !v)}
              >
                <div className="rounded-2xl border border-[#f0e6dd] bg-white px-5 py-2 text-xs font-medium text-gray-600 shadow-sm sm:text-sm">
                  {Object.entries(displayPuja.priceBreakdown || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between border-b border-gray-100 py-3 last:border-none">
                      <span>
                        {t(
                          `pujaDetails.priceBreakdown.${key}`,
                          getReadableKey(key)
                        )}
                      </span>
                      <span className="font-bold text-[#a8441b]">{formatPrice(value)}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                title={t("pujaDetails.accordions.bookingProcess")}
                open={openProcess}
                onToggle={() => setOpenProcess((v) => !v)}
              >
                <div className="space-y-3">
                  {displayPuja.bookingProcess?.map((step, index) => (
                    <div key={index} className="flex items-center gap-4 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#a8441b] text-xs font-bold text-white shadow-sm">
                        {index + 1}
                      </div>
                      <p className="text-xs font-semibold leading-relaxed text-gray-600 sm:text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            </div>

            {/* FAQ — SAME PLUS/MINUS ACCORDION UI */}
            <section>
              <div className="mb-6 flex items-center gap-4">
                <span className="h-12 w-1.5 shrink-0 bg-[#c8891b]" />
                <h2 className={`${headingFontClass} text-3xl font-bold leading-tight text-[#252525] md:text-4xl`}>
                  {t("pujaDetails.sections.faq")}
                </h2>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#ece8e1] bg-white shadow-sm">
                {displayPuja.faq?.map((item, index) => (
                  <CollapsibleSection
                    key={index}
                    title={item.question}
                    open={openFaq === index}
                    onToggle={() => toggleFaq(index)}
                  >
                    <p className="text-sm leading-7 text-gray-500 sm:text-base sm:leading-8">
                      {item.answer}
                    </p>
                  </CollapsibleSection>
                ))}
              </div>
            </section>

          </div>

          {/* DYNAMIC RELATED CAROUSAL FEED */}
          {relatedPujas.length > 0 && (
            <section className="mt-16 border-t border-gray-100 pt-12">
              <div className="mb-6 flex items-center justify-between">
                <h2 className={`${headingFontClass} text-3xl font-bold text-[#252525]`}>{t("pujaDetails.related.title")}</h2>
                <Link href="/pujas" className="text-xs font-bold uppercase tracking-wider text-[#a8441b] bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 hover:bg-orange-100">{t("pujaDetails.related.viewAll")}</Link>
              </div>
              {/* Mobile: horizontal scroll, small peeking cards. sm+: normal grid. */}
              <div className="related-scroll -mx-4 flex gap-4 overflow-x-auto px-4 pb-3 snap-x snap-mandatory sm:mx-0 sm:grid sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 sm:grid-cols-2 lg:grid-cols-3">
                {localizedRelatedPujas.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/pujas/${item.slug}`}
                    className="w-[62vw] max-w-[240px] shrink-0 snap-start overflow-hidden rounded-3xl border border-[#f0e6dd] bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-md group sm:w-auto sm:max-w-none sm:shrink"
                  >
                    <img src={item.image} alt={item.name} className="h-32 sm:h-48 w-full object-cover" />
                    <div className="p-3 sm:p-4">
                      <span className="rounded-full bg-orange-50 border border-orange-100 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-[#a8441b] tracking-wide uppercase">{item.category}</span>
                      <h3 className="mt-2 sm:mt-3 text-sm sm:text-lg font-bold text-[#252525] group-hover:text-[#a8441b] transition-colors truncate">{item.name}</h3>
                      <p className="mt-1 sm:mt-1.5 hidden sm:line-clamp-2 sm:block text-xs text-gray-400 leading-5">{item.shortDescription}</p>
                      <div className="mt-2.5 sm:mt-4 flex items-center justify-between pt-2.5 sm:pt-3 border-t border-gray-50">
                        <span className="text-sm sm:text-base font-extrabold text-[#a8441b]">{formatPrice(item.onlinePrice)}</span>
                        <span className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#a8441b]">
                          {t(
                            "pujaDetails.related.view"
                          )}
                          <ArrowRight
                            size={12}
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* SPLASH LOWER CTA FOOTER SECTION */}
          <section className="mt-16 overflow-hidden rounded-[36px] bg-gradient-to-br from-[#a8441b] to-[#c95326] p-8 md:p-12 text-white text-center shadow-md">
            <div className="flex flex-col items-center max-w-xl mx-auto">
              <h2 className={`${headingFontClass} mt-4 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight`}>{t("pujaDetails.cta.title")}</h2>
              <p className="mt-3 text-xs sm:text-sm text-orange-100/80 leading-6 font-medium">
                {t("pujaDetails.cta.description")}
              </p>
              <button
                onClick={() =>
                  handleBooking(
                    displayPuja.onlineAvailable
                      ? "online"
                      : "offline"
                  )
                }
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs sm:text-sm font-bold text-[#a8441b] shadow-md transition hover:scale-105 active:scale-[0.98]"
              >
                <span>{t("pujaDetails.cta.button")}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </section>

        </section>

        {/* STICKY MOBILE BOOKING BAR — keeps booking one tap away on this long page */}
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-orange-100 bg-white/95 px-4 py-3 backdrop-blur-sm lg:hidden"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-bold uppercase tracking-wider text-gray-400">{t("pujaDetails.mobile.startingAt")}</p>
              <p className="truncate text-base font-extrabold text-[#a8441b]">
                {formatPrice(displayPuja.onlinePrice || displayPuja.offlinePrice)}
              </p>
            </div>
            <button
              onClick={() => handleBooking("online")}
              disabled={!displayPuja.onlineAvailable}
              className="shrink-0 rounded-full bg-[#a8441b] px-4 py-2.5 text-xs font-bold text-white transition active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400"
            >
              {t(
                "pujaDetails.mobile.bookOnline"
              )}
            </button>
            <button
              onClick={() => handleBooking("offline")}
              disabled={!displayPuja.offlineAvailable}
              className="shrink-0 rounded-full border border-[#a8441b] bg-white px-4 py-2.5 text-xs font-bold text-[#a8441b] transition active:scale-[0.98] disabled:border-gray-200 disabled:text-gray-400"
            >
              {t(
                "pujaDetails.mobile.homeVisit"
              )}
            </button>
          </div>
        </div>

        <style jsx global>{`
          .related-scroll {
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .related-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* AUTH GATE LIGHT MODAL CONTAINER */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl border border-gray-100 animate-[fadeIn_0.2s_ease]">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-[#252525]">{t("pujaDetails.login.title")}</h3>
                <button
                  type="button"
                  aria-label={t(
                    "pujaDetails.login.close"
                  )}
                  onClick={() =>
                    setShowLoginModal(false)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="mt-3 text-xs sm:text-sm leading-6 text-gray-500">
                {t("pujaDetails.login.description")}
              </p>
              <button
                onClick={() => router.push("/login")}
                className="mt-5 w-full rounded-xl bg-[#a8441b] py-2.5 text-sm font-bold text-white transition hover:bg-[#8d3816] shadow-sm"
              >
                {t("pujaDetails.login.button")}
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}