"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "../context/LanguageContext";
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
const displayFont = {
  className: "font-display-en",
};

const hindiDisplayFont = {
  className: "font-display-hi",
};

const sevaOptions = [
  {
    key: "bhojan",
    amount: 501,
    title: "Gau Bhojan Seva",
    text: "Support nourishing food and daily care.",
  },
  {
    key: "poshan",
    amount: 1100,
    title: "Gau Poshan Seva",
    text: "Contribute towards fodder and essential care.",
  },
  {
    key: "vishesh",
    amount: 2100,
    title: "Vishesh Gau Seva",
    text: "A heartfelt seva for continued protection and wellbeing.",
  },
];

const impact = [
  {
    key: "poshan",
    icon: Wheat,
    title: "Poshan",
    text: "Support for fodder and nourishing food.",
  },
  {
    key: "dailyCare",
    icon: Heart,
    title: "Daily Care",
    text: "Care offered with compassion and responsibility.",
  },
  {
    key: "protection",
    icon: ShieldCheck,
    title: "Protection",
    text: "Helping create safer, dignified care for Gau Mata.",
  },
];

export default function GauSevaPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { language, t } = useLanguage();

  const headingFontClass =
    language === "hi"
      ? hindiDisplayFont.className
      : displayFont.className;

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

  const displaySevaTitle = customAmount
    ? t("gauSeva.options.custom.title")
    : t(
        `gauSeva.options.${selectedSeva.key}.title`,
        selectedSeva.title
      );

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
      setFormError(t("gauSeva.errors.invalidAmount"));
      return;
    }

    setFormError("");
    setShowBookingForm(true);
  };

  const submitBooking = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormError(t("gauSeva.errors.namePhoneRequired"));
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
          data.message || t("gauSeva.errors.createBooking")
        );
      }

      setBookingId(data.booking?._id || data.bookingId || "");
      setShowBookingForm(false);
      setShowPayment(true);
    } catch (error) {
      setFormError(
        error.message || t("gauSeva.errors.createBooking")
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
      setFormError(t("gauSeva.errors.bookingIdMissing"));
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
          data.message || t("gauSeva.errors.updatePayment")
        );
      }

      router.push("/my-bookings?tab=seva");
      router.refresh();
    } catch (error) {
      setFormError(
        error.message || t("gauSeva.errors.updatePayment")
      );
    } finally {
      setConfirmingPayment(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffdfb] text-[#24140f]">
      <section className="relative flex min-h-[82vh] items-end overflow-hidden">
        <Image
          src="/images/Gau-Seva.png"
          alt="Gau Seva"
          fill
          priority
          fetchPriority="high"
          quality={78}
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 md:px-12 md:pb-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#f1c9a8] md:text-xs">
            {t("gauSeva.hero.eyebrow")}
          </p>

          <h1
            className={`${headingFontClass} mt-4 max-w-3xl text-5xl font-semibold leading-[0.9] text-white md:text-7xl lg:text-[88px]`}
          >
            {t("gauSeva.hero.titleLine1")}
            <br />
            {t("gauSeva.hero.titleLine2")}
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-white/80 md:text-base">
            {t("gauSeva.hero.description")}
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
            {t("gauSeva.hero.button")} <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section
        className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[0.8fr_1.2fr] md:gap-20 md:py-28"
        style={{
          contentVisibility: "auto",
          containIntrinsicSize: "650px",
        }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a3f27]">
            {t("gauSeva.about.eyebrow")}
          </p>

          <h2
            className={`${headingFontClass} mt-4 text-5xl font-semibold leading-[0.95] md:text-6xl`}
          >
            Care offered
            <br />
            {t("gauSeva.about.titleLine2")}
          </h2>
        </div>

        <div className="md:pt-8">
          <p className="text-base leading-8 text-[#66544c] md:text-lg">
            {t("gauSeva.about.description")}
          </p>

          <div className="mt-10 flex items-center gap-3 border-t border-[#e9dfd8] pt-7 text-sm text-[#6f554a]">
            <Leaf size={18} className="text-[#9a3f27]" />
            {t("gauSeva.about.note")}
          </div>
        </div>
      </section>

      <section
        id="seva-options"
        className="border-y border-[#eee4dc] bg-[#f7f1ec]"
        style={{
          contentVisibility: "auto",
          containIntrinsicSize: "900px",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a3f27]">
              {t("gauSeva.choose.eyebrow")}
            </p>

            <h2
              className={`${headingFontClass} mt-3 text-5xl font-semibold md:text-6xl`}
            >
              {t("gauSeva.choose.title")}
            </h2>

            {!session?.user && status !== "loading" && (
              <p className="mt-4 flex items-center gap-2 text-sm text-[#79665d]">
                <LogIn size={16} className="text-[#9a3f27]" />
                {t("gauSeva.choose.loginRequired")}
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
                      className={`${headingFontClass} text-4xl font-semibold`}
                    >
                      ₹{item.amount}
                    </p>

                    {active && <Check size={19} />}
                  </div>

                  <h3 className="mt-8 text-base font-semibold">
                    {t(
                      `gauSeva.options.${item.key}.title`,
                      item.title
                    )}
                  </h3>

                  <p
                    className={`mt-2 text-sm leading-6 ${
                      active ? "text-white/65" : "text-[#79665d]"
                    }`}
                  >
                    {t(
                      `gauSeva.options.${item.key}.text`,
                      item.text
                    )}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-5 border border-[#e4d8cf] bg-[#fffdfb] p-5 md:flex-row md:items-center md:p-6">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a3f27]">
                {t("gauSeva.choose.customAmount")}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className={`${headingFontClass} text-3xl`}>
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
                  placeholder={t("gauSeva.choose.amountPlaceholder")}
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
                  {t("gauSeva.buttons.checkingLogin")}
                </>
              ) : session?.user ? (
                <>
                  {t("gauSeva.buttons.continueSeva")} <ArrowRight size={16} />
                </>
              ) : (
                <>
                  {t("gauSeva.buttons.loginContinue")} <LogIn size={16} />
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

      <section
        className="mx-auto max-w-6xl px-6 py-20 md:py-28"
        style={{
          contentVisibility: "auto",
          containIntrinsicSize: "620px",
        }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a3f27]">
            {t("gauSeva.impact.eyebrow")}
          </p>

          <h2
            className={`${headingFontClass} mt-3 text-5xl font-semibold md:text-6xl`}
          >
            {t("gauSeva.impact.title")}
          </h2>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {impact.map(
            ({ key, icon: Icon, title, text }, index) => (
            <div key={key} className="border-t border-[#d9cbc1] pt-7">
              <div className="flex items-start justify-between">
                <Icon size={23} className="text-[#9a3f27]" />
                <span className="text-xs text-[#aa9890]">
                  0{index + 1}
                </span>
              </div>

              <h3
                className={`${headingFontClass} mt-8 text-3xl font-semibold`}
              >
                {t(
                  `gauSeva.impact.items.${key}.title`,
                  title
                )}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#79665d]">
                {t(
                  `gauSeva.impact.items.${key}.text`,
                  text
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="bg-[#431407] text-white"
        style={{
          contentVisibility: "auto",
          containIntrinsicSize: "500px",
        }}
      >
        <div className="mx-auto max-w-5xl px-6 py-20 text-center md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d9a889]">
            {t("gauSeva.philosophy.eyebrow")}
          </p>

          <h2
            className={`${headingFontClass} mt-5 text-5xl font-semibold leading-[0.95] md:text-7xl`}
          >
            {t("gauSeva.philosophy.titleLine1")}
            <br className="hidden md:block" /> {t("gauSeva.philosophy.titleLine2")}
          </h2>

          <Link
            href="/pujas"
            className="mt-9 inline-flex items-center gap-3 border border-[#b25a3e] bg-[#9a3f27] px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            {t("gauSeva.philosophy.button")} <ArrowRight size={16} />
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
              {t("gauSeva.form.eyebrow")}
            </p>

            <h3
              className={`${headingFontClass} mt-2 text-4xl font-semibold md:text-5xl`}
            >
              {t("gauSeva.form.title")}
            </h3>

            <div className="mt-5 border-y border-[#eadfd7] py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#66544c]">
                    {displaySevaTitle}
                  </p>
                  <p className="mt-1 text-xs text-[#917f76]">
                    {session?.user?.email}
                  </p>
                </div>

                <span
                  className={`${headingFontClass} text-4xl font-semibold text-[#9a3f27]`}
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
                placeholder={t("gauSeva.form.fullName")}
                className="h-12 border border-[#ddcfc5] bg-white px-4 text-sm outline-none focus:border-[#9a3f27]"
              />

              <input
                value={session?.user?.email || ""}
                readOnly
                aria-label={t("gauSeva.form.loggedEmail")}
                className="h-12 cursor-not-allowed border border-[#ddcfc5] bg-[#f5f0ec] px-4 text-sm text-[#77675f] outline-none"
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={t("gauSeva.form.phone")}
                className="h-12 border border-[#ddcfc5] bg-white px-4 text-sm outline-none focus:border-[#9a3f27]"
              />

              <input
                name="sankalpName"
                value={formData.sankalpName}
                onChange={handleInputChange}
                placeholder={t("gauSeva.form.sankalpName")}
                className="h-12 border border-[#ddcfc5] bg-white px-4 text-sm outline-none focus:border-[#9a3f27]"
              />

              <input
                name="gotra"
                value={formData.gotra}
                onChange={handleInputChange}
                placeholder={t("gauSeva.form.gotra")}
                className="h-12 border border-[#ddcfc5] bg-white px-4 text-sm outline-none focus:border-[#9a3f27] md:col-span-2"
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder={t("gauSeva.form.message")}
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
                    {t("gauSeva.buttons.saving")}
                  </>
                ) : (
                  <>
                    {t("gauSeva.buttons.savePayment")}
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
                loading="lazy"
                decoding="async"
                className="mx-auto h-16 object-contain"
              />

              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9a3f27]">
                {t("gauSeva.payment.eyebrow")}
              </p>

              <h3
                className={`${headingFontClass} mt-2 text-4xl font-semibold`}
              >
                ₹{finalAmount}
              </h3>

              <p className="mt-2 text-sm text-[#79665d]">
                {t("gauSeva.payment.description")}
              </p>

              {bookingId && (
                <p className="mt-2 break-all text-[10px] text-[#9a8a82]">
                  {t("gauSeva.payment.bookingId")}: {bookingId}
                </p>
              )}

              <div className="mt-6 border border-[#e6dad1] p-4">
                <img
                  src="/paytmQr.jpeg"
                  alt="Payment QR"
                  loading="lazy"
                  decoding="async"
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
                    {t("gauSeva.buttons.updating")}
                  </>
                ) : (
                  <>
                    {t("gauSeva.buttons.paymentCompleted")}
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              <p className="mt-4 text-[11px] leading-5 text-[#9a8a82]">
                {t("gauSeva.payment.verificationNote")}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}