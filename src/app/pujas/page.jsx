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

  const clearAll = () => {
    setSelectedCategories([]);
    setSearch("");
  };

  const filteredPujas = PUJAS.filter((puja) => {
    if (!puja) return false;

    const title = puja?.name?.toLowerCase() || "";
    const category = puja?.category?.toLowerCase() || "";
    const searchText = search.toLowerCase();

    const matchesSearch =
      title.includes(searchText) || category.includes(searchText);

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(puja.category);

    return matchesSearch && matchesCategory;
  });

  const CATEGORY_LIST = [
    "All",
    "Daily Puja",
    "Festival Puja",
    "Astrology",
    "Havan Ceremonies",
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">पूजा सेवाएं</h1>
          <p className="text-gray-500 text-sm">All Puja Services</p>
        </div>

        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
          {filteredPujas.length} Pujas
        </span>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search pujas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-full border bg-white shadow-sm focus:ring-2 focus:ring-orange-400 outline-none"
        />
      </div>

      {/* CATEGORY SCROLL */}
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
              className={`flex items-center gap-1 whitespace-nowrap px-4 py-2 rounded-full border text-sm transition
                ${
                  active
                    ? "bg-orange-600 text-white shadow"
                    : "bg-white text-gray-600"
                }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ACTIVE FILTER TAGS */}
      {(selectedCategories.length > 0 || search) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedCategories.map((cat) => (
            <span
              key={cat}
              onClick={() => toggleCategory(cat)}
              className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm cursor-pointer"
            >
              {cat} ✕
            </span>
          ))}

          {search && (
            <span
              onClick={() => setSearch("")}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm cursor-pointer"
            >
              {search} ✕
            </span>
          )}

          <button
            onClick={clearAll}
            className="px-3 py-1 bg-gray-200 rounded-full text-sm"
          >
            Clear All
          </button>
        </div>
      )}

      {/* PUJA CARDS */}
      <div className="grid grid-cols-2 gap-4">

        {filteredPujas.map((puja, index) => (
          <div
            key={index}
            className="rounded-2xl overflow-hidden shadow hover:shadow-xl transition cursor-pointer bg-white"
          >
            {/* IMAGE WITH OVERLAY */}
            <div className="relative">
              <img
                src={puja.image}
                alt={puja.name}
                className="w-full h-32 object-cover"
              />

              {/* overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

              {/* badge */}
              <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-semibold">
                POPULAR
              </span>

              {/* heart */}
              <span className="absolute top-2 right-2 text-white text-lg">
                ♡
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

              <button
                onClick={() =>
                  router.push(
                    `/booking?puja=${encodeURIComponent(puja.name)}`
                  )
                }
                className="mt-2 w-full py-1.5 rounded-lg bg-orange-500 text-white text-sm"
              >
                Book
              </button>

            </div>
          </div>
        ))}

      </div>
    </section>
  );
}