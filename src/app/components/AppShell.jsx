"use client";

import { usePathname } from "next/navigation";

import Navbar from "./Navbar";
import Footer from "./Footer";
import ClientAnimation from "./ClientAnimation";
import InstallPujaDham from "./InstallPujaDham";

export default function AppShell({ children }) {
  const pathname = usePathname();

  // Auth pages:
  // In pages par Navbar aur Footer nahi dikhana
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password";

  return (
    <div className="flex min-h-svh w-full flex-col">
      {/* Global animations */}
      <ClientAnimation />

      {/* Auth pages par Navbar hide */}
      {!isAuthPage && <Navbar />}

      {/* Page content */}
      <main className="w-full flex-1">
        {children}
      </main>

      {/* Auth pages par Footer hide */}
      {!isAuthPage && <Footer />}

      {/* Install prompt sirf public website pages par */}
      {!isAuthPage && <InstallPujaDham />}
    </div>
  );
}