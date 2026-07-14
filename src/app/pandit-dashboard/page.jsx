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
    alert(error?.message || "Unable to load bookings");
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
      pending: bookings.filter((item) => item.status === "pending").length,
      confirmed: bookings.filter((item) => item.status === "confirmed").length,
      completed: bookings.filter((item) => item.status === "completed").length,
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
          booking._id === bookingId
            ? { ...booking, status }
            : booking
        )
      );
    } catch (error) {
      alert(error?.message || "Unable to update booking");
    } finally {
      setUpdatingId("");
    }
  };

  const deleteBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this booking?"
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
        current.filter((booking) => booking._id !== bookingId)
      );
    } catch (error) {
      alert(error?.message || "Unable to delete booking");
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
            This dashboard is available only to authorized Panditji
            administrators.
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
            Dashboard
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-[#756a63]">
            Manage Puja bookings and update booking status.
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
            title="Pending"
            value={stats.pending}
            icon={<Clock3 size={20} />}
          />

          <StatCard
            title="Confirmed"
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
              Recent Bookings
            </h2>
          </div>

          <button
            type="button"
            onClick={loadBookings}
            className="flex items-center gap-2 rounded-full border border-[#e6ddd7] px-4 py-2 text-xs font-semibold transition hover:border-[#a8441b] hover:text-[#a8441b]"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center text-sm text-gray-400">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-24 text-center">
            <ReceiptText
              size={34}
              className="mx-auto text-[#a8441b]"
            />

            <h2 className="mt-5 text-2xl font-semibold">
              No bookings found
            </h2>
          </div>
        ) : (
          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="rounded-[26px] border border-[#eee8e2] bg-white p-6 shadow-[0_14px_40px_rgba(54,37,28,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(54,37,28,0.09)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a8441b]">
                      {booking.bookingId}
                    </p>

                    <h3 className="mt-2 text-xl font-bold">
                      {booking.pujaName}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {booking.userName || booking.customerName}
                    </p>
                  </div>

                  <StatusBadge status={booking.status} />
                </div>

                <div className="mt-6 grid gap-4 border-y border-[#f0ebe7] py-5 sm:grid-cols-2">
                  <Detail
                    icon={<CalendarDays size={16} />}
                    label="Puja Date"
                    value={booking.date}
                  />

                  <Detail
                    icon={<Clock3 size={16} />}
                    label="Time"
                    value={booking.timeSlot || "Flexible"}
                  />

                  <div className="flex items-start gap-3">
                    <span className="mt-1 text-[#a8441b]">
                      <Phone size={16} />
                    </span>

                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">
                        Phone
                      </p>

                      {booking.phone ? (
                        <a
                          href={`tel:${booking.phone}`}
                          className="mt-1 block text-sm font-semibold text-[#a8441b] transition hover:underline"
                        >
                          {booking.phone}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm font-medium">
                          Not available
                        </p>
                      )}
                    </div>
                  </div>

                  <Detail
                    icon={<MapPin size={16} />}
                    label="Address"
                    value={booking.address || "Online Puja"}
                  />
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Booking Amount
                  </span>

                  <span className="text-lg font-bold text-[#a8441b]">
                    {booking.price}
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {booking.status === "pending" && (
                    <>
                      <ActionButton
                        disabled={updatingId === booking._id}
                        onClick={() =>
                          updateStatus(booking._id, "confirmed")
                        }
                        icon={<CheckCircle2 size={16} />}
                      >
                        Confirm
                      </ActionButton>

                      <ActionButton
                        danger
                        disabled={updatingId === booking._id}
                        onClick={() =>
                          updateStatus(booking._id, "cancelled")
                        }
                        icon={<XCircle size={16} />}
                      >
                        Cancel
                      </ActionButton>
                    </>
                  )}

                  {booking.status === "confirmed" && (
                    <ActionButton
                      disabled={updatingId === booking._id}
                      onClick={() =>
                        updateStatus(booking._id, "completed")
                      }
                      icon={<CircleCheckBig size={16} />}
                    >
                      Mark Completed
                    </ActionButton>
                  )}

                  {updatingId === booking._id && (
                    <span className="flex items-center px-3 text-xs text-gray-400">
                      Updating...
                    </span>
                  )}

                  <button
                    type="button"
                    disabled={updatingId === booking._id}
                    onClick={() => deleteBooking(booking._id)}
                    className="ml-auto flex items-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-[22px] border border-[#eee8e2] bg-white p-5 shadow-[0_10px_30px_rgba(54,37,28,0.04)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff5ef] text-[#a8441b]">
        {icon}
      </div>

      <p className="mt-5 text-3xl font-bold">{value}</p>

      <p className="mt-1 text-xs text-[#81756e]">{title}</p>
    </div>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 text-[#a8441b]">{icon}</span>

      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-gray-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    completed: "border-blue-200 bg-blue-50 text-blue-700",
    cancelled: "border-red-200 bg-red-50 text-red-600",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
        styles[status] || styles.pending
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
      className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
        danger
          ? "border border-red-200 text-red-600 hover:bg-red-50"
          : "bg-[#a8441b] text-white hover:bg-[#873515]"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}