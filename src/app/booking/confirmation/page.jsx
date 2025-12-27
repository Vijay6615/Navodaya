// src/app/booking/confirmation/page.jsx
import PrintButton from "./PrintButton";

export default function ConfirmationPage() {
  return (
    <section className="page-section">
      <h1 className="page-title">Booking Confirmed!</h1>

      <div className="form-card">
        <p>
          Thank you for your booking. Panditji will contact you within 2 hours
          to confirm the details.
        </p>

        <div className="two-col" style={{ marginTop: 16 }}>
          <div>
            <h3>Booking Details</h3>
            <p>Puja: Ganesh Puja</p>
            <p>Date: Saturday 29 November, 2025</p>
            <p>Time: 8:00 AM – 10:00 AM</p>
            <p>Address: A/102 Shri Krishna Darshan Apt, Naghdas</p>
            <p>Total: ₹ 2,100</p>
          </div>

          <div>
            <h3>Your Details</h3>
            <p>Name: Random man</p>
            <p>Phone: 1212121211</p>
            <p>Email: deshb@gmail.com</p>
          </div>
        </div>

        <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
         
        <PrintButton /> 
        </div>
      </div>
    </section>
  );
}
