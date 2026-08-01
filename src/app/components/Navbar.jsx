"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "../context/LanguageContext";

import {
  Menu,
  X,
  Search,
  User,
  Download,
  Share2,
  LogOut,
  ChevronRight,
  ChevronDown,
  CircleUserRound,
  Languages,
} from "lucide-react";

const WEBSITE_URL = "https://www.pujadham.co.in";
const INSTAGRAM_URL = "https://www.instagram.com/puja_dham/";
const SHARE_IMAGE_URL = "/Pujadhamlogo1.png";

const GOOGLE_REVIEW_URL =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ||
  "https://www.google.com/maps/search/?api=1&query=Puja+Dham+Mumbai";

const searchLinks = [
  {
    labelKey: "navbar.home",
    href: "/",
  },
  {
    labelKey: "navbar.allPujas",
    href: "/pujas?mode=all",
  },
  {
    labelKey: "navbar.onlinePujas",
    href: "/pujas?mode=online",
  },
  {
    labelKey: "navbar.homeVisit",
    href: "/pujas?mode=offline",
  },
  {
    labelKey: "navbar.gauSeva",
    href: "/gau-seva",
  },
  {
    labelKey: "navbar.naamJaap",
    href: "/sita-ram-counter",
  },
  {
    labelKey: "navbar.myBookings",
    href: "/my-bookings",
  },
  {
    labelKey: "navbar.reviewUs",
    href: GOOGLE_REVIEW_URL,
    external: true,
  },
  {
    labelKey: "navbar.aboutUs",
    href: "/aboutpanditji",
  },
  {
    labelKey: "navbar.gallery",
    href: "/gallery",
  },
  {
    labelKey: "navbar.contact",
    href: "/contact",
  },
];

export default function Navbar() {
  const path = usePathname();
  const { data: session, status } = useSession();
  const {
    language,
    setLanguage,
    t,
  } = useLanguage();

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const isAdmin =
    status === "authenticated" &&
    !!session?.user?.email &&
    !!adminEmail &&
    session.user.email.toLowerCase() === adminEmail.toLowerCase();

  // Pujas and Sevas use dropdowns. Naam Jaap is a separate main link.
  const links = [
    {
      label: t("navbar.home"),
      href: "/",
    },

    {
      label: t("navbar.naamJaap"),
      href: "/sita-ram-counter",
    },

    {
      label: t("navbar.myBookings"),
      href: "/my-bookings",
    },

    {
      label: t("navbar.reviewUs"),
      href: GOOGLE_REVIEW_URL,
      external: true,
    },

    ...(isAdmin
      ? [
          {
            label: t("navbar.dashboard"),
            href: "/pandit-dashboard",
          },
        ]
      : []),

    {
      label: t("navbar.aboutUs"),
      href: "/aboutpanditji",
    },
    {
      label: t("navbar.gallery"),
      href: "/gallery",
    },
    {
      label: t("navbar.contact"),
      href: "/contact",
    },
  ];

  const pujaMenuLinks = [
    {
      label: t("navbar.allPujas"),
      href: "/pujas?mode=all",
    },
    {
      label: t("navbar.homeVisit"),
      href: "/pujas?mode=offline",
    },
    {
      label: t("navbar.onlinePuja"),
      href: "/pujas?mode=online",
    },
  ];

  const sevaMenuLinks = [
    {
      label: t("navbar.gauSeva"),
      href: "/gau-seva",
    },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobilePujaOpen, setMobilePujaOpen] = useState(false);
  const [mobileSevaOpen, setMobileSevaOpen] = useState(false);
  const [desktopPujaOpen, setDesktopPujaOpen] = useState(false);
  const [desktopSevaOpen, setDesktopSevaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const menuRef = useRef(null);
  const desktopPujaRef = useRef(null);
  const desktopSevaRef = useRef(null);
  const searchRef = useRef(null);
  const settingsRef = useRef(null);

  const isLoading = status === "loading";
  const isLoggedIn =
    status === "authenticated" && !!session?.user;

  const userName =
    session?.user?.name ||
    session?.user?.email?.split("@")[0] ||
    t("navbar.guestUser");

  const userEmail =
    session?.user?.email ||
    t("navbar.loginToManage");

  const userImage = session?.user?.image;
  const firstLetter =
    userName?.charAt(0)?.toUpperCase() || "P";

  const isActive = (href) => {
    if (href === "/") {
      return path === "/";
    }

    return path === href || path.startsWith(`${href}/`);
  };

  const isPujaSectionActive = isActive("/pujas");
  const isSevaSectionActive = isActive("/gau-seva");

  useEffect(() => {
    setMenuOpen(false);
    setMobilePujaOpen(false);
    setMobileSevaOpen(false);
    setDesktopPujaOpen(false);
    setDesktopSevaOpen(false);
    setSearchOpen(false);
    setSettingsOpen(false);
    setSearchText("");
  }, [path]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    const closeOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
        setMobilePujaOpen(false);
        setMobileSevaOpen(false);
      }

      if (
        desktopPujaRef.current &&
        !desktopPujaRef.current.contains(event.target)
      ) {
        setDesktopPujaOpen(false);
      }

      if (
        desktopSevaRef.current &&
        !desktopSevaRef.current.contains(event.target)
      ) {
        setDesktopSevaOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }

      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target)
      ) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("touchstart", closeOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        closeOutside
      );

      document.removeEventListener(
        "touchstart",
        closeOutside
      );
    };
  }, []);

  const localizedSearchLinks =
    searchLinks.map((item) => ({
      ...item,
      label: t(item.labelKey),
    }));

  const filteredSearchLinks =
    localizedSearchLinks.filter((item) =>
      item.label
        .toLowerCase()
        .includes(
          searchText.trim().toLowerCase()
        )
    );

  const SHARE_IMAGE_URL = "/Pujadhamlogo1.png";

