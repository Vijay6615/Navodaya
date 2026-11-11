"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  Home,
  IndianRupee,
  Loader2,
  Mail,
  MapPin,
  MessageSquareText,
  PackageCheck,
  Phone,
  ReceiptText,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Tag,
  Trash2,
  User,
  Video,
  WalletCards,
  XCircle,
  ShoppingBag,
  Truck,
  Check,
} from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_META = {
  pending: {
    labelKey: "myBookings.status.pending",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  placed: {
    labelKey: "myBookings.status.placed",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  dispatched: {
    labelKey: "myBookings.status.dispatched",
    badge: "border-indigo-200 bg-indigo-50 text-indigo-700",
    dot: "bg-indigo-500",
  },
  delivered: {
    labelKey: "myBookings.status.delivered",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dot: "bg-emerald-600",
  },
  submitted: {
    labelKey: "myBookings.status.submitted",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  confirmed: {
    labelKey: "myBookings.status.confirmed",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  success: {
    labelKey: "myBookings.status.confirmed",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  completed: {
    labelKey: "myBookings.status.completed",
    badge: "border-green-200 bg-green-50 text-green-800",
    dot: "bg-green-600",
  },
  cancelled: {
    labelKey: "myBookings.status.cancelled",
    badge: "border-red-200 bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
  rejected: {
    labelKey: "myBookings.status.rejected",
    badge: "border-red-200 bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
  failed: {
    labelKey: "myBookings.status.failed",
    badge: "border-red-200 bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
};

function normalizeStatus(value) {
  return String(value || "pending").toLowerCase().trim();
}

function getStatusMeta(value) {
  return STATUS_META[normalizeStatus(value)] || STATUS_META.pending;
}

function formatDateTime(
  value,
  language,
  fallback
) {
  if (!value) return fallback;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString(
    language === "hi" ? "hi-IN" : "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function formatBookingDate(
  value,
  language,
  fallback
) {
  if (!value) return fallback;

  const date = new Date(
    `${value}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString(
    language === "hi" ? "hi-IN" : "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function bookingKey(booking, index = 0) {
  return (
    booking?.bookingId ||
    booking?._id ||
    booking?.transactionId ||
    `${booking?.email || "booking"}-${booking?.date || "date"}-${
      booking?.pujaName || booking?.puja || booking?.sevaType || "service"
    }-${index}`
  );
}

function mergeBookings(localBookings, apiBookings) {
  const records = new Map();

  [...localBookings, ...apiBookings].forEach((booking, index) => {
    const key = bookingKey(booking, index);
    const previous = records.get(key) || {};

    records.set(key, {
      ...previous,
      ...booking,
    });
  });

  return Array.from(records.values()).sort((a, b) => {
    const first = new Date(a.createdAt || a.date || 0).getTime();
    const second = new Date(b.createdAt || b.date || 0).getTime();
    return second - first;
  });
}

function StatusBadge({ status, t }) {
  const meta = getStatusMeta(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${meta.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {t(meta.labelKey)}
    </span>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  fallback = "",
  className = "",
  valueClassName = "",
}) {
  return (
    <div
      className={`flex min-w-0 items-start gap-3 rounded-2xl border border-[#eee8e2] bg-[#fbfaf8] p-3.5 ${className}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#a8441b] shadow-sm">
        <Icon size={16} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
          {label}
        </p>
        <p
          className={`mt-1 break-words text-xs font-semibold leading-5 text-[#38322e] sm:text-sm ${valueClassName}`}
        >
          {value || fallback || "—"}
        </p>
      </div>
    </div>
  );
}

function SectionLabel({ icon: Icon, title, description }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff1e7] text-[#a8441b]">
        <Icon size={17} />
      </span>

      <div>
        <h4 className="text-sm font-bold text-[#2e2925]">{title}</h4>
        {description && (
          <p className="mt-0.5 text-[10px] leading-4 text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function PriceRow({
  label,
  value,
  fallback = "",
  strong = false,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-2.5 text-xs sm:text-sm ${
        strong ? "font-bold text-[#173f32]" : "text-gray-600"
      }`}
    >
      <span>{label}</span>
      <span className="shrink-0 font-bold">{value || fallback || "—"}</span>
    </div>
  );
}

function PujaBookingCard({
  booking,
  index,
  onBookingAction,
  actionLoading,
  language,
  t,
}) {
  const status = normalizeStatus(booking.status);
  const isCompleted = status === "completed";
  const canCancel = ["pending", "confirmed", "success"].includes(status);

  const notAvailable = t(
    "myBookings.common.notAvailable"
  );

  const bookingId = booking.bookingId || booking._id || `PUJA-${index + 1}`;
  const pujaName = booking.pujaName || booking.puja || t("myBookings.puja.defaultName");
  const pujaType = booking.pujaType || t("myBookings.puja.offlinePuja");
  const isOnline = pujaType.toLowerCase().includes("online");

  const isSpecialEvent =
    booking.bookingSource === "special_event" ||
    Boolean(booking.eventTitle);

  const eventOffer =
    booking.eventOffer || t("myBookings.puja.noOffer");

  const eventMonth =
    booking.eventMonth || t("myBookings.common.notSpecified");

  const bookingCategory =
    booking.bookingCategory ||
    (isSpecialEvent ? t("myBookings.puja.monthlyEvent") : t("myBookings.puja.regularPuja"));

  const customerName =
    booking.name || booking.customerName || booking.userName || notAvailable;
  const email = booking.email || booking.userEmail || notAvailable;
  const phone = booking.phone || notAvailable;
  const address =
    booking.address ||
    (isOnline ? t("myBookings.puja.onlineNoVenue") : notAvailable);

  const basePrice = booking.basePrice || booking.price || notAvailable;
  const samagriCharge = booking.samagriCharge || "₹ 0";
  const totalPrice =
    booking.totalPrice || booking.price || booking.amount || notAvailable;

  const samagriProvidedBy =
    booking.samagriProvidedBy ||
    (String(booking.samagriOption || "")
      .toLowerCase()
      .includes("pandit")
      ? "Pandit Ji"
      : "Customer");

  const samagriOption =
    booking.samagriOption ||
    (samagriProvidedBy === "Pandit Ji"
      ? t("myBookings.puja.panditSamagri")
      : t("myBookings.puja.customerSamagri"));

  const samagriItems = Array.isArray(booking.samagriItems)
    ? booking.samagriItems.filter(Boolean)
    : [];

  const transactionId =
    booking.transactionId ||
    (isOnline ? t("myBookings.common.notProvided") : t("myBookings.puja.payOnService"));

  return (
    <article
      className="overflow-hidden rounded-[26px] border border-[#eadfd7] bg-white shadow-[0_14px_40px_rgba(65,40,22,0.06)]"
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "1200px",
      }}
    >
      <div className="border-b border-[#eee4dc] bg-gradient-to-br from-[#fff8f2] via-white to-[#f4faf6] p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={status} t={t} />

              <span className="inline-flex items-center gap-1 rounded-full border border-[#eadfd7] bg-white px-2.5 py-1 text-[10px] font-bold text-gray-600">
                {isOnline ? <Video size={12} /> : <Home size={12} />}
                {pujaType}
              </span>

              {isSpecialEvent && (
                <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700">
                  <Sparkles size={12} />
                  {t("myBookings.puja.specialEvent")}
                </span>
              )}
            </div>

            <h2 className="mt-3 break-words text-xl font-extrabold leading-7 text-[#27221f] sm:text-2xl">
              {pujaName}
            </h2>

            <p className="mt-1 break-all font-mono text-[10px] text-gray-400 sm:text-[11px]">
              {t("myBookings.common.bookingId")}: {bookingId}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#d8e7dd] bg-white/90 px-4 py-3 sm:block sm:min-w-[145px] sm:text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#5f7b6d]">
              {t("myBookings.common.totalAmount")}
            </p>
            <p
              className={`mt-1 font-extrabold text-[#173f32] ${
                isSpecialEvent
                  ? "max-w-[150px] text-right text-sm leading-5"
                  : "text-xl"
              }`}
            >
              {totalPrice}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div className="rounded-2xl border border-white bg-white/80 p-3">
            <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
              {t("myBookings.puja.pujaDate")}
            </p>
            <p className="mt-1 text-xs font-bold text-[#38322e]">
              {formatBookingDate(booking.date, language, t("myBookings.common.dateNotSelected"))}
            </p>
          </div>

          <div className="rounded-2xl border border-white bg-white/80 p-3">
            <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
              {t("myBookings.puja.timeSlot")}
            </p>
            <p className="mt-1 break-words text-xs font-bold text-[#38322e]">
              {booking.timeSlot || booking.slot || t("myBookings.common.flexible")}
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-white bg-white/80 p-3 sm:col-span-1">
            <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
              {isSpecialEvent ? t("myBookings.puja.bookingType") : t("myBookings.puja.samagri")}
            </p>
            <p className="mt-1 break-words text-xs font-bold text-[#38322e]">
              {isSpecialEvent
                ? t("myBookings.puja.specialEvent")
                : samagriProvidedBy === "Pandit Ji"
                ? t("myBookings.puja.byPanditJi")
                : samagriProvidedBy === "To be confirmed"
                ? t("myBookings.common.toBeConfirmed")
                : t("myBookings.puja.selfArranged")}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        <section>
          <SectionLabel
            icon={User}
            title={t("myBookings.sections.devoteeDetails")}
            description={t("myBookings.sections.contactInfo")}
          />

          <div className="grid gap-2.5 sm:grid-cols-2">
            <InfoItem icon={User} label={t("myBookings.fields.fullName")} value={customerName} />
            <InfoItem
              icon={Phone}
              label={t("myBookings.fields.phoneNumber")}
              value={phone}
              valueClassName="break-all"
            />
            <InfoItem
              icon={Mail}
              label={t("myBookings.fields.emailAddress")}
              value={email}
              valueClassName="break-all"
            />
            <InfoItem
              icon={MapPin}
              label={isOnline ? t("myBookings.fields.pujaVenue") : t("myBookings.fields.completeAddress")}
              value={address}
            />
          </div>
        </section>

        {isSpecialEvent && (
          <section className="rounded-[22px] border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-[#fff8f2] p-4">
            <SectionLabel
              icon={Sparkles}
              title={t("myBookings.sections.specialEventDetails")}
              description={t("myBookings.sections.eventInfo")}
            />

            <div className="grid gap-2.5 sm:grid-cols-2">
              <InfoItem
                icon={Sparkles}
                label={t("myBookings.fields.bookingCategory")}
                value={bookingCategory}
              />

              <InfoItem
                icon={CalendarDays}
                label={t("myBookings.fields.eventMonth")}
                value={eventMonth}
              />

              <InfoItem
                icon={Tag}
                label={t("myBookings.fields.eventOffer")}
                value={eventOffer}
              />

              <InfoItem
                icon={Clock3}
                label={t("myBookings.fields.priceStatus")}
                value={totalPrice}
              />
            </div>
          </section>
        )}

        <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[22px] border border-[#eee6df] bg-[#fffdfb] p-4">
            <SectionLabel
              icon={PackageCheck}
              title={t("myBookings.sections.samagriArrangement")}
              description={t("myBookings.sections.materialsSelected")}
            />

            <div className="rounded-2xl border border-[#eee4dc] bg-white p-3.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">
                {t("myBookings.puja.selectedOption")}
              </p>
              <p className="mt-1.5 text-sm font-bold leading-6 text-[#342e2a]">
                {samagriOption}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#f2f6f3] px-3 py-1.5 text-[10px] font-bold text-[#416b56]">
                  {t("myBookings.puja.provider")}: {samagriProvidedBy}
                </span>
                <span className="rounded-full bg-[#fff3e9] px-3 py-1.5 text-[10px] font-bold text-[#a8441b]">
                  {t("myBookings.puja.charge")}: {samagriCharge}
                </span>
              </div>
            </div>

            {samagriItems.length > 0 ? (
              <div className="mt-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">
                  {t("myBookings.puja.includedSamagri")} ({samagriItems.length})
                </p>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {samagriItems.map((item, itemIndex) => (
                    <span
                      key={`${item}-${itemIndex}`}
                      className="rounded-full border border-[#eadfd7] bg-white px-2.5 py-1.5 text-[10px] font-semibold text-gray-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-[11px] leading-5 text-gray-400">
                {isSpecialEvent
                  ? t("myBookings.puja.samagriConfirmedLater")
                  : t("myBookings.puja.noSamagriItems")}
              </p>
            )}
          </div>

          <div className="rounded-[22px] border border-[#dbe9e0] bg-gradient-to-br from-[#eef8f2] to-[#fbfdfb] p-4">
            <SectionLabel
              icon={ReceiptText}
              title={t("myBookings.sections.pricePayment")}
              description={
                isSpecialEvent
                  ? t("myBookings.puja.finalPriceLater")
                  : t("myBookings.puja.priceBreakdown")
              }
            />

            <div className="divide-y divide-[#dce9e1] rounded-2xl bg-white/75 px-3.5">
              <PriceRow label={t("myBookings.price.basePuja")} value={basePrice} fallback={notAvailable} />
              <PriceRow label={t("myBookings.price.samagriCharge")} value={samagriCharge} fallback={notAvailable} />
              <PriceRow
                label={t("myBookings.price.totalBooking")}
                value={totalPrice}
                strong
              />
            </div>

            <div className="mt-3 rounded-2xl bg-[#173f32] p-3.5 text-white">
              <div className="flex items-center gap-2">
                <WalletCards size={16} className="text-[#bfe4cf]" />
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/60">
                  {t("myBookings.puja.paymentTransaction")}
                </p>
              </div>

              <p className="mt-2 break-all font-mono text-xs font-bold leading-5 text-white">
                {transactionId}
              </p>

              <p className="mt-2 text-[10px] leading-4 text-white/60">
                {isOnline
                  ? t("myBookings.puja.onlinePaymentVerification")
                  : t("myBookings.puja.paymentByArrangement")}
              </p>
            </div>
          </div>
        </section>

        {booking.message && (
          <section className="rounded-[22px] border border-[#efe1ce] bg-[#fffaf1] p-4">
            <SectionLabel
              icon={MessageSquareText}
              title={t("myBookings.sections.specialInstructions")}
              description={t("myBookings.sections.messageShared")}
            />

            <p className="whitespace-pre-wrap break-words text-xs leading-6 text-gray-600 sm:text-sm">
              {booking.message}
            </p>
          </section>
        )}

        <div className="border-t border-[#eee8e2] pt-4">
          {isCompleted && (
            <div className="mb-3 flex items-start gap-3 rounded-[18px] border border-emerald-200 bg-emerald-50 p-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                <CheckCircle2 size={17} />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-bold text-emerald-900">
                  {t("myBookings.puja.completedTitle")}
                </p>
                <p className="mt-1 text-[10px] leading-5 text-emerald-700">
                  {t("myBookings.puja.completedDescription")}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-[10px] leading-5 text-gray-400 sm:text-[11px]">
              <CalendarDays
                size={14}
                className="mt-0.5 shrink-0 text-[#a8441b]"
              />
              <span>
                {t("myBookings.common.bookingCreated")}:{" "}
                <strong className="font-semibold text-gray-600">
                  {formatDateTime(booking.createdAt, language, notAvailable)}
                </strong>
              </span>
            </div>

            {isCompleted || status === "cancelled" ? (
              <button
                type="button"
                disabled={actionLoading === bookingKey(booking, index)}
                onClick={() =>
                  onBookingAction(booking, index, "delete-completed")
                }
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-bold text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {actionLoading === bookingKey(booking, index) ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                {t("myBookings.actions.deleteHistory")}
              </button>
            ) : canCancel ? (
              <button
                type="button"
                disabled={actionLoading === bookingKey(booking, index)}
                onClick={() => onBookingAction(booking, index, "cancel")}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {actionLoading === bookingKey(booking, index) ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <XCircle size={14} />
                )}
                {t("myBookings.actions.cancelBooking")}
              </button>
            ) : (
              <span className="inline-flex min-h-10 items-center justify-center rounded-xl bg-gray-100 px-4 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                {t("myBookings.actions.noAction")}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function SevaBookingCard({
  booking,
  index,
  language,
  t,
}) {
  const bookingStatus = booking.bookingStatus || booking.status || "pending";
  const paymentStatus = booking.paymentStatus || "pending";
  const amount =
    typeof booking.amount === "string" &&
    booking.amount.trim().startsWith("₹")
      ? booking.amount
      : `₹${Number(booking.amount || 0).toLocaleString("en-IN")}`;

  return (
    <article
      className="overflow-hidden rounded-[26px] border border-[#eadfd7] bg-white shadow-[0_14px_40px_rgba(65,40,22,0.06)]"
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "650px",
      }}
    >
      <div className="border-b border-[#eee4dc] bg-gradient-to-br from-[#fff8f2] via-white to-[#fffdf8] p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={bookingStatus} t={t} />
              <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase text-blue-700">
                {t("myBookings.seva.payment")}: {paymentStatus}
              </span>
            </div>

            <h2 className="mt-3 text-xl font-extrabold text-[#27221f] sm:text-2xl">
              {booking.sevaType || t("myBookings.seva.defaultName")}
            </h2>

            <p className="mt-1 break-all font-mono text-[10px] text-gray-400">
              {t("myBookings.common.bookingId")}: {booking.bookingId || booking._id || `SEVA-${index + 1}`}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#efe2cf] bg-white px-4 py-3 sm:block sm:min-w-[140px] sm:text-right">
            <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
              {t("myBookings.seva.amount")}
            </p>
            <p className="mt-1 text-xl font-extrabold text-[#a8441b]">
              {amount}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="grid gap-2.5 sm:grid-cols-2">
          <InfoItem
            icon={User}
            label={t("myBookings.fields.devoteeName")}
            value={booking.name || booking.userName}
          />
          <InfoItem
            icon={Phone}
            label={t("myBookings.fields.phoneNumber")}
            value={booking.phone}
            valueClassName="break-all"
          />
          <InfoItem
            icon={Mail}
            label={t("myBookings.fields.emailAddress")}
            value={booking.email || booking.userEmail}
            valueClassName="break-all"
          />
          <InfoItem
            icon={Sparkles}
            label={t("myBookings.fields.sankalpName")}
            value={booking.sankalpName || t("myBookings.common.notProvided")}
          />
          <InfoItem
            icon={HeartHandshake}
            label={t("myBookings.fields.gotra")}
            value={booking.gotra || t("myBookings.common.notProvided")}
          />
          <InfoItem
            icon={CalendarDays}
            label={t("myBookings.fields.bookedOn")}
            value={formatDateTime(booking.createdAt, language, notAvailable)}
          />
        </div>

        {booking.message && (
          <div className="rounded-[22px] border border-[#efe1ce] bg-[#fffaf1] p-4">
            <SectionLabel
              icon={MessageSquareText}
              title={t("myBookings.sections.prayerMessage")}
            />
            <p className="whitespace-pre-wrap break-words text-xs leading-6 text-gray-600 sm:text-sm">
              {booking.message}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}


function StoreOrderCard({ order, index, language, t }) {
  const isHindi = language === "hi";
  const rawStatus = (order.status || "placed").toLowerCase();

  const isCancelled = rawStatus === "cancelled";
  const isDelivered = rawStatus === "delivered";
  const isDispatched = rawStatus === "dispatched" || isDelivered;
  const isPlaced = true;

  const orderId = order.orderId || order._id || `STORE-${index + 1}`;
  const totalAmount = order.pricing?.total ? `₹${order.pricing.total}` : "—";
  const deliveryFee =
    order.pricing?.deliveryFee === 0
      ? isHindi
        ? "मुफ़्त"
        : "FREE"
      : `₹${order.pricing?.deliveryFee || 0}`;

  return (
    <article
      className="overflow-hidden rounded-[26px] border border-[#eadfd7] bg-white shadow-[0_14px_40px_rgba(65,40,22,0.06)]"
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "900px",
      }}
    >
      <div className="border-b border-[#eee4dc] bg-gradient-to-br from-[#fffaf6] via-white to-[#f4faf6] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                <ShoppingBag size={12} />
                {isHindi ? "सामग्री ऑर्डर" : "Store Order"}
              </span>

              <StatusBadge status={rawStatus} t={t} />

              <span className="inline-flex items-center gap-1 rounded-full border border-[#eadfd7] bg-white px-2.5 py-1 text-[10px] font-bold text-gray-600">
                {order.paymentMethod === "cod"
                  ? isHindi
                    ? "कैश ऑन डिलीवरी"
                    : "Cash on Delivery"
                  : "Prepaid"}
              </span>
            </div>

            <h2 className="mt-2 text-lg font-extrabold text-[#27221f] sm:text-xl">
              {isHindi ? "पूजन सामग्री एवं प्रसाद" : "Puja Samagri & Prasad"} (
              {order.items?.length || 0} {isHindi ? "सामग्री" : "items"})
            </h2>

            <p className="mt-1 font-mono text-[11px] text-gray-500">
              {t("myBookings.common.bookingId")}:{" "}
              <strong className="text-[#a8441b]">{orderId}</strong>
            </p>
          </div>

          <div className="shrink-0 rounded-[18px] border border-[#dce9e1] bg-white px-4 py-2.5 text-left sm:text-right">
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
              {isHindi ? "कुल भुगतान" : "Total Amount"}
            </span>
            <p className="text-xl font-black text-[#a8441b]">{totalAmount}</p>
          </div>
        </div>

        {/* LIVE TRACKING BAR */}
        <div className="mt-5 rounded-2xl border border-[#ebdcd1] bg-[#fffaf5] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8b5d3b]">
            {isHindi ? "लाइव डिलीवरी स्टेटस (Live Tracking)" : "Live Order Status Tracking"}
          </p>

          {isCancelled ? (
            <div className="mt-2 flex items-center gap-2 text-xs font-bold text-red-600">
              <XCircle size={16} />
              <span>
                {isHindi
                  ? "यह ऑर्डर रद्द कर दिया गया है।"
                  : "This order has been cancelled."}
              </span>
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    isPlaced
                      ? "bg-[#26734d] text-white shadow"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Check size={14} />
                </div>
                <span className="mt-1.5 text-[11px] font-bold text-[#2b221d]">
                  {isHindi ? "ऑर्डर दर्ज" : "Placed"}
                </span>
                <span className="text-[9px] text-gray-400">
                  {formatDateTime(order.createdAt, language, "")}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    isDispatched
                      ? "bg-[#26734d] text-white shadow"
                      : "border border-amber-300 bg-amber-100 text-amber-800"
                  }`}
                >
                  {isDispatched ? <Check size={14} /> : <Truck size={14} />}
                </div>
                <span className="mt-1.5 text-[11px] font-bold text-[#2b221d]">
                  {isHindi ? "डिस्पैच / रवाना" : "Dispatched"}
                </span>
                <span className="text-[9px] text-gray-400">
                  {isDispatched
                    ? isHindi
                      ? "रास्ते में"
                      : "In Transit"
                    : isHindi
                    ? "तैयार हो रहा है"
                    : "Preparing"}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    isDelivered
                      ? "bg-[#26734d] text-white shadow"
                      : "border border-gray-200 bg-gray-100 text-gray-400"
                  }`}
                >
                  {isDelivered ? <Check size={14} /> : <PackageCheck size={14} />}
                </div>
                <span className="mt-1.5 text-[11px] font-bold text-[#2b221d]">
                  {isHindi ? "डिलीवर हुआ" : "Delivered"}
                </span>
                <span className="text-[9px] text-gray-400">
                  {isDelivered
                    ? isHindi
                      ? "सफलतापूर्वक पहुंचा"
                      : "Delivered"
                    : isHindi
                    ? "2-4 दिन"
                    : "2-4 Days"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-[#eadfd7] bg-white p-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a8441b]">
              <PackageCheck size={15} />
              <span>
                {isHindi ? "सामग्री सूची" : "Ordered Items"} (
                {order.items?.length || 0})
              </span>
            </h4>

            <div className="mt-3 divide-y divide-[#f4efeb]">
              {(order.items || []).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 text-xs"
                >
                  <div>
                    <p className="font-bold text-[#2b221d]">
                      {isHindi ? item.titleHi || item.title : item.title}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Qty: {item.quantity}{" "}
                      {item.weight ? `• ${item.weight}` : ""}
                    </p>
                  </div>
                  <span className="font-extrabold text-[#2b221d]">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between border-t border-[#f2eae4] pt-3 text-xs font-medium text-gray-500">
              <span>{isHindi ? "डिलीवरी शुल्क" : "Delivery Fee"}</span>
              <span className="font-bold text-[#26734d]">{deliveryFee}</span>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-[#eadfd7] bg-[#fbfaf8] p-4">
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5c4f46]">
                <MapPin size={15} className="text-[#a8441b]" />
                <span>{isHindi ? "डिलीवरी का पता" : "Shipping Destination"}</span>
              </h4>

              <p className="mt-3 text-xs font-bold text-[#2b221d]">
                {order.customer?.fullName || "Devotee"}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#5c4f46]">
                {order.shippingAddress?.address}
                {order.shippingAddress?.landmark
                  ? `, Near ${order.shippingAddress.landmark}`
                  : ""}
                <br />
                {order.shippingAddress?.city} - {order.shippingAddress?.pincode}
              </p>
              <p className="mt-2 text-xs text-[#5c4f46]">
                📞 {order.customer?.phone}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#eee8e2] pt-3">
              <span className="font-mono text-[10px] text-gray-400">
                {isHindi ? "भुगतान: डिलीवरी पर" : "Payment: Cash on Delivery"}
              </span>

              <a
                href={`https://wa.me/919594943609?text=${encodeURIComponent(
                  `Namaste Puja Dham, I am inquiring about my store order: ${orderId}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-[#26734d] bg-[#eaf7ef] px-3 py-1 text-[11px] font-bold text-[#26734d] transition hover:bg-[#26734d] hover:text-white"
              >
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ activeTab, t }) {
  const isStore = activeTab === "store";
  const isSeva = activeTab === "seva";

  return (
    <div className="flex min-h-[42vh] items-center justify-center rounded-[28px] border border-dashed border-[#e6d9cf] bg-white px-5 py-12">
      <div className="max-w-sm text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff3e9] text-[#a8441b]">
          {isStore ? <ShoppingBag size={28} /> : isSeva ? <HeartHandshake size={28} /> : <CalendarDays size={28} />}
        </span>

        <h2 className="mt-5 text-xl font-bold text-[#2b2622]">
          {isStore ? "No Store Orders Found" : isSeva ? t("myBookings.empty.sevaTitle") : t("myBookings.empty.pujaTitle")}
        </h2>

        <p className="mt-2 text-xs leading-6 text-gray-500">
          {isStore ? "You haven't ordered any puja kits or prasad yet." : isSeva ? t("myBookings.empty.sevaDescription") : t("myBookings.empty.pujaDescription")}
        </p>

        <Link
          href={isStore ? "/store" : isSeva ? "/gau-seva" : "/pujas"}
          className="mt-5 inline-flex rounded-full bg-[#a8441b] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#8d3816]"
        >
          {isSeva ? t("myBookings.empty.exploreSeva") : t("myBookings.empty.explorePujas")}
        </Link>
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();
  const isHindi = language === "hi";

  const notAvailable = t(
    "myBookings.common.notAvailable"
  );

  const initialTab =
    searchParams.get("tab") === "seva" ? "seva" : "puja";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [pujaBookings, setPujaBookings] = useState([]);
  const [sevaBookings, setSevaBookings] = useState([]);
  const [storeOrders, setStoreOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const tab = searchParams.get("tab");

    if (tab === "seva" || tab === "puja" || tab === "store") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const userEmail = String(session?.user?.email || "").toLowerCase().trim();

      // Clear legacy local test bookings from localStorage so they never corrupt devotee's view
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("local_puja_bookings");
        } catch {
          // ignore
        }
      }

      const [pujaResult, sevaResult, storeResult] = await Promise.allSettled([
        fetch("/api/bookings", {
          cache: "no-store",
          headers: {
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
          },
        }),
        fetch("/api/seva-bookings", {
          cache: "no-store",
          headers: {
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
          },
        }),
        fetch(`/api/store/order?email=${encodeURIComponent(userEmail)}`, {
          cache: "no-store",
          headers: {
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
          },
        }),
      ]);

      let apiPujaBookings = [];
      let apiSevaBookings = [];
      let pujaApiFailed = false;
      let sevaApiFailed = false;

      if (
        pujaResult.status === "fulfilled" &&
        pujaResult.value.ok
      ) {
        const data = await pujaResult.value.json();
        apiPujaBookings = data.bookings || [];
      } else {
        pujaApiFailed = true;
      }

      if (
        sevaResult.status === "fulfilled" &&
        sevaResult.value.ok
      ) {
        const data = await sevaResult.value.json();
        apiSevaBookings = data.bookings || [];
      } else {
        sevaApiFailed = true;
      }

      const belongsToCurrentUser = (booking) => {
        if (!userEmail) return false;
        const bookingEmail = String(
          booking?.email ||
          booking?.userEmail ||
          booking?.customerEmail ||
          ""
        )
          .toLowerCase()
          .trim();

        return Boolean(bookingEmail && bookingEmail === userEmail);
      };

      setPujaBookings(apiPujaBookings.filter(belongsToCurrentUser));
      setSevaBookings(apiSevaBookings.filter(belongsToCurrentUser));

      if (storeResult.status === "fulfilled" && storeResult.value.ok) {
        const storeData = await storeResult.value.json();
        setStoreOrders(storeData.orders || []);
      }

      if (pujaApiFailed && sevaApiFailed) {
        setErrorMessage(t("myBookings.errors.serverUnavailable"));
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setErrorMessage(t("myBookings.errors.loadHistory"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      setPujaBookings([]);
      setSevaBookings([]);
      setStoreOrders([]);

      if (typeof window !== "undefined") {
        localStorage.removeItem("last_booking_sync");
      }

      setLoading(false);
      return;
    }

    if (status === "authenticated" && session?.user?.email) {
      fetchMyBookings();

      if (typeof window !== "undefined") {
        const justBooked = localStorage.getItem("just_booked_trigger");

        if (justBooked === "true") {
          setShowSuccessBanner(true);
          localStorage.removeItem("just_booked_trigger");
        }
      }
    }
  }, [status, session?.user?.email]);

  const handleBookingAction = async (booking, index, action) => {
    const isCompletedDelete = action === "delete-completed";

    if (
      isCompletedDelete && !["completed", "cancelled"].includes(normalizeStatus(booking.status))
    ) {
      alert(t("myBookings.alerts.onlyCompleted"));
      return;
    }

    const confirmed = window.confirm(
      isCompletedDelete
        ? t("myBookings.alerts.confirmDelete")
        : t("myBookings.alerts.confirmCancel")
    );

    if (!confirmed) return;

    const key = bookingKey(booking, index);

    try {
      setActionLoading(key);

      if (booking._id) {
        const response = await fetch(
          `/api/bookings?id=${encodeURIComponent(booking._id)}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            errorText ||
              (isCompletedDelete
                ? t("myBookings.errors.deleteCompleted")
                : t("myBookings.errors.cancelBooking"))
          );
        }
      }

      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("local_puja_bookings");
        } catch {
          // ignore
        }
      }

      setPujaBookings((current) =>
        current.filter((item, itemIndex) => {
          const sameGeneratedKey =
            bookingKey(item, itemIndex) === key;
          const sameBookingId =
            booking.bookingId &&
            item.bookingId === booking.bookingId;
          const sameDatabaseId =
            booking._id && item._id === booking._id;

          return !(
            sameGeneratedKey ||
            sameBookingId ||
            sameDatabaseId
          );
        })
      );

      alert(
        isCompletedDelete
          ? t("myBookings.alerts.deleted")
          : t("myBookings.alerts.cancelled")
      );
    } catch (error) {
      console.error("Booking action failed:", error);
      alert(
        error.message ||
          (isCompletedDelete
            ? t("myBookings.errors.unableDelete")
            : t("myBookings.errors.unableCancel"))
      );
    } finally {
      setActionLoading(null);
    }
  };

  const displayedBookings = useMemo(() => {
    if (activeTab === "store") return storeOrders;
    return activeTab === "seva" ? sevaBookings : pujaBookings;
  }, [activeTab, storeOrders, sevaBookings, pujaBookings]);

  const bookingStats = useMemo(() => {
    const currentBookings = displayedBookings;
    const pending = currentBookings.filter((booking) =>
      ["pending", "submitted"].includes(
        normalizeStatus(
          activeTab === "seva"
            ? booking.bookingStatus || booking.status
            : booking.status
        )
      )
    ).length;

    const confirmed = currentBookings.filter((booking) =>
      ["confirmed", "success", "completed"].includes(
        normalizeStatus(
          activeTab === "seva"
            ? booking.bookingStatus || booking.status
            : booking.status
        )
      )
    ).length;

    return {
      total: currentBookings.length,
      pending,
      confirmed,
    };
  }, [displayedBookings, activeTab]);

  if (status === "loading" || loading) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#fffdfb] px-4">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1e7] text-[#a8441b]">
            <Loader2 size={27} className="animate-spin" />
          </span>
          <p className="mt-4 text-sm font-semibold text-gray-500">
            {t("myBookings.loading")}
          </p>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#fffdfb] px-4">
        <div className="w-full max-w-md rounded-[28px] border border-[#eadfd7] bg-white p-7 text-center shadow-[0_18px_50px_rgba(65,40,22,0.08)] sm:p-9">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1e7] text-[#a8441b]">
            <ShieldAlert size={26} />
          </span>

          <h1 className="mt-5 text-2xl font-bold text-[#2b2622]">
            {t("myBookings.auth.title")}
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            {t("myBookings.auth.description")}
          </p>

          <Link
            href="/login?callbackUrl=/my-bookings"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#a8441b] px-7 text-sm font-bold text-white shadow-md transition hover:bg-[#8d3816]"
          >
            {t("myBookings.auth.button")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5f1] px-3 py-5 sm:px-5 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[28px] border border-[#eadfd7] bg-gradient-to-br from-[#fff7f0] via-white to-[#eef8f2] p-5 shadow-[0_16px_45px_rgba(65,40,22,0.06)] sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>

              <h1 className="mt-4 text-2xl font-extrabold leading-tight text-[#28231f] sm:text-4xl">
                {t("myBookings.header.title")}
              </h1>

              <p className="mt-2 max-w-2xl break-all text-xs leading-6 text-gray-500 sm:text-sm">
                {t("myBookings.header.description")}{" "}
                <strong className="font-semibold text-[#4c433d]">
                  {session?.user?.email}
                </strong>
                .
              </p>
            </div>

            <button
              type="button"
              onClick={fetchMyBookings}
              aria-busy={loading}
              disabled={loading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e4d8cf] bg-white text-gray-500 shadow-sm transition hover:border-[#a8441b] hover:text-[#a8441b] disabled:cursor-wait disabled:opacity-60"
              title={t("myBookings.actions.refresh")}
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 sm:max-w-lg sm:gap-3">
            {[
              {
                label: t("myBookings.stats.total"),
                value: bookingStats.total,
                className: "bg-white text-[#2f2925]",
              },
              {
                label: t("myBookings.stats.pending"),
                value: bookingStats.pending,
                className: "bg-[#fff7e7] text-[#8a5c12]",
              },
              {
                label: t("myBookings.stats.confirmed"),
                value: bookingStats.confirmed,
                className: "bg-[#eaf7ef] text-[#276748]",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl border border-white/80 p-3 text-center shadow-sm ${stat.className}`}
              >
                <p className="text-xl font-extrabold sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide opacity-70 sm:text-[10px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </header>

        {showSuccessBanner && (
          <div className="mt-4 flex items-start gap-3 rounded-[20px] border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-emerald-900">
                {t("myBookings.success.title")}
              </h3>
              <p className="mt-1 text-xs leading-5 text-emerald-700">
                {t("myBookings.success.description")}
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
            {errorMessage}
          </div>
        )}

        <div className="my-5 grid grid-cols-3 gap-1.5 rounded-[20px] border border-[#e7ddd5] bg-white p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("puja")}
            className={`flex min-h-12 items-center justify-center gap-1.5 rounded-[15px] px-2 text-xs font-bold transition sm:gap-2 sm:text-sm ${
              activeTab === "puja"
                ? "bg-[#a8441b] text-white shadow-md"
                : "text-gray-500 hover:bg-[#fff5ed]"
            }`}
          >
            <Sparkles size={15} />
            <span>{t("myBookings.tabs.puja")}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] ${
                activeTab === "puja"
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {pujaBookings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("seva")}
            className={`flex min-h-12 items-center justify-center gap-1.5 rounded-[15px] px-2 text-xs font-bold transition sm:gap-2 sm:text-sm ${
              activeTab === "seva"
                ? "bg-[#a8441b] text-white shadow-md"
                : "text-gray-500 hover:bg-[#fff5ed]"
            }`}
          >
            <HeartHandshake size={15} />
            <span>{t("myBookings.tabs.seva")}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] ${
                activeTab === "seva"
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {sevaBookings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("store")}
            className={`flex min-h-12 items-center justify-center gap-1.5 rounded-[15px] px-2 text-xs font-bold transition sm:gap-2 sm:text-sm ${
              activeTab === "store"
                ? "bg-[#a8441b] text-white shadow-md"
                : "text-gray-500 hover:bg-[#fff5ed]"
            }`}
          >
            <ShoppingBag size={15} />
            <span>{t("myBookings.tabs.store") || "My Orders"}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] ${
                activeTab === "store"
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {storeOrders.length}
            </span>
          </button>
        </div>

        {displayedBookings.length === 0 ? (
          <EmptyState activeTab={activeTab} t={t} />
        ) : activeTab === "store" ? (
          <div className="space-y-5">
            {storeOrders.map((order, index) => (
              <StoreOrderCard
                key={order._id || order.orderId || index}
                order={order}
                index={index}
                language={language}
                t={t}
              />
            ))}
          </div>
        ) : activeTab === "puja" ? (
          <div className="space-y-5">
            {pujaBookings.map((booking, index) => (
              <PujaBookingCard
                key={bookingKey(booking, index)}
                booking={booking}
                index={index}
                onBookingAction={handleBookingAction}
                actionLoading={actionLoading}
                language={language}
                t={t}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {sevaBookings.map((booking, index) => (
              <SevaBookingCard
                key={bookingKey(booking, index)}
                booking={booking}
                index={index}
                language={language}
                t={t}
              />
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-[20px] border border-[#e8ddd5] bg-white px-4 py-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ShieldAlert size={15} className="shrink-0 text-[#a8441b]" />
            {t("myBookings.footer.note")}
          </div>

          <Link
            href={activeTab === "store" ? "/store" : activeTab === "seva" ? "/gau-seva" : "/pujas"}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#a8441b] px-5 text-xs font-bold text-[#a8441b] transition hover:bg-[#a8441b] hover:text-white"
          >
            {activeTab === "store" ? (isHindi ? "स्टोर में और सामग्री देखें" : "Explore Puja Store") : activeTab === "seva" ? t("myBookings.footer.bookSeva") : t("myBookings.footer.bookPuja")}
          </Link>
        </div>
      </div>
    </main>
  );
}