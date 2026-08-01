"use client";

import { useLanguage } from "../context/LanguageContext";

export default function LanguageSwitcher() {
  const {
    language,
    setLanguage,
    t,
  } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Website language"
      className="flex h-9 shrink-0 items-center rounded-full border border-[#e8ddd5] bg-[#fffaf6] p-0.5 shadow-sm"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        title={t(
          "language.switchToEnglish"
        )}
        className={`flex h-7 min-w-[34px] items-center justify-center rounded-full px-2 text-[10px] font-bold transition ${
          language === "en"
            ? "bg-[#a8441b] text-white"
            : "text-[#62564f] hover:text-[#a8441b]"
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLanguage("hi")}
        aria-pressed={language === "hi"}
        title={t(
          "language.switchToHindi"
        )}
        className={`flex h-7 min-w-[42px] items-center justify-center rounded-full px-2 text-[11px] font-bold transition ${
          language === "hi"
            ? "bg-[#a8441b] text-white"
            : "text-[#62564f] hover:text-[#a8441b]"
        }`}
      >
        हिंदी
      </button>
    </div>
  );
}