"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ================== EVENTS ==================
const EVENTS = {
  January: [
    {
      img: "/images/makar-sankranti.jpg",
      title: "Makar Sankranti Special Puja",
      desc: "Surya dev arghya, daan & grah shanti rituals for prosperity.",
      offer: "10% OFF this month",
      date: "2026-01-14",
    },
    {
      img: "/images/vasant.jpg",
      title: "Vasant Panchami",
      desc: "Mahalakshmi mantra jaap for business & money growth.",
      offer: " Also Free muhurat consultation",
      date: "2026-01-23",
    },
  ],

  February: [],

  March: [
    {
      img: "/images/holika_dahan.jpg",
      title: "Holika Dahan & Havan",
      desc: "Remove negativity and bring divine protection.",
      offer: "",
      date: "2026-03-03",
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
  const router = useRouter();
  const [loadingId, setLoadingId] = useState(null);

  return (
    <section className="py-16 px-5 bg-gradient-to-b from-orange-50 via-rose-50 to-yellow-50">

      <div className="text-center mb-12">
        <p className="text-orange-600 font-semibold text-lg">🗓️ Upcoming Vedic Events</p>
        <h1 className="text-4xl font-extrabold text-gray-800">Monthly Special Pujas & Festivals</h1>
        <p className="text-gray-600 mt-2">Select month • See offers • Book auspicious pujas</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {months.map((m) => (
          <button
            key={m}
            onClick={() => setMonth(m)}
            className={`px-5 py-2 rounded-full text-sm font-semibold border
              ${month === m ? "bg-orange-600 text-white" : "bg-white"}
            `}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {EVENTS[month].map((event, i) => {
          const expired = new Date(event.date).getTime() < Date.now();

          return (
            <div key={i} className="rounded-3xl overflow-visible bg-white border shadow">
              <img src={event.img} className="w-full h-48 object-cover" />

              <div className="p-5">
                <h3 className="font-bold text-xl">{event.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{event.desc}</p>

                <div className="mt-3">
                  <Countdown date={event.date} />
                </div>

                <button
                  disabled={expired || loadingId === i}
                  onClick={() => {
                    setLoadingId(i);
                    router.push(
                      `/booking?puja=${encodeURIComponent(event.title)}&date=${event.date}`
                    );
                  }}
                  className={`mt-4 w-full py-2.5 rounded-xl font-semibold ${
                    expired ? "bg-gray-300" : "bg-orange-600 text-white"
                  }`}
                >
                  {expired
                    ? "Event Closed"
                    : loadingId === i
                    ? "Redirecting…"
                    : "Book Now"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
