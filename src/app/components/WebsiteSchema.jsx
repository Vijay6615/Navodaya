// src/app/components/WebsiteSchema.jsx

const BASE_URL = "https://www.pujadham.co.in";

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,

      name: "Puja Dham",
      alternateName: "Puja Dham Services",

      url: BASE_URL,

      logo: {
        "@type": "ImageObject",
        "@id": `${BASE_URL}/#logo`,
        url: `${BASE_URL}/Pujadhamlogo1.png`,
        contentUrl:
          `${BASE_URL}/Pujadhamlogo1.png`,
        caption: "Puja Dham",
      },

      image: {
        "@id": `${BASE_URL}/#logo`,
      },

      description:
        "Puja Dham provides online and home visit Vedic puja services, Gau Seva, Naam Jaap, and spiritual services with experienced Pandit Ji.",

      telephone: "+91 95949 43609",
      email: "pujadham@gmail.com",

      address: {
        "@type": "PostalAddress",
        addressLocality: "Mumbai",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },

      areaServed: {
        "@type": "Country",
        name: "India",
      },

      sameAs: [
        "https://www.instagram.com/puja_dham/",
      ],

      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+91 95949 43609",
          contactType: "customer support",
          areaServed: "IN",
          availableLanguage: [
            "Hindi",
            "English",
          ],
        },
      ],
    },

    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,

      url: BASE_URL,
      name: "Puja Dham",
      alternateName: "Puja Dham Services",

      description:
        "Official website of Puja Dham for online and home visit Vedic puja services.",

      inLanguage: [
        "en-IN",
        "hi-IN",
      ],

      publisher: {
        "@id": `${BASE_URL}/#organization`,
      },
    },
  ],
};

const schemaJson = JSON.stringify(
  schema
).replace(/</g, "\\u003c");

export default function WebsiteSchema() {
  return (
    <script
      id="puja-dham-website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: schemaJson,
      }}
    />
  );
}