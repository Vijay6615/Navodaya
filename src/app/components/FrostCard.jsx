"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
} from "lucide-react";

// ================= EVENTS =================

const EVENTS = {
  August: [
    {
      img: "/images/LaghrudraAbhishek.jpg",
      title: "Sawan Shivratri, Maha Rudra Abhishek & Havan",
      desc: "Surya Dev arghya, daan and sacred grah shanti rituals for prosperity.",
      offer: "10% OFF this month",
      date: "2026-08-11",
    },
    {
      img: "/images/naappanchmi.png",
      title: "Nag Panchami Special Puja",
      desc: "Sacred mantra jaap performed with traditional Vedic vidhi.",
      offer: "10% OFF this month + Free Muhurat Consultation",
      date: "2026-08-17",
    },
  ],

  September: [
    {
      img: "/images/KrishnaJanmashtami.jpg",
      title: "Krishna Janmashtami Special Puja",
      desc: "Sacred mantra jaap performed with traditional Vedic vidhi.",
      offer: "10% OFF this month",
      date: "2026-09-04",
    },
    {
      img: "/images/GaneshVisarjan.jpg",
      title: "Ganesh Visarjan",
      desc: "Sacred mantra jaap performed with traditional Vedic vidhi.",
      offer: "10% OFF this month",
      date: "2026-09-25",
    },
    {
      img: "/images/ganesh-puja.jpg",
      title: "Ganesh Chaturthi Special Puja",
      desc: "Sacred mantra jaap performed with traditional Vedic vidhi.",
      offer: "10% OFF this month + Free Muhurat Consultation",
      date: "2026-09-14",
    },
    {
      img: "/images/PitraDoshNivaran.jpg",
      title: "Pitru Paksha Special Puja",
      desc: "Sacred mantra jaap performed with traditional Vedic vidhi.",
      offer: "10% OFF this month",
      date: "2026-09-26",
    },
  ],

  October: [],
};

const months = Object.keys(EVENTS);

// ================= COUNTDOWN =================

