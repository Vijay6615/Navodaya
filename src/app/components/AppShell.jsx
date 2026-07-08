"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import Navbar from "./Navbar";
import Footer from "./Footer";
import ClientAnimation from "./ClientAnimation";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const { status } = useSession();

  // Auth pages jahan Navbar/Footer nahi chahiye
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password";

  useEffect(() => {
    // User login nahi hai aur auth page par bhi nahi hai
    // to login page par bhejo
    if (status === "unauthenticated" && !isAuthPage) {
      router.replace("/login");
    }

    // User already login hai aur /login open karta hai
    // to home page par bhejo
    if (status === "authenticated" && pathname === "/login") {
      router.replace("/");
    }
  }, [status, pathname, isAuthPage, router]);

  // Session check hone tak loading
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FFF8F4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />

          <p className="text-sm font-medium text-orange-700">
            Navodaya Puja
          </p>
        </div>
      </div>
    );
  }

  // Unauthenticated user protected page par hai
  // redirect complete hone tak page mat dikhao
  if (status === "unauthenticated" && !isAuthPage) {
    return (
      <div className="min-h-screen bg-[#FFF8F4] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <ClientAnimation />

      {!isAuthPage && <Navbar />}

      <main>
        {children}
      </main>

      {!isAuthPage && <Footer />}
    </>
  );
}