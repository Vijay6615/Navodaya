import HomeClient from "./HomeClient";

const WEBSITE_URL = "https://www.pujadham.co.in";
const LOGO_URL =
  "https://www.pujadham.co.in/Pujadhamlogo1.png";

export const metadata = {
  title:
    "Puja Dham | Online Puja Booking & Pandit Ji in Mumbai",

  description:
    "Book experienced Pandit Ji for authentic online and offline Vedic Puja services in Mumbai, Nalasopara, Vasai and Virar. Satyanarayan Puja, Griha Pravesh, Rudrabhishek, astrology and Vastu guidance available.",

  keywords: [
    "Puja Dham",
    "Pujadham",
    "online puja booking",
    "online pandit booking",
    "Pandit Ji in Mumbai",
    "Pandit Ji in Nalasopara",
    "Pandit Ji in Vasai",
    "Pandit Ji in Virar",
    "Vedic Puja services",
    "Satyanarayan Puja booking",
    "Griha Pravesh Puja",
    "Rudrabhishek Puja",
    "Ganesh Puja",
    "astrology consultation Mumbai",
    "Vastu consultation Mumbai",
    "Hindu priest booking",
    "online Puja India",
  ],

  authors: [
    {
      name: "Puja Dham",
      url: WEBSITE_URL,
    },
  ],

  creator: "Puja Dham",
  publisher: "Puja Dham",

  alternates: {
    canonical: WEBSITE_URL,
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title:
      "Online Puja Booking & Pandit Ji in Mumbai | Puja Dham",

    description:
      "Book experienced Pandit Ji for online and offline Vedic Puja services, astrology consultation and Vastu guidance.",

    url: WEBSITE_URL,
    siteName: "Puja Dham",

    images: [
      {
        url: LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Puja Dham online Vedic Puja booking services",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Online Puja Booking & Pandit Ji | Puja Dham",

    description:
      "Book authentic online and offline Vedic Puja services with experienced Pandit Ji.",

    images: [LOGO_URL],
  },

  category: "Religious Services",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",

  "@id": `${WEBSITE_URL}/#organization`,

  name: "Puja Dham",
  alternateName: [
    "Pujadham",
    "PujaDham",
  ],

  url: WEBSITE_URL,
  logo: {
    "@type": "ImageObject",
    url: LOGO_URL,
  },

  image: LOGO_URL,

  description:
    "Puja Dham provides authentic online and offline Vedic Puja services, experienced Pandit Ji booking, astrology consultation and Vastu guidance.",

  areaServed: [
    {
      "@type": "City",
      name: "Mumbai",
    },
    {
      "@type": "Place",
      name: "Nalasopara",
    },
    {
      "@type": "Place",
      name: "Vasai",
    },
    {
      "@type": "Place",
      name: "Virar",
    },
    {
      "@type": "Country",
      name: "India",
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",

  "@id": `${WEBSITE_URL}/#website`,

  name: "Puja Dham",
  alternateName: "Pujadham",
  url: WEBSITE_URL,

  description:
    "Online and offline Vedic Puja booking platform with experienced Pandit Ji.",

  publisher: {
    "@id": `${WEBSITE_URL}/#organization`,
  },

  inLanguage: [
    "en-IN",
    "hi-IN",
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",

  "@id": `${WEBSITE_URL}/#puja-service`,

  name:
    "Online and Offline Vedic Puja Services",

  serviceType:
    "Vedic Puja and Pandit Ji Booking Services",

  description:
    "Book experienced Pandit Ji for Satyanarayan Puja, Griha Pravesh Puja, Rudrabhishek Puja, Ganesh Puja, astrology consultation and Vastu guidance.",

  url: WEBSITE_URL,

  provider: {
    "@id": `${WEBSITE_URL}/#organization`,
  },

  areaServed: [
    {
      "@type": "City",
      name: "Mumbai",
    },
    {
      "@type": "Place",
      name: "Nalasopara",
    },
    {
      "@type": "Place",
      name: "Vasai",
    },
    {
      "@type": "Place",
      name: "Virar",
    },
    {
      "@type": "Country",
      name: "India",
    },
  ],

  availableChannel: [
    {
      "@type": "ServiceChannel",
      serviceUrl:
        `${WEBSITE_URL}/pujas`,
      name: "Online Puja Booking",
    },
    {
      "@type": "ServiceChannel",
      serviceUrl:
        `${WEBSITE_URL}/contact`,
      name: "Offline Puja Booking",
    },
  ],
};

const structuredData = {
  "@context": "https://schema.org",

  "@graph": [
    organizationSchema,
    websiteSchema,
    serviceSchema,
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            structuredData
          ).replace(/</g, "\\u003c"),
        }}
      />

      <HomeClient />
    </>
  );
}