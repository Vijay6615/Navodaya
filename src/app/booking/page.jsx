"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";
import { Cormorant_Garamond } from "next/font/google";
import { PUJAS } from "../pujasData";

export const dynamic = "force-dynamic";

const UPI_ID = "yourupi@upi";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedPujaName = searchParams.get("puja") || "";
  const urlType = searchParams.get("type") || "";

  const puja = useMemo(() => {
    return PUJAS.find(
      (item) =>
        item?.name?.toLowerCase() === selectedPujaName.toLowerCase() ||
        item?.slug?.toLowerCase() === selectedPujaName.toLowerCase()
    );
  }, [selectedPujaName]);

  const [pujaType, setPujaType] = useState(
    urlType === "online" || urlType === "offline" ? urlType : ""
  );

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    address: "",
    message: "",
    transactionId: "",
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

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

    if (pujaType === "online" && !form.transactionId.trim()) {
      alert("Please enter UPI Transaction ID / UTR");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pujaName: puja.name,
          pujaSlug: puja.slug,
          pujaType,
          price,
          date: form.date,
          timeSlot: "Flexible",
          address: pujaType === "offline" ? form.address : "",
          phone: form.phone,
          customerName: form.name,
          customerEmail: form.email,
          message: form.message,
          transactionId:
            pujaType === "online" ? form.transactionId.trim() : "",
          paymentStatus:
            pujaType === "online"
              ? "pending_verification"
              : "pay_on_service",
        }),
      });

      let data;

      try {
        data = await res.json();
      } catch {
        data = {};
      }

      console.log("API STATUS:", res.status);
      console.log("API RESPONSE:", data);

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }

        throw new Error(
          data?.error ||
            data?.message ||
            `Booking failed (${res.status})`
        );
      }

      const emailData = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        date: form.date,
        address:
          pujaType === "offline" ? form.address : "Online Puja",
        puja: puja.name,
        pujaType:
          pujaType === "online" ? "Online Puja" : "Offline Puja",
        price,
        message: form.message,
        transactionId:
          pujaType === "online"
            ? form.transactionId
            : "Pay on service",
        bookingId: data.bookingId,
      };

      await emailjs.send(
        "service_lsuicww",
        "template_3zsnbxq",
        emailData,
        "gGm69Djy_97dOYF1O"
      );

      // await emailjs.send(
      //   "service_lsuicww",
      //   "template_autoreply123",
      //   emailData,
      //   "gGm69Djy_97dOYF1O"
      // );

      setSent(true);

      setTimeout(() => {
        router.push("/my-bookings");
      }, 1800);
    } catch (error) {
      console.log("BOOKING FAILED");
      console.log("ERROR TYPE:", typeof error);
      console.log("ERROR VALUE:", error);

      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Booking failed. Please try again.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (!puja) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#252525]">
            Puja not selected
          </h1>

          <button
            type="button"
            onClick={() => router.push("/pujas")}
            className="mt-5 rounded-full bg-[#a8441b] px-6 py-3 text-sm font-semibold text-white"
          >
            Explore Pujas
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-5 md:px-6 lg:px-8 py-8 md:py-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 text-sm font-semibold text-gray-500 transition hover:text-[#a8441b]"
        >
          ← Back
        </button>

        <div className="bookingSlide grid overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-[0_25px_70px_rgba(60,30,10,0.08)] lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative h-[320px] overflow-hidden sm:h-[420px] lg:h-[760px]">
            <img
              src={puja.image}
              alt={puja.name}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-7 text-white md:p-9">
              <span className="rounded-full bg-white/15 px-3 py-2 text-[11px] font-semibold backdrop-blur-md">
                {puja.category}
              </span>

              <h1 className={`${displayFont.className} mt-5 text-4xl font-semibold leading-none tracking-[-0.025em] md:text-5xl`}>
                {puja.name}
              </h1>

              <p className="mt-3 max-w-md text-sm leading-6 text-white/80">
                {puja.shortDescription}
              </p>
            </div>
          </div>

          <div className="bg-[#fffdfb] p-5 sm:p-7 md:p-10 lg:p-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a8441b]">
              Puja Booking
            </span>

            <h2 className={`${displayFont.className} mt-3 text-4xl font-semibold leading-none tracking-[-0.025em] text-[#252525] sm:text-5xl`}>
              Complete your booking
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Select your Puja type and enter your information.
            </p>

            <div className="mt-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                Choose Puja Type
              </p>

              <div className="grid grid-cols-2 gap-3">
                {puja.onlineAvailable && (
                  <button
                    type="button"
                    onClick={() => setPujaType("online")}
                    className={`group rounded-[20px] border bg-white p-5 text-left shadow-[0_8px_24px_rgba(54,37,28,0.035)] transition-all duration-300 hover:-translate-y-0.5 ${
                      pujaType === "online"
                        ? "border-[#a8441b] bg-[#fff8f2] shadow-[0_10px_30px_rgba(168,68,27,0.10)]"
                        : "border-gray-200 hover:border-orange-200"
                    }`}
                  >
                    <p className="text-sm font-bold text-[#252525]">
                      Online Puja
                    </p>

                    <p className="mt-2 text-lg font-extrabold text-[#a8441b]">
                      {puja.onlinePrice}
                    </p>
                  </button>
                )}

                {puja.offlineAvailable && (
                  <button
                    type="button"
                    onClick={() => setPujaType("offline")}
                    className={`group rounded-[20px] border bg-white p-5 text-left shadow-[0_8px_24px_rgba(54,37,28,0.035)] transition-all duration-300 hover:-translate-y-0.5 ${
                      pujaType === "offline"
                        ? "border-[#a8441b] bg-[#fff8f2] shadow-[0_10px_30px_rgba(168,68,27,0.10)]"
                        : "border-gray-200 hover:border-orange-200"
                    }`}
                  >
                    <p className="text-sm font-bold text-[#252525]">
                      Offline Puja
                    </p>

                    <p className="mt-2 text-lg font-extrabold text-[#a8441b]">
                      {puja.offlinePrice}
                    </p>
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={submitBooking} className="mt-8 space-y-4 rounded-[26px] border border-[#eee8e2] bg-white p-4 shadow-[0_18px_50px_rgba(54,37,28,0.05)] sm:p-6">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="bookingInput"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                  className="bookingInput"
                />

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="bookingInput"
                />
              </div>

              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
                className="bookingInput"
              />

              {pujaType === "offline" && (
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Complete Puja Address"
                  required
                  className="bookingInput optionReveal"
                />
              )}

              {pujaType === "online" && (
                <div className="optionReveal rounded-[24px] border border-orange-100 bg-[#fffaf6] p-5">
                  <p className="text-sm font-bold text-[#252525]">
                    Complete UPI Payment
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Pay exactly {price} and enter your transaction ID.
                  </p>

                  <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row">
                    <div className="h-40 w-40 overflow-hidden rounded-2xl border bg-white p-2">
                      <img
                        src="/images/payment-qr.png"
                        alt="UPI Payment QR"
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-xs text-gray-400">UPI ID</p>

                      <p className="mt-1 break-all font-bold text-[#a8441b]">
                        {UPI_ID}
                      </p>

                      <p className="mt-4 text-xs leading-5 text-gray-500">
                        After payment, enter the UPI Transaction ID or UTR below.
                      </p>
                    </div>
                  </div>

                  <input
                    name="transactionId"
                    value={form.transactionId}
                    onChange={handleChange}
                    placeholder="UPI Transaction ID / UTR"
                    required
                    className="bookingInput mt-5"
                  />
                </div>
              )}

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={3}
                placeholder="Any special requirements?"
                className="bookingInput resize-none"
              />

              {sent && (
                <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-center text-sm font-semibold text-green-700">
                  Booking saved successfully. Opening My Bookings...
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !pujaType}
                className="flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#a8441b] text-sm font-bold text-white transition-all duration-300 hover:bg-[#873515] hover:shadow-[0_14px_30px_rgba(168,68,27,0.25)] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {loading
                  ? "Processing..."
                  : pujaType === "online"
                  ? `Submit Payment & Book • ${price}`
                  : pujaType === "offline"
                  ? `Confirm Offline Booking • ${price}`
                  : "Select Puja Type"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .bookingInput {
          width: 100%;
          min-height: 52px;
          border: 1px solid #ebe3de;
          border-radius: 14px;
          padding: 0 16px;
          font-size: 14px;
          color: #252525;
          outline: none;
          background: #fffdfb;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, transform 0.3s ease;
        }

        textarea.bookingInput {
          padding-top: 14px;
        }

        .bookingInput::placeholder {
          color: #a39790;
        }

        .bookingInput:hover {
          border-color: #dccbc0;
          background: #ffffff;
        }

        .bookingInput:focus {
          border-color: #a8441b;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(168, 68, 27, 0.08);
          transform: translateY(-1px);
        }

        .bookingSlide {
          animation: bookingSlide 0.85s cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .optionReveal {
          animation: optionReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        @keyframes bookingSlide {
          from {
            opacity: 0;
            transform: translateX(-70px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes optionReveal {
          from {
            opacity: 0;
            transform: translateY(15px);
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
        <div className="min-h-screen bg-white flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <BookingForm />
    </Suspense>
  );
}