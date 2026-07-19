"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock3, Loader2, ShieldAlert, CheckCircle2, User, Phone, MapPin, Receipt, XCircle, RefreshCw } from "lucide-react";

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bookings", {
        cache: "no-store",
        headers: {
          "Pragma": "no-cache",
          "Cache-Control": "no-cache"
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      setBookings([]);
      localStorage.removeItem("last_booking_sync");
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
  }, [status, session]);

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this puja booking?");
    if (!confirmCancel) return;

    try {
      setActionLoading(bookingId);
      const response = await fetch(`/api/bookings?id=${bookingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Booking cancelled successfully.");
        // 🔥 UPDATE FRONTEND STATE: Hard delete karne ki bajay status update dikhane ke liye page refresh karwa sakte hain ya state filter
        fetchMyBookings(); 
      } else {
        const errorText = await response.text();
        alert(`Failed to cancel booking: ${errorText || "Internal Server Error"}`);
      }
    } catch (error) {
      console.error("Cancellation routing match failed:", error);
      alert("Error processing request. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#fffdfb]">
        <Loader2 className="h-10 w-10 animate-spin text-[#a8441b]" />
        <p className="mt-3 text-sm text-gray-500 font-medium">Loading your sacred bookings...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-[70vh] flex items-center justify-center bg-[#fffdfb] px-4">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl border border-[#f0e6dd] shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-[#a8441b]">
            <ShieldAlert size={24} />
          </div>
          <h2 className="mt-4 text-xl font-bold text-[#252525]">Access Restricted</h2>
          <p className="mt-2 text-sm text-gray-500 leading-6">
            Please log in to your account to view your personalized puja booking history.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex rounded-full bg-[#a8441b] px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#8d3816]"
          >
            Login / Sign Up
          </Link>
        </div>
      </main>
    );
  }

  if (bookings.length === 0) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center bg-[#fffdfb] px-4">
        <div className="text-center max-w-sm p-6">
          <CalendarDays className="mx-auto text-gray-300" size={48} />
          <h2 className="mt-4 text-lg font-bold text-[#252525]">No Bookings Found</h2>
          <p className="mt-2 text-xs text-gray-400 leading-5">
            You haven't scheduled any sacred rituals yet.
          </p>
          <Link
            href="/pujas"
            className="mt-4 inline-flex rounded-full bg-[#a8441b] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#8d3816]"
          >
            Explore Pujas
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdfb] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {showSuccessBanner && (
          <div className="mb-4 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-3.5 shadow-sm flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-green-900 text-xs">Booking Success!</h4>
              <p className="text-[11px] text-green-700 mt-0.5">Your puja schedule request has been registered and is pending verification.</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#252525] mb-1">My Sacred Bookings</h1>
            <p className="text-[11px] text-gray-400">Logged in as: {session.user.email}</p>
          </div>
          <button 
            onClick={fetchMyBookings}
            className="p-2 border border-gray-200 rounded-xl hover:bg-orange-50 text-gray-500 hover:text-[#a8441b] transition"
            title="Refresh Bookings Status"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {bookings.map((booking) => {
            const rawStatus = (booking.status || "pending").toLowerCase().trim();
            
            let displayStatus = "Pending";
            let badgeColors = "bg-amber-50 border-amber-200 text-amber-700";
            
            // 🔥 CRITICAL LOGIC: Can the user cancel? 
            // True only if status is NOT completed and NOT already cancelled
            let canCancel = true; 

            if (rawStatus === "completed") {
              displayStatus = "Completed";
              badgeColors = "bg-emerald-100 border-emerald-300 text-emerald-800 font-extrabold shadow-sm";
              canCancel = false; // completed puja cancel nahi ho sakti
            } else if (rawStatus === "confirmed" || rawStatus === "success") {
              displayStatus = "Confirmed";
              badgeColors = "bg-green-50 border-green-200 text-green-700";
              canCancel = true; // 🌟 CONFIRMED PUJA BHI USER CANCEL KAR SAKTA HAI
            } else if (rawStatus === "cancelled" || rawStatus === "rejected" || rawStatus === "failed") {
              displayStatus = "Cancelled";
              badgeColors = "bg-red-50 border-red-200 text-red-700";
              canCancel = false; // pehle se cancelled hai toh wapas button nahi dikhana
            }

            return (
              <div
                key={booking._id}
                className="bg-white rounded-2xl border border-[#f0e6dd] shadow-sm overflow-hidden transition duration-200 hover:border-orange-200"
              >
                <div className="bg-[#fffbf7] px-4 py-3 border-b border-[#f3e9df] flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-[#252525]">{booking.pujaName || booking.puja}</h3>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColors}`}>
                        {displayStatus}
                      </span>
                      <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-semibold border border-gray-200">
                        {booking.pujaType || "Offline"}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">ID: <span className="font-mono text-gray-600">{booking.bookingId || booking._id}</span></p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Price</p>
                    <p className="text-base font-extrabold text-[#a8441b]">{booking.price || "Free"}</p>
                  </div>
                </div>

                <div className="p-4 grid gap-3 sm:grid-cols-2 bg-white text-xs text-gray-700">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                      <User size={14} className="text-[#a8441b] shrink-0" />
                      <p className="truncate"><span className="text-gray-400 mr-1">Name:</span> <strong>{booking.name || booking.customerName || "--"}</strong></p>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                      <Phone size={14} className="text-[#a8441b] shrink-0" />
                      <p><span className="text-gray-400 mr-1">Phone:</span> <strong>{booking.phone || "--"}</strong></p>
                    </div>

                    <div className="flex items-start gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                      <MapPin size={14} className="text-[#a8441b] mt-0.5 shrink-0" />
                      <p className="line-clamp-2"><span className="text-gray-400 mr-1">Address:</span> {booking.address || "Online"}</p>
                    </div>
                  </div>

                  <div className="space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex items-center gap-2">
                          <CalendarDays size={14} className="text-[#a8441b] shrink-0" />
                          <p className="truncate"><strong>{booking.date}</strong></p>
                        </div>
                        <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex items-center gap-2">
                          <Clock3 size={14} className="text-[#a8441b] shrink-0" />
                          <p className="truncate text-[11px]"><strong>{booking.timeSlot || booking.slot || "Flexible"}</strong></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                        <Receipt size={14} className="text-[#a8441b] shrink-0" />
                        <p className="truncate w-full font-mono text-[11px]"><span className="text-gray-400 font-sans mr-1">UTR:</span> {booking.transactionId || "Pay on service"}</p>
                      </div>
                    </div>

                    {/* 🔥 BUTTON VISIBILITY LAYER */}
                    {canCancel && (
                      <div className="pt-1 flex justify-end">
                        <button
                          type="button"
                          disabled={actionLoading === booking._id}
                          onClick={() => handleCancelBooking(booking._id)}
                          className="flex items-center gap-1 text-[11px] font-bold text-red-600 transition hover:text-red-800 disabled:opacity-50 border border-red-100 px-3 py-1 rounded-md hover:bg-red-50"
                        >
                          {actionLoading === booking._id ? (
                            <Loader2 size={11} className="animate-spin" />
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
      </div>
    </main>
  );
}