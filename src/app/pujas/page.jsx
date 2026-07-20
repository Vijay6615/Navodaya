"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PUJAS } from "../pujasData";
import { useRouter } from "next/navigation";
import { Cormorant_Garamond } from "next/font/google";
import {
  Search,
  Check,
  Clock,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});



export default function PujasPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [selectedCategories, setSelectedCategories] =
    useState([]);

  const [search, setSearch] = useState("");
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setPageReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  /* =========================================================
     CATEGORY TOGGLE
  ========================================================= */
  const toggleCategory = (cat) => {
    if (cat === "All") {
      setSelectedCategories([]);
      return;
    }

    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  /* =========================================================
     FILTER PUJAS
  ========================================================= */
  const filteredPujas = PUJAS.filter((puja) => {
    const name =
      puja?.name?.toLowerCase() || "";

    const cat =
      puja?.category?.toLowerCase() || "";

    const q = search.toLowerCase().trim();

    return (
      (name.includes(q) || cat.includes(q)) &&
      (
        selectedCategories.length === 0 ||
        selectedCategories.includes(
          puja.category
        )
      )
    );
  });

  const openPuja = (puja) => {
  router.push(`/pujas/${puja.slug}`);
};

const bookPuja = (puja) => {
  router.push(`/pujas/${puja.slug}`);
};

  const sectionLabel =
    selectedCategories.length === 0
      ? "All services"
      : selectedCategories.join(" · ");

  return (
    <section
      className="
        min-h-screen

        bg-white

        pb-28
        md:pb-16

        overflow-hidden
      "
    >
      {/* =====================================================
          PAGE CONTAINER
      ====================================================== */}
      <div
        className={`
        w-full
        max-w-[1180px]
        mx-auto

        px-4
        sm:px-5
        md:px-6
        lg:px-8

        transition-all
        duration-700
        ease-out

        ${
          pageReady
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
        }
      `}
      >
        {/* =================================================
            DESKTOP SEARCH + FILTER AREA
        ================================================== */}
        <div
          className="
            mt-8
            md:mt-12

            md:p-4

            md:rounded-[22px]

            md:bg-white

            md:border
            md:border-black/[0.05]

            md:shadow-[0_10px_35px_rgba(83,45,20,0.06)]

            
          "
        >
          {/* SEARCH BAR */}
          <div
            className="
              w-full

              md:max-w-[560px]
              lg:max-w-[620px]

              md:mx-auto
            "
          >
            <div
              className="
                flex
                items-center

                gap-2.5

                bg-white

                rounded-full

                border
                border-black/[0.08]

                px-4

                h-12
                md:h-[50px]

                shadow-sm

                transition-all
duration-500
ease-out

focus-within:scale-[1.015]
focus-within:shadow-[0_14px_40px_rgba(168,68,27,0.12)]

focus-within:ring-2
focus-within:ring-orange-300
focus-within:border-orange-200
              "
            >
              <Search
                size={18}
                strokeWidth={2}
                className="
                  text-[#8a7060]
                  flex-shrink-0
                "
              />

              <input
                type="text"
                placeholder="Search pujas..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="
                  flex-1

                  min-w-0

                  bg-transparent

                  border-none

                  outline-none

                  text-sm

                  text-gray-700

                  placeholder:text-gray-400
                "
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="
                    w-7
                    h-7

                    rounded-full

                    flex
                    items-center
                    justify-center

                    text-gray-400

                    hover:text-gray-700
                    hover:bg-gray-100

                    active:scale-90

                    transition-all
                    duration-200
                  "
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* FILTER CHIPS */}
          <div
            className="
              flex

              md:justify-center

              gap-2

              overflow-x-auto

              mt-3
              md:mt-4

              pb-0.5

              scrollbar-hide
            "
          >
            
          </div>
        </div>

        {/* =================================================
            SECTION LABEL
        ================================================== */}
        <div
          className="
            mt-4
            md:mt-8

            mb-2
            md:mb-4

            flex
            items-center
            justify-between
          "
        >
          <p
            className="
              text-[10px]
              md:text-[11px]

              font-semibold
              md:font-bold

              tracking-widest

              uppercase

              text-orange-700/70
            "
          >
            {sectionLabel}
          </p>

          <p
            className="
              hidden
              md:block

              text-[11px]

              font-medium

              text-[#9a8375]
            "
          >
            {filteredPujas.length} pujas
          </p>
        </div>

        {/* =================================================
            CARDS GRID

            MOBILE:
            2 columns — same compact design

            TABLET:
            3 columns

            LAPTOP:
            3 controlled columns

            LARGE:
            4 columns
        ================================================== */}
        <div
          key={search + "-" + selectedCategories.join("-")}
          className="
            grid

            grid-cols-2

            md:grid-cols-3

            xl:grid-cols-4

            gap-3
            sm:gap-4
            md:gap-5
            lg:gap-6
          "
        >
          {filteredPujas.map((puja, index) => (
            <article
              key={puja.slug || index}
              onClick={() => openPuja(puja)}
              style={{ animationDelay: `${Math.min(index * 55, 550)}ms` }}
              className="
                group

                puja-premium-card

                relative

                min-w-0

                bg-white

                rounded-2xl
                md:rounded-[20px]

                overflow-hidden

                border
                border-black/[0.06]

                shadow-[0_1px_4px_rgba(0,0,0,0.07)]

                md:shadow-[0_8px_25px_rgba(76,40,18,0.07)]

                cursor-pointer

                transition-all
                duration-500

                ease-out

                active:scale-[0.97]

                md:hover:-translate-y-1.5 md:hover:scale-[1.015]

                md:hover:shadow-[0_24px_60px_rgba(76,40,18,0.13)]

                md:hover:border-orange-200/80
              "
            >
              {/* =========================================
                  IMAGE ZONE
              ========================================= */}
              <div
                className="
                  relative

                  h-28
                  sm:h-32
                  md:h-[150px]
                  lg:h-[160px]
                  xl:h-[145px]

                  overflow-hidden

                  bg-orange-50
                "
              >
                <img
                  src={puja.image}
                  alt={puja.name}
                  loading="lazy"
                  className="
                    w-full
                    h-full

                    object-cover

                    transition-transform
                    duration-700

                    ease-out

                    md:group-hover:scale-110
                  "
                />

                {/* GRADIENT SCRIM */}
                <div
                  className="
                    absolute
                    inset-0

                    bg-gradient-to-t
                    from-black/65
                    via-black/10
                    to-transparent

                    transition-opacity
                    duration-500

                    md:group-hover:from-black/70
                  "
                />

                {/* POPULAR BADGE */}
                {puja.popular && (
                  <span
                    className="
                      absolute

                      top-2
                      left-2

                      bg-orange-600

                      text-white

                      text-[9px]

                      font-bold

                      px-2
                      py-0.5

                      rounded-full

                      tracking-wide

                      shadow-sm
                    "
                  >
                    Popular
                  </span>
                )}

                {/* CATEGORY */}
                <span
                  className="
                    absolute

                    bottom-2
                    left-2

                    max-w-[58%]

                    truncate

                    bg-white/20

                    text-white

                    text-[9px]

                    font-semibold

                    px-2
                    py-0.5

                    rounded-full

                    border
                    border-white/30

                    backdrop-blur-sm

                    leading-none
                  "
                >
                  {puja.category}
                </span>

                {/* DURATION */}
                <span
                  className="
                    absolute

                    bottom-2
                    right-2

                    flex
                    items-center

                    gap-1

                    text-white/90

                    text-[9px]

                    font-medium

                    leading-none
                  "
                >
                  <Clock
                    size={9}
                    strokeWidth={2}
                  />

                  {puja.duration}
                </span>
              </div>

              {/* =========================================
                  CARD BODY
              ========================================= */}
              <div
                className="
                  p-[10px]

                  md:p-4
                "
              >
                <h3
                  className="
                    text-[13px]
                    md:text-[15px]

                    font-semibold
                    md:font-bold

                    text-gray-900

                    leading-snug

                    truncate

                    mb-[3px]
                    md:mb-1

                    transition-colors
                    duration-300

                    md:group-hover:text-orange-700
                  "
                >
                  {puja.name}
                </h3>

                <p
                  className="
                    text-[11px]
                    md:text-[12px]

                    text-[#8a7060]

                    leading-snug
                    md:leading-5

                    truncate

                    mb-2
                    md:mb-3
                  "
                >
                  {puja.shortDescription}
                </p>

                {/* ONLINE PRICE — DISCOUNT STYLE */}
                <div className="mb-[10px] md:mb-3">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-[16px] md:text-[19px] font-extrabold tracking-tight text-[#a8441b]">
                      {puja.onlinePrice}
                    </span>

                    <span className="text-[11px] md:text-[12px] font-medium text-gray-400 line-through decoration-red-400 decoration-[1.5px]">
                      {puja.offlinePrice}
                    </span>
                  </div>
                </div>

                {/* BOOK NOW */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();

                    bookPuja(puja);
                  }}
                  className="
                    w-full

                    h-[34px]
                    md:h-10

                    rounded-full

                    bg-[#fff8f2]

                    text-[#a8441b]

                    border
                    border-orange-200

                    text-[12px]
                    md:text-[12px]

                    font-semibold

                    tracking-wide

                    transition-all
                    duration-300

                    flex
                    items-center
                    justify-center

                    hover:bg-[#a8441b]
                    hover:border-[#a8441b]
                    hover:text-white
                    hover:shadow-[0_10px_24px_rgba(168,68,27,0.20)]
                    md:group-hover:translate-y-[-1px]

                    active:scale-95
                  "
                >
                  Book now
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================== */}
        {filteredPujas.length === 0 && (
          <div
            className="
              flex
              flex-col

              items-center
              justify-center

              py-20
              md:py-28

              px-8

              text-center

            "
          >
            <span
              className="
                text-4xl
                md:text-5xl

                mb-3
              "
            >
              🙏
            </span>

            <p
              className="
                text-sm
                md:text-base

                font-semibold

                text-gray-700
              "
            >
              No pujas found
            </p>

            <p
              className="
                text-xs
                md:text-sm

                text-gray-400

                mt-1
              "
            >
              Try a different search or clear
              your filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategories([]);
              }}
              className="
                mt-4

                px-5

                h-9
                md:h-10

                rounded-full

                border
                border-orange-300

                text-orange-600

                text-sm

                font-medium

                hover:bg-orange-50

                active:scale-95

                transition-all
                duration-300
              "
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {showLoginModal && (
        <div
          className="login-drawer-backdrop fixed inset-0 z-[9999] bg-[#24140d]/35 backdrop-blur-[5px]"
          onClick={() => setShowLoginModal(false)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-required-title"
            onClick={(e) => e.stopPropagation()}
            className="
              login-auth-drawer
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
              sm:w-[88%]
              lg:w-1/2
              lg:max-w-[720px]
            "
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-36 -top-36 h-[430px] w-[430px] rounded-full bg-[#fff2e9] blur-[110px]" />
              <div className="absolute -bottom-40 -right-28 h-[470px] w-[470px] rounded-full bg-[#f8eee8] blur-[120px]" />
            </div>

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
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="group"
                  aria-label="Go to home"
                >
                  <img
                    src="/pujadham1.png"
                    alt="Puja Dham"
                    className="h-[88px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.035] sm:h-[104px]"
                  />
                </button>
              </div>

              <div className="login-drawer-content my-auto py-10 text-center sm:py-12">
                <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#eadbd2] bg-white/80 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#a8441b] shadow-[0_8px_24px_rgba(83,45,20,0.04)]">
                  <Sparkles size={13} strokeWidth={1.7} />
                  Sacred booking
                </div>

                <h2
                  id="login-required-title"
                  className={`${displayFont.className} mx-auto mt-7 max-w-[500px] text-[45px] font-semibold leading-[0.92] tracking-[-0.035em] text-[#28221f] sm:text-[58px] lg:text-[66px]`}
                >
                  Continue your
                  <span className="block text-[#a8441b]">
                    sacred journey.
                  </span>
                </h2>

                <p className="mx-auto mt-6 max-w-[430px] text-[14px] leading-7 text-[#756a63] sm:text-[15px]">
                  Login to explore puja details and continue your booking.
                  Your sacred bookings and updates stay connected to your
                  account.
                </p>

                <div className="mx-auto mt-10 w-full max-w-[430px] space-y-3">
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

                  <button
                    type="button"
                    onClick={() => router.push("/register")}
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
                      shadow-[0_8px_24px_rgba(83,45,20,0.04)]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#a8441b]/45
                      hover:bg-[#fff8f3]
                      hover:shadow-[0_14px_30px_rgba(83,45,20,0.08)]
                      active:scale-[0.98]
                    "
                  >
                    Create an account
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="w-full py-3 text-[12px] font-semibold text-[#9a8a81] transition-colors duration-300 hover:text-[#431407]"
                  >
                    Maybe later
                  </button>
                </div>
              </div>

              <div className="border-t border-[#eee8e2] pt-5 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-[0.19em] text-[#9a8a81] sm:text-[10px]">
                  Secure account · Personal bookings · Puja updates
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}

      <style>{`
        .puja-premium-card {
          opacity: 0;
          transform: translateY(26px) scale(0.985);
          animation: pujaPremiumReveal 760ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
          will-change: transform, opacity;
        }

        @keyframes pujaPremiumReveal {
          0% {
            opacity: 0;
            transform: translateY(26px) scale(0.985);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .login-drawer-backdrop {
          animation: loginDrawerBackdropIn 320ms ease-out both;
        }

        .login-auth-drawer {
          animation: loginDrawerIn 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: transform;
        }

        .login-drawer-content {
          animation: loginDrawerContentIn 800ms 180ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes loginDrawerBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes loginDrawerIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes loginDrawerContentIn {
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
          .puja-premium-card,
          .login-auth-drawer,
          .login-drawer-content {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }
      `}</style>
</section>
  );
}