"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";
import { Cormorant_Garamond } from "next/font/google";
import {
  Calendar,
  Clock,
  ShieldCheck,
  BadgeCheck,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronDown,
  User,
  MessageSquare,
  Gift,
  HeartHandshake,
  CreditCard,
  ClipboardList,
} from "lucide-react";

import { PUJAS } from "../pujasData";

export const dynamic = "force-dynamic";

const UPI_ID = "yourupi@upi";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

/* Small reusable section header — icon + eyebrow + title.
   Keeps every card in the form visually consistent. */
function SectionHeader({ icon: Icon, eyebrow, title, onToggle, open, collapsible }) {
  const content = (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff4ec]">
        <Icon size={18} className="text-[#a8441b]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a8441b]">{eyebrow}</p>
        <h3 className="text-lg sm:text-xl font-bold text-[#252525]">{title}</h3>
      </div>
    </div>
  );

  if (!collapsible) {
    return content;
  }

  return (
    <button type="button" onClick={onToggle} className="flex w-full items-center justify-between text-left">
      {content}
      <ChevronDown
        size={20}
        className={`ml-3 shrink-0 text-[#a8441b] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      />
    </button>
  );
}

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedPujaName =
    searchParams.get("slug") ||
    searchParams.get("puja") ||
    "";
  const urlType = searchParams.get("type") || "";

  const puja = useMemo(() => {
    return PUJAS.find(
      (item) =>
        item?.name?.toLowerCase() === selectedPujaName.toLowerCase() ||
        item?.slug?.toLowerCase() === selectedPujaName.toLowerCase()
    );
  }, [selectedPujaName]);

  const [pujaType, setPujaType] = useState(
    urlType === "online" || urlType === "offline"
      ? urlType
      : ""
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

  // Mobile-only accordion state for the long info sections.
  // On desktop (lg and up) these sections always stay open — nothing is removed,
  // they're just collapsible on small screens so the page doesn't feel too long.
  const [openSamagri, setOpenSamagri] = useState(false);
  const [openBenefits, setOpenBenefits] = useState(false);
  const [openProcess, setOpenProcess] = useState(false);

  const price =
    pujaType === "online"
      ? puja?.onlinePrice || ""
      : pujaType === "offline"
      ? puja?.offlinePrice || ""
      : "";

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const bookingSummary = [
    {
      icon: Calendar,
      label: "Preferred Date",
      value: form.date || "Select Date",
    },
    {
      icon: Clock,
      label: "Duration",
      value: puja?.duration || "--",
    },
    {
      icon: MapPin,
      label: "Mode",
      value:
        pujaType === "online"
          ? "Online Puja"
          : pujaType === "offline"
          ? "Offline Puja"
          : "Select Type",
    },
    {
      icon: ShieldCheck,
      label: "Price",
      value: price || "--",
    },
  ];

  const submitBooking = async (e) => {
    e.preventDefault();

    if (!puja) {
      alert("Puja not found");
      return;
    }

    if (!pujaType) {
      alert("Please select Online or Offline Puja");
      return;
    }

    if (
      pujaType === "online" &&
      !form.transactionId.trim()
    ) {
      alert("Please enter UPI Transaction ID / UTR");
      return;
    }

    setLoading(true);

    try {
      const generatedBookingId = "BK-" + Math.floor(100000 + Math.random() * 900000);

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
        address: pujaType === "offline" ? `${form.address}, ${form.city}` : "Online Puja",
        price: price,
        message: form.message,
        transactionId: pujaType === "online" ? form.transactionId : "Pay on service",
        status: "pending"
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
          } catch (e) {
            errorData = { error: textData };
          }
        }
        console.warn("Database connection issue:", errorData?.error);
      }

      await emailjs.send(
        "service_lsuicww",
        "template_3zsnbxq",
        bookingPayload,
        "gGm69Djy_97dOYF1O"
      ).catch((err) => console.error("EmailJS token missing/expired:", err));

      if (typeof window !== "undefined") {
        const existingLocal = JSON.parse(localStorage.getItem("local_puja_bookings") || "[]");
        existingLocal.unshift(bookingPayload);
        localStorage.setItem("local_puja_bookings", JSON.stringify(existingLocal));
        localStorage.setItem("just_booked_trigger", "true");
      }

      setSent(true);

      setTimeout(() => {
        router.push("/my-bookings");
      }, 1200);
    } catch (error) {
      console.error(error);
      alert("Booking operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!puja) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#fffaf6] px-6">
        <div className="max-w-md rounded-[32px] border border-[#efe3d8] bg-white p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <Sparkles className="mx-auto mb-5 h-12 w-12 text-[#a8441b]" />
          <h1 className={`${displayFont.className} text-4xl font-semibold text-[#252525]`}>
            Puja Not Found
          </h1>
          <p className="mt-4 text-sm leading-7 text-gray-500">
            We couldn't find the selected puja. Please return to the puja list and choose a valid service.
          </p>
          <button
            type="button"
            onClick={() => router.push("/pujas")}
            className="mt-8 rounded-full bg-[#a8441b] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#8f3a17]"
          >
            Explore Pujas
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdfb] overflow-hidden">
      <section className="mx-auto max-w-[1380px] px-4 py-6 pb-28 md:px-8 md:py-12 lg:pb-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 md:mb-8 inline-flex items-center gap-2 rounded-full border border-[#eaded4] bg-white px-5 py-3 text-sm font-semibold text-[#555] transition hover:border-[#a8441b] hover:text-[#a8441b]"
        >
          <ChevronLeft size={18} />
          Back
        </button>

        <div className="grid overflow-hidden rounded-[34px] border border-[#f0e6dd] bg-white shadow-[0_30px_80px_rgba(55,35,15,0.08)] lg:overflow-visible lg:grid-cols-[0.9fr_1.1fr]">

          {/* LEFT PANEL — sticky at the top on laptop/desktop so the image stays in view while the form scrolls */}
          <div className="relative flex h-[220px] sm:h-[320px] lg:h-[calc(100vh-3rem)] lg:max-h-[640px] items-center justify-center overflow-hidden bg-[#fffaf6] m-4 rounded-3xl lg:sticky lg:top-6 lg:m-6 lg:self-start lg:rounded-[26px]">
            <img
              src={puja.image}
              alt={puja.name}
              className="max-h-full max-w-full object-contain p-4"
            />
            {/* Trust strip — reinforces this is a verified, professional booking flow */}
            <div className="absolute inset-x-4 bottom-4 hidden items-center justify-between gap-3 rounded-2xl bg-white/90 px-4 py-3 backdrop-blur-sm lg:flex">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#252525]">
                <ShieldCheck size={16} className="text-[#a8441b]" />
                Verified Pandit Ji
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#252525]">
                <BadgeCheck size={16} className="text-[#a8441b]" />
                Authentic Vedic Rituals
              </div>
            </div>
          </div>

          {/* RIGHT PANEL START */}
          <div className="bg-[#fffdfb] p-5 sm:p-6 md:p-10 lg:p-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#a8441b]">
              Secure Booking
            </span>

            <h2 className={`${displayFont.className} mt-3 text-3xl sm:text-4xl font-semibold text-[#252525] md:text-5xl`}>
              Complete your booking
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
              Choose your preferred puja type and complete the booking. Once your request is received our team will verify the details and confirm your booking shortly.
            </p>

            <div className="mt-8 md:mt-10">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Select Booking Type
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {puja.onlineAvailable && (
                  <button
                    type="button"
                    onClick={() => setPujaType("online")}
                    className={`rounded-[26px] border p-5 sm:p-6 text-left transition-all duration-300 ${
                      pujaType === "online"
                        ? "border-[#a8441b] bg-[#fff8f2] shadow-[0_18px_40px_rgba(168,68,27,.12)]"
                        : "border-[#ece5de] bg-white hover:border-orange-200 hover:-translate-y-1"
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a8441b]">Online</p>
                    <h3 className="mt-3 text-xl font-bold text-[#252525]">Online Puja</h3>
                    <p className="mt-2 text-sm text-gray-500">Attend from anywhere via Video Call.</p>
                    <p className="mt-6 text-2xl sm:text-3xl font-extrabold text-[#a8441b]">{puja.onlinePrice}</p>
                  </button>
                )}

                {puja.offlineAvailable && (
                  <button
                    type="button"
                    onClick={() => setPujaType("offline")}
                    className={`rounded-[26px] border p-5 sm:p-6 text-left transition-all duration-300 ${
                      pujaType === "offline"
                        ? "border-[#a8441b] bg-[#fff8f2] shadow-[0_18px_40px_rgba(168,68,27,.12)]"
                        : "border-[#ece5de] bg-white hover:border-orange-200 hover:-translate-y-1"
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a8441b]">Offline</p>
                    <h3 className="mt-3 text-xl font-bold text-[#252525]">Home Visit Puja</h3>
                    <p className="mt-2 text-sm text-gray-500">Pandit Ji will visit your location.</p>
                    <p className="mt-6 text-2xl sm:text-3xl font-extrabold text-[#a8441b]">{puja.offlinePrice}</p>
                  </button>
                )}
              </div>

              {/* Booking Summary */}
              <div className="mt-8 rounded-[28px] border border-orange-100 bg-[#fffaf5] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a8441b]">Booking Summary</p>
                    <h3 className="mt-2 text-xl sm:text-2xl font-bold text-[#252525]">{puja.name}</h3>
                  </div>
                  <div className="rounded-full bg-[#a8441b] px-5 py-2 text-sm font-bold text-white whitespace-nowrap">
                    {price || "--"}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                  {bookingSummary.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-2 sm:gap-3 rounded-2xl bg-white p-3 sm:p-4">
                        <div className="rounded-xl bg-[#fff4ec] p-2.5 sm:p-3 shrink-0">
                          <Icon size={16} className="text-[#a8441b] sm:hidden" />
                          <Icon size={18} className="hidden text-[#a8441b] sm:block" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-400">{item.label}</p>
                          <p className="truncate font-semibold text-[#252525] text-xs sm:text-base">{item.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <form id="pujaBookingForm" onSubmit={submitBooking} className="mt-8 space-y-4">

              {/* Your Details */}
              <div className="rounded-[28px] border border-[#eee5dd] bg-white p-5 sm:p-6">
                <SectionHeader icon={User} eyebrow="Contact" title="Your Details" collapsible={false} />
                <div className="mt-5 space-y-5">
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required className="bookingInput" />
                  <div className="grid gap-5 md:grid-cols-2">
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required className="bookingInput" />
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address" required className="bookingInput" />
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="rounded-[28px] border border-[#eee5dd] bg-white p-5 sm:p-6">
                <SectionHeader icon={Calendar} eyebrow="Timing" title="Schedule" collapsible={false} />
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <input name="date" type="date" value={form.date} onChange={handleChange} required className="bookingInput" />
                  <select name="timeSlot" value={form.timeSlot} onChange={handleChange} className="bookingInput">
                    <option value="">Preferred Time</option>
                    <option>Morning (6 AM - 10 AM)</option>
                    <option>Afternoon (10 AM - 2 PM)</option>
                    <option>Evening (2 PM - 6 PM)</option>
                    <option>Night (After 6 PM)</option>
                  </select>
                </div>
              </div>

              {/* Location — offline only */}
              {pujaType === "offline" && (
                <div className="optionReveal rounded-[28px] border border-[#eee5dd] bg-white p-5 sm:p-6">
                  <SectionHeader icon={MapPin} eyebrow="Venue" title="Location" collapsible={false} />
                  <div className="mt-5 space-y-5">
                    <input name="city" value={form.city} onChange={handleChange} placeholder="City" required className="bookingInput" />
                    <input name="address" value={form.address} onChange={handleChange} placeholder="Complete Address" required className="bookingInput" />

                    {puja.travel && (
                      <div className="rounded-[24px] border border-orange-100 bg-[#fff9f4] p-5">
                        <h4 className="font-bold text-[#252525]">Travel Charges</h4>
                        <div className="mt-4 space-y-2 text-sm">
                          <div className="flex justify-between"><span>Within City</span><span>{puja.travel.city}</span></div>
                          <div className="flex justify-between"><span>Outside City</span><span>{puja.travel.outsideCity}</span></div>
                          <div className="flex justify-between"><span>Remote Area</span><span>{puja.travel.remoteArea}</span></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment — online only */}
              {pujaType === "online" && (
                <div className="optionReveal rounded-[28px] border border-orange-100 bg-gradient-to-br from-[#fffaf6] to-[#fff3eb] p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <SectionHeader icon={CreditCard} eyebrow="Secure Payment" title="Complete UPI Payment" collapsible={false} />
                    <div className="rounded-full bg-[#a8441b] px-5 py-2 text-sm font-bold text-white whitespace-nowrap">{price}</div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Scan the QR code below and pay exactly <span className="font-bold text-[#a8441b]"> {price}</span>. After payment, enter your UTR / Transaction ID.
                  </p>

                  <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
                    <div className="rounded-[26px] bg-white p-4 shadow-sm mx-auto lg:mx-0 w-fit">
                      <img src="/images/payment-qr.png" alt="UPI QR" className="h-40 w-40 sm:h-48 sm:w-48 object-contain" />
                    </div>
                    <div>
                      <div className="rounded-2xl border border-orange-100 bg-white p-5">
                        <p className="text-xs uppercase tracking-widest text-gray-400">UPI ID</p>
                        <h4 className="mt-2 break-all text-lg sm:text-xl font-bold text-[#a8441b]">{UPI_ID}</h4>
                      </div>
                      <div className="mt-5 space-y-4">
                        {["Scan the QR Code", `Pay ${price}`, "Save Transaction ID", "Paste UTR below", "Booking will be verified"].map((step) => (
                          <div key={step} className="flex items-center gap-3">
                            <BadgeCheck size={18} className="text-green-600 shrink-0" />
                            <span className="text-sm text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <input name="transactionId" value={form.transactionId} onChange={handleChange} placeholder="Enter UPI Transaction ID / UTR" required className="bookingInput mt-8" />
                </div>
              )}

              {/* Puja Samagri — collapsible on mobile, always open on desktop (lg+) */}
              {puja?.samagri && (
                <div className="rounded-[28px] border border-[#eee6de] bg-[#fffdfb] p-5 sm:p-6">
                  <SectionHeader
                    icon={Gift}
                    eyebrow="Included Items"
                    title="Puja Samagri"
                    collapsible
                    open={openSamagri}
                    onToggle={() => setOpenSamagri((v) => !v)}
                  />
                  <div
                    className={`grid gap-3 sm:grid-cols-2 ${openSamagri ? "mt-5" : "hidden"}`}
                  >
                    {puja.samagri.items?.map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-xl bg-[#fff8f2] p-3">
                        <BadgeCheck size={18} className="text-[#a8441b] shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Spiritual Benefits — collapsible on mobile, always open on desktop (lg+) */}
              {puja?.benefits && (
                <div className="rounded-[28px] border border-[#eee6de] bg-white p-5 sm:p-6">
                  <SectionHeader
                    icon={HeartHandshake}
                    eyebrow="Why This Puja"
                    title="Spiritual Benefits"
                    collapsible
                    open={openBenefits}
                    onToggle={() => setOpenBenefits((v) => !v)}
                  />
                  <div className={`space-y-3 ${openBenefits ? "mt-5" : "hidden"}`}>
                    {puja.benefits.slice(0, 6).map((benefit) => (
                      <div key={benefit} className="flex items-start gap-3">
                        <Sparkles size={18} className="mt-1 text-[#a8441b] shrink-0" />
                        <span className="text-sm leading-7 text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Notes — now a proper matching card, no longer floating loose in the form */}
              <div className="rounded-[28px] border border-[#eee5dd] bg-white p-5 sm:p-6">
                <SectionHeader icon={MessageSquare} eyebrow="Optional" title="Additional Notes" collapsible={false} />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Write any special requirements, preferred Pandit language, special sankalp details, or additional instructions..."
                  className="bookingInput mt-5 resize-none"
                />
              </div>

              {sent && (
                <div className="rounded-[24px] border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-5">
                  <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shrink-0"><BadgeCheck size={24} /></div>
                    <div>
                      <h3 className="font-bold text-green-800">Booking Submitted Successfully</h3>
                      <p className="mt-1 text-sm text-green-700">Redirecting to history dashboard...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Process — collapsible on mobile, always open on desktop (lg+) */}
              <div className="rounded-[28px] border border-[#eee5dd] bg-[#fffaf6] p-5 sm:p-6">
                <SectionHeader
                  icon={ClipboardList}
                  eyebrow="What Happens Next"
                  title="Booking Process"
                  collapsible
                  open={openProcess}
                  onToggle={() => setOpenProcess((v) => !v)}
                />
                <div
                  className={`grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5 ${openProcess ? "mt-6" : "hidden"}`}
                >
                  {[
                    { title: "Book", desc: "Fill your booking form" },
                    { title: "Verify", desc: "Our team verifies details" },
                    { title: "Confirm", desc: "Booking confirmation" },
                    { title: "Puja", desc: "Pandit Ji performs Puja" },
                  ].map((step, index) => (
                    <div key={step.title} className="rounded-2xl bg-white p-3 sm:p-5 text-center shadow-sm">
                      <div className="mx-auto flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#a8441b] text-sm font-bold text-white">{index + 1}</div>
                      <h4 className="mt-3 sm:mt-4 font-bold text-[#252525] text-sm sm:text-base">{step.title}</h4>
                      <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs leading-5 sm:leading-6 text-gray-500">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total payable — CTA visible inline on desktop; on mobile the sticky bar below handles the CTA */}
              <div className="rounded-[28px] border border-orange-100 bg-gradient-to-r from-[#fff8f3] to-[#fffdfb] p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a8441b]">Total Payable</p>
                    <h2 className={`${displayFont.className} mt-2 text-3xl sm:text-4xl font-bold text-[#252525]`}>{price || "--"}</h2>
                    <p className="mt-2 text-sm text-gray-500">{pujaType === "online" ? "Secure online payment via UPI." : "Payment can be made during the Puja service."}</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !pujaType}
                    className="hidden lg:inline-flex h-12 min-w-[210px] items-center justify-center rounded-xl bg-[#a8441b] px-6 text-[14px] font-semibold tracking-wide text-white shadow-md transition-all duration-300 hover:bg-[#8b3616] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <><div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />Processing...</>
                    ) : pujaType === "online" ? (
                      `Pay ${price} & Confirm Booking`
                    ) : pujaType === "offline" ? (
                      `Confirm Offline Booking (${price})`
                    ) : (
                      "Select Booking Type"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Sticky mobile CTA — same form, same submit handler (form="pujaBookingForm"), just pinned for easy reach while scrolling a long page */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#f0e6dd] bg-white/95 px-4 pt-3 backdrop-blur-sm lg:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Total</p>
            <p className="truncate text-lg font-extrabold text-[#a8441b]">{price || "--"}</p>
          </div>
          <button
            type="submit"
            form="pujaBookingForm"
            disabled={loading || !pujaType}
            className="flex min-h-[52px] flex-1 items-center justify-center rounded-full bg-[#a8441b] px-6 text-sm font-bold text-white transition-all duration-300 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : pujaType === "online" ? (
              "Pay & Confirm"
            ) : pujaType === "offline" ? (
              "Confirm Booking"
            ) : (
              "Select Booking Type"
            )}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .bookingInput { width: 100%; min-height: 54px; border: 1px solid #e8ddd5; border-radius: 18px; padding: 0 16px; font-size: 15px; color: #252525; background: #fffdfb; outline: none; transition: all 0.35s ease; }
        @media (min-width: 640px) {
          .bookingInput { min-height: 58px; padding: 0 18px; }
        }
        textarea.bookingInput { padding: 16px; min-height: 120px; }
        @media (min-width: 640px) {
          textarea.bookingInput { padding: 18px; min-height: 130px; }
        }
        select.bookingInput { cursor: pointer; }
        .bookingInput::placeholder { color: #a59b95; }
        .bookingInput:hover { border-color: #d9c3b5; background: #ffffff; }
        .bookingInput:focus { border-color: #a8441b; background: #fff; box-shadow: 0 0 0 5px rgba(168,68,27,.08); transform: translateY(-2px); }
        button { transition: all .3s ease; }
        img { user-select: none; }
        .optionReveal { animation: optionReveal .45s ease both; }
        @keyframes optionReveal { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#fffdfb]"><div className="h-12 w-12 animate-spin rounded-full border-4 border-[#a8441b] border-t-transparent" /></div>}>
      <BookingForm />
    </Suspense>
  );
}