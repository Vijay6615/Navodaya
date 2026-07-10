"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Landmark,
  History,
  Sparkles,
  Check,
  Flower2,
  ChevronRight,
} from "lucide-react";

export default function SitaRamCounterPage() {
  const [count, setCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [history, setHistory] = useState([]);
  const [muted, setMuted] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [mounted, setMounted] = useState(false);

  const audioRef = useRef(null);

  // =========================
  // LOAD SAVED DATA
  // =========================
  useEffect(() => {
    const storedCount = Number(
      localStorage.getItem("sitaRamCurrentCount") || 0
    );

    const storedLastSaved = Number(
      localStorage.getItem("sitaRamLastSaved") || 0
    );

    const storedTotalSaved = Number(
      localStorage.getItem("sitaRamTotalSaved") || 0
    );

    let storedHistory = [];

    try {
      storedHistory = JSON.parse(
        localStorage.getItem("sitaRamHistory") || "[]"
      );
    } catch {
      storedHistory = [];
    }

    setCount(storedCount);
    setLastSaved(storedLastSaved);
    setTotalSaved(storedTotalSaved);
    setHistory(storedHistory);
    setMounted(true);
  }, []);

  // =========================
  // AUTO SAVE CURRENT COUNTER
  // =========================
  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(
      "sitaRamCurrentCount",
      count.toString()
    );
  }, [count, mounted]);

  // =========================
  // MUTE CONTROL
  // =========================
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  // =========================
  // START AUDIO
  // =========================
  const startAudio = async () => {
    if (!audioRef.current || audioStarted) return;

    try {
      await audioRef.current.play();
      setAudioStarted(true);
    } catch (error) {
      console.log("Audio autoplay blocked:", error);
    }
  };

  // =========================
  // COUNT +1
  // =========================
  const increaseCount = async () => {
    setCount((prev) => prev + 1);

    await startAudio();

    if (navigator.vibrate) {
      navigator.vibrate(18);
    }
  };

  // =========================
  // MUTE / UNMUTE
  // =========================
  const toggleMute = async () => {
    if (!audioRef.current) return;

    if (!audioStarted) {
      try {
        await audioRef.current.play();
        setAudioStarted(true);
      } catch (error) {
        console.log("Audio play blocked:", error);
      }
    }

    setMuted((prev) => !prev);
  };

  // =========================
  // DEPOSIT / SAVE
  // =========================
  const saveDeposit = () => {
    if (count <= 0) return;

    const depositAmount = count;
    const newTotal = totalSaved + depositAmount;

    const now = new Date();

    const newEntry = {
      id: Date.now(),
      count: depositAmount,
      date: now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const newHistory = [newEntry, ...history].slice(0, 20);

    // Update states
    setLastSaved(depositAmount);
    setTotalSaved(newTotal);
    setHistory(newHistory);

    // Current counter becomes zero
    setCount(0);

    // Save permanently
    localStorage.setItem(
      "sitaRamLastSaved",
      depositAmount.toString()
    );

    localStorage.setItem(
      "sitaRamTotalSaved",
      newTotal.toString()
    );

    localStorage.setItem(
      "sitaRamHistory",
      JSON.stringify(newHistory)
    );

    localStorage.setItem(
      "sitaRamCurrentCount",
      "0"
    );

    // Success message
    setSavedMessage(true);

    setTimeout(() => {
      setSavedMessage(false);
    }, 2200);

    // Vibration
    if (navigator.vibrate) {
      navigator.vibrate([50, 40, 80]);
    }
  };

  // =========================
  // MALA CALCULATIONS
  // =========================
  const currentMalaCount = count % 108;

  const progress =
    currentMalaCount === 0 && count > 0
      ? 100
      : (currentMalaCount / 108) * 100;

  const completedMalas = Math.floor(totalSaved / 108);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#fffaf2] flex items-center justify-center">
        <div className="text-orange-700 font-semibold">
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf2] pb-28 md:pb-12">

      {/* ================= AUDIO ================= */}
      <audio
        ref={audioRef}
        src="/audio/ram-ram-jai-raja-ram.mp3"
        loop
        preload="auto"
      />

      

      {/* ================= TOP NAV ================= */}
      <header className="sticky top-0 z-40 bg-[#fffaf2]/90 backdrop-blur-xl border-b border-orange-100">
        <div className="w-full max-w-7xl mx-auto h-16 sm:h-[72px] px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          <Link
            href="/"
            className="
              w-10 h-10
              rounded-full
              bg-white
              border border-orange-100
              shadow-sm
              flex items-center justify-center
              active:scale-95
              transition
            "
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="text-center">
            <p className="font-extrabold text-[#4a2118]">
              सीता राम नाम बैंक
            </p>

            <p className="text-[10px] tracking-[0.18em] text-orange-600 font-bold uppercase">
              Navodaya Puja
            </p>
          </div>

          <button
            onClick={toggleMute}
            className="
              w-10 h-10
              rounded-full
              bg-white
              border border-orange-100
              shadow-sm
              flex items-center justify-center
              active:scale-95
              transition
            "
          >
            {muted ? (
              <VolumeX size={19} />
            ) : (
              <Volume2 size={19} />
            )}
          </button>

        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto px-0 sm:px-2 lg:px-6 xl:px-8">

        {/* ================= HERO IMAGE ================= */}
        <section className="px-4 sm:px-6 lg:px-4 pt-4 sm:pt-6">
          <div className="relative h-52 sm:h-72 lg:h-[420px] rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-xl">

            <img
              src="/images/Ram.jpg"
              alt="Sita Ram"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 lg:p-10 text-white">

              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={15} />

                <span className="text-xs font-semibold">
                  प्रेम से नाम जपें
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
                सीता राम
              </h1>

              <p className="text-white/80 text-sm sm:text-base lg:text-lg mt-1">
                हर नाम एक आध्यात्मिक जमा
              </p>

            </div>
          </div>
        </section>

        {/* ================= DEVOTIONAL AUDIO ================= */}
