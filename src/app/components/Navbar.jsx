"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Sparkles, CalendarCheck, LayoutGrid, User } from "lucide-react";

const navItems = [
  { name: "Home",      icon: Home,          href: "/" },
  { name: "Pujas",     icon: Sparkles,      href: "/pujas" },
  { name: "Book",      icon: CalendarCheck, href: "/contact", isBookCTA: true },
  { name: "Gallery",   icon: LayoutGrid,    href: "/gallery" },
  { name: "Pandit Ji", icon: User,          href: "/aboutpanditji" },
];

export default function Navbar() {
  const path = usePathname();

  return (
    <>
      {/* ═══════════════ TOP BAR — DESKTOP ═══════════════ */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-lg shadow-md shadow-orange-200 transition-transform group-hover:scale-105">
              🪔
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-bold text-gray-900 tracking-tight">
                Navodaya Puja
              </span>
              <span className="text-[10px] font-medium text-orange-600 uppercase tracking-widest">
                Sacred Ceremonies
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {[
              { label: "Home",        href: "/" },
              { label: "Pujas",       href: "/pujas" },
              { label: "About Panditji", href: "/aboutpanditji" },
              { label: "Gallery",     href: "/gallery" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${path === href
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-600 hover:bg-orange-50/60 hover:text-orange-600"
                    }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:block">
            <Link href="/contact">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-600 text-white text-sm font-semibold shadow-md shadow-orange-200 hover:bg-orange-700 hover:-translate-y-px hover:shadow-orange-300 active:translate-y-0 active:shadow-sm transition-all duration-200">
                <CalendarCheck size={15} />
                Book Now
              </button>
            </Link>
          </div>

        </nav>
      </header>

      {/* ═══════════════ BOTTOM NAV — MOBILE ═══════════════ */}
      {/*
        Material Design 3 Navigation Bar:
        - Pill-shaped active indicator on each icon
        - "Book" is an elevated floating pill (FAB-inspired)
        - Labels always visible (MD3 style)
      */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* Safe area bg */}
        <div className="bg-white/95 backdrop-blur-md border-t border-black/[0.06] shadow-[0_-1px_12px_rgba(0,0,0,0.06)]">
          <div className="flex items-end justify-around px-2 pt-1.5 pb-safe-or-2">

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = path === item.href;

              /* ── Book Now: elevated FAB-style pill ── */
              if (item.isBookCTA) {
                return (
                  <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 flex-1">
                    <div className="flex items-center justify-center gap-1.5 px-4 h-9 rounded-full bg-orange-600 text-white shadow-lg shadow-orange-300 active:scale-95 transition-transform">
                      <Icon size={18} strokeWidth={2.2} />
                    </div>
                    <span className="text-[10px] font-semibold text-orange-600 leading-none pb-1">
                      {item.name}
                    </span>
                  </Link>
                );
              }

              /* ── Regular nav item ── */
              return (
                <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 flex-1">
                  {/* MD3 pill indicator */}
                  <div className={`flex items-center justify-center w-16 h-8 rounded-full transition-all duration-250
                    ${isActive ? "bg-orange-100" : "bg-transparent"}`}
                  >
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2.2 : 1.7}
                      className={`transition-colors duration-200 ${isActive ? "text-orange-600" : "text-gray-400"}`}
                    />
                  </div>

                  <span className={`text-[10px] leading-none pb-1 transition-colors duration-200
                    ${isActive ? "font-semibold text-orange-600" : "font-medium text-gray-400"}`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}

          </div>
        </div>
      </nav>

      {/* Spacer so content isn't hidden behind the mobile bottom nav */}
      <div className="h-[68px] md:hidden" />
    </>
  );
}