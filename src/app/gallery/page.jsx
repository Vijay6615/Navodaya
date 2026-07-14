"use client";

import { useEffect, useRef, useState } from "react";
import { Cormorant_Garamond } from "next/font/google";
import {
  ChevronLeft,
  ChevronRight,
  Images,
  Play,
  Sparkles,
  X,
} from "lucide-react";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const gallery = [
  { type: "image", src: "/gallery/eknath.jpg", title: "Eknath Shinde", desc: "पंडितजी ने विधि-विधान से पूजा कराई और उसके बाद नेता से भेंट कर शुभकामनाएँ एवं आशीर्वाद दिए। यह मुलाक़ात श्रद्धा, सम्मान और सकारात्मक आध्यात्मिक वातावरण को दर्शाती है।" },
  { type: "image", src: "/gallery/dhanashree.jpg", title: "Dhanashree Verma", desc: "पंडितजी ने श्रद्धा के साथ गणेश पूजा कराई और उसके बाद शुभकामनाएँ एवं आशीर्वाद दिए। वातावरण भक्ति और सकारात्मक ऊर्जा से भर गया।" },
  { type: "image", src: "/gallery/shreyash.jpg", title: "Shreyash Iyer", desc: "पंडितजी ने पूर्ण विधि-विधान से श्रेयस अय्यर के यहाँ पूजा कराई और उसके बाद शुभकामनाएँ व आशीर्वाद दिए। वातावरण खुशी और आध्यात्मिक सकारात्मक ऊर्जा से भर गया।" },
  // { type: "video", src: "/videos/ujjain.mp4", title: "Ujjain", desc: "Holy fire ritual with chanting" },
  { type: "image", src: "/gallery/baba.jpg", title: "Baba", desc: "Planetary peace ritual" },
  { type: "image", src: "/gallery/dhanashree2.jpg", title: "Dhanashree Verma", desc: "पंडितजी ने पूर्ण विधि-विधान से पूजा कराई और उसके बाद शुभकामनाएँ व आशीर्वाद दिए। मुलाक़ात स्नेह, सम्मान और आध्यात्मिक वातावरण को दर्शाती है।" },
  { type: "image", src: "/gallery/nehakakkar.jpg", title: "Neha Kakkar", desc: "पंडितजी ने पूर्ण विधि-विधान से नेहा कक्कड़ के यहाँ पूजा कराई और उसके बाद शुभकामनाएँ व आशीर्वाद दिए। वातावरण खुशी और आध्यात्मिक सकारात्मक ऊर्जा से भर गया।" },
  { type: "image", src: "/gallery/random.jpg", title: "TV Star", desc: "Planetary peace ritual" },
  { type: "image", src: "/gallery/dhanashree-father.jpg", title: "Dhanashree Verma Family", desc: "बहुत ही अच्छी और मंगलमय गणेश पूजा संपन्न हुई। पंडितजी ने विधि-विधान से पूजा कराई और सभी को शुभकामनाएँ व आशीर्वाद दिए।" },
  //{ type: "video", src: "/videos/kirtan.mp4", title: "Bhajan & Kirtan", desc: "Devotional chanting ceremony" },
];

