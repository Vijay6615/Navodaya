"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Leaf,
  ShieldCheck,
  Wheat,
  Check,
  Copy,
  X,
} from "lucide-react";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sevaOptions = [
  { amount: 501, title: "Gau Bhojan Seva", text: "Support nourishing food and daily care." },
  { amount: 1100, title: "Gau Poshan Seva", text: "Contribute towards fodder and essential care." },
  { amount: 2100, title: "Vishesh Gau Seva", text: "A heartfelt seva for continued protection and wellbeing." },
];

const impact = [
  { icon: Wheat, title: "Poshan", text: "Support for fodder and nourishing food." },
  { icon: Heart, title: "Daily Care", text: "Care offered with compassion and responsibility." },
  { icon: ShieldCheck, title: "Protection", text: "Helping create safer, dignified care for Gau Mata." },
];

export default function GauSevaPage() {
  const [selectedAmount, setSelectedAmount] = useState(1100);
  const [customAmount, setCustomAmount] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [copied, setCopied] = useState(false);

  const finalAmount = customAmount ? Number(customAmount) : selectedAmount;
  const upiId = "yourupi@upi";

  const copyUpi = async () => {
    await navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="min-h-screen bg-[#fffdfb] text-[#24140f]">
      <section className="relative min-h-[82vh] overflow-hidden flex items-end">
        <img
          src="/images/Gau-Seva.png"
          alt="Gau Seva"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-24">
          <p className="text-[#f1c9a8] text-[11px] md:text-xs tracking-[0.34em] uppercase font-semibold">
            PREM · SEVA · PUNYA
          </p>
          <h1 className={`${cormorant.className} mt-4 max-w-3xl text-white text-5xl md:text-7xl lg:text-[88px] leading-[0.9] font-semibold`}>
            Gau Seva.
            <br />
            An offering of compassion.
          </h1>
          <p className="mt-6 max-w-xl text-white/80 text-sm md:text-base leading-7">
            A sacred act of care, nourishment and gratitude. Offer your seva with
            faith and support the wellbeing of Gau Mata.
          </p>
          <button
            onClick={() => document.getElementById("seva-options")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-7 inline-flex items-center gap-3 px-5 py-2.5 bg-[#9a3f27] border border-[#8a351f] text-white text-[13px] font-semibold shadow-[0_8px_20px_rgba(80,31,18,0.22)] transition hover:bg-[#87351f] hover:-translate-y-0.5"
          >
            Offer Gau Seva <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-[0.8fr_1.2fr] gap-12 md:gap-20">
        <div>
          <p className="text-[#9a3f27] text-xs tracking-[0.28em] uppercase font-semibold">
            A Sacred Offering
          </p>
          <h2 className={`${cormorant.className} mt-4 text-5xl md:text-6xl leading-[0.95] font-semibold`}>
            Care offered
            <br />
            with devotion.
          </h2>
        </div>
        <div className="md:pt-8">
          <p className="text-[#66544c] text-base md:text-lg leading-8">
            Gau Seva is rooted in compassion, gratitude and the timeless spirit
            of seva. Your offering supports nourishment and care while allowing
            you to participate in a meaningful sacred tradition.
          </p>
          <div className="mt-10 border-t border-[#e9dfd8] pt-7 flex items-center gap-3 text-sm text-[#6f554a]">
            <Leaf size={18} className="text-[#9a3f27]" />
            Seva performed with faith, dignity and care.
          </div>
        </div>
      </section>

      <section id="seva-options" className="bg-[#f7f1ec] border-y border-[#eee4dc]">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="max-w-2xl">
            <p className="text-[#9a3f27] text-xs tracking-[0.28em] uppercase font-semibold">
              Choose Your Seva
            </p>
            <h2 className={`${cormorant.className} mt-3 text-5xl md:text-6xl font-semibold`}>
              Offer from the heart.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mt-12">
            {sevaOptions.map((item) => {
              const active = selectedAmount === item.amount && !customAmount;
              return (
                <button
                  key={item.amount}
                  onClick={() => {
                    setSelectedAmount(item.amount);
                    setCustomAmount("");
                  }}
                  className={`text-left p-7 md:p-8 border transition-all duration-300 ${
                    active
                      ? "bg-[#431407] text-white border-[#431407] -translate-y-1 shadow-xl"
                      : "bg-[#fffdfb] border-[#e4d8cf] hover:-translate-y-1 hover:shadow-lg"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <p className={`${cormorant.className} text-4xl font-semibold`}>₹{item.amount}</p>
                    {active && <Check size={19} />}
                  </div>
                  <h3 className="mt-8 text-base font-semibold">{item.title}</h3>
                  <p className={`mt-2 text-sm leading-6 ${active ? "text-white/65" : "text-[#79665d]"}`}>
                    {item.text}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 bg-[#fffdfb] border border-[#e4d8cf] p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-5">
            <div className="flex-1">
              <p className="text-xs tracking-[0.2em] uppercase text-[#9a3f27] font-semibold">
                Custom Seva Amount
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`${cormorant.className} text-3xl`}>₹</span>
                <input
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-transparent outline-none text-lg border-b border-[#d9cbc1] py-2"
                />
              </div>
            </div>
            <button
              onClick={() => finalAmount > 0 && setShowPayment(true)}
              className="inline-flex justify-center items-center gap-3 px-5 py-2.5 bg-[#9a3f27] border border-[#8a351f] text-white text-[13px] font-semibold transition hover:bg-[#87351f]"
            >
              Continue Seva <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[#9a3f27] text-xs tracking-[0.28em] uppercase font-semibold">
            Your Seva
          </p>
          <h2 className={`${cormorant.className} mt-3 text-5xl md:text-6xl font-semibold`}>
            Care in every offering.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10 mt-14">
          {impact.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className="border-t border-[#d9cbc1] pt-7">
              <div className="flex justify-between items-start">
                <Icon size={23} className="text-[#9a3f27]" />
                <span className="text-xs text-[#aa9890]">0{index + 1}</span>
              </div>
              <h3 className={`${cormorant.className} mt-8 text-3xl font-semibold`}>{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#79665d]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#431407] text-white">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <p className="text-[#d9a889] text-xs tracking-[0.3em] uppercase font-semibold">
            Sacred Philosophy
          </p>
          <h2 className={`${cormorant.className} mt-5 text-5xl md:text-7xl leading-[0.95] font-semibold`}>
            Compassion is a prayer
            <br className="hidden md:block" /> offered through action.
          </h2>
          <Link
            href="/pujas"
            className="mt-9 inline-flex items-center gap-3 px-5 py-2.5 bg-[#9a3f27] border border-[#b25a3e] text-white text-[13px] font-semibold"
          >
            Explore Pujas <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {showPayment && (
        <div className="fixed inset-0 z-[9999] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPayment(false)}>
          <div className="relative w-full max-w-md bg-[#fffdfb] border border-[#eadfd7] shadow-2xl p-7 md:p-9" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowPayment(false)} className="absolute top-4 right-4 text-[#6d554b]">
              <X size={20} />
            </button>
            <div className="text-center">
              <img src="/pujadham.png" alt="Puja Dham" className="h-16 mx-auto object-contain" />
              <p className="mt-5 text-[#9a3f27] text-[10px] tracking-[0.28em] uppercase font-semibold">Gau Seva Offering</p>
              <h3 className={`${cormorant.className} mt-2 text-4xl font-semibold`}>₹{finalAmount}</h3>
              <p className="mt-2 text-sm text-[#79665d]">Scan the QR or use the UPI ID below.</p>
              <div className="mt-6 border border-[#e6dad1] p-4">
                <img src="/images/payment-qr.png" alt="Payment QR" className="w-48 h-48 object-contain mx-auto" />
              </div>
              <button onClick={copyUpi} className="mt-4 w-full flex items-center justify-between border border-[#dfd1c7] px-4 py-3 text-sm">
                <span>{upiId}</span>
                {copied ? <Check size={17} /> : <Copy size={17} />}
              </button>
              <p className="mt-4 text-[11px] leading-5 text-[#9a8a82]">
                Replace the UPI ID and QR image with your own payment details.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
