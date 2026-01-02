"use client";

import { useEffect, useState } from "react";

// ================== EVENTS ==================
const EVENTS = {
  January: [
    {
      img: "/images/makar-sankranti.jpg",
      title: "Makar Sankranti Special Puja",
      desc: "Surya dev arghya, daan & grah shanti rituals for prosperity.",
      offer: "10% OFF this month",
      date: "2026-01-14 00:00:00",
    },
    {
      img: "/images/vasant.jpg",
      title: "Vasant Panchami",
      desc: "Mahalakshmi mantra jaap for business & money growth.",
      offer: " Also Free muhurat consultation",
      date: "2026-01-23 08:00:00",
    },
  ],

  February: [
    // {
    //   img: "/images/saraswati-puja.jpg",
    //   title: "Saraswati Puja",
    //   desc: "Blessings for students, knowledge & learning success.",
    //   offer: "Student discount available",
    //   date: "2025-02-02 09:00:00",
    // },
  ],

  March: [
    {
      img: "/images/holika_dahan.jpg",
      title: "Holika Dahan & Havan",
      desc: "Remove negativity and bring divine protection.",
      offer: "",
      date: "2026-03-03 19:00:00",
    },
  ],
};

const months = Object.keys(EVENTS);

// ================= COUNTDOWN =================
function Countdown({ date }) {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    function updateTimer() {
      const diff = new Date(date).getTime() - Date.now();

      if (diff <= 0) return setTimeLeft({ expired: true });

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
      });
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [date]);

  if (timeLeft.expired)
    return <span className="text-red-600 font-semibold">Event completed 🙏</span>;

  return (
    <div className="flex justify-center gap-3">
      <div className="px-3 py-1 rounded-lg bg-white shadow">
        <span className="font-bold text-orange-700">{timeLeft.days ?? 0}</span> d
      </div>
      <div className="px-3 py-1 rounded-lg bg-white shadow">
        <span className="font-bold text-orange-700">{timeLeft.hours ?? 0}</span> h
      </div>
      <div className="px-3 py-1 rounded-lg bg-white shadow">
        <span className="font-bold text-orange-700">{timeLeft.mins ?? 0}</span> m
      </div>
    </div>
  );
}

// ================= MAIN COMPONENT =================
export default function MonthlyEventsSection() {
  const [month, setMonth] = useState(months[0]);

  return (
    <section className="py-16 px-5 bg-gradient-to-b from-orange-50 via-rose-50 to-yellow-50">

      {/* HEADER */}
      <div className="text-center mb-12">
        <p className="text-orange-600 font-semibold text-lg">🗓️ Upcoming Vedic Events</p>

        <h1 className="text-4xl font-extrabold text-gray-800">
          Monthly Special Pujas & Festivals
        </h1>

        <p className="text-gray-600 mt-2">
          Select month • See offers • Book auspicious pujas
        </p>
      </div>

      {/* MONTH TABS */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {months.map((m) => (
          <button
            key={m}
            onClick={() => setMonth(m)}
            className={`
              px-5 py-2 rounded-full text-sm font-semibold border
              transition-all
              ${month === m
                ? "bg-orange-600 text-white shadow-lg scale-105"
                : "bg-white hover:bg-gray-100"}
            `}
          >
            {m}
          </button>
        ))}
      </div>

      {/* EVENT CARDS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {EVENTS[month].map((event, i) => {
          const expired = new Date(event.date).getTime() < Date.now();

          return (
            <div
              key={i}
              className="rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl border shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              {/* IMAGE */}
              <div className="relative">
                <img src={event.img} className="w-full h-48 object-cover" />

                <span className="absolute top-4 left-4 bg-orange-600 text-white text-xs px-3 py-1 rounded-full shadow">
                  {event.offer}
                </span>

                <span className="absolute bottom-3 right-3 bg-white/80 text-gray-700 text-xs px-3 py-1 rounded-full shadow border">
                  📅 {new Date(event.date).toDateString()}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-5">

                <h3 className="font-bold text-xl text-gray-800">{event.title}</h3>

                <p className="text-gray-600 text-sm mt-1">{event.desc}</p>

                {/* COUNTDOWN BOX */}
                <div className="mt-4 rounded-2xl border bg-orange-50 p-3 text-center">
                  <Countdown date={event.date} />
                </div>

                {/* BUTTON */}
                <button
                  disabled={expired}
                  className={`mt-4 w-full py-2.5 rounded-xl font-semibold transition
                    ${expired
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-orange-600 text-white hover:bg-orange-700"}
                  `}
                >
                  {expired ? "Event Closed" : "Book Now"}
                </button>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}
