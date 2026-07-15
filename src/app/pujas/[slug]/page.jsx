"use client";

import { PUJAS } from "../../pujasData";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";

export default function PujaDetail() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [showLoginModal, setShowLoginModal] = useState(false);

  const slug = params?.slug;

  const puja = PUJAS.find(
    (p) =>
      p?.slug?.toLowerCase() ===
      slug?.toLowerCase()
  );

  if (!puja) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">
            Puja not found
          </p>

          <Link
            href="/pujas"
            className="mt-4 inline-block text-sm font-semibold text-[#a8441b]"
          >
            ← Back to Pujas
          </Link>
        </div>
      </main>
    );
  }

  const handleBooking = (type, price) => {
    if (status === "loading") {
      return;
    }

    if (!session) {
      setShowLoginModal(true);
      return;
    }

    router.push(
      `/booking?puja=${encodeURIComponent(
        puja.name
      )}&type=${encodeURIComponent(
        type
      )}&price=${encodeURIComponent(price)}`
    );
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <section className="mx-auto w-full max-w-[1180px] px-4 pb-20 pt-6 sm:px-5 md:px-6 md:pt-10 lg:px-8">
        {/* BACK */}

        <div className="mb-5 animate-[fadeUp_.6s_ease-out]">
          <Link
            href="/pujas"
            className="
              inline-flex
              items-center
              gap-2
              text-[13px]
              font-semibold
              text-gray-500
              transition-all
              duration-300
              hover:-translate-x-1
              hover:text-[#a8441b]
            "
          >
            <span>←</span>
            Back to Pujas
          </Link>
        </div>

        {/* MAIN CARD */}

        <div
          className="
            grid
            overflow-hidden
            rounded-[28px]
            border
            border-gray-100
            bg-white
            shadow-[0_20px_60px_rgba(60,30,10,0.08)]
            animate-[detailReveal_.8s_cubic-bezier(.22,1,.36,1)]
            md:rounded-[36px]
            lg:grid-cols-[1.05fr_.95fr]
          "
        >
          {/* IMAGE */}

          <div className="group relative min-h-[300px] overflow-hidden sm:min-h-[420px] lg:min-h-[620px]">
            <img
              src={puja.image}
              alt={puja.name}
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition-transform
                duration-[1200ms]
                ease-out
                group-hover:scale-[1.04]
              "
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

            <span
              className="
                absolute
                left-5
                top-5
                rounded-full
                bg-white/90
                px-4
                py-2
                text-[11px]
                font-bold
                tracking-wide
                text-[#a8441b]
                shadow-sm
                backdrop-blur-md
              "
            >
              {puja.category}
            </span>

            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
              <span className="text-[12px] font-medium">
                Authentic Vedic Puja
              </span>

              <span className="text-[12px] font-medium">
                ◷ {puja.duration}
              </span>
            </div>
          </div>

          {/* CONTENT */}

          <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="animate-[fadeUp_.7s_.15s_both]">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a8441b]">
                Sacred Puja Service
              </span>

              <h1
                className="
                  mt-3
                  text-[32px]
                  font-extrabold
                  leading-[1.08]
                  tracking-[-0.035em]
                  text-[#252525]
                  sm:text-[40px]
                  lg:text-[48px]
                "
              >
                {puja.name}
              </h1>

              <p className="mt-5 text-[15px] leading-7 text-gray-500 md:text-[16px]">
                {puja.shortDescription}
              </p>
            </div>

            {/* PUJA OPTIONS */}

            <div className="mt-8 space-y-3 animate-[fadeUp_.7s_.25s_both]">
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-gray-400">
                Puja Options
              </p>

              {/* ONLINE */}

              {puja.onlineAvailable && (
                <div
                  className="
                    group
                    rounded-2xl
                    border
                    border-orange-100
                    bg-[#fffaf6]
                    p-4
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#a8441b]/30
                    hover:shadow-[0_12px_30px_rgba(168,68,27,0.08)]
                    md:p-5
                  "
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[14px] font-bold text-[#252525]">
                        Online Puja
                      </p>

                      <p className="mt-1 text-[12px] text-gray-500">
                        Puja performed on your behalf
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[20px] font-extrabold text-[#a8441b]">
                        {puja.onlinePrice}
                      </p>

                      {puja.offlinePrice && (
                        <p className="text-[11px] text-gray-400 line-through">
                          {puja.offlinePrice}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={status === "loading"}
                    onClick={() =>
                      handleBooking(
                        "online",
                        puja.onlinePrice
                      )
                    }
                    className="
                      mt-4
                      flex
                      h-11
                      w-full
                      items-center
                      justify-center
                      rounded-full
                      bg-[#a8441b]
                      text-[13px]
                      font-semibold
                      text-white
                      transition-all
                      duration-300
                      hover:bg-[#873515]
                      hover:shadow-[0_12px_25px_rgba(168,68,27,0.25)]
                      active:scale-[0.98]
                      disabled:cursor-wait
                      disabled:opacity-70
                    "
                  >
                    {status === "loading"
                      ? "Please wait..."
                      : "Book Online Puja"}
                  </button>
                </div>
              )}

              {/* OFFLINE */}

              {puja.offlineAvailable && (
                <div
                  className="
                    group
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-4
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#a8441b]/30
                    hover:shadow-[0_12px_30px_rgba(60,30,10,0.07)]
                    md:p-5
                  "
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[14px] font-bold text-[#252525]">
                        Offline Puja
                      </p>

                      <p className="mt-1 text-[12px] text-gray-500">
                        Puja performed at your location
                      </p>
                    </div>

                    <p className="text-[20px] font-extrabold text-[#a8441b]">
                      {puja.offlinePrice}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={status === "loading"}
                    onClick={() =>
                      handleBooking(
                        "offline",
                        puja.offlinePrice
                      )
                    }
                    className="
                      mt-4
                      flex
                      h-11
                      w-full
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#a8441b]
                      text-[13px]
                      font-semibold
                      text-[#a8441b]
                      transition-all
                      duration-300
                      hover:bg-[#a8441b]
                      hover:text-white
                      active:scale-[0.98]
                      disabled:cursor-wait
                      disabled:opacity-70
                    "
                  >
                    {status === "loading"
                      ? "Please wait..."
                      : "Book Offline Puja"}
                  </button>
                </div>
              )}
            </div>

            {/* DESCRIPTION */}

            {puja.description && (
              <div className="mt-8 border-t border-gray-100 pt-7 animate-[fadeUp_.7s_.35s_both]">
                <h2 className="text-[14px] font-bold text-[#252525]">
                  About this Puja
                </h2>

                <p className="mt-3 text-[13px] leading-6 text-gray-500 md:text-[14px]">
                  {puja.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* LOGIN POPUP */}

      {showLoginModal && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            bg-[#24140d]/35
            backdrop-blur-[5px]
            animate-[loginBackdropIn_.3s_ease-out]
          "
          onClick={() => setShowLoginModal(false)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="
              relative
              flex
              min-h-full
              w-full
              max-w-[590px]
              flex-col
              overflow-hidden
              border-r
              border-[#eee8e2]
              bg-[#fffdfb]
              shadow-[35px_0_100px_rgba(43,20,9,0.22)]
              animate-[loginDrawerIn_.7s_cubic-bezier(.22,1,.36,1)]
              sm:w-[88%]
              lg:w-1/2
              lg:max-w-[720px]
            "
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-36 -top-36 h-[430px] w-[430px] rounded-full bg-[#fff2e9] blur-[110px]" />

              <div className="absolute -bottom-40 -right-28 h-[470px] w-[470px] rounded-full bg-[#f8eee8] blur-[120px]" />
            </div>

            {/* CLOSE */}

            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowLoginModal(false)}
              className="
                absolute
                right-5
                top-5
                z-30
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#e9ddd6]
                bg-white/90
                text-[#8a7060]
                shadow-sm
                backdrop-blur-md
                transition-all
                duration-300
                hover:rotate-90
                hover:border-[#a8441b]/30
                hover:text-[#a8441b]
                active:scale-90
                sm:right-7
                sm:top-7
              "
            >
              <X size={18} />
            </button>

            <div className="relative flex flex-1 flex-col px-6 pb-8 pt-7 sm:px-10 sm:pb-10 sm:pt-9 lg:px-14">
              {/* LOGO */}

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="group"
                >
                  <img
                    src="/pujadham1.png"
                    alt="Puja Dham"
                    className="
                      h-[88px]
                      w-auto
                      object-contain
                      transition-transform
                      duration-500
                      group-hover:scale-[1.035]
                      sm:h-[104px]
                    "
                  />
                </button>
              </div>

              {/* CONTENT */}

              <div className="my-auto py-10 text-center animate-[loginContentIn_.8s_.18s_both] sm:py-12">
                <div
                  className="
                    mx-auto
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-[#eadbd2]
                    bg-white/80
                    px-3
                    py-1.5
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.22em]
                    text-[#a8441b]
                  "
                >
                  <Sparkles
                    size={13}
                    strokeWidth={1.7}
                  />

                  Sacred Booking
                </div>

                <h2
                  className="
                    mx-auto
                    mt-7
                    max-w-[500px]
                    text-[45px]
                    font-semibold
                    leading-[0.92]
                    tracking-[-0.035em]
                    text-[#28221f]
                    sm:text-[58px]
                    lg:text-[66px]
                  "
                >
                  Continue your

                  <span className="block text-[#a8441b]">
                    sacred journey.
                  </span>
                </h2>

                <p className="mx-auto mt-6 max-w-[430px] text-[14px] leading-7 text-[#756a63] sm:text-[15px]">
                  Login to continue your puja booking.
                  Your sacred bookings and updates stay
                  connected to your account.
                </p>

                <div className="mx-auto mt-10 w-full max-w-[430px] space-y-3">
                  {/* LOGIN */}

                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="
                      group
                      flex
                      h-[54px]
                      w-full
                      items-center
                      justify-center
                      gap-3
                      rounded-full
                      bg-[#431407]
                      px-7
                      text-[13px]
                      font-bold
                      text-white
                      shadow-[0_16px_35px_rgba(67,20,7,0.20)]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:bg-[#5b1d0b]
                      hover:shadow-[0_22px_45px_rgba(67,20,7,0.25)]
                      active:scale-[0.98]
                    "
                  >
                    Login to continue

                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>

                  {/* REGISTER */}

                  <button
                    type="button"
                    onClick={() =>
                      router.push("/register")
                    }
                    className="
                      h-[54px]
                      w-full
                      rounded-full
                      border
                      border-[#dfcec4]
                      bg-white
                      px-7
                      text-[13px]
                      font-bold
                      text-[#a8441b]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#a8441b]/45
                      hover:bg-[#fff8f3]
                      active:scale-[0.98]
                    "
                  >
                    Create an account
                  </button>

                  {/* CLOSE */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowLoginModal(false)
                    }
                    className="
                      w-full
                      py-3
                      text-[12px]
                      font-semibold
                      text-[#9a8a81]
                      transition-colors
                      duration-300
                      hover:text-[#431407]
                    "
                  >
                    Maybe later
                  </button>
                </div>
              </div>

              <div className="border-t border-[#eee8e2] pt-5 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-[0.19em] text-[#9a8a81] sm:text-[10px]">
                  Secure account · Personal bookings ·
                  Puja updates
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}

      <style>{`
        @keyframes detailReveal {
          from {
            opacity: 0;
            transform: translateY(28px) scale(.985);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes loginBackdropIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes loginDrawerIn {
          from {
            transform: translateX(-100%);
          }

          to {
            transform: translateX(0);
          }
        }

        @keyframes loginContentIn {
          from {
            opacity: 0;
            transform: translateX(-28px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}