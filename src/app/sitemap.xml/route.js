// src/app/sitemap.xml/route.js

import { PUJAS } from "@/app/pujasData";

const BASE_URL = "https://www.pujadham.co.in";

export const dynamic = "force-static";

export async function GET() {
  const lastModified = new Date().toISOString();

  const staticPages = [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: "1.0",
    },
    {
      url: `${BASE_URL}/pujas`,
      changeFrequency: "weekly",
      priority: "0.9",
    },
    {
      url: `${BASE_URL}/seva`,
      changeFrequency: "weekly",
      priority: "0.8",
    },
    {
      url: `${BASE_URL}/gau-seva`,
      changeFrequency: "weekly",
      priority: "0.8",
    },
    {
      url: `${BASE_URL}/aboutpanditji`,
      changeFrequency: "monthly",
      priority: "0.8",
    },
    {
      url: `${BASE_URL}/gallery`,
      changeFrequency: "monthly",
      priority: "0.7",
    },
    {
      url: `${BASE_URL}/contact`,
      changeFrequency: "monthly",
      priority: "0.7",
    },
  ];

  // Sirf pujasData file mein maujood valid puja pages
  const pujaPages = PUJAS.filter(
    (puja) =>
      puja &&
      typeof puja.slug === "string" &&
      puja.slug.trim() !== ""
  ).map((puja) => ({
    url: `${BASE_URL}/pujas/${puja.slug.trim()}`,
    changeFrequency: "monthly",
    priority: "0.8",
  }));

  // Static pages aur puja pages ko combine karega
  const allPages = [...staticPages, ...pujaPages];

  // Duplicate URLs remove karega
  const uniquePages = Array.from(
    new Map(
      allPages.map((page) => [page.url, page])
    ).values()
  );

  const urlsXml = uniquePages
    .map(
      (page) => `
  <url>
    <loc>${escapeXml(page.url)}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlsXml}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=86400, stale-while-revalidate",
    },
  });
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}