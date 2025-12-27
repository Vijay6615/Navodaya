"use client";
import { useRouter } from "next/navigation";

export default function ConsultHero() {
  const router = useRouter();

  return (
    <section className="consult-hero">

      <div className="consult-left">
        <span className="tagline">
          🕉️ Peace, Prosperity & Divine Blessings
        </span>

        <h1 className="consult-title">
          Perform Sacred <span className="highlight">Vedic Pujas</span> <br />
          for your well-being
        </h1>

        <p className="consult-desc">
          Experience authentic rituals performed by Pt. Jayprakash Shukla,
          adhering to ancient Vedic traditions.
        </p>

        <div className="consult-buttons">

          {/* CONTACT PAGE OPEN */}
          <button
            className="btn-primary"
            onClick={() => router.push("/contact")}
          >
            Book a Consultation
          </button>

          {/* PUJA PAGE OPEN */}
          <button
            className="btn-outline"
            onClick={() => router.push("/pujas")}
          >
            Explore Services
          </button>
        </div>
      </div>

      <div className="consult-right">
        <img
          src="/images/family.jpg"
          alt="Vedic Puja"
          className="consult-image"
        />

        <div className="rating-badge">
          ⭐⭐⭐⭐⭐
          <p>Trusted by 1000+ devotees</p>
        </div>
      </div>
    </section>
  );
}
