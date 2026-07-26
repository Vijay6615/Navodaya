"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Cormorant_Garamond } from "next/font/google";
import {
  ArrowRight,
  Clock3,
  Grid2X2,
  House,
  Search,
  Sparkles,
  Star,
  Video,
  X,
} from "lucide-react";

import { PUJAS } from "../pujasData";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const MODE_OPTIONS = [
  {
    key: "all",
    label: "All Pujas",
    mobileLabel: "All",
    description: "Online and home-visit services",
    icon: Grid2X2,
  },
  {
    key: "offline",
    label: "Ghar Pe Puja",
    mobileLabel: "Home",
    description: "Pandit Ji visits your location",
    icon: House,
  },
  {
    key: "online",
    label: "Online Puja",
    mobileLabel: "Online",
    description: "Attend through live video",
    icon: Video,
  },
];

const MODE_META = {
  all: {
    eyebrow: "Sacred Puja Services",
    title: "All Pujas",
    description:
      "Explore all available online and home-visit Vedic Puja services.",
  },
  offline: {
    title: "Ghar Pe Pujas",
    description:
      "Book an experienced Pandit Ji to perform the complete Puja at your home or selected venue.",
  },
  online: {
    title: "Online Pujas",
    description:
      "Attend authentic Vedic Puja through a live video session from anywhere.",
  },
};

function getMode(value) {
  return value === "online" || value === "offline" ? value : "all";
}

function getModePrice(puja, mode) {
  if (mode === "online") {
    return {
      label: "Online Puja",
      primary: puja.onlinePrice,
      secondary: null,
    };
  }

  if (mode === "offline") {
    return {
      label: "Home Visit",
      primary: puja.offlinePrice,
      secondary: null,
    };
  }

  return {
    label: "Starting from",
    primary: puja.onlinePrice || puja.offlinePrice,
    secondary:
      puja.onlinePrice && puja.offlinePrice
        ? `Home ${puja.offlinePrice}`
        : null,
  };
}

function PujasPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeMode = getMode(searchParams.get("mode"));
  const [search, setSearch] = useState("");

  const modeMeta = MODE_META[activeMode];

  const filteredPujas = useMemo(() => {
    const query = search.toLowerCase().trim();

    return PUJAS.filter((puja) => {
      const matchesMode =
        activeMode === "online"
          ? puja.onlineAvailable === true
          : activeMode === "offline"
          ? puja.offlineAvailable === true
          : true;

      const searchableText = [
        puja.name,
        puja.category,
        puja.shortDescription,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesMode && searchableText.includes(query);
    });
  }, [activeMode, search]);

  const selectMode = (mode) => {
    router.replace(`/pujas?mode=${mode}`, { scroll: false });
  };

  const getDetailsUrl = (puja) => {
    if (activeMode === "online" || activeMode === "offline") {
      return `/pujas/${puja.slug}?type=${activeMode}`;
    }

    return `/pujas/${puja.slug}`;
  };

  const openPuja = (puja) => {
    router.push(getDetailsUrl(puja));
  };

  return (
    <main className="min-h-screen bg-[#fffdfb] pb-24">
      <section className="border-b border-[#eee5de] bg-gradient-to-br from-[#fff7f0] via-white to-[#eef8f2]">
        <div className="mx-auto max-w-[1220px] px-4 py-8 sm:px-6 md:py-12 lg:px-8">
          <div className="max-w-3xl">

            <h1
              className={`${displayFont.className} mt-4 text-4xl font-bold leading-tight text-[#28221f] sm:text-5xl`}
            >
              {modeMeta.title}
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-[#756a63] sm:text-sm sm:leading-7">
              {modeMeta.description}
            </p>
          </div>

          <div className="mt-6 rounded-[22px] border border-[#eadfd7] bg-[#f7f3ef] p-1.5 shadow-sm sm:max-w-[720px]">
            <div className="grid grid-cols-3 gap-1.5">
              {MODE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const active = activeMode === option.key;

                return (
                  <button
                    type="button"
                    key={option.key}
                    onClick={() => selectMode(option.key)}
                    aria-pressed={active}
                    className={`flex min-h-[62px] min-w-0 items-center justify-center gap-2 rounded-[17px] px-2 py-2.5 text-left transition-all sm:min-h-[70px] sm:px-4 ${
                      active
                        ? "bg-white text-[#a8441b] shadow-[0_7px_20px_rgba(67,39,22,0.08)]"
                        : "text-[#6f625a] hover:bg-white/70"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        active
                          ? option.key === "online"
                            ? "bg-[#e9f7ef] text-[#26734d]"
                            : option.key === "offline"
                            ? "bg-[#edf3ff] text-[#315ea8]"
                            : "bg-[#fff0e4] text-[#a8441b]"
                          : "bg-white text-[#8c7d74]"
                      }`}
                    >
                      <Icon size={16} />
                    </span>

                    <span className="min-w-0">
                      <span className="block truncate text-[10px] font-bold sm:hidden">
                        {option.mobileLabel}
                      </span>
                      <span className="hidden text-xs font-bold sm:block">
                        {option.label}
                      </span>
                      <span className="mt-0.5 hidden text-[9px] leading-4 text-gray-400 md:block">
                        {option.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1220px] px-4 py-6 sm:px-6 md:py-9 lg:px-8">
        <div className="flex flex-col gap-4 rounded-[22px] border border-[#eee5de] bg-white p-3 shadow-[0_10px_35px_rgba(67,39,22,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div className="relative w-full sm:max-w-[500px]">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9d8f86]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${modeMeta.title.toLowerCase()}...`}
              className="h-12 w-full rounded-full border border-[#e8ddd5] bg-[#fffdfb] pl-11 pr-11 text-sm text-[#342e2a] outline-none transition focus:border-[#a8441b] focus:bg-white focus:ring-4 focus:ring-orange-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
                Showing
              </p>
              <p className="mt-0.5 text-sm font-bold text-[#342e2a]">
                {filteredPujas.length} Puja
                {filteredPujas.length === 1 ? "" : "s"}
              </p>
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0e4] text-[#a8441b]">
              {activeMode === "online" ? (
                <Video size={17} />
              ) : activeMode === "offline" ? (
                <House size={17} />
              ) : (
                <Grid2X2 size={17} />
              )}
            </span>
          </div>
        </div>

        {filteredPujas.length > 0 ? (
          <div
            key={`${activeMode}-${search}`}
            className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-5 xl:grid-cols-4"
          >
            {filteredPujas.map((puja, index) => {
              const price = getModePrice(puja, activeMode);

              return (
                <article
                  key={puja.slug || index}
                  onClick={() => openPuja(puja)}
                  className="group min-w-0 cursor-pointer overflow-hidden rounded-[20px] border border-[#eee5de] bg-white shadow-[0_4px_16px_rgba(62,38,22,0.06)] transition duration-300 active:scale-[0.98] md:hover:-translate-y-1.5 md:hover:border-orange-200 md:hover:shadow-[0_20px_45px_rgba(62,38,22,0.11)]"
                >
                  <div className="relative h-28 overflow-hidden bg-orange-50 sm:h-36 md:h-40">
                    <img
                      src={puja.image}
                      alt={puja.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

                    {puja.popular && (
                      <span className="absolute left-2 top-2 rounded-full bg-[#a8441b] px-2 py-1 text-[8px] font-bold text-white shadow-sm">
                        Popular
                      </span>
                    )}

                    {activeMode !== "all" && (
                      <span
                        className={`absolute right-2 top-2 inline-flex items-center gap-1 rounded-full border border-white/30 px-2 py-1 text-[8px] font-bold text-white shadow-sm backdrop-blur-md ${
                          activeMode === "online"
                            ? "bg-emerald-600/90"
                            : "bg-blue-600/90"
                        }`}
                      >
                        {activeMode === "online" ? (
                          <Video size={9} />
                        ) : (
                          <House size={9} />
                        )}
                        {activeMode === "online" ? "Online" : "Home"}
                      </span>
                    )}

                    <span className="absolute bottom-2 left-2 max-w-[58%] truncate rounded-full border border-white/25 bg-white/15 px-2 py-1 text-[8px] font-semibold text-white backdrop-blur-sm">
                      {puja.category}
                    </span>

                    <span className="absolute bottom-2 right-2 flex items-center gap-1 text-[8px] font-semibold text-white/90">
                      <Clock3 size={9} />
                      {puja.duration}
                    </span>
                  </div>

                  <div className="p-3 sm:p-4">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-amber-600">
                      <Star size={10} fill="currentColor" />
                      {puja.rating || "4.9"}
                      <span className="font-medium text-gray-400">
                        ({puja.reviews || 0})
                      </span>
                    </div>

                    <h2 className="mt-1.5 line-clamp-2 min-h-[40px] text-sm font-extrabold leading-5 text-[#2f2925] sm:text-base sm:leading-6">
                      {puja.name}
                    </h2>

                    <p className="mt-1.5 hidden line-clamp-2 text-[10px] leading-4 text-gray-500 sm:block">
                      {puja.shortDescription}
                    </p>

                    <div className="mt-3 border-t border-[#f0e9e3] pt-3">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
                        {price.label}
                      </p>

                      <div className="mt-0.5 flex flex-wrap items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-[#a8441b] sm:text-lg">
                          {price.primary}
                        </span>

                        {price.secondary && (
                          <span className="text-[8px] font-semibold text-gray-400 sm:text-[9px]">
                            {price.secondary}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        openPuja(puja);
                      }}
                      className="mt-3 flex min-h-9 w-full items-center justify-center gap-1.5 rounded-full border border-orange-200 bg-[#fff8f2] px-2 text-[10px] font-bold text-[#a8441b] transition hover:border-[#a8441b] hover:bg-[#a8441b] hover:text-white sm:min-h-10 sm:text-xs"
                    >
                      {activeMode === "online"
                        ? "View Online"
                        : activeMode === "offline"
                        ? "View Home Puja"
                        : "View Puja"}
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 flex min-h-[360px] items-center justify-center rounded-[26px] border border-dashed border-[#e6d9cf] bg-white px-6 text-center">
            <div className="max-w-sm">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0e4] text-[#a8441b]">
                <Search size={25} />
              </span>

              <h2 className="mt-5 text-xl font-bold text-[#2e2925]">
                No {modeMeta.title} Found
              </h2>

              <p className="mt-2 text-xs leading-6 text-gray-500">
                Try another search or return to all Puja services.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  selectMode("all");
                }}
                className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full bg-[#a8441b] px-6 text-xs font-bold text-white"
              >
                Show All Pujas
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default function PujasPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#fffdfb]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#a8441b] border-t-transparent" />
        </div>
      }
    >
      <PujasPageContent />
    </Suspense>
  );
}