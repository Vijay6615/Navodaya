// src/app/components/Hero.jsx

export default function Hero() {
  return (
    <section className="hero-banner">
      <div className="hero-overlay">
        <span className="hero-badge">Authentic Vedic Rituals</span>

        <h1 className="hero-title">
          Sacred Pujas for Every Occasion
        </h1>

        <p className="hero-subtitle">
          Experience authentic Vedic rituals performed by experienced Panditji
          with devotion and precision.
        </p>

        <div className="hero-buttons">
          <a href="/contact">
            <button className="btn-primary hero-btn-main">
              Book a Puja →
            </button>
          </a>
          <a href="/pujas">
            <button className="btn-outline hero-btn-secondary">
              Explore Pujas
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
