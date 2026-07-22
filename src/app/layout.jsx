import "../styles/globals.css";
import Providers from "./providers";
import AppShell from "./components/AppShell";

const WEBSITE_URL = "https://www.pujadham.co.in";
const INSTAGRAM_URL = "https://www.instagram.com/puja_dham/";

export const metadata = {
  metadataBase: new URL(WEBSITE_URL),

  title: {
    default: "Puja Dham | Online & Offline Vedic Puja Services",
    template: "%s | Puja Dham",
  },

  description:
    "Experience authentic Vedic pujas with Puja Dham. Book online and offline puja services, astrology consultations, vastu guidance, and spiritual services with experienced Pandit Ji.",

  keywords: [
    "Puja Dham",
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
        url: "/og-pujadham.jpg",
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
    icon: "/Pujadhamlogo1.png",
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

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Puja Dham",
    url: WEBSITE_URL,
    logo: `${WEBSITE_URL}/Pujadhamlogo1.png`,

    description:
      "Puja Dham provides online and offline Vedic puja services, astrology consultations, vastu guidance, and spiritual services.",

    sameAs: [INSTAGRAM_URL],
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(
              /</g,
              "\\u003c"
            ),
          }}
        />

        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}