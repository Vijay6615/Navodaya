"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  ArrowRight,
  CalendarDays,
  X,
  UserRound,
  Phone,
  Mail,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Clock3,
  Tag,
  CheckCircle2,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

const displayFont = {
  className: "font-display-en",
};

const hindiDisplayFont = {
  className: "font-display-hi",
};

// ================= EVENTS =================
// Add your own event objects inside each month array.
// Required fields: img, key, title, desc, date. offer is optional.

const EVENTS = {
  November: [
    {
      img: "/images/chhath.png",
      key: "chhathPuja",
      title: "Chhath Puja Special",
      desc: "Offer prayers to Lord Surya and Chhathi Maiya through sacred rituals and Arghya. Seek blessings for health, happiness and family prosperity.",
      offer: "Free Consulation",
      date: "2026-11-15",
    },
    {
      img: "/images/devutthana-ekadashi.png",
      key: "devutthanaEkadashi",
      title: "Devutthana Ekadashi Puja",
      desc: "Worship Lord Vishnu on this sacred Ekadashi. Invite peace, prosperity and divine blessings into your home.",
      offer: "10% OFF",
      date: "2026-11-20",
    },
    {
      img: "/images/tulsi-vivah.png",
      key: "tulsiVivah",
      title: "Tulsi Vivah Special Puja",
      desc: "Celebrate the divine marriage of Goddess Tulsi and Lord Vishnu. Pray for marital harmony, happiness and family well-being.",
      offer: "Special Puja Booking",
      date: "2026-11-21",
    },
    {
      img: "/images/dev-diwali.png",
      key: "devDiwali",
      title: "Dev Diwali & Kartik Purnima",
      desc: "Celebrate the divine festival of lights with Deep Daan and sacred prayers. Seek blessings for peace, prosperity and spiritual growth.",
      offer: "Special Puja Booking",
      date: "2026-11-24",
    },
  ],
  December: [
    // Add December events here
  ],
  January: [
    // Add January events here

    {
      img: "/images/lohri.png",
      key: "Lohri",
      title: "Lohri Special Puja",
      desc: "A traditional harvest festival celebrated with bonfires, prayers, folk songs and offerings. Seek blessings for prosperity, health and happiness.",
      offer: "10% OFF",
      date: "2027-01-14",
    },
    {
      img: "/images/sankranti.png",
      key: "MakarSankranti",
      title: "Makar Sankranti Special Puja",
      desc: "Devotees worship Lord Surya, take holy baths and perform charity to welcome Uttarayan. Seek blessings for health, wealth and spiritual growth.",
      offer: "Free Consulation",
      date: "2027-01-15",
    },
    {
      img: "/images/satyanarayan.jpg",
      key: "Satyanarayan",
      title: "Satyanarayan Special Puja",
      desc: "Devotees worship Lord Vishnu, perform Satyanarayan Katha and seek peace and prosperity.",
      offer: "Special Puja Booking",
      date: "2027-01-22",
    },
    
  ],
};

// Example event object to paste into any month array:
// {
//   img: "/images/your-event-image.jpg",
//   key: "yourUniqueEventKey",
//   title: "Your Puja Title",
//   desc: "Short description of the puja and its benefits.",
//   offer: "Special Offer", // optional
//   date: "2026-11-15",
// }
const months = Object.keys(EVENTS);

function getEventText(t, event, field) {
  if (!event) {
    return "";
  }

  return t(
    `events.items.${event.key}.${field}`,
    event[field] || ""
  );
}

// ================= COUNTDOWN =================