const getShareMessage = () => {
  // Rebuild message whenever selected language changes.
  void language;

  return t("share.message")
    .replace("{website}", WEBSITE_URL)
    .replace("{instagram}", INSTAGRAM_URL);
};

const getShareImageFile = async () => {
  const response = await fetch(SHARE_IMAGE_URL);

  if (!response.ok) {
    throw new Error("Share image could not be loaded");
  }

  const blob = await response.blob();

  return new File([blob], "puja-dham.png", {
    type: blob.type || "image/png",
  });
};

const handleShareApp = async () => {
  const shareMessage = getShareMessage();

  try {
    if (navigator.share) {
      const imageFile = await getShareImageFile();

      if (
        navigator.canShare &&
        navigator.canShare({
          files: [imageFile],
        })
      ) {
        await navigator.share({
          title: "Puja Dham",
          text: shareMessage,
          files: [imageFile],
        });

        setSettingsOpen(false);
        return;
      }

      await navigator.share({
        title: "Puja Dham",
        text: shareMessage,
      });

      setSettingsOpen(false);
      return;
    }

    await navigator.clipboard.writeText(
      shareMessage
    );

    alert(t("navbar.copied"));

    setSettingsOpen(false);
  } catch (error) {
    if (error?.name !== "AbortError") {
      console.error("Share failed:", error);

      try {
        await navigator.clipboard.writeText(
          shareMessage
        );

        alert(
          t("navbar.copiedFallback")
        );
      } catch (clipboardError) {
        console.error(
          "Clipboard copy failed:",
          clipboardError
        );
      }
    }
  }
};

