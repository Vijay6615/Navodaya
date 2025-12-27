const features = [
  {
    icon: "🕉️",
    title: "Authentic Vedic Rituals",
    description:
      "All pujas are performed strictly according to Vedic scriptures with proper mantras, sankalp and vidhi-vidhan.",
  },
  {
    icon: "🙏",
    title: "Experienced Panditji",
    description:
      "Highly experienced and knowledgeable Panditji with deep understanding of shastras and traditions.",
  },
  {
    icon: "📅",
    title: "Flexible Date & Time",
    description:
      "Book pujas at your preferred date and muhurat with flexible time slots for your convenience.",
  },
  {
    icon: "🏠",
    title: "At Your Home or Temple",
    description:
      "Puja services available at your home, office or temple with complete samagri guidance.",
  },
  {
    icon: "📿",
    title: "All Puja Samagri Guidance",
    description:
      "Clear list and guidance of required puja samagri provided in advance for a smooth ceremony.",
  },
  {
    icon: "💬",
    title: "Easy WhatsApp Support",
    description:
      "Quick support and consultation available via WhatsApp before and after the puja.",
  },
];

export default function FrostCard() {
  return (
    <section className="why-panditji">
      <h2 className="section-title">Why Choose Our Panditji</h2>
      <p className="section-subtitle">
        Experience devotion, discipline and divine blessings through authentic
        puja services
      </p>

      <div className="why-grid">
        {features.map((item, index) => (
          <div className="why-card" key={index}>
            <div className="why-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
