// src/app/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="brand-logo small"><b>Navodaya Puja</b></div>
          <p>Bringing divine blessings to your doorstep.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/pujas">Our Pujas</a></li>
            <li><a href="/aboutpanditji">About Panditji</a></li>
            <li><a href="/contact">Book Now</a></li>
            <li><a href="/gallery">Gallery</a></li>
          </ul>
        </div>

        <div>
          <h4>Services</h4>
          <ul>
            <li>Daily Pujas</li>
            <li>Festival Pujas</li>
            <li>Special Occasions</li>
            <li>Havan Ceremonies</li>
          </ul>
        </div>

        <div>
          <h4>Contact Us</h4>
          <ul>
            <li>📞 +91 95949 43609</li>
            <li>✉️ panditji@puja.com</li>
            <li>📍 123 Temple Street, Mumbai, India</li>
          </ul>
        </div>
      </div>

      <p className="footer-bottom">
        © 2025 Panditji Puja Services. All rights reserved.
      </p>
    </footer>
  );
}
