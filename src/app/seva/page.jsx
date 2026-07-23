import Link from "next/link";
import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";

import {
  ArrowRight,
  HeartHandshake,
  Leaf,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const WEBSITE_URL = "https://www.pujadham.co.in";

export const metadata = {
  title: "Seva | Gau Seva and Spiritual Services",

  description:
    "Explore Gau Seva and upcoming spiritual Seva services offered by Puja Dham with devotion, transparency, compassion, and Vedic values.",

  alternates: {
    canonical: `${WEBSITE_URL}/seva`,
  },

  openGraph: {
    title: "Puja Dham Seva | Gau Seva and Spiritual Services",

    description:
      "Perform Gau Seva and explore spiritual Seva opportunities with Puja Dham.",

    url: `${WEBSITE_URL}/seva`,
    siteName: "Puja Dham",
    type: "website",

    images: [
      {
        url: "/images/gau-seva-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Puja Dham Gau Seva",
      },
    ],
  },
};

const sevaServices = [
  {
    title: "Gau Seva",

    subtitle:
      "Serve and care for sacred cows with devotion",

    description:
      "Participate in Gau Seva through Puja Dham and support cow feeding, care, protection, and other compassionate activities performed with faith and transparency.",

    href: "/gau-seva",

    badge: "Available",

    image: "/images/Gau-Seva.png",

    highlights: [
      "Cow feeding and care",
      "Devotional spiritual service",
      "Simple online participation",
    ],
  },
];

export default function SevaPage() {
  return (
    <main className="min-h-screen bg-[#fbf8f5] text-[#29221e]">
      {/* ================================
          HERO SECTION
      ================================= */}
      <section className="relative min-h-[610px] overflow-hidden border-b border-[#eadfd7]">
        {/* Background image */}
        <Image
          src="/images/gouseva.png"
          alt="Puja Dham spiritual Seva"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Image overlays */}
        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/45" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#2b1710]/70 via-transparent to-black/20" />

        {/* Decorative glow */}
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#d97846]/20 blur-3xl" />

        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#a8441b]/20 blur-3xl" />

        {/* Hero content */}
        <div className="relative z-10 mx-auto flex min-h-[610px] max-w-[1280px] items-center px-5 py-20 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white shadow-lg backdrop-blur-md">
              <HeartHandshake
                size={27}
                strokeWidth={1.5}
              />
            </div>

            <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.36em] text-[#f6d6c2]">
              Sacred service with devotion
            </p>

            <h1
              className={`${headingFont.className} mt-4 max-w-3xl text-5xl font-semibold leading-[0.95] text-white sm:text-6xl lg:text-8xl`}
            >
              Puja Dham Seva
            </h1>

            <p className="mt-7 max-w-2xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
              Explore Gau Seva and future spiritual
              Seva opportunities performed with
              compassion, transparency, faith, and
              traditional Vedic values.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <span className="flex items-center gap-2 border border-white/30 bg-white/10 px-4 py-2.5 text-xs text-white backdrop-blur-md">
                <Leaf
                  size={15}
                  className="text-[#f3c4a7]"
                />
                Compassion
              </span>

              <span className="flex items-center gap-2 border border-white/30 bg-white/10 px-4 py-2.5 text-xs text-white backdrop-blur-md">
                <Sparkles
                  size={15}
                  className="text-[#f3c4a7]"
                />
                Devotion
              </span>

              <span className="flex items-center gap-2 border border-white/30 bg-white/10 px-4 py-2.5 text-xs text-white backdrop-blur-md">
                <ShieldCheck
                  size={15}
                  className="text-[#f3c4a7]"
                />
                Transparency
              </span>
            </div>

            <Link
              href="#seva-services"
              className="mt-10 inline-flex h-13 items-center gap-3 bg-[#a8441b] px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#873514]"
            >
              Explore Seva Services
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        {/* Bottom decorative strip */}
        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/15 bg-[#a8441b]/90 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-5 overflow-hidden px-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white sm:gap-10 sm:text-[11px]">
            <span>सेवा परमो धर्मः</span>
            <span className="h-1 w-1 rounded-full bg-white" />
            <span>आपका संकल्प, हमारी सेवा</span>
            <span className="hidden h-1 w-1 rounded-full bg-white sm:block" />
            <span className="hidden sm:block">
              Faith · Compassion · Devotion
            </span>
          </div>
        </div>
      </section>

      {/* ================================
          SEVA SERVICES
      ================================= */}
      <section
        id="seva-services"
        className="mx-auto max-w-[1280px] scroll-mt-28 px-5 py-16 sm:px-8 lg:px-12 lg:py-24"
      >
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#a8441b]">
              Our Seva Services
            </p>

            <h2
              className={`${headingFont.className} mt-3 text-5xl font-semibold leading-none text-[#2b231f] sm:text-6xl`}
            >
              Serve with faith and compassion
            </h2>
          </div>

          {/* <p className="max-w-lg text-sm leading-7 text-[#766961]">
            New Seva services will be added here in
            the future. Every Seva will have a
            dedicated page with complete details and
            participation options.
          </p> */}
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {sevaServices.map((seva) => (
            <article
              key={seva.href}
              className="group overflow-hidden border border-[#e4d8cf] bg-white shadow-[0_18px_55px_rgba(52,34,24,0.07)] transition duration-500 hover:-translate-y-2 hover:border-[#d09a78] hover:shadow-[0_30px_80px_rgba(52,34,24,0.15)]"
            >
              {/* Card image */}
              <div className="relative min-h-[300px] overflow-hidden">
                <Image
                  src={seva.image}
                  alt={seva.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover object-center transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />

                <span className="absolute right-4 top-4 z-10 border border-white/60 bg-white/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a8441b] backdrop-blur-md">
                  {seva.badge}
                </span>

                <div className="absolute bottom-0 left-0 z-10 w-full p-6 text-white">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#f3c4a7]">
                    Puja Dham Seva
                  </p>

                  <h3
                    className={`${headingFont.className} mt-2 text-5xl font-semibold leading-none`}
                  >
                    {seva.title}
                  </h3>
                </div>
              </div>

              {/* Card content */}
              <div className="p-6 sm:p-7">
                <p className="text-sm font-semibold leading-6 text-[#5f4c41]">
                  {seva.subtitle}
                </p>

                <p className="mt-4 text-sm leading-7 text-[#786b64]">
                  {seva.description}
                </p>

                <div className="mt-6 space-y-3 border-t border-[#eee5df] pt-6">
                  {seva.highlights.map(
                    (highlight) => (
                      <div
                        key={highlight}
                        className="flex items-center gap-3 text-xs text-[#584c45]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#a8441b]" />

                        {highlight}
                      </div>
                    )
                  )}
                </div>

                <Link
                  href={seva.href}
                  className="mt-7 flex h-12 items-center justify-between bg-[#a8441b] px-5 text-sm font-semibold text-white transition hover:bg-[#873514]"
                >
                  Explore {seva.title}

                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Future Seva area */}
        <div className="mt-14 border border-dashed border-[#d5bbaa] bg-[#f8f1ec] px-6 py-10 text-center sm:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a8441b]">
            Coming in future
          </p>

          <h3
            className={`${headingFont.className} mt-3 text-4xl font-semibold text-[#302721] sm:text-5xl`}
          >
            More spiritual Seva services
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#786a62]">
            Ann Daan Seva, temple support, education
            support and other meaningful Seva
            opportunities will be added here after
            they are officially launched.
          </p>
        </div>
      </section>
    </main>
  );
}