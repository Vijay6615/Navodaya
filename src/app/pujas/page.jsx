"use client";

import {
  Suspense,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";



import {
  ArrowRight,
  Clock3,
  Grid2X2,
  House,
  Search,
  Star,
  Video,
  X,
} from "lucide-react";

import { PUJAS } from "../pujasData";
import { useLanguage } from "../context/LanguageContext";

const displayFont = {
  className: "font-display-en",
};

const hindiDisplayFont = {
  className: "font-display-hi",
};

const MODE_OPTIONS = [
  {
    key: "all",
    labelKey: "pujasPage.modes.all.label",
    mobileLabelKey:
      "pujasPage.modes.all.mobileLabel",
    descriptionKey:
      "pujasPage.modes.all.description",
    icon: Grid2X2,
  },
  {
    key: "offline",
    labelKey:
      "pujasPage.modes.offline.label",
    mobileLabelKey:
      "pujasPage.modes.offline.mobileLabel",
    descriptionKey:
      "pujasPage.modes.offline.description",
    icon: House,
  },
  {
    key: "online",
    labelKey:
      "pujasPage.modes.online.label",
    mobileLabelKey:
      "pujasPage.modes.online.mobileLabel",
    descriptionKey:
      "pujasPage.modes.online.description",
    icon: Video,
  },
];

function getMode(value) {
  return value === "online" ||
    value === "offline"
    ? value
    : "all";
}

function getLocalizedPuja(puja, language) {
  if (language !== "hi") {
    return {
      name: puja.name,
      category: puja.category,
      shortDescription:
        puja.shortDescription,
      duration: puja.duration,
    };
  }

  return {
    name:
      puja.nameHi ||
      puja.hindiName ||
      puja.name,
    category:
      puja.categoryHi ||
      puja.hindiCategory ||
      puja.category,
    shortDescription:
      puja.shortDescriptionHi ||
      puja.hindiShortDescription ||
      puja.shortDescription,
    duration:
      puja.durationHi ||
      puja.hindiDuration ||
      puja.duration,
  };
}

function getModePrice(puja, mode, t) {
  if (mode === "online") {
    return {
      label: t(
        "pujasPage.price.onlinePuja"
      ),
      primary: puja.onlinePrice,
      secondary: null,
    };
  }

  if (mode === "offline") {
    return {
      label: t(
        "pujasPage.price.homeVisit"
      ),
      primary: puja.offlinePrice,
      secondary: null,
    };
  }

  return {
    label: t(
      "pujasPage.price.startingFrom"
    ),
    primary:
      puja.onlinePrice ||
      puja.offlinePrice,
    secondary:
      puja.onlinePrice &&
      puja.offlinePrice
        ? t(
            "pujasPage.price.homeSecondary"
          ).replace(
            "{price}",
            puja.offlinePrice
          )
        : null,
  };
}

function PujasPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    language,
    t,
  } = useLanguage();

  const activeMode = getMode(
    searchParams.get("mode")
  );

  const [search, setSearch] =
    useState("");

  const headingFontClass =
    language === "hi"
      ? hindiDisplayFont.className
      : displayFont.className;

  const modeMeta = {
    title: t(
      `pujasPage.meta.${activeMode}.title`
    ),
    description: t(
      `pujasPage.meta.${activeMode}.description`
    ),
  };

  const filteredPujas = useMemo(() => {
    const query = search
      .toLowerCase()
      .trim();

    return PUJAS.filter((puja) => {
      const matchesMode =
        activeMode === "online"
          ? puja.onlineAvailable === true
          : activeMode === "offline"
          ? puja.offlineAvailable === true
          : true;

      const localizedPuja =
        getLocalizedPuja(
          puja,
          language
        );

      const searchableText = [
        puja.name,
        puja.category,
        puja.shortDescription,
        puja.nameHi,
        puja.hindiName,
        puja.categoryHi,
        puja.hindiCategory,
        puja.shortDescriptionHi,
        puja.hindiShortDescription,
        localizedPuja.name,
        localizedPuja.category,
        localizedPuja.shortDescription,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesMode &&
        searchableText.includes(query)
      );
    });
  }, [
    activeMode,
    language,
    search,
  ]);

  const selectMode = (mode) => {
    router.replace(
      `/pujas?mode=${mode}`,
      {
        scroll: false,
      }
    );
  };

  const getDetailsUrl = (puja) => {
    if (
      activeMode === "online" ||
      activeMode === "offline"
    ) {
      return `/pujas/${puja.slug}?type=${activeMode}`;
    }

    return `/pujas/${puja.slug}`;
  };

  const openPuja = (puja) => {
    router.push(
      getDetailsUrl(puja)
    );
  };

  const searchPlaceholder = t(
    "pujasPage.searchPlaceholder"
  ).replace(
    "{title}",
    modeMeta.title
  );

  const countLabel =
    language === "hi"
      ? `${filteredPujas.length} ${t(
          "pujasPage.count.hindi"
        )}`
      : `${filteredPujas.length} ${
          filteredPujas.length === 1
            ? t(
                "pujasPage.count.singular"
              )
            : t(
                "pujasPage.count.plural"
              )
        }`;

  return (
    <main className="min-h-screen bg-[#fffdfb] pb-24">
      <section className="border-b border-[#eee5de] bg-gradient-to-br from-[#fff7f0] via-white to-[#eef8f2]">
        <div className="mx-auto max-w-[1220px] px-4 py-8 sm:px-6 md:py-12 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a85c43]">
              {t(
                "pujasPage.eyebrow"
              )}
            </p>

            <h1
              className={`${headingFontClass} mt-3 text-4xl font-bold leading-[1.12] text-[#28221f] sm:text-5xl ${
                language === "hi"
                  ? "tracking-normal"
                  : ""
              }`}
            >
              {modeMeta.title}
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-[#756a63] sm:text-sm sm:leading-7">
              {modeMeta.description}
            </p>
          </div>

          <div className="mt-6 rounded-[22px] border border-[#eadfd7] bg-[#f7f3ef] p-1.5 shadow-sm sm:max-w-[720px]">
            <div className="grid grid-cols-3 gap-1.5">
              {MODE_OPTIONS.map(
                (option) => {
                  const Icon =
                    option.icon;

                  const active =
                    activeMode ===
                    option.key;

                  return (
                    <button
                      type="button"
                      key={option.key}
                      onClick={() =>
                        selectMode(
                          option.key
                        )
                      }
                      aria-pressed={
                        active
                      }
                      className={`flex min-h-[62px] min-w-0 items-center justify-center gap-2 rounded-[17px] px-2 py-2.5 text-left transition-all sm:min-h-[70px] sm:px-4 ${
                        active
                          ? "bg-white text-[#a8441b] shadow-[0_7px_20px_rgba(67,39,22,0.08)]"
                          : "text-[#6f625a] hover:bg-white/70"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          active
                            ? option.key ===
                              "online"
                              ? "bg-[#e9f7ef] text-[#26734d]"
                              : option.key ===
                                "offline"
                              ? "bg-[#edf3ff] text-[#315ea8]"
                              : "bg-[#fff0e4] text-[#a8441b]"
                            : "bg-white text-[#8c7d74]"
                        }`}
                      >
                        <Icon
                          size={16}
                        />
                      </span>

                      <span className="min-w-0">
                        <span className="block truncate text-[10px] font-bold sm:hidden">
                          {t(
                            option.mobileLabelKey
                          )}
                        </span>

                        <span className="hidden text-xs font-bold sm:block">
                          {t(
                            option.labelKey
                          )}
                        </span>

                        <span className="mt-0.5 hidden text-[9px] leading-4 text-gray-400 md:block">
                          {t(
                            option.descriptionKey
                          )}
                        </span>
                      </span>
                    </button>
                  );
                }
              )}
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
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder={
                searchPlaceholder
              }
              className="h-12 w-full rounded-full border border-[#e8ddd5] bg-[#fffdfb] pl-11 pr-11 text-sm text-[#342e2a] outline-none transition focus:border-[#a8441b] focus:bg-white focus:ring-4 focus:ring-orange-100"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                aria-label={t(
                  "pujasPage.clearSearch"
                )}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
                {t(
                  "pujasPage.showing"
                )}
              </p>

              <p className="mt-0.5 text-sm font-bold text-[#342e2a]">
                {countLabel}
              </p>
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0e4] text-[#a8441b]">
              {activeMode ===
              "online" ? (
                <Video size={17} />
              ) : activeMode ===
                "offline" ? (
                <House size={17} />
              ) : (
                <Grid2X2
                  size={17}
                />
              )}
            </span>
          </div>
        </div>

        {filteredPujas.length >
        0 ? (
          <div
            key={`${activeMode}-${search}-${language}`}
            className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-5 xl:grid-cols-4"
          >
            {filteredPujas.map(
              (puja, index) => {
                const price =
                  getModePrice(
                    puja,
                    activeMode,
                    t
                  );

                const localizedPuja =
                  getLocalizedPuja(
                    puja,
                    language
                  );

                return (
                  <article
                    key={
                      puja.slug ||
                      index
                    }
                    onClick={() =>
                      openPuja(puja)
                    }
                    className="group min-w-0 cursor-pointer overflow-hidden rounded-[20px] border border-[#eee5de] bg-white shadow-[0_4px_16px_rgba(62,38,22,0.06)] transition duration-300 active:scale-[0.98] md:hover:-translate-y-1.5 md:hover:border-orange-200 md:hover:shadow-[0_20px_45px_rgba(62,38,22,0.11)]"
                  >
                    <div className="relative h-28 overflow-hidden bg-orange-50 sm:h-36 md:h-40">
                      <img
                        src={
                          puja.image
                        }
                        alt={
                          localizedPuja.name
                        }
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

                      {puja.popular && (
                        <span className="absolute left-2 top-2 rounded-full bg-[#a8441b] px-2 py-1 text-[8px] font-bold text-white shadow-sm">
                          {t(
                            "pujasPage.popular"
                          )}
                        </span>
                      )}

                      {activeMode !==
                        "all" && (
                        <span
                          className={`absolute right-2 top-2 inline-flex items-center gap-1 rounded-full border border-white/30 px-2 py-1 text-[8px] font-bold text-white shadow-sm backdrop-blur-md ${
                            activeMode ===
                            "online"
                              ? "bg-emerald-600/90"
                              : "bg-blue-600/90"
                          }`}
                        >
                          {activeMode ===
                          "online" ? (
                            <Video
                              size={9}
                            />
                          ) : (
                            <House
                              size={9}
                            />
                          )}

                          {activeMode ===
                          "online"
                            ? t(
                                "pujasPage.badges.online"
                              )
                            : t(
                                "pujasPage.badges.home"
                              )}
                        </span>
                      )}

                      <span className="absolute bottom-2 left-2 max-w-[58%] truncate rounded-full border border-white/25 bg-white/15 px-2 py-1 text-[8px] font-semibold text-white backdrop-blur-sm">
                        {
                          localizedPuja.category
                        }
                      </span>

                      <span className="absolute bottom-2 right-2 flex items-center gap-1 text-[8px] font-semibold text-white/90">
                        <Clock3
                          size={9}
                        />

                        {
                          localizedPuja.duration
                        }
                      </span>
                    </div>

                    <div className="p-3 sm:p-4">
                      <div className="flex items-center gap-1 text-[9px] font-bold text-amber-600">
                        <Star
                          size={10}
                          fill="currentColor"
                        />

                        {puja.rating ||
                          "4.9"}

                        <span className="font-medium text-gray-400">
                          (
                          {puja.reviews ||
                            0}
                          )
                        </span>
                      </div>

                      <h2 className="mt-1.5 line-clamp-2 min-h-[40px] text-sm font-extrabold leading-5 text-[#2f2925] sm:text-base sm:leading-6">
                        {
                          localizedPuja.name
                        }
                      </h2>

                      <p className="mt-1.5 line-clamp-2 min-h-[32px] text-[10px] leading-4 text-gray-500 sm:text-[11px]">
  {language === "hi"
    ? puja.shortDescriptionHi || puja.shortDescription
    : puja.shortDescription}
</p>

                      <div className="mt-3 border-t border-[#f0e9e3] pt-3">
                        <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
                          {
                            price.label
                          }
                        </p>

                        <div className="mt-0.5 flex flex-wrap items-baseline gap-1.5">
                          <span className="text-base font-extrabold text-[#a8441b] sm:text-lg">
                            {
                              price.primary
                            }
                          </span>

                          {price.secondary && (
                            <span className="text-[8px] font-semibold text-gray-400 sm:text-[9px]">
                              {
                                price.secondary
                              }
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(
                          event
                        ) => {
                          event.stopPropagation();
                          openPuja(
                            puja
                          );
                        }}
                        className="mt-3 flex min-h-9 w-full items-center justify-center gap-1.5 rounded-full border border-orange-200 bg-[#fff8f2] px-2 text-[10px] font-bold text-[#a8441b] transition hover:border-[#a8441b] hover:bg-[#a8441b] hover:text-white sm:min-h-10 sm:text-xs"
                      >
                        {activeMode ===
                        "online"
                          ? t(
                              "pujasPage.buttons.viewOnline"
                            )
                          : activeMode ===
                            "offline"
                          ? t(
                              "pujasPage.buttons.viewHome"
                            )
                          : t(
                              "pujasPage.buttons.viewPuja"
                            )}

                        <ArrowRight
                          size={12}
                        />
                      </button>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        ) : (
          <div className="mt-6 flex min-h-[360px] items-center justify-center rounded-[26px] border border-dashed border-[#e6d9cf] bg-white px-6 text-center">
            <div className="max-w-sm">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0e4] text-[#a8441b]">
                <Search size={25} />
              </span>

              <h2
                className={`${headingFontClass} mt-5 text-2xl font-bold text-[#2e2925]`}
              >
                {t(
                  "pujasPage.empty.title"
                ).replace(
                  "{title}",
                  modeMeta.title
                )}
              </h2>

              <p className="mt-2 text-xs leading-6 text-gray-500">
                {t(
                  "pujasPage.empty.description"
                )}
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  selectMode("all");
                }}
                className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full bg-[#a8441b] px-6 text-xs font-bold text-white"
              >
                {t(
                  "pujasPage.empty.showAll"
                )}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function PujasLoading() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#fffdfb]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#a8441b] border-t-transparent" />

      <p className="text-xs font-semibold text-[#756a63]">
        {t(
          "pujasPage.loading"
        )}
      </p>
    </div>
  );
}

export default function PujasPage() {
  return (
    <Suspense
      fallback={<PujasLoading />}
    >
      <PujasPageContent />
    </Suspense>
  );
}