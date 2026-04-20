"use client";

import { useState } from "react";
import { PUJAS } from "../pujasData";
import { useRouter } from "next/navigation";

export default function PujasPage() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [search, setSearch] = useState("");

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredPujas = PUJAS.filter((puja) => {
    const title = puja?.name?.toLowerCase() || "";
    const category = puja?.category?.toLowerCase() || "";
    const searchText = search.toLowerCase();

    return (
      (title.includes(searchText) || category.includes(searchText)) &&
      (selectedCategories.length === 0 ||
        selectedCategories.includes(puja.category))
    );
  });

  const CATEGORY_LIST = [
    "All",
    "Daily Puja",
    "Festival Puja",
    "Astrology",
    "Havan Ceremonies",
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-6 pb-20">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">पूजा सेवाएं</h1>
          <p className="text-gray-500 text-sm">
            {filteredPujas.length} Services Available
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="🔍 Search pujas..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-3 rounded-full border shadow-sm focus:ring-2 focus:ring-orange-400 outline-none"
      />

      {/* CATEGORY */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {CATEGORY_LIST.map((cat) => {
          const active =
            cat === "All"
              ? selectedCategories.length === 0
              : selectedCategories.includes(cat);

          return (
            <button
              key={cat}
              onClick={() =>
                cat === "All"
                  ? setSelectedCategories([])
                  : toggleCategory(cat)
              }
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition
              ${
                active
                  ? "bg-orange-600 text-white shadow"
                  : "bg-white border text-gray-600"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-2 gap-4">

        {filteredPujas.map((puja, index) => (
          <div
            key={index}
            onClick={() => router.push(`/pujas/${puja.slug}`)}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer"
          >

            {/* IMAGE */}
            <div className="relative">
              <img
                src={puja.image}
                alt={puja.name}
                className="w-full h-32 object-cover group-hover:scale-105 transition duration-300"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

              <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-semibold">
                POPULAR
              </span>
            </div>

            {/* CONTENT */}
            <div className="p-3">

              <h3 className="font-bold text-sm text-gray-800 line-clamp-1">
                {puja.name}
              </h3>

              <p className="text-xs text-gray-500 line-clamp-1">
                {puja.shortDescription}
              </p>

              <div className="flex justify-between items-center mt-2">
                <span className="text-orange-600 font-bold">
                  {puja.price}
                </span>

                <span className="text-xs text-gray-500">
                  ⏱ {puja.duration}
                </span>
              </div>

              {/* BOOK BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 🔥 IMPORTANT (card click prevent)
                  router.push(`/booking?puja=${encodeURIComponent(puja.name)}`);
                }}
                className="mt-3 w-full py-2 rounded-xl bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition"
              >
                Book Now
              </button>

            </div>
          </div>
        ))}

      </div>
    </section>
  );
}