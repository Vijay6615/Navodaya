"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Download,
  MoreVertical,
  Share,
  Smartphone,
  X,
} from "lucide-react";

export default function InstallPujaDham() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    const iosDevice =
      /iphone|ipad|ipod/i.test(
        window.navigator.userAgent
      ) && !window.MSStream;

    setIsInstalled(standalone);
    setIsIOS(iosDevice);

    // Har fresh website visit/page reload par card turant dikhega.
    if (!standalone) {
      setShowBanner(true);
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);

      // Browser install event ready hote hi banner visible rakho.
      setShowBanner(true);
    };

    const handleAppInstalled = () => {
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
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled
      );
    };
  }, []);

  const handleInstall = useCallback(async () => {
    // iPhone/iPad me browser ka native JS install prompt nahi hota.
    if (isIOS) {
      setShowBanner(true);
      setShowHelp(true);
      return;
    }

    // Chrome/Edge ka real install prompt ready hai.
    if (deferredPrompt) {
      await deferredPrompt.prompt();

      const choice = await deferredPrompt.userChoice;

      if (choice.outcome === "accepted") {
        setIsInstalled(true);
        setShowBanner(false);
      }

      // Ek event instance ko sirf ek baar use kiya ja sakta hai.
      setDeferredPrompt(null);
      return;
    }

    // Browser prompt ready/supported na ho to manual steps dikhao.
    setShowBanner(true);
    setShowHelp(true);
  }, [deferredPrompt, isIOS]);

  useEffect(() => {
    const handleNavbarInstall = () => {
      if (isInstalled) {
        return;
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
  }, [handleInstall, isInstalled]);

  const closeBanner = () => {
    // Sirf current open visit ke liye close hoga.
    // Next full website visit/reload par phir dikhega.
    setShowBanner(false);
    setShowHelp(false);
  };

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
          onClick={closeBanner}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={17} />
        </button>

        <div className="flex items-center gap-3 pr-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-orange-100 bg-orange-50">
            <img
              src="/icons/icon-192.png"
              alt="Puja Dham"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[15px] font-extrabold text-[#2b160d]">
              Install Puja Dham
            </p>

            <p className="mt-1 text-[11px] leading-4 text-gray-500">
              Quick access ke liye Puja Dham ko apne
              home screen par add karein.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleInstall}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#a8441b] px-4 text-xs font-bold text-white transition hover:bg-[#873514] active:scale-[0.98]"
        >
          <Download size={16} />
          Install Puja Dham
        </button>

        <button
          type="button"
          onClick={closeBanner}
          className="mt-2 h-9 w-full rounded-xl text-[11px] font-semibold text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
        >
          Not now
        </button>
      </section>

      {showHelp && (
        <div
          className="fixed inset-0 z-[150] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone
                  size={20}
                  className="text-[#a8441b]"
                />

                <h3 className="text-base font-bold text-[#2b160d]">
                  Install Puja Dham
                </h3>
              </div>

              <button
                type="button"
                aria-label="Close instructions"
                onClick={() => setShowHelp(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500"
              >
                <X size={18} />
              </button>
            </div>

            {isIOS ? (
              <div className="mt-5 space-y-4">
                <Instruction
                  number="1"
                  text={
                    <>
                      Safari ka{" "}
                      <strong className="inline-flex items-center gap-1 text-gray-800">
                        Share <Share size={15} />
                      </strong>{" "}
                      button tap karo.
                    </>
                  }
                />

                <Instruction
                  number="2"
                  text={
                    <>
                      <strong className="text-gray-800">
                        Add to Home Screen
                      </strong>{" "}
                      select karo.
                    </>
                  }
                />

                <Instruction
                  number="3"
                  text={
                    <>
                      Upar right side ka{" "}
                      <strong className="text-gray-800">
                        Add
                      </strong>{" "}
                      button tap karo.
                    </>
                  }
                />
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <Instruction
                  number="1"
                  text={
                    <>
                      Chrome ka{" "}
                      <strong className="inline-flex items-center gap-1 text-gray-800">
                        Menu <MoreVertical size={15} />
                      </strong>{" "}
                      open karo.
                    </>
                  }
                />

                <Instruction
                  number="2"
                  text={
                    <>
                      <strong className="text-gray-800">
                        Install app
                      </strong>{" "}
                      ya{" "}
                      <strong className="text-gray-800">
                        Add to Home screen
                      </strong>{" "}
                      select karo.
                    </>
                  }
                />

                <Instruction
                  number="3"
                  text={
                    <>
                      Confirmation me{" "}
                      <strong className="text-gray-800">
                        Install
                      </strong>{" "}
                      dabao.
                    </>
                  }
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="mt-6 h-11 w-full rounded-xl bg-[#a8441b] text-sm font-bold text-white"
            >
              Got it
            </button>
          </div>
        </div>
      )}
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