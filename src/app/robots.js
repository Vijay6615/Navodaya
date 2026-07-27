// src/app/robots.js

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",

        allow: [
          "/",
          "/pujas",
          "/pujas/",
          "/aboutpanditji",
          "/gau-seva",
          "/naam-jaap",
          "/gallery",
          "/contact",
        ],

        disallow: [
          "/api/",
          "/login",
          "/register",
          "/account",
          "/booking",
          "/my-bookings",
          "/pandit-dashboard",
        ],
      },
    ],

    sitemap: "https://www.pujadham.co.in/sitemap.xml",

    host: "https://www.pujadham.co.in",
  };
}