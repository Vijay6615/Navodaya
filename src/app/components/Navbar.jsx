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
} from "lucide-react";

/* =========================================================
   MOBILE BOTTOM NAV ITEMS
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

export default function Navbar() {
  const path = usePathname();

  const { data: session } = useSession();

  const [settingsOpen, setSettingsOpen] = useState(false);

  const settingsRef = useRef(null);

  /* =========================================================
     ACTIVE ROUTE CHECK
  ========================================================= */
  const isActiveRoute = (href) => {
    if (href === "/") {
      return path === "/";
    }

    return path === href || path.startsWith(`${href}/`);
  };

  /* =========================================================
     CLOSE SETTINGS ON OUTSIDE CLICK
  ========================================================= */
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target)
      ) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

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
     CLOSE SETTINGS WHEN ROUTE CHANGES
  ========================================================= */
  useEffect(() => {
    setSettingsOpen(false);
  }, [path]);

  /* =========================================================
     USER DATA
  ========================================================= */
  const userName =
    session?.user?.name ||
    session?.user?.email?.split("@")[0] ||
    "Navodaya User";

  const userEmail =
    session?.user?.email ||
    "Welcome to Navodaya Puja";

  const userImage = session?.user?.image;

  const firstLetter =
    userName?.charAt(0)?.toUpperCase() || "N";

  /* =========================================================
     SHARE APP
  ========================================================= */
  const handleShareApp = async () => {
    const appUrl = typeof window !== "undefined" ? window.location.origin : "";

    const shareData = {
      title: "Navodaya Puja",
      text: "Book authentic Vedic pujas with Navodaya Puja App 🙏",
      url: appUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(appUrl);
        alert("App link copied!");
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
          TOP NAVBAR
      ====================================================== */}
      <header
        className="
          sticky
          top-0
          z-50

          w-full

          bg-white/90
          backdrop-blur-xl

          border-b
          border-black/[0.06]

          shadow-[0_2px_16px_rgba(0,0,0,0.04)]
        "
      >
        <nav
          className="
            relative

            max-w-6xl
            mx-auto

            h-[72px]

            flex
            items-center
            justify-between

            px-4
            sm:px-6
          "
        >
          {/* =================================================
              MOBILE LEFT EMPTY SPACE
              Keeps brand perfectly centered
          ================================================== */}
          <div
            className="
              md:hidden

              w-10
              h-10

              shrink-0
            "
          />

          {/* =================================================
              DESKTOP LEFT SPACE
          ================================================== */}
          <div className="hidden md:block md:flex-1" />

          {/* =================================================
              CENTER BRAND
          ================================================== */}
          <Link
            href="/"
            aria-label="Navodaya Puja Home"
            className="
              absolute

              left-1/2
              top-1/2

              -translate-x-1/2
              -translate-y-1/2

              group

              flex
              items-center
              justify-center

              whitespace-nowrap
            "
          >
            <span
              className="
                text-[20px]
                sm:text-[22px]
                md:text-[23px]

                font-black

                text-gray-900

                tracking-[0.03em]

                leading-none

                transition-all
                duration-300

                group-hover:text-orange-600
                group-hover:tracking-[0.05em]
              "
              style={{
                fontFamily:
                  'Georgia, "Times New Roman", ui-serif, serif',
              }}
            >
              NAVODAYA PUJA
            </span>
          </Link>

          {/* =================================================
              MOBILE SETTINGS BUTTON — RIGHT
          ================================================== */}
          <div
            ref={settingsRef}
            className="
              relative
              z-30
              md:hidden
            "
          >
            <button
              type="button"
              onClick={() =>
                setSettingsOpen((prev) => !prev)
              }
              aria-label="Open Settings"
              title="Settings"
              className={`
                w-10
                h-10

                flex
                items-center
                justify-center

                rounded-full

                border

                transition-all
                duration-300

                active:scale-90

                ${
                  settingsOpen
                    ? `
                      bg-orange-600
                      border-orange-600
                      text-white
                      shadow-lg
                      shadow-orange-200
                    `
                    : `
                      bg-orange-50
                      border-orange-100
                      text-orange-600
                    `
                }
              `}
            >
              {settingsOpen ? (
                <X
                  size={19}
                  strokeWidth={2.4}
                />
              ) : (
                <Settings
                  size={19}
                  strokeWidth={2.3}
                />
              )}
            </button>

            {/* =============================================
                MOBILE SETTINGS DROPDOWN
            ============================================= */}
            {settingsOpen && (
              <div
                className="
                  absolute

                  top-[50px]
                  right-0

                  w-[280px]
                  max-w-[calc(100vw-32px)]

                  overflow-hidden

                  rounded-[24px]

                  bg-white/95
                  backdrop-blur-2xl

                  border
                  border-orange-100

                  shadow-[0_20px_60px_rgba(0,0,0,0.18)]

                  animate-[fadeIn_0.2s_ease-out]
                "
              >
                {/* PROFILE AREA */}
                <div
                  className="
                    p-4

                    bg-gradient-to-br
                    from-orange-50
                    via-white
                    to-amber-50

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
                    {/* USER AVATAR */}
                    {userImage ? (
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
                          to-orange-700

                          text-white

                          text-xl
                          font-black

                          border-[3px]
                          border-white

                          shadow-md
                        "
                      >
                        {firstLetter}
                      </div>
                    )}

                    {/* USER INFO */}
                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          text-[15px]
                          font-extrabold
                          text-gray-900

                          truncate
                        "
                      >
                        {userName}
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
                        {userEmail}
                      </p>

                      <div
                        className="
                          mt-2

                          inline-flex
                          items-center

                          px-2.5
                          py-1

                          rounded-full

                          bg-orange-100

                          text-[9px]
                          font-bold
                          text-orange-700

                          uppercase
                          tracking-wide
                        "
                      >
                        Navodaya Member
                      </div>
                    </div>
                  </div>
                </div>

                {/* MENU ACTIONS */}
                <div className="p-2.5">
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
                      hover:text-orange-600

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

                        text-orange-600
                      "
                    >
                      <Download
                        size={18}
                        strokeWidth={2.3}
                      />
                    </div>

                    <div className="text-left">
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
                        Install Navodaya Puja APK
                      </p>
                    </div>
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
                      hover:text-orange-600
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
                        text-orange-600
                      "
                    >
                      <Share2 size={18} strokeWidth={2.3} />
                    </div>

                    <div className="text-left">
                      <p className="text-[13px] font-bold">
                        Share App
                      </p>
                      <p className="mt-0.5 text-[10px] text-gray-400">
                        Share Navodaya Puja with others
                      </p>
                    </div>
                  </button>

                  {/* LOGOUT */}
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsOpen(false);

                      signOut({
                        callbackUrl: "/login",
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

                    <div className="text-left">
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
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              DESKTOP LINKS
          ================================================== */}
          <ul
            className="
              hidden
              md:flex

              items-center

              gap-1

              ml-auto
            "
          >
            {[
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
            ].map(({ label, href }) => {
              const active = isActiveRoute(href);

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`
                      px-3
                      py-2

                      rounded-full

                      text-[13px]
                      font-semibold

                      transition-all
                      duration-200

                      ${
                        active
                          ? `
                            bg-orange-50
                            text-orange-600
                          `
                          : `
                            text-gray-600
                            hover:bg-orange-50/70
                            hover:text-orange-600
                          `
                      }
                    `}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* =================================================
              DESKTOP ACTION BUTTONS
          ================================================== */}
          <div
            className="
              hidden
              md:flex

              items-center

              gap-2
              ml-3
            "
          >
            {/* DOWNLOAD APP */}
            <a
              href="/downloads/navodaya-puja.apk"
              download="navodaya-puja.apk"
              className="
                flex
                items-center
                justify-center

                gap-2

                px-4
                py-2.5

                rounded-full

                bg-white

                border
                border-orange-200

                text-orange-600

                text-[13px]
                font-bold

                shadow-sm

                transition-all
                duration-300

                hover:bg-orange-50
                hover:border-orange-300
                hover:-translate-y-0.5
                hover:shadow-md

                active:scale-95
              "
            >
              <Download
                size={15}
                strokeWidth={2.4}
              />

              Download App
            </a>

            {/* BOOK NOW */}
            <Link
              href="/contact"
              className="
                flex
                items-center
                justify-center

                gap-2

                px-4
                py-2.5

                rounded-full

                bg-orange-600

                text-white

                text-[13px]
                font-bold

                shadow-md
                shadow-orange-200

                transition-all
                duration-300

                hover:bg-orange-700
                hover:-translate-y-0.5

                active:scale-95
              "
            >
              <CalendarCheck
                size={15}
                strokeWidth={2.3}
              />

              Book Now
            </Link>
          </div>
        </nav>
      </header>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
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
            bg-white/95
            backdrop-blur-xl

            border-t
            border-black/[0.06]

            shadow-[0_-4px_20px_rgba(0,0,0,0.07)]

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

              const isActive =
                isActiveRoute(item.href);

              /* =============================================
                 CENTER BOOK BUTTON
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
                    {/* BOOK CTA */}
                    <div
                      className="
                        relative

                        -mt-5

                        min-w-[54px]
                        h-[40px]

                        px-4

                        rounded-full

                        flex
                        items-center
                        justify-center

                        bg-gradient-to-r
                        from-orange-500
                        to-orange-700

                        text-white

                        border-[3px]
                        border-white

                        shadow-[0_8px_20px_rgba(234,88,12,0.32)]

                        transition-all
                        duration-300

                        group-active:scale-90
                      "
                    >
                      <Icon
                        size={19}
                        strokeWidth={2.4}
                      />
                    </div>

                    <span
                      className="
                        mt-1.5

                        text-[10px]

                        font-bold

                        text-orange-600

                        leading-none
                      "
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              }

              /* =============================================
                 REGULAR NAV ITEM
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
                  {/* ICON PILL */}
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
                        isActive
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
                        isActive ? 2.4 : 1.8
                      }
                      className={`
                        transition-colors
                        duration-300

                        ${
                          isActive
                            ? `
                              text-orange-600
                            `
                            : `
                              text-gray-400
                            `
                        }
                      `}
                    />
                  </div>

                  {/* LABEL */}
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
                        isActive
                          ? `
                            font-bold
                            text-orange-600
                          `
                          : `
                            font-medium
                            text-gray-400
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
          MOBILE BOTTOM SPACER
      ====================================================== */}
      <div className="h-[72px] md:hidden" />
    </>
  );
}