import { PUJAS } from "./pujasData";

const BASE_URL = "https://www.pujadham.co.in";

function getAbsoluteUrl(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  if (
    trimmedValue.startsWith("http://") ||
    trimmedValue.startsWith("https://")
  ) {
    return trimmedValue;
  }

  return `${BASE_URL}${
    trimmedValue.startsWith("/") ? "" : "/"
  }${trimmedValue}`;
}

function createStaticEntry({
  path,
  changeFrequency,
  priority,
  image,
}) {
  const entry = {
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };

  const imageUrl = getAbsoluteUrl(image);

  if (imageUrl) {
    entry.images = [imageUrl];
  }

  return entry;
}

export default function sitemap() {
  const staticPages = [
    createStaticEntry({
      path: "",
      changeFrequency: "weekly",
      priority: 1,
      image: "/Pujadhamlogo1.png",
    }),

    createStaticEntry({
      path: "/pujas",
      changeFrequency: "weekly",
      priority: 0.95,
    }),

    createStaticEntry({
      path: "/gau-seva",
      changeFrequency: "monthly",
      priority: 0.85,
      image: "/images/Gau-Seva.png",
    }),

    createStaticEntry({
      path: "/naam-jaap",
      changeFrequency: "monthly",
      priority: 0.85,
    }),

    createStaticEntry({
      path: "/aboutpanditji",
      changeFrequency: "monthly",
      priority: 0.75,
    }),

    createStaticEntry({
      path: "/gallery",
      changeFrequency: "monthly",
      priority: 0.7,
    }),

    createStaticEntry({
      path: "/contact",
      changeFrequency: "yearly",
      priority: 0.65,
    }),

    // Legal / Policy Pages
    createStaticEntry({
      path: "/privacy-policy",
      changeFrequency: "yearly",
      priority: 0.4,
    }),

    createStaticEntry({
      path: "/refund-policy",
      changeFrequency: "yearly",
      priority: 0.4,
    }),

    createStaticEntry({
      path: "/security",
      changeFrequency: "yearly",
      priority: 0.4,
    }),

    createStaticEntry({
      path: "/terms-and-conditions",
      changeFrequency: "yearly",
      priority: 0.4,
    }),
  ];

  const seenSlugs = new Set();

  const pujaPages = PUJAS.flatMap((puja) => {
    const slug =
      typeof puja?.slug === "string"
        ? puja.slug.trim().replace(/^\/+|\/+$/g, "")
        : "";

    if (!slug || seenSlugs.has(slug)) {
      return [];
    }

    seenSlugs.add(slug);

    const entry = {
      url: `${BASE_URL}/pujas/${encodeURIComponent(slug)}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    };

    const imageUrl = getAbsoluteUrl(puja.image);

    if (imageUrl) {
      entry.images = [imageUrl];
    }

    return [entry];
  });

  return [...staticPages, ...pujaPages];
}