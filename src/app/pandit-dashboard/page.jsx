"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  BadgeIndianRupee,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleCheckBig,
  Clock3,
  EyeOff,
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
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Video,
  WalletCards,
  XCircle,
} from "lucide-react";

const FILTERS = [
  { key: "all", label: "All", fullLabel: "All Bookings" },
  { key: "puja", label: "Puja", fullLabel: "Regular Pujas" },
  { key: "event", label: "Events", fullLabel: "Monthly Events" },
  { key: "seva", label: "Seva", fullLabel: "Seva Bookings" },
];

const HIDDEN_STORAGE_KEY = "pandit_hidden_booking_keys_v1";

function normalizeStatus(value) {
  return String(value || "pending").toLowerCase().trim();
}

function normalizePaymentStatus(value) {
  return String(value || "pending").toLowerCase().trim();
}

function getBookingType(booking) {
  return booking?.bookingType === "seva" ? "seva" : "puja";
}

function isMonthlyEventBooking(booking) {
  return Boolean(
    booking?.bookingSource === "special_event" ||
      booking?.bookingCategory === "Monthly Vedic Event" ||
      booking?.eventTitle ||
      booking?.eventDate
  );
}

function getDashboardCategory(booking) {
  if (getBookingType(booking) === "seva") return "seva";
  if (isMonthlyEventBooking(booking)) return "event";
  return "puja";
}

function getBookingTargetId(booking, index = 0) {
  return (
    booking?._id ||
    booking?.bookingId ||
    booking?.transactionId ||
    `${getBookingType(booking)}-${booking?.email || "booking"}-${
      booking?.date || booking?.createdAt || "date"
    }-${index}`
  );
}

function getDashboardKey(booking, index = 0) {
  return `${getDashboardCategory(booking)}:${getBookingTargetId(
    booking,
    index
  )}`;
}

function formatDate(value, includeTime = false) {
  if (!value) return "Not specified";

  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(String(value))
      ? `${value}T00:00:00`
      : value
  );

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString(
    "en-IN",
    includeTime
      ? {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      : {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
  );
}

function formatAmount(value, fallback = "₹0") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value === "number") {
    return `₹${value.toLocaleString("en-IN")}`;
  }

  const stringValue = String(value).trim();

  if (stringValue.startsWith("₹")) {
    return stringValue;
  }

  const numeric = Number(stringValue.replace(/[^\d.-]/g, ""));

  if (!Number.isNaN(numeric) && stringValue !== "") {
    return `₹${numeric.toLocaleString("en-IN")}`;
  }

  return stringValue;
}

function readHiddenBookingKeys() {
  if (typeof window === "undefined") return [];

  try {
    const value = JSON.parse(
      localStorage.getItem(HIDDEN_STORAGE_KEY) || "[]"
    );

    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeHiddenBookingKeys(keys) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    HIDDEN_STORAGE_KEY,
    JSON.stringify(Array.from(new Set(keys)))
  );
}

