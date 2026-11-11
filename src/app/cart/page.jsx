"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  ShieldCheck,
  Package,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { language } = useLanguage();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
    deliveryFee,
    total,
    isLoaded,
  } = useCart();

  const isHindi = language === "hi";

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#faf7f4]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#a8441b] border-t-transparent" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#faf7f4] px-4 py-16 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-[#eadfd7] bg-white p-10 shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0e4] text-[#a8441b]">
            <ShoppingBag size={36} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[#2b221d]">
            {isHindi ? "आपकी कार्ट खाली है" : "Your Cart is Empty"}
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-[#736359] sm:text-sm">
            {isHindi
              ? "आपने अभी तक कोई पूजन सामग्री या प्रसाद कार्ट में नहीं जोड़ा है।"
              : "Looks like you haven't added any sacred puja kits or prasad yet."}
          </p>

          <Link
            href="/store"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#a8441b] px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#913712]"
          >
            <ArrowLeft size={16} />
            <span>{isHindi ? "स्टोर में सामग्री देखें" : "Explore Puja Store"}</span>
          </Link>
        </div>
      </div>
    );
  }

  const freeDeliveryThreshold = 499;
  const differenceForFreeDelivery = Math.max(
    0,
    freeDeliveryThreshold - subtotal
  );

  return (
    <div className="min-h-screen bg-[#faf7f4] text-[#28221f] pb-24">
      {/* HEADER */}
      <div className="border-b border-[#eadfd7] bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/store"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfd7] text-[#5c4f46] transition hover:bg-[#faf7f4] hover:text-[#a8441b]"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[#2b221d] sm:text-2xl">
                {isHindi ? "आपकी पूजन सामग्री कार्ट" : "Your Puja Cart"}
              </h1>
              <p className="text-xs text-[#7d6f66]">
                {totalItems} {isHindi ? "सामग्री शामिल" : "items in cart"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-[#a8441b] hover:underline"
          >
            {isHindi ? "कार्ट खाली करें" : "Clear Cart"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* FREE DELIVERY ALERT */}
        <div className="mb-6 rounded-2xl border border-[#eadfd7] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff0e4] text-[#a8441b]">
              <Truck size={20} />
            </div>
            <div className="flex-1">
              {differenceForFreeDelivery === 0 ? (
                <p className="text-xs font-bold text-[#26734d] sm:text-sm">
                  🎉 {isHindi ? "बधाई! आपके ऑर्डर पर मुफ़्त डिलीवरी उपलब्ध है।" : "Congratulations! Your order qualifies for FREE Delivery."}
                </p>
              ) : (
                <p className="text-xs font-medium text-[#443831] sm:text-sm">
                  {isHindi
                    ? `मुफ़्त डिलीवरी पाने के लिए ₹${differenceForFreeDelivery} की और सामग्री जोड़ें।`
                    : `Add ₹${differenceForFreeDelivery} more to qualify for FREE Delivery.`}
                </p>
              )}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#f0eae4]">
                <div
                  className="h-full bg-[#a8441b] transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      (subtotal / freeDeliveryThreshold) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* CART ITEMS LIST */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex flex-col gap-4 rounded-2xl border border-[#eadfd7] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#fbf5f0]">
                    <Image
                      src={product.image}
                      alt={isHindi ? product.titleHi : product.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#a8441b]">
                      {isHindi ? product.categoryLabelHi : product.categoryLabel}
                    </span>
                    <Link
                      href={`/store/${product.slug}`}
                      className="block font-bold text-sm text-[#2b221d] hover:text-[#a8441b] line-clamp-1"
                    >
                      {isHindi ? product.titleHi : product.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-[#7d6f66]">
                      {product.weight}
                    </p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-extrabold text-[#a8441b]">
                        ₹{product.price}
                      </span>
                      <span className="text-xs text-[#9d8e85] line-through">
                        ₹{product.originalPrice}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QUANTITY CONTROLS & DELETE */}
                <div className="flex items-center justify-between border-t border-[#f4efeb] pt-3 sm:border-t-0 sm:pt-0 gap-4">
                  <div className="flex h-9 items-center justify-between rounded-full border border-[#d8c8bd] bg-[#fffaf6] px-3 w-28">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="text-[#5c4f46] hover:text-[#a8441b]"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-xs font-bold text-[#2b221d]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="text-[#5c4f46] hover:text-[#a8441b]"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-extrabold text-[#2b221d]">
                      ₹{product.price * quantity}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    aria-label="Remove item"
                    className="p-1.5 text-[#9a8d85] hover:text-red-600 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Link
                href="/store"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a8441b] hover:underline"
              >
                <Plus size={14} />
                <span>
                  {isHindi ? "+ और सामग्री जोड़ें" : "+ Add more items"}
                </span>
              </Link>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-2xl border border-[#eadfd7] bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-[#2b221d]">
                {isHindi ? "ऑर्डर सारांश" : "Order Summary"}
              </h2>

              <div className="mt-4 space-y-3 text-xs sm:text-sm text-[#5c4f46]">
                <div className="flex justify-between">
                  <span>{isHindi ? "सामग्री का मूल्य (Subtotal)" : "Items Subtotal"}</span>
                  <span className="font-semibold text-[#2b221d]">₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>{isHindi ? "डिलीवरी शुल्क" : "Delivery Fee"}</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-[#26734d] font-bold">
                        {isHindi ? "मुफ़्त (FREE)" : "FREE"}
                      </span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="border-t border-[#f2eae4] pt-3 flex justify-between text-base font-extrabold text-[#2b221d]">
                  <span>{isHindi ? "कुल देय राशि" : "Total Amount"}</span>
                  <span className="text-xl text-[#a8441b]">₹{total}</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/checkout"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#a8441b] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#913712] active:scale-95 sm:text-sm"
                >
                  <span>{isHindi ? "चेकआउट करें" : "Proceed to Checkout"}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="mt-5 pt-4 border-t border-[#f4efeb] space-y-2 text-[11px] text-[#7d6f66]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#26734d]" />
                  <span>{isHindi ? "100% सुरक्षित एवं शुद्ध सामग्री" : "100% Authentic & Vedic Certified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-[#a8441b]" />
                  <span>{isHindi ? "कैश ऑन डिलीवरी (COD) उपलब्ध" : "Cash on Delivery Available"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
