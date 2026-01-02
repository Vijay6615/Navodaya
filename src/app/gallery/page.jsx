"use client";

import { useState, useRef, useEffect } from "react";

export default function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const popupRef = useRef(null);

  const gallery = [
    { type: "image", src: "/gallery/eknath.jpg", title: "Eknath Shinde", desc: "पंडितजी ने विधि-विधान से पूजा कराई और उसके बाद नेता से भेंट कर शुभकामनाएँ एवं आशीर्वाद दिए। यह मुलाक़ात श्रद्धा, सम्मान और सकारात्मक आध्यात्मिक वातावरण को दर्शाती है।" },
    { type: "image", src: "/gallery/dhanashree.jpg", title: "Dhanashree Verma", desc: "पंडितजी ने श्रद्धा के साथ गणेश पूजा कराई और उसके बाद शुभकामनाएँ एवं आशीर्वाद दिए। वातावरण भक्ति और सकारात्मक ऊर्जा से भर गया।" },
    { type: "image", src: "/gallery/shreyash.jpg", title: "Shreyash Iyer", desc: "पंडितजी ने पूर्ण विधि-विधान से श्रेयस अय्यर के यहाँ पूजा कराई और उसके बाद शुभकामनाएँ व आशीर्वाद दिए। वातावरण खुशी और आध्यात्मिक सकारात्मक ऊर्जा से भर गया।" },
    { type: "video", src: "/videos/ujjain.mp4", title: "Ujjain", desc: "Holy fire ritual with chanting" },
    { type: "image", src: "/gallery/baba.jpg", title: "Baba", desc: "Planetary peace ritual" },
    { type: "image", src: "/gallery/dhanashree2.jpg", title: "Dhanashree Verma", desc: "पंडितजी ने पूर्ण विधि-विधान से पूजा कराई और उसके बाद शुभकामनाएँ व आशीर्वाद दिए। मुलाक़ात स्नेह, सम्मान और आध्यात्मिक वातावरण को दर्शाती है।" },
    { type: "image", src: "/gallery/nehakakkar.jpg", title: "Neha Kakkar", desc: "पंडितजी ने पूर्ण विधि-विधान से नेहा कक्कड़ के यहाँ पूजा कराई और उसके बाद शुभकामनाएँ व आशीर्वाद दिए। वातावरण खुशी और आध्यात्मिक सकारात्मक ऊर्जा से भर गया।" },
    { type: "image", src: "/gallery/random.jpg", title: "TV Star", desc: "Planetary peace ritual" },
    { type: "image", src: "/gallery/dhanashree-father.jpg", title: "Dhanashree Verma Family", desc: "बहुत ही अच्छी और मंगलमय गणेश पूजा संपन्न हुई। पंडितजी ने विधि-विधान से पूजा कराई और सभी को शुभकामनाएँ व आशीर्वाद दिए।" },
    { type: "video", src: "/videos/kirtan.mp4", title: "Bhajan & Kirtan", desc: "Devotional chanting ceremony" },
  ];

  const selected = selectedIndex !== null ? gallery[selectedIndex] : null;

  const imageCount = gallery.filter(i => i.type === "image").length;
  const videoCount = gallery.filter(i => i.type === "video").length;

  const nextItem = () => setSelectedIndex(prev => (prev + 1) % gallery.length);

  const prevItem = () =>
    setSelectedIndex(prev => (prev === 0 ? gallery.length - 1 : prev - 1));

  // Swipe support
  useEffect(() => {
    if (!popupRef.current) return;

    let startX = 0;

    const start = e => (startX = e.touches[0].clientX);
    const end = e => {
      const endX = e.changedTouches[0].clientX;
      if (!selected || selected.type === "video") return;

      if (startX - endX > 75) nextItem();
      if (endX - startX > 75) prevItem();
    };

    const el = popupRef.current;
    el.addEventListener("touchstart", start);
    el.addEventListener("touchend", end);

    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchend", end);
    };
  }, [selectedIndex, selected]);

  // Keyboard navigation (no arrows for videos)
  useEffect(() => {
    const handler = e => {
      if (!selected) return;

      if (e.key === "Escape") setSelectedIndex(null);

      if (selected.type === "video") return;

      if (e.key === "ArrowRight") nextItem();
      if (e.key === "ArrowLeft") prevItem();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <section className="min-h-screen w-full py-12 px-6 bg-gradient-to-br from-orange-50 via-rose-50 to-yellow-50">

      {/* Title */}
      <div className="text-center mb-10">
        <p className="text-orange-600 font-semibold text-lg">📸 Divine Moments</p>

        <h1 className="text-4xl font-extrabold text-gray-800">
          Puja & Rituals Gallery
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
          Browse beautiful memories of pujas, havans & Vedic rituals.
        </p>

        <p className="mt-2 font-semibold text-gray-700">
          🖼️ {imageCount} Images & 🎥 {videoCount} Videos
        </p>
      </div>

      {/* Masonry layout */}
      <div className="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {gallery.map((item, i) => (
          <div
            key={i}
            onClick={() => setSelectedIndex(i)}
            className="break-inside-avoid rounded-2xl overflow-hidden border bg-white shadow hover:shadow-2xl transition cursor-pointer"
          >
            {item.type === "image" && <img src={item.src} className="w-full object-cover" />}

            {item.type === "video" && (
              <video src={item.src} muted autoPlay loop className="w-full object-cover" />
            )}

            <div className="p-3">
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Popup viewer */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            ref={popupRef}
            onClick={e => e.stopPropagation()}
            className="bg-white p-4 rounded-2xl max-w-3xl w-[95%] max-h-[90vh] overflow-y-auto relative"
          >
            {/* Close */}
            <div
              onClick={() => setSelectedIndex(null)}
              className="absolute right-4 top-2 text-2xl cursor-pointer"
            >
              ✖
            </div>

            {/* 👉 arrows only for IMAGES */}
            {selected.type === "image" && (
              <>
                <div
                  onClick={prevItem}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-3xl cursor-pointer select-none"
                >
                  ‹
                </div>

                <div
                  onClick={nextItem}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-3xl cursor-pointer select-none"
                >
                  ›
                </div>
              </>
            )}

            <div className="mt-6">
              {selected.type === "image" && (
                <img src={selected.src} className="w-full max-h-[55vh] object-contain rounded-xl" />
              )}

              {selected.type === "video" && (
                <video src={selected.src} controls className="w-full max-h-[55vh] object-contain rounded-xl" />
              )}

              <h2 className="text-xl font-bold mt-3">{selected.title}</h2>
              <p className="text-gray-600 mb-3">{selected.desc}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
