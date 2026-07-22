// src/app/sitemap.js

import { PUJAS } from "./pujasData";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://www.pujadham.co.in";

export default function sitemap() {
  const currentDate = new Date();

  // Public static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/pujas`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/aboutpanditji`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Only existing active pujas from pujasData.js
  const pujaPages = PUJAS.filter(
    (puja) =>
      puja &&
      typeof puja.slug === "string" &&
      puja.slug.trim() !== ""
  ).map((puja) => ({
    url: `${BASE_URL}/pujas/${puja.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...pujaPages];
}