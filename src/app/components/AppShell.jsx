"use client";

import { usePathname } from "next/navigation";

import Navbar from "./Navbar";
import Footer from "./Footer";
import InstallPujaDham from "./InstallPujaDham";
import ServiceWorkerRegister from "./ServiceWorkerRegister";

const AUTH_ROUTES = new Set([
  "/login",
  "/signup",
  "/forgot-password",
]);

export default function AppShell({
  children,
}) {
  const pathname = usePathname() || "";
  const isAuthPage =
    AUTH_ROUTES.has(pathname);

  return (
    <div className="flex min-h-svh w-full flex-col">
      <ServiceWorkerRegister />

      {!isAuthPage && <Navbar />}

      <div className="w-full flex-1">
        {children}
      </div>

      {!isAuthPage && <Footer />}

      {!isAuthPage && (
        <InstallPujaDham />
      )}
    </div>
  );
}