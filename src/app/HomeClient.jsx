"use client";

import { useEffect } from "react";

import Hero from "./components/Hero";
import FrostCard from "./components/FrostCard";
import ConsultHero from "./components/ConsultHero";
// import Testimonials from "./components/Testimonials";

export default function HomeClient() {
  useEffect(() => {
    const items = document.querySelectorAll(".fade-up");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            entry.target.classList.add("visible");

            // Element visible hone ke baad observe karna band
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    items.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main>
      <section className="fade-up">
        <Hero />
      </section>

      <section className="fade-up">
        <FrostCard />
      </section>

      <section className="fade-up">
        <ConsultHero />
      </section>

      {/* 
      <section className="fade-up">
        <Testimonials />
      </section>
      */}
    </main>
  );
}