function Countdown({ date }) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    function updateTimer() {
      const diff = new Date(date).getTime() - Date.now();

      if (diff <= 0) {
        setTimeLeft({ expired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (diff / (1000 * 60 * 60)) % 24
        ),
        mins: Math.floor((diff / 1000 / 60) % 60),
      });
    }

    updateTimer();

    const interval = setInterval(updateTimer, 60_000);

    return () => clearInterval(interval);
  }, [date]);

  if (timeLeft.expired) {
    return (
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#9b5b4c]">
        {t("events.eventCompleted")}
      </p>
    );
  }

  const items = [
    {
      value: timeLeft.days ?? 0,
      label: t("events.days"),
    },
    {
      value: timeLeft.hours ?? 0,
      label: t("events.hours"),
    },
    {
      value: timeLeft.mins ?? 0,
      label: t("events.minutes"),
    },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-5">
      {items.map((item, index) => (
        <div
          key={item.label}
          className="flex items-center gap-2 sm:gap-5"
        >
          <div>
            <p className="font-serif text-[20px] text-[#342925] sm:text-[24px]">
              {String(item.value).padStart(2, "0")}
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#9a8d86]">
              {item.label}
            </p>
          </div>

          {index !== items.length - 1 && (
            <span className="text-[#c9bdb6]">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ================= MAIN =================

export default function MonthlyEventsSection() {
  const router = useRouter();

  const { data: session, status } = useSession();
  const { language, t } = useLanguage();

  const dateLocale =
    language === "hi" ? "hi-IN" : "en-IN";

  const headingFontClass =
    language === "hi"
      ? hindiDisplayFont.className
      : displayFont.className;

  const [month, setMonth] = useState("November");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const [showLogin, setShowLogin] = useState(false);

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    timeSlot: "Flexible",
    message: "",
  });

  const selectedEvents = EVENTS[month];

  // ================= USER DETAILS =================

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    setForm((prev) => ({
      ...prev,

      name:
        prev.name ||
        session.user.name ||
        "",

      email:
        prev.email ||
        session.user.email ||
        "",
    }));
  }, [session]);

  // ================= BODY SCROLL =================

  useEffect(() => {
    if (!selectedEvent && !showLogin) {
      return;
    }

    const oldOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        oldOverflow;
    };
  }, [selectedEvent, showLogin]);

  // ================= BOOK BUTTON =================

  const openBooking = (event) => {
    setSelectedEvent(event);
    setSuccess(false);
    setError("");
  };

  // ================= INPUT =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  // ================= SUBMIT BOOKING =================

  const submitBooking = async (e) => {
    e.preventDefault();

    if (!selectedEvent || status === "loading") {
      return;
    }

    if (!session?.user) {
      setSelectedEvent(null);
      setShowLogin(true);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const slug = selectedEvent.title
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const completeAddress = [form.address, form.city]
        .map((value) => String(value || "").trim())
        .filter(Boolean)
        .join(", ");

      const bookingPayload = {
        bookingSource: "special_event",
        bookingCategory: "Monthly Vedic Event",

        eventTitle: selectedEvent.title,
        eventDate: selectedEvent.date,
        eventMonth: month,
        eventOffer: selectedEvent.offer || "",
        eventImage: selectedEvent.img,

        pujaName: selectedEvent.title,
        pujaSlug: slug,
        pujaType: "Offline Puja",

        basePrice: "Price to be confirmed",
        price: "Price to be confirmed",
        totalPrice: "Price to be confirmed",

        date: selectedEvent.date,
        timeSlot: form.timeSlot || "Flexible",

        name: form.name.trim(),
        customerName: form.name.trim(),
        customerEmail: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        address: completeAddress,

        samagriOption:
          "Samagri arrangement will be confirmed by Pandit Ji",
        samagriProvidedBy: "To be confirmed",
        samagriCharge: "To be confirmed",
        samagriItems: [],

        message: form.message.trim(),

        transactionId: "Pay on service",
        paymentStatus: "pay_on_service",
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingPayload),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        if (response.status === 401) {
          setSelectedEvent(null);
          setShowLogin(true);
          return;
        }

        throw new Error(
          data?.message ||
            data?.error ||
            t("events.bookingFailed")
        );
      }

      if (typeof window !== "undefined") {
        try {
          const existingBookings = JSON.parse(
            localStorage.getItem("local_puja_bookings") || "[]"
          );

          const savedBooking = {
            ...bookingPayload,
            _id: data.bookingId,
            bookingId: data.bookingId,
            email: session.user.email,
            userEmail: session.user.email,
            userName:
              session.user.name || bookingPayload.name,
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const withoutDuplicate = existingBookings.filter(
            (booking) =>
              booking.bookingId !== savedBooking.bookingId &&
              booking._id !== savedBooking._id
          );

          withoutDuplicate.unshift(savedBooking);

          localStorage.setItem(
            "local_puja_bookings",
            JSON.stringify(withoutDuplicate)
          );
          localStorage.setItem("just_booked_trigger", "true");
        } catch (storageError) {
          console.warn(
            "Local booking backup failed:",
            storageError
          );
        }
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/my-bookings?tab=puja");
      }, 1200);
    } catch (error) {
      console.error("EVENT BOOKING ERROR:", error);

      setError(
        error?.message ||
          t("events.bookingFailedRetry")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="relative w-full overflow-hidden bg-[#fcf8f4] px-4 py-14 md:px-6 md:py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,_rgba(221,185,157,0.18),_transparent_68%)]" />

        <div className="relative mx-auto max-w-6xl">

          {/* PREMIUM HEADER */}
          <div className="relative mb-12 overflow-hidden rounded-[30px] border border-[#ead9cb] bg-[radial-gradient(circle_at_top_left,_#fff5e9,_transparent_48%),linear-gradient(135deg,#fffaf5_0%,#f5e9df_100%)] px-6 py-12 text-center shadow-[0_18px_55px_rgba(89,48,29,0.07)] md:mb-14 md:rounded-[38px] md:px-12 md:py-16">
            <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-[#c89b7e]/20 md:h-72 md:w-72" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full border border-[#c89b7e]/20" />
            <div className="relative">
          
              <h2 className={`${headingFontClass} text-[40px] leading-[1.12] text-[#30231e] md:text-[66px] ${language === "hi" ? "!leading-[1.3]" : ""}`}>
                {t("events.upcomingLine1")}
                <br />
                <span className="text-[#9a4329]">{t("events.upcomingLine2")}</span>
              </h2>
              <div className="mx-auto mt-7 flex max-w-xs items-center justify-center gap-3">
                <span className="h-px flex-1 bg-[#c9a58e]" />
                <span className="text-[15px] text-[#a66b4f]">✦</span>
                <span className="h-px flex-1 bg-[#c9a58e]" />
              </div>
            </div>
          </div>

          {/* MONTH NAVIGATION */}
          <div className="mb-12 flex justify-center md:mb-14">
            <div className="inline-flex w-full max-w-[660px] gap-2 rounded-2xl border border-[#eadfd6] bg-white/80 p-2 shadow-[0_10px_30px_rgba(72,43,29,0.06)] backdrop-blur-sm">
              {months.map((m, index) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonth(m)}
                  aria-pressed={month === m}
                  className={`relative flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-2 py-3.5 transition-all duration-300 md:py-4 ${
                    month === m
                      ? "bg-[#87351f] text-white shadow-[0_8px_18px_rgba(135,53,31,0.22)]"
                      : "text-[#6e5b50] hover:bg-[#f8eee7]"
                  }`}
                >
                  <span className={`mb-1 text-[8px] font-semibold uppercase tracking-[0.2em] ${month === m ? "text-white/65" : "text-[#b08c78]"}`}>
                    202{index === 2 ? "7" : "6"}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] md:text-[12px] md:tracking-[0.18em]">
                    {t(`events.months.${m.toLowerCase()}`, m)}
                  </span>
                  {month === m && <span className="mt-2 h-1 w-5 rounded-full bg-[#f0c9a8]" />}
                </button>
              ))}
            </div>
          </div>

          {/* EMPTY MONTH */}
          {selectedEvents.length === 0 && (
            <div className="relative overflow-hidden rounded-[28px] border border-dashed border-[#d9c3b4] bg-[linear-gradient(135deg,#fffaf6,#f8eee7)] px-6 py-16 text-center md:py-20">
              <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#ead6c7]/30 blur-2xl" />
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e5cdbb] bg-white text-[#9a4b31] shadow-sm">
                <CalendarDays size={27} strokeWidth={1.4} />
              </div>
              <p className="relative mt-6 text-[9px] font-bold uppercase tracking-[0.28em] text-[#a36a50]">
                {t(`events.months.${month.toLowerCase()}`, month)} · {month === "January" ? "2027" : "2026"}
              </p>
              <h3 className={`${headingFontClass} relative mt-3 text-3xl text-[#34251f] md:text-[40px]`}>
                {t("events.noEventsTitle")}
              </h3>
              <p className="relative mx-auto mt-3 max-w-md text-[13px] leading-7 text-[#84736a]">
                {t("events.noEventsDescription")}
              </p>
              <div className="relative mx-auto mt-7 h-px w-16 bg-[#c99c7e]" />
            </div>
          )}

          {/* EVENT COLLECTION */}
          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:gap-8">
            {selectedEvents.map((event, i) => {
              const expired = new Date(event.date).getTime() < Date.now();

              return (
                <article
                  key={event.key || i}
                  className="group relative overflow-hidden rounded-[26px] border border-[#eadfd7] bg-white shadow-[0_12px_36px_rgba(67,41,25,0.07)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(67,41,25,0.13)] md:rounded-[30px]"
                  style={{ contentVisibility: "auto", containIntrinsicSize: "760px" }}
                >
                  {/* IMAGE */}
                  <div className="relative h-[230px] overflow-hidden bg-[#efe3da] xs:h-[260px] sm:h-[300px] md:h-[320px] lg:h-[340px]">
                    <Image
                      src={event.img}
                      alt={getEventText(t, event, "title")}
                      fill
                      loading="lazy"
                      quality={80}
                      sizes="(max-width: 767px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[1400ms] group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#21130e]/65 via-transparent to-black/10" />
                    <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/30 bg-black/25 px-3.5 py-2 text-white backdrop-blur-md">
                      <CalendarDays size={13} />
                      <span className="text-[9px] font-semibold uppercase tracking-[0.17em]">
                        {new Date(event.date).toLocaleDateString(dateLocale, { day: "2-digit", month: "long", year: "numeric" })}
                      </span>
                    </div>
                    {event.offer && (
                      <div className="absolute right-5 top-5 max-w-[75%] rounded-full border border-white/60 bg-[#fffaf4]/95 px-4 py-2 shadow-lg backdrop-blur-sm">
                        <p className="text-[8px] font-extrabold uppercase tracking-[0.13em] text-[#87351f] md:text-[9px]">
                          {getEventText(t, event, "offer")}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 sm:p-7 md:p-8">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-px w-7 bg-[#b77b5e]" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#a36b51]">
                        {t(`events.months.${month.toLowerCase()}`, month)} · {month === "January" ? "2027" : "2026"}
                      </span>
                    </div>
                    <h3 className={`${headingFontClass} text-[29px] leading-[1.16] text-[#30231e] transition-colors duration-300 group-hover:text-[#8f3c25] md:text-[36px] ${language === "hi" ? "!leading-[1.35]" : ""}`}>
                      {getEventText(t, event, "title")}
                    </h3>
                    <p className="mt-4 min-h-[84px] max-w-xl text-[13px] leading-[1.9] text-[#77685f] md:text-[14px]">
                      {getEventText(t, event, "desc")}
                    </p>
                    <div className="my-6 h-px bg-gradient-to-r from-[#d9b49b] via-[#eee4dc] to-transparent" />
                    <div className="flex min-h-[46px] flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                      <div className="min-w-0 sm:flex-1">
                        <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.2em] text-[#a18d80]">{t("events.countdownLabel", "Event begins in")}</p>
                        <Countdown date={event.date} />
                      </div>
                      <button
                        type="button"
                        disabled={expired || status === "loading"}
                        onClick={() => openBooking(event)}
                        className={`inline-flex w-full shrink-0 items-center justify-center gap-3 rounded-full px-5 py-3.5 text-[9px] font-bold uppercase tracking-[0.12em] transition-all duration-300 sm:w-auto sm:px-6 sm:py-3 md:text-[10px] ${
                          expired
                            ? "cursor-not-allowed bg-[#e8e1dc] text-[#95877e]"
                            : "bg-[#87351f] text-white shadow-[0_8px_18px_rgba(135,53,31,0.18)] hover:bg-[#692715] hover:shadow-[0_12px_24px_rgba(135,53,31,0.25)]"
                        }`}
                      >
                        {expired ? t("events.eventClosed") : status === "loading" ? t("events.pleaseWait") : t("events.bookPuja")}
                        {!expired && status !== "loading" && <ArrowRight size={14} />}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

        </div>

      </section>

      {/* ================= LOGIN POPUP ================= */}

      {mounted &&
        showLogin &&
        createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-[3px]"
          onClick={() => setShowLogin(false)}
        >

          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 rounded-t-[30px] bg-white px-7 pb-10 pt-5 shadow-2xl md:bottom-auto md:right-auto md:top-0 md:h-full md:w-[480px] md:rounded-none md:px-12 md:py-10"
          >

            <div className="flex justify-end">

              <button
                type="button"
                onClick={() =>
                  setShowLogin(false)
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eee5df] text-[#8f321c]"
              >
                <X size={18} />
              </button>

            </div>

            <div className="mx-auto mt-4 max-w-[350px] text-center md:mt-20">

              <img
                src="/Pujadhamlogo1.png"
                alt="Puja Dham"
                loading="lazy"
                decoding="async"
                className="mx-auto h-[75px] w-auto object-contain"
              />

              <p className="mt-8 text-[10px] uppercase tracking-[0.25em] text-[#a85c43]">
                {t("events.mantraLine")}
              </p>

              <h2
                className={`${headingFontClass} mt-4 text-[35px] text-[#2c2421] ${
                  language === "hi"
                    ? "leading-[1.35]"
                    : "leading-tight"
                }`}
              >
                {t("events.loginTitle")}
              </h2>

              <p className="mt-4 text-[13px] leading-6 text-[#81756f]">
                {t("events.loginDescription")}
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/login")
                }
                className="mt-9 h-[54px] w-full bg-[#8f321c] text-[11px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#762814]"
              >
                {t("events.loginContinue")}
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push("/login")
                }
                className="mt-3 h-[54px] w-full border border-[#ddd3cd] bg-white text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6c4c3d] transition hover:bg-[#fff8f4]"
              >
                {t("events.createAccount")}
              </button>

              <div className="mt-7 flex items-center justify-center gap-2 text-[10px] text-[#9a8d86]">

                <ShieldCheck size={14} />

                {t("events.secureAccess")}

              </div>

            </div>

          </div>

        </div>,
        document.body
      )}

      {/* ================= BOOKING FORM ================= */}

      {mounted &&
        selectedEvent &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#f5f1ed]"
            onClick={() => {
              if (!loading) setSelectedEvent(null);
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="event-booking-panel relative h-[100dvh] w-full overflow-hidden bg-white"
            >
              <button
                type="button"
                aria-label={t("events.closeBookingForm")}
                onClick={() => {
                  if (!loading) setSelectedEvent(null);
                }}
                className="fixed right-3 top-3 z-[100] flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfd8] bg-white text-[#8f321c] shadow-md transition active:scale-95 md:absolute md:right-7 md:top-7 md:h-11 md:w-11"
              >
                <X size={19} />
              </button>

              <div className="grid h-full w-full md:grid-cols-[42%_58%]">
                {/* LEFT VISUAL - DESKTOP */}
                <div className="relative hidden h-full overflow-hidden md:block">
                  <Image
                    src={selectedEvent.img}
                    alt={getEventText(t, selectedEvent, "title")}
                    fill
                    priority
                    sizes="42vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                  <div className="absolute bottom-0 left-0 right-0 p-9 lg:p-14">
                    <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-orange-100 backdrop-blur-md">
                      {t("events.specialOfflinePuja")}
                    </span>

                    <h3
                      className={`${headingFontClass} mt-5 max-w-xl text-[38px] text-white lg:text-[50px] ${
                        language === "hi"
                          ? "leading-[1.28]"
                          : "leading-[1.05]"
                      }`}
                    >
                      {getEventText(
                        t,
                        selectedEvent,
                        "title"
                      )}
                    </h3>

                    <p className="mt-4 max-w-xl text-xs leading-6 text-white/70">
                      {t("events.arrangementDescription")}
                    </p>

                    <div className="mt-7 grid grid-cols-2 gap-3 border-t border-white/25 pt-6">
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/50">
                          {t("events.sacredDate")}
                        </p>
                        <p className="mt-2 text-[13px] font-semibold text-white">
                          {new Date(selectedEvent.date).toLocaleDateString(
                            dateLocale,
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/50">
                          {t("events.bookingPrice")}
                        </p>
                        <p className="mt-2 text-[13px] font-semibold text-white">
                          {t("events.toBeConfirmed")}
                        </p>
                      </div>
                    </div>

                    {selectedEvent.offer && (
                      <div className="mt-4 flex items-start gap-2 rounded-2xl border border-white/20 bg-white/10 p-3 text-[10px] leading-5 text-white/80 backdrop-blur-md">
                        <Tag size={14} className="mt-0.5 shrink-0" />
                        {getEventText(t, selectedEvent, "offer")}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT FORM - SCROLLABLE ON MOBILE */}
                <div className="h-full min-h-0 overflow-y-auto overscroll-contain bg-[#fbf8f5] px-4 pb-10 pt-16 sm:px-6 md:bg-white md:px-10 md:py-8 lg:px-14">
                  <div className="mx-auto w-full max-w-[640px]">
                    <div className="rounded-[26px] border border-[#eadfd7] bg-white p-4 shadow-[0_14px_40px_rgba(67,41,25,0.07)] sm:p-6 md:border-0 md:p-0 md:shadow-none">
                      <div className="text-center">
                        <img
                          src="/Pujadhamlogo1.png"
                          alt="Puja Dham"
                          loading="lazy"
                          decoding="async"
                          className="mx-auto h-[48px] w-auto object-contain sm:h-[56px] md:h-[64px]"
                        />

                        <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.22em] text-[#a85c43]">
                          {t("events.specialEventBooking")}
                        </p>

                        <h2
                          className={`${headingFontClass} mt-2 text-[29px] text-[#2c2421] sm:text-[36px] md:text-[44px] ${
                            language === "hi"
                              ? "leading-[1.3]"
                              : "leading-[1.05]"
                          }`}
                        >
                          {t("events.bookYour")}{" "}
                          <span className="text-[#9a3f2b]">
                            {t("events.specialPuja")}
                          </span>
                        </h2>

                        <p className="mx-auto mt-2 max-w-[500px] text-[11px] leading-5 text-[#81756f] md:text-xs">
                          {t("events.bookingIntro")}
                        </p>
                      </div>

                      {/* MOBILE EVENT SUMMARY */}
                      <div className="mt-4 overflow-hidden rounded-[20px] border border-[#eadfd7] bg-[#fffaf7] md:hidden">
                        <div className="flex gap-3 p-3">
                          <Image
                            src={selectedEvent.img}
                            alt={getEventText(t, selectedEvent, "title")}
                            width={76}
                            height={76}
                            loading="lazy"
                            quality={72}
                            sizes="76px"
                            className="h-[76px] w-[76px] shrink-0 rounded-[15px] object-cover"
                          />

                          <div className="min-w-0 flex-1">
                            <p
                              className={`${headingFontClass} line-clamp-2 text-[17px] font-semibold text-[#342925] ${
                                language === "hi"
                                  ? "leading-6"
                                  : "leading-5"
                              }`}
                            >
                              {getEventText(
                                t,
                                selectedEvent,
                                "title"
                              )}
                            </p>

                            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#7c6f68]">
                              <CalendarDays
                                size={12}
                                className="shrink-0 text-[#9a3f2b]"
                              />
                              {new Date(
                                selectedEvent.date
                              ).toLocaleDateString(dateLocale, {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>

                            <p className="mt-1 text-[10px] font-bold text-[#8f321c]">
                              {t("events.priceToBeConfirmed")}
                            </p>
                          </div>
                        </div>

                        {selectedEvent.offer && (
                          <div className="flex items-start gap-2 border-t border-[#eee1d9] bg-white px-3 py-2.5 text-[9px] leading-4 text-[#8f5b43]">
                            <Tag
                              size={12}
                              className="mt-0.5 shrink-0"
                            />
                            {getEventText(t, selectedEvent, "offer")}
                          </div>
                        )}
                      </div>

                      <form
                        onSubmit={submitBooking}
                        className="mt-5 space-y-4"
                      >
                        <FormField
                          label={t("events.fullName")}
                          required
                          icon={<UserRound size={16} />}
                        >
                          <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder={t("events.namePlaceholder")}
                            required
                            autoComplete="name"
                            className="event-input"
                          />
                        </FormField>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FormField
                            label={t("events.phoneNumber")}
                            required
                            icon={<Phone size={16} />}
                          >
                            <input
                              name="phone"
                              type="tel"
                              value={form.phone}
                              onChange={handleChange}
                              placeholder={t("events.phonePlaceholder")}
                              required
                              inputMode="tel"
                              autoComplete="tel"
                              className="event-input"
                            />
                          </FormField>

                          <FormField
                            label={t("events.emailAddress")}
                            required
                            icon={<Mail size={16} />}
                          >
                            <input
                              name="email"
                              type="email"
                              value={form.email}
                              onChange={handleChange}
                              placeholder={t("events.emailPlaceholder")}
                              required
                              autoComplete="email"
                              className="event-input"
                            />
                          </FormField>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FormField
                            label={t("events.city")}
                            required
                            icon={<MapPin size={16} />}
                          >
                            <input
                              name="city"
                              value={form.city}
                              onChange={handleChange}
                              placeholder={t("events.cityPlaceholder")}
                              required
                              autoComplete="address-level2"
                              className="event-input"
                            />
                          </FormField>

                          <FormField
                            label={t("events.preferredTime")}
                            required
                            icon={<Clock3 size={16} />}
                          >
                            <select
                              name="timeSlot"
                              value={form.timeSlot}
                              onChange={handleChange}
                              required
                              className="event-input appearance-none"
                            >
                              <option value="Flexible">
                                {t("events.flexible")}
                              </option>
                              <option value="Morning">
                                {t("events.morning")}
                              </option>
                              <option value="Afternoon">
                                {t("events.afternoon")}
                              </option>
                              <option value="Evening">
                                {t("events.evening")}
                              </option>
                            </select>
                          </FormField>
                        </div>

                        <FormField
                          label={t("events.completeAddress")}
                          required
                          icon={<MapPin size={16} />}
                        >
                          <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder={t("events.addressPlaceholder")}
                            required
                            rows={3}
                            className="event-textarea"
                          />
                        </FormField>

                        <FormField
                          label={t("events.specialRequirement")}
                          icon={<MessageSquareText size={16} />}
                        >
                          <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder={t("events.requirementPlaceholder")}
                            rows={3}
                            className="event-textarea"
                          />
                        </FormField>

                        <div className="grid grid-cols-2 gap-2 rounded-[18px] border border-[#e7ece8] bg-[#f2f8f4] p-3">
                          <div>
                            <p className="text-[8px] font-bold uppercase tracking-wide text-[#718077]">
                              {t("events.eventDate")}
                            </p>
                            <p className="mt-1 text-[10px] font-bold text-[#30463a] sm:text-xs">
                              {new Date(
                                selectedEvent.date
                              ).toLocaleDateString(dateLocale, {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>

                          <div>
                            <p className="text-[8px] font-bold uppercase tracking-wide text-[#718077]">
                              {t("events.finalPrice")}
                            </p>
                            <p className="mt-1 text-[10px] font-bold text-[#30463a] sm:text-xs">
                              {t("events.panditWillConfirm")}
                            </p>
                          </div>
                        </div>

                        {error && (
                          <div className="rounded-[15px] border border-red-200 bg-red-50 px-3 py-3 text-center text-[11px] leading-5 text-red-700">
                            {error}
                          </div>
                        )}

                        {success && (
                          <div className="flex items-start gap-2 rounded-[15px] border border-green-200 bg-green-50 px-3 py-3 text-[11px] leading-5 text-green-700">
                            <CheckCircle2
                              size={16}
                              className="mt-0.5 shrink-0"
                            />
                            {t("events.bookingSaved")}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={loading || success}
                          className="flex min-h-[52px] w-full items-center justify-center gap-3 rounded-[16px] bg-[#8f321c] px-5 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_12px_28px_rgba(143,50,28,0.22)] transition hover:bg-[#762814] disabled:cursor-not-allowed disabled:opacity-60 md:min-h-[54px] md:text-[11px]"
                        >
                          {loading
                            ? t("events.bookingPuja")
                            : success
                            ? t("events.bookingConfirmed")
                            : t("events.confirmPujaBooking")}

                          {!loading && !success && (
                            <ArrowRight size={16} />
                          )}
                        </button>

                        <div className="flex items-start justify-center gap-2 px-2 pb-1 text-center text-[9px] leading-4 text-[#8c7f77]">
                          <ShieldCheck
                            size={13}
                            className="mt-0.5 shrink-0"
                          />
                          {t("events.offlineConfirmation")}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ================= INPUT STYLE ================= */}

      <style jsx global>{`
        @keyframes eventBookingSlideIn {
          from {
            transform: translateY(24px);
            opacity: 0;
          }

          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (min-width: 768px) {
          @keyframes eventBookingSlideIn {
            from {
              transform: translateX(-28px);
              opacity: 0;
            }

            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        }

        .event-booking-panel {
          animation: eventBookingSlideIn 0.38s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .event-input,
        .event-textarea {
          width: 100%;
          border: 1px solid #e7ded7;
          border-radius: 14px;
          background: #fffdfb;
          padding-left: 44px;
          padding-right: 14px;
          font-size: 13px;
          color: #342925;
          outline: none;
          transition: 0.22s ease;
        }

        .event-input {
          height: 50px;
        }

        .event-textarea {
          min-height: 88px;
          resize: vertical;
          padding-top: 14px;
          padding-bottom: 12px;
          line-height: 20px;
        }

        .event-input::placeholder,
        .event-textarea::placeholder {
          color: #aa9b92;
        }

        .event-input:focus,
        .event-textarea:focus {
          border-color: #b97b66;
          background: #ffffff;
          box-shadow: 0 0 0 4px
            rgba(185, 123, 102, 0.1);
        }

        @media (min-width: 768px) {
          .event-input {
            height: 52px;
          }

          .event-input,
          .event-textarea {
            font-size: 13px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .event-booking-panel {
            animation: none !important;
          }

          .event-input,
          .event-textarea {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}

function FormField({
  icon,
  label,
  required = false,
  children,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.14em] text-[#74675f]">
        {label}
        {required && (
          <span className="ml-1 text-[#a8441b]">*</span>
        )}
      </span>

      <span className="relative block">
        <span className="pointer-events-none absolute left-4 top-[17px] z-10 text-[#aa978c]">
          {icon}
        </span>
        {children}
      </span>
    </label>
  );
}