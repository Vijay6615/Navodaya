"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  ReceiptText,
  XCircle,
  CircleCheckBig,
  RefreshCw,
  Trash2,
  IndianRupee,
  HeartHandshake,
  Sparkles,
  Search,
  Mail,
  UserRound,
  ShieldCheck,
  BadgeIndianRupee,
  Loader2,
} from "lucide-react";

const FILTERS = [
  { key: "all", label: "All Bookings" },
  { key: "puja", label: "Puja Bookings" },
  { key: "seva", label: "Seva Bookings" },
];

export default function PanditDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
        throw new Error(
          data?.error || "Unable to load bookings"
        );
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

  const stats = useMemo(() => {
    const getStatus = (booking) =>
      String(
        booking.status ||
          booking.bookingStatus ||
          "pending"
      )
        .toLowerCase()
        .trim();

    return {
      total: bookings.length,
      pending: bookings.filter(
        (booking) => getStatus(booking) === "pending"
      ).length,
      confirmed: bookings.filter((booking) =>
        ["confirmed", "accepted"].includes(
          getStatus(booking)
        )
      ).length,
      completed: bookings.filter(
        (booking) => getStatus(booking) === "completed"
      ).length,
      puja: bookings.filter(
        (booking) => booking.bookingType !== "seva"
      ).length,
      seva: bookings.filter(
        (booking) => booking.bookingType === "seva"
      ).length,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const cleanSearch = searchText
      .toLowerCase()
      .trim();

    return bookings.filter((booking) => {
      const bookingType =
        booking.bookingType === "seva"
          ? "seva"
          : "puja";

      const matchesFilter =
        activeFilter === "all" ||
        bookingType === activeFilter;

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
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(cleanSearch);
    });
  }, [bookings, activeFilter, searchText]);

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
          data?.error || "Unable to update booking"
        );
      }

      await loadBookings();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to update booking"
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
          data?.error ||
            "Unable to update payment status"
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

  const deleteBooking = async (
    bookingId,
    bookingType
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this booking record?"
    );

    if (!confirmed) return;

    try {
      setUpdatingId(bookingId);

      const response = await fetch(
        `/api/admin/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingType,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to delete booking"
        );
      }

      await loadBookings();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete booking"
      );
    } finally {
      setUpdatingId("");
    }
  };

  if (accessDenied) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffdfb] px-5">
        <div className="w-full max-w-md rounded-[30px] border border-[#eee8e2] bg-white p-8 text-center shadow-[0_25px_70px_rgba(54,37,28,0.08)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff3ed] text-[#a8441b]">
            <ShieldCheck size={30} />
          </div>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-[#a8441b]">
            Restricted Area
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#28221f]">
            Access Denied
          </h1>

          <p className="mt-4 text-sm leading-6 text-[#756a63]">
            This dashboard is available only to the
            authorized Pandit Ji administrator.
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
    <main className="min-h-screen bg-[#fffdfb] text-[#28221f]">
      <section className="relative overflow-hidden border-b border-[#eee8e2] bg-white">
        <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-gradient-to-l from-[#fff4ec] to-transparent lg:block" />

        <div className="relative mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a8441b]">
              Puja Dham Administration
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Pandit Ji Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#756a63] sm:text-base">
              Manage Puja and Seva requests, verify
              payments, update booking status, and keep
              every devotee informed.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            title="Total Requests"
            value={stats.total}
            subtitle={`${stats.puja} Puja · ${stats.seva} Seva`}
            icon={<ReceiptText size={20} />}
          />

          <StatCard
            title="Pending Review"
            value={stats.pending}
            subtitle="Needs your attention"
            icon={<Clock3 size={20} />}
          />

          <StatCard
            title="Confirmed"
            value={stats.confirmed}
            subtitle="Upcoming services"
            icon={<CheckCircle2 size={20} />}
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            subtitle="Successfully finished"
            icon={<CircleCheckBig size={20} />}
          />
        </div>

        <div className="mt-10 rounded-[28px] border border-[#eee8e2] bg-white p-4 shadow-[0_14px_40px_rgba(54,37,28,0.04)] sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a8441b]">
                Booking Management
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Recent Requests
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-0 sm:w-[280px]">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9d918a]"
                />

                <input
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(event.target.value)
                  }
                  placeholder="Search name, email, phone..."
                  className="h-11 w-full rounded-xl border border-[#e9e0da] bg-[#fffdfb] pl-10 pr-4 text-sm outline-none transition focus:border-[#a8441b]"
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

          <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-[#faf6f2] p-2">
            {FILTERS.map((filter) => {
              const active = activeFilter === filter.key;

              return (
                <button
                  type="button"
                  key={filter.key}
                  onClick={() =>
                    setActiveFilter(filter.key)
                  }
                  className={`rounded-xl px-3 py-3 text-xs font-bold transition ${
                    active
                      ? "bg-[#a8441b] text-white shadow-sm"
                      : "text-[#756a63] hover:bg-white"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {errorMessage && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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
          <div className="mt-8 flex min-h-[360px] items-center justify-center rounded-[28px] border border-dashed border-[#e6ddd7] bg-white">
            <div className="text-center">
              <ReceiptText
                size={38}
                className="mx-auto text-[#a8441b]"
              />

              <h2 className="mt-5 text-2xl font-semibold">
                No bookings found
              </h2>

              <p className="mt-2 text-sm text-[#8a7f78]">
                Try changing the filter or search text.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-7 grid gap-6 xl:grid-cols-2">
            {filteredBookings.map((booking) => {
              const targetId =
                booking._id || booking.bookingId;

              const bookingType =
                booking.bookingType === "seva"
                  ? "seva"
                  : "puja";

              const normalizedStatus = String(
                booking.status ||
                  booking.bookingStatus ||
                  "pending"
              )
                .toLowerCase()
                .trim();

              const paymentStatus = String(
                booking.paymentStatus || "pending"
              )
                .toLowerCase()
                .trim();

              const bookingTitle =
                bookingType === "seva"
                  ? booking.sevaType || "Gau Seva"
                  : booking.pujaName ||
                    booking.puja ||
                    "Puja Booking";

              const bookingAmount =
                bookingType === "seva"
                  ? `₹${booking.amount || 0}`
                  : booking.price || "Free";

              const displayDate =
                bookingType === "seva"
                  ? booking.createdAt
                    ? new Date(
                        booking.createdAt
                      ).toLocaleDateString("en-IN")
                    : "Not specified"
                  : booking.date || "Not specified";

              const displayTime =
                bookingType === "seva"
                  ? "Flexible"
                  : booking.timeSlot ||
                    booking.slot ||
                    "Flexible";

              const displayAddress =
                bookingType === "seva"
                  ? "Gau Seva Offering"
                  : booking.address || "Online Puja";

              const customerName =
                booking.name ||
                booking.userName ||
                booking.customerName ||
                "Devotee";

              const customerEmail =
                booking.email ||
                booking.userEmail ||
                "Not available";

              const customerMessage =
                booking.message ||
                booking.sankalpName ||
                "";

              return (
                <article
                  key={`${bookingType}-${targetId}`}
                  className="group overflow-hidden rounded-[30px] border border-[#eee8e2] bg-white shadow-[0_14px_40px_rgba(54,37,28,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(54,37,28,0.08)]"
                >
                  <div className="border-b border-[#f0ebe7] bg-gradient-to-r from-[#fffaf6] to-white p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <BookingTypeBadge
                            bookingType={bookingType}
                          />

                          <StatusBadge
                            status={normalizedStatus}
                          />

                          {bookingType === "seva" && (
                            <PaymentBadge
                              status={paymentStatus}
                            />
                          )}
                        </div>

                        <h3 className="mt-4 truncate text-xl font-bold tracking-tight text-[#28221f]">
                          {bookingTitle}
                        </h3>

                        <p className="mt-1 text-sm font-medium text-gray-500">
                          {customerName}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-gray-400">
                          Amount
                        </p>

                        <p className="mt-1 text-xl font-extrabold text-[#a8441b]">
                          {bookingAmount}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 break-all text-[10px] text-gray-400">
                      Booking ID:{" "}
                      <span className="font-mono text-gray-600">
                        {booking.bookingId || targetId}
                      </span>
                    </p>
                  </div>

                  {booking.transactionId &&
                    booking.transactionId !==
                      "Pay on service" && (
                      <div className="mx-6 mt-5 rounded-xl border border-dashed border-orange-200 bg-orange-50/50 p-3 text-xs">
                        <p className="flex items-center gap-1.5 font-bold text-[#a8441b]">
                          <BadgeIndianRupee size={14} />
                          Online Payment Reference
                        </p>

                        <p className="mt-2 break-all rounded border border-orange-100 bg-white/80 p-2 font-mono text-gray-600">
                          {booking.transactionId}
                        </p>
                      </div>
                    )}

                  <div className="grid gap-4 p-6 sm:grid-cols-2">
                    <Detail
                      icon={<UserRound size={16} />}
                      label="Devotee"
                      value={customerName}
                    />

                    <Detail
                      icon={<Mail size={16} />}
                      label="Email"
                      value={customerEmail}
                    />

                    <PhoneDetail
                      phone={booking.phone}
                    />

                    <Detail
                      icon={<CalendarDays size={16} />}
                      label={
                        bookingType === "seva"
                          ? "Booking Date"
                          : "Puja Date"
                      }
                      value={displayDate}
                    />

                    <Detail
                      icon={<Clock3 size={16} />}
                      label="Time"
                      value={displayTime}
                    />

                    <Detail
                      icon={
                        bookingType === "seva" ? (
                          <HeartHandshake size={16} />
                        ) : (
                          <MapPin size={16} />
                        )
                      }
                      label={
                        bookingType === "seva"
                          ? "Gotra"
                          : "Location"
                      }
                      value={
                        bookingType === "seva"
                          ? booking.gotra ||
                            "Not provided"
                          : displayAddress
                      }
                    />
                  </div>

                  {bookingType === "seva" &&
                    booking.sankalpName && (
                      <div className="mx-6 rounded-xl border border-[#f4e7dc] bg-[#fffaf6] p-3 text-xs">
                        <p className="font-bold text-[#a8441b]">
                          Sankalp Name
                        </p>
                        <p className="mt-1 text-gray-600">
                          {booking.sankalpName}
                        </p>
                      </div>
                    )}

                  {customerMessage && (
                    <div className="mx-6 mt-4 rounded-xl border border-[#f7ede4] bg-[#fffcf9] p-3 text-xs text-gray-600">
                      <span className="mb-1 block font-bold text-gray-500">
                        Message / Instructions
                      </span>

                      <p className="leading-5 italic">
                        “{customerMessage}”
                      </p>
                    </div>
                  )}

                  <div className="mt-6 border-t border-[#f0ebe7] p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      {normalizedStatus === "pending" && (
                        <>
                          <ActionButton
                            disabled={
                              updatingId === targetId
                            }
                            onClick={() =>
                              updateStatus(
                                targetId,
                                "confirmed",
                                bookingType
                              )
                            }
                            icon={
                              <CheckCircle2 size={16} />
                            }
                          >
                            Confirm{" "}
                            {bookingType === "seva"
                              ? "Seva"
                              : "Puja"}
                          </ActionButton>

                          <ActionButton
                            danger
                            disabled={
                              updatingId === targetId
                            }
                            onClick={() =>
                              updateStatus(
                                targetId,
                                "cancelled",
                                bookingType
                              )
                            }
                            icon={<XCircle size={16} />}
                          >
                            Cancel
                          </ActionButton>
                        </>
                      )}

                      {["confirmed", "accepted"].includes(
                        normalizedStatus
                      ) && (
                        <ActionButton
                          disabled={
                            updatingId === targetId
                          }
                          onClick={() =>
                            updateStatus(
                              targetId,
                              "completed",
                              bookingType
                            )
                          }
                          icon={
                            <CircleCheckBig size={16} />
                          }
                        >
                          Mark Completed
                        </ActionButton>
                      )}

                      {bookingType === "seva" &&
                        paymentStatus === "submitted" && (
                          <ActionButton
                            secondary
                            disabled={
                              updatingId === targetId
                            }
                            onClick={() =>
                              updatePaymentStatus(
                                targetId,
                                "paid",
                                bookingType
                              )
                            }
                            icon={
                              <IndianRupee size={16} />
                            }
                          >
                            Verify Payment
                          </ActionButton>
                        )}

                      {updatingId === targetId && (
                        <span className="ml-1 flex items-center gap-2 text-xs text-gray-400">
                          <Loader2
                            size={13}
                            className="animate-spin"
                          />
                          Updating...
                        </span>
                      )}

                      <button
                        type="button"
                        disabled={
                          updatingId === targetId
                        }
                        onClick={() =>
                          deleteBooking(
                            targetId,
                            bookingType
                          )
                        }
                        className="ml-auto flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}) {
  return (
    <div className="rounded-[26px] border border-[#eee8e2] bg-white p-5 shadow-[0_10px_30px_rgba(54,37,28,0.03)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff5ef] text-[#a8441b]">
        {icon}
      </div>

      <p className="mt-4 text-3xl font-extrabold tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-xs font-semibold text-[#514842]">
        {title}
      </p>

      <p className="mt-1 text-[10px] text-[#9a8f88]">
        {subtitle}
      </p>
    </div>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-[#f2ece7] bg-[#fffdfb] p-3">
      <span className="mt-0.5 shrink-0 text-[#a8441b]">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-wider text-gray-400">
          {label}
        </p>

        <p className="mt-0.5 break-words text-sm font-semibold text-[#3d342f]">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
}

function PhoneDetail({ phone }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-[#f2ece7] bg-[#fffdfb] p-3">
      <span className="mt-0.5 shrink-0 text-[#a8441b]">
        <Phone size={16} />
      </span>

      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-wider text-gray-400">
          Phone
        </p>

        {phone ? (
          <a
            href={`tel:${phone}`}
            className="mt-0.5 block break-words text-sm font-bold text-[#a8441b] hover:underline"
          >
            {phone}
          </a>
        ) : (
          <p className="mt-0.5 text-sm font-medium">
            Not available
          </p>
        )}
      </div>
    </div>
  );
}

function BookingTypeBadge({ bookingType }) {
  const isSeva = bookingType === "seva";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
        isSeva
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-orange-200 bg-orange-50 text-orange-700"
      }`}
    >
      {isSeva ? (
        <HeartHandshake size={12} />
      ) : (
        <Sparkles size={12} />
      )}

      {isSeva ? "Seva" : "Puja"}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending:
      "border-amber-200 bg-amber-50 text-amber-700",
    confirmed:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    accepted:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    completed:
      "border-blue-200 bg-blue-50 text-blue-700",
    cancelled:
      "border-red-200 bg-red-50 text-red-600",
    rejected:
      "border-red-200 bg-red-50 text-red-600",
  };

  const current =
    status?.toLowerCase() || "pending";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
        styles[current] || styles.pending
      }`}
    >
      {current}
    </span>
  );
}

function PaymentBadge({ status }) {
  const styles = {
    pending:
      "border-amber-200 bg-amber-50 text-amber-700",
    submitted:
      "border-blue-200 bg-blue-50 text-blue-700",
    paid:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    failed:
      "border-red-200 bg-red-50 text-red-600",
  };

  const current =
    status?.toLowerCase() || "pending";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
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
      className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${styles}`}
    >
      {icon}
      {children}
    </button>
  );
}