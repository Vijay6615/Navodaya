"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";

import {
  ChevronLeft,
  ChevronRight,
  Images,
  Play,
  X,
} from "lucide-react";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

/*
  Sirf src ke andar apne Cloudinary URLs paste karo.

  Recommended optimized format:

  https://res.cloudinary.com/b5iu6h89/image/upload/
  f_auto,q_auto:good,c_limit,w_1200/
  v123456789/image-name.jpg
*/

const gallery = [
  {
    type: "image",

    src: "https://res.cloudinary.com/b5iu6h89/image/upload/f_auto,q_auto:good,c_limit,w_1200/v1784868530/eknath_xupkim.jpg",

    title: "Deputy CM of Maharashtra Eknath Shinde",

  },

  {
    type: "image",

    src: "https://res.cloudinary.com/b5iu6h89/image/upload/f_auto,q_auto:good,c_limit,w_1200/v1784868571/guruji_myhvzo.jpg",

    title:
      "Jagadguru Swami Raghavacharya Ji Maharaj",

  },

  {
    type: "image",

    src: "https://res.cloudinary.com/b5iu6h89/image/upload/f_auto,q_auto:good,c_limit,w_1200/v1784868576/dhanashree_ldafxr.jpg",

    title: " Actress Dhanashree Verma",

  },

  {
    type: "image",

    src: "https://res.cloudinary.com/b5iu6h89/image/upload/f_auto,q_auto:good,c_limit,w_1200/v1784868571/shreyash_qeztda.jpg",

    title: "Cricketer Shreyash Iyer",

  },
  {
    type: "image",

    src: "https://res.cloudinary.com/b5iu6h89/image/upload/f_auto,q_auto:good,c_limit,w_1200/v1784892973/hero_pyswfq.jpg",

    title: "Indian actor and politician Suresh Oberoi",

  },
  {
    type: "image",

    src: "https://res.cloudinary.com/b5iu6h89/image/upload/f_auto,q_auto:good,c_limit,w_1200/v1784868572/dhanashree2_mukerp.jpg",

    title: "Acrtess Dhanashree Verma",

  },

  {
    type: "image",

    src: "https://res.cloudinary.com/b5iu6h89/image/upload/f_auto,q_auto:good,c_limit,w_1200/v1784868570/nehakakkar_uuxou1.jpg",

    title: "Singer Neha Kakkar",

  },

  {
    type: "image",

    src: "https://res.cloudinary.com/b5iu6h89/image/upload/f_auto,q_auto:good,c_limit,w_1200/v1784868562/random_lqjymn.jpg",

    title: "TV Star",

  },

  {
    type: "image",

    src: "https://res.cloudinary.com/b5iu6h89/image/upload/v1784868578/dhanashree-father_totc5d.jpg",

    title: "Dhanashree Verma Family",

  },
  {
    type: "image",

    src: "https://res.cloudinary.com/b5iu6h89/image/upload/f_auto,q_auto:good,c_limit,w_1200/v1784892973/group_yawicd.jpg",

    title: "",

  },
  {
    type: "image",

    src: "https://res.cloudinary.com/b5iu6h89/image/upload/f_auto,q_auto:good,c_limit,w_1200/v1784868554/baba_q5gfcq.jpg",

    title: "Divine Blessings",

  },

  /*
  Future video example:

  {
    type: "video",
    src: "https://res.cloudinary.com/your-cloud/video/upload/your-video.mp4",
    title: "Sacred Puja Ceremony",
    desc: "A devotional ceremony performed with authentic Vedic rituals.",
  },
  */
];

