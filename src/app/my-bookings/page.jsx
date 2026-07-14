"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Phone,
  MapPin,
  ReceiptText,
  ChevronRight,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/bookings", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Unable to load bookings");
      }

      setBookings(data?.bookings || []);
    } catch (error) {
      console.error("BOOKINGS ERROR:", error);
      setError(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusStyle = (status) => {
    const value = status?.toLowerCase();

    if (value === "confirmed") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (value === "completed") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (value === "cancelled") {
      return "bg-red-50 text-red-600 border-red-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  const formatDate = (date) => {
    if (!date) return "Not selected";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#fffdfb] text-[#28221f]">
      
      {/* CONTENT */}
      <section className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        {/* LOADING */}
        {loading && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[310px] animate-pulse border border-[#eee8e2] bg-white p-6"
              >
                <div className="h-4 w-24 bg-[#f1ece8]" />
                <div className="mt-6 h-7 w-3/4 bg-[#f1ece8]" />
                <div className="mt-8 h-px bg-[#eee8e2]" />

                <div className="mt-7 space-y-5">
                  <div className="h-4 w-full bg-[#f5f1ee]" />
                  <div className="h-4 w-4/5 bg-[#f5f1ee]" />
                  <div className="h-4 w-3/5 bg-[#f5f1ee]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f8eee9] text-[#a8441b]">
              <RefreshCw size={23} strokeWidth={1.6} />
            </div>

            <h2 className="mt-5 text-2xl font-semibold">
              Unable to load bookings
            </h2>

            <p className="mt-2 text-sm text-[#81756e]">{error}</p>

            <button
              type="button"
              onClick={fetchBookings}
              className="mt-6 bg-[#a8441b] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#873514]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && bookings.length === 0 && (
          <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#faf2ed] text-[#a8441b]">
              <ReceiptText size={32} strokeWidth={1.4} />
            </div>

            <h2 className="mt-7 text-3xl font-semibold tracking-[-0.03em]">
              No bookings yet
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-[#81756e]">
              Your booked pujas will appear here. Explore our pujas and begin
              your spiritual journey.
            </p>

            <Link
              href="/pujas"
              className="mt-7 flex h-12 items-center justify-center gap-2 bg-[#a8441b] px-7 text-sm font-semibold text-white transition hover:bg-[#873514]"
            >
              Explore Pujas
              <ChevronRight size={17} />
            </Link>
          </div>
        )}

        {/* BOOKINGS */}
        {!loading && !error && bookings.length > 0 && (
          <>
            <div className="mb-7 flex items-end justify-between border-b border-[#eee8e2] pb-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a8441b]">
                  Your Puja Journey
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                  Booking History
                </h2>
              </div>

              <span className="text-xs text-[#8d817a]">
                {bookings.length}{" "}
                {bookings.length === 1 ? "Booking" : "Bookings"}
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {bookings.map((booking, index) => (
                <article
                  key={booking._id}
                  style={{
                    animationDelay: `${index * 90}ms`,
                  }}
                  className="
                    group
                    relative
                    overflow-hidden
                    border
                    border-[#eee8e2]
                    bg-white
                    p-6
                    shadow-[0_12px_35px_rgba(54,37,28,0.05)]
                    animate-[bookingCard_0.65s_ease-out_forwards]

                    transition-all
                    duration-500

                    hover:-translate-y-1
                    hover:border-[#d9c5b9]
                    hover:shadow-[0_24px_60px_rgba(54,37,28,0.10)]
                  "
                >
                  {/* TOP LINE */}
                  <span className="absolute left-0 top-0 h-[2px] w-0 bg-[#a8441b] transition-all duration-500 group-hover:w-full" />

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#9b8d85]">
                        Puja Booking
                      </p>

                      <h3 className="mt-3 text-[22px] font-semibold tracking-[-0.025em] text-[#28221f]">
                        {booking.pujaName}
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status || "Pending"}
                    </span>
                  </div>

                  {/* BOOKING ID */}
                  <div className="mt-6 border-y border-[#f0ebe7] py-4">
                    <div className="flex items-center gap-3">
                      <ReceiptText
                        size={17}
                        strokeWidth={1.6}
                        className="text-[#a8441b]"
                      />

                      <div>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-[#9b8d85]">
                          Booking ID
                        </p>

                        <p className="mt-1 text-[13px] font-semibold text-[#3d342f]">
                          {booking.bookingId}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="mt-5 space-y-4">
                    <BookingDetail
                      icon={<CalendarDays size={17} strokeWidth={1.6} />}
                      label="Puja Date"
                      value={formatDate(booking.date)}
                    />

                    <BookingDetail
                      icon={<Clock3 size={17} strokeWidth={1.6} />}
                      label="Time"
                      value={booking.timeSlot || "Flexible"}
                    />

                    <BookingDetail
                      icon={<Phone size={17} strokeWidth={1.6} />}
                      label="Phone"
                      value={booking.phone || "Not available"}
                    />

                    {booking.address && (
                      <BookingDetail
                        icon={<MapPin size={17} strokeWidth={1.6} />}
                        label="Address"
                        value={booking.address}
                      />
                    )}
                  </div>

                  {/* PRICE */}
                  {booking.price && (
                    <div className="mt-6 flex items-center justify-between border-t border-[#f0ebe7] pt-5">
                      <span className="text-xs text-[#8d817a]">
                        Booking Amount
                      </span>

                      <span className="text-lg font-bold text-[#a8441b]">
                        {booking.price}
                      </span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      
    </main>
  );
}

function BookingDetail({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-[#a8441b]">{icon}</span>

      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.11em] text-[#9b8d85]">
          {label}
        </p>

        <p className="mt-1 break-words text-[13px] font-medium leading-5 text-[#4a403a]">
          {value}
        </p>
      </div>
    </div>
  );
}