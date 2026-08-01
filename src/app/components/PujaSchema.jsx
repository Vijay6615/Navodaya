// src/app/components/PujaSchema.jsx

const BASE_URL = "https://www.pujadham.co.in";

function safeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function getAbsoluteUrl(
  value,
  fallback = BASE_URL
) {
  if (
    !value ||
    typeof value !== "string"
  ) {
    return fallback;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return fallback;
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

function getCleanPrice(price) {
  if (
    price === undefined ||
    price === null ||
    price === ""
  ) {
    return null;
  }

  const cleanedPrice = String(price)
    .replace(/[^\d.]/g, "")
    .trim();

  if (
    !cleanedPrice ||
    Number.isNaN(Number(cleanedPrice))
  ) {
    return null;
  }

  return cleanedPrice;
}

function getServiceType(mode) {
  const normalizedMode =
    typeof mode === "string"
      ? mode.trim().toLowerCase()
      : "";

  if (normalizedMode === "online") {
    return "Online Vedic Puja Service";
  }

  if (
    normalizedMode === "offline" ||
    normalizedMode === "home" ||
    normalizedMode === "home-visit"
  ) {
    return "Home Visit Vedic Puja Service";
  }

  return "Vedic Puja Service";
}

export default function PujaSchema({
  name,
  description,
  image,
  slug,
  mode,
  price,
  currency = "INR",
}) {
  // Name aur slug ke bina valid page URL nahi banega
  if (!name || !slug) {
    return null;
  }

  const cleanSlug = String(slug)
    .trim()
    .replace(/^\/+|\/+$/g, "");

  if (!cleanSlug) {
    return null;
  }

  const pageUrl =
    `${BASE_URL}/pujas/${cleanSlug}`;

  const imageUrl = getAbsoluteUrl(
    image,
    `${BASE_URL}/Pujadhamlogo1.png`
  );

  const cleanPrice = getCleanPrice(price);

  const serviceSchema = {
    "@type": "Service",
    "@id": `${pageUrl}/#service`,

    name: String(name).trim(),

    description:
      typeof description === "string" &&
      description.trim()
        ? description.trim()
        : `${String(name).trim()} service by Puja Dham.`,

    url: pageUrl,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },

    image: imageUrl,

    serviceType: getServiceType(mode),

    provider: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Puja Dham",
      url: BASE_URL,
      telephone: "+91 95949 43609",
    },

    areaServed: {
      "@type": "Country",
      name: "India",
    },

    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: pageUrl,

      availableLanguage: [
        "Hindi",
        "English",
      ],
    },
  };

  // Price tabhi add hoga jab valid price available ho
  if (cleanPrice) {
    serviceSchema.offers = {
      "@type": "Offer",

      url: pageUrl,

      price: cleanPrice,
      priceCurrency: currency,

      availability:
        "https://schema.org/InStock",

      seller: {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "Puja Dham",
      },
    };
  }

  const schema = {
    "@context": "https://schema.org",

    "@graph": [
      serviceSchema,

      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}/#breadcrumb`,

        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: BASE_URL,
          },

          {
            "@type": "ListItem",
            position: 2,
            name: "Pujas",
            item: `${BASE_URL}/pujas`,
          },

          {
            "@type": "ListItem",
            position: 3,
            name: String(name).trim(),
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <script
      id={`puja-schema-${cleanSlug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeJsonLd(schema),
      }}
    />
  );
}