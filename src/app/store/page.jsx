"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingBag,
  Star,
  Check,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  Package,
} from "lucide-react";

import { STORE_CATEGORIES, STORE_PRODUCTS } from "../data/storeData";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

export default function StorePage() {
  const { language } = useLanguage();
  const { addToCart, cartItems, totalItems, subtotal } = useCart();

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedIds, setAddedIds] = useState({});

  const isHindi = language === "hi";

  const filteredProducts = useMemo(() => {
    return STORE_PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;

      const title = (product.title || "").toLowerCase();
      const titleHi = (product.titleHi || "").toLowerCase();
      const desc = (product.description || "").toLowerCase();
      const descHi = (product.descriptionHi || "").toLowerCase();

      const matchesSearch =
        title.includes(q) ||
        titleHi.includes(q) ||
        desc.includes(q) ||
        descHi.includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#faf7f4] text-[#28221f] pb-24">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#eadfd7] bg-gradient-to-b from-[#fffaf6] via-[#fff5ee] to-[#faf7f4] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-[#2b221d]">
            {isHindi ? (
              <>
                पूजा धाम <span className="text-[#a8441b]">शुद्ध सामग्री</span>{" "}
                एवं महाप्रसाद स्टोर
              </>
            ) : (
              <>
                Puja Dham <span className="text-[#a8441b]">Sacred Store</span>{" "}
                & Mahaprasad
              </>
            )}
          </h1>

          {/* TRUST PILLS */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-[#5c4f46]">
            <div className="flex items-center gap-1.5 rounded-full border border-[#ebdcd1] bg-white px-3.5 py-1.5 shadow-sm">
              <ShieldCheck size={16} className="text-[#26734d]" />
              <span>{isHindi ? "100% शुद्धता की गारंटी" : "100% Pure & Vedic"}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-[#ebdcd1] bg-white px-3.5 py-1.5 shadow-sm">
              <Truck size={16} className="text-[#a8441b]" />
              <span>
                {isHindi ? "₹499 से अधिक पर मुफ़्त डिलीवरी" : "Free Delivery above ₹499"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-[#ebdcd1] bg-white px-3.5 py-1.5 shadow-sm">
              <Package size={16} className="text-[#315ea8]" />
              <span>
                {isHindi ? "पे ऑन डिलीवरी (COD) उपलब्ध" : "Pay on Delivery Available"}
              </span>
            </div>
          </div>

          {/* SEARCH BOX */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative flex items-center">
              <Search
                size={18}
                className="absolute left-4 text-[#9a8d85]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isHindi
                    ? "सामग्री, किट या प्रसाद खोजें..."
                    : "Search puja kit, havan samagri, prasad..."
                }
                className="h-12 w-full rounded-full border border-[#e5d8cd] bg-white pl-11 pr-4 text-sm shadow-[0_4px_20px_rgba(40,34,31,0.06)] outline-none transition focus:border-[#a8441b] focus:ring-2 focus:ring-[#a8441b]/10 placeholder:text-[#9e9087]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs font-semibold text-[#8f837c] hover:text-[#a8441b]"
                >
                  {isHindi ? "हटाएं" : "Clear"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY SELECTOR */}
      <section className="sticky top-[78px] z-20 border-b border-[#eadfd7] bg-white/95 px-4 py-3 backdrop-blur-md lg:top-[88px]">
        <div className="mx-auto flex max-w-6xl items-center justify-start gap-2 overflow-x-auto no-scrollbar sm:justify-center">
          {STORE_CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  active
                    ? "bg-[#a8441b] text-white shadow-sm"
                    : "bg-[#f5ede6] text-[#5c4f46] hover:bg-[#ebdcd1]"
                }`}
              >
                {isHindi ? cat.labelHi : cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-4">
          <p className="text-xs font-medium text-[#7d6f66] sm:text-sm">
            {isHindi
              ? `${filteredProducts.length} सामग्री उपलब्ध`
              : `Showing ${filteredProducts.length} items`}
          </p>

          <Link
            href="/cart"
            className="flex items-center gap-1.5 text-xs font-bold text-[#a8441b] hover:underline"
          >
            <span>{isHindi ? "कार्ट देखें" : "View Cart"}</span>
            <span className="rounded-full bg-[#fff0e4] px-2 py-0.5 text-[11px]">
              {totalItems}
            </span>
          </Link>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-[#eadfd7] bg-white p-12 text-center">
            <Package size={48} className="mx-auto text-[#caa996]" />
            <h3 className="mt-4 text-base font-bold text-[#332c28]">
              {isHindi ? "कोई सामग्री नहीं मिली" : "No items found"}
            </h3>
            <p className="mt-1 text-xs text-[#7d6f66]">
              {isHindi
                ? "कृपया अन्य शब्द से खोजें या फ़िल्टर बदलें।"
                : "Try a different search query or select another category."}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-4 rounded-full bg-[#a8441b] px-5 py-2 text-xs font-semibold text-white shadow-sm"
            >
              {isHindi ? "सभी सामग्री देखें" : "View All Products"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const isAdded = addedIds[product.id];
              const discountPercent = Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
              );

              return (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#eadfd7] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(67,39,22,0.08)]"
                >
                  <Link
                    href={`/store/${product.slug}`}
                    className="block overflow-hidden"
                  >
                    <div className="relative h-56 w-full overflow-hidden bg-[#fbf5f0]">
                      <Image
                        src={product.image}
                        alt={isHindi ? product.titleHi : product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                      {/* BADGES */}
                      <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                        <span className="rounded-full bg-[#a8441b] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow">
                          {isHindi ? product.badgeHi : product.badge}
                        </span>
                        {discountPercent > 0 && (
                          <span className="w-fit rounded-full bg-[#26734d] px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-[#5c4f46] backdrop-blur-sm">
                        {product.weight}
                      </div>

                      {/* RATING */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                        <Star
                          size={13}
                          className="fill-amber-400 text-amber-400"
                        />
                        <span>{product.rating}</span>
                        <span className="text-[10px] text-white/80">
                          ({product.reviewsCount})
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* BODY */}
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#a8441b]">
                      {isHindi ? product.categoryLabelHi : product.categoryLabel}
                    </span>

                    <Link
                      href={`/store/${product.slug}`}
                      className="mt-1 block font-bold text-[#2b221d] transition-colors hover:text-[#a8441b] line-clamp-2"
                    >
                      {isHindi ? product.titleHi : product.title}
                    </Link>

                    <p className="mt-2 text-xs leading-relaxed text-[#6f625a] line-clamp-2">
                      {isHindi
                        ? product.shortDescriptionHi
                        : product.shortDescription}
                    </p>

                    {/* ITEMS INCLUDED PREVIEW */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(isHindi
                        ? product.itemsIncludedHi
                        : product.itemsIncluded
                      )
                        .slice(0, 3)
                        .map((item, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-[#faf3ed] px-2 py-0.5 text-[10px] font-medium text-[#735e53]"
                          >
                            ✓ {item}
                          </span>
                        ))}
                      {product.itemsIncluded.length > 3 && (
                        <span className="rounded-md bg-[#f0eae4] px-1.5 py-0.5 text-[10px] font-semibold text-[#8a766a]">
                          +{product.itemsIncluded.length - 3}{" "}
                          {isHindi ? "अन्य" : "more"}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#f2eae4] flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-[#a8441b]">
                            ₹{product.price}
                          </span>
                          <span className="text-xs text-[#9d8e85] line-through">
                            ₹{product.originalPrice}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#26734d] font-semibold">
                          {isHindi ? "कर सहित" : "Inclusive of all taxes"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(product, e)}
                          className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-bold transition-all active:scale-95 ${
                            isAdded
                              ? "bg-[#26734d] text-white"
                              : "bg-[#a8441b] text-white hover:bg-[#913712] shadow-sm"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check size={14} />
                              <span>{isHindi ? "जुड़ गया" : "Added"}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={14} />
                              <span>
                                {isHindi ? "कार्ट में जोड़ें" : "Add to Cart"}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* FLOATING CART BAR ON BOTTOM (WHEN CART HAS ITEMS) */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-xl">
          <div className="flex items-center justify-between rounded-full border border-[#f0ded2] bg-[#28221f] px-5 py-3 text-white shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#a8441b] text-sm font-bold text-white">
                {totalItems}
              </span>
              <div>
                <p className="text-xs text-[#d5c9c1]">
                  {isHindi ? "कुल राशि (सबटोटल)" : "Cart Subtotal"}
                </p>
                <p className="text-sm font-bold text-white">₹{subtotal}</p>
              </div>
            </div>

            <Link
              href="/cart"
              className="flex items-center gap-2 rounded-full bg-[#a8441b] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#913712]"
            >
              <span>{isHindi ? "कार्ट देखें" : "View Cart"}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
