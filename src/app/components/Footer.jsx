// src/app/components/Footer.jsx

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Heart,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="
        relative
        overflow-hidden
        bg-[#2b160d]
        text-white
      "
    >
      {/* Decorative glow */}
      <div
        className="
          pointer-events-none
          absolute
          -top-24
          -left-24
          w-72
          h-72
          rounded-full
          bg-orange-500/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          -right-24
          w-80
          h-80
          rounded-full
          bg-amber-400/10
          blur-3xl
        "
      />

      {/* MAIN FOOTER */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-7xl
          mx-auto

          px-5
          sm:px-6
          lg:px-8

          pt-12
          sm:pt-14
          lg:pt-16

          pb-8
        "
      >
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4

            gap-10
            sm:gap-12
            lg:gap-8
          "
        >
          {/* =========================================
              BRAND
          ========================================= */}
          <div className="lg:pr-6">
            <Link
              href="/"
              aria-label="Puja Dham Home"
              className="
                inline-flex
                items-center
              "
            >
              <img
                src="/pujadham1.png"
                alt="Puja Dham Logo"
                className="
                  w-auto
                  h-[70px]
                  sm:h-[76px]
                  lg:h-[82px]
                  max-w-[220px]
                  object-contain
                "
              />
            </Link>

            <p
              className="
                mt-4
                max-w-sm

                text-[13px]
                sm:text-sm

                leading-6

                text-orange-50/70
              "
            >
              Bringing sacred rituals, authentic Vedic traditions,
              and divine blessings closer to your home.
            </p>

            <div
              className="
                mt-5

                inline-flex
                items-center

                gap-2

                px-3
                py-2

                rounded-full

                bg-white/[0.06]

                border
                border-white/[0.08]

                text-[11px]
                font-semibold

                text-orange-100
              "
            >
              <Sparkles
                size={14}
                className="text-orange-400"
              />

              Sacred Rituals • Divine Blessings
            </div>
          </div>

          {/* =========================================
              QUICK LINKS
          ========================================= */}
          <div>
            <h4
              className="
                text-[15px]
                sm:text-base

                font-extrabold

                text-white
              "
            >
              Quick Links
            </h4>

            <div
              className="
                mt-3
                w-10
                h-[2px]
                rounded-full
                bg-orange-500
              "
            />

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-2

                    text-[13px]
                    text-orange-50/70

                    transition-colors
                    duration-200

                    hover:text-orange-400
                  "
                >
                  <ChevronRight
                    size={14}
                    className="
                      text-orange-500
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />

                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/pujas"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-2

                    text-[13px]
                    text-orange-50/70

                    transition-colors
                    duration-200

                    hover:text-orange-400
                  "
                >
                  <ChevronRight
                    size={14}
                    className="
                      text-orange-500
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />

                  Our Pujas
                </Link>
              </li>

              <li>
                <Link
                  href="/aboutpanditji"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-2

                    text-[13px]
                    text-orange-50/70

                    transition-colors
                    duration-200

                    hover:text-orange-400
                  "
                >
                  <ChevronRight
                    size={14}
                    className="
                      text-orange-500
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />

                  About us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-2

                    text-[13px]
                    text-orange-50/70

                    transition-colors
                    duration-200

                    hover:text-orange-400
                  "
                >
                  <ChevronRight
                    size={14}
                    className="
                      text-orange-500
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />

                  Book Now
                </Link>
              </li>

              <li>
                <Link
                  href="/gallery"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-2

                    text-[13px]
                    text-orange-50/70

                    transition-colors
                    duration-200

                    hover:text-orange-400
                  "
                >
                  <ChevronRight
                    size={14}
                    className="
                      text-orange-500
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />

                Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* =========================================
              SERVICES
          ========================================= */}
          <div>
            <h4
              className="
                text-[15px]
                sm:text-base

                font-extrabold

                text-white
              "
            >
              Services
            </h4>

            <div
              className="
                mt-3
                w-10
                h-[2px]
                rounded-full
                bg-orange-500
              "
            />

            <ul
              className="
                mt-5
                space-y-3

                text-[13px]
                text-orange-50/70
              "
            >
              <li
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-orange-500
                  "
                />

                Daily Pujas
              </li>

              <li
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-orange-500
                  "
                />

                Festival Pujas
              </li>

              <li
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-orange-500
                  "
                />

                Special Occasions
              </li>

              <li
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-orange-500
                  "
                />

                Havan Ceremonies
              </li>
            </ul>
          </div>

          {/* =========================================
              CONTACT
          ========================================= */}
          <div>
            <h4
              className="
                text-[15px]
                sm:text-base

                font-extrabold

                text-white
              "
            >
              Contact Us
            </h4>

            <div
              className="
                mt-3
                w-10
                h-[2px]
                rounded-full
                bg-orange-500
              "
            />

            <ul className="mt-5 space-y-4">
              {/* PHONE */}
              <li>
                <a
                  href="tel:+919594943609"
                  className="
                    group

                    flex
                    items-start

                    gap-3

                    text-[13px]

                    text-orange-50/70

                    transition-colors
                    duration-200

                    hover:text-orange-400
                  "
                >
                  <span
                    className="
                      w-9
                      h-9

                      shrink-0

                      rounded-xl

                      flex
                      items-center
                      justify-center

                      bg-orange-500/10

                      border
                      border-orange-400/10

                      text-orange-400
                    "
                  >
                    <Phone size={16} />
                  </span>

                  <span className="pt-2">
                    Click to call
                  </span>
                </a>
              </li>

              {/* EMAIL */}
              <li>
                <a
                  href="mailto:navodayapuja@gmail.com"
                  className="
                    group

                    flex
                    items-start

                    gap-3

                    text-[13px]

                    text-orange-50/70

                    transition-colors
                    duration-200

                    hover:text-orange-400
                  "
                >
                  <span
                    className="
                      w-9
                      h-9

                      shrink-0

                      rounded-xl

                      flex
                      items-center
                      justify-center

                      bg-orange-500/10

                      border
                      border-orange-400/10

                      text-orange-400
                    "
                  >
                    <Mail size={16} />
                  </span>

                  <span
                    className="
                      pt-2
                      break-all
                    "
                  >
                    pujadham@gmail.com
                  </span>
                </a>
              </li>

              {/* LOCATION */}
              <li
                className="
                  flex
                  items-start

                  gap-3

                  text-[13px]

                  text-orange-50/70
                "
              >
                <span
                  className="
                    w-9
                    h-9

                    shrink-0

                    rounded-xl

                    flex
                    items-center
                    justify-center

                    bg-orange-500/10

                    border
                    border-orange-400/10

                    text-orange-400
                  "
                >
                  <MapPin size={16} />
                </span>

                <span
                  className="
                    pt-1.5
                    leading-5
                  "
                >
                  A/101,102, Shree Krishna Darshan, Behind Anthony School, Nagindas, NSP(E)
                  <br />
                  Mumbai, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* =========================================
            BOTTOM DIVIDER
        ========================================= */}
        <div
          className="
            mt-10
            sm:mt-12
            lg:mt-14

            h-px

            bg-gradient-to-r
            from-transparent
            via-white/10
            to-transparent
          "
        />

        {/* =========================================
            COPYRIGHT
        ========================================= */}
        <div
          className="
            pt-6

            flex
            flex-col
            sm:flex-row

            items-center
            justify-between

            gap-3
          "
        >
          <p
            className="
              text-center
              sm:text-left

              text-[11px]
              sm:text-xs

              text-orange-50/50
            "
          >
            © {new Date().getFullYear()} Puja Dham Services.
            All rights reserved.
          </p>

          <p
  className="
    text-[10px]
    sm:text-[11px]
    text-orange-50/40
  "
>
  Designed & Developed by{" "}
  <a
    href="https://vijayshukla-portfolio.vercel.app"
    target="_blank"
    rel="noopener noreferrer"
    className="
      text-blue-400
      underline
      underline-offset-4
      decoration-blue-400
      hover:text-blue-300
      hover:decoration-blue-300
      transition-colors
      duration-300
      font-medium
    "
  >
    Vijay Shukla
  </a>
</p>
        </div>
      </div>

      {/* =========================================
          MOBILE BOTTOM NAV SPACE
          Footer content bottom nav ke piche nahi jayega
      ========================================= */}
      <div
        className="
          h-[72px]
          md:hidden
        "
      />
    </footer>
  );
}