const handleInstallApp = () => {
  setSettingsOpen(false);

  window.dispatchEvent(
    new CustomEvent("puja-dham-install")
  );
};

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] border-b border-[#eee8e2] bg-white">
        <nav className="relative mx-auto flex h-[78px] max-w-[1500px] items-center px-4 sm:px-6 lg:h-[88px] lg:px-10">
          {/* MOBILE HAMBURGER */}
          <div
            ref={menuRef}
            className="relative z-30 lg:hidden"
          >
            <button
              type="button"
              aria-label={
                menuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen((value) => !value);
                setMobilePujaOpen(false);
                setMobileSevaOpen(false);
                setSearchOpen(false);
                setSettingsOpen(false);
              }}
              className="flex h-11 w-11 items-center justify-center border-none bg-transparent text-[#28221f] shadow-none transition active:scale-90"
            >
              {menuOpen ? (
                <X size={25} strokeWidth={1.8} />
              ) : (
                <Menu size={27} strokeWidth={1.7} />
              )}
            </button>

            {/* MOBILE DRAWER OVERLAY */}
            <div
              aria-hidden={!menuOpen}
              onClick={() => {
                setMenuOpen(false);
                setMobilePujaOpen(false);
                setMobileSevaOpen(false);
              }}
              className={`fixed inset-0 z-[115] bg-black/45 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden ${
                menuOpen
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            />

            {/* MOBILE SLIDE DRAWER */}
            <aside
              aria-label="Mobile navigation"
              className={`fixed bottom-0 left-0 top-0 z-[120] flex w-[58vw] min-w-[230px] max-w-[310px] flex-col border-r border-[#eee8e2] bg-white shadow-[18px_0_55px_rgba(39,27,20,0.18)] transition-transform duration-300 ease-out lg:hidden ${
                menuOpen
                  ? "translate-x-0"
                  : "-translate-x-full"
              }`}
            >
              {/* MOBILE DRAWER TOP BAR */}
              <div className="grid h-[84px] shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-[#eee8e2] bg-white px-3">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Puja Dham Home"
                  className="flex items-center justify-self-start"
                >
                  <img
                    src="/Pujadhamlogo1.png"
                    alt="Puja Dham Logo"
                    className="h-[62px] w-auto max-w-[86px] object-contain"
                  />
                </Link>

                {/* Language switch exactly in top center */}
                <div className="justify-self-center">
                  <NavbarLanguageToggle
                    language={language}
                    setLanguage={setLanguage}
                    t={t}
                    compact
                  />
                </div>

                <button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={() => {
                    setMenuOpen(false);
                    setMobilePujaOpen(false);
                    setMobileSevaOpen(false);
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center justify-self-end rounded-full border border-[#eadfd7] bg-[#fffaf6] text-[#4c4039] shadow-sm transition hover:border-[#dcbda9] hover:bg-[#f8eee7] hover:text-[#a8441b] active:scale-90"
                >
                  <X size={20} strokeWidth={1.8} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain p-3 [scrollbar-width:thin]">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between border-b border-[#f3efeb] px-3 py-4 text-[14px] font-medium transition ${
                    isActive("/")
                      ? "text-[#b34d1d]"
                      : "text-[#332c28] hover:text-[#b34d1d]"
                  }`}
                >
                  {t("navbar.home")}

                  <ChevronRight
                    size={16}
                    strokeWidth={1.6}
                  />
                </Link>

                {/* MOBILE PUJAS DROPDOWN */}
                <div className="border-b border-[#f3efeb] bg-white">
                  <button
                    type="button"
                    aria-expanded={mobilePujaOpen}
                    onClick={() => {
                      setMobilePujaOpen((value) => !value);
                      setMobileSevaOpen(false);
                    }}
                    className={`flex w-full items-center justify-between bg-white px-3 py-4 text-left text-[14px] font-medium transition ${
                      isPujaSectionActive
                        ? "text-[#b34d1d]"
                        : "text-[#332c28] hover:text-[#b34d1d]"
                    }`}
                  >
                    <span>{t("navbar.pujas")}</span>

                    <ChevronDown
                      size={17}
                      strokeWidth={1.7}
                      className={`transition-transform duration-200 ${
                        mobilePujaOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid overflow-hidden transition-all duration-300 ${
                      mobilePujaOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0">
                      <div className="border-t border-[#f4efeb] bg-[#fffaf6] pb-2 pl-4 pr-1 pt-1">
                        {pujaMenuLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                              setMenuOpen(false);
                              setMobilePujaOpen(false);
                              setMobileSevaOpen(false);
                            }}
                            className="flex min-h-12 items-center justify-between border-b border-[#f5f1ee] px-3 py-3 text-[13px] font-medium text-[#443b35] transition last:border-b-0 hover:text-[#b34d1d]"
                          >
                            <span>{item.label}</span>

                            <ChevronRight
                              size={15}
                              strokeWidth={1.6}
                              className="text-[#9e9189]"
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* MOBILE SEVAS DROPDOWN */}
                <div className="border-b border-[#f3efeb] bg-white">
                  <button
                    type="button"
                    aria-expanded={mobileSevaOpen}
                    onClick={() => {
                      setMobileSevaOpen((value) => !value);
                      setMobilePujaOpen(false);
                    }}
                    className={`flex w-full items-center justify-between bg-white px-3 py-4 text-left text-[14px] font-medium transition ${
                      isSevaSectionActive
                        ? "text-[#b34d1d]"
                        : "text-[#332c28] hover:text-[#b34d1d]"
                    }`}
                  >
                    <span>{t("navbar.sevas")}</span>

                    <ChevronDown
                      size={17}
                      strokeWidth={1.7}
                      className={`transition-transform duration-200 ${
                        mobileSevaOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid overflow-hidden transition-all duration-300 ${
                      mobileSevaOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0">
                      <div className="border-t border-[#f4efeb] bg-[#fffaf6] pb-2 pl-4 pr-1 pt-1">
                        {sevaMenuLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                              setMenuOpen(false);
                              setMobilePujaOpen(false);
                              setMobileSevaOpen(false);
                            }}
                            className="flex min-h-12 items-center justify-between border-b border-[#f5f1ee] px-3 py-3 text-[13px] font-medium text-[#443b35] transition last:border-b-0 hover:text-[#b34d1d]"
                          >
                            <span>{item.label}</span>

                            <ChevronRight
                              size={15}
                              strokeWidth={1.6}
                              className="text-[#9e9189]"
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {links
                  .filter((item) => item.href !== "/")
                  .map((item) =>
                    item.external ? (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between border-b border-[#f3efeb] px-3 py-4 text-[14px] font-medium text-[#332c28] transition last:border-0 hover:text-[#b34d1d]"
                      >
                        {item.label}

                        <ChevronRight
                          size={16}
                          strokeWidth={1.6}
                        />
                      </a>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center justify-between border-b border-[#f3efeb] px-3 py-4 text-[14px] font-medium transition last:border-0 ${
                          isActive(item.href)
                            ? "text-[#b34d1d]"
                            : "text-[#332c28] hover:text-[#b34d1d]"
                        }`}
                      >
                        {item.label}

                        <ChevronRight
                          size={16}
                          strokeWidth={1.6}
                        />
                      </Link>
                    )
                  )}

              </div>

              <div className="shrink-0 border-t border-[#eee8e2] bg-[#fffaf6] px-4 py-3 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a8441b]">
                  {t("navbar.mantraLine")}
                </p>
              </div>
            </aside>
          </div>

          {/* LARGE LOGO */}
          <Link
            href="/"
            aria-label="Puja Dham Home"
            className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 lg:static lg:mr-12 lg:translate-x-0 lg:translate-y-0"
          >
            <img
              src="/Pujadhamlogo1.png"
              alt="Puja Dham Logo"
              className="block h-[100px] w-auto max-w-[320px] object-contain sm:h-[110px] sm:max-w-[350px] lg:h-[120px] lg:max-w-[400px] xl:h-[130px] xl:max-w-[450px]"
            />
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden flex-1 items-center justify-center gap-7 lg:flex xl:gap-10">
            <Link
              href="/"
              className={`relative whitespace-nowrap py-8 text-[14px] font-medium tracking-[0.01em] transition-colors duration-200 ${
                isActive("/")
                  ? "text-[#a8441b]"
                  : "text-[#28221f] hover:text-[#a8441b]"
              }`}
            >
              {t("navbar.home")}

              {isActive("/") && (
                <span className="absolute bottom-[22px] left-0 h-px w-full bg-[#a8441b]" />
              )}
            </Link>

            {/* DESKTOP PUJAS DROPDOWN */}
            <div
              ref={desktopPujaRef}
              className="relative"
              onMouseEnter={() => {
                setDesktopPujaOpen(true);
                setDesktopSevaOpen(false);
              }}
              onMouseLeave={() =>
                setDesktopPujaOpen(false)
              }
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={desktopPujaOpen}
                onClick={() => {
                  setDesktopPujaOpen(
                    (value) => !value
                  );
                  setDesktopSevaOpen(false);
                }}
                className={`relative flex items-center gap-1.5 whitespace-nowrap bg-transparent py-8 text-[14px] font-medium tracking-[0.01em] transition-colors duration-200 ${
                  isPujaSectionActive
                    ? "text-[#a8441b]"
                    : "text-[#28221f] hover:text-[#a8441b]"
                }`}
              >
                {t("navbar.pujas")}

                <ChevronDown
                  size={15}
                  strokeWidth={1.7}
                  className={`transition-transform duration-200 ${
                    desktopPujaOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />

                {isPujaSectionActive && (
                  <span className="absolute bottom-[22px] left-0 h-px w-full bg-[#a8441b]" />
                )}
              </button>

              {desktopPujaOpen && (
                <div className="absolute left-1/2 top-[74px] w-[260px] -translate-x-1/2 overflow-hidden rounded-[18px] border border-[#eadfd7] bg-white p-2 shadow-[0_22px_60px_rgba(39,27,20,0.14)]">
                  {pujaMenuLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDesktopPujaOpen(false)}
                      className="group flex min-h-12 items-center justify-between rounded-[13px] bg-white px-4 py-3 text-[13px] font-medium text-[#3d342f] transition hover:bg-[#fff7f1] hover:text-[#a8441b]"
                    >
                      <span>{item.label}</span>

                      <ChevronRight
                        size={15}
                        strokeWidth={1.6}
                        className="text-[#a79a92] transition group-hover:translate-x-0.5 group-hover:text-[#a8441b]"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* DESKTOP SEVAS DROPDOWN */}
            <div
              ref={desktopSevaRef}
              className="relative"
              onMouseEnter={() => {
                setDesktopSevaOpen(true);
                setDesktopPujaOpen(false);
              }}
              onMouseLeave={() =>
                setDesktopSevaOpen(false)
              }
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={desktopSevaOpen}
                onClick={() => {
                  setDesktopSevaOpen(
                    (value) => !value
                  );
                  setDesktopPujaOpen(false);
                }}
                className={`relative flex items-center gap-1.5 whitespace-nowrap bg-transparent py-8 text-[14px] font-medium tracking-[0.01em] transition-colors duration-200 ${
                  isSevaSectionActive
                    ? "text-[#a8441b]"
                    : "text-[#28221f] hover:text-[#a8441b]"
                }`}
              >
                {t("navbar.sevas")}

                <ChevronDown
                  size={15}
                  strokeWidth={1.7}
                  className={`transition-transform duration-200 ${
                    desktopSevaOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />

                {isSevaSectionActive && (
                  <span className="absolute bottom-[22px] left-0 h-px w-full bg-[#a8441b]" />
                )}
              </button>

              {desktopSevaOpen && (
                <div className="absolute left-1/2 top-[74px] w-[260px] -translate-x-1/2 overflow-hidden rounded-[18px] border border-[#eadfd7] bg-white p-2 shadow-[0_22px_60px_rgba(39,27,20,0.14)]">
                  {sevaMenuLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDesktopSevaOpen(false)}
                      className="group flex min-h-12 items-center justify-between rounded-[13px] bg-white px-4 py-3 text-[13px] font-medium text-[#3d342f] transition hover:bg-[#fff7f1] hover:text-[#a8441b]"
                    >
                      <span>{item.label}</span>

                      <ChevronRight
                        size={15}
                        strokeWidth={1.6}
                        className="text-[#a79a92] transition group-hover:translate-x-0.5 group-hover:text-[#a8441b]"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {links
              .filter((item) => item.href !== "/")
              .map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative whitespace-nowrap py-8 text-[14px] font-medium tracking-[0.01em] text-[#28221f] transition-colors duration-200 hover:text-[#a8441b]"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative whitespace-nowrap py-8 text-[14px] font-medium tracking-[0.01em] transition-colors duration-200 ${
                      isActive(item.href)
                        ? "text-[#a8441b]"
                        : "text-[#28221f] hover:text-[#a8441b]"
                    }`}
                  >
                    {item.label}

                    {isActive(item.href) && (
                      <span className="absolute bottom-[22px] left-0 h-px w-full bg-[#a8441b]" />
                    )}
                  </Link>
                )
              )}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="relative z-30 ml-auto flex items-center gap-1 sm:gap-2">
            {/* Desktop language switch only.
                Mobile switch is inside the hamburger drawer. */}
            <div className="hidden lg:block">
              <NavbarLanguageToggle
                language={language}
                setLanguage={setLanguage}
                t={t}
              />
            </div>

            <div
              ref={searchRef}
              className="relative hidden sm:block"
            >
              <button
                type="button"
                aria-label="Search"
                aria-expanded={searchOpen}
                onClick={() => {
                  setSearchOpen(
                    (value) => !value
                  );

                  setMenuOpen(false);
                  setDesktopPujaOpen(false);
                  setDesktopSevaOpen(false);
                  setSettingsOpen(false);
                }}
                className="flex h-11 w-11 items-center justify-center border-none bg-transparent text-[#28221f] shadow-none outline-none transition hover:text-[#a8441b] active:scale-90"
              >
                {searchOpen ? (
                  <X size={21} strokeWidth={1.7} />
                ) : (
                  <Search
                    size={21}
                    strokeWidth={1.7}
                  />
                )}
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-[59px] w-[310px] border border-[#eee8e2] bg-white p-4 shadow-[0_22px_60px_rgba(39,27,20,0.14)]">
                  <div className="flex h-11 items-center gap-2 border border-[#ddd5cf] px-3">
                    <Search
                      size={16}
                      className="text-[#9a8d85]"
                    />

                    <input
                      autoFocus
                      value={searchText}
                      onChange={(event) =>
                        setSearchText(
                          event.target.value
                        )
                      }
                      placeholder={t("navbar.searchPlaceholder")}
                      className="w-full bg-transparent text-[13px] text-[#28221f] outline-none placeholder:text-[#a89d96]"
                    />
                  </div>

                  <div className="mt-2">
                    {filteredSearchLinks.length > 0 ? (
                      filteredSearchLinks.map(
                        (item) =>
                          item.external ? (
                            <a
                              key={`${item.href}-${item.label}`}
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                setSearchOpen(false);
                                setSearchText("");
                              }}
                              className="flex items-center justify-between px-3 py-3 text-[13px] text-[#332c28] transition hover:bg-[#faf7f4] hover:text-[#a8441b]"
                            >
                              {item.label}
                              <ChevronRight size={15} />
                            </a>
                          ) : (
                            <Link
                              key={`${item.href}-${item.label}`}
                              href={item.href}
                              className="flex items-center justify-between px-3 py-3 text-[13px] text-[#332c28] transition hover:bg-[#faf7f4] hover:text-[#a8441b]"
                            >
                              {item.label}
                              <ChevronRight size={15} />
                            </Link>
                          )
                      )
                    ) : (
                      <p className="px-3 py-5 text-center text-xs text-[#958981]">
                        {t("navbar.noPageFound")}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div
              ref={settingsRef}
              className="relative"
            >
              <button
                type="button"
                aria-label="Open account menu"
                aria-expanded={settingsOpen}
                onClick={() => {
                  setSettingsOpen(
                    (value) => !value
                  );

                  setMenuOpen(false);
                  setDesktopPujaOpen(false);
                  setDesktopSevaOpen(false);
                  setSearchOpen(false);
                }}
                className="flex h-11 w-11 items-center justify-center overflow-hidden border-none bg-transparent text-[#28221f] shadow-none outline-none transition hover:text-[#a8441b] active:scale-90"
              >
                {isLoading ? (
                  <span className="h-7 w-7 animate-pulse rounded-full bg-[#eee8e2]" />
                ) : isLoggedIn && userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    referrerPolicy="no-referrer"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : settingsOpen ? (
                  <X
                    size={21}
                    strokeWidth={1.7}
                  />
                ) : (
                  <User
                    size={22}
                    strokeWidth={1.7}
                  />
                )}
              </button>

              {settingsOpen && (
                <div className="absolute right-0 top-[59px] w-[310px] max-w-[calc(100vw-20px)] border border-[#eee8e2] bg-white shadow-[0_22px_60px_rgba(39,27,20,0.14)]">
                  <div className="flex items-center gap-3 border-b border-[#eee8e2] p-5">
                    {isLoggedIn && userImage ? (
                      <img
                        src={userImage}
                        alt={userName}
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7eee8] text-[#a8441b]">
                        {isLoggedIn ? (
                          <span className="text-lg font-semibold">
                            {firstLetter}
                          </span>
                        ) : (
                          <CircleUserRound
                            size={25}
                          />
                        )}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-[#28221f]">
                        {isLoggedIn
                          ? userName
                          : t("navbar.welcome")}
                      </p>

                      <p className="mt-1 truncate text-[11px] text-[#8f837c]">
                        {isLoggedIn
                          ? userEmail
                          : t("navbar.loginOrCreate")}
                      </p>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      href={
                        isLoggedIn
                          ? "/account"
                          : "/login"
                      }
                      className="flex items-center gap-3 px-4 py-3 text-[13px] text-[#332c28] transition hover:bg-[#faf7f4] hover:text-[#a8441b]"
                    >
                      <CircleUserRound size={18} />

                      <span className="flex-1">
                        {t("navbar.account")}
                      </span>

                      <ChevronRight size={15} />
                    </Link>

                    <button
                      type="button"
                      onClick={handleInstallApp}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] text-[#332c28] transition hover:bg-[#faf7f4] hover:text-[#a8441b]"
                    >
                      <Download size={18} />

                      <span className="flex-1">
                        {t("navbar.downloadApp")}
                      </span>

                      <ChevronRight size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={handleShareApp}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] text-[#332c28] transition hover:bg-[#faf7f4] hover:text-[#a8441b]"
                    >
                      <Share2 size={18} />

                      <span className="flex-1">
                        {t("navbar.share")}
                      </span>

                      <ChevronRight size={15} />
                    </button>

                    {isLoggedIn && (
                      <button
                        type="button"
                        onClick={() =>
                          signOut({
                            callbackUrl: "/",
                          })
                        }
                        className="flex w-full items-center gap-3 border-t border-[#eee8e2] px-4 py-3 text-left text-[13px] text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={18} />

                        <span className="flex-1">
                          {t("navbar.logout")}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <div
        className="h-[78px] lg:h-[88px]"
        aria-hidden="true"
      />
    </>
  );
}

function NavbarLanguageToggle({
  language,
  setLanguage,
  t,
  compact = false,
}) {
  return (
    <div
      role="group"
      aria-label="Website language"
      className={`flex items-center rounded-full border border-[#e6d7cc] bg-[#fffaf6] shadow-[0_5px_18px_rgba(83,50,30,0.10)] ${
        compact
          ? "h-9 gap-0.5 p-0.5"
          : "h-10 gap-1 p-1"
      }`}
    >
      {!compact && (
        <span
          aria-hidden="true"
          className="ml-1 flex h-7 w-7 items-center justify-center rounded-full text-[#a8441b]"
        >
          <Languages
            size={15}
            strokeWidth={1.8}
          />
        </span>
      )}

      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        aria-label={t(
          "language.switchToEnglish"
        )}
        title={t(
          "language.switchToEnglish"
        )}
        className={`flex items-center justify-center rounded-full font-bold tracking-[0.02em] transition-all duration-200 ${
          compact
            ? "h-8 min-w-[34px] px-2 text-[10px]"
            : "h-8 min-w-[38px] px-2.5 text-[10px]"
        } ${
          language === "en"
            ? "bg-[#a8441b] text-white shadow-[0_3px_9px_rgba(168,68,27,0.28)]"
            : "text-[#65574f] hover:bg-white hover:text-[#a8441b]"
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLanguage("hi")}
        aria-pressed={language === "hi"}
        aria-label={t(
          "language.switchToHindi"
        )}
        title={t(
          "language.switchToHindi"
        )}
        className={`flex items-center justify-center rounded-full font-bold transition-all duration-200 ${
          compact
            ? "h-8 min-w-[42px] px-2 text-[11px]"
            : "h-8 min-w-[48px] px-2.5 text-[11px]"
        } ${
          language === "hi"
            ? "bg-[#a8441b] text-white shadow-[0_3px_9px_rgba(168,68,27,0.28)]"
            : "text-[#65574f] hover:bg-white hover:text-[#a8441b]"
        }`}
      >
        हिंदी
      </button>
    </div>
  );
}