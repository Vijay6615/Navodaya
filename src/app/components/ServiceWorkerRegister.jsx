"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration =
          await navigator.serviceWorker.register(
            "/sw.js",
            {
              scope: "/",
              updateViaCache: "none",
            }
          );

        // Check for a newer service worker on page load.
        await registration.update();
      } catch (error) {
        console.error(
          "Service worker registration failed:",
          error
        );
      }
    };

    if (
      document.readyState === "complete"
    ) {
      registerServiceWorker();
      return;
    }

    window.addEventListener(
      "load",
      registerServiceWorker,
      { once: true }
    );

    return () => {
      window.removeEventListener(
        "load",
        registerServiceWorker
      );
    };
  }, []);

  return null;
}