export default function GalleryPage() {
  const [selectedIndex, setSelectedIndex] =
    useState(null);

  const [pageReady, setPageReady] =
    useState(false);

  const popupRef = useRef(null);

  const selected =
    selectedIndex !== null
      ? gallery[selectedIndex]
      : null;

  const imageCount = gallery.filter(
    (item) => item.type === "image"
  ).length;

  const videoCount = gallery.filter(
    (item) => item.type === "video"
  ).length;

  const nextItem = () => {
    setSelectedIndex(
      (previousIndex) =>
        (previousIndex + 1) % gallery.length
    );
  };

  const prevItem = () => {
    setSelectedIndex((previousIndex) =>
      previousIndex === 0
        ? gallery.length - 1
        : previousIndex - 1
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageReady(true);
    }, 80);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!selected) return undefined;

    document.body.style.overflow = "hidden";

    const handleKeyboard = (event) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }

      if (selected.type === "video") return;

      if (event.key === "ArrowRight") {
        nextItem();
      }

      if (event.key === "ArrowLeft") {
        prevItem();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, [selectedIndex, selected]);

  useEffect(() => {
    if (!popupRef.current || !selected) {
      return undefined;
    }

    let startX = 0;
    const popupElement = popupRef.current;

    const handleTouchStart = (event) => {
      startX = event.touches[0].clientX;
    };

    const handleTouchEnd = (event) => {
      if (selected.type === "video") return;

      const endX =
        event.changedTouches[0].clientX;

      if (startX - endX > 75) {
        nextItem();
      }

      if (endX - startX > 75) {
        prevItem();
      }
    };

    popupElement.addEventListener(
      "touchstart",
      handleTouchStart
    );

    popupElement.addEventListener(
      "touchend",
      handleTouchEnd
    );

    return () => {
      popupElement.removeEventListener(
        "touchstart",
        handleTouchStart
      );

      popupElement.removeEventListener(
        "touchend",
        handleTouchEnd
      );
    };
  }, [selectedIndex, selected]);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#28221f]">
      <section className="relative">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 top-10 h-[460px] w-[460px] rounded-full bg-[#fff4ed] blur-[115px]" />

          <div className="absolute -right-40 top-[500px] h-[480px] w-[480px] rounded-full bg-[#faf1eb] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-5 py-12 sm:px-8 md:py-16 lg:px-10 lg:py-20">
          {/* Heading */}
          <div
            className={`transition-all duration-1000 ease-out ${
              pageReady
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[#a8441b]">
              Puja Dham Gallery
            </p>

            <h1
              className={`${displayFont.className} mx-auto mt-5 max-w-4xl text-center text-[48px] font-semibold leading-[0.94] tracking-[-0.035em] sm:text-6xl lg:text-[80px]`}
            >
              Sacred moments,

              <span className="block text-[#a8441b]">
                held in memory.
              </span>
            </h1>


            <div className="mt-8 flex items-center justify-center gap-3">
              <span className="rounded-full border border-[#eadfd8] bg-[#fffaf7] px-4 py-2 text-[11px] font-semibold text-[#76675f]">
                {imageCount} Images
              </span>

              <span className="rounded-full border border-[#eadfd8] bg-[#fffaf7] px-4 py-2 text-[11px] font-semibold text-[#76675f]">
                {videoCount} Videos
              </span>
            </div>
          </div>

          {/* Gallery grid */}
          <div className="mt-14 columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3">
            {gallery.map((item, index) => (
              <article
                key={`${item.src}-${index}`}
                onClick={() =>
                  setSelectedIndex(index)
                }
                style={{
                  animationDelay: `${Math.min(
                    index * 80,
                    600
                  )}ms`,
                }}
                className={`galleryCard group relative mb-5 break-inside-avoid cursor-pointer overflow-hidden border border-[#eee8e2] bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(66,34,18,0.12)] ${
                  pageReady
                    ? "galleryCardReady"
                    : ""
                }`}
              >
                <div className="relative overflow-hidden bg-[#f5f0ec]">
                  {item.type === "image" ? (
                    <div className="relative aspect-[4/5] w-full">
                      <Image
                        src={item.src}
                        alt={
                          item.title ||
                          "Puja Dham gallery image"
                        }
                        fill
                        sizes="
                          (max-width: 640px) 100vw,
                          (max-width: 1024px) 50vw,
                          33vw
                        "
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                      />
                    </div>
                  ) : (
                    <video
                      src={item.src}
                      muted
                      autoPlay
                      loop
                      playsInline
                      preload="metadata"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                    />
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-md">
                    {item.type === "video" ? (
                      <Play
                        size={16}
                        fill="currentColor"
                      />
                    ) : (
                      <Images size={16} />
                    )}
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a8441b]">
                    {item.type === "video"
                      ? "Sacred Video"
                      : "Divine Moment"}
                  </p>

                  {item.title && (
                    <h2
                      className={`${displayFont.className} mt-2 text-3xl font-semibold leading-none tracking-[-0.02em] text-[#302824]`}
                    >
                      {item.title}
                    </h2>
                  )}

                  {item.desc && (
                    <p className="mt-3 line-clamp-3 text-[13px] leading-6 text-[#786c65]">
                      {item.desc}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Popup viewer */}
      {selected && (
        <div
          className="galleryOverlay fixed inset-0 z-[9999] flex items-center justify-center bg-[#1d120d]/80 p-3 backdrop-blur-md sm:p-6"
          onClick={() =>
            setSelectedIndex(null)
          }
        >
          <div
            ref={popupRef}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="galleryViewer relative grid max-h-[92vh] w-full max-w-[1100px] overflow-y-auto bg-white shadow-[0_35px_100px_rgba(0,0,0,0.4)] lg:grid-cols-[1.25fr_0.75fr]"
          >
            {/* Close button */}
            <button
              type="button"
              aria-label="Close gallery"
              onClick={() =>
                setSelectedIndex(null)
              }
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#431407] shadow-lg backdrop-blur-md transition-all duration-300 hover:rotate-90 hover:bg-white"
            >
              <X size={18} />
            </button>

            {/* Selected media */}
            <div className="relative flex min-h-[360px] items-center justify-center bg-[#17100d] lg:min-h-[650px]">
              {selected.type === "image" ? (
                <div className="relative h-[70vh] max-h-[720px] min-h-[360px] w-full">
                  <Image
                    src={selected.src}
                    alt={
                      selected.title ||
                      "Puja Dham gallery image"
                    }
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    className="object-contain"
                  />
                </div>
              ) : (
                <video
                  src={selected.src}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[78vh] w-full object-contain"
                />
              )}

              {/* Image navigation */}
              {selected.type === "image" && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={prevItem}
                    className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#431407] shadow-lg transition hover:scale-105 sm:left-4"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={nextItem}
                    className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#431407] shadow-lg transition hover:scale-105 sm:right-4"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Selected media details */}
            <div className="flex flex-col justify-center bg-[#fffdfb] p-7 sm:p-10 lg:p-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a8441b]">
                {selected.type === "video"
                  ? "Sacred Video"
                  : "Divine Moment"}
              </p>

              {selected.title && (
                <h2
                  className={`${displayFont.className} mt-4 text-4xl font-semibold leading-[0.95] tracking-[-0.025em] sm:text-5xl`}
                >
                  {selected.title}
                </h2>
              )}

              <div className="mt-6 h-px w-12 bg-[#a8441b]/40" />

              {selected.desc && (
                <p className="mt-6 text-[14px] leading-7 text-[#71645d]">
                  {selected.desc}
                </p>
              )}

              <p className="mt-10 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a8441b]">
                Mantra · Vidhi · Aastha
              </p>

              <p className="mt-4 text-xs text-[#8b7d75]">
                Image {selectedIndex + 1} of{" "}
                {gallery.length}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .galleryCard {
          opacity: 0;
          transform: translateY(28px);
        }

        .galleryCardReady {
          animation: galleryReveal 850ms
            cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }

        .galleryOverlay {
          animation: galleryOverlayIn 300ms
            ease-out both;
        }

        .galleryViewer {
          animation: galleryViewerIn 600ms
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        @keyframes galleryReveal {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes galleryOverlayIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes galleryViewerIn {
          from {
            opacity: 0;
            transform: translateY(25px)
              scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0)
              scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .galleryCard,
          .galleryCardReady,
          .galleryOverlay,
          .galleryViewer {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}