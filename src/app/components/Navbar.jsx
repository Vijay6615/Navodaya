"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

// 🔥 Import Lucide Icons
import {
  Home,
  Sparkles,
  Flame,
  Image,
  User
} from "lucide-react";

export default function Navbar() {
  const path = usePathname();

  // 👇 icon ko component banaya
  const navItems = [
    { name: "Home", icon: Home, href: "/home" },
    { name: "Pujas", icon: Sparkles, href: "/pujas" },
    { name: "Aarti", icon: Flame, href: "/aarti" },
    { name: "Gallery", icon: Image, href: "/gallery" },
    { name: "Pandit Ji", icon: User, href: "/aboutpanditji" },
  ];

  return (
    <>
      {/* ================= TOP NAVBAR (DESKTOP ONLY) ================= */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg">
              Navodaya Puja
            </span>
          </div>

          <ul className="hidden md:flex items-center gap-6 font-medium">
            <li><Link href="/" className="hover:text-orange-600">Home</Link></li>
            <li><Link href="/pujas" className="hover:text-orange-600">Pujas</Link></li>
            <li><Link href="/aboutpanditji" className="hover:text-orange-600">About</Link></li>
            <li><Link href="/gallery" className="hover:text-orange-600">Gallery</Link></li>
          </ul>

          <div className="hidden md:block">
            <Link href="/contact">
              <button className="px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700">
                Book Now
              </button>
            </Link>
          </div>

        </nav>
      </header>

      {/* ================= BOTTOM NAVBAR (MOBILE ONLY) ================= */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg md:hidden z-50">
        <div className="flex justify-around py-2">

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.href}>
                <div className="flex flex-col items-center text-xs">

                  {/* 🔥 ICON */}
                  <Icon
                    size={22}
                    className={`${
                      path === item.href
                        ? "text-orange-600"
                        : "text-gray-400"
                    }`}
                  />

                  {/* TEXT */}
                  <span
                    className={`${
                      path === item.href
                        ? "text-orange-600 font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {item.name}
                  </span>

                </div>
              </Link>
            );
          })}

        </div>
      </div>
    </>
  );
}