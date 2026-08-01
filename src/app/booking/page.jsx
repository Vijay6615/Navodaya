"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Clock,
  CreditCard,
  Gift,
  HeartHandshake,
  Home,
  LockKeyhole,
  MapPin,
  MessageSquare,
  Minus,
  PackageCheck,
  Plus,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  User,
  Video,
  ClipboardList,
} from "lucide-react";

import { PUJAS } from "../pujasData";
import { useLanguage } from "../context/LanguageContext";

export const dynamic = "force-dynamic";

const UPI_ID = "9594943609@ptsbi";

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

  return {
    ...puja,

    name:
      getHindiField(puja, "name") ??
      puja.name,

    duration:
      getHindiField(puja, "duration") ??
      puja.duration,

    includes:
      getHindiField(puja, "includes") ??
      puja.includes,

    benefits:
      getHindiField(puja, "benefits") ??
      puja.benefits,

    samagri: {
      ...(puja.samagri || {}),
      ...(getHindiSection(
        puja,
        "samagri"
      ) || {}),
    },

    travel: {
      ...(puja.travel || {}),
      ...(getHindiSection(
        puja,
        "travel"
      ) || {}),
    },
  };
}

function parsePrice(value) {
  if (typeof value === "number") return value;
  if (!value) return 0;

  const parsed = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value) {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("₹", "₹ ");
}

