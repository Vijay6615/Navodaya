"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Download,
  Smartphone,
  X,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

const INSTALL_DISMISSED_KEY =
  "puja-dham-install-dismissed";

const INSTALL_BANNER_DELAY = 5000;

export default function InstallPujaDham() {
  const { t } = useLanguage();

  const [deferredPrompt, setDeferredPrompt] =
    useState(null);

  const [isInstalled, setIsInstalled] =
    useState(false);

  const [isIOS, setIsIOS] =
    useState(false);

  const [showBanner, setShowBanner] =
    useState(false);

  const [showHelp, setShowHelp] =
    useState(false);

  const bannerTimerRef = useRef(null);

  const clearBannerTimer = useCallback(() => {
    if (bannerTimerRef.current) {
      window.clearTimeout(
        bannerTimerRef.current
      );

      bannerTimerRef.current = null;
    }
  }, []);

  const dismissForCurrentVisit =
    useCallback(() => {
      clearBannerTimer();

      try {
        window.sessionStorage.setItem(
          INSTALL_DISMISSED_KEY,
          "true"
        );
      } catch (error) {
        console.warn(
          "Install dismissal could not be saved:",
          error
        );
      }

      setShowBanner(false);
      setShowHelp(false);
    }, [clearBannerTimer]);

  const scheduleBanner = useCallback(() => {
    clearBannerTimer();

    bannerTimerRef.current =
      window.setTimeout(() => {
        let dismissed = false;

        try {
          dismissed =
            window.sessionStorage.getItem(
              INSTALL_DISMISSED_KEY
            ) === "true";
        } catch {
          dismissed = false;
        }

        if (!dismissed) {
          setShowBanner(true);
        }

        bannerTimerRef.current = null;
      }, INSTALL_BANNER_DELAY);
  }, [clearBannerTimer]);

  useEffect(() => {
    const standalone =
      window.matchMedia(
        "(display-mode: standalone)"
      ).matches ||
      window.navigator.standalone === true;

    const iosDevice =
      /iphone|ipad|ipod/i.test(
        window.navigator.userAgent
      ) && !window.MSStream;

    let wasDismissed = false;

    try {
      wasDismissed =
        window.sessionStorage.getItem(
          INSTALL_DISMISSED_KEY
        ) === "true";
    } catch {
      wasDismissed = false;
    }

    setIsInstalled(standalone);
    setIsIOS(iosDevice);

    if (!standalone && !wasDismissed) {
      scheduleBanner();
    }

    const handleBeforeInstallPrompt = (
      event
    ) => {
      event.preventDefault();
      setDeferredPrompt(event);

      let dismissed = false;

      try {
        dismissed =
          window.sessionStorage.getItem(
            INSTALL_DISMISSED_KEY
          ) === "true";
      } catch {
        dismissed = false;
      }

      if (!dismissed) {
        scheduleBanner();
      }
    };

    const handleAppInstalled = () => {
      clearBannerTimer();

      try {
        window.sessionStorage.removeItem(
          INSTALL_DISMISSED_KEY
        );
      } catch (error) {
        console.warn(
          "Install dismissal could not be cleared:",
          error
        );
      }

      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowBanner(false);
      setShowHelp(false);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      "appinstalled",
      handleAppInstalled
    );

    return () => {
      clearBannerTimer();

      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled
      );
    };
  }, [
    clearBannerTimer,
    scheduleBanner,
  ]);

  const handleInstall = useCallback(async () => {
    clearBannerTimer();

    if (isIOS) {
      setShowBanner(true);
      setShowHelp(true);
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();

        const choice =
          await deferredPrompt.userChoice;

        if (
          choice.outcome === "accepted"
        ) {
          try {
            window.sessionStorage.removeItem(
              INSTALL_DISMISSED_KEY
            );
          } catch (error) {
            console.warn(
              "Install dismissal could not be cleared:",
              error
            );
          }

          setIsInstalled(true);
          setShowBanner(false);
          setShowHelp(false);
        } else {
          dismissForCurrentVisit();
        }
      } catch (error) {
        console.error(
          "Install prompt failed:",
          error
        );

        setShowBanner(true);
        setShowHelp(true);
      } finally {
        setDeferredPrompt(null);
      }

      return;
    }

    setShowBanner(true);
    setShowHelp(true);
  }, [
    clearBannerTimer,
    deferredPrompt,
    dismissForCurrentVisit,
    isIOS,
  ]);

  useEffect(() => {
    const handleNavbarInstall = () => {
      if (isInstalled) {
        return;
      }

      clearBannerTimer();

      try {
        window.sessionStorage.removeItem(
          INSTALL_DISMISSED_KEY
        );
      } catch (error) {
        console.warn(
          "Install dismissal could not be cleared:",
          error
        );
      }

      setShowBanner(true);
      handleInstall();
    };

    window.addEventListener(
      "puja-dham-install",
      handleNavbarInstall
    );

    return () => {
      window.removeEventListener(
        "puja-dham-install",
        handleNavbarInstall
      );
    };
  }, [
    clearBannerTimer,
    handleInstall,
    isInstalled,
  ]);

  if (isInstalled || !showBanner) {
    return null;
  }

  return (
    <>
      <section
        role="dialog"
        aria-label="Install Puja Dham"
        className="fixed bottom-24 left-4 z-[90] w-[calc(100%-2rem)] max-w-[360px] rounded-[22px] border border-orange-200 bg-white p-4 shadow-[0_20px_60px_rgba(59,31,14,0.24)] sm:bottom-6 sm:left-6"
      >
        <button
          type="button"
          aria-label="Close install prompt"
          onClick={dismissForCurrentVisit}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={17} />
        </button>

        <div className="flex items-center gap-3 pr-8">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-orange-100 bg-orange-50">
            <Image
              src="/icons/icon-192.png"
              alt="Puja Dham"
              fill
              loading="lazy"
              sizes="56px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[15px] font-extrabold text-[#2b160d]">
              {t("install.title")}
            </p>

            <p className="mt-1 text-[11px] leading-4 text-gray-500">
              {t("install.description")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleInstall}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#a8441b] px-4 text-xs font-bold text-white transition hover:bg-[#873514] active:scale-[0.98]"
        >
          <Download size={16} />
          {t("install.installButton")}
        </button>

        <button
          type="button"
          onClick={dismissForCurrentVisit}
          className="mt-2 h-9 w-full rounded-xl text-[11px] font-semibold text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
        >
          {t("install.notNow")}
        </button>
      </section>

      {showHelp && (
        <div
          className="fixed inset-0 z-[150] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
          onClick={() =>
            setShowHelp(false)
          }
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone
                  size={20}
                  className="text-[#a8441b]"
                />

                <h3 className="text-base font-bold text-[#2b160d]">
                  {t("install.title")}
                </h3>
              </div>

              <button
                type="button"
                aria-label="Close instructions"
                onClick={() =>
                  setShowHelp(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500"
              >
                <X size={18} />
              </button>
            </div>

            {isIOS ? (
              <div className="mt-5 space-y-4">
                <Instruction
                  number="1"
                  text={t("install.iosStep1")}
                />

                <Instruction
                  number="2"
                  text={t("install.iosStep2")}
                />

                <Instruction
                  number="3"
                  text={t("install.iosStep3")}
                />
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <Instruction
                  number="1"
                  text={t(
                    "install.androidStep1"
                  )}
                />

                <Instruction
                  number="2"
                  text={t(
                    "install.androidStep2"
                  )}
                />

                <Instruction
                  number="3"
                  text={t(
                    "install.androidStep3"
                  )}
                />
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                setShowHelp(false)
              }
              className="mt-6 h-11 w-full rounded-xl bg-[#a8441b] text-sm font-bold text-white"
            >
              {t("install.gotIt")}
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          [aria-label="Install Puja Dham"] *,
          [aria-label="Install Puja Dham"] {
            animation-duration: 0.001ms !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </>
  );
}

function Instruction({ number, text }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-[#a8441b]">
        {number}
      </span>

      <p className="pt-1 text-sm leading-6 text-gray-600">
        {text}
      </p>
    </div>
  );
}