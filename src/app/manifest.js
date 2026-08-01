// src/app/manifest.js

export default function manifest() {
  return {
    id: "/",

    name: "Puja Dham",
    short_name: "Puja Dham",

    description:
      "Book authentic online and home visit Vedic puja services, Gau Seva, Naam Jaap, astrology consultations, vastu guidance, and spiritual services with Puja Dham.",

    start_url: "/",
    scope: "/",

    display: "standalone",

    background_color: "#fff7ed",
    theme_color: "#a8441b",

    orientation: "portrait-primary",

    lang: "en-IN",
    dir: "ltr",

    categories: [
      "lifestyle",
      "services",
    ],

    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],

    shortcuts: [
      {
        name: "All Pujas",
        short_name: "Pujas",
        description:
          "Browse all available Vedic puja services.",
        url: "/pujas?mode=all",
      },
      {
        name: "Gau Seva",
        short_name: "Gau Seva",
        description:
          "View Gau Seva details.",
        url: "/gau-seva",
      },
      {
        name: "Naam Jaap",
        short_name: "Naam Jaap",
        description:
          "View Naam Jaap services.",
        url: "/naam-jaap",
      },
      {
        name: "Contact Us",
        short_name: "Contact",
        description:
          "Contact Puja Dham for puja-related assistance.",
        url: "/contact",
      },
    ],

    prefer_related_applications: false,
  };
}