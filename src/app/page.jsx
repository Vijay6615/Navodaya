"use client";
import { useEffect } from "react";
import Hero from "./components/Hero";
import FrostCard from "./components/FrostCard";
import ConsultHero from "./components/ConsultHero";
import Testimonials from "./components/Testimonials";

export default function Page() {

useEffect(() => {
  const items = document.querySelectorAll(".fade-up");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");     // ✅ matches your CSS
          entry.target.classList.add("visible");  // ✅ supports both
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach((el) => observer.observe(el));
}, []);


  return (
    <>
      <section className="fade-up">
        <Hero />
      </section>

      <section className="fade-up">
        <FrostCard />
      </section>

      <section className="fade-up">
        <ConsultHero />
      </section>

      <section className="fade-up">
        <Testimonials />
      </section>
    </>
  );
}
