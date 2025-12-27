import { useState } from "react";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [selectedPuja, setSelectedPuja] = useState("");

  const pujas = [
    "Satyanarayan Puja",
    "Griha Pravesh Puja",
    "Navgrah Shanti",
    "Mahamrityunjay Jaap",
    "Rudrabhishek",
    "Lakshmi Puja",
    "Ganesh Puja",
    "Kaal Sarp Dosh Puja",
    "Navchandi Yagya",
    "Marriage Puja",
    "Vastu Shanti",
    "Naamkaran Sanskar",
    "Mundan Sanskar",
    "Pitru Dosh Puja",
    "Bhumi Pujan"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const whatsappNumber = "919594943609";

    const text =
      ` *New Puja Inquiry*%0A%0A` +
      ` Name: ${name}%0A` +
      ` Email: ${email}%0A` +
      ` Phone: ${phone}%0A` +
      ` Selected Puja: ${selectedPuja}%0A` +
      ` Message: ${msg}%0A%0A` +
      ` Requested through Website Contact Form`;

    const url = `https://wa.me/${whatsappNumber}?text=${text}`;
    window.open(url, "_blank");
  };

  return (
    <div className="contact-wrapper">
      {/* LEFT SIDE : DETAILS + QR  (unchanged) */}
      <div className="contact-info">
        <h2>Panditji Puja Services</h2>
        <p className="contact-desc">
          Authentic Vedic pujas, havans and rituals performed with devotion and
          proper vidhi-vidhan for peace, prosperity and well-being.
        </p>

        <ul className="contact-list">
          <li>
            📞 <strong>Phone:</strong>{" "}
            <a href="tel:+919594943609">+91 9594943609</a>
          </li>

          <li className="whatsapp-item">
            <img
              src="/images/whatsapp-logo.png"
              alt="WhatsApp"
              className="whatsapp-icon"
            />
            <strong>WhatsApp:</strong>{" "}
            <a
              href="https://wa.me/919594943609"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp
            </a>
          </li>

          <li>
            ✉️ <strong>Email:</strong>{" "}
            <a href="mailto:panditji@puja.com">panditji@puja.com</a>
          </li>

          <li>
            📍 <strong>Location:</strong> Mumbai, Maharashtra, India
          </li>

          <li>
            🕉️ <strong>Available:</strong> 6:00 AM – 10:00 PM
          </li>
        </ul>

        <div className="contact-qr-box">
          <p className="qr-title">📲 Scan for WhatsApp</p>

          <a
            href="https://api.whatsapp.com/send?phone=919594943609"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/QRCODE.png"
              alt="Scan for WhatsApp Chat"
              className="contact-qr-image"
            />
          </a>

          <p className="qr-subtext">
            Scan this QR code to chat directly with Panditji on WhatsApp
          </p>
        </div>
      </div>

      {/* RIGHT SIDE : FORM */}
      <form className="contact-form" onSubmit={handleSubmit}>
        <h3>Send Your Query</h3>

        <input
          type="text"
          placeholder="Your Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* 🔽 NEW — PUJA DROPDOWN */}
        <select
          required
          value={selectedPuja}
          onChange={(e) => setSelectedPuja(e.target.value)}
        >
          <option value="">Select Puja</option>
          {pujas.map((p, i) => (
            <option key={i} value={p}>
              {p}
            </option>
          ))}
        </select>

        <textarea
          rows="4"
          placeholder="Your message / puja requirement"
          required
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        ></textarea>

        <button type="submit">Send Message on WhatsApp</button>
      </form>
    </div>
  );
}
