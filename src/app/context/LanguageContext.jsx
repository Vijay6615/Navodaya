"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { translations } from "../data/translations";

const LANGUAGE_STORAGE_KEY =
  "puja-dham-language";

const SUPPORTED_LANGUAGES = new Set([
  "en",
  "hi",
]);

const LanguageContext = createContext(null);

function getNestedValue(object, path) {
  return String(path)
    .split(".")
    .reduce(
      (current, key) =>
        current &&
        current[key] !== undefined
          ? current[key]
          : undefined,
      object
    );
}

function isSupportedLanguage(value) {
  return SUPPORTED_LANGUAGES.has(value);
}

export function LanguageProvider({
  children,
}) {
  const [language, setLanguageState] =
    useState("en");

  useEffect(() => {
    try {
      const savedLanguage =
        window.localStorage.getItem(
          LANGUAGE_STORAGE_KEY
        );

      if (isSupportedLanguage(savedLanguage)) {
        setLanguageState(savedLanguage);
      }
    } catch (error) {
      console.warn(
        "Saved language could not be read:",
        error
      );
    }
  }, []);

  useEffect(() => {
    const htmlElement =
      document.documentElement;

    htmlElement.lang =
      language === "hi" ? "hi" : "en";

    htmlElement.dir = "ltr";
  }, [language]);

  const setLanguage = useCallback(
    (nextLanguage) => {
      if (!isSupportedLanguage(nextLanguage)) {
        return;
      }

      setLanguageState((currentLanguage) =>
        currentLanguage === nextLanguage
          ? currentLanguage
          : nextLanguage
      );

      try {
        window.localStorage.setItem(
          LANGUAGE_STORAGE_KEY,
          nextLanguage
        );
      } catch (error) {
        console.warn(
          "Selected language could not be saved:",
          error
        );
      }
    },
    []
  );

  const toggleLanguage = useCallback(() => {
    setLanguage(
      language === "en" ? "hi" : "en"
    );
  }, [language, setLanguage]);

  const t = useCallback(
    (key, fallback = key) => {
      const translatedValue =
        getNestedValue(
          translations[language],
          key
        );

      if (
        typeof translatedValue === "string"
      ) {
        return translatedValue;
      }

      const englishValue =
        getNestedValue(
          translations.en,
          key
        );

      return typeof englishValue === "string"
        ? englishValue
        : fallback;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      isHindi: language === "hi",
      setLanguage,
      toggleLanguage,
      t,
    }),
    [
      language,
      setLanguage,
      toggleLanguage,
      t,
    ]
  );

  return (
    <LanguageContext.Provider
      value={value}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context =
    useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}