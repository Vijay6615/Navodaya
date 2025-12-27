// src/app/dashboard/page.jsx
"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [bookings, setBookings] = useState([
    {
      id: "EEEF4DDB",
      customer: "Random man",
      phone: "1212121211",
      puja: "Ganesh Puja",
      date: "29 Nov 2025",
      time: "8:00 AM – 10:00 AM",
      status: "Pending",
      amount: "₹ 2,100",
    },
  ]);

  const updateStatus = (id, status) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const pending = bookings.filter((b) => b.status === "Pending").length;
  const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
  const revenue = bookings.reduce((sum, b) => {
    const num = parseInt(b.amount.replace(/[^\d]/g, ""), 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <section className="page-section">
      <h1 className="page-title">Admin Dashboard</h1>

      <div className="dashboard-cards">
        <div className="dash-card">
          <span>Total Bookings</span>
          <strong>{bookings.length}</strong>
        </div>
        <div className="dash-card">
          <span>Pending</span>
          <strong>{pending}</strong>
        </div>
        <div className="dash-card">
          <span>Confirmed</span>
          <strong>{confirmed}</strong>
        </div>
        <div className="dash-card">
          <span>Revenue</span>
          <strong>₹ {revenue.toLocaleString()}</strong>
        </div>
      </div>

      <div className="form-card" style={{ marginTop: 24, overflowX: "auto" }}>
        <table className="booking-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Puja</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>
                  {b.customer}
                  <br />
                  <small>{b.phone}</small>
                </td>
                <td>{b.puja}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td>{b.status}</td>
                <td>{b.amount}</td>
                <td>
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(b.id, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
