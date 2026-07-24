"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  Loader2,
  ShieldAlert,
  CheckCircle2,
  User,
  Phone,
  MapPin,
  Receipt,
  XCircle,
  RefreshCw,
  HeartHandshake,
  Sparkles,
  Mail,
  IndianRupee,
} from "lucide-react";

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

      const [pujaResponse, sevaResponse] = await Promise.all([
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

      const pujaData = pujaResponse.ok
        ? await pujaResponse.json()
        : { bookings: [] };

      const sevaData = sevaResponse.ok
        ? await sevaResponse.json()
        : { bookings: [] };

      setPujaBookings(pujaData.bookings || []);
      setSevaBookings(sevaData.bookings || []);

      if (!pujaResponse.ok && !sevaResponse.ok) {
        setErrorMessage("Unable to load your bookings.");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setPujaBookings([]);
      setSevaBookings([]);
      setErrorMessage("Unable to load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      setPujaBookings([]);
      setSevaBookings([]);
      localStorage.removeItem("last_booking_sync");
      setLoading(false);
      return;
    }

    if (status === "authenticated" && session?.user?.email) {
      fetchMyBookings();

      if (typeof window !== "undefined") {
        const justBooked = localStorage.getItem(
          "just_booked_trigger"
        );

        if (justBooked === "true") {
          setShowSuccessBanner(true);
          localStorage.removeItem("just_booked_trigger");
        }
      }
    }
  }, [status, session]);

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this puja booking?"
    );

    if (!confirmCancel) return;

    try {
      setActionLoading(bookingId);

      const response = await fetch(
        `/api/bookings?id=${bookingId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Booking cancelled successfully.");
        fetchMyBookings();
      } else {
        const errorText = await response.text();

        alert(
          `Failed to cancel booking: ${
            errorText || "Internal Server Error"
          }`
        );
      }
    } catch (error) {
      console.error("Cancellation failed:", error);
      alert("Error processing request. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const displayedBookings = useMemo(
    () => (activeTab === "seva" ? sevaBookings : pujaBookings),
    [activeTab, sevaBookings, pujaBookings]
  );

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#fffdfb]">
        <Loader2 className="h-10 w-10 animate-spin text-[#a8441b]" />

        <p className="mt-3 text-sm font-medium text-gray-500">
          Loading your sacred bookings...
        </p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#fffdfb] px-4">
        <div className="max-w-md rounded-2xl border border-[#f0e6dd] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-[#a8441b]">
            <ShieldAlert size={24} />
          </div>

          <p className="mt-4 text-sm leading-6 text-gray-500">
            Please log in to view your Puja and Seva booking
            history.
          </p>

          <Link
            href="/login?callbackUrl=/my-bookings"
            className="mt-5 inline-flex rounded-full bg-[#a8441b] px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#8d3816]"
          >
            Login / Sign Up
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdfb] px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {showSuccessBanner && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-3.5 shadow-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

            <div>
              <h4 className="text-xs font-bold text-green-900">
                Booking Success!
              </h4>

              <p className="mt-0.5 text-[11px] text-green-700">
                Your booking request has been registered and is
                pending verification.
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-[#252525]">
              My Sacred Bookings
            </h1>

            <p className="text-[11px] text-gray-400">
              Logged in as: {session?.user?.email}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchMyBookings}
            className="rounded-xl border border-gray-200 p-2 text-gray-500 transition hover:bg-orange-50 hover:text-[#a8441b]"
            title="Refresh Bookings Status"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-[#eee4dc] bg-white p-2">
          <button
            type="button"
            onClick={() => setActiveTab("puja")}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
              activeTab === "puja"
                ? "bg-[#a8441b] text-white shadow-sm"
                : "text-gray-500 hover:bg-orange-50"
            }`}
          >
            <Sparkles size={16} />
            Puja Bookings
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${
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
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
              activeTab === "seva"
                ? "bg-[#a8441b] text-white shadow-sm"
                : "text-gray-500 hover:bg-orange-50"
            }`}
          >
            <HeartHandshake size={16} />
            Seva Bookings
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${
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
          <div className="flex min-h-[45vh] items-center justify-center">
            <div className="max-w-sm p-6 text-center">
              {activeTab === "seva" ? (
                <HeartHandshake
                  className="mx-auto text-gray-300"
                  size={48}
                />
              ) : (
                <CalendarDays
                  className="mx-auto text-gray-300"
                  size={48}
                />
              )}

              <h2 className="mt-4 text-lg font-bold text-[#252525]">
                No {activeTab === "seva" ? "Seva" : "Puja"} Bookings
                Found
              </h2>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                {activeTab === "seva"
                  ? "You have not offered any Gau Seva yet."
                  : "You have not scheduled any sacred rituals yet."}
              </p>

              <Link
                href={activeTab === "seva" ? "/seva" : "/pujas"}
                className="mt-4 inline-flex rounded-full bg-[#a8441b] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#8d3816]"
              >
                {activeTab === "seva"
                  ? "Offer Seva"
                  : "Explore Pujas"}
              </Link>
            </div>
          </div>
        ) : activeTab === "seva" ? (
          <div className="space-y-4">
            {sevaBookings.map((booking) => {
              const bookingStatus = (
                booking.bookingStatus || "pending"
              )
                .toLowerCase()
                .trim();

              const paymentStatus = (
                booking.paymentStatus || "pending"
              )
                .toLowerCase()
                .trim();

              const bookingBadge =
                bookingStatus === "completed"
                  ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                  : bookingStatus === "confirmed"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : bookingStatus === "cancelled"
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-amber-50 border-amber-200 text-amber-700";

              const paymentBadge =
                paymentStatus === "paid"
                  ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                  : paymentStatus === "submitted"
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : paymentStatus === "failed"
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-amber-50 border-amber-200 text-amber-700";

              return (
                <div
                  key={booking._id}
                  className="overflow-hidden rounded-2xl border border-[#f0e6dd] bg-white shadow-sm transition duration-200 hover:border-orange-200"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f3e9df] bg-[#fffbf7] px-4 py-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-[#252525]">
                          {booking.sevaType || "Gau Seva"}
                        </h3>

                        <span
                          className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${bookingBadge}`}
                        >
                          {bookingStatus}
                        </span>

                        <span
                          className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${paymentBadge}`}
                        >
                          Payment: {paymentStatus}
                        </span>
                      </div>

                      <p className="mt-0.5 text-[11px] text-gray-400">
                        ID:{" "}
                        <span className="font-mono text-gray-600">
                          {booking._id}
                        </span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">
                        Seva Amount
                      </p>

                      <p className="text-base font-extrabold text-[#a8441b]">
                        ₹{booking.amount || 0}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 bg-white p-4 text-xs text-gray-700 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                        <User
                          size={14}
                          className="shrink-0 text-[#a8441b]"
                        />

                        <p className="truncate">
                          <span className="mr-1 text-gray-400">
                            Name:
                          </span>

                          <strong>
                            {booking.name ||
                              booking.userName ||
                              "--"}
                          </strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                        <Mail
                          size={14}
                          className="shrink-0 text-[#a8441b]"
                        />

                        <p className="truncate">
                          <span className="mr-1 text-gray-400">
                            Email:
                          </span>

                          <strong>
                            {booking.email ||
                              booking.userEmail ||
                              "--"}
                          </strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                        <Phone
                          size={14}
                          className="shrink-0 text-[#a8441b]"
                        />

                        <p>
                          <span className="mr-1 text-gray-400">
                            Phone:
                          </span>

                          <strong>{booking.phone || "--"}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                        <Sparkles
                          size={14}
                          className="shrink-0 text-[#a8441b]"
                        />

                        <p>
                          <span className="mr-1 text-gray-400">
                            Sankalp:
                          </span>

                          <strong>
                            {booking.sankalpName || "Not provided"}
                          </strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                        <HeartHandshake
                          size={14}
                          className="shrink-0 text-[#a8441b]"
                        />

                        <p>
                          <span className="mr-1 text-gray-400">
                            Gotra:
                          </span>

                          <strong>
                            {booking.gotra || "Not provided"}
                          </strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                        <CalendarDays
                          size={14}
                          className="shrink-0 text-[#a8441b]"
                        />

                        <p>
                          <span className="mr-1 text-gray-400">
                            Booked:
                          </span>

                          <strong>
                            {booking.createdAt
                              ? new Date(
                                  booking.createdAt
                                ).toLocaleString("en-IN")
                              : "--"}
                          </strong>
                        </p>
                      </div>
                    </div>

                    {booking.message && (
                      <div className="rounded-lg border border-orange-100 bg-orange-50/50 px-3 py-3 sm:col-span-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#a8441b]">
                          Message / Prayer
                        </p>

                        <p className="mt-1 leading-5 text-gray-600">
                          {booking.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {pujaBookings.map((booking) => {
              const rawStatus = (
                booking.status || "pending"
              )
                .toLowerCase()
                .trim();

              let displayStatus = "Pending";
              let badgeColors =
                "bg-amber-50 border-amber-200 text-amber-700";
              let canCancel = true;

              if (rawStatus === "completed") {
                displayStatus = "Completed";
                badgeColors =
                  "bg-emerald-100 border-emerald-300 text-emerald-800 font-extrabold shadow-sm";
                canCancel = false;
              } else if (
                rawStatus === "confirmed" ||
                rawStatus === "success"
              ) {
                displayStatus = "Confirmed";
                badgeColors =
                  "bg-green-50 border-green-200 text-green-700";
              } else if (
                rawStatus === "cancelled" ||
                rawStatus === "rejected" ||
                rawStatus === "failed"
              ) {
                displayStatus = "Cancelled";
                badgeColors =
                  "bg-red-50 border-red-200 text-red-700";
                canCancel = false;
              }

              return (
                <div
                  key={booking._id}
                  className="overflow-hidden rounded-2xl border border-[#f0e6dd] bg-white shadow-sm transition duration-200 hover:border-orange-200"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f3e9df] bg-[#fffbf7] px-4 py-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-[#252525]">
                          {booking.pujaName || booking.puja}
                        </h3>

                        <span
                          className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${badgeColors}`}
                        >
                          {displayStatus}
                        </span>

                        <span className="rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-[9px] font-semibold text-gray-600">
                          {booking.pujaType || "Offline"}
                        </span>
                      </div>

                      <p className="mt-0.5 text-[11px] text-gray-400">
                        ID:{" "}
                        <span className="font-mono text-gray-600">
                          {booking.bookingId || booking._id}
                        </span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">
                        Price
                      </p>

                      <p className="text-base font-extrabold text-[#a8441b]">
                        {booking.price || "Free"}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 bg-white p-4 text-xs text-gray-700 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                        <User
                          size={14}
                          className="shrink-0 text-[#a8441b]"
                        />

                        <p className="truncate">
                          <span className="mr-1 text-gray-400">
                            Name:
                          </span>

                          <strong>
                            {booking.name ||
                              booking.customerName ||
                              "--"}
                          </strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                        <Phone
                          size={14}
                          className="shrink-0 text-[#a8441b]"
                        />

                        <p>
                          <span className="mr-1 text-gray-400">
                            Phone:
                          </span>

                          <strong>{booking.phone || "--"}</strong>
                        </p>
                      </div>

                      <div className="flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                        <MapPin
                          size={14}
                          className="mt-0.5 shrink-0 text-[#a8441b]"
                        />

                        <p className="line-clamp-2">
                          <span className="mr-1 text-gray-400">
                            Address:
                          </span>

                          {booking.address || "Online"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between space-y-2">
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                            <CalendarDays
                              size={14}
                              className="shrink-0 text-[#a8441b]"
                            />

                            <p className="truncate">
                              <strong>{booking.date || "--"}</strong>
                            </p>
                          </div>

                          <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                            <Clock3
                              size={14}
                              className="shrink-0 text-[#a8441b]"
                            />

                            <p className="truncate text-[11px]">
                              <strong>
                                {booking.timeSlot ||
                                  booking.slot ||
                                  "Flexible"}
                              </strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                          <Receipt
                            size={14}
                            className="shrink-0 text-[#a8441b]"
                          />

                          <p className="w-full truncate font-mono text-[11px]">
                            <span className="mr-1 font-sans text-gray-400">
                              UTR:
                            </span>

                            {booking.transactionId ||
                              "Pay on service"}
                          </p>
                        </div>
                      </div>

                      {canCancel && (
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            disabled={
                              actionLoading === booking._id
                            }
                            onClick={() =>
                              handleCancelBooking(booking._id)
                            }
                            className="flex items-center gap-1 rounded-md border border-red-100 px-3 py-1 text-[11px] font-bold text-red-600 transition hover:bg-red-50 hover:text-red-800 disabled:opacity-50"
                          >
                            {actionLoading === booking._id ? (
                              <Loader2
                                size={11}
                                className="animate-spin"
                              />
                            ) : (
                              <XCircle size={11} />
                            )}

                            Cancel Booking
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}