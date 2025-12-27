"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) =>
    pathname === href ? "nav-link active" : "nav-link";

  return (
    <header className="nav-wrapper">

      {/* DARK OVERLAY (mobile) */}
      {open && <div className="nav-overlay" onClick={() => setOpen(false)} />}

      <div className="navbar">

        {/* LEFT LOGO */}
        <div className="nav-left">
          <div className="logo-circle">ॐ</div>
          <span className="brand-name">Panditji Puja</span>
        </div>

        {/* HAMBURGER */}
        <button className="hamburger" onClick={() => setOpen(!open)}>
          {open ? "✖" : "☰"}
        </button>

        {/* CENTER LINKS */}
        <nav className={`nav-links ${open ? "show" : ""}`}>

          <Link href="/" className={isActive("/")} onClick={() => setOpen(false)}>
            Home
          </Link>

          <Link href="/pujas" className={isActive("/pujas")} onClick={() => setOpen(false)}>
            Our Pujas
          </Link>

          <Link href="/aboutpanditji" className={isActive("/aboutpanditji")} onClick={() => setOpen(false)}>
            About Panditji
          </Link>

          <Link href="/admin" className={isActive("/admin")} onClick={() => setOpen(false)}>
            Admin
          </Link>

          {/* ⭐ MOBILE BOOK NOW INSIDE MENU */}
          <Link href="/contact" onClick={() => setOpen(false)}>
            <button className="book-btn mobile-book">
              Book Now
            </button>
          </Link>

        </nav>

        {/* RIGHT SIDE DESKTOP BUTTONS */}
        <div className="nav-right">
          <button className="lang-btn">🌐 EN</button>

          <Link href="/contact">
            <button className="book-btn">
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
