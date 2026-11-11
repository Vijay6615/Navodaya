"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Minus,
  Package,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import { STORE_PRODUCTS } from "../../data/storeData";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { language } = useLanguage();
  const { addToCart } = useCart();

  const isHindi = language === "hi";
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  const product = useMemo(() => {
    return STORE_PRODUCTS.find((p) => p.slug === unwrappedParams.slug);
  }, [unwrappedParams.slug]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return STORE_PRODUCTS.filter(
      (p) => p.category === product.category && p.id !== product.id
    ).slice(0, 3);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#faf7f4] px-4 py-20 text-center">
        <Package size={50} className="mx-auto text-[#caa996]" />
        <h1 className="mt-4 text-2xl font-bold text-[#2b221d]">
          {isHindi ? "सामग्री नहीं मिली" : "Product Not Found"}
        </h1>
        <p className="mt-2 text-sm text-[#736359]">
          {isHindi
            ? "यह सामग्री वर्तमान में उपलब्ध नहीं है।"
            : "The item you are looking for does not exist or has been moved."}
        </p>
        <Link
          href="/store"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#a8441b] px-6 py-2.5 text-xs font-bold text-white shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>{isHindi ? "स्टोर पर वापस जाएं" : "Back to Store"}</span>
        </Link>
      </div>
    );
  }

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: isHindi ? product.titleHi : product.title,
          text: isHindi ? product.shortDescriptionHi : product.shortDescription,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f4] text-[#28221f] pb-24">
      {/* BREADCRUMB */}
      <div className="border-b border-[#eadfd7] bg-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center gap-2 text-xs font-medium text-[#7d6f66]">
          <Link href="/" className="hover:text-[#a8441b]">
            {isHindi ? "होम" : "Home"}
          </Link>
          <ChevronRight size={13} />
          <Link href="/store" className="hover:text-[#a8441b]">
            {isHindi ? "स्टोर" : "Store"}
          </Link>
          <ChevronRight size={13} />
          <span className="truncate text-[#2b221d] font-semibold max-w-[200px] sm:max-w-none">
            {isHindi ? product.titleHi : product.title}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* LEFT: IMAGE & BADGES */}
          <div>
            <div className="relative h-[340px] w-full overflow-hidden rounded-[28px] border border-[#eadfd7] bg-[#fbf5f0] shadow-sm sm:h-[460px]">
              <Image
                src={product.image}
                alt={isHindi ? product.titleHi : product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="absolute left-4 top-4 flex flex-col gap-2">
                <span className="rounded-full bg-[#a8441b] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                  {isHindi ? product.badgeHi : product.badge}
                </span>
                {discountPercent > 0 && (
                  <span className="w-fit rounded-full bg-[#26734d] px-3 py-1 text-xs font-extrabold text-white shadow-md">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              <div className="absolute right-4 top-4">
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share product"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#332c28] shadow-md backdrop-blur-md transition hover:bg-white hover:text-[#a8441b]"
                >
                  <Share2 size={18} />
                </button>
                {copied && (
                  <span className="absolute right-0 top-12 whitespace-nowrap rounded-md bg-black px-2 py-1 text-[11px] text-white">
                    {isHindi ? "लिंक कॉपी हो गया!" : "Link copied!"}
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                {product.weight}
              </div>
            </div>

            {/* TRUST HIGHLIGHTS */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center rounded-2xl border border-[#eadfd7] bg-white p-3 text-center shadow-sm">
                <ShieldCheck size={22} className="text-[#26734d]" />
                <span className="mt-1 text-[11px] font-bold text-[#332c28]">
                  {isHindi ? "100% शुद्ध वैदिक" : "100% Pure Vedic"}
                </span>
                <span className="text-[10px] text-[#7d6f66]">
                  {isHindi ? "बिना मिलावट" : "Zero adulteration"}
                </span>
              </div>

              <div className="flex flex-col items-center rounded-2xl border border-[#eadfd7] bg-white p-3 text-center shadow-sm">
                <Truck size={22} className="text-[#a8441b]" />
                <span className="mt-1 text-[11px] font-bold text-[#332c28]">
                  {isHindi ? "तीव्र डिलीवरी" : "Express Delivery"}
                </span>
                <span className="text-[10px] text-[#7d6f66]">
                  {isHindi ? "सुरक्षित पैकिंग" : "Safe packaging"}
                </span>
              </div>

              <div className="flex flex-col items-center rounded-2xl border border-[#eadfd7] bg-white p-3 text-center shadow-sm">
                <Sparkles size={22} className="text-[#315ea8]" />
                <span className="mt-1 text-[11px] font-bold text-[#332c28]">
                  {isHindi ? "मंत्र अभिमंत्रित" : "Sanctified"}
                </span>
                <span className="text-[10px] text-[#7d6f66]">
                  {isHindi ? "पंडित जी प्रमाणित" : "Pandit approved"}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILS, CHECKLIST, ADD TO CART */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#a8441b]">
                {isHindi ? product.categoryLabelHi : product.categoryLabel}
              </span>

              <h1 className="mt-2 text-2xl font-extrabold text-[#28221f] sm:text-3xl">
                {isHindi ? product.titleHi : product.title}
              </h1>

              {/* RATING & REVIEWS */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-md bg-[#26734d] px-2 py-0.5 text-xs font-bold text-white">
                  <span>{product.rating}</span>
                  <Star size={12} className="fill-white" />
                </div>
                <span className="text-xs text-[#7d6f66]">
                  {product.reviewsCount}{" "}
                  {isHindi ? "भक्तों द्वारा प्रमाणित" : "Verified Devotee Reviews"}
                </span>
                <span className="text-xs font-semibold text-[#26734d]">
                  ✓ {isHindi ? "स्टॉक में उपलब्ध" : "In Stock"}
                </span>
              </div>

              {/* PRICING */}
              <div className="mt-6 rounded-2xl border border-[#f0ded2] bg-[#fffaf6] p-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-[#a8441b]">
                    ₹{product.price}
                  </span>
                  <span className="text-base text-[#9d8e85] line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="rounded-md bg-[#e9f7ef] px-2 py-0.5 text-xs font-bold text-[#26734d]">
                    {discountPercent}% {isHindi ? "बचत" : "OFF"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#6e5d54]">
                  {isHindi
                    ? "सभी टैक्स सम्मिलित • ₹499 से अधिक के ऑर्डर पर फ्री डिलीवरी"
                    : "Inclusive of all taxes • Free delivery on orders above ₹499"}
                </p>
              </div>

              {/* DESCRIPTION */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-[#332c28]">
                  {isHindi ? "विवरण एवं महत्व" : "Description & Significance"}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#685950] sm:text-sm">
                  {isHindi ? product.descriptionHi : product.description}
                </p>
              </div>

              {/* ITEMS INCLUDED CHECKLIST */}
              <div className="mt-6 rounded-2xl border border-[#eadfd7] bg-white p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-[#332c28]">
                  <CheckCircle2 size={18} className="text-[#26734d]" />
                  <span>
                    {isHindi
                      ? "इस किट/पैकेट में क्या-क्या शामिल है?"
                      : "Items Included in this Box"}
                  </span>
                </h3>

                <ul className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 text-[#5c4f46]">
                  {(isHindi
                    ? product.itemsIncludedHi
                    : product.itemsIncluded
                  ).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e9f7ef] text-[#26734d]">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-3 border-t border-[#f2eae4] flex items-center justify-between text-[11px] text-[#7d6f66]">
                  <span>
                    🛡️ {isHindi ? product.purityGuaranteeHi : product.purityGuarantee}
                  </span>
                </div>
              </div>

              {/* QUANTITY & ACTIONS */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-12 w-36 items-center justify-between rounded-full border border-[#d8c8bd] bg-white px-4 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="text-[#5c4f46] disabled:opacity-30 hover:text-[#a8441b]"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm font-bold text-[#2b221d]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-[#5c4f46] hover:text-[#a8441b]"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="flex flex-1 items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-full h-12 px-6 text-sm font-bold transition-all active:scale-95 ${
                      added
                        ? "bg-[#26734d] text-white"
                        : "border border-[#a8441b] bg-[#fffaf6] text-[#a8441b] hover:bg-[#fff0e4]"
                    }`}
                  >
                    {added ? (
                      <>
                        <Check size={18} />
                        <span>{isHindi ? "कार्ट में जुड़ गया!" : "Added to Cart!"}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={18} />
                        <span>{isHindi ? "कार्ट में जोड़ें" : "Add to Cart"}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full h-12 bg-[#a8441b] px-6 text-sm font-bold text-white shadow-md transition-all hover:bg-[#913712] active:scale-95"
                  >
                    <span>{isHindi ? "अभी खरीदें" : "Buy Now"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#eadfd7]">
            <h2 className="text-xl font-bold text-[#2b221d]">
              {isHindi ? "संबंधित सामग्री एवं किट्स" : "Related Sacred Items"}
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/store/${rel.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#eadfd7] bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-44 w-full overflow-hidden rounded-xl bg-[#fbf5f0]">
                    <Image
                      src={rel.image}
                      alt={isHindi ? rel.titleHi : rel.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition group-hover:scale-105"
                    />
                  </div>
                  <h4 className="mt-3 font-bold text-sm text-[#2b221d] group-hover:text-[#a8441b] line-clamp-1">
                    {isHindi ? rel.titleHi : rel.title}
                  </h4>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-extrabold text-[#a8441b]">
                      ₹{rel.price}
                    </span>
                    <span className="text-xs text-[#9d8e85] line-through">
                      ₹{rel.originalPrice}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