function Countdown({ date }) {
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

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [date]);

  if (timeLeft.expired) {
    return (
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#9b5b4c]">
        Event Completed
      </p>
    );
  }

  const items = [
    {
      value: timeLeft.days ?? 0,
      label: "Days",
    },
    {
      value: timeLeft.hours ?? 0,
      label: "Hours",
    },
    {
      value: timeLeft.mins ?? 0,
      label: "Minutes",
    },
  ];

  return (
    <div className="flex items-center gap-5">
      {items.map((item, index) => (
        <div
          key={item.label}
          className="flex items-center gap-5"
        >
          <div>
            <p className="font-serif text-[24px] text-[#342925]">
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

  const [month, setMonth] = useState(months[0]);

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
    address: "",
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

    if (!selectedEvent) {
      return;
    }

    if (status === "loading") {
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

      const response = await fetch(
        "/api/bookings",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            pujaName: selectedEvent.title,

            pujaSlug: slug,

            pujaType: "offline",

            price: "Price may vary",

            date: selectedEvent.date,

            timeSlot: "Flexible",

            address: form.address,

            phone: form.phone,

            customerName: form.name,

            customerEmail: form.email,

            message: form.message,

            transactionId: "",

            paymentStatus: "pay_on_service",
          }),
        }
      );

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
            "Booking failed"
        );
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/my-bookings");
      }, 1500);
    } catch (error) {
      console.error(
        "EVENT BOOKING ERROR:",
        error
      );

      setError(
        error?.message ||
          "Booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="w-full bg-[#fffdfb] px-5 py-20 md:py-28">

        <div className="mx-auto max-w-6xl">

          {/* HEADER */}

          <div className="mb-14 text-center">

            <div className="mb-5 flex items-center justify-center gap-3">

              <span className="h-px w-8 bg-[#b97b66]" />

              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#a85c43]">
                Sacred Calendar
              </p>

              <span className="h-px w-8 bg-[#b97b66]" />

            </div>

            <h2 className="font-serif text-[42px] leading-[1.05] text-[#2c2421] md:text-[64px]">
              Upcoming Vedic
              <br />
              Events
            </h2>

          </div>

          {/* MONTH SELECTOR */}

          <div className="mb-14 flex justify-center">

            <div className="flex border border-[#e7dfda] bg-[#fffaf7]">

              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMonth(m);
                  }}
                  className={`px-6 py-3 text-[11px] font-medium uppercase tracking-[0.16em] transition-all duration-300 md:px-9 ${
                    month === m
                      ? "bg-[#8f321c] text-white"
                      : "text-[#625752] hover:bg-[#f6eee9]"
                  }`}
                >
                  {m}
                </button>
              ))}

            </div>

          </div>

          {/* EMPTY MONTH */}

          {selectedEvents.length === 0 && (
            <div className="border-y border-[#eee7e2] py-20 text-center">

              <CalendarDays
                size={28}
                strokeWidth={1.3}
                className="mx-auto text-[#a85c43]"
              />

              <h3 className="mt-5 font-serif text-3xl text-[#332925]">
                No sacred events scheduled
              </h3>

              <p className="mt-3 text-sm text-[#81756f]">
                New Vedic ceremonies will be announced soon.
              </p>

            </div>
          )}

          {/* EVENTS */}

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">

            {selectedEvents.map((event, i) => {
              const expired =
                new Date(event.date).getTime() <
                Date.now();

              return (
                <article
                  key={i}
                  className="group overflow-hidden border border-[#e9e1dc] bg-[#fffaf7]"
                >

                  {/* IMAGE */}

                  <div className="relative h-[280px] overflow-hidden md:h-[360px]">

                    <img
                      src={event.img}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                    {event.offer && (
                      <div className="absolute left-5 top-5 bg-[#fffdfb] px-4 py-2">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8f321c]">
                          {event.offer}
                        </p>

                      </div>
                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="p-7 md:p-9">

                    <div className="mb-5 flex items-center gap-2 text-[#9c6a58]">

                      <CalendarDays
                        size={15}
                        strokeWidth={1.5}
                      />

                      <p className="text-[10px] uppercase tracking-[0.2em]">

                        {new Date(
                          event.date
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",

                            month: "long",

                            year: "numeric",
                          }
                        )}

                      </p>

                    </div>

                    <h3 className="font-serif text-[32px] leading-tight text-[#302724] md:text-[38px]">
                      {event.title}
                    </h3>

                    <p className="mt-4 max-w-lg text-[14px] leading-7 text-[#746963]">
                      {event.desc}
                    </p>

                    <div className="my-7 h-px w-full bg-[#e8dfda]" />

                    <Countdown date={event.date} />

                    {/* BUTTON */}

                    <button
                      disabled={
                        expired ||
                        status === "loading"
                      }
                      onClick={() =>
                        openBooking(event)
                      }
                      className={`mt-8 inline-flex min-w-[145px] items-center justify-center gap-4 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
                        expired
                          ? "cursor-not-allowed bg-[#ddd5d0] text-[#8c817b]"
                          : "bg-[#96391f] text-white hover:bg-[#7c2b17]"
                      }`}
                    >

                      {expired
                        ? "Event Closed"
                        : status === "loading"
                        ? "Please Wait..."
                        : "Book Puja"}

                      {!expired &&
                        status !== "loading" && (
                          <ArrowRight
                            size={15}
                            strokeWidth={1.5}
                          />
                        )}

                    </button>

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
                src="/pujadham.png"
                alt="Puja Dham"
                className="mx-auto h-[75px] w-auto object-contain"
              />

              <p className="mt-8 text-[10px] uppercase tracking-[0.25em] text-[#a85c43]">
                Mantra · Vidhi · Aastha
              </p>

              <h2 className="mt-4 font-serif text-[35px] leading-tight text-[#2c2421]">
                Login to book your special puja
              </h2>

              <p className="mt-4 text-[13px] leading-6 text-[#81756f]">
                Sign in to securely book this offline
                Vedic ceremony and manage your booking
                from My Bookings.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/login")
                }
                className="mt-9 h-[54px] w-full bg-[#8f321c] text-[11px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#762814]"
              >
                Login to Continue
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push("/login")
                }
                className="mt-3 h-[54px] w-full border border-[#ddd3cd] bg-white text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6c4c3d] transition hover:bg-[#fff8f4]"
              >
                Create Account
              </button>

              <div className="mt-7 flex items-center justify-center gap-2 text-[10px] text-[#9a8d86]">

                <ShieldCheck size={14} />

                Secure account access

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
          className="fixed inset-0 z-[9999] bg-white"
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
              onClick={() => {
                if (!loading) setSelectedEvent(null);
              }}
              className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfd8] bg-white/95 text-[#8f321c] shadow-sm transition hover:bg-[#fff8f4] md:right-7 md:top-7 md:h-11 md:w-11"
            >
              <X size={19} />
            </button>

            <div className="grid h-full w-full md:grid-cols-[42%_58%]">
              {/* LEFT VISUAL - DESKTOP */}
              <div className="relative hidden h-full overflow-hidden md:block">
                <img
                  src={selectedEvent.img}
                  alt={selectedEvent.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                <div className="absolute bottom-0 left-0 right-0 p-10 lg:p-14">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-orange-100">
                    Offline Puja Booking
                  </p>

                  <h3 className="mt-4 max-w-xl font-serif text-[40px] leading-[1.05] text-white lg:text-[52px]">
                    {selectedEvent.title}
                  </h3>

                  <div className="mt-8 grid grid-cols-2 border-t border-white/25 pt-6">
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.2em] text-white/60">
                        Sacred Date
                      </p>

                      <p className="mt-2 text-[13px] font-medium text-white">
                        {new Date(selectedEvent.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-[8px] uppercase tracking-[0.2em] text-white/60">
                        Puja Price
                      </p>

                      <p className="mt-2 font-serif text-[20px] text-white">
                        Price may vary
                      </p>

                      <p className="mt-1 text-[9px] text-white/60">
                        Informed by Panditji
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT FORM */}
              <div className="flex h-full min-h-0 items-center justify-center bg-white px-5 py-4 sm:px-8 md:px-10 md:py-6 lg:px-16">
                <div className="w-full max-w-[620px]">
                  <div className="text-center">
                    <img
                      src="/pujadham.png"
                      alt="Puja Dham"
                      className="mx-auto h-[48px] w-auto object-contain sm:h-[56px] md:h-[64px]"
                    />

                    <h2 className="mt-3 font-serif text-[30px] leading-[0.98] text-[#2c2421] sm:text-[36px] md:mt-4 md:text-[46px] lg:text-[52px]">
                      Book your{" "}
                      <span className="text-[#9a3f2b]">Special Puja.</span>
                    </h2>

                    <p className="mx-auto mt-2 max-w-[480px] text-[11px] leading-5 text-[#81756f] md:mt-3 md:text-[12px]">
                      Share your details. Panditji will connect with you for
                      final arrangements and price.
                    </p>

                    {/* MOBILE EVENT INFO */}
                    <div className="mt-3 border border-[#eee5df] bg-[#fffaf7] px-4 py-3 text-left md:hidden">
                      <p className="truncate font-serif text-[16px] text-[#342925]">
                        {selectedEvent.title}
                      </p>

                      <div className="mt-1 flex items-center justify-between gap-3 text-[9px] text-[#8f817a]">
                        <span>
                          {new Date(selectedEvent.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span className="font-medium text-[#8f321c]">
                          Price may vary
                        </span>
                      </div>
                    </div>
                  </div>

                  <form
                    onSubmit={submitBooking}
                    className="mt-3 space-y-2.5 md:mt-5 md:space-y-3"
                  >
                    <InputBox icon={<UserRound size={16} />}>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                        className="event-input"
                      />
                    </InputBox>

                    <div className="grid grid-cols-2 gap-2.5 md:gap-3">
                      <InputBox icon={<Phone size={16} />}>
                        <input
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="Phone Number"
                          required
                          className="event-input"
                        />
                      </InputBox>

                      <InputBox icon={<Mail size={16} />}>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="Email Address"
                          required
                          className="event-input"
                        />
                      </InputBox>
                    </div>

                    <InputBox icon={<MapPin size={16} />}>
                      <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Complete Puja Address"
                        required
                        className="event-input"
                      />
                    </InputBox>

                    <div className="relative">
                      <MessageSquareText
                        size={16}
                        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#aa978c]"
                      />

                      <input
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Special requirement (Optional)"
                        className="event-input"
                      />
                    </div>

                    {error && (
                      <div className="border border-red-100 bg-red-50 px-3 py-2 text-center text-[11px] text-red-600">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="border border-green-100 bg-green-50 px-3 py-2 text-center text-[11px] text-green-700">
                        Booking confirmed 🙏 Opening My Bookings...
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || success}
                      className="flex h-[50px] w-full items-center justify-center gap-3 bg-[#8f321c] text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#762814] disabled:cursor-not-allowed disabled:opacity-60 md:h-[54px] md:text-[11px]"
                    >
                      {loading
                        ? "Booking Puja..."
                        : success
                        ? "Booking Confirmed"
                        : "Confirm Puja Booking"}

                      {!loading && !success && <ArrowRight size={16} />}
                    </button>

                    <div className="flex items-center justify-center gap-2 pt-0.5 text-[8px] text-[#9a8d86] md:text-[9px]">
                      <ShieldCheck size={12} />
                      Offline Puja · Final price informed by Panditji
                    </div>
                  </form>
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
            transform: translateX(-100%);
            opacity: 0;
          }

          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .event-booking-panel {
          animation: eventBookingSlideIn 0.45s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .event-input {
          width: 100%;
          height: 48px;
          border: 1px solid #e9e1dc;
          background: #fffdfb;
          padding: 0 14px 0 42px;
          font-size: 12px;
          color: #342925;
          outline: none;
          transition: 0.25s ease;
        }

        @media (min-width: 768px) {
          .event-input {
            height: 52px;
            padding: 0 16px 0 44px;
            font-size: 13px;
          }
        }

        @media (max-height: 700px) {
          .event-input {
            height: 43px;
          }
        }

        .event-input::placeholder {
          color: #aa9b92;
        }

        .event-input:focus {
          border-color: #b97b66;
          background: #ffffff;
          box-shadow: 0 0 0 4px
            rgba(185, 123, 102, 0.1);
        }
      `}</style>

    </>
  );
}

// ================= INPUT BOX =================

function InputBox({ icon, children }) {
  return (
    <div className="relative">

      <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#aa978c]">
        {icon}
      </span>

      {children}

    </div>
  );
}