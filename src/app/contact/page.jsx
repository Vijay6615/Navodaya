"use client";

import { useEffect } from "react";
import ContactSection from "../components/ContactSection";

export default function ContactPage() {

  useEffect(() => {
    const items = document.querySelectorAll(".fade-up");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    items.forEach((el) => observer.observe(el));
  }, []);

  return (
    <section className="page-section">

      <h1 className="page-title fade-up">
        Contact Panditji
      </h1>

      <p className="page-subtitle fade-up">
        Get in touch for puja bookings, consultations & queries
      </p>

      {/* Entire contact component animated */}
      <div className="fade-up">
        <ContactSection />
      </div>

    </section>
  );
}
