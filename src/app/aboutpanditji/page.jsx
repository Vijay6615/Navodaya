"use client";

import { useEffect } from "react";

export default function AboutPanditjiPage() {
  useEffect(() => {
    const items = document.querySelectorAll(".fade-up");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.2 }
    );

    items.forEach((el) => observer.observe(el));

    return () => observer.disconnect(); // ✅ cleanup
  }, []);

  return (
    <section className="page-section premium-bg">

      {/* ✨ Title Section */}
      <div className="title-wrap fade-up">
        <p className="subtitle">About Our Guruji</p>
        <h1 className="page-title-gradient">Meet Our Panditji</h1>
        <p className="title-desc">
          Traditional rituals performed with devotion, authenticity, and precision.
        </p>
      </div>

      <div className="about-card two-col">

        {/* LEFT IMAGE */}
        <div className="meet-photo-wrap fade-up">
          <img src="/panditji.jpg" alt="Panditji" className="meet-photo premium-shadow" />
        </div>

        {/* RIGHT CONTENT */}
        <div className="meet-info">

          <h2 className="meet-name fade-up">Pt. Jayprakash Shukla</h2>

          <div className="verified-badges fade-up">
            <span className="badge">📜 Government Registered</span>
            <span className="badge">🛕 Vedic Certified Priest</span>
            <span className="badge">✔️ Trustworthy & Experienced</span>
          </div>

          <p className="meet-role fade-up">Certified Vedic Scholar & Pujari</p>

          {/* 🔢 Stats */}
          <div className="meet-stats premium-stats fade-up">
            <div>
              <span className="stat-number">20+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div>
              <span className="stat-number">15k+</span>
              <span className="stat-label">Pujas Performed</span>
            </div>
            <div>
              <span className="stat-number">4.9★</span>
              <span className="stat-label">Client Rating</span>
            </div>
          </div>

          {/* TEXT */}
          <p className="meet-text fade-up">
            With over 20 years of dedicated service in performing authentic
            Vedic rituals, Panditji brings sacred traditions to your home with
            devotion, pure vidhi-vidhan, and deep scriptural knowledge.
          </p>

          {/* ⭐ Specializations */}
          <h3 className="section-title fade-up">Specializations</h3>
          <div className="ap-tags fade-up">
            {[
              "Vedic Rituals",
              "Havan",
              "Vastu Puja",
              "Navagraha Shanti",
              "Mahamrityunjay Jaap",
            ].map((t) => (
              <span key={t} className="ap-tag premium-tag">{t}</span>
            ))}
          </div>

          {/* 🌐 Languages */}
          <h3 className="section-title fade-up">Languages Spoken</h3>
          <div className="ap-tags fade-up">
            {["Hindi", "Marathi", "English", "Sanskrit"].map((t) => (
              <span key={t} className="ap-tag">{t}</span>
            ))}
          </div>

          {/* 🛕 Services */}
          <h3 className="section-title fade-up">Services Offered</h3>
          <ul className="ap-list fade-up">
            <li>All types of Vedic pujas & havans</li>
            <li>Muhurta & horoscope consultation</li>
            <li>Vastu consultation for home & office</li>
            <li>Jaap & Anushthan</li>
          </ul>

          {/* 🎓 Qualifications */}
          <h3 className="section-title fade-up">Qualifications</h3>
          <ul className="ap-list fade-up">
            <li>M.A. in Sanskrit</li>
            <li>Certified from Varanasi Sanskrit University</li>
            <li>10+ years temple service</li>
            <li>Trained in all major puja traditions</li>
          </ul>

          {/* CTA BUTTONS */}
          
        </div>
      </div>
    </section>
  );
}