<section className="px-4 sm:px-6 lg:px-4 mt-4 sm:mt-6">
  <div
    className="
      overflow-hidden
      rounded-[24px]
      bg-white
      border border-orange-100
      shadow-sm
      p-3
    "
  >
    <div className="mb-3 px-1">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-600">
        Devotional Music
      </p>

      <h2 className="text-base font-black text-[#4a2118] mt-1">
        श्री राम भजन
      </h2>
    </div>

    <div className="w-full overflow-hidden rounded-[18px]">
      <iframe
        src="https://audio.com/embed/audio/1843013813563986?theme=image"
        title="Shri Ram Devotional Audio"
        className="block w-full h-[204px] sm:h-[260px] lg:h-[320px] border-0"
        allow="autoplay"
        loading="lazy"
      />
    </div>

    <a
      href="https://audio.com/govindadas"
      target="_blank"
      rel="noopener noreferrer"
      className="
        mt-2
        block
        text-center
        text-[11px]
        font-medium
        text-gray-400
        hover:text-orange-600
        transition-colors
      "
    >
      @govindadas
    </a>
  </div>
</section>

        {/* ================= BANK STATS ================= */}
        <section className="px-4 sm:px-6 lg:px-4 mt-4 sm:mt-6">
          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 sm:gap-4">

            {/* LAST DEPOSIT */}
            <div className="bg-white rounded-[22px] p-4 border border-orange-100 shadow-sm">

              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
                <History
                  size={18}
                  className="text-orange-600"
                />
              </div>

              <p className="text-xs text-gray-500 font-medium">
                अंतिम जमा
              </p>

              <p className="text-2xl font-black text-[#4a2118] mt-1">
                {lastSaved.toLocaleString("en-IN")}
              </p>

              <p className="text-[11px] text-gray-400">
                नाम
              </p>

            </div>

            {/* TOTAL SAVED */}
            <div className="bg-[#4a2118] rounded-[22px] p-4 shadow-lg text-white">

              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-3">
                <Landmark size={18} />
              </div>

              <p className="text-xs text-white/65 font-medium">
                कुल नाम जमा
              </p>

              <p className="text-2xl font-black mt-1">
                {totalSaved.toLocaleString("en-IN")}
              </p>

              <p className="text-[11px] text-white/50">
                Lifetime
              </p>

            </div>

          </div>
        </section>

        {/* ================= COUNTER ================= */}
        <section className="px-4 sm:px-6 lg:px-4 mt-4 sm:mt-6">

          <div
            className="
              relative
              overflow-hidden
              rounded-[32px]
              bg-gradient-to-br
              from-[#f97316]
              via-[#dc4b27]
              to-[#8f1d1d]
              shadow-2xl
              px-4 sm:px-6 lg:px-10
              py-6 sm:py-8 lg:py-10
            "
          >

            {/* Decoration */}
            <div className="absolute -top-20 -right-16 w-48 h-48 rounded-full bg-yellow-300/20 blur-3xl" />

            <div className="absolute -bottom-20 -left-16 w-48 h-48 rounded-full bg-orange-200/15 blur-3xl" />

            <div className="relative z-10">

              {/* SESSION LABEL */}
              <div className="flex justify-between items-center">

                <div>
                  <p className="text-white/65 text-xs font-semibold uppercase tracking-wider">
                    Current Session
                  </p>

                  <p className="text-white font-bold">
                    अभी का जाप
                  </p>
                </div>

                <div className="px-3 py-1.5 rounded-full bg-white/15 border border-white/20">
                  <span className="text-white text-xs font-bold">
                    {currentMalaCount}/108
                  </span>
                </div>

              </div>

              {/* COUNT */}
              <div className="text-center mt-5">

                <p className="text-6xl min-[380px]:text-7xl sm:text-8xl lg:text-9xl font-black text-white tracking-tight">
                  {count.toLocaleString("en-IN")}
                </p>

                <p className="text-orange-100 text-sm mt-1">
                  सीता राम नाम
                </p>

              </div>

              {/* PROGRESS */}
              <div className="mt-5">

                <div className="flex justify-between text-[11px] text-white/70 mb-2">
                  <span>माला प्रगति</span>
                  <span>{Math.round(progress)}%</span>
                </div>

                <div className="h-2 bg-white/15 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-yellow-200 rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

              </div>

              {/* BIG TAP BUTTON */}
              <div className="flex justify-center py-7">

                <button
                  onClick={increaseCount}
                  aria-label="Count Sita Ram Naam"
                  className="
                    relative
                    w-48 h-48
                    rounded-full
                    bg-[#fff8e8]
                    border-[8px]
                    border-white/20
                    shadow-[0_20px_50px_rgba(70,15,10,0.35)]
                    flex flex-col
                    items-center justify-center
                    select-none
                    touch-manipulation
                    active:scale-[0.91]
                    transition-transform
                    duration-100
                  "
                >

                  <div className="absolute inset-3 rounded-full border border-orange-200" />

                  <span className="relative text-4xl">
                    🙏
                  </span>

                  <span className="relative text-2xl font-black text-[#7c2d12] mt-2">
                    सीता राम
                  </span>

                  <span className="relative text-[10px] tracking-[0.2em] font-bold text-orange-500 mt-2">
                    TAP TO CHANT
                  </span>

                </button>

              </div>

              {/* SAVE BUTTON */}
              <button
                onClick={saveDeposit}
                disabled={count === 0}
                className={`
                  w-full
                  h-14
                  rounded-2xl
                  flex items-center justify-center gap-2
                  font-bold
                  transition-all
                  ${
                    count > 0
                      ? "bg-white text-[#7c2d12] shadow-lg active:scale-[0.98]"
                      : "bg-white/15 text-white/40 cursor-not-allowed"
                  }
                `}
              >
                <Landmark size={20} />

                नाम बैंक में जमा करें

                <ChevronRight size={18} />
              </button>

            </div>
          </div>
        </section>

        {/* ================= SUCCESS MESSAGE ================= */}
        {savedMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">

            <div className="bg-[#1f5f3b] text-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3">

              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <Check size={19} />
              </div>

              <div>
                <p className="font-bold text-sm">
                  नाम सफलतापूर्वक जमा हुआ
                </p>

                <p className="text-white/70 text-xs">
                  जय श्री सीता राम 🙏
                </p>
              </div>

            </div>
          </div>
        )}

        {/* ================= MALA SUMMARY ================= */}
        <section className="px-4 sm:px-6 lg:px-4 mt-6 sm:mt-8">

          <div className="flex items-end justify-between mb-3">

            <div>
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Your Journey
              </p>

              <h2 className="text-xl font-black text-[#4a2118]">
                आपकी साधना
              </h2>
            </div>

            <span className="text-sm text-gray-500">
              {completedMalas} माला
            </span>

          </div>

          <div className="bg-white border border-orange-100 rounded-[26px] overflow-hidden shadow-sm">

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] lg:grid-cols-[260px_1fr]">

              <img
                src="/images/hanuman.jpg"
                alt="Hanuman"
                className="w-full h-48 sm:h-full sm:min-h-[180px] lg:min-h-[220px] object-cover"
              />

              <div className="p-4">

                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Flower2
                    size={18}
                    className="text-orange-600"
                  />
                </div>

                <p className="font-black text-[#4a2118] mt-3">
                  पूर्ण माला
                </p>

                <p className="text-3xl font-black text-orange-600 mt-1">
                  {completedMalas}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  108 नाम = 1 माला
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ================= RECENT DEPOSITS ================= */}
        <section className="px-4 sm:px-6 lg:px-4 mt-7 sm:mt-9">

          <div className="flex items-center justify-between mb-3">

            <div>
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Naam Bank
              </p>

              <h2 className="text-xl font-black text-[#4a2118]">
                हाल की जमा
              </h2>
            </div>

            <History
              size={20}
              className="text-gray-400"
            />

          </div>

          {history.length === 0 ? (

            <div className="bg-white border border-dashed border-orange-200 rounded-[24px] p-7 text-center">

              <div className="w-12 h-12 mx-auto rounded-full bg-orange-50 flex items-center justify-center">
                <Landmark
                  size={21}
                  className="text-orange-500"
                />
              </div>

              <p className="font-bold text-[#4a2118] mt-3">
                अभी कोई जमा नहीं
              </p>

              <p className="text-sm text-gray-400 mt-1">
                जाप शुरू करें और पहला नाम जमा करें
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              {history.slice(0, 5).map((item, index) => (

                <div
                  key={item.id}
                  className="
                    bg-white
                    border border-orange-100
                    rounded-[20px]
                    px-4 py-3
                    shadow-sm
                    flex items-center justify-between
                  "
                >

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 font-black">
                      {index + 1}
                    </div>

                    <div>
                      <p className="font-bold text-[#4a2118]">
                        {Number(item.count).toLocaleString("en-IN")} नाम
                      </p>

                      <p className="text-xs text-gray-400">
                        {item.date} • {item.time}
                      </p>
                    </div>

                  </div>

                  <div className="text-xl">
                    🪔
                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* ================= DEVOTIONAL QUOTE ================= */}
        <section className="px-4 sm:px-6 lg:px-4 mt-7 sm:mt-9">

          <div className="relative h-48 sm:h-64 lg:h-80 rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-lg">

            <img
              src="/images/akhand-ramayan-path.jpg"
              alt="Sita Ram devotion"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/60" />

            <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7 lg:p-10 text-white">

              <p className="text-xs text-orange-200 font-bold tracking-wider uppercase">
                Daily Inspiration
              </p>

              <p className="text-xl sm:text-2xl lg:text-4xl font-black mt-2 leading-snug">
                “राम नाम से बढ़कर कोई धन नहीं”
              </p>

              <p className="text-white/65 text-xs mt-2">
                अपनी साधना जारी रखें
              </p>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}