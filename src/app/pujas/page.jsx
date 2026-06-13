"use client";
import { useState } from "react";
import { PUJAS } from "../pujasData";
import { useRouter } from "next/navigation";
import { Search, Check, Clock, X } from "lucide-react";

const CATEGORY_LIST = ["All", "Daily Puja", "Festival Puja", "Astrology", "Havan Ceremonies"];

export default function PujasPage() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [search, setSearch] = useState("");

  const toggleCategory = (cat) => {
    if (cat === "All") return setSelectedCategories([]);
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredPujas = PUJAS.filter((puja) => {
    const name = puja?.name?.toLowerCase() || "";
    const cat = puja?.category?.toLowerCase() || "";
    const q = search.toLowerCase();
    return (
      (name.includes(q) || cat.includes(q)) &&
      (selectedCategories.length === 0 || selectedCategories.includes(puja.category))
    );
  });

  const sectionLabel =
    selectedCategories.length === 0 ? "All services" : selectedCategories.join(" · ");

  return (
    <section className="min-h-screen bg-[#FFF8F4] pb-28">

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-4 pt-0 pb-1">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-gray-900 leading-tight">
            पूजा सेवाएं
          </h1>
          <p className="text-xs text-[#8a7060] mt-0.5">
            {filteredPujas.length} services available
          </p>
        </div>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-700
                        flex items-center justify-center text-white text-sm font-bold
                        shadow-md flex-shrink-0">
          NP
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="mx-4 mt-3">
        <div className="flex items-center gap-2 bg-white rounded-full border border-black/[0.08]
                        px-4 h-12 shadow-sm focus-within:ring-2 focus-within:ring-orange-300
                        transition-all duration-200">
          <Search size={18} strokeWidth={2} className="text-[#8a7060] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search pujas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm
                       text-gray-700 placeholder:text-gray-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ── FILTER CHIPS ── */}
      <div className="flex gap-2 overflow-x-auto px-4 mt-3 pb-0.5 scrollbar-hide">
        {CATEGORY_LIST.map((cat) => {
          const isActive =
            cat === "All" ? selectedCategories.length === 0 : selectedCategories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`
                flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium
                whitespace-nowrap flex-shrink-0 border transition-all duration-200
                ${isActive
                  ? "bg-[#431407] border-[#431407] text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-700"
                }
              `}
            >
              {isActive && <Check size={12} strokeWidth={2.5} />}
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── SECTION LABEL ── */}
      <p className="px-4 mt-4 mb-2 text-[10px] font-semibold tracking-widest uppercase text-orange-700/70">
        {sectionLabel}
      </p>

      {/* ── CARDS GRID ── */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {filteredPujas.map((puja, index) => (
          <div
            key={index}
            onClick={() => router.push(`/pujas/${puja.slug}`)}
            className="bg-white rounded-2xl overflow-hidden border border-black/[0.06]
                       shadow-[0_1px_4px_rgba(0,0,0,0.07)] active:scale-[0.97]
                       transition-transform duration-150 cursor-pointer"
          >
            {/* ── Image zone ── */}
            <div className="relative h-28 overflow-hidden">
              <img
                src={puja.image}
                alt={puja.name}
                className="w-full h-full object-cover"
              />

              {/* Gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Popular badge — top left */}
              {puja.popular && (
                <span className="absolute top-2 left-2 bg-orange-600 text-white
                                 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                  Popular
                </span>
              )}

              {/* Category — bottom left, frosted glass */}
              <span className="absolute bottom-2 left-2 bg-white/20 text-white
                               text-[9px] font-semibold px-2 py-0.5 rounded-full
                               border border-white/30 backdrop-blur-sm leading-none">
                {puja.category}
              </span>

              {/* Duration — bottom right */}
              <span className="absolute bottom-2 right-2 flex items-center gap-1
                               text-white/90 text-[9px] font-medium leading-none">
                <Clock size={9} strokeWidth={2} />
                {puja.duration}
              </span>
            </div>

            {/* ── Card body ── */}
            <div className="p-[10px]">
              <h3 className="text-[13px] font-semibold text-gray-900 leading-snug
                             truncate mb-[3px]">
                {puja.name}
              </h3>

              <p className="text-[11px] text-[#8a7060] leading-snug truncate mb-2">
                {puja.shortDescription}
              </p>

              {/* Price */}
              <p className="text-[15px] font-bold text-orange-600 tracking-tight mb-[10px]">
                {puja.price}
              </p>

              {/* Book Now — MD3 Filled Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/booking?puja=${encodeURIComponent(puja.name)}`);
                }}
                className="w-full h-[34px] rounded-full bg-white text-yellow-800 border border-emerald-200
                           text-[12px] font-semibold tracking-wide
                           hover:bg-orange-700 active:scale-95
                           transition-all duration-150 flex items-center justify-center"
              >
                Book now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── EMPTY STATE ── */}
      {filteredPujas.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <span className="text-4xl mb-3">🙏</span>
          <p className="text-sm font-semibold text-gray-700">No pujas found</p>
          <p className="text-xs text-gray-400 mt-1">
            Try a different search or clear your filters.
          </p>
          <button
            onClick={() => { setSearch(""); setSelectedCategories([]); }}
            className="mt-4 px-5 h-9 rounded-full border border-orange-300 text-orange-600
                       text-sm font-medium hover:bg-orange-50 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

    </section>
  );
}