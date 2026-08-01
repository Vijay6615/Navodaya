"use client";

import { useLanguage } from "../context/LanguageContext";

export default function MyBookingsLoading() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fffdfb] px-4">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eadfd7] border-t-[#a8441b]" />

        <p className="mt-4 text-sm font-medium text-gray-500">
          {t("myBookings.loading")}
        </p>
      </div>
    </main>
  );
}