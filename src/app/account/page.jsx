"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  CircleUserRound,
  Clock3,
  HeartHandshake,
  Loader2,
  LogOut,
  Mail,
  Phone,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [pujaBookings, setPujaBookings] = useState([]);
  const [sevaBookings, setSevaBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadBookings = useCallback(async () => {
    try {
      setLoadingBookings(true);
      setErrorMessage("");

      const [pujaResponse, sevaResponse] = await Promise.all([
        fetch("/api/bookings", {
          cache: "no-store",
        }),

        fetch("/api/seva-bookings", {
          cache: "no-store",
        }),
      ]);

      const [pujaData, sevaData] = await Promise.all([
        pujaResponse.json(),
        sevaResponse.json(),
      ]);

      if (!pujaResponse.ok) {
        throw new Error(
          pujaData?.error ||
            pujaData?.message ||
            "Unable to load Puja bookings"
        );
      }

      if (!sevaResponse.ok) {
        throw new Error(
          sevaData?.error ||
            sevaData?.message ||
            "Unable to load Seva bookings"
        );
      }

      setPujaBookings(pujaData.bookings || []);
      setSevaBookings(sevaData.bookings || []);
    } catch (error) {
      console.error("ACCOUNT BOOKINGS ERROR:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load account information"
      );
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/account");
      return;
    }

    if (status === "authenticated") {
      loadBookings();
    }
  }, [status, router, loadBookings]);

  const statistics = useMemo(() => {
    const allBookings = [
      ...pujaBookings,
      ...sevaBookings,
    ];

    const getStatus = (booking) =>
      String(
        booking.status ||
          booking.bookingStatus ||
          "pending"
      )
        .toLowerCase()
        .trim();

    return {
      total: allBookings.length,

      puja: pujaBookings.length,

      seva: sevaBookings.length,

      completed: allBookings.filter(
        (booking) => getStatus(booking) === "completed"
      ).length,
    };
  }, [pujaBookings, sevaBookings]);

  const recentBookings = useMemo(() => {
    const formattedPujas = pujaBookings.map((booking) => ({
      ...booking,
      bookingType: "puja",
      displayTitle:
        booking.pujaName ||
        booking.puja ||
        "Puja Booking",

      displayStatus:
        booking.status || "pending",
    }));

    const formattedSevas = sevaBookings.map((booking) => ({
      ...booking,
      bookingType: "seva",
      displayTitle:
        booking.sevaType || "Gau Seva",

      displayStatus:
        booking.bookingStatus ||
        booking.status ||
        "pending",
    }));

    return [
      ...formattedPujas,
      ...formattedSevas,
    ]
      .sort(
        (first, second) =>
          new Date(second.createdAt || 0).getTime() -
          new Date(first.createdAt || 0).getTime()
      )
      .slice(0, 4);
  }, [pujaBookings, sevaBookings]);

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  if (
    status === "loading" ||
    status === "unauthenticated"
  ) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#fffdfb]">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-[#a8441b]" />

          <p className="mt-4 text-sm text-[#786d66]">
            Loading your account...
          </p>
        </div>
      </main>
    );
  }

  const userName =
    session?.user?.name || "Puja Dham User";

  const userEmail =
    session?.user?.email || "Email not available";

  const userImage = session?.user?.image;

  return (
    <main className="min-h-screen bg-[#fffdfb] pb-20 text-[#28221f]">
      <section className="relative overflow-hidden border-b border-[#eee8e2] bg-white">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#fff2e8] to-transparent" />

      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <div className="grid gap-7 lg:grid-cols-[360px_1fr]">
          <aside>
            <div className="rounded-[30px] border border-[#eee8e2] bg-white p-6 shadow-[0_18px_50px_rgba(54,37,28,0.06)]">
              <div className="flex items-center gap-4">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    className="h-16 w-16 rounded-full border-2 border-[#f0e4dc] object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fff2e9] text-[#a8441b]">
                    <CircleUserRound size={34} />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-xl font-bold">
                    {userName}
                  </p>

                  <p className="mt-1 truncate text-xs text-[#897e77]">
                    {userEmail}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-[#f0ebe7] pt-5">
                <ProfileDetail
                  icon={<UserRound size={16} />}
                  label="Full Name"
                  value={userName}
                />

                <ProfileDetail
                  icon={<Mail size={16} />}
                  label="Email Address"
                  value={userEmail}
                />

                <ProfileDetail
                  icon={<Phone size={16} />}
                  label="Phone Number"
                  value={
                    session?.user?.phone ||
                    "Not added"
                  }
                />
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <ShieldCheck size={17} />

                  <p className="text-xs font-bold">
                    Verified account
                  </p>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-emerald-700/80">
                  Your account is authenticated and secured
                  through Puja Dham login.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-sm font-bold text-red-600 transition hover:bg-red-100"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          </aside>

          <div>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              <AccountStat
                icon={<ReceiptText size={20} />}
                value={statistics.total}
                label="Total Bookings"
              />

              <AccountStat
                icon={<Sparkles size={20} />}
                value={statistics.puja}
                label="Puja Bookings"
              />

              <AccountStat
                icon={<HeartHandshake size={20} />}
                value={statistics.seva}
                label="Seva Bookings"
              />

              <AccountStat
                icon={<ShieldCheck size={20} />}
                value={statistics.completed}
                label="Completed"
              />
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <AccountLink
                href="/my-bookings?tab=puja"
                icon={<Sparkles size={21} />}
                title="My Puja Bookings"
                description="View Puja dates, status and booking details."
              />

              <AccountLink
                href="/my-bookings?tab=seva"
                icon={<HeartHandshake size={21} />}
                title="My Seva Bookings"
                description="View Gau Seva offerings and payment status."
              />

              <AccountLink
                href="/pujas"
                icon={<CalendarDays size={21} />}
                title="Book a Puja"
                description="Explore available Vedic Puja services."
              />

              <AccountLink
                href="/gau-seva"
                icon={<HeartHandshake size={21} />}
                title="Offer Gau Seva"
                description="Make a sacred Gau Seva offering."
              />
            </div>

            <div className="mt-7 rounded-[30px] border border-[#eee8e2] bg-white p-6 shadow-[0_14px_40px_rgba(54,37,28,0.04)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a8441b]">
                    Activity
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold">
                    Recent Bookings
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={loadBookings}
                  disabled={loadingBookings}
                  className="flex items-center gap-2 rounded-xl border border-[#e8dfd9] px-3 py-2 text-xs font-bold text-[#756a63] transition hover:border-[#a8441b] hover:text-[#a8441b] disabled:opacity-50"
                >
                  <RefreshCw
                    size={14}
                    className={
                      loadingBookings
                        ? "animate-spin"
                        : ""
                    }
                  />

                  Refresh
                </button>
              </div>

              {errorMessage && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              {loadingBookings ? (
                <div className="flex min-h-[220px] items-center justify-center">
                  <Loader2 className="h-7 w-7 animate-spin text-[#a8441b]" />
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="py-14 text-center">
                  <ReceiptText
                    size={35}
                    className="mx-auto text-[#c4b4aa]"
                  />

                  <p className="mt-4 text-sm font-semibold">
                    No bookings found
                  </p>

                  <p className="mt-1 text-xs text-[#90857e]">
                    Your latest Puja and Seva bookings will
                    appear here.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {recentBookings.map((booking) => {
                    const bookingId =
                      booking._id ||
                      booking.bookingId;

                    return (
                      <div
                        key={`${booking.bookingType}-${bookingId}`}
                        className="flex flex-col gap-4 rounded-2xl border border-[#f0e9e4] bg-[#fffdfb] p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                              booking.bookingType === "seva"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-orange-50 text-orange-700"
                            }`}
                          >
                            {booking.bookingType === "seva" ? (
                              <HeartHandshake size={20} />
                            ) : (
                              <Sparkles size={20} />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold">
                              {booking.displayTitle}
                            </p>

                            <div className="mt-1 flex items-center gap-2 text-[11px] text-[#90857e]">
                              <Clock3 size={12} />

                              {booking.createdAt
                                ? new Date(
                                    booking.createdAt
                                  ).toLocaleDateString(
                                    "en-IN"
                                  )
                                : "Date not available"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                          <StatusBadge
                            status={
                              booking.displayStatus
                            }
                          />

                          <Link
                            href={
                              booking.bookingType ===
                              "seva"
                                ? "/my-bookings?tab=seva"
                                : "/my-bookings?tab=puja"
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e9dfd9] text-[#a8441b] transition hover:bg-[#fff2e9]"
                          >
                            <ChevronRight size={16} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <Link
                href="/my-bookings"
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#a8441b] text-sm font-bold text-white transition hover:bg-[#873515]"
              >
                View All Bookings
                <ChevronRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProfileDetail({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-[#fffaf6] p-3">
      <span className="mt-0.5 shrink-0 text-[#a8441b]">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-wider text-[#a59891]">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold">
          {value}
        </p>
      </div>
    </div>
  );
}

function AccountStat({ icon, value, label }) {
  return (
    <div className="rounded-[24px] border border-[#eee8e2] bg-white p-5 shadow-[0_10px_30px_rgba(54,37,28,0.03)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff2e9] text-[#a8441b]">
        {icon}
      </div>

      <p className="mt-4 text-3xl font-extrabold">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-[#81756e]">
        {label}
      </p>
    </div>
  );
}

function AccountLink({
  href,
  icon,
  title,
  description,
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-[24px] border border-[#eee8e2] bg-white p-5 shadow-[0_10px_30px_rgba(54,37,28,0.03)] transition hover:-translate-y-1 hover:border-[#dcbba8] hover:shadow-[0_18px_45px_rgba(54,37,28,0.08)]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff2e9] text-[#a8441b]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-bold">{title}</p>

        <p className="mt-1 text-xs leading-5 text-[#81756e]">
          {description}
        </p>
      </div>

      <ChevronRight
        size={18}
        className="shrink-0 text-[#b7aaa3] transition group-hover:translate-x-1 group-hover:text-[#a8441b]"
      />
    </Link>
  );
}

function StatusBadge({ status }) {
  const current = String(status || "pending")
    .toLowerCase()
    .trim();

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
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-wider ${
        styles[current] || styles.pending
      }`}
    >
      {current}
    </span>
  );
}