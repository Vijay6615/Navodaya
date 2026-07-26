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
  Clock3,
  Tag,
  CheckCircle2,
} from "lucide-react";

// ================= EVENTS =================

const EVENTS = {
  August: [
    {
      img: "/images/Shivratri.png",
      title: "Sawan Shivratri, Maha Rudra Abhishek & Havan",
      desc: "Experience the divine blessings of Lord Shiva through Maha Rudra Abhishek and Havan during the sacred month of Sawan. This powerful ritual removes negativity, fulfills wishes, improves health, and brings peace, prosperity, and spiritual growth.",
      offer: "10% OFF this month",
      date: "2026-08-11",
    },
    {
      img: "/images/naappanchmi.png",
      title: "Nag Panchami Special Puja",
      desc: "Celebrate Nag Panchami with traditional Vedic rituals dedicated to the divine serpent deities. Seek protection from Kaal Sarp Dosha, receive blessings for prosperity, family well-being, and spiritual harmony through sacred mantra chanting.",
      offer: "10% OFF this month + Free Muhurat Consultation",
      date: "2026-08-17",
    },
  ],

  September: [
    {
      img: "/images/KrishnaJanmashtami.jpg",
      title: "Krishna Janmashtami Special Puja",
      desc: "Celebrate the birth of Lord Krishna with devotional puja, bhajans, mantra chanting, and sacred rituals. Receive blessings for happiness, prosperity, protection, and spiritual enlightenment while strengthening devotion towards Lord Krishna.",
      offer: "10% OFF this month",
      date: "2026-09-04",
    },
    {
      img: "/images/ganesh-puja.jpg",
      title: "Ganesh Chaturthi Special Puja",
      desc: "Celebrate Ganesh Chaturthi with sacred Vedic rituals, Ganapati Atharvashirsha recitation, and special puja to invite Lord Ganesha's blessings for success, happiness, wealth, and obstacle-free beginnings.",
      offer: "10% OFF this month + Free Muhurat Consultation",
      date: "2026-09-14",
    },
    {
      img: "/images/GaneshVisarjan.jpg",
      title: "Ganesh Visarjan",
      desc: "Offer a heartfelt farewell to Lord Ganesha with traditional Visarjan rituals, prayers, and Aarti. Seek blessings for wisdom, prosperity, success, and the removal of obstacles before bidding farewell to Bappa.",
      offer: "10% OFF this month",
      date: "2026-09-25",
    },
  
    {
      img: "/images/PitraDoshNivaran.jpg",
      title: "Pitru Paksha Special Puja",
      desc: "Honor your ancestors during Pitru Paksha with traditional Shradh, Tarpan, and Pitra Dosh Nivaran rituals. Seek ancestral blessings for family harmony, prosperity, health, and relief from karmic obstacles.",
      offer: "10% OFF this month",
      date: "2026-09-26",
    },
  ],

  October: [
    {
      img: "/images/durgapuja.png",
      title: "Sharadiya Navratri & Durga Puja",
      desc: "Celebrate the nine divine nights of Goddess Durga with Chandi Path, Durga Puja, and special Vedic rituals for protection, prosperity, courage, and victory over negativity.",
      offer: "15% OFF this month",
      date: "2026-10-03",
    },
    {
      img: "/images/Vijayadashami.png",
      title: "Vijayadashami (Dussehra) Special Puja",
      desc: "Celebrate the victory of good over evil with Vijayadashami Puja. Seek blessings for success, new beginnings, career growth, courage, and prosperity through sacred Vedic rituals.",
      offer: "10% OFF this month",
      date: "2026-10-12",
    },
    {
      img: "/images/laxmi.jpg",
      title: "Diwali Lakshmi Puja",
      desc: "Welcome Goddess Lakshmi into your home with traditional Diwali Lakshmi Puja. Receive blessings for wealth, abundance, business growth, happiness, and lasting prosperity.",
      offer: "20% OFF this month + Free Muhurat Consultation",
      date: "2026-10-20",
    },
  ],
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
            "Booking failed"
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
                src="/Pujadhamlogo1.png"
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
                aria-label="Close booking form"
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
                  <img
                    src={selectedEvent.img}
                    alt={selectedEvent.title}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                  <div className="absolute bottom-0 left-0 right-0 p-9 lg:p-14">
                    <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-orange-100 backdrop-blur-md">
                      Special Offline Puja
                    </span>

                    <h3 className="mt-5 max-w-xl font-serif text-[38px] leading-[1.05] text-white lg:text-[50px]">
                      {selectedEvent.title}
                    </h3>

                    <p className="mt-4 max-w-xl text-xs leading-6 text-white/70">
                      Complete the form and Pandit Ji will contact you to
                      confirm the final arrangements, Samagri and price.
                    </p>

                    <div className="mt-7 grid grid-cols-2 gap-3 border-t border-white/25 pt-6">
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/50">
                          Sacred Date
                        </p>
                        <p className="mt-2 text-[13px] font-semibold text-white">
                          {new Date(selectedEvent.date).toLocaleDateString(
                            "en-IN",
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
                          Booking Price
                        </p>
                        <p className="mt-2 text-[13px] font-semibold text-white">
                          To be confirmed
                        </p>
                      </div>
                    </div>

                    {selectedEvent.offer && (
                      <div className="mt-4 flex items-start gap-2 rounded-2xl border border-white/20 bg-white/10 p-3 text-[10px] leading-5 text-white/80 backdrop-blur-md">
                        <Tag size={14} className="mt-0.5 shrink-0" />
                        {selectedEvent.offer}
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
                          className="mx-auto h-[48px] w-auto object-contain sm:h-[56px] md:h-[64px]"
                        />

                        <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.22em] text-[#a85c43]">
                          Special Event Booking
                        </p>

                        <h2 className="mt-2 font-serif text-[29px] leading-[1.05] text-[#2c2421] sm:text-[36px] md:text-[44px]">
                          Book your{" "}
                          <span className="text-[#9a3f2b]">
                            Special Puja
                          </span>
                        </h2>

                        <p className="mx-auto mt-2 max-w-[500px] text-[11px] leading-5 text-[#81756f] md:text-xs">
                          Submit complete details so your booking appears
                          correctly in My Bookings.
                        </p>
                      </div>

                      {/* MOBILE EVENT SUMMARY */}
                      <div className="mt-4 overflow-hidden rounded-[20px] border border-[#eadfd7] bg-[#fffaf7] md:hidden">
                        <div className="flex gap-3 p-3">
                          <img
                            src={selectedEvent.img}
                            alt={selectedEvent.title}
                            className="h-[76px] w-[76px] shrink-0 rounded-[15px] object-cover"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 font-serif text-[17px] font-semibold leading-5 text-[#342925]">
                              {selectedEvent.title}
                            </p>

                            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#7c6f68]">
                              <CalendarDays
                                size={12}
                                className="shrink-0 text-[#9a3f2b]"
                              />
                              {new Date(
                                selectedEvent.date
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>

                            <p className="mt-1 text-[10px] font-bold text-[#8f321c]">
                              Price to be confirmed
                            </p>
                          </div>
                        </div>

                        {selectedEvent.offer && (
                          <div className="flex items-start gap-2 border-t border-[#eee1d9] bg-white px-3 py-2.5 text-[9px] leading-4 text-[#8f5b43]">
                            <Tag
                              size={12}
                              className="mt-0.5 shrink-0"
                            />
                            {selectedEvent.offer}
                          </div>
                        )}
                      </div>

                      <form
                        onSubmit={submitBooking}
                        className="mt-5 space-y-4"
                      >
                        <FormField
                          label="Full Name"
                          required
                          icon={<UserRound size={16} />}
                        >
                          <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter devotee name"
                            required
                            autoComplete="name"
                            className="event-input"
                          />
                        </FormField>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FormField
                            label="Phone Number"
                            required
                            icon={<Phone size={16} />}
                          >
                            <input
                              name="phone"
                              type="tel"
                              value={form.phone}
                              onChange={handleChange}
                              placeholder="Enter phone number"
                              required
                              inputMode="tel"
                              autoComplete="tel"
                              className="event-input"
                            />
                          </FormField>

                          <FormField
                            label="Email Address"
                            required
                            icon={<Mail size={16} />}
                          >
                            <input
                              name="email"
                              type="email"
                              value={form.email}
                              onChange={handleChange}
                              placeholder="Enter email address"
                              required
                              autoComplete="email"
                              className="event-input"
                            />
                          </FormField>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FormField
                            label="City"
                            required
                            icon={<MapPin size={16} />}
                          >
                            <input
                              name="city"
                              value={form.city}
                              onChange={handleChange}
                              placeholder="Mumbai"
                              required
                              autoComplete="address-level2"
                              className="event-input"
                            />
                          </FormField>

                          <FormField
                            label="Preferred Time"
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
                                Flexible
                              </option>
                              <option value="Morning">
                                Morning
                              </option>
                              <option value="Afternoon">
                                Afternoon
                              </option>
                              <option value="Evening">
                                Evening
                              </option>
                            </select>
                          </FormField>
                        </div>

                        <FormField
                          label="Complete Puja Address"
                          required
                          icon={<MapPin size={16} />}
                        >
                          <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="House/flat number, building, road and area"
                            required
                            rows={3}
                            className="event-textarea"
                          />
                        </FormField>

                        <FormField
                          label="Special Requirement"
                          icon={<MessageSquareText size={16} />}
                        >
                          <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Gotra, Sankalp name or any special instruction (optional)"
                            rows={3}
                            className="event-textarea"
                          />
                        </FormField>

                        <div className="grid grid-cols-2 gap-2 rounded-[18px] border border-[#e7ece8] bg-[#f2f8f4] p-3">
                          <div>
                            <p className="text-[8px] font-bold uppercase tracking-wide text-[#718077]">
                              Event Date
                            </p>
                            <p className="mt-1 text-[10px] font-bold text-[#30463a] sm:text-xs">
                              {new Date(
                                selectedEvent.date
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>

                          <div>
                            <p className="text-[8px] font-bold uppercase tracking-wide text-[#718077]">
                              Final Price
                            </p>
                            <p className="mt-1 text-[10px] font-bold text-[#30463a] sm:text-xs">
                              Pandit Ji will confirm
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
                            Booking saved. Opening My Bookings...
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={loading || success}
                          className="flex min-h-[52px] w-full items-center justify-center gap-3 rounded-[16px] bg-[#8f321c] px-5 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_12px_28px_rgba(143,50,28,0.22)] transition hover:bg-[#762814] disabled:cursor-not-allowed disabled:opacity-60 md:min-h-[54px] md:text-[11px]"
                        >
                          {loading
                            ? "Booking Puja..."
                            : success
                            ? "Booking Confirmed"
                            : "Confirm Puja Booking"}

                          {!loading && !success && (
                            <ArrowRight size={16} />
                          )}
                        </button>

                        <div className="flex items-start justify-center gap-2 px-2 pb-1 text-center text-[9px] leading-4 text-[#8c7f77]">
                          <ShieldCheck
                            size={13}
                            className="mt-0.5 shrink-0"
                          />
                          Offline Puja · Details and final price will be
                          confirmed by Pandit Ji
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