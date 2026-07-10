"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import {
  Home,
  Sparkles,
  CalendarCheck,
  LayoutGrid,
  User,
  Download,
  Settings,
  LogOut,
  X,
  Share2,
  ChevronRight,
  CircleUserRound,
  Menu,
} from "lucide-react";

/* =========================================================
   MOBILE BOTTOM NAVIGATION
========================================================= */
const navItems = [
  {
    name: "Home",
    icon: Home,
    href: "/",
  },
  {
    name: "Pujas",
    icon: Sparkles,
    href: "/pujas",
  },
  {
    name: "Book",
    icon: CalendarCheck,
    href: "/contact",
    isBookCTA: true,
  },
  {
    name: "Gallery",
    icon: LayoutGrid,
    href: "/gallery",
  },
  {
    name: "Pandit Ji",
    icon: User,
    href: "/aboutpanditji",
  },
];

/* =========================================================
   DESKTOP NAVIGATION
========================================================= */
const desktopLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Pujas",
    href: "/pujas",
  },
  {
    label: "About Panditji",
    href: "/aboutpanditji",
  },
  {
    label: "Gallery",
    href: "/gallery",
  },
];

export default function Navbar() {
  const path = usePathname();

  const {
    data: session,
    status,
  } = useSession();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const settingsRef = useRef(null);
  const mobileMenuRef = useRef(null);

  /* =========================================================
     AUTH STATE
  ========================================================= */
  const isLoggedIn =
    status === "authenticated" && !!session?.user;

  /* =========================================================
     ACTIVE ROUTE
  ========================================================= */
  const isActiveRoute = (href) => {
    if (href === "/") {
      return path === "/";
    }

    return path === href || path.startsWith(`${href}/`);
  };

  /* =========================================================
     USER DATA
  ========================================================= */
  const userName =
    session?.user?.name ||
    session?.user?.email?.split("@")[0] ||
    "Guest User";

  const userEmail =
    session?.user?.email ||
    "Login to manage your account";

  const userImage = session?.user?.image;

  const firstLetter =
    userName?.charAt(0)?.toUpperCase() || "N";

  /* =========================================================
     CLOSE POPUPS ON OUTSIDE CLICK
  ========================================================= */
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target)
      ) {
        setSettingsOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    document.addEventListener(
      "touchstart",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "touchstart",
        handleOutsideClick
      );
    };
  }, []);

  /* =========================================================
     CLOSE ON ROUTE CHANGE
  ========================================================= */
  useEffect(() => {
    setSettingsOpen(false);
    setMobileMenuOpen(false);
  }, [path]);

  /* =========================================================
     SHARE APP
  ========================================================= */
  const handleShareApp = async () => {
    const appUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "";

    const shareData = {
      title: "Puja Dham",
      text: "Experience authentic Vedic pujas with Puja Dham 🙏",
      url: appUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(appUrl);
        alert("Puja Dham link copied!");
      }

      setSettingsOpen(false);
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  };

  return (
    <>
      {/* =====================================================
          PREMIUM FIXED TOP NAVBAR
      ====================================================== */}
      <header
        className="
          fixed
          top-0
          left-0
          right-0
          z-[100]
          w-full

          bg-[#fffdf9]/88
          backdrop-blur-xl
          supports-[backdrop-filter]:bg-[#fffdf9]/78

          border-b
          border-orange-950/[0.08]

          shadow-[0_4px_30px_rgba(91,44,12,0.06)]

          pt-[env(safe-area-inset-top)]
        "
      >
        <nav
          className="
            relative

            max-w-7xl
            mx-auto

            h-[68px]
            md:h-[76px]

            flex
            items-center
            justify-between

            px-4
            sm:px-6
            lg:px-8
          "
        >
          {/* =================================================
              MOBILE LEFT MENU
          ================================================== */}
          <div
            ref={mobileMenuRef}
            className="
              relative
              z-30
              md:hidden
            "
          >
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((prev) => !prev);
                setSettingsOpen(false);
              }}
              aria-label="Open navigation menu"
              className="
                w-10
                h-10

                rounded-full

                flex
                items-center
                justify-center

                bg-orange-50/90

                border
                border-orange-100

                text-[#9a4b16]

                transition-all
                duration-300

                active:scale-90
              "
            >
              {mobileMenuOpen ? (
                <X size={19} strokeWidth={2.2} />
              ) : (
                <Menu size={20} strokeWidth={2.2} />
              )}
            </button>

            {/* MOBILE MENU */}
            {mobileMenuOpen && (
              <div
                className="
                  absolute

                  top-[50px]
                  left-0

                  w-[250px]
                  max-w-[calc(100vw-32px)]

                  p-2

                  rounded-[22px]

                  bg-white/95
                  backdrop-blur-2xl

                  border
                  border-orange-100

                  shadow-[0_20px_60px_rgba(58,29,8,0.18)]
                "
              >
                {desktopLinks.map((item) => {
                  const active = isActiveRoute(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex
                        items-center
                        justify-between

                        px-4
                        py-3

                        rounded-2xl

                        text-[13px]
                        font-bold

                        transition-all

                        ${
                          active
                            ? `
                              bg-orange-50
                              text-orange-700
                            `
                            : `
                              text-gray-700
                              hover:bg-orange-50
                              hover:text-orange-700
                            `
                        }
                      `}
                    >
                      {item.label}

                      <ChevronRight
                        size={15}
                        strokeWidth={2}
                      />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* =================================================
              DESKTOP LEFT LOGO
          ================================================== */}
          <Link
            href="/"
            aria-label="Puja Dham Home"
            className="
              hidden
              md:flex

              absolute
              left-6
              lg:left-8
              top-1/2
              -translate-y-1/2

              items-center
              justify-start

              z-20
              group
            "
          >
            <img
              src="/pujadham1.png"
              alt="Puja Dham Logo"
              className="
                block
                w-auto
                h-[60px]
                lg:h-[58px]
                max-w-[170px]
                lg:max-w-[200px]
                object-contain
                transition-transform
                duration-300
                group-hover:scale-[1.03]
              "
            />
          </Link>

          {/* =================================================
              MOBILE / IPHONE CENTER LOGO
          ================================================== */}
          <Link
            href="/"
            aria-label="Puja Dham Home"
            className="
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              md:hidden
              z-20
              flex
              items-center
              justify-center
            "
          >
            <img
              src="/pujadham1.png"
              alt="Puja Dham Logo"
              className="
              block
              w-auto
              h-[60px]
              min-[390px]:h-[62px]
              max-w-[190px]
              min-[390px]:max-w-[210px]
              object-contain
"
            />
          </Link>

          {/* =================================================
              DESKTOP CENTER LINKS
          ================================================== */}
          <ul
            className="
              hidden
              md:flex

              absolute

              left-1/2
              top-1/2

              -translate-x-1/2
              -translate-y-1/2

              items-center

              gap-1
            "
          >
            {desktopLinks.map((item) => {
              const active = isActiveRoute(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      relative

                      px-3
                      lg:px-4

                      py-2.5

                      rounded-full

                      text-[13px]

                      font-semibold

                      whitespace-nowrap

                      transition-all
                      duration-300

                      ${
                        active
                          ? `
                            text-orange-700
                            bg-orange-50
                          `
                          : `
                            text-[#655246]
                            hover:text-orange-700
                            hover:bg-orange-50/70
                          `
                      }
                    `}
                  >
                    {item.label}

                    {active && (
                      <span
                        className="
                          absolute

                          left-1/2
                          -translate-x-1/2

                          -bottom-1

                          w-1
                          h-1

                          rounded-full

                          bg-orange-600
                        "
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>          {/* =================================================
              RIGHT ACTIONS
          ================================================== */}
          <div
            className="
              ml-auto

              flex
              items-center

              gap-2

              relative
              z-30
            "
          >
            {/* DESKTOP BOOK CTA */}
            <Link
              href="/contact"
              className="
                hidden
                md:flex

                items-center
                justify-center

                gap-2

                px-4
                lg:px-5

                h-10

                rounded-full

                bg-gradient-to-r
                from-[#d85a16]
                to-[#a93d10]

                text-white

                text-[12px]
                lg:text-[13px]

                font-bold

                shadow-[0_8px_20px_rgba(194,74,18,0.22)]

                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:shadow-[0_12px_28px_rgba(194,74,18,0.30)]

                active:scale-95
              "
            >
              <CalendarCheck
                size={16}
                strokeWidth={2.2}
              />

              Book Puja
            </Link>

            {/* =================================================
                SETTINGS / PROFILE
            ================================================== */}
            <div
              ref={settingsRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() => {
                  setSettingsOpen((prev) => !prev);
                  setMobileMenuOpen(false);
                }}
                aria-label="Open settings"
                className={`
                  w-10
                  h-10

                  md:w-11
                  md:h-11

                  rounded-full

                  flex
                  items-center
                  justify-center

                  overflow-hidden

                  border

                  transition-all
                  duration-300

                  active:scale-90

                  ${
                    settingsOpen
                      ? `
                        bg-[#9f3e12]
                        border-[#9f3e12]
                        text-white

                        shadow-lg
                        shadow-orange-200
                      `
                      : `
                        bg-orange-50/90
                        border-orange-100
                        text-[#9a4b16]

                        hover:bg-orange-100
                      `
                  }
                `}
              >
                {isLoggedIn && userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    referrerPolicy="no-referrer"
                    className="
                      w-full
                      h-full

                      object-cover
                    "
                  />
                ) : settingsOpen ? (
                  <X
                    size={19}
                    strokeWidth={2.3}
                  />
                ) : (
                  <Settings
                    size={19}
                    strokeWidth={2.2}
                  />
                )}
              </button>

              {/* =============================================
                  SETTINGS PANEL
              ============================================= */}
              {settingsOpen && (
                <div
                  className="
                    absolute

                    top-[52px]
                    right-0

                    w-[300px]
                    sm:w-[320px]

                    max-w-[calc(100vw-24px)]

                    overflow-hidden

                    rounded-[26px]

                    bg-white/95
                    backdrop-blur-2xl

                    border
                    border-orange-100

                    shadow-[0_24px_70px_rgba(60,30,10,0.20)]
                  "
                >
                  {/* =========================================
                      PROFILE / GUEST HEADER
                  ========================================= */}
                  <div
                    className="
                      p-4

                      bg-gradient-to-br
                      from-[#fff7ed]
                      via-white
                      to-[#fff4e6]

                      border-b
                      border-orange-100
                    "
                  >
                    <div
                      className="
                        flex
                        items-center

                        gap-3
                      "
                    >
                      {/* AVATAR */}
                      {isLoggedIn && userImage ? (
                        <img
                          src={userImage}
                          alt={userName}
                          referrerPolicy="no-referrer"
                          className="
                            w-14
                            h-14

                            rounded-full

                            object-cover

                            border-[3px]
                            border-white

                            shadow-md
                          "
                        />
                      ) : (
                        <div
                          className="
                            w-14
                            h-14

                            shrink-0

                            rounded-full

                            flex
                            items-center
                            justify-center

                            bg-gradient-to-br
                            from-orange-500
                            to-[#9f3e12]

                            text-white

                            shadow-md

                            border-[3px]
                            border-white
                          "
                        >
                          {isLoggedIn ? (
                            <span
                              className="
                                text-xl
                                font-black
                              "
                            >
                              {firstLetter}
                            </span>
                          ) : (
                            <CircleUserRound
                              size={26}
                              strokeWidth={1.8}
                            />
                          )}
                        </div>
                      )}

                      {/* USER INFO */}
                      <div className="min-w-0 flex-1">
                        <p
                          className="
                            text-[15px]

                            font-extrabold

                            text-[#3b2417]

                            truncate
                          "
                        >
                          {isLoggedIn
                            ? userName
                            : "Welcome"}
                        </p>

                        <p
                          className="
                            mt-0.5

                            text-[11px]

                            font-medium

                            text-gray-500

                            truncate
                          "
                        >
                          {isLoggedIn
                            ? userEmail
                            : "Login or create your account"}
                        </p>

                        <span
                          className="
                            inline-flex

                            mt-2

                            px-2.5
                            py-1

                            rounded-full

                            bg-orange-100

                            text-[9px]

                            font-bold

                            uppercase

                            tracking-wide

                            text-orange-700
                          "
                        >
                          {isLoggedIn
                            ? "Puja Dham Member"
                            : "Guest Mode"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* =========================================
                      SETTINGS ACTIONS
                  ========================================= */}
                  <div className="p-2.5">

                    {/* ACCOUNT */}
                    <Link
                      href={
                        isLoggedIn
                          ? "/account"
                          : "/login"
                      }
                      onClick={() =>
                        setSettingsOpen(false)
                      }
                      className="
                        w-full

                        flex
                        items-center

                        gap-3

                        px-3
                        py-3

                        rounded-2xl

                        text-gray-700

                        transition-all
                        duration-200

                        hover:bg-orange-50
                        hover:text-orange-700

                        active:scale-[0.98]
                      "
                    >
                      <div
                        className="
                          w-10
                          h-10

                          shrink-0

                          rounded-xl

                          flex
                          items-center
                          justify-center

                          bg-orange-100

                          text-orange-700
                        "
                      >
                        <CircleUserRound
                          size={19}
                          strokeWidth={2.2}
                        />
                      </div>

                      <div
                        className="
                          min-w-0
                          flex-1

                          text-left
                        "
                      >
                        <p
                          className="
                            text-[13px]
                            font-bold
                          "
                        >
                          Account
                        </p>

                        <p
                          className="
                            mt-0.5

                            text-[10px]

                            text-gray-400
                          "
                        >
                          {isLoggedIn
                            ? "View and manage your profile"
                            : "Login or create an account"}
                        </p>
                      </div>

                      <ChevronRight
                        size={16}
                        className="text-gray-300"
                      />
                    </Link>

                    {/* DOWNLOAD APP */}
                    <a
                      href="/downloads/navodaya-puja.apk"
                      download="navodaya-puja.apk"
                      onClick={() =>
                        setSettingsOpen(false)
                      }
                      className="
                        w-full

                        flex
                        items-center

                        gap-3

                        px-3
                        py-3

                        rounded-2xl

                        text-gray-700

                        transition-all
                        duration-200

                        hover:bg-orange-50
                        hover:text-orange-700

                        active:scale-[0.98]
                      "
                    >
                      <div
                        className="
                          w-10
                          h-10

                          shrink-0

                          rounded-xl

                          flex
                          items-center
                          justify-center

                          bg-orange-100

                          text-orange-700
                        "
                      >
                        <Download
                          size={18}
                          strokeWidth={2.3}
                        />
                      </div>

                      <div
                        className="
                          min-w-0
                          flex-1

                          text-left
                        "
                      >
                        <p
                          className="
                            text-[13px]
                            font-bold
                          "
                        >
                          Download App
                        </p>

                        <p
                          className="
                            mt-0.5

                            text-[10px]

                            text-gray-400
                          "
                        >
                          Install Puja Dham
                        </p>
                      </div>

                      <ChevronRight
                        size={16}
                        className="text-gray-300"
                      />
                    </a>

                    {/* SHARE APP */}
                    <button
                      type="button"
                      onClick={handleShareApp}
                      className="
                        w-full

                        flex
                        items-center

                        gap-3

                        px-3
                        py-3

                        rounded-2xl

                        text-gray-700

                        transition-all
                        duration-200

                        hover:bg-orange-50
                        hover:text-orange-700

                        active:scale-[0.98]
                      "
                    >
                      <div
                        className="
                          w-10
                          h-10

                          shrink-0

                          rounded-xl

                          flex
                          items-center
                          justify-center

                          bg-orange-100

                          text-orange-700
                        "
                      >
                        <Share2
                          size={18}
                          strokeWidth={2.3}
                        />
                      </div>

                      <div
                        className="
                          min-w-0
                          flex-1

                          text-left
                        "
                      >
                        <p
                          className="
                            text-[13px]
                            font-bold
                          "
                        >
                          Share App
                        </p>

                        <p
                          className="
                            mt-0.5

                            text-[10px]

                            text-gray-400
                          "
                        >
                          Share Puja Dham
                        </p>
                      </div>

                      <ChevronRight
                        size={16}
                        className="text-gray-300"
                      />
                    </button>

                    {/* LOGOUT — ONLY LOGGED IN */}
                    {isLoggedIn && (
                      <>
                        <div
                          className="
                            my-2

                            h-px

                            bg-gray-100
                          "
                        />

                        <button
                          type="button"
                          onClick={() => {
                            setSettingsOpen(false);

                            signOut({
                              callbackUrl: "/",
                            });
                          }}
                          className="
                            w-full

                            flex
                            items-center

                            gap-3

                            px-3
                            py-3

                            rounded-2xl

                            text-red-600

                            transition-all
                            duration-200

                            hover:bg-red-50

                            active:scale-[0.98]
                          "
                        >
                          <div
                            className="
                              w-10
                              h-10

                              shrink-0

                              rounded-xl

                              flex
                              items-center
                              justify-center

                              bg-red-50

                              text-red-600
                            "
                          >
                            <LogOut
                              size={18}
                              strokeWidth={2.3}
                            />
                          </div>

                          <div
                            className="
                              min-w-0
                              flex-1

                              text-left
                            "
                          >
                            <p
                              className="
                                text-[13px]
                                font-bold
                              "
                            >
                              Logout
                            </p>

                            <p
                              className="
                                mt-0.5

                                text-[10px]

                                text-red-400
                              "
                            >
                              Sign out from your account
                            </p>
                          </div>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* =====================================================
          FIXED TOP NAVBAR SPACER
          Isse page ka first content navbar ke neeche start hoga.
          Scroll par content translucent navbar ke piche dikhega.
      ====================================================== */}
      <div
        className="
          h-[68px]
          md:h-[76px]
          pt-[env(safe-area-inset-top)]
        "
        aria-hidden="true"
      />      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
          Android + iOS Safe Area
      ====================================================== */}
      <nav
        className="
          fixed

          bottom-0
          left-0
          right-0

          z-50

          md:hidden
        "
      >
        <div
          className="
            bg-[#fffdf9]/95

            backdrop-blur-2xl

            border-t
            border-orange-950/[0.07]

            shadow-[0_-8px_30px_rgba(73,36,10,0.08)]

            pb-[env(safe-area-inset-bottom)]
          "
        >
          <div
            className="
              max-w-md
              mx-auto

              grid
              grid-cols-5

              items-end

              px-1

              pt-2
              pb-2
            "
          >
            {navItems.map((item) => {
              const Icon = item.icon;

              const active =
                isActiveRoute(item.href);

              /* =============================================
                 CENTER BOOK CTA
              ============================================= */
              if (item.isBookCTA) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-label="Book Puja"
                    className="
                      group

                      flex
                      flex-col

                      items-center
                      justify-center

                      min-w-0
                    "
                  >
                    <div
                      className="
                        relative

                        -mt-6

                        w-[56px]
                        h-[44px]

                        rounded-full

                        flex
                        items-center
                        justify-center

                        bg-gradient-to-br
                        from-[#e5681c]
                        to-[#a93d10]

                        text-white

                        border-[4px]
                        border-[#fffdf9]

                        shadow-[0_10px_24px_rgba(181,65,14,0.34)]

                        transition-all
                        duration-300

                        group-active:scale-90
                      "
                    >
                      <Icon
                        size={20}
                        strokeWidth={2.4}
                      />
                    </div>

                    <span
                      className="
                        mt-1.5

                        text-[10px]

                        font-bold

                        text-orange-700

                        leading-none
                      "
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              }

              /* =============================================
                 REGULAR ITEM
              ============================================= */
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-label={item.name}
                  className="
                    group

                    flex
                    flex-col

                    items-center
                    justify-center

                    min-w-0
                  "
                >
                  <div
                    className={`
                      w-[52px]
                      h-8

                      rounded-full

                      flex
                      items-center
                      justify-center

                      transition-all
                      duration-300

                      group-active:scale-90

                      ${
                        active
                          ? `
                            bg-orange-100
                          `
                          : `
                            bg-transparent
                          `
                      }
                    `}
                  >
                    <Icon
                      size={21}
                      strokeWidth={
                        active ? 2.4 : 1.8
                      }
                      className={`
                        transition-colors
                        duration-300

                        ${
                          active
                            ? `
                              text-orange-700
                            `
                            : `
                              text-[#9c8b80]
                            `
                        }
                      `}
                    />
                  </div>

                  <span
                    className={`
                      mt-1.5

                      text-[9px]
                      min-[390px]:text-[10px]

                      leading-none

                      whitespace-nowrap

                      transition-colors
                      duration-300

                      ${
                        active
                          ? `
                            font-bold
                            text-orange-700
                          `
                          : `
                            font-medium
                            text-[#9c8b80]
                          `
                      }
                    `}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* =====================================================
          MOBILE SAFE CONTENT SPACER
          Bottom nav content ko cover nahi karega
      ====================================================== */}
      <div
        className="
          h-[72px]
          md:hidden
        "
      />
    </>
  );
}