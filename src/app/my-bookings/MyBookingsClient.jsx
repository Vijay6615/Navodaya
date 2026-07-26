"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
} from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_META = {
  pending: {
    label: "Pending Verification",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmed",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  success: {
    label: "Confirmed",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  completed: {
    label: "Completed",
    badge: "border-green-200 bg-green-50 text-green-800",
    dot: "bg-green-600",
  },
  cancelled: {
    label: "Cancelled",
    badge: "border-red-200 bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
  rejected: {
    label: "Rejected",
    badge: "border-red-200 bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
  failed: {
    label: "Failed",
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

function formatDateTime(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatBookingDate(value) {
  if (!value) return "Date not selected";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

function StatusBadge({ status }) {
  const meta = getStatusMeta(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${meta.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
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
          {value || "Not available"}
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

function PriceRow({ label, value, strong = false }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-2.5 text-xs sm:text-sm ${
        strong ? "font-bold text-[#173f32]" : "text-gray-600"
      }`}
    >
      <span>{label}</span>
      <span className="shrink-0 font-bold">{value || "Not available"}</span>
    </div>
  );
}

function PujaBookingCard({
  booking,
  index,
  onBookingAction,
  actionLoading,
}) {
  const status = normalizeStatus(booking.status);
  const isCompleted = status === "completed";
  const canCancel = ["pending", "confirmed", "success"].includes(status);

  const bookingId = booking.bookingId || booking._id || `PUJA-${index + 1}`;
  const pujaName = booking.pujaName || booking.puja || "Puja Booking";
  const pujaType = booking.pujaType || "Offline Puja";
  const isOnline = pujaType.toLowerCase().includes("online");

  const isSpecialEvent =
    booking.bookingSource === "special_event" ||
    Boolean(booking.eventTitle);

  const eventOffer =
    booking.eventOffer || "No special offer recorded";

  const eventMonth =
    booking.eventMonth || "Not specified";

  const bookingCategory =
    booking.bookingCategory ||
    (isSpecialEvent ? "Monthly Vedic Event" : "Regular Puja");

  const customerName =
    booking.name || booking.customerName || booking.userName || "Not available";
  const email = booking.email || booking.userEmail || "Not available";
  const phone = booking.phone || "Not available";
  const address =
    booking.address ||
    (isOnline ? "Online Puja — no venue required" : "Not available");

  const basePrice = booking.basePrice || booking.price || "Not available";
  const samagriCharge = booking.samagriCharge || "₹ 0";
  const totalPrice =
    booking.totalPrice || booking.price || booking.amount || "Not available";

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
      ? "Pandit Ji will bring complete Puja Samagri"
      : "Customer will arrange Puja Samagri");

  const samagriItems = Array.isArray(booking.samagriItems)
    ? booking.samagriItems.filter(Boolean)
    : [];

  const transactionId =
    booking.transactionId ||
    (isOnline ? "Not provided" : "Pay on service");

  return (
    <article className="overflow-hidden rounded-[26px] border border-[#eadfd7] bg-white shadow-[0_14px_40px_rgba(65,40,22,0.06)]">
      <div className="border-b border-[#eee4dc] bg-gradient-to-br from-[#fff8f2] via-white to-[#f4faf6] p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={status} />

              <span className="inline-flex items-center gap-1 rounded-full border border-[#eadfd7] bg-white px-2.5 py-1 text-[10px] font-bold text-gray-600">
                {isOnline ? <Video size={12} /> : <Home size={12} />}
                {pujaType}
              </span>

              {isSpecialEvent && (
                <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700">
                  <Sparkles size={12} />
                  Special Event
                </span>
              )}
            </div>

            <h2 className="mt-3 break-words text-xl font-extrabold leading-7 text-[#27221f] sm:text-2xl">
              {pujaName}
            </h2>

            <p className="mt-1 break-all font-mono text-[10px] text-gray-400 sm:text-[11px]">
              Booking ID: {bookingId}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#d8e7dd] bg-white/90 px-4 py-3 sm:block sm:min-w-[145px] sm:text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#5f7b6d]">
              Total Amount
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
              Puja Date
            </p>
            <p className="mt-1 text-xs font-bold text-[#38322e]">
              {formatBookingDate(booking.date)}
            </p>
          </div>

          <div className="rounded-2xl border border-white bg-white/80 p-3">
            <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
              Time Slot
            </p>
            <p className="mt-1 break-words text-xs font-bold text-[#38322e]">
              {booking.timeSlot || booking.slot || "Flexible"}
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-white bg-white/80 p-3 sm:col-span-1">
            <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
              {isSpecialEvent ? "Booking Type" : "Samagri"}
            </p>
            <p className="mt-1 break-words text-xs font-bold text-[#38322e]">
              {isSpecialEvent
                ? "Special Event"
                : samagriProvidedBy === "Pandit Ji"
                ? "By Pandit Ji"
                : samagriProvidedBy === "To be confirmed"
                ? "To be confirmed"
                : "Self-arranged"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        <section>
          <SectionLabel
            icon={User}
            title="Devotee Details"
            description="Contact information submitted with this booking"
          />

          <div className="grid gap-2.5 sm:grid-cols-2">
            <InfoItem icon={User} label="Full Name" value={customerName} />
            <InfoItem
              icon={Phone}
              label="Phone Number"
              value={phone}
              valueClassName="break-all"
            />
            <InfoItem
              icon={Mail}
              label="Email Address"
              value={email}
              valueClassName="break-all"
            />
            <InfoItem
              icon={MapPin}
              label={isOnline ? "Puja Venue" : "Complete Address"}
              value={address}
            />
          </div>
        </section>

        {isSpecialEvent && (
          <section className="rounded-[22px] border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-[#fff8f2] p-4">
            <SectionLabel
              icon={Sparkles}
              title="Special Event Details"
              description="Event information saved with this booking"
            />

            <div className="grid gap-2.5 sm:grid-cols-2">
              <InfoItem
                icon={Sparkles}
                label="Booking Category"
                value={bookingCategory}
              />

              <InfoItem
                icon={CalendarDays}
                label="Event Month"
                value={eventMonth}
              />

              <InfoItem
                icon={Tag}
                label="Event Offer"
                value={eventOffer}
              />

              <InfoItem
                icon={Clock3}
                label="Price Status"
                value={totalPrice}
              />
            </div>
          </section>
        )}

        <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[22px] border border-[#eee6df] bg-[#fffdfb] p-4">
            <SectionLabel
              icon={PackageCheck}
              title="Samagri Arrangement"
              description="Materials selected during booking"
            />

            <div className="rounded-2xl border border-[#eee4dc] bg-white p-3.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">
                Selected Option
              </p>
              <p className="mt-1.5 text-sm font-bold leading-6 text-[#342e2a]">
                {samagriOption}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#f2f6f3] px-3 py-1.5 text-[10px] font-bold text-[#416b56]">
                  Provider: {samagriProvidedBy}
                </span>
                <span className="rounded-full bg-[#fff3e9] px-3 py-1.5 text-[10px] font-bold text-[#a8441b]">
                  Charge: {samagriCharge}
                </span>
              </div>
            </div>

            {samagriItems.length > 0 ? (
              <div className="mt-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">
                  Included Samagri ({samagriItems.length})
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
                  ? "Samagri details will be confirmed directly by Pandit Ji."
                  : "No Pandit-provided Samagri items were added to this booking."}
              </p>
            )}
          </div>

          <div className="rounded-[22px] border border-[#dbe9e0] bg-gradient-to-br from-[#eef8f2] to-[#fbfdfb] p-4">
            <SectionLabel
              icon={ReceiptText}
              title="Price & Payment"
              description={
                isSpecialEvent
                  ? "Final event price will be confirmed by Pandit Ji"
                  : "Complete booking price breakdown"
              }
            />

            <div className="divide-y divide-[#dce9e1] rounded-2xl bg-white/75 px-3.5">
              <PriceRow label="Base Puja price" value={basePrice} />
              <PriceRow label="Samagri charge" value={samagriCharge} />
              <PriceRow
                label="Total booking amount"
                value={totalPrice}
                strong
              />
            </div>

            <div className="mt-3 rounded-2xl bg-[#173f32] p-3.5 text-white">
              <div className="flex items-center gap-2">
                <WalletCards size={16} className="text-[#bfe4cf]" />
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/60">
                  Payment / Transaction
                </p>
              </div>

              <p className="mt-2 break-all font-mono text-xs font-bold leading-5 text-white">
                {transactionId}
              </p>

              <p className="mt-2 text-[10px] leading-4 text-white/60">
                {isOnline
                  ? "Online payment details submitted for verification."
                  : "Payment will be collected according to the confirmed service arrangement."}
              </p>
            </div>
          </div>
        </section>

        {booking.message && (
          <section className="rounded-[22px] border border-[#efe1ce] bg-[#fffaf1] p-4">
            <SectionLabel
              icon={MessageSquareText}
              title="Special Instructions"
              description="Message shared during booking"
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
                  Puja completed successfully
                </p>
                <p className="mt-1 text-[10px] leading-5 text-emerald-700">
                  You can now remove this completed booking from your booking
                  history. This action cannot be undone.
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
                Booking created:{" "}
                <strong className="font-semibold text-gray-600">
                  {formatDateTime(booking.createdAt)}
                </strong>
              </span>
            </div>

            {isCompleted ? (
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
                Delete from History
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
                Cancel Booking
              </button>
            ) : (
              <span className="inline-flex min-h-10 items-center justify-center rounded-xl bg-gray-100 px-4 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                No action available
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function SevaBookingCard({ booking, index }) {
  const bookingStatus = booking.bookingStatus || booking.status || "pending";
  const paymentStatus = booking.paymentStatus || "pending";
  const amount =
    typeof booking.amount === "string" &&
    booking.amount.trim().startsWith("₹")
      ? booking.amount
      : `₹${Number(booking.amount || 0).toLocaleString("en-IN")}`;

  return (
    <article className="overflow-hidden rounded-[26px] border border-[#eadfd7] bg-white shadow-[0_14px_40px_rgba(65,40,22,0.06)]">
      <div className="border-b border-[#eee4dc] bg-gradient-to-br from-[#fff8f2] via-white to-[#fffdf8] p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={bookingStatus} />
              <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase text-blue-700">
                Payment: {paymentStatus}
              </span>
            </div>

            <h2 className="mt-3 text-xl font-extrabold text-[#27221f] sm:text-2xl">
              {booking.sevaType || "Gau Seva"}
            </h2>

            <p className="mt-1 break-all font-mono text-[10px] text-gray-400">
              Booking ID: {booking.bookingId || booking._id || `SEVA-${index + 1}`}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#efe2cf] bg-white px-4 py-3 sm:block sm:min-w-[140px] sm:text-right">
            <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
              Seva Amount
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
            label="Devotee Name"
            value={booking.name || booking.userName}
          />
          <InfoItem
            icon={Phone}
            label="Phone Number"
            value={booking.phone}
            valueClassName="break-all"
          />
          <InfoItem
            icon={Mail}
            label="Email Address"
            value={booking.email || booking.userEmail}
            valueClassName="break-all"
          />
          <InfoItem
            icon={Sparkles}
            label="Sankalp Name"
            value={booking.sankalpName || "Not provided"}
          />
          <InfoItem
            icon={HeartHandshake}
            label="Gotra"
            value={booking.gotra || "Not provided"}
          />
          <InfoItem
            icon={CalendarDays}
            label="Booked On"
            value={formatDateTime(booking.createdAt)}
          />
        </div>

        {booking.message && (
          <div className="rounded-[22px] border border-[#efe1ce] bg-[#fffaf1] p-4">
            <SectionLabel
              icon={MessageSquareText}
              title="Prayer / Message"
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

function EmptyState({ activeTab }) {
  const isSeva = activeTab === "seva";

  return (
    <div className="flex min-h-[42vh] items-center justify-center rounded-[28px] border border-dashed border-[#e6d9cf] bg-white px-5 py-12">
      <div className="max-w-sm text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff3e9] text-[#a8441b]">
          {isSeva ? <HeartHandshake size={28} /> : <CalendarDays size={28} />}
        </span>

        <h2 className="mt-5 text-xl font-bold text-[#2b2622]">
          No {isSeva ? "Seva" : "Puja"} Bookings Found
        </h2>

        <p className="mt-2 text-xs leading-6 text-gray-500">
          {isSeva
            ? "You have not offered any Seva from this account yet."
            : "Your Puja booking history will appear here after you submit a booking."}
        </p>

        <Link
          href={isSeva ? "/seva" : "/pujas"}
          className="mt-5 inline-flex rounded-full bg-[#a8441b] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#8d3816]"
        >
          {isSeva ? "Explore Seva" : "Explore Pujas"}
        </Link>
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  const initialTab =
    searchParams.get("tab") === "seva" ? "seva" : "puja";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [pujaBookings, setPujaBookings] = useState([]);
  const [sevaBookings, setSevaBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const tab = searchParams.get("tab");

    if (tab === "seva" || tab === "puja") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      let localPujaBookings = [];

      if (typeof window !== "undefined") {
        try {
          localPujaBookings = JSON.parse(
            localStorage.getItem("local_puja_bookings") || "[]"
          );
        } catch {
          localPujaBookings = [];
        }
      }

      const [pujaResult, sevaResult] = await Promise.allSettled([
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

      const userEmail = String(session?.user?.email || "")
        .toLowerCase()
        .trim();

      const belongsToCurrentUser = (booking) => {
        const bookingEmail = String(
          booking?.email || booking?.userEmail || ""
        )
          .toLowerCase()
          .trim();

        return !bookingEmail || !userEmail || bookingEmail === userEmail;
      };

      const mergedPujaBookings = mergeBookings(
        localPujaBookings.filter(belongsToCurrentUser),
        apiPujaBookings.filter(belongsToCurrentUser)
      );

      setPujaBookings(mergedPujaBookings);
      setSevaBookings(apiSevaBookings.filter(belongsToCurrentUser));

      if (
        pujaApiFailed &&
        sevaApiFailed &&
        mergedPujaBookings.length === 0
      ) {
        setErrorMessage(
          "Bookings could not be loaded from the server. Please refresh after some time."
        );
      } else if (pujaApiFailed && mergedPujaBookings.length > 0) {
        setErrorMessage(
          "Server sync is temporarily unavailable. Showing the booking details saved on this device."
        );
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setErrorMessage("Unable to load your booking history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      setPujaBookings([]);
      setSevaBookings([]);

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
      isCompletedDelete &&
      normalizeStatus(booking.status) !== "completed"
    ) {
      alert("Only completed bookings can be deleted from history.");
      return;
    }

    const confirmed = window.confirm(
      isCompletedDelete
        ? "Delete this completed booking permanently from your history? This action cannot be undone."
        : "Are you sure you want to cancel this Puja booking?"
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
                ? "Failed to delete completed booking."
                : "Failed to cancel booking.")
          );
        }
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

        const updatedLocal = existingLocal.filter(
          (item, itemIndex) => {
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
          }
        );

        localStorage.setItem(
          "local_puja_bookings",
          JSON.stringify(updatedLocal)
        );
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
          ? "Completed booking deleted from history."
          : "Booking cancelled successfully."
      );
    } catch (error) {
      console.error("Booking action failed:", error);
      alert(
        error.message ||
          (isCompletedDelete
            ? "Unable to delete this completed booking."
            : "Unable to cancel this booking.")
      );
    } finally {
      setActionLoading(null);
    }
  };

  const displayedBookings = useMemo(
    () => (activeTab === "seva" ? sevaBookings : pujaBookings),
    [activeTab, sevaBookings, pujaBookings]
  );

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
            Loading your sacred bookings...
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
            Login Required
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            Please log in to view your complete Puja and Seva booking history.
          </p>

          <Link
            href="/login?callbackUrl=/my-bookings"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#a8441b] px-7 text-sm font-bold text-white shadow-md transition hover:bg-[#8d3816]"
          >
            Login / Sign Up
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
                My Sacred Bookings
              </h1>

              <p className="mt-2 max-w-2xl break-all text-xs leading-6 text-gray-500 sm:text-sm">
                Track booking status and review all Puja, Samagri, payment,
                devotee and schedule details linked to{" "}
                <strong className="font-semibold text-[#4c433d]">
                  {session?.user?.email}
                </strong>
                .
              </p>
            </div>

            <button
              type="button"
              onClick={fetchMyBookings}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e4d8cf] bg-white text-gray-500 shadow-sm transition hover:border-[#a8441b] hover:text-[#a8441b]"
              title="Refresh bookings"
            >
              <RefreshCw size={17} />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 sm:max-w-lg sm:gap-3">
            {[
              {
                label: "Total",
                value: bookingStats.total,
                className: "bg-white text-[#2f2925]",
              },
              {
                label: "Pending",
                value: bookingStats.pending,
                className: "bg-[#fff7e7] text-[#8a5c12]",
              },
              {
                label: "Confirmed",
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
                Booking submitted successfully
              </h3>
              <p className="mt-1 text-xs leading-5 text-emerald-700">
                Your booking is pending verification. All submitted details
                are shown below.
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
            {errorMessage}
          </div>
        )}

        <div className="my-5 grid grid-cols-2 gap-1.5 rounded-[20px] border border-[#e7ddd5] bg-white p-1.5 shadow-sm">
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
            <span>Puja</span>
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
            <span>Seva</span>
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
        </div>

        {displayedBookings.length === 0 ? (
          <EmptyState activeTab={activeTab} />
        ) : activeTab === "puja" ? (
          <div className="space-y-5">
            {pujaBookings.map((booking, index) => (
              <PujaBookingCard
                key={bookingKey(booking, index)}
                booking={booking}
                index={index}
                onBookingAction={handleBookingAction}
                actionLoading={actionLoading}
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
              />
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-[20px] border border-[#e8ddd5] bg-white px-4 py-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ShieldAlert size={15} className="shrink-0 text-[#a8441b]" />
            Completed bookings can be deleted by the user. Pending and
            confirmed bookings remain available for tracking.
          </div>

          <Link
            href={activeTab === "seva" ? "/seva" : "/pujas"}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#a8441b] px-5 text-xs font-bold text-[#a8441b] transition hover:bg-[#a8441b] hover:text-white"
          >
            {activeTab === "seva" ? "Book Another Seva" : "Book Another Puja"}
          </Link>
        </div>
      </div>
    </main>
  );
}