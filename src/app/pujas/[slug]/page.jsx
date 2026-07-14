import { PUJAS } from "../../pujasData";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PujaDetail({ params }) {
  const { slug } = await params;

  const puja = PUJAS.find(
    (p) => p?.slug?.toLowerCase() === slug?.toLowerCase()
  );

  if (!puja) return notFound();

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      <section className="w-full max-w-[1180px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 pt-6 md:pt-10 pb-20">
        {/* BACK */}
        <div className="mb-5 animate-[fadeUp_.6s_ease-out]">
          <Link
            href="/pujas"
            className="
              inline-flex items-center gap-2
              text-[13px] font-semibold
              text-gray-500
              transition-all duration-300
              hover:text-[#a8441b]
              hover:-translate-x-1
            "
          >
            <span>←</span>
            Back to Pujas
          </Link>
        </div>

        {/* MAIN CARD */}
        <div
          className="
            grid
            lg:grid-cols-[1.05fr_.95fr]
            bg-white
            border border-gray-100
            rounded-[28px]
            md:rounded-[36px]
            overflow-hidden
            shadow-[0_20px_60px_rgba(60,30,10,0.08)]
            animate-[detailReveal_.8s_cubic-bezier(.22,1,.36,1)]
          "
        >
          {/* IMAGE */}
          <div className="relative min-h-[300px] sm:min-h-[420px] lg:min-h-[620px] overflow-hidden group">
            <img
              src={puja.image}
              alt={puja.name}
              className="
                absolute inset-0
                w-full h-full
                object-cover
                transition-transform
                duration-[1200ms]
                ease-out
                group-hover:scale-[1.04]
              "
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

            <span
              className="
                absolute
                top-5 left-5
                rounded-full
                bg-white/90
                backdrop-blur-md
                px-4 py-2
                text-[11px]
                font-bold
                tracking-wide
                text-[#a8441b]
                shadow-sm
              "
            >
              {puja.category}
            </span>

            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
              <span className="text-[12px] font-medium">
                Authentic Vedic Puja
              </span>

              <span className="text-[12px] font-medium">
                ◷ {puja.duration}
              </span>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center">
            <div className="animate-[fadeUp_.7s_.15s_both]">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a8441b]">
                Sacred Puja Service
              </span>

              <h1
                className="
                  mt-3
                  text-[32px]
                  sm:text-[40px]
                  lg:text-[48px]
                  leading-[1.08]
                  font-extrabold
                  tracking-[-0.035em]
                  text-[#252525]
                "
              >
                {puja.name}
              </h1>

              <p className="mt-5 text-[15px] md:text-[16px] leading-7 text-gray-500">
                {puja.shortDescription}
              </p>
            </div>

            {/* PUJA OPTIONS */}
            <div className="mt-8 space-y-3 animate-[fadeUp_.7s_.25s_both]">
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-gray-400">
                Puja Options
              </p>

              {/* ONLINE */}
              {puja.onlineAvailable && (
                <div
                  className="
                    group
                    rounded-2xl
                    border border-orange-100
                    bg-[#fffaf6]
                    p-4 md:p-5
                    transition-all duration-300
                    hover:border-[#a8441b]/30
                    hover:shadow-[0_12px_30px_rgba(168,68,27,0.08)]
                    hover:-translate-y-1
                  "
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[14px] font-bold text-[#252525]">
                        Online Puja
                      </p>

                      <p className="mt-1 text-[12px] text-gray-500">
                        Puja performed on your behalf
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[20px] font-extrabold text-[#a8441b]">
                        {puja.onlinePrice}
                      </p>

                      {puja.offlinePrice && (
                        <p className="text-[11px] text-gray-400 line-through">
                          {puja.offlinePrice}
                        </p>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/booking?puja=${encodeURIComponent(
                      puja.name
                    )}&type=online&price=${encodeURIComponent(
                      puja.onlinePrice
                    )}`}
                    className="
                      mt-4
                      flex
                      h-11
                      w-full
                      items-center
                      justify-center
                      rounded-full
                      bg-[#a8441b]
                      text-[13px]
                      font-semibold
                      text-white
                      transition-all
                      duration-300
                      hover:bg-[#873515]
                      hover:shadow-[0_12px_25px_rgba(168,68,27,0.25)]
                      active:scale-[0.98]
                    "
                  >
                    Book Online Puja
                  </Link>
                </div>
              )}

              {/* OFFLINE */}
              {puja.offlineAvailable && (
                <div
                  className="
                    group
                    rounded-2xl
                    border border-gray-200
                    bg-white
                    p-4 md:p-5
                    transition-all duration-300
                    hover:border-[#a8441b]/30
                    hover:shadow-[0_12px_30px_rgba(60,30,10,0.07)]
                    hover:-translate-y-1
                  "
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[14px] font-bold text-[#252525]">
                        Offline Puja
                      </p>

                      <p className="mt-1 text-[12px] text-gray-500">
                        Puja performed at your location
                      </p>
                    </div>

                    <p className="text-[20px] font-extrabold text-[#a8441b]">
                      {puja.offlinePrice}
                    </p>
                  </div>

                  <Link
                    href={`/booking?puja=${encodeURIComponent(
                      puja.name
                    )}&type=offline&price=${encodeURIComponent(
                      puja.offlinePrice
                    )}`}
                    className="
                      mt-4
                      flex
                      h-11
                      w-full
                      items-center
                      justify-center
                      rounded-full
                      border border-[#a8441b]
                      text-[13px]
                      font-semibold
                      text-[#a8441b]
                      transition-all
                      duration-300
                      hover:bg-[#a8441b]
                      hover:text-white
                      active:scale-[0.98]
                    "
                  >
                    Book Offline Puja
                  </Link>
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            {puja.description && (
              <div className="mt-8 pt-7 border-t border-gray-100 animate-[fadeUp_.7s_.35s_both]">
                <h2 className="text-[14px] font-bold text-[#252525]">
                  About this Puja
                </h2>

                <p className="mt-3 text-[13px] md:text-[14px] leading-6 text-gray-500">
                  {puja.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes detailReveal {
          from {
            opacity: 0;
            transform: translateY(28px) scale(.985);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}