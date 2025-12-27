"use client";

import { useState } from "react";
import { PUJAS } from "../pujasData";
import PujasPreview from "../components/PujasPreview";

export default function PujasPage() {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // FILTER LOGIC
  const filteredPujas =
    selectedCategories.length === 0
      ? PUJAS
      : PUJAS.filter((puja) =>
          selectedCategories.includes(puja.category)
        );

  return (
    <section className="page-section">
      <h1 className="page-title">Our Pujas</h1>
      <p className="page-subtitle">{filteredPujas.length} pujas available</p>

      <div className="two-col pujas-layout">

        {/* FILTER SIDEBAR */}
        <aside className="puja-filters">
          <h3>Categories</h3>

          <label>
            <input
              type="checkbox"
              onChange={() => toggleCategory("Deity Puja")}
            />
            Deity Puja
          </label>

          <label>
            <input
              type="checkbox"
              onChange={() => toggleCategory("Home / Auspicious")}
            />
            Home / Auspicious
          </label>

          <label>
            <input
              type="checkbox"
              onChange={() => toggleCategory("Astrology")}
            />
            Astrology
          </label>

          <label>
            <input
              type="checkbox"
              onChange={() => toggleCategory("Havan & Special")}
            />
            Havan & Special
          </label>
        </aside>

        {/* PUJA LIST */}
        <div className="pujas-list">
          <PujasPreview data={filteredPujas} />
        </div>
      </div>
    </section>
  );
}