export default function PanditDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [hiddenBookingKeys, setHiddenBookingKeys] = useState([]);

  useEffect(() => {
    setHiddenBookingKeys(readHiddenBookingKeys());
  }, []);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setAccessDenied(false);
      setErrorMessage("");

      const response = await fetch("/api/admin/bookings", {
        cache: "no-store",
        headers: {
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
        },
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        setAccessDenied(true);
        return;
      }

      if (!response.ok) {
        throw new Error(data?.error || "Unable to load bookings");
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Dashboard booking load error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load bookings"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const visibleBookings = useMemo(() => {
    const hidden = new Set(hiddenBookingKeys);

    return bookings.filter(
      (booking, index) => !hidden.has(getDashboardKey(booking, index))
    );
  }, [bookings, hiddenBookingKeys]);

  const stats = useMemo(() => {
    const getStatus = (booking) =>
      normalizeStatus(booking.status || booking.bookingStatus);

    return {
      total: visibleBookings.length,
      pending: visibleBookings.filter(
        (booking) => getStatus(booking) === "pending"
      ).length,
      confirmed: visibleBookings.filter((booking) =>
        ["confirmed", "accepted", "success"].includes(
          getStatus(booking)
        )
      ).length,
      completed: visibleBookings.filter(
        (booking) => getStatus(booking) === "completed"
      ).length,
      puja: visibleBookings.filter(
        (booking) => getDashboardCategory(booking) === "puja"
      ).length,
      event: visibleBookings.filter(
        (booking) => getDashboardCategory(booking) === "event"
      ).length,
      seva: visibleBookings.filter(
        (booking) => getDashboardCategory(booking) === "seva"
      ).length,
      hidden: hiddenBookingKeys.length,
    };
  }, [visibleBookings, hiddenBookingKeys]);

  const filteredBookings = useMemo(() => {
    const cleanSearch = searchText.toLowerCase().trim();

    return visibleBookings.filter((booking) => {
      const dashboardCategory = getDashboardCategory(booking);

      const matchesFilter =
        activeFilter === "all" ||
        dashboardCategory === activeFilter;

      if (!matchesFilter) return false;
      if (!cleanSearch) return true;

      const searchableText = [
        booking.sevaType,
        booking.pujaName,
        booking.puja,
        booking.name,
        booking.userName,
        booking.customerName,
        booking.email,
        booking.userEmail,
        booking.phone,
        booking.bookingId,
        booking._id,
        booking.address,
        booking.city,
        booking.transactionId,
        booking.samagriOption,
        booking.samagriProvidedBy,
        booking.bookingSource,
        booking.bookingCategory,
        booking.eventTitle,
        booking.eventDate,
        booking.eventMonth,
        booking.eventOffer,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(cleanSearch);
    });
  }, [visibleBookings, activeFilter, searchText]);

  const updateStatus = async (
    bookingId,
    status,
    bookingType
  ) => {
    try {
      setUpdatingId(bookingId);

      const response = await fetch(
        `/api/admin/bookings/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            bookingType,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to update booking status"
        );
      }

      await loadBookings();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to update booking status"
      );
    } finally {
      setUpdatingId("");
    }
  };

  const updatePaymentStatus = async (
    bookingId,
    paymentStatus,
    bookingType
  ) => {
    try {
      setUpdatingId(bookingId);

      const response = await fetch(
        `/api/admin/bookings/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentStatus,
            bookingType,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to update payment status"
        );
      }

      await loadBookings();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to update payment status"
      );
    } finally {
      setUpdatingId("");
    }
  };

  const hideBookingFromDashboard = (booking, index) => {
    const dashboardKey = getDashboardKey(booking, index);

    const confirmed = window.confirm(
      "Hide this booking only from this Pandit dashboard?\n\nThe booking will NOT be deleted from the database or the user's My Bookings page."
    );

    if (!confirmed) return;

    setHiddenBookingKeys((current) => {
      const updated = Array.from(new Set([...current, dashboardKey]));
      writeHiddenBookingKeys(updated);
      return updated;
    });

    setExpandedKeys((current) =>
      current.filter((key) => key !== dashboardKey)
    );
  };

  const restoreHiddenBookings = () => {
    const confirmed = window.confirm(
      "Restore all bookings hidden from this Pandit dashboard?"
    );

    if (!confirmed) return;

    writeHiddenBookingKeys([]);
    setHiddenBookingKeys([]);
  };

  const toggleDetails = (dashboardKey) => {
    setExpandedKeys((current) =>
      current.includes(dashboardKey)
        ? current.filter((key) => key !== dashboardKey)
        : [...current, dashboardKey]
    );
  };

  if (accessDenied) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5f1] px-4">
        <div className="w-full max-w-md rounded-[30px] border border-[#eee8e2] bg-white p-7 text-center shadow-[0_25px_70px_rgba(54,37,28,0.08)] sm:p-9">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff3ed] text-[#a8441b]">
            <ShieldCheck size={30} />
          </div>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-[#a8441b]">
            Restricted Area
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#28221f]">
            Access Denied
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#756a63]">
            This dashboard is available only to the authorized Pandit
            Ji administrator.
          </p>

          <a
            href="/"
            className="mt-7 flex h-12 w-full items-center justify-center rounded-full bg-[#a8441b] text-sm font-bold text-white transition hover:bg-[#873515]"
          >
            Return to Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4f0] text-[#28221f]">
      <section className="border-b border-[#eee3db] bg-gradient-to-br from-[#fff8f2] via-white to-[#edf8f1]">
        <div className="mx-auto max-w-[1400px] px-4 py-7 sm:px-7 sm:py-10 lg:px-10 lg:py-14">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              

              <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Pandit Ji Dashboard
              </h1>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {stats.hidden > 0 && (
                <button
                  type="button"
                  onClick={restoreHiddenBookings}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d8e6dd] bg-white px-4 text-xs font-bold text-[#37634d] shadow-sm transition hover:bg-[#eef8f2]"
                >
                  <RotateCcw size={15} />
                  Restore Hidden ({stats.hidden})
                </button>
              )}

              <button
                type="button"
                onClick={loadBookings}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#a8441b] px-5 text-xs font-bold text-white shadow-md transition hover:bg-[#873515]"
              >
                <RefreshCw size={15} />
                Refresh Bookings
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-3 py-5 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard
            title="Total Requests"
            value={stats.total}
            subtitle={`${stats.puja} Puja · ${stats.event} Events · ${stats.seva} Seva`}
            icon={<ReceiptText size={18} />}
          />

          <StatCard
            title="Monthly Events"
            value={stats.event}
            subtitle="Special calendar bookings"
            icon={<CalendarDays size={18} />}
            tone="purple"
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            subtitle="Needs review"
            icon={<Clock3 size={18} />}
            tone="amber"
          />

          <StatCard
            title="Confirmed"
            value={stats.confirmed}
            subtitle="Upcoming services"
            icon={<CheckCircle2 size={18} />}
            tone="green"
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            subtitle="Successfully finished"
            icon={<CircleCheckBig size={18} />}
            tone="blue"
          />
        </div>

        <div className="mt-5 rounded-[24px] border border-[#e8ddd5] bg-white p-3 shadow-[0_12px_35px_rgba(54,37,28,0.04)] sm:mt-7 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a8441b]">
                Booking Management
              </p>
              <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                Devotee Requests
              </h2>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 sm:w-[320px]">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9d918a]"
                />

                <input
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(event.target.value)
                  }
                  placeholder="Search name, phone, ID, UTR..."
                  className="h-11 w-full rounded-xl border border-[#e9e0da] bg-[#fffdfb] pl-10 pr-4 text-xs outline-none transition focus:border-[#a8441b] sm:text-sm"
                />
              </div>

              <button
                type="button"
                onClick={loadBookings}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#e6ddd7] px-4 text-xs font-semibold transition hover:border-[#a8441b] hover:text-[#a8441b]"
              >
                <RefreshCw size={15} />
                Refresh
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-1.5 rounded-[17px] bg-[#f7f3ef] p-1.5">
            {FILTERS.map((filter) => {
              const active = activeFilter === filter.key;

              return (
                <button
                  type="button"
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`min-h-10 rounded-[13px] px-2 text-[10px] font-bold transition sm:text-xs ${
                    active
                      ? "bg-[#a8441b] text-white shadow-sm"
                      : "text-[#756a63] hover:bg-white"
                  }`}
                >
                  <span className="sm:hidden">{filter.label}</span>
                  <span className="hidden sm:inline">
                    {filter.fullLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {stats.hidden > 0 && (
            <div className="mt-3 flex flex-col gap-2 rounded-[16px] border border-[#dce9e1] bg-[#f1f8f4] px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2 text-[10px] leading-5 text-[#4e735e] sm:text-xs">
                <EyeOff size={15} className="mt-0.5 shrink-0" />
                <span>
                  {stats.hidden} booking{stats.hidden > 1 ? "s are" : " is"} hidden
                  only on this browser's Pandit dashboard. Database and user
                  booking history are unchanged.
                </span>
              </div>

              <button
                type="button"
                onClick={restoreHiddenBookings}
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl bg-white px-3 text-[10px] font-bold text-[#37634d] shadow-sm"
              >
                <RotateCcw size={13} />
                Restore
              </button>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mt-5 rounded-[18px] border border-red-200 bg-red-50 p-4 text-xs leading-5 text-red-700 sm:text-sm">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center">
            <Loader2 className="h-9 w-9 animate-spin text-[#a8441b]" />
            <p className="mt-3 text-sm text-gray-400">
              Loading bookings...
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="mt-6 flex min-h-[330px] items-center justify-center rounded-[26px] border border-dashed border-[#e6ddd7] bg-white px-5">
            <div className="max-w-sm text-center">
              <ReceiptText
                size={38}
                className="mx-auto text-[#a8441b]"
              />

              <h2 className="mt-5 text-xl font-bold sm:text-2xl">
                No bookings found
              </h2>

              <p className="mt-2 text-xs leading-6 text-[#8a7f78] sm:text-sm">
                Try changing the filter or search text. Hidden bookings can
                be restored from the button above.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {filteredBookings.map((booking, index) => {
              const dashboardKey = getDashboardKey(booking, index);
              const expanded = expandedKeys.includes(dashboardKey);
              const targetId = getBookingTargetId(booking, index);
              const bookingType = getBookingType(booking);
              const isMonthlyEvent = isMonthlyEventBooking(booking);
              const normalizedStatus = normalizeStatus(
                booking.status || booking.bookingStatus
              );
              const paymentStatus = normalizePaymentStatus(
                booking.paymentStatus
              );

              return (
                <BookingCard
                  key={dashboardKey}
                  booking={booking}
                  index={index}
                  bookingType={bookingType}
                  isMonthlyEvent={isMonthlyEvent}
                  targetId={targetId}
                  dashboardKey={dashboardKey}
                  normalizedStatus={normalizedStatus}
                  paymentStatus={paymentStatus}
                  expanded={expanded}
                  updating={updatingId === targetId}
                  onToggle={() => toggleDetails(dashboardKey)}
                  onUpdateStatus={(newStatus) =>
                    updateStatus(targetId, newStatus, bookingType)
                  }
                  onUpdatePayment={(newPaymentStatus) =>
                    updatePaymentStatus(
                      targetId,
                      newPaymentStatus,
                      bookingType
                    )
                  }
                  onHide={() =>
                    hideBookingFromDashboard(booking, index)
                  }
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function BookingCard({
  booking,
  bookingType,
  isMonthlyEvent,
  targetId,
  normalizedStatus,
  paymentStatus,
  expanded,
  updating,
  onToggle,
  onUpdateStatus,
  onUpdatePayment,
  onHide,
}) {
  const isSeva = bookingType === "seva";

  const bookingTitle = isSeva
    ? booking.sevaType || "Gau Seva"
    : isMonthlyEvent
    ? booking.eventTitle ||
      booking.pujaName ||
      booking.puja ||
      "Monthly Vedic Event"
    : booking.pujaName || booking.puja || "Puja Booking";

  const customerName =
    booking.name ||
    booking.userName ||
    booking.customerName ||
    "Devotee";

  const customerEmail =
    booking.email || booking.userEmail || "Not available";

  const pujaType = booking.pujaType || "Offline Puja";
  const isOnline =
    !isSeva && pujaType.toLowerCase().includes("online");

  const basePrice = isSeva
    ? formatAmount(booking.amount)
    : isMonthlyEvent
    ? booking.basePrice ||
      booking.price ||
      "Price to be confirmed"
    : formatAmount(
        booking.basePrice || booking.price,
        "Not available"
      );

  const samagriCharge = formatAmount(
    booking.samagriCharge,
    "₹0"
  );

  const totalAmount = isSeva
    ? formatAmount(booking.amount)
    : isMonthlyEvent
    ? booking.totalPrice ||
      booking.price ||
      "Price to be confirmed"
    : formatAmount(
        booking.totalPrice || booking.price,
        "Not available"
      );

  const displayDate = isSeva
    ? formatDate(booking.createdAt)
    : formatDate(
        isMonthlyEvent
          ? booking.eventDate || booking.date
          : booking.date
      );

  const displayTime = isSeva
    ? "Flexible"
    : booking.timeSlot || booking.slot || "Flexible";

  const displayAddress = isSeva
    ? "Gau Seva Offering"
    : booking.address ||
      (isOnline ? "Online Puja — no venue required" : "Not specified");

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

  const message =
    booking.message ||
    (isSeva ? booking.sankalpName : "") ||
    "";

  return (
    <article className="overflow-hidden rounded-[26px] border border-[#e8ddd5] bg-white shadow-[0_14px_40px_rgba(54,37,28,0.05)]">
      {isMonthlyEvent && booking.eventImage && (
        <div className="relative h-36 overflow-hidden bg-[#fff3e9] sm:h-44">
          <img
            src={booking.eventImage}
            alt={bookingTitle}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
            <CalendarDays size={12} />
            Monthly Vedic Event
          </span>
        </div>
      )}

      <div className="border-b border-[#eee5de] bg-gradient-to-br from-[#fff8f2] via-white to-[#eef8f2] p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <BookingTypeBadge
                bookingType={bookingType}
                isMonthlyEvent={isMonthlyEvent}
              />
              <StatusBadge status={normalizedStatus} />

              {isMonthlyEvent && booking.eventOffer && (
                <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[9px] font-bold text-violet-700">
                  {booking.eventOffer}
                </span>
              )}

              {isSeva ? (
                <PaymentBadge status={paymentStatus} />
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#e0e5ec] bg-white px-2.5 py-1 text-[9px] font-bold text-gray-600">
                  {isOnline ? <Video size={11} /> : <Home size={11} />}
                  {pujaType}
                </span>
              )}
            </div>

            <h3 className="mt-3 break-words text-lg font-extrabold leading-6 text-[#28221f] sm:text-xl">
              {bookingTitle}
            </h3>

            <p className="mt-1 text-xs font-semibold text-gray-500">
              {customerName}
            </p>

            <p className="mt-2 break-all font-mono text-[9px] text-gray-400 sm:text-[10px]">
              Booking ID: {booking.bookingId || targetId}
            </p>
          </div>

          <div className="shrink-0 rounded-[16px] border border-[#dce9e1] bg-white/90 px-3 py-2.5 text-right">
            <p className="text-[8px] font-bold uppercase tracking-wide text-[#668071]">
              Total
            </p>
            <p className="mt-1 text-base font-extrabold text-[#173f32] sm:text-lg">
              {totalAmount}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <QuickInfo label="Date" value={displayDate} />
          <QuickInfo label="Time" value={displayTime} />
          <QuickInfo
            label={
              isSeva
                ? "Payment"
                : isMonthlyEvent
                ? "Event Month"
                : "Samagri"
            }
            value={
              isSeva
                ? paymentStatus
                : isMonthlyEvent
                ? booking.eventMonth || "Special Event"
                : samagriProvidedBy === "Pandit Ji"
                ? "By Pandit Ji"
                : "Self-arranged"
            }
            className="col-span-2 sm:col-span-1"
          />
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid gap-2.5 sm:grid-cols-2">
          <Detail
            icon={<UserRound size={15} />}
            label="Devotee Name"
            value={customerName}
          />

          <PhoneDetail phone={booking.phone} />

          <Detail
            icon={<Mail size={15} />}
            label="Email"
            value={customerEmail}
          />

          <Detail
            icon={
              isSeva ? (
                <HeartHandshake size={15} />
              ) : (
                <MapPin size={15} />
              )
            }
            label={isSeva ? "Gotra" : "Location"}
            value={
              isSeva
                ? booking.gotra || "Not provided"
                : displayAddress
            }
          />
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="mt-3 flex min-h-11 w-full items-center justify-between rounded-[15px] border border-[#e8ddd5] bg-[#faf7f4] px-4 text-xs font-bold text-[#5b514a] transition hover:bg-[#fff3e9]"
        >
          <span>
            {expanded ? "Hide Complete Details" : "View Complete Details"}
          </span>
          {expanded ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {expanded && (
          <div className="mt-4 space-y-4">
            {isSeva ? (
              <SevaDetails
                booking={booking}
                basePrice={basePrice}
                paymentStatus={paymentStatus}
              />
            ) : isMonthlyEvent ? (
              <MonthlyEventDetails
                booking={booking}
                basePrice={basePrice}
                totalAmount={totalAmount}
                samagriOption={samagriOption}
                samagriProvidedBy={samagriProvidedBy}
              />
            ) : (
              <PujaDetails
                booking={booking}
                basePrice={basePrice}
                samagriCharge={samagriCharge}
                totalAmount={totalAmount}
                samagriOption={samagriOption}
                samagriProvidedBy={samagriProvidedBy}
                samagriItems={samagriItems}
                isOnline={isOnline}
              />
            )}

            {message && (
              <div className="rounded-[20px] border border-[#efe1ce] bg-[#fffaf1] p-4">
                <SectionHeading
                  icon={<MessageSquareText size={16} />}
                  title={
                    isSeva
                      ? "Prayer / Message"
                      : "Special Instructions"
                  }
                />

                <p className="mt-3 whitespace-pre-wrap break-words text-xs leading-6 text-gray-600">
                  {message}
                </p>
              </div>
            )}

            <div className="rounded-[18px] border border-[#e8ddd5] bg-[#fbfaf8] p-3.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
                Booking Created
              </p>
              <p className="mt-1 text-xs font-semibold text-[#413934]">
                {formatDate(booking.createdAt, true)}
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 border-t border-[#eee8e2] pt-4">
          <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">
            {normalizedStatus === "pending" && (
              <>
                <ActionButton
                  disabled={updating}
                  onClick={() => onUpdateStatus("confirmed")}
                  icon={<CheckCircle2 size={15} />}
                >
                  Confirm{" "}
                  {isSeva
                    ? "Seva"
                    : isMonthlyEvent
                    ? "Event"
                    : "Puja"}
                </ActionButton>

                <ActionButton
                  danger
                  disabled={updating}
                  onClick={() => onUpdateStatus("cancelled")}
                  icon={<XCircle size={15} />}
                >
                  Cancel
                </ActionButton>
              </>
            )}

            {["confirmed", "accepted", "success"].includes(
              normalizedStatus
            ) && (
              <ActionButton
                disabled={updating}
                onClick={() => onUpdateStatus("completed")}
                icon={<CircleCheckBig size={15} />}
              >
                Mark Completed
              </ActionButton>
            )}

            {isSeva && paymentStatus === "submitted" && (
              <ActionButton
                secondary
                disabled={updating}
                onClick={() => onUpdatePayment("paid")}
                icon={<IndianRupee size={15} />}
              >
                Verify Payment
              </ActionButton>
            )}

            <button
              type="button"
              disabled={updating}
              onClick={onHide}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold text-gray-600 transition hover:border-[#d5e4da] hover:bg-[#f0f8f3] hover:text-[#37634d] disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto sm:w-auto"
              title="Hide only from this Pandit dashboard"
            >
              <EyeOff size={14} />
              Hide from Dashboard
            </button>
          </div>

          {updating && (
            <p className="mt-3 flex items-center gap-2 text-[10px] text-gray-400">
              <Loader2 size={12} className="animate-spin" />
              Updating booking...
            </p>
          )}

          <p className="mt-3 flex items-start gap-2 rounded-[14px] bg-[#f5f8f6] px-3 py-2.5 text-[9px] leading-4 text-[#607269]">
            <ShieldCheck size={13} className="mt-0.5 shrink-0" />
            “Hide from Dashboard” only hides this card in this browser. It
            does not delete the database record or remove the booking from
            the user's account.
          </p>
        </div>
      </div>
    </article>
  );
}

function MonthlyEventDetails({
  booking,
  basePrice,
  totalAmount,
  samagriOption,
  samagriProvidedBy,
}) {
  return (
    <>
      <div className="rounded-[20px] border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-4">
        <SectionHeading
          icon={<CalendarDays size={16} />}
          title="Monthly Event Information"
        />

        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          <Detail
            icon={<Sparkles size={15} />}
            label="Event Name"
            value={
              booking.eventTitle ||
              booking.pujaName ||
              "Monthly Vedic Event"
            }
            className="sm:col-span-2"
          />

          <Detail
            icon={<CalendarDays size={15} />}
            label="Event Date"
            value={formatDate(booking.eventDate || booking.date)}
          />

          <Detail
            icon={<Clock3 size={15} />}
            label="Preferred Time"
            value={booking.timeSlot || booking.slot || "Flexible"}
          />

          <Detail
            icon={<CalendarDays size={15} />}
            label="Event Month"
            value={booking.eventMonth || "Not specified"}
          />

          <Detail
            icon={<BadgeCheck size={15} />}
            label="Event Category"
            value={
              booking.bookingCategory ||
              "Monthly Vedic Event"
            }
          />

          {booking.eventOffer && (
            <Detail
              icon={<Sparkles size={15} />}
              label="Special Offer"
              value={booking.eventOffer}
              className="sm:col-span-2"
            />
          )}
        </div>
      </div>

      <div className="rounded-[20px] border border-[#eee5de] bg-[#fffdfb] p-4">
        <SectionHeading
          icon={<MapPin size={16} />}
          title="Devotee Schedule & Venue"
        />

        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {booking.city && (
            <Detail
              icon={<MapPin size={15} />}
              label="City"
              value={booking.city}
            />
          )}

          <Detail
            icon={<Home size={15} />}
            label="Puja Mode"
            value={booking.pujaType || "Offline Puja"}
          />

          <Detail
            icon={<MapPin size={15} />}
            label="Complete Address"
            value={booking.address || "Not specified"}
            className="sm:col-span-2"
          />
        </div>
      </div>

      <div className="rounded-[20px] border border-[#efe3d4] bg-[#fffaf2] p-4">
        <SectionHeading
          icon={<PackageCheck size={16} />}
          title="Arrangement Confirmation"
        />

        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          <Detail
            icon={<PackageCheck size={15} />}
            label="Samagri Status"
            value={samagriOption}
          />

          <Detail
            icon={<UserRound size={15} />}
            label="Samagri Provider"
            value={samagriProvidedBy}
          />

          <Detail
            icon={<BadgeIndianRupee size={15} />}
            label="Price Status"
            value={basePrice}
          />

          <Detail
            icon={<WalletCards size={15} />}
            label="Payment Method"
            value={
              booking.transactionId ||
              booking.paymentStatus ||
              "Pay on service"
            }
          />
        </div>

        <div className="mt-3 rounded-[16px] bg-[#4b176e] px-4 py-3.5 text-white">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/60">
            Current Booking Total
          </p>
          <p className="mt-1 text-lg font-extrabold">
            {totalAmount}
          </p>
          <p className="mt-1 text-[9px] leading-4 text-white/60">
            Final event price and Samagri arrangement can be confirmed
            with the devotee before accepting the booking.
          </p>
        </div>
      </div>
    </>
  );
}

function PujaDetails({
  booking,
  basePrice,
  samagriCharge,
  totalAmount,
  samagriOption,
  samagriProvidedBy,
  samagriItems,
  isOnline,
}) {
  const transactionId =
    booking.transactionId ||
    (isOnline ? "Not provided" : "Pay on service");

  return (
    <>
      <div className="rounded-[20px] border border-[#eee5de] bg-[#fffdfb] p-4">
        <SectionHeading
          icon={<CalendarDays size={16} />}
          title="Schedule & Venue"
        />

        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          <Detail
            icon={<CalendarDays size={15} />}
            label="Puja Date"
            value={formatDate(booking.date)}
          />
          <Detail
            icon={<Clock3 size={15} />}
            label="Time Slot"
            value={booking.timeSlot || booking.slot || "Flexible"}
          />
          <Detail
            icon={<MapPin size={15} />}
            label="Complete Address"
            value={
              booking.address ||
              (isOnline
                ? "Online Puja — no venue required"
                : "Not specified")
            }
            className="sm:col-span-2"
          />
          {booking.city && (
            <Detail
              icon={<MapPin size={15} />}
              label="City"
              value={booking.city}
              className="sm:col-span-2"
            />
          )}
        </div>
      </div>

      <div className="rounded-[20px] border border-[#efe3d4] bg-[#fffaf2] p-4">
        <SectionHeading
          icon={<PackageCheck size={16} />}
          title="Samagri Arrangement"
        />

        <div className="mt-3 rounded-[16px] border border-[#eee0ca] bg-white p-3.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">
            Selected Option
          </p>
          <p className="mt-1.5 text-xs font-bold leading-5 text-[#3c342f]">
            {samagriOption}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#edf7f1] px-3 py-1.5 text-[9px] font-bold text-[#37634d]">
              Provider: {samagriProvidedBy}
            </span>
            <span className="rounded-full bg-[#fff0e4] px-3 py-1.5 text-[9px] font-bold text-[#a8441b]">
              Charge: {samagriCharge}
            </span>
          </div>
        </div>

        {samagriItems.length > 0 ? (
          <div className="mt-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">
              Included Items ({samagriItems.length})
            </p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {samagriItems.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="rounded-full border border-[#eadfd7] bg-white px-2.5 py-1.5 text-[9px] font-semibold text-gray-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-3 text-[10px] leading-5 text-gray-500">
            No Pandit-provided Samagri item list was saved for this booking.
          </p>
        )}
      </div>

      <div className="rounded-[20px] border border-[#d9e8df] bg-gradient-to-br from-[#eef8f2] to-[#fbfdfb] p-4">
        <SectionHeading
          icon={<ReceiptText size={16} />}
          title="Price & Payment"
        />

        <div className="mt-3 divide-y divide-[#dce9e1] rounded-[16px] bg-white/80 px-3.5">
          <PriceRow label="Base Puja price" value={basePrice} />
          <PriceRow label="Samagri charge" value={samagriCharge} />
          <PriceRow
            label="Final booking total"
            value={totalAmount}
            strong
          />
        </div>

        <div className="mt-3 rounded-[16px] bg-[#173f32] p-3.5 text-white">
          <div className="flex items-center gap-2">
            <WalletCards size={15} className="text-[#bfe4cf]" />
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/60">
              Transaction / Payment Reference
            </p>
          </div>

          <p className="mt-2 break-all font-mono text-xs font-bold leading-5">
            {transactionId}
          </p>
        </div>
      </div>
    </>
  );
}

function SevaDetails({ booking, basePrice, paymentStatus }) {
  return (
    <>
      <div className="rounded-[20px] border border-[#eee5de] bg-[#fffdfb] p-4">
        <SectionHeading
          icon={<HeartHandshake size={16} />}
          title="Seva Information"
        />

        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          <Detail
            icon={<Sparkles size={15} />}
            label="Sankalp Name"
            value={booking.sankalpName || "Not provided"}
          />
          <Detail
            icon={<HeartHandshake size={15} />}
            label="Gotra"
            value={booking.gotra || "Not provided"}
          />
          <Detail
            icon={<CalendarDays size={15} />}
            label="Booking Date"
            value={formatDate(booking.createdAt)}
          />
          <Detail
            icon={<BadgeIndianRupee size={15} />}
            label="Seva Amount"
            value={basePrice}
          />
        </div>
      </div>

      <div className="rounded-[20px] border border-[#d9e8df] bg-[#eef8f2] p-4">
        <SectionHeading
          icon={<WalletCards size={16} />}
          title="Payment Details"
        />

        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          <Detail
            icon={<BadgeCheck size={15} />}
            label="Payment Status"
            value={paymentStatus}
          />
          <Detail
            icon={<ReceiptText size={15} />}
            label="Transaction Reference"
            value={booking.transactionId || "Not provided"}
          />
        </div>
      </div>
    </>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  tone = "orange",
}) {
  const tones = {
    orange: "bg-[#fff3e9] text-[#a8441b]",
    amber: "bg-[#fff6df] text-[#9a6410]",
    green: "bg-[#eaf7ef] text-[#27714c]",
    blue: "bg-[#edf3ff] text-[#315ea8]",
    purple: "bg-violet-50 text-violet-700",
  };

  return (
    <div className="rounded-[20px] border border-[#e8ddd5] bg-white p-3.5 shadow-[0_8px_25px_rgba(54,37,28,0.03)] sm:rounded-[24px] sm:p-5">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10 ${tones[tone]}`}
      >
        {icon}
      </div>

      <p className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
        {value}
      </p>

      <p className="mt-1 text-[10px] font-bold text-[#514842] sm:text-xs">
        {title}
      </p>

      <p className="mt-1 text-[8px] leading-4 text-[#9a8f88] sm:text-[10px]">
        {subtitle}
      </p>
    </div>
  );
}

function QuickInfo({ label, value, className = "" }) {
  return (
    <div
      className={`rounded-[14px] border border-white bg-white/80 p-2.5 ${className}`}
    >
      <p className="text-[8px] font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 break-words text-[10px] font-bold leading-4 text-[#403832] sm:text-xs">
        {value || "Not specified"}
      </p>
    </div>
  );
}

function Detail({ icon, label, value, className = "" }) {
  return (
    <div
      className={`flex min-w-0 items-start gap-3 rounded-[15px] border border-[#eee8e2] bg-[#fbfaf8] p-3 ${className}`}
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-white text-[#a8441b] shadow-sm">
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
          {label}
        </p>

        <p className="mt-1 break-words text-xs font-semibold leading-5 text-[#3d342f]">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
}

function PhoneDetail({ phone }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-[15px] border border-[#eee8e2] bg-[#fbfaf8] p-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-white text-[#a8441b] shadow-sm">
        <Phone size={15} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
          Phone
        </p>

        {phone ? (
          <a
            href={`tel:${phone}`}
            className="mt-1 block break-all text-xs font-bold leading-5 text-[#a8441b] hover:underline"
          >
            {phone}
          </a>
        ) : (
          <p className="mt-1 text-xs font-medium">
            Not available
          </p>
        )}
      </div>
    </div>
  );
}

function SectionHeading({ icon, title }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-white text-[#a8441b] shadow-sm">
        {icon}
      </span>
      <h4 className="text-xs font-bold text-[#332d29] sm:text-sm">
        {title}
      </h4>
    </div>
  );
}

function PriceRow({ label, value, strong = false }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-2.5 text-xs ${
        strong ? "font-bold text-[#173f32]" : "text-gray-600"
      }`}
    >
      <span>{label}</span>
      <span className="shrink-0 font-bold">{value}</span>
    </div>
  );
}

function BookingTypeBadge({
  bookingType,
  isMonthlyEvent = false,
}) {
  const isSeva = bookingType === "seva";

  const styles = isSeva
    ? "border-rose-200 bg-rose-50 text-rose-700"
    : isMonthlyEvent
    ? "border-violet-200 bg-violet-50 text-violet-700"
    : "border-orange-200 bg-orange-50 text-orange-700";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${styles}`}
    >
      {isSeva ? (
        <HeartHandshake size={11} />
      ) : isMonthlyEvent ? (
        <CalendarDays size={11} />
      ) : (
        <Sparkles size={11} />
      )}

      {isSeva
        ? "Seva"
        : isMonthlyEvent
        ? "Monthly Event"
        : "Puja"}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    confirmed:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    accepted:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    completed: "border-blue-200 bg-blue-50 text-blue-700",
    cancelled: "border-red-200 bg-red-50 text-red-600",
    rejected: "border-red-200 bg-red-50 text-red-600",
    failed: "border-red-200 bg-red-50 text-red-600",
  };

  const current = normalizeStatus(status);

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
        styles[current] || styles.pending
      }`}
    >
      {current}
    </span>
  );
}

function PaymentBadge({ status }) {
  const styles = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    submitted: "border-blue-200 bg-blue-50 text-blue-700",
    paid:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    failed: "border-red-200 bg-red-50 text-red-600",
  };

  const current = normalizePaymentStatus(status);

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
        styles[current] || styles.pending
      }`}
    >
      Payment: {current}
    </span>
  );
}

function ActionButton({
  children,
  icon,
  onClick,
  disabled,
  danger = false,
  secondary = false,
}) {
  let styles =
    "bg-[#a8441b] text-white hover:bg-[#873515] shadow-sm";

  if (danger) {
    styles =
      "border border-red-200 text-red-600 bg-red-50/20 hover:bg-red-50";
  }

  if (secondary) {
    styles =
      "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${styles}`}
    >
      {icon}
      {children}
    </button>
  );
}