import "../styles/globals.css";
import Providers from "./providers";
import AppShell from "./components/AppShell";
import WebsiteSchema from "./components/WebsiteSchema";
import { LanguageProvider } from "./context/LanguageContext";
import { GoogleAnalytics } from "@next/third-parties/google";

const WEBSITE_URL = "https://www.pujadham.co.in";
const INSTAGRAM_URL = "https://www.instagram.com/puja_dham/";
const LOGO_URL = `${WEBSITE_URL}/Pujadhamlogo1.png`;

export const metadata = {
  metadataBase: new URL(WEBSITE_URL),

  title: {
    default: "Puja Dham | Online & Offline Vedic Puja Services",
    template: "%s | Puja Dham",
  },

  description:
    "Experience authentic Vedic pujas with Puja Dham. Book online and offline puja services, astrology consultations, vastu guidance, and spiritual services with experienced Pandit Ji.",

  keywords: [
    "puja dham",
    "Puja Dham",
    "Pujadham",
    "PujaDham",
    "Online puja",
    "Offline puja",
    "Vedic puja",
    "astrology services",
    "vastu services",
    "spiritual services",
    "online puja booking",
    "offline puja booking",
    "Pandit Ji in Mumbai",
    "Vedic puja services",
    "astrology consultation",
    "vastu guidance",
    "Griha Pravesh Puja",
    "Satyanarayan Puja",
    "Ganesh Puja",
    "Rudrabhishek Puja",
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

  openGraph: {
    title: "Puja Dham | Online & Offline Vedic Puja Services",

    description:
      "Experience authentic Vedic pujas with Puja Dham. Book online and offline puja services, astrology consultations, vastu guidance, and spiritual services.",

    url: WEBSITE_URL,
    siteName: "Puja Dham",

    images: [
      {
        url: "/Pujadhamlogo1.png",
        width: 1200,
        height: 630,
        alt: "Puja Dham - Online and Offline Vedic Puja Services",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Puja Dham | Online & Offline Vedic Puja Services",

    description:
      "Book authentic Vedic pujas, astrology consultations, vastu guidance, and spiritual services with Puja Dham.",

    images: ["/Pujadhamlogo1.png"],
  },

  icons: {
    icon: [
      {
        url: "/Pujadhamlogo1.png",
        type: "image/png",
      },
    ],

    shortcut: "/Pujadhamlogo1.png",
    apple: "/Pujadhamlogo1.png",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  other: {
    "instagram:creator": "@puja_dham",
    "instagram:url": INSTAGRAM_URL,
  },

  category: "Religious Services",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",

  name: "Puja Dham",

  alternateName: [
    "Pujadham",
    "PujaDham",
  ],

  url: WEBSITE_URL,

  description:
    "Puja Dham is an online and offline Vedic puja booking platform offering authentic puja services, astrology consultation, vastu guidance, and spiritual services.",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",

  name: "Puja Dham",
  alternateName: "Pujadham",

  url: WEBSITE_URL,
  logo: LOGO_URL,
  image: LOGO_URL,

  description:
    "Puja Dham provides online and offline Vedic puja services, astrology consultations, vastu guidance, and spiritual services with experienced Pandit Ji.",

  sameAs: [
    INSTAGRAM_URL,
  ],

  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: [
      "Hindi",
      "English",
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Reusable Puja Dham website schema component */}
        <WebsiteSchema />

        {/* Website schema for Google brand/site name */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(
              /</g,
              "\\u003c"
            ),
          }}
        />

        {/* Organization schema for logo and Instagram */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(
              /</g,
              "\\u003c"
            ),
          }}
        />

        <LanguageProvider>
          <Providers>
            <AppShell>{children}</AppShell>
          </Providers>
        </LanguageProvider>

        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics
            gaId={
              process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
            }
          />
        )}
      </body>
    </html>
  );
}