"use client";

import { useState } from "react";
import { PUJAS } from "../pujasData";
import { useRouter } from "next/navigation";
import {
  Search,
  Check,
  Clock,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const CATEGORY_LIST = [
  "All",
  "Daily Puja",
  "Festival Puja",
  "Astrology",
  "Havan Ceremonies",
];

export default function PujasPage() {
  const router = useRouter();

  const [selectedCategories, setSelectedCategories] =
    useState([]);

  const [search, setSearch] = useState("");

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

  const sectionLabel =
    selectedCategories.length === 0
      ? "All services"
      : selectedCategories.join(" · ");

  return (
    <section
      className="
        min-h-screen

        bg-[#FFF8F4]

        pb-28
        md:pb-16

        overflow-hidden
      "
    >
      {/* =====================================================
          PAGE CONTAINER
      ====================================================== */}
      <div
        className="
          w-full

          max-w-[1180px]

          mx-auto

          px-4
          sm:px-5
          md:px-6
          lg:px-8
        "
      >
        {/* =================================================
            TOP BAR
        ================================================== */}
        <div
          className="
            pt-1
            md:pt-8
            lg:pt-10

            flex
            items-center
            justify-between

            gap-4
          "
        >
          <div>
            {/* DESKTOP SMALL LABEL */}
            <div
              className="
                hidden
                md:inline-flex

                items-center

                gap-2

                mb-2

                px-3
                py-1.5

                rounded-full

                bg-orange-100/70

                border
                border-orange-200/70

                text-[10px]

                font-bold

                uppercase

                tracking-[0.14em]

                text-orange-700
              "
            >
              <Sparkles
                size={12}
                strokeWidth={2.2}
              />

              Sacred Services
            </div>

            <h1
              className="
                text-[22px]
                sm:text-[24px]
                md:text-[32px]
                lg:text-[36px]

                font-bold
                md:font-black

                tracking-tight

                text-gray-900

                leading-tight
              "
            >
              पूजा सेवाएं
            </h1>

            <p
              className="
                mt-0.5
                md:mt-1.5

                text-xs
                md:text-sm

                text-[#8a7060]
              "
            >
              {filteredPujas.length} services available
            </p>
          </div>

          {/* PROFILE BADGE */}
          <div
            className="
              w-9
              h-9

              md:w-11
              md:h-11

              rounded-full

              bg-gradient-to-br
              from-orange-500
              to-orange-700

              flex
              items-center
              justify-center

              text-white

              text-sm
              md:text-[15px]

              font-bold

              shadow-md

              flex-shrink-0

              ring-4
              ring-orange-100/70
            "
          >
            PD
          </div>
        </div>

        {/* =================================================
            DESKTOP SEARCH + FILTER AREA
        ================================================== */}
        <div
          className="
            mt-3
            md:mt-7

            md:p-4

            md:rounded-[22px]

            md:bg-white/75

            md:border
            md:border-black/[0.05]

            md:shadow-[0_10px_35px_rgba(83,45,20,0.06)]

            md:backdrop-blur-xl
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

                focus-within:ring-2
                focus-within:ring-orange-300

                focus-within:border-orange-200

                transition-all
                duration-300
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
            {CATEGORY_LIST.map((cat) => {
              const isActive =
                cat === "All"
                  ? selectedCategories.length === 0
                  : selectedCategories.includes(cat);

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    toggleCategory(cat)
                  }
                  className={`
                    flex
                    items-center

                    gap-1.5

                    px-3
                    md:px-4

                    h-8
                    md:h-9

                    rounded-lg
                    md:rounded-full

                    text-xs

                    font-medium
                    md:font-semibold

                    whitespace-nowrap

                    flex-shrink-0

                    border

                    transition-all
                    duration-300

                    active:scale-95

                    ${
                      isActive
                        ? `
                          bg-[#431407]
                          border-[#431407]
                          text-white

                          shadow-[0_5px_15px_rgba(67,20,7,0.16)]
                        `
                        : `
                          bg-white
                          border-gray-200
                          text-gray-600

                          hover:border-orange-300
                          hover:text-orange-700
                          hover:bg-orange-50/50
                        `
                    }
                  `}
                >
                  {isActive && (
                    <Check
                      size={12}
                      strokeWidth={2.5}
                    />
                  )}

                  {cat}
                </button>
              );
            })}
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
              onClick={() =>
                router.push(
                  `/pujas/${puja.slug}`
                )
              }
              className="
                group

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

                md:hover:-translate-y-2

                md:hover:shadow-[0_20px_45px_rgba(76,40,18,0.14)]

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

                {/* PRICE */}
                <div
                  className="
                    flex
                    items-center
                    justify-between

                    gap-2

                    mb-[10px]
                    md:mb-3
                  "
                >
                  <p
                    className="
                      text-[15px]
                      md:text-[17px]

                      font-bold
                      md:font-extrabold

                      text-orange-600

                      tracking-tight
                    "
                  >
                    {puja.price}
                  </p>

                  <ArrowRight
                    size={16}
                    strokeWidth={2}

                    className="
                      hidden
                      md:block

                      text-orange-400

                      opacity-0

                      -translate-x-2

                      transition-all
                      duration-300

                      group-hover:opacity-100
                      group-hover:translate-x-0
                    "
                  />
                </div>

                {/* BOOK NOW */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();

                    router.push(
                      `/booking?puja=${encodeURIComponent(
                        puja.name
                      )}`
                    );
                  }}
                  className="
                    w-full

                    h-[34px]
                    md:h-10

                    rounded-full

                    bg-white

                    text-yellow-800

                    border
                    border-emerald-200

                    text-[12px]
                    md:text-[12px]

                    font-semibold

                    tracking-wide

                    transition-all
                    duration-300

                    flex
                    items-center
                    justify-center

                    hover:bg-orange-700
                    hover:border-orange-700
                    hover:text-white

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
</section>
  );
}