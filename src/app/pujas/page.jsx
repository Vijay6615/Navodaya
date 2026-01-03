"use client";

import { useState } from "react";
import { PUJAS } from "../pujasData";
import { useRouter } from "next/navigation";

export default function PujasPage() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [search, setSearch] = useState("");

  // TOGGLE CATEGORY
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  //aise he

  // CLEAR ALL
  const clearAll = () => {
    setSelectedCategories([]);
    setSearch("");
  };

  // FILTER + SEARCH
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
    "Daily Puja",
    "Festival Puja",
    "Special Occasions",
    "Astrology",
    "Havan Ceremonies",
  ];

  return (
    <section className="max-w-7xl mx-auto px-5 py-8">

      {/* Heading */}
      <h1 className="text-3xl font-bold text-orange-700 text-center">
        Our Pujas
      </h1>

      <p className="text-gray-600 text-center mb-6">
        {filteredPujas.length} pujas available
      </p>

      {/* Search */}
      <div className="w-full max-w-xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search Puja name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-full border shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
        />
      </div>

      {/* ACTIVE FILTER TAGS */}
      {(selectedCategories.length > 0 || search) && (
        <div className="mb-4 flex flex-wrap items-center gap-2 justify-center">

          {selectedCategories.map((cat) => (
            <span
              key={cat}
              onClick={() => toggleCategory(cat)}
              className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 cursor-pointer hover:bg-orange-200"
            >
              {cat} ✕
            </span>
          ))}

          {search && (
            <span
              onClick={() => setSearch("")}
              className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200"
            >
              Search: {search} ✕
            </span>
          )}

          <button
            onClick={clearAll}
            className="ml-2 px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 text-sm"
          >
            Clear All
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* ====================== FILTER SECTION ======================= */}
        <aside className="md:col-span-1 bg-white shadow-lg rounded-2xl border p-5">

          <h2 className="text-lg font-semibold mb-3">Filter by Category</h2>

          {/* modern chip style */}
          <div className="flex flex-wrap gap-2">

            {CATEGORY_LIST.map((cat) => {
              const active = selectedCategories.includes(cat);

              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`
                    px-3 py-1 rounded-full text-sm border transition flex items-center gap-1
                    ${
                      active
                        ? "bg-orange-500 text-white border-orange-600 shadow-md scale-105"
                        : "bg-gray-100 hover:bg-gray-200"
                    }
                  `}
                >
                  {active && <span>✓</span>}
                  {cat}
                </button>
              );
            })}
          </div>

        </aside>

        {/* ===================== PUJA CARD LIST ======================== */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {filteredPujas.length === 0 ? (
            <p className="text-center col-span-3 text-gray-400 py-10">
              No pujas found. Try another search or filter.
            </p>
          ) : (
            filteredPujas.map((puja, index) => (
              <div
                key={index}
                className="
                  p-4 rounded-2xl border shadow
                  bg-white
                  hover:shadow-2xl hover:-translate-y-1 hover:border-orange-400
                  transition-all duration-300
                  cursor-pointer
                "
              >
                <img
                  src={puja.image}
                  alt={puja.name}
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />

                <h3 className="font-semibold text-lg">{puja.name}</h3>
                {/* <p className="text-sm text-gray-500">{puja.category}</p> */}
                <p className="text-sm text-gray-500">{puja.shortDescription}</p>
                <p className="text-orange-600 font-semibold mt-2">{puja.price}</p>
                <p className="text-sm text-gray-500">Duration: {puja.duration}</p>


                <p className="text-sm mt-2 text-gray-600 line-clamp-2">
                  {puja.description}
                </p>

                <button
  className="mt-3 w-full py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
  onClick={() => router.push(`/booking?puja=${encodeURIComponent(puja.name)}`)}
>
  Book Now
</button>

              </div>
            ))
          )}

        </div>
      </div>
    </section>
  );
}
