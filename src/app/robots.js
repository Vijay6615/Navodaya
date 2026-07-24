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
          "/seva",
          "/gallery",
          "/contact",
        ],

        disallow: [
          "/api/",
          "/login",
          "/booking",
          "/my-bookings",
          "/pandit-dashboard",
        ],
      },
    ],

    sitemap:
      "https://www.pujadham.co.in/sitemap.xml",

    host: "https://www.pujadham.co.in",
  };
}