export default function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [pageReady, setPageReady] = useState(false);
  const popupRef = useRef(null);

  const selected = selectedIndex !== null ? gallery[selectedIndex] : null;
  const imageCount = gallery.filter((item) => item.type === "image").length;
  const videoCount = gallery.filter((item) => item.type === "video").length;

  const nextItem = () =>
    setSelectedIndex((prev) => (prev + 1) % gallery.length);

  const prevItem = () =>
    setSelectedIndex((prev) =>
      prev === 0 ? gallery.length - 1 : prev - 1
    );

  useEffect(() => {
    const timer = setTimeout(() => setPageReady(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!selected) return;

    document.body.style.overflow = "hidden";

    const handler = (e) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (selected.type === "video") return;
      if (e.key === "ArrowRight") nextItem();
      if (e.key === "ArrowLeft") prevItem();
    };

    window.addEventListener("keydown", handler);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [selectedIndex, selected]);

  useEffect(() => {
    if (!popupRef.current || !selected) return;

    let startX = 0;
    const el = popupRef.current;

    const start = (e) => {
      startX = e.touches[0].clientX;
    };

    const end = (e) => {
      if (selected.type === "video") return;
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 75) nextItem();
      if (endX - startX > 75) prevItem();
    };

    el.addEventListener("touchstart", start);
    el.addEventListener("touchend", end);

    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchend", end);
    };
  }, [selectedIndex, selected]);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#28221f]">
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 top-10 h-[460px] w-[460px] rounded-full bg-[#fff4ed] blur-[115px]" />
          <div className="absolute -right-40 top-[500px] h-[480px] w-[480px] rounded-full bg-[#faf1eb] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-5 py-12 sm:px-8 md:py-16 lg:px-10 lg:py-20">
          <div
            className={`transition-all duration-1000 ease-out ${
              pageReady
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            

            <h1
              className={`${displayFont.className} mx-auto mt-5 max-w-4xl text-center text-[48px] font-semibold leading-[0.94] tracking-[-0.035em] sm:text-6xl lg:text-[80px]`}
            >
              Sacred moments,
              <span className="block text-[#a8441b]">held in memory.</span>
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

          <div className="mt-14 columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3">
            {gallery.map((item, index) => (
              <article
                key={`${item.src}-${index}`}
                onClick={() => setSelectedIndex(index)}
                style={{ animationDelay: `${Math.min(index * 80, 600)}ms` }}
                className={`galleryCard group relative mb-5 break-inside-avoid cursor-pointer overflow-hidden border border-[#eee8e2] bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(66,34,18,0.12)] ${
                  pageReady ? "galleryCardReady" : ""
                }`}
              >
                <div className="relative overflow-hidden bg-[#f5f0ec]">
                  {item.type === "image" ? (
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      className="w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                    />
                  ) : (
                    <video
                      src={item.src}
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                    />
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-md">
                    {item.type === "video" ? (
                      <Play size={16} fill="currentColor" />
                    ) : (
                      <Images size={16} />
                    )}
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a8441b]">
                    {item.type === "video" ? "Sacred Video" : "Divine Moment"}
                  </p>

                  <h2
                    className={`${displayFont.className} mt-2 text-3xl font-semibold leading-none tracking-[-0.02em] text-[#302824]`}
                  >
                    {item.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-[13px] leading-6 text-[#786c65]">
                    {item.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {selected && (
        <div
          className="galleryOverlay fixed inset-0 z-[9999] flex items-center justify-center bg-[#1d120d]/80 p-3 backdrop-blur-md sm:p-6"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            ref={popupRef}
            onClick={(e) => e.stopPropagation()}
            className="galleryViewer relative grid max-h-[92vh] w-full max-w-[1100px] overflow-y-auto bg-white shadow-[0_35px_100px_rgba(0,0,0,0.4)] lg:grid-cols-[1.25fr_0.75fr]"
          >
            <button
              type="button"
              aria-label="Close gallery"
              onClick={() => setSelectedIndex(null)}
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#431407] shadow-lg backdrop-blur-md transition-all duration-300 hover:rotate-90 hover:bg-white"
            >
              <X size={18} />
            </button>

            <div className="relative flex min-h-[360px] items-center justify-center bg-[#17100d] lg:min-h-[650px]">
              {selected.type === "image" ? (
                <img
                  src={selected.src}
                  alt={selected.title}
                  className="max-h-[78vh] w-full object-contain"
                />
              ) : (
                <video
                  src={selected.src}
                  controls
                  autoPlay
                  className="max-h-[78vh] w-full object-contain"
                />
              )}

              {selected.type === "image" && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={prevItem}
                    className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#431407] shadow-lg transition hover:scale-105"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={nextItem}
                    className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#431407] shadow-lg transition hover:scale-105"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            <div className="flex flex-col justify-center bg-[#fffdfb] p-7 sm:p-10 lg:p-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a8441b]">
                {selected.type === "video" ? "Sacred Video" : "Divine Moment"}
              </p>

              <h2
                className={`${displayFont.className} mt-4 text-4xl font-semibold leading-[0.95] tracking-[-0.025em] sm:text-5xl`}
              >
                {selected.title}
              </h2>

              <div className="mt-6 h-px w-12 bg-[#a8441b]/40" />

              <p className="mt-6 text-[14px] leading-7 text-[#71645d]">
                {selected.desc}
              </p>

              <p className="mt-10 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a8441b]">
                Mantra · Vidhi · Aastha
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
          animation: galleryReveal 850ms cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }

        .galleryOverlay {
          animation: galleryOverlayIn 300ms ease-out both;
        }

        .galleryViewer {
          animation: galleryViewerIn 600ms cubic-bezier(0.22, 1, 0.36, 1)
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
            transform: translateY(25px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
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
