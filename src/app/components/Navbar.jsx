"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Sparkles,
  CalendarCheck,
  LayoutGrid,
  User,
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

  /* =========================================================
     ACTIVE ROUTE CHECK
     /pujas/ganesh-puja par bhi Pujas active rahega
  ========================================================= */
  const isActiveRoute = (href) => {
    if (href === "/") {
      return path === "/";
    }

    return path === href || path.startsWith(`${href}/`);
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
              LEFT SPACE — DESKTOP BALANCE
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
              DESKTOP BOOK BUTTON
          ================================================== */}
          <div className="hidden md:block ml-2">
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
              const isActive = isActiveRoute(item.href);

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
                      strokeWidth={isActive ? 2.4 : 1.8}
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