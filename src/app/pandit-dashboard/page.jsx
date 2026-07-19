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
  DollarSign,
} from "lucide-react";

export default function PanditDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setAccessDenied(false);

      const res = await fetch("/api/admin/bookings", {
        cache: "no-store",
      });

      const data = await res.json();

      if (res.status === 401 || res.status === 403) {
        setAccessDenied(true);
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || "Unable to load bookings");
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error(error);
      // Falling back smoothly instead of throwing disruptive blocking break windows
      alert(error instanceof Error ? error.message : "Unable to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter((item) => item.status?.toLowerCase() === "pending").length,
      confirmed: bookings.filter((item) => item.status?.toLowerCase() === "confirmed" || item.status?.toLowerCase() === "accepted").length,
      completed: bookings.filter((item) => item.status?.toLowerCase() === "completed").length,
    };
  }, [bookings]);

  const updateStatus = async (bookingId, status) => {
    try {
      setUpdatingId(bookingId);

      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Unable to update booking");
      }

      setBookings((current) =>
        current.map((booking) =>
          booking._id === bookingId || booking.bookingId === bookingId
            ? { ...booking, status }
            : booking
        )
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to update booking");
    } finally {
      setUpdatingId("");
    }
  };

  const deleteBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this booking record?"
    );

    if (!confirmed) return;

    try {
      setUpdatingId(bookingId);

      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Unable to delete booking");
      }

      setBookings((current) =>
        current.filter((booking) => booking._id !== bookingId && booking.bookingId !== bookingId)
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to delete booking");
    } finally {
      setUpdatingId("");
    }
  };

  if (accessDenied) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffdfb] px-5">
        <div className="w-full max-w-md rounded-[28px] border border-[#eee8e2] bg-white p-8 text-center shadow-[0_25px_70px_rgba(54,37,28,0.08)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff3ed] text-2xl">
            🔒
          </div>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-[#a8441b]">
            Restricted Area
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#28221f]">
            Access Denied
          </h1>

          <p className="mt-4 text-sm leading-6 text-[#756a63]">
            This dashboard is available only to authorized Panditji administrators.
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
      <section className="border-b border-[#eee8e2] bg-white">
        <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Panditji Dashboard
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-[#756a63]">
            Manage Puja bookings, review payment transitions, and update status logs.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={stats.total}
            icon={<ReceiptText size={20} />}
          />

          <StatCard
            title="Pending Review"
            value={stats.pending}
            icon={<Clock3 size={20} />}
          />

          <StatCard
            title="Confirmed Pujas"
            value={stats.confirmed}
            icon={<CheckCircle2 size={20} />}
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CircleCheckBig size={20} />}
          />
        </div>

        <div className="mt-10 flex items-center justify-between border-b border-[#eee8e2] pb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a8441b]">
              Booking Management
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Recent Requests
            </h2>
          </div>

          <button
            type="button"
            onClick={loadBookings}
            className="flex items-center gap-2 rounded-full border border-[#e6ddd7] px-4 py-2 text-xs font-semibold transition hover:border-[#a8441b] hover:text-[#a8441b]"
          >
            <RefreshCw size={15} />
            Refresh List
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center text-sm text-gray-400">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-24 text-center">
            <ReceiptText size={34} className="mx-auto text-[#a8441b]" />
            <h2 className="mt-5 text-2xl font-semibold">No bookings found</h2>
          </div>
        ) : (
          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            {bookings.map((booking) => {
              const targetId = booking._id || booking.bookingId;
              const normalizedStatus = booking.status?.toLowerCase() || "pending";

              return (
                <article
                  key={targetId}
                  className="rounded-[28px] border border-[#eee8e2] bg-white p-6 shadow-[0_14px_40px_rgba(54,37,28,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(54,37,28,0.08)] animate-[fadeIn_0.4s_ease]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a8441b]">
                        {booking.bookingId}
                      </p>

                      <h3 className="mt-2 text-xl font-bold tracking-tight text-[#28221f]">
                        {booking.pujaName || booking.puja}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-gray-500">
                        {booking.name || booking.userName || booking.customerName}
                      </p>
                    </div>

                    <StatusBadge status={booking.status} />
                  </div>

                  {/* UTR/Payment Section: Displays alert style frame if dynamic transaction token is present */}
                  {booking.transactionId && booking.transactionId !== "Pay on service" && (
                    <div className="mt-4 rounded-xl border border-dashed border-orange-200 bg-orange-50/40 p-3 text-xs">
                      <p className="flex items-center gap-1.5 font-bold text-[#a8441b]">
                        <DollarSign size={14} /> Online UPI Transfer Reference
                      </p>
                      <p className="mt-1 font-mono font-medium text-gray-600 break-all bg-white/80 p-1.5 rounded border border-orange-100">
                        UTR / Transaction ID: {booking.transactionId}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 grid gap-4 border-y border-[#f0ebe7] py-4 sm:grid-cols-2">
                    <Detail
                      icon={<CalendarDays size={16} />}
                      label="Puja Date"
                      value={booking.date}
                    />

                    <Detail
                      icon={<Clock3 size={16} />}
                      label="Time Slot"
                      value={booking.timeSlot || "Flexible"}
                    />

                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-[#a8441b]">
                        <Phone size={16} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase tracking-wider text-gray-400">Phone</p>
                        {booking.phone ? (
                          <a
                            href={`tel:${booking.phone}`}
                            className="mt-0.5 block text-sm font-bold text-[#a8441b] transition hover:underline"
                          >
                            {booking.phone}
                          </a>
                        ) : (
                          <p className="mt-0.5 text-sm font-medium">Not available</p>
                        )}
                      </div>
                    </div>

                    <Detail
                      icon={<MapPin size={16} />}
                      label="Location Mode / Address"
                      value={booking.address || "Online Puja"}
                    />
                  </div>

                  {booking.message && (
                    <div className="mt-4 bg-[#fffcf9] border border-[#f7ede4] p-3 rounded-xl text-xs text-gray-600">
                      <span className="font-bold text-gray-500 block mb-0.5">Sankalp / Instructions:</span>
                      <p className="leading-5 italic">"{booking.message}"</p>
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Booking Amount</span>
                    <span className="text-lg font-extrabold text-[#a8441b]">{booking.price || "Free"}</span>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2 items-center">
                    {normalizedStatus === "pending" && (
                      <>
                        <ActionButton
                          disabled={updatingId === targetId}
                          onClick={() => updateStatus(targetId, "confirmed")}
                          icon={<CheckCircle2 size={16} />}
                        >
                          Confirm Puja
                        </ActionButton>

                        <ActionButton
                          danger
                          disabled={updatingId === targetId}
                          onClick={() => updateStatus(targetId, "cancelled")}
                          icon={<XCircle size={16} />}
                        >
                          Cancel
                        </ActionButton>
                      </>
                    )}

                    {(normalizedStatus === "confirmed" || normalizedStatus === "accepted") && (
                      <ActionButton
                        disabled={updatingId === targetId}
                        onClick={() => updateStatus(targetId, "completed")}
                        icon={<CircleCheckBig size={16} />}
                      >
                        Mark Completed
                      </ActionButton>
                    )}

                    {updatingId === targetId && (
                      <span className="text-xs text-gray-400 animate-pulse ml-2">
                        Updating status...
                      </span>
                    )}

                    <button
                      type="button"
                      disabled={updatingId === targetId}
                      onClick={() => deleteBooking(targetId)}
                      className="ml-auto flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-500 transition hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-[24px] border border-[#eee8e2] bg-white p-5 shadow-[0_10px_30px_rgba(54,37,28,0.03)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff5ef] text-[#a8441b]">
        {icon}
      </div>
      <p className="mt-4 text-3xl font-extrabold tracking-tight">{value}</p>
      <p className="mt-1 text-xs font-medium text-[#81756e]">{title}</p>
    </div>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-[#a8441b] shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-wider text-gray-400">{label}</p>
        <p className="mt-0.5 break-words text-sm font-semibold text-[#3d342f]">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    accepted: "border-emerald-200 bg-emerald-50 text-emerald-700",
    completed: "border-blue-200 bg-blue-50 text-blue-700",
    cancelled: "border-red-200 bg-red-50 text-red-600",
  };

  const current = status?.toLowerCase() || "pending";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
        styles[current] || styles.pending
      }`}
    >
      {status || "Pending"}
    </span>
  );
}

function ActionButton({
  children,
  icon,
  onClick,
  disabled,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
        danger
          ? "border border-red-200 text-red-600 bg-red-50/20 hover:bg-red-50"
          : "bg-[#a8441b] text-white hover:bg-[#873515] shadow-sm"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}