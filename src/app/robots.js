const BASE_URL = "https://www.pujadham.co.in";

export default function robots() {
  return {
    rules: {
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

        // Legal / Policy Pages
        "/privacy-policy",
        "/refund-policy",
        "/security",
        "/terms-and-conditions",

        // AI crawler information
        "/llms.txt",
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

    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}