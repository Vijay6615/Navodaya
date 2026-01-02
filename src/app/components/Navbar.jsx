"use client";
import { useState } from "react";

export default function Navbar() {

  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 gap-3 flex-nowrap">

        {/* LEFT : LOGO + NAME */}
        <div className="flex items-center gap-2 shrink-0">
        

          <span className="font-extrabold text-lg whitespace-nowrap">
            Navodaya Puja
          </span>
        </div>

        {/* DESKTOP LINKS */}
        <ul className="hidden md:flex items-center gap-6 font-medium">
          <li><a href="/" className="hover:text-orange-600">Home</a></li>
          <li><a href="/pujas" className="hover:text-orange-600">Pujas</a></li>
          <li><a href="/aboutpanditji" className="hover:text-orange-600">About</a></li>
          <li><a href="/gallery" className="hover:text-orange-600">Gallery</a></li>
        </ul>

        {/* BOOK BUTTON (DESKTOP) */}
        <div className="hidden md:block">
          <a href="/contact">
            <button className="px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold shadow-md hover:bg-orange-700">
              Book Now
            </button>
          </a>
        </div>

        {/* 📱 CLEAN HAMBURGER — ZERO BACKGROUND */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          className="
            md:hidden shrink-0
            bg-transparent
            outline-none
            border-none
            shadow-none
            active:bg-transparent
            focus:bg-transparent
            hover:bg-transparent
            appearance-none
          "
        >
          <div className="flex flex-col gap-1.5">

            <span className={`w-7 h-[2px] bg-black rounded-full transition-all duration-300
              ${open ? "rotate-45 translate-y-2" : ""}`}></span>

            <span className={`w-7 h-[2px] bg-black rounded-full transition-all duration-300
              ${open ? "opacity-0" : ""}`}></span>

            <span className={`w-7 h-[2px] bg-black rounded-full transition-all duration-300
              ${open ? "-rotate-45 -translate-y-2" : ""}`}></span>

          </div>
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t shadow-lg">
          <ul
            className="flex flex-col text-center py-4 text-lg font-medium"
            onClick={() => setOpen(false)}
          >
            <a href="/" className="py-2">Home</a>
            <a href="/pujas" className="py-2">Our Pujas</a>
            <a href="/aboutpanditji" className="py-2">About Panditji</a>
            <a href="/gallery" className="py-2">Gallery</a>

            <a href="/contact" className="py-2 mt-2">
              <button className="px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold shadow-md hover:bg-orange-700">
                Book Now
              </button>
            </a>
          </ul>
        </div>
      )}
    </header>
  );
}
