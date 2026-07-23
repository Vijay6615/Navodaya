import HomeClient from "./HomeClient";

const WEBSITE_URL = "https://www.pujadham.co.in";

export const metadata = {
  title: "Puja Dham | Online & Offline Vedic Puja Services",

  description:
    "Book authentic online and offline Vedic pujas with Puja Dham. Get experienced Pandit Ji, astrology consultation, vastu guidance, and spiritual services.",

  keywords: [
    "Puja Dham",
    "Pujadham",
    "PujaDham",
    "online puja booking",
    "offline puja booking",
    "Vedic puja services",
    "Pandit Ji in Mumbai",
    "Pandit Ji in Nalasopara",
    "Pandit Ji in Vasai",
    "Pandit Ji in Virar",
    "astrology consultation",
    "vastu guidance",
    "Ganesh Puja",
    "Satyanarayan Puja",
    "Griha Pravesh Puja",
    "Rudrabhishek Puja",
  ],

  alternates: {
    canonical: WEBSITE_URL,
  },

  openGraph: {
    title: "Puja Dham | Authentic Vedic Puja Services",

    description:
      "Book online and offline Vedic pujas, astrology consultation, vastu guidance, and spiritual services with experienced Pandit Ji.",

    url: WEBSITE_URL,
    siteName: "Puja Dham",

    images: [
      {
        url: "/Pujadhamlogo1.png",
        width: 1200,
        height: 630,
        alt: "Puja Dham Vedic Puja Services",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Puja Dham | Authentic Vedic Puja Services",

    description:
      "Book authentic Vedic pujas, astrology consultation, vastu guidance, and spiritual services with Puja Dham.",

    images: ["/Pujadhamlogo1.png"],
  },
};

export default function Page() {
  return <HomeClient />;
}