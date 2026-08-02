"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import Hero from "./components/Hero";

function SectionSkeleton({ minHeight = "420px" }) {
  return (
    <div
      aria-hidden="true"
      className="w-full animate-pulse bg-[#fffaf5]"
      style={{ minHeight }}
    >
      <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-5 py-14 sm:px-8">
        <div className="h-3 w-28 rounded-full bg-[#eadfd7]" />
        <div className="mt-5 h-8 w-3/4 max-w-xl rounded-xl bg-[#efe5de]" />
        <div className="mt-4 h-4 w-full max-w-2xl rounded-full bg-[#f2eae4]" />
        <div className="mt-2 h-4 w-5/6 max-w-xl rounded-full bg-[#f2eae4]" />

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 rounded-2xl border border-[#eee4dc] bg-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const FrostCard = dynamic(
  () => import("./components/FrostCard"),
  {
    ssr: false,
    loading: () => (
      <SectionSkeleton minHeight="520px" />
    ),
  }
);

const ConsultHero = dynamic(
  () => import("./components/ConsultHero"),
  {
    ssr: false,
    loading: () => (
      <SectionSkeleton minHeight="460px" />
    ),
  }
);

function LazySection({
  children,
  minHeight,
  rootMargin = "350px 0px",
}) {
  const sectionRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;

    if (!element || shouldRender) return;

    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0.01,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return (
    <section
      ref={sectionRef}
      className="w-full"
      style={{ minHeight }}
    >
      {shouldRender ? (
        children
      ) : (
        <SectionSkeleton minHeight={minHeight} />
      )}
    </section>
  );
}

export default function HomeClient() {
  return (
    <main>
      <section>
        <Hero />
      </section>

      <LazySection minHeight="520px">
        <FrostCard />
      </LazySection>

      <LazySection minHeight="460px">
        <ConsultHero />
      </LazySection>
    </main>
  );
}