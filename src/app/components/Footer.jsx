// src/app/components/Footer.jsx

import Link from "next/link";
import {
  ArrowUpRight,
  ChevronRight,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/puja_dham/";

const GOOGLE_REVIEW_URL =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ||
  "https://www.google.com/maps/search/?api=1&query=Puja+Dham+Mumbai";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "All Pujas", href: "/pujas?mode=all" },
  { label: "Home Visit", href: "/pujas?mode=offline" },
  { label: "Online Puja", href: "/pujas?mode=online" },
  { label: "Seva", href: "/seva" },
  { label: "My Bookings", href: "/my-bookings" },
  {
    label: "Reviews",
    href: GOOGLE_REVIEW_URL,
    external: true,
  },
];

const companyLinks = [
  { label: "About Us", href: "/aboutpanditji" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
  { label: "Monthly Events", href: "/#FrostCard" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#2b160d] text-white">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/25 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-7 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1.2fr] lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 lg:pr-6">
            <Link
              href="/"
              aria-label="Puja Dham Home"
              className="inline-flex items-center"
            >
              <img
                src="/Pujadhamlogo1.png"
                alt="Puja Dham Logo"
                className="block h-[92px] w-auto max-w-[280px] object-contain sm:h-[105px] lg:h-[118px]"
              />
            </Link>

            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f2a56f] sm:text-[12px]">
              Mantra · Vidhi · Aastha
            </p>

            {/* Instagram CTA */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Puja Dham Instagram profile"
              className="group mt-5 inline-flex min-h-12 items-center gap-3 rounded-full border border-[#f2a56f]/25 bg-white/[0.06] px-4 transition hover:border-[#f2a56f]/55 hover:bg-[#f2a56f]/10"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-sm">
                <Instagram size={18} strokeWidth={2} />
              </span>

              <span className="min-w-0 text-left">
                <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-orange-50/45">
                  Follow us on Instagram
                </span>
                <span className="block text-[12px] font-bold text-white">
                  @puja_dham
                </span>
              </span>

              <ArrowUpRight
                size={15}
                className="ml-1 shrink-0 text-orange-200/70 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange-200"
              />
            </a>
          </div>

          {/* Quick Links */}
          <FooterColumn title="Quick Links">
            {quickLinks.map((item) => (
              <FooterLink
                key={`${item.label}-${item.href}`}
                href={item.href}
                external={item.external}
              >
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Explore */}
          <FooterColumn title="Explore">
            {companyLinks.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Contact */}
          <div>
            <FooterHeading title="Contact Us" />

            <div className="mt-5 space-y-3">
              <ContactLink
                href="tel:+919594943609"
                icon={<Phone size={16} />}
                label="Call Pandit Ji"
                value="+91 95949 43609"
              />

              <ContactLink
                href="mailto:navodayapuja@gmail.com"
                icon={<Mail size={16} />}
                label="Email Us"
                value="pujadham@gmail.com"
              />

              <div className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-500/10 text-orange-300">
                  <MapPin size={16} />
                </span>

                <div className="min-w-0 pt-0.5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-orange-50/35">
                    Location
                  </p>
                  <p className="mt-1 text-[12px] leading-5 text-orange-50/70">
                    Mumbai, Maharashtra, India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent sm:mt-12 lg:mt-14" />

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-[11px] text-orange-50/50 sm:text-xs">
              © {new Date().getFullYear()} Puja Dham Services. All rights
              reserved.
            </p>
          </div>

          <p className="text-[10px] text-orange-50/40 sm:text-[11px]">
            Designed &amp; Developed by{" "}
            <a
              href="https://vijayshukla-portfolio.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-400 underline decoration-blue-400 underline-offset-4 transition-colors hover:text-blue-300"
            >
              Vijay Shukla
            </a>
          </p>
        </div>
      </div>

      {/* Mobile bottom-nav clearance */}
      <div className="h-[72px] md:hidden" />
    </footer>
  );
}

function FooterHeading({ title }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-orange-400" />
        <h4 className="text-[15px] font-extrabold text-white sm:text-base">
          {title}
        </h4>
      </div>

      <div className="mt-3 h-[2px] w-10 rounded-full bg-orange-500" />
    </>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <FooterHeading title={title} />
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children, external = false }) {
  const classes =
    "group inline-flex items-center gap-2 text-[13px] text-orange-50/70 transition-colors duration-200 hover:text-orange-400";

  if (external) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          <ChevronRight
            size={14}
            className="shrink-0 text-orange-500 transition-transform group-hover:translate-x-1"
          />

          {children}

          <ArrowUpRight
            size={12}
            className="text-orange-300/60 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link href={href} className={classes}>
        <ChevronRight
          size={14}
          className="shrink-0 text-orange-500 transition-transform group-hover:translate-x-1"
        />
        {children}
      </Link>
    </li>
  );
}

function ContactLink({ href, icon, label, value }) {
  return (
    <a
      href={href}
      className="group flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3.5 transition hover:border-orange-300/20 hover:bg-orange-400/[0.06]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-500/10 text-orange-300 transition group-hover:bg-orange-500/15">
        {icon}
      </span>

      <span className="min-w-0 pt-0.5">
        <span className="block text-[9px] font-semibold uppercase tracking-[0.15em] text-orange-50/35">
          {label}
        </span>
        <span className="mt-1 block break-all text-[12px] leading-5 text-orange-50/70 transition group-hover:text-orange-300">
          {value}
        </span>
      </span>
    </a>
  );
}
