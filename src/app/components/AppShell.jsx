"use client";

import { usePathname } from "next/navigation";

import Navbar from "./Navbar";
import Footer from "./Footer";
import ClientAnimation from "./ClientAnimation";

export default function AppShell({ children }) {
  const pathname = usePathname();

  // Auth pages:
  // In pages par Navbar aur Footer nahi dikhana
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password";

  return (
    <>
      {/* Global animations */}
      <ClientAnimation />

      {/* Auth pages par Navbar hide */}
      {!isAuthPage && <Navbar />}

      {/* Page content */}
      <main>
        {children}
      </main>

      {/* Auth pages par Footer hide */}
      {!isAuthPage && <Footer />}
    </>
  );
}