function SectionTitle({ step, icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff0e6] text-[#a8441b]">
        <Icon size={19} />
        {step && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#a8441b] px-1 text-[10px] font-bold text-white">
            {step}
          </span>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="text-lg font-bold text-[#26211e] sm:text-xl">{title}</h3>
        {description && (
          <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function AccordionCard({
  icon: Icon,
  eyebrow,
  title,
  open,
  onToggle,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-[#eee4dc] bg-white shadow-[0_10px_30px_rgba(55,35,15,0.04)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors sm:px-6 ${
          open ? "bg-[#fff1dc]" : "bg-white hover:bg-[#fffaf5]"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              open ? "bg-white" : "bg-[#fff4ec]"
            }`}
          >
            <Icon size={18} className="text-[#a8441b]" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a8441b]">
              {eyebrow}
            </p>
            <h3 className="mt-0.5 text-base font-bold leading-6 text-[#252525] sm:text-lg">
              {title}
            </h3>
          </div>
        </div>

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
            open
              ? "bg-[#c9871b] text-white shadow-sm"
              : "bg-[#f3f4f6] text-gray-500"
          }`}
        >
          {open ? <Minus size={20} /> : <Plus size={20} />}
        </span>
      </button>

      {open && (
        <div className="accordionBody border-t border-[#f1e3d3] bg-[#fffdf9] px-5 py-5 sm:px-6 sm:py-6">
          {children}
        </div>
      )}
    </section>
  );
}

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, t } = useLanguage();

  const headingFontClass =
    language === "hi"
      ? hindiDisplayFont.className
      : displayFont.className;

  const selectedPujaName =
    searchParams.get("slug") || searchParams.get("puja") || "";

  const urlType = searchParams.get("type") || "";

  const puja = useMemo(() => {
    return PUJAS.find(
      (item) =>
        item?.name?.toLowerCase() === selectedPujaName.toLowerCase() ||
        item?.slug?.toLowerCase() === selectedPujaName.toLowerCase()
    );
  }, [selectedPujaName]);

  const displayPuja = useMemo(
    () => getLocalizedPuja(puja, language),
    [puja, language]
  );

  const initialPujaType =
    urlType === "online" || urlType === "offline" ? urlType : "";

  const [pujaType, setPujaType] = useState(initialPujaType);
  const [samagriOption, setSamagriOption] = useState(
    initialPujaType === "online" ? "self" : ""
  );

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    address: "",
    city: "",
    timeSlot: "",
    message: "",
    transactionId: "",
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const [openIncludes, setOpenIncludes] = useState(false);
  const [openSamagriList, setOpenSamagriList] = useState(false);
  const [openBenefits, setOpenBenefits] = useState(false);
  const [openProcess, setOpenProcess] = useState(false);

  const baseAmount = useMemo(() => {
    if (pujaType === "online") return parsePrice(displayPuja?.onlinePrice);
    if (pujaType === "offline") return parsePrice(displayPuja?.offlinePrice);
    return 0;
  }, [displayPuja, pujaType]);

  const availableSamagriCharge = useMemo(() => {
    return parsePrice(
      displayPuja?.samagri?.extraCharge ??
      displayPuja?.priceBreakdown?.samagriCharge
    );
  }, [displayPuja]);

  const samagriCharge =
    pujaType === "offline" && samagriOption === "pandit"
      ? availableSamagriCharge
      : 0;

  const totalAmount = baseAmount + samagriCharge;

  const basePriceText = baseAmount ? formatCurrency(baseAmount) : "--";
  const samagriPriceText = samagriCharge
    ? `+ ${formatCurrency(samagriCharge)}`
    : formatCurrency(0);
  const totalPriceText = totalAmount ? formatCurrency(totalAmount) : "--";

  const samagriLabel =
    pujaType === "online"
      ? t("bookingPage.summary.selfArranged")
      : samagriOption === "pandit"
      ? t("bookingPage.summary.panditBrings")
      : samagriOption === "self"
      ? t("bookingPage.summary.selfArrange")
      : t("bookingPage.summary.selectOption");

  const handleModeSelect = (type) => {
    setPujaType(type);

    if (type === "online") {
      setSamagriOption("self");
    } else {
      setSamagriOption("");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const bookingSummary = [
    {
      label: t(
        "bookingPage.summary.pujaMode"
      ),
      value:
        pujaType === "online"
          ? t(
              "bookingPage.summary.onlineVideo"
            )
          : pujaType === "offline"
          ? t(
              "bookingPage.summary.homeVisit"
            )
          : t(
              "bookingPage.summary.notSelected"
            ),
    },
    {
      label: t(
        "bookingPage.summary.preferredDate"
      ),
      value:
        form.date ||
        t(
          "bookingPage.summary.notSelected"
        ),
    },
    {
      label: t(
        "bookingPage.summary.samagri"
      ),
      value: samagriLabel,
    },
    {
      label: t(
        "bookingPage.summary.estimatedTotal"
      ),
      value: totalPriceText,
    },
  ];

  const submitBooking = async (event) => {
    event.preventDefault();

    if (!puja) {
      alert(t("bookingPage.alerts.pujaNotFound"));
      return;
    }

    if (!pujaType) {
      alert(t("bookingPage.alerts.selectMode"));
      return;
    }

    if (
      pujaType === "offline" &&
      puja?.samagri &&
      !samagriOption
    ) {
      alert(t("bookingPage.alerts.selectSamagri"));
      return;
    }

    if (pujaType === "online" && !form.transactionId.trim()) {
      alert(t("bookingPage.alerts.enterTransaction"));
      return;
    }

    setLoading(true);

    try {
      const generatedBookingId =
        "BK-" + Math.floor(100000 + Math.random() * 900000);

      const samagriArrangement =
        pujaType === "online"
          ? "Customer will arrange Puja Samagri"
          : samagriOption === "pandit"
          ? "Pandit Ji will bring complete Puja Samagri"
          : "Customer will arrange Puja Samagri";

      const bookingPayload = {
        bookingId: generatedBookingId,
        pujaName: puja.name,
        puja: puja.name,
        pujaType: pujaType === "online" ? "Online Puja" : "Offline Puja",
        name: form.name,
        customerName: form.name,
        userName: form.name,
        phone: form.phone,
        email: form.email,
        date: form.date,
        timeSlot: form.timeSlot || "Flexible",
        address:
          pujaType === "offline"
            ? `${form.address}, ${form.city}`
            : "Online Puja",
        basePrice: basePriceText,
        samagriOption: samagriArrangement,
        samagriProvidedBy:
          samagriOption === "pandit" ? "Pandit Ji" : "Customer",
        samagriCharge: formatCurrency(samagriCharge),
        samagriItems:
          samagriOption === "pandit" ? puja?.samagri?.items || [] : [],
        price: totalPriceText,
        totalPrice: totalPriceText,
        message: form.message,
        transactionId:
          pujaType === "online"
            ? form.transactionId
            : "Pay on service",
        status: "pending",
      };

      const dbResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!dbResponse.ok) {
        let errorData = { error: "Unknown backend error occurred" };
        const textData = await dbResponse.text();

        if (textData) {
          try {
            errorData = JSON.parse(textData);
          } catch {
            errorData = { error: textData };
          }
        }

        console.warn("Database connection issue:", errorData?.error);
      }

      if (typeof window !== "undefined") {
        let existingLocal = [];

        try {
          existingLocal = JSON.parse(
            localStorage.getItem("local_puja_bookings") || "[]"
          );
        } catch {
          existingLocal = [];
        }

        existingLocal.unshift(bookingPayload);
        localStorage.setItem(
          "local_puja_bookings",
          JSON.stringify(existingLocal)
        );
        localStorage.setItem("just_booked_trigger", "true");
      }

      setSent(true);

      setTimeout(() => {
        router.push("/my-bookings");
      }, 1200);
    } catch (error) {
      console.error(error);
      alert(t("bookingPage.alerts.failed"));
    } finally {
      setLoading(false);
    }
  };

  if (!puja) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf6] px-6">
        <div className="max-w-md rounded-[32px] border border-[#efe3d8] bg-white p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <Sparkles className="mx-auto mb-5 h-12 w-12 text-[#a8441b]" />

          <h1
            className={`${headingFontClass} text-4xl font-semibold text-[#252525]`}
          >
            {t("bookingPage.notFound.title")}
          </h1>

          <p className="mt-4 text-sm leading-7 text-gray-500">
            {t(
              "bookingPage.notFound.description"
            )}
          </p>

          <button
            type="button"
            onClick={() => router.push("/pujas")}
            className="mt-8 rounded-full bg-[#a8441b] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#8f3a17]"
          >
            {t("bookingPage.notFound.button")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen overflow-hidden bg-[#fbf7f2] ${
        language === "hi"
          ? "bookingHindi"
          : ""
      }`}
    >
      <section className="mx-auto max-w-[1380px] px-4 py-5 pb-28 md:px-8 md:py-10 lg:pb-12">
        <div className="mb-5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-[#e9ddd4] bg-white px-4 py-2.5 text-sm font-semibold text-[#555] shadow-sm transition hover:border-[#a8441b] hover:text-[#a8441b]"
          >
            <ChevronLeft size={17} />
            {t("bookingPage.top.back")}
          </button>

          <div className="hidden items-center gap-2 text-xs font-semibold text-gray-500 sm:flex">
            <LockKeyhole size={15} className="text-green-600" />
            {t("bookingPage.top.secureBooking")}
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            {t("bookingPage.top.verifiedBeforeConfirmation")}
          </div>
        </div>

        <div className="grid overflow-hidden rounded-[34px] border border-[#eee2d8] bg-white shadow-[0_30px_90px_rgba(55,35,15,0.09)] lg:overflow-visible lg:grid-cols-[0.9fr_1.1fr]">
          {/* IMAGE PANEL KEPT UNCHANGED */}
          <div className="relative flex h-[220px] sm:h-[320px] lg:h-[calc(100vh-3rem)] lg:max-h-[640px] items-center justify-center overflow-hidden bg-[#fffaf6] m-4 rounded-3xl lg:sticky lg:top-6 lg:m-6 lg:self-start lg:rounded-[26px]">
            <img
              src={displayPuja.image}
              alt={displayPuja.name}
              className="max-h-full max-w-full object-contain p-4"
            />
            <div className="absolute inset-x-4 bottom-4 hidden items-center justify-between gap-3 rounded-2xl bg-white/90 px-4 py-3 backdrop-blur-sm lg:flex">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#252525]">
                <ShieldCheck size={16} className="text-[#a8441b]" />
                {t("bookingPage.image.verifiedPandit")}
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#252525]">
                <BadgeCheck size={16} className="text-[#a8441b]" />
                {t("bookingPage.image.authenticRituals")}
              </div>
            </div>
          </div>

          <div className="bg-[#fffdfb] p-4 sm:p-6 md:p-8 lg:p-10">
            <header className="rounded-[28px] border border-[#efe4dc] bg-white p-5 shadow-[0_12px_35px_rgba(55,35,15,0.04)] sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-xl">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a8441b]">
                    {t("bookingPage.header.eyebrow")}
                  </p>

                  <h1
                    className={`${headingFontClass} mt-2 text-3xl font-bold leading-tight text-[#25211e] sm:text-4xl md:text-5xl`}
                  >
                    {displayPuja.name}
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-gray-500 sm:leading-7">
                    {t(
                      "bookingPage.header.description"
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#fff4ec] px-4 py-3 text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {t("bookingPage.header.duration")}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 font-bold text-[#a8441b]">
                    <Clock size={16} />
                    {displayPuja.duration}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {bookingSummary.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-[#f1e8e1] bg-[#fffdfb] px-3 py-3"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      {item.label}
                    </p>
                    <p className="mt-1 truncate text-xs font-bold text-[#302a26] sm:text-sm">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </header>

            <form
              id="pujaBookingForm"
              onSubmit={submitBooking}
              className="mt-5 space-y-5"
            >
              {/* STEP 1: PUJA MODE */}
              <section className="rounded-[24px] border border-[#eee4dc] bg-white p-4 shadow-[0_10px_30px_rgba(55,35,15,0.04)] sm:rounded-[28px] sm:p-6">
                <SectionTitle
                  step="1"
                  icon={pujaType === "online" ? Video : Home}
                  title={t("bookingPage.mode.title")}
                  description={t("bookingPage.mode.description")}
                />

                <div className="mt-4 rounded-[18px] border border-[#eadfd7] bg-[#f7f3ef] p-1.5 sm:rounded-[20px]">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-1.5">
                    {displayPuja.onlineAvailable && (
                      <button
                        type="button"
                        onClick={() => handleModeSelect("online")}
                        aria-pressed={pujaType === "online"}
                        className={`flex min-h-[78px] w-full items-center gap-3 rounded-[15px] border px-3.5 py-3 text-left transition-all sm:min-h-[82px] sm:px-4 ${
                          pujaType === "online"
                            ? "border-[#d8aa90] bg-white shadow-[0_6px_18px_rgba(86,53,35,0.08)]"
                            : "border-transparent bg-transparent hover:bg-white/70"
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            pujaType === "online"
                              ? "bg-[#e8f7ee] text-[#177245]"
                              : "bg-white text-gray-500"
                          }`}
                        >
                          <Video size={18} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold leading-5 text-[#28231f] sm:text-base">
                            {t("bookingPage.mode.online")}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-4 text-gray-500 sm:text-xs">
                            {t("bookingPage.mode.onlineDescription")}
                          </span>
                        </span>

                        <span className="flex shrink-0 flex-col items-end gap-1.5">
                          <span className="whitespace-nowrap text-sm font-extrabold text-[#a8441b]">
                            {displayPuja.onlinePrice}
                          </span>
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                              pujaType === "online"
                                ? "border-[#a8441b] bg-[#a8441b] text-white"
                                : "border-[#cfc6c0] bg-white text-transparent"
                            }`}
                          >
                            <CheckCircle2 size={12} />
                          </span>
                        </span>
                      </button>
                    )}

                    {displayPuja.offlineAvailable && (
                      <button
                        type="button"
                        onClick={() => handleModeSelect("offline")}
                        aria-pressed={pujaType === "offline"}
                        className={`flex min-h-[78px] w-full items-center gap-3 rounded-[15px] border px-3.5 py-3 text-left transition-all sm:min-h-[82px] sm:px-4 ${
                          pujaType === "offline"
                            ? "border-[#d8aa90] bg-white shadow-[0_6px_18px_rgba(86,53,35,0.08)]"
                            : "border-transparent bg-transparent hover:bg-white/70"
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            pujaType === "offline"
                              ? "bg-[#edf3ff] text-[#315ea8]"
                              : "bg-white text-gray-500"
                          }`}
                        >
                          <Home size={18} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold leading-5 text-[#28231f] sm:text-base">
                            {t("bookingPage.mode.offline")}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-4 text-gray-500 sm:text-xs">
                            {t("bookingPage.mode.offlineDescription")}
                          </span>
                        </span>

                        <span className="flex shrink-0 flex-col items-end gap-1.5">
                          <span className="whitespace-nowrap text-sm font-extrabold text-[#a8441b]">
                            {displayPuja.offlinePrice}
                          </span>
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                              pujaType === "offline"
                                ? "border-[#a8441b] bg-[#a8441b] text-white"
                                : "border-[#cfc6c0] bg-white text-transparent"
                            }`}
                          >
                            <CheckCircle2 size={12} />
                          </span>
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* STEP 2: SAMAGRI OPTION */}
              {pujaType && (
                <section className="optionReveal rounded-[28px] border border-[#eee4dc] bg-white p-5 shadow-[0_10px_30px_rgba(55,35,15,0.04)] sm:p-6">
                  <SectionTitle
                    step="2"
                    icon={PackageCheck}
                    title={t("bookingPage.samagri.title")}
                    description={
                      pujaType === "offline"
                        ? t(
                            "bookingPage.samagri.offlineDescription"
                          )
                        : t(
                            "bookingPage.samagri.onlineDescription"
                          )
                    }
                  />

                  {pujaType === "offline" && displayPuja?.samagri ? (
                    <div className="mt-4 rounded-[20px] border border-[#e6e0da] bg-[#f8f7f5] p-1.5">
                      <div className="grid gap-1.5 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setSamagriOption("self")}
                          aria-pressed={samagriOption === "self"}
                          className={`flex min-h-[72px] items-center gap-3 rounded-[16px] border px-3.5 py-3 text-left transition-all ${
                            samagriOption === "self"
                              ? "border-[#c8dfd1] bg-white shadow-[0_5px_16px_rgba(41,83,61,0.07)]"
                              : "border-transparent bg-transparent hover:bg-white/70"
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                              samagriOption === "self"
                                ? "bg-[#eaf7ef] text-[#26734d]"
                                : "bg-white text-gray-500"
                            }`}
                          >
                            <Gift size={17} />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-bold text-[#28231f]">
                              {t("bookingPage.samagri.selfTitle")}
                            </span>
                            <span className="mt-0.5 block text-[10px] leading-4 text-gray-500 sm:text-xs">
                              {t("bookingPage.samagri.selfDescription")}
                            </span>
                          </span>

                          <span className="shrink-0 text-right">
                            <span className="block rounded-full bg-[#eaf7ef] px-2.5 py-1 text-[10px] font-extrabold text-[#26734d]">
                              ₹ 0
                            </span>
                            <span
                              className={`mx-auto mt-1.5 flex h-4 w-4 items-center justify-center rounded-full border ${
                                samagriOption === "self"
                                  ? "border-[#26734d] bg-[#26734d] text-white"
                                  : "border-gray-300 bg-white text-transparent"
                              }`}
                            >
                              <CheckCircle2 size={10} />
                            </span>
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSamagriOption("pandit")}
                          aria-pressed={samagriOption === "pandit"}
                          className={`flex min-h-[72px] items-center gap-3 rounded-[16px] border px-3.5 py-3 text-left transition-all ${
                            samagriOption === "pandit"
                              ? "border-[#e4c48c] bg-white shadow-[0_5px_16px_rgba(116,78,23,0.08)]"
                              : "border-transparent bg-transparent hover:bg-white/70"
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                              samagriOption === "pandit"
                                ? "bg-[#fff4dc] text-[#a16a10]"
                                : "bg-white text-gray-500"
                            }`}
                          >
                            <PackageCheck size={17} />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-bold text-[#28231f]">
                              {t("bookingPage.samagri.panditTitle")}
                            </span>
                            <span className="mt-0.5 block text-[10px] leading-4 text-gray-500 sm:text-xs">
                              {t("bookingPage.samagri.panditDescription")}
                            </span>
                          </span>

                          <span className="shrink-0 text-right">
                            <span className="block rounded-full bg-[#fff4dc] px-2.5 py-1 text-[10px] font-extrabold text-[#9a6410]">
                              +{formatCurrency(availableSamagriCharge)}
                            </span>
                            <span
                              className={`mx-auto mt-1.5 flex h-4 w-4 items-center justify-center rounded-full border ${
                                samagriOption === "pandit"
                                  ? "border-[#a16a10] bg-[#a16a10] text-white"
                                  : "border-gray-300 bg-white text-transparent"
                              }`}
                            >
                              <CheckCircle2 size={10} />
                            </span>
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center gap-3 rounded-[18px] border border-[#dce8f8] bg-[#f3f7fd] px-4 py-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#315ea8]">
                        <BadgeCheck size={17} />
                      </span>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#263c61]">
                          {t("bookingPage.samagri.onlineInfoTitle")}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-4 text-[#5b6f90]">
                          {t("bookingPage.samagri.onlineInfoDescription")}
                        </p>
                      </div>
                    </div>
                  )}

                  {pujaType === "offline" &&
                    samagriOption === "pandit" &&
                    displayPuja?.samagri?.items?.length > 0 && (
                      <div className="mt-3 rounded-[18px] border border-[#f0e3ca] bg-[#fffaf0] px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#9a6410]">
                            {t("bookingPage.samagri.packagePreview")}
                          </p>
                          <span className="text-[10px] font-semibold text-gray-500">
                            {displayPuja.samagri.items.length}{" "}
                            {t("bookingPage.samagri.items")}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {displayPuja.samagri.items.slice(0, 6).map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-[#f0e3ca] bg-white px-2.5 py-1 text-[10px] font-semibold text-gray-600"
                            >
                              {item}
                            </span>
                          ))}

                          {displayPuja.samagri.items.length > 6 && (
                            <span className="rounded-full bg-[#a16a10] px-2.5 py-1 text-[10px] font-bold text-white">
                              +{displayPuja.samagri.items.length - 6}{" "}
                              {t("bookingPage.samagri.more")}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                </section>
              )}

              {/* STEP 3: CUSTOMER DETAILS */}
              <section className="rounded-[28px] border border-[#eee4dc] bg-white p-5 shadow-[0_10px_30px_rgba(55,35,15,0.04)] sm:p-6">
                <SectionTitle
                  step="3"
                  icon={User}
                  title={t("bookingPage.devotee.title")}
                  description={t("bookingPage.devotee.description")}
                />

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className="fieldLabel">{t("bookingPage.devotee.fullName")}</span>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder={t("bookingPage.devotee.namePlaceholder")}
                      autoComplete="name"
                      required
                      className="bookingInput"
                    />
                  </label>

                  <label>
                    <span className="fieldLabel">{t("bookingPage.devotee.phone")}</span>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder={t("bookingPage.devotee.phonePlaceholder")}
                      autoComplete="tel"
                      inputMode="tel"
                      required
                      className="bookingInput"
                    />
                  </label>

                  <label>
                    <span className="fieldLabel">{t("bookingPage.devotee.email")}</span>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder={t("bookingPage.devotee.emailPlaceholder")}
                      autoComplete="email"
                      required
                      className="bookingInput"
                    />
                  </label>
                </div>
              </section>

              {/* STEP 4: DATE, TIME AND LOCATION */}
              <section className="rounded-[28px] border border-[#eee4dc] bg-white p-5 shadow-[0_10px_30px_rgba(55,35,15,0.04)] sm:p-6">
                <SectionTitle
                  step="4"
                  icon={Calendar}
                  title={t("bookingPage.schedule.title")}
                  description={t("bookingPage.schedule.description")}
                />

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="fieldLabel">{t("bookingPage.schedule.preferredDate")}</span>
                    <input
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      className="bookingInput"
                    />
                  </label>

                  <label>
                    <span className="fieldLabel">{t("bookingPage.schedule.preferredTime")}</span>
                    <select
                      name="timeSlot"
                      value={form.timeSlot}
                      onChange={handleChange}
                      required
                      className="bookingInput"
                    >
                      <option value="">
                        {t(
                          "bookingPage.schedule.selectTime"
                        )}
                      </option>
                      <option value="Morning (6 AM - 10 AM)">
                        {t(
                          "bookingPage.schedule.morning"
                        )}
                      </option>
                      <option value="Afternoon (10 AM - 2 PM)">
                        {t(
                          "bookingPage.schedule.afternoon"
                        )}
                      </option>
                      <option value="Evening (2 PM - 6 PM)">
                        {t(
                          "bookingPage.schedule.evening"
                        )}
                      </option>
                      <option value="Night (After 6 PM)">
                        {t(
                          "bookingPage.schedule.night"
                        )}
                      </option>
                    </select>
                  </label>

                  {pujaType === "offline" && (
                    <>
                      <label>
                        <span className="fieldLabel">{t("bookingPage.schedule.city")}</span>
                        <input
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          placeholder={t("bookingPage.schedule.cityPlaceholder")}
                          autoComplete="address-level2"
                          required
                          className="bookingInput"
                        />
                      </label>

                      <label>
                        <span className="fieldLabel">{t("bookingPage.schedule.address")}</span>
                        <input
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          placeholder={t("bookingPage.schedule.addressPlaceholder")}
                          autoComplete="street-address"
                          required
                          className="bookingInput"
                        />
                      </label>
                    </>
                  )}
                </div>

                {pujaType === "offline" && displayPuja?.travel && (
                  <div className="mt-4 flex items-start gap-3 rounded-2xl border border-orange-100 bg-[#fff9f4] p-4">
                    <MapPin
                      size={19}
                      className="mt-0.5 shrink-0 text-[#a8441b]"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#302923]">
                        {t("bookingPage.schedule.travelTitle")}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {t(
                          "bookingPage.schedule.withinCity"
                        )}:{" "}
                        {displayPuja.travel.city ||
                          t(
                            "bookingPage.schedule.asListed"
                          )}
                        .{" "}
                        {t(
                          "bookingPage.schedule.outsideCityNote"
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {pujaType === "online" && (
                  <div className="mt-4 flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50/60 p-4">
                    <Video
                      size={19}
                      className="mt-0.5 shrink-0 text-green-700"
                    />
                    <div>
                      <p className="text-sm font-bold text-green-900">
                        {t("bookingPage.schedule.videoTitle")}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-green-700">
                        {t(
                          "bookingPage.schedule.videoDescription"
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* ONLINE PAYMENT */}
              {pujaType === "online" && (
                <section className="optionReveal overflow-hidden rounded-[28px] border border-orange-100 bg-gradient-to-br from-[#fffaf6] to-[#fff1e8] shadow-[0_12px_35px_rgba(168,68,27,0.08)]">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-orange-100 px-5 py-5 sm:px-6">
                    <SectionTitle
                      icon={CreditCard}
                      title={t("bookingPage.payment.title")}
                      description={t("bookingPage.payment.description")}
                    />

                    <div className="rounded-full bg-[#a8441b] px-4 py-2 text-sm font-bold text-white">
                      {totalPriceText}
                    </div>
                  </div>

                  <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[190px_1fr]">
                    <div className="mx-auto w-fit rounded-[24px] bg-white p-3 shadow-sm lg:mx-0">
                      <img
                        src="/paytmQr.jpeg"
                        alt={t("bookingPage.payment.qrAlt")}
                        className="h-40 w-40 object-contain"
                      />
                    </div>

                    <div>
                      <div className="rounded-2xl border border-orange-100 bg-white p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {t("bookingPage.payment.upiId")}
                        </p>
                        <p className="mt-1 break-all text-lg font-extrabold text-[#a8441b]">
                          {UPI_ID}
                        </p>
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {[
                          t(
                            "bookingPage.payment.scanQr"
                          ),
                          `${t(
                            "bookingPage.payment.pay"
                          )} ${totalPriceText}`,
                          t(
                            "bookingPage.payment.saveTransaction"
                          ),
                          t(
                            "bookingPage.payment.submitVerification"
                          ),
                        ].map((step) => (
                          <div
                            key={step}
                            className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2.5 text-xs font-semibold text-gray-600"
                          >
                            <BadgeCheck
                              size={15}
                              className="shrink-0 text-green-600"
                            />
                            {step}
                          </div>
                        ))}
                      </div>

                      <label className="mt-4 block">
                        <span className="fieldLabel">
                          {t("bookingPage.payment.transactionId")}
                        </span>
                        <input
                          name="transactionId"
                          value={form.transactionId}
                          onChange={handleChange}
                          placeholder={t("bookingPage.payment.transactionPlaceholder")}
                          required
                          className="bookingInput"
                        />
                      </label>
                    </div>
                  </div>
                </section>
              )}

              {/* OPTIONAL NOTES */}
              <section className="rounded-[28px] border border-[#eee4dc] bg-white p-5 shadow-[0_10px_30px_rgba(55,35,15,0.04)] sm:p-6">
                <SectionTitle
                  icon={MessageSquare}
                  title={t("bookingPage.notes.title")}
                  description={t("bookingPage.notes.description")}
                />

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder={t("bookingPage.notes.placeholder")}
                  className="bookingInput mt-5 resize-none"
                />
              </section>

              {/* PRICE SUMMARY */}
              <section className="rounded-[28px] border border-[#d6e7dc] bg-gradient-to-br from-[#eef8f2] via-[#f7fbf8] to-[#fff9ef] p-5 text-[#183b30] shadow-[0_14px_36px_rgba(38,86,63,0.10)] sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4e7f68]">
                      {t("bookingPage.price.eyebrow")}
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-[#17392f]">
                      {t("bookingPage.price.title")}
                    </h3>
                  </div>

                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#2f7557] shadow-sm">
                    <ReceiptText size={21} />
                  </span>
                </div>

                <div className="mt-4 divide-y divide-[#d8e9df] rounded-[20px] border border-white/80 bg-white/65 px-4">
                  <div className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span className="text-[#5f756b]">
                      {pujaType === "online"
                        ? t(
                            "bookingPage.price.onlinePuja"
                          )
                        : pujaType === "offline"
                        ? t(
                            "bookingPage.price.homeVisit"
                          )
                        : t(
                            "bookingPage.price.service"
                          )}
                    </span>
                    <span className="font-bold text-[#17392f]">
                      {basePriceText}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span className="text-[#5f756b]">
                      {t("bookingPage.price.samagri")}
                    </span>
                    <span className="font-bold text-[#17392f]">
                      {samagriPriceText}
                    </span>
                  </div>

                  {pujaType === "offline" && (
                    <div className="flex items-center justify-between gap-4 py-3 text-sm">
                      <span className="text-[#5f756b]">
                        {t("bookingPage.price.outsideTravel")}
                      </span>
                      <span className="font-bold text-[#7a6541]">
                        {t("bookingPage.price.ifApplicable")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between gap-4 rounded-[20px] bg-[#173f32] px-4 py-4 text-white shadow-[0_10px_24px_rgba(23,63,50,0.18)]">
                  <div>
                    <p className="text-[11px] text-white/65">
                      {pujaType === "online"
                        ? t(
                            "bookingPage.price.payableNow"
                          )
                        : t(
                            "bookingPage.price.estimatedTotal"
                          )}
                    </p>
                    <p className="mt-1 text-2xl font-extrabold sm:text-3xl">
                      {totalPriceText}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#d8f1e4]">
                    <ShieldCheck size={15} />
                    {t("bookingPage.price.secure")}
                  </div>
                </div>

                {pujaType === "offline" && (
                  <p className="mt-3 text-[11px] leading-5 text-[#698075]">
                    {t(
                      "bookingPage.price.travelNote"
                    )}
                  </p>
                )}
              </section>

              {/* HELPFUL ACCORDIONS */}
              <div className="space-y-3">
                {displayPuja?.includes?.length > 0 && (
                  <AccordionCard
                    icon={CheckCircle2}
                    eyebrow={t("bookingPage.accordions.serviceEyebrow")}
                    title={t("bookingPage.accordions.includesTitle")}
                    open={openIncludes}
                    onToggle={() => setOpenIncludes((value) => !value)}
                  >
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {displayPuja.includes.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-2.5 rounded-xl border border-green-100 bg-white p-3"
                        >
                          <CheckCircle2
                            size={16}
                            className="mt-0.5 shrink-0 text-green-600"
                          />
                          <span className="text-xs font-medium leading-5 text-gray-600 sm:text-sm">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </AccordionCard>
                )}

                {displayPuja?.samagri?.items?.length > 0 && (
                  <AccordionCard
                    icon={Gift}
                    eyebrow={t("bookingPage.accordions.itemsEyebrow")}
                    title={t("bookingPage.accordions.itemsTitle")}
                    open={openSamagriList}
                    onToggle={() => setOpenSamagriList((value) => !value)}
                  >
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {displayPuja.samagri.items.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 rounded-xl border border-orange-100 bg-white px-3 py-2.5"
                        >
                          <BadgeCheck
                            size={14}
                            className="shrink-0 text-[#a8441b]"
                          />
                          <span className="truncate text-xs font-semibold text-gray-600">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>

                    {displayPuja.samagri.note && (
                      <p className="mt-4 rounded-xl bg-orange-50 p-3 text-xs leading-5 text-gray-500">
                        {displayPuja.samagri.note}
                      </p>
                    )}
                  </AccordionCard>
                )}

                {displayPuja?.benefits?.length > 0 && (
                  <AccordionCard
                    icon={HeartHandshake}
                    eyebrow={t("bookingPage.accordions.benefitsEyebrow")}
                    title={t("bookingPage.accordions.benefitsTitle")}
                    open={openBenefits}
                    onToggle={() => setOpenBenefits((value) => !value)}
                  >
                    <div className="space-y-2.5">
                      {displayPuja.benefits.slice(0, 8).map((benefit) => (
                        <div
                          key={benefit}
                          className="flex items-start gap-3 rounded-xl bg-white p-3"
                        >
                          <Sparkles
                            size={16}
                            className="mt-0.5 shrink-0 text-[#a8441b]"
                          />
                          <span className="text-sm leading-6 text-gray-600">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </AccordionCard>
                )}

                <AccordionCard
                  icon={ClipboardList}
                  eyebrow={t("bookingPage.accordions.processEyebrow")}
                  title={t("bookingPage.accordions.processTitle")}
                  open={openProcess}
                  onToggle={() => setOpenProcess((value) => !value)}
                >
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      {
                        title: t(
                          "bookingPage.process.submit"
                        ),
                        description: t(
                          "bookingPage.process.submitDescription"
                        ),
                      },
                      {
                        title: t(
                          "bookingPage.process.verify"
                        ),
                        description: t(
                          "bookingPage.process.verifyDescription"
                        ),
                      },
                      {
                        title: t(
                          "bookingPage.process.confirm"
                        ),
                        description: t(
                          "bookingPage.process.confirmDescription"
                        ),
                      },
                      {
                        title: t(
                          "bookingPage.process.puja"
                        ),
                        description: t(
                          "bookingPage.process.pujaDescription"
                        ),
                      },
                    ].map((step, index) => (
                      <div
                        key={step.title}
                        className="rounded-2xl border border-[#eee5dd] bg-white p-4 text-center"
                      >
                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#a8441b] text-sm font-bold text-white">
                          {index + 1}
                        </div>
                        <h4 className="mt-3 text-sm font-bold text-[#252525]">
                          {step.title}
                        </h4>
                        <p className="mt-1 text-[11px] leading-5 text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionCard>
              </div>

              {/* CONFIRMATION */}
              <section className="rounded-[24px] border border-[#eee4dc] bg-white p-4 sm:p-5">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 shrink-0 accent-[#a8441b]"
                  />
                  <span className="text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
                    {t(
                      "bookingPage.confirmation"
                    )}
                  </span>
                </label>
              </section>

              {sent && (
                <div className="rounded-[24px] border border-green-200 bg-green-50 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                      <BadgeCheck size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-900">
                        {t("bookingPage.success.title")}
                      </h3>
                      <p className="mt-1 text-sm text-green-700">
                        {t("bookingPage.success.description")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !pujaType}
                className="hidden min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[#a8441b] px-6 text-sm font-bold text-white shadow-[0_12px_28px_rgba(168,68,27,0.22)] transition hover:bg-[#8d3816] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t("bookingPage.actions.processing")}
                  </>
                ) : (
                  <>
                    {pujaType === "online"
                      ? `${t(
                          "bookingPage.actions.pay"
                        )} ${totalPriceText} ${t(
                          "bookingPage.actions.andSubmit"
                        )}`
                      : pujaType === "offline"
                      ? `${t(
                          "bookingPage.actions.requestBooking"
                        )} • ${totalPriceText}`
                      : t(
                          "bookingPage.actions.selectMode"
                        )}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY CTA */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#eadfd7] bg-white/95 px-4 pt-3 shadow-[0_-10px_30px_rgba(55,35,15,0.08)] backdrop-blur-lg lg:hidden"
        style={{
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
        }}
      >
        <div className="mx-auto flex max-w-[680px] items-center gap-3">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
              {t("bookingPage.actions.total")}
            </p>
            <p className="truncate text-lg font-extrabold text-[#a8441b]">
              {totalPriceText}
            </p>
          </div>

          <button
            type="submit"
            form="pujaBookingForm"
            disabled={loading || !pujaType}
            className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-[#a8441b] px-5 text-sm font-bold text-white transition active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                {pujaType === "online"
                  ? t(
                      "bookingPage.actions.paySubmit"
                    )
                  : pujaType === "offline"
                  ? t(
                      "bookingPage.actions.requestBooking"
                    )
                  : t(
                      "bookingPage.actions.selectMode"
                    )}
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .fieldLabel {
          display: block;
          margin-bottom: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #766b65;
        }

        .bookingHindi .fieldLabel {
          letter-spacing: 0.03em;
          text-transform: none;
        }

        .bookingInput {
          width: 100%;
          min-height: 54px;
          border: 1px solid #e7dcd4;
          border-radius: 16px;
          padding: 0 16px;
          font-size: 14px;
          color: #252525;
          background: #fffaf7;
          outline: none;
          transition: all 0.25s ease;
        }

        textarea.bookingInput {
          min-height: 125px;
          padding: 15px 16px;
          line-height: 1.6;
        }

        select.bookingInput {
          cursor: pointer;
        }

        .bookingInput::placeholder {
          color: #aaa09a;
        }

        .bookingInput:hover {
          border-color: #d6bfae;
          background: #ffffff;
        }

        .bookingInput:focus {
          border-color: #a8441b;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(168, 68, 27, 0.08);
        }

        .optionReveal,
        .accordionBody {
          animation: optionReveal 0.32s ease both;
        }

        @keyframes optionReveal {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#fffdfb]">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#a8441b] border-t-transparent" />
        </div>
      }
    >
      <BookingForm />
    </Suspense>
  );
}