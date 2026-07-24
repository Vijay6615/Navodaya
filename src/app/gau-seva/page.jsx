"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  Heart,
  Leaf,
  ShieldCheck,
  Wheat,
  Check,
  Copy,
  X,
  Loader2,
  LogIn,
} from "lucide-react";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const sevaOptions = [
  {
    amount: 501,
    title: "Gau Bhojan Seva",
    text: "Support nourishing food and daily care.",
  },
  {
    amount: 1100,
    title: "Gau Poshan Seva",
    text: "Contribute towards fodder and essential care.",
  },
  {
    amount: 2100,
    title: "Vishesh Gau Seva",
    text: "A heartfelt seva for continued protection and wellbeing.",
  },
];

const impact = [
  {
    icon: Wheat,
    title: "Poshan",
    text: "Support for fodder and nourishing food.",
  },
  {
    icon: Heart,
    title: "Daily Care",
    text: "Care offered with compassion and responsibility.",
  },
  {
    icon: ShieldCheck,
    title: "Protection",
    text: "Helping create safer, dignified care for Gau Mata.",
  },
];

export default function GauSevaPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [selectedAmount, setSelectedAmount] = useState(1100);
  const [customAmount, setCustomAmount] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [formError, setFormError] = useState("");
  const [bookingId, setBookingId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    sankalpName: "",
    gotra: "",
    message: "",
  });

  const finalAmount = customAmount
    ? Number(customAmount)
    : selectedAmount;

  const upiId = "9594943609@ptsbi";

  useEffect(() => {
    if (session?.user?.name) {
      setFormData((previous) => ({
        ...previous,
        name: previous.name || session.user.name,
      }));
    }
  }, [session]);

  const selectedSeva =
    sevaOptions.find((item) => item.amount === selectedAmount) ||
    sevaOptions[1];

  const sevaTitle = customAmount
    ? "Custom Gau Seva"
    : selectedSeva.title;

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  };

  const openBookingForm = () => {
    if (status === "loading") return;

    if (!session?.user?.email) {
      router.push(
        `/login?callbackUrl=${encodeURIComponent("/gau-seva")}`
      );
      return;
    }

    if (!Number.isFinite(finalAmount) || finalAmount < 1) {
      setFormError("Please select or enter a valid Seva amount.");
      return;
    }

    setFormError("");
    setShowBookingForm(true);
  };

  const submitBooking = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormError("Name and phone number are required.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const response = await fetch("/api/seva-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sevaType: sevaTitle,
          amount: finalAmount,
          name: formData.name,
          phone: formData.phone,
          sankalpName: formData.sankalpName,
          gotra: formData.gotra,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push(
          `/login?callbackUrl=${encodeURIComponent("/gau-seva")}`
        );
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to create Seva booking."
        );
      }

      setBookingId(data.booking?._id || data.bookingId || "");
      setShowBookingForm(false);
      setShowPayment(true);
    } catch (error) {
      setFormError(
        error.message || "Unable to create Seva booking."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Unable to copy UPI ID:", error);
    }
  };

  const handlePaymentCompleted = async () => {
    if (!bookingId) {
      setFormError("Booking ID is missing.");
      return;
    }

    try {
      setConfirmingPayment(true);

      const response = await fetch("/api/seva-bookings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          paymentStatus: "submitted",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to update payment status."
        );
      }

      router.push("/my-bookings?tab=seva");
      router.refresh();
    } catch (error) {
      setFormError(
        error.message || "Unable to update payment status."
      );
    } finally {
      setConfirmingPayment(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffdfb] text-[#24140f]">
      <section className="relative flex min-h-[82vh] items-end overflow-hidden">
        <img
          src="/images/Gau-Seva.png"
          alt="Gau Seva"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 md:px-12 md:pb-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#f1c9a8] md:text-xs">
            PREM · SEVA · PUNYA
          </p>

          <h1
            className={`${cormorant.className} mt-4 max-w-3xl text-5xl font-semibold leading-[0.9] text-white md:text-7xl lg:text-[88px]`}
          >
            Gau Seva.
            <br />
            An offering of compassion.
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-white/80 md:text-base">
            A sacred act of care, nourishment and gratitude. Offer your
            seva with faith and support the wellbeing of Gau Mata.
          </p>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("seva-options")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-7 inline-flex items-center gap-3 border border-[#8a351f] bg-[#9a3f27] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(80,31,18,0.22)] transition hover:-translate-y-0.5 hover:bg-[#87351f]"
          >
            Offer Gau Seva <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[0.8fr_1.2fr] md:gap-20 md:py-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a3f27]">
            A Sacred Offering
          </p>

          <h2
            className={`${cormorant.className} mt-4 text-5xl font-semibold leading-[0.95] md:text-6xl`}
          >
            Care offered
            <br />
            with devotion.
          </h2>
        </div>

        <div className="md:pt-8">
          <p className="text-base leading-8 text-[#66544c] md:text-lg">
            Gau Seva is rooted in compassion, gratitude and the timeless
            spirit of seva. Your offering supports nourishment and care
            while allowing you to participate in a meaningful sacred
            tradition.
          </p>

          <div className="mt-10 flex items-center gap-3 border-t border-[#e9dfd8] pt-7 text-sm text-[#6f554a]">
            <Leaf size={18} className="text-[#9a3f27]" />
            Seva performed with faith, dignity and care.
          </div>
        </div>
      </section>

      <section
        id="seva-options"
        className="border-y border-[#eee4dc] bg-[#f7f1ec]"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a3f27]">
              Choose Your Seva
            </p>

            <h2
              className={`${cormorant.className} mt-3 text-5xl font-semibold md:text-6xl`}
            >
              Offer from the heart.
            </h2>

            {!session?.user && status !== "loading" && (
              <p className="mt-4 flex items-center gap-2 text-sm text-[#79665d]">
                <LogIn size={16} className="text-[#9a3f27]" />
                Login is required before offering Seva.
              </p>
            )}
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {sevaOptions.map((item) => {
              const active =
                selectedAmount === item.amount && !customAmount;

              return (
                <button
                  type="button"
                  key={item.amount}
                  onClick={() => {
                    setSelectedAmount(item.amount);
                    setCustomAmount("");
                    setFormError("");
                  }}
                  className={`border p-7 text-left transition-all duration-300 md:p-8 ${
                    active
                      ? "-translate-y-1 border-[#431407] bg-[#431407] text-white shadow-xl"
                      : "border-[#e4d8cf] bg-[#fffdfb] hover:-translate-y-1 hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <p
                      className={`${cormorant.className} text-4xl font-semibold`}
                    >
                      ₹{item.amount}
                    </p>

                    {active && <Check size={19} />}
                  </div>

                  <h3 className="mt-8 text-base font-semibold">
                    {item.title}
                  </h3>

                  <p
                    className={`mt-2 text-sm leading-6 ${
                      active ? "text-white/65" : "text-[#79665d]"
                    }`}
                  >
                    {item.text}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-5 border border-[#e4d8cf] bg-[#fffdfb] p-5 md:flex-row md:items-center md:p-6">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a3f27]">
                Custom Seva Amount
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className={`${cormorant.className} text-3xl`}>
                  ₹
                </span>

                <input
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={(event) => {
                    setCustomAmount(event.target.value);
                    setFormError("");
                  }}
                  placeholder="Enter amount"
                  className="w-full border-b border-[#d9cbc1] bg-transparent py-2 text-lg outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={openBookingForm}
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-3 border border-[#8a351f] bg-[#9a3f27] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#87351f] disabled:cursor-wait disabled:opacity-60"
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Checking Login
                </>
              ) : session?.user ? (
                <>
                  Continue Seva <ArrowRight size={16} />
                </>
              ) : (
                <>
                  Login to Continue <LogIn size={16} />
                </>
              )}
            </button>
          </div>

          {formError && !showBookingForm && !showPayment && (
            <p className="mt-4 text-sm text-red-600">
              {formError}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a3f27]">
            Your Seva
          </p>

          <h2
            className={`${cormorant.className} mt-3 text-5xl font-semibold md:text-6xl`}
          >
            Care in every offering.
          </h2>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {impact.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className="border-t border-[#d9cbc1] pt-7">
              <div className="flex items-start justify-between">
                <Icon size={23} className="text-[#9a3f27]" />
                <span className="text-xs text-[#aa9890]">
                  0{index + 1}
                </span>
              </div>

              <h3
                className={`${cormorant.className} mt-8 text-3xl font-semibold`}
              >
                {title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#79665d]">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#431407] text-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d9a889]">
            Sacred Philosophy
          </p>

          <h2
            className={`${cormorant.className} mt-5 text-5xl font-semibold leading-[0.95] md:text-7xl`}
          >
            Compassion is a prayer
            <br className="hidden md:block" /> offered through action.
          </h2>

          <Link
            href="/pujas"
            className="mt-9 inline-flex items-center gap-3 border border-[#b25a3e] bg-[#9a3f27] px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            Explore Pujas <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {showBookingForm && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          onClick={() =>
            !submitting && setShowBookingForm(false)
          }
        >
          <div
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto border border-[#eadfd7] bg-[#fffdfb] p-7 shadow-2xl md:p-9"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowBookingForm(false)}
              className="absolute right-4 top-4 text-[#6d554b]"
              disabled={submitting}
            >
              <X size={20} />
            </button>

            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9a3f27]">
              Gau Seva Details
            </p>

            <h3
              className={`${cormorant.className} mt-2 text-4xl font-semibold md:text-5xl`}
            >
              Complete your sacred offering.
            </h3>

            <div className="mt-5 border-y border-[#eadfd7] py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#66544c]">
                    {sevaTitle}
                  </p>
                  <p className="mt-1 text-xs text-[#917f76]">
                    {session?.user?.email}
                  </p>
                </div>

                <span
                  className={`${cormorant.className} text-4xl font-semibold text-[#9a3f27]`}
                >
                  ₹{finalAmount}
                </span>
              </div>
            </div>

            <form
              onSubmit={submitBooking}
              className="mt-6 grid gap-5 md:grid-cols-2"
            >
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full name *"
                className="h-12 border border-[#ddcfc5] bg-white px-4 text-sm outline-none focus:border-[#9a3f27]"
              />

              <input
                value={session?.user?.email || ""}
                readOnly
                aria-label="Logged-in email"
                className="h-12 cursor-not-allowed border border-[#ddcfc5] bg-[#f5f0ec] px-4 text-sm text-[#77675f] outline-none"
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone number *"
                className="h-12 border border-[#ddcfc5] bg-white px-4 text-sm outline-none focus:border-[#9a3f27]"
              />

              <input
                name="sankalpName"
                value={formData.sankalpName}
                onChange={handleInputChange}
                placeholder="Sankalp name"
                className="h-12 border border-[#ddcfc5] bg-white px-4 text-sm outline-none focus:border-[#9a3f27]"
              />

              <input
                name="gotra"
                value={formData.gotra}
                onChange={handleInputChange}
                placeholder="Gotra (optional)"
                className="h-12 border border-[#ddcfc5] bg-white px-4 text-sm outline-none focus:border-[#9a3f27] md:col-span-2"
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Message or prayer"
                rows={4}
                className="border border-[#ddcfc5] bg-white px-4 py-3 text-sm outline-none focus:border-[#9a3f27] md:col-span-2"
              />

              {formError && (
                <p className="text-sm text-red-600 md:col-span-2">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex h-12 items-center justify-center gap-2 bg-[#9a3f27] text-sm font-semibold text-white hover:bg-[#87351f] disabled:opacity-60 md:col-span-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save & Continue to Payment
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {showPayment && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          onClick={() => setShowPayment(false)}
        >
          <div
            className="relative max-h-[94vh] w-full max-w-md overflow-y-auto border border-[#eadfd7] bg-[#fffdfb] p-7 shadow-2xl md:p-9"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowPayment(false)}
              className="absolute right-4 top-4 text-[#6d554b]"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <img
                src="/Pujadhamlogo1.png"
                alt="Puja Dham"
                className="mx-auto h-16 object-contain"
              />

              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9a3f27]">
                Gau Seva Offering
              </p>

              <h3
                className={`${cormorant.className} mt-2 text-4xl font-semibold`}
              >
                ₹{finalAmount}
              </h3>

              <p className="mt-2 text-sm text-[#79665d]">
                Scan the QR or use the UPI ID below.
              </p>

              {bookingId && (
                <p className="mt-2 break-all text-[10px] text-[#9a8a82]">
                  Booking ID: {bookingId}
                </p>
              )}

              <div className="mt-6 border border-[#e6dad1] p-4">
                <img
                  src="/paytmQr.jpeg"
                  alt="Payment QR"
                  className="mx-auto h-48 w-48 object-contain"
                />
              </div>

              <button
                type="button"
                onClick={copyUpi}
                className="mt-4 flex w-full items-center justify-between border border-[#dfd1c7] px-4 py-3 text-sm"
              >
                <span>{upiId}</span>
                {copied ? (
                  <Check size={17} />
                ) : (
                  <Copy size={17} />
                )}
              </button>

              {formError && (
                <p className="mt-4 text-sm text-red-600">
                  {formError}
                </p>
              )}

              <button
                type="button"
                onClick={handlePaymentCompleted}
                disabled={confirmingPayment}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 bg-[#9a3f27] px-5 text-sm font-semibold text-white transition hover:bg-[#87351f] disabled:opacity-60"
              >
                {confirmingPayment ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    I Have Completed Payment
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              <p className="mt-4 text-[11px] leading-5 text-[#9a8a82]">
                Payment will remain under verification until Pandit Ji
                confirms the transaction.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}