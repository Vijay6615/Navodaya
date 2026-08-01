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

const LANGUAGE_STORAGE_KEY = "puja-dham-language";

const LanguageContext = createContext(null);

function getNestedValue(object, path) {
  return path
    .split(".")
    .reduce(
      (current, key) =>
        current && current[key] !== undefined
          ? current[key]
          : undefined,
      object
    );
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] =
    useState("en");

  useEffect(() => {
    const savedLanguage =
      window.localStorage.getItem(
        LANGUAGE_STORAGE_KEY
      );

    if (
      savedLanguage === "en" ||
      savedLanguage === "hi"
    ) {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang =
      language === "hi" ? "hi" : "en";
  }, [language]);

  const setLanguage = useCallback(
    (nextLanguage) => {
      if (
        nextLanguage !== "en" &&
        nextLanguage !== "hi"
      ) {
        return;
      }

      setLanguageState(nextLanguage);

      window.localStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        nextLanguage
      );
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
      const translatedValue = getNestedValue(
        translations[language],
        key
      );

      if (
        typeof translatedValue === "string"
      ) {
        return translatedValue;
      }

      const englishValue = getNestedValue(
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
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}