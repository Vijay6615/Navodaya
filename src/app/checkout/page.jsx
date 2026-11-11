"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { cartItems, totalItems, subtotal, deliveryFee, total, clearCart } =
    useCart();

  const isHindi = language === "hi";

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    landmark: "",
    city: "Mumbai",
    pincode: "",
    paymentMethod: "cod",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
      !formData.pincode
    ) {
      setErrorMessage(
        isHindi
          ? "कृपया नाम, मोबाइल नंबर, पता और पिनकोड भरें।"
          : "Please fill in all required fields (Name, Phone, Address, Pincode)."
      );
      return;
    }

    if (formData.phone.replace(/\D/g, "").length < 10) {
      setErrorMessage(
        isHindi
          ? "कृपया सही 10-अंकों का मोबाइल नंबर दर्ज करें।"
          : "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
        },
        shippingAddress: {
          address: formData.address,
          landmark: formData.landmark,
          city: formData.city,
          pincode: formData.pincode,
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          title: item.product.title,
          titleHi: item.product.titleHi,
          price: item.product.price,
          quantity: item.quantity,
          weight: item.product.weight,
        })),
        pricing: {
          subtotal,
          deliveryFee,
          total,
        },
      };

      const res = await fetch("/api/store/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      setOrderSuccess(data.order);
      clearCart();
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.message ||
          (isHindi
            ? "ऑर्डर प्लेस करने में त्रुटि हुई। कृपया पुनः प्रयास करें।"
            : "Failed to place order. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#faf7f4] px-4 py-16 text-[#28221f]">
        <div className="mx-auto max-w-xl rounded-3xl border border-[#eadfd7] bg-white p-8 text-center shadow-md sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e9f7ef] text-[#26734d]">
            <CheckCircle2 size={46} />
          </div>

          <span className="mt-4 inline-block rounded-full bg-[#fcf4ee] px-3 py-1 text-xs font-bold text-[#a8441b]">
            {isHindi ? "ऑर्डर सफलतापूर्वक दर्ज हुआ" : "Order Placed Successfully"}
          </span>

          <h1 className="mt-2 text-2xl font-black text-[#2b221d] sm:text-3xl">
            {isHindi ? "जय श्री राम! धन्यवाद" : "Thank You For Your Order!"}
          </h1>

          <p className="mt-2 text-xs leading-relaxed text-[#6f625a] sm:text-sm">
            {isHindi
              ? "आपकी पवित्र पूजन सामग्री का ऑर्डर प्राप्त हो गया है। हमारी टीम जल्द ही इसे सुरक्षित रूप से पैक करके रवाना करेगी।"
              : "Your sacred order has been confirmed. Our team is carefully packing your authentic Vedic items."}
          </p>

          <div className="mt-6 rounded-2xl border border-[#f0ded2] bg-[#fffaf6] p-4 text-left text-xs sm:text-sm">
            <div className="flex justify-between py-1.5 border-b border-[#f2eae4]">
              <span className="text-[#7d6f66]">
                {isHindi ? "ऑर्डर आईडी" : "Order ID"}
              </span>
              <span className="font-bold text-[#2b221d]">
                {orderSuccess.orderId || orderSuccess._id}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#f2eae4]">
              <span className="text-[#7d6f66]">
                {isHindi ? "डिलीवरी का पता" : "Shipping To"}
              </span>
              <span className="font-semibold text-right text-[#2b221d] max-w-[200px]">
                {formData.fullName}, {formData.city} - {formData.pincode}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#f2eae4]">
              <span className="text-[#7d6f66]">
                {isHindi ? "भुगतान विधि" : "Payment"}
              </span>
              <span className="font-bold text-[#26734d]">
                {isHindi ? "कैश ऑन डिलीवरी (COD)" : "Cash on Delivery"}
              </span>
            </div>

            <div className="flex justify-between py-1.5 text-base font-extrabold text-[#a8441b]">
              <span>{isHindi ? "कुल राशि" : "Total Amount"}</span>
              <span>₹{total}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/store"
              className="flex-1 rounded-full bg-[#a8441b] py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#913712]"
            >
              {isHindi ? "और सामग्री देखें" : "Continue Shopping"}
            </Link>

            <Link
              href="/"
              className="flex-1 rounded-full border border-[#eadfd7] bg-white py-3 text-xs font-bold text-[#443831] transition hover:bg-[#faf7f4]"
            >
              {isHindi ? "होम पर जाएं" : "Back to Home"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART GUARD
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#faf7f4] px-4 py-20 text-center">
        <Package size={46} className="mx-auto text-[#caa996]" />
        <h2 className="mt-4 text-xl font-bold text-[#2b221d]">
          {isHindi ? "चेकआउट के लिए कोई सामग्री नहीं है" : "No items to checkout"}
        </h2>
        <Link
          href="/store"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#a8441b] px-6 py-2.5 text-xs font-bold text-white shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>{isHindi ? "स्टोर में सामग्री जोड़ें" : "Go to Store"}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f4] text-[#28221f] pb-24">
      {/* HEADER */}
      <div className="border-b border-[#eadfd7] bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Link
            href="/cart"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfd7] text-[#5c4f46] hover:bg-[#faf7f4] hover:text-[#a8441b]"
          >
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-xl font-bold text-[#2b221d] sm:text-2xl">
            {isHindi ? "सुरक्षित चेकआउट" : "Secure Checkout"}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT 2 COLS: CUSTOMER & ADDRESS DETAILS */}
          <div className="lg:col-span-2 space-y-6">
            {/* CONTACT DETAILS */}
            <div className="rounded-2xl border border-[#eadfd7] bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-bold text-[#2b221d]">
                <User size={18} className="text-[#a8441b]" />
                <span>
                  {isHindi ? "1. आपकी जानकारी" : "1. Customer Information"}
                </span>
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#5c4f46]">
                    {isHindi ? "पूरा नाम *" : "Full Name *"}
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={isHindi ? "उदा. रमेश शर्मा" : "e.g. Ramesh Sharma"}
                    className="mt-1 h-11 w-full rounded-xl border border-[#d8c8bd] bg-[#fffaf6] px-3.5 text-xs text-[#28221f] outline-none transition focus:border-[#a8441b] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5c4f46]">
                    {isHindi ? "मोबाइल नंबर (WhatsApp) *" : "Mobile Number (WhatsApp) *"}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className="mt-1 h-11 w-full rounded-xl border border-[#d8c8bd] bg-[#fffaf6] px-3.5 text-xs text-[#28221f] outline-none transition focus:border-[#a8441b] focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#5c4f46]">
                    {isHindi ? "ईमेल आईडी (वैकल्पिक)" : "Email Address (Optional)"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. devotee@example.com"
                    className="mt-1 h-11 w-full rounded-xl border border-[#d8c8bd] bg-[#fffaf6] px-3.5 text-xs text-[#28221f] outline-none transition focus:border-[#a8441b] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* SHIPPING ADDRESS */}
            <div className="rounded-2xl border border-[#eadfd7] bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-bold text-[#2b221d]">
                <MapPin size={18} className="text-[#a8441b]" />
                <span>
                  {isHindi ? "2. डिलीवरी का पता" : "2. Delivery Address"}
                </span>
              </h2>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5c4f46]">
                    {isHindi
                      ? "मकान नं, फ्लैट, बिल्डिंग एवं सड़क *"
                      : "Flat / House No., Building, Street *"}
                  </label>
                  <textarea
                    rows={3}
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={
                      isHindi
                        ? "उदा. फ्लैट 402, शांति निवास, स्टेशन रोड"
                        : "e.g. Flat 402, Shanti Niwas, Station Road"
                    }
                    className="mt-1 w-full rounded-xl border border-[#d8c8bd] bg-[#fffaf6] p-3 text-xs text-[#28221f] outline-none transition focus:border-[#a8441b] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#5c4f46]">
                      {isHindi ? "लैंडमार्क (पहचान चिन्ह)" : "Landmark"}
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      placeholder={isHindi ? "उदा. हनुमान मंदिर के पास" : "Near temple"}
                      className="mt-1 h-11 w-full rounded-xl border border-[#d8c8bd] bg-[#fffaf6] px-3.5 text-xs text-[#28221f] outline-none transition focus:border-[#a8441b] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5c4f46]">
                      {isHindi ? "शहर *" : "City / Region *"}
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai, Vasai, Virar"
                      className="mt-1 h-11 w-full rounded-xl border border-[#d8c8bd] bg-[#fffaf6] px-3.5 text-xs text-[#28221f] outline-none transition focus:border-[#a8441b] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5c4f46]">
                      {isHindi ? "पिनकोड *" : "Pincode *"}
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="400001"
                      className="mt-1 h-11 w-full rounded-xl border border-[#d8c8bd] bg-[#fffaf6] px-3.5 text-xs text-[#28221f] outline-none transition focus:border-[#a8441b] focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="rounded-2xl border border-[#eadfd7] bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-bold text-[#2b221d]">
                <CreditCard size={18} className="text-[#a8441b]" />
                <span>{isHindi ? "3. भुगतान विधि" : "3. Payment Method"}</span>
              </h2>

              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-3 rounded-xl border-2 border-[#a8441b] bg-[#fffaf6] p-4 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                    className="accent-[#a8441b]"
                  />
                  <div>
                    <span className="block text-xs font-bold text-[#2b221d] sm:text-sm">
                      {isHindi
                        ? "कैश ऑन डिलीवरी (Pay on Delivery / COD)"
                        : "Cash on Delivery / UPI upon Delivery"}
                    </span>
                    <span className="block text-[11px] text-[#7d6f66]">
                      {isHindi
                        ? "सामग्री प्राप्त होने पर नकद या UPI द्वारा भुगतान करें।"
                        : "Pay cash or scan UPI when your package arrives safely."}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
                ⚠️ {errorMessage}
              </div>
            )}
          </div>

          {/* RIGHT COL: ORDER SUMMARY & SUBMIT */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-2xl border border-[#eadfd7] bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2b221d]">
                {isHindi ? "ऑर्डर की सामग्री" : "Items in Order"} ({totalItems})
              </h3>

              <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                {cartItems.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between text-xs py-2 border-b border-[#f4efeb] last:border-b-0"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-[#2b221d] line-clamp-1">
                        {isHindi ? product.titleHi : product.title}
                      </p>
                      <p className="text-[10px] text-[#7d6f66]">
                        {quantity} × ₹{product.price}
                      </p>
                    </div>
                    <span className="font-bold text-[#2b221d]">
                      ₹{product.price * quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#f2eae4] space-y-2 text-xs text-[#5c4f46]">
                <div className="flex justify-between">
                  <span>{isHindi ? "सबटोटल" : "Subtotal"}</span>
                  <span className="font-semibold text-[#2b221d]">₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>{isHindi ? "डिलीवरी शुल्क" : "Delivery"}</span>
                  <span className="font-semibold text-[#26734d]">
                    {deliveryFee === 0
                      ? isHindi
                        ? "मुफ़्त (FREE)"
                        : "FREE"
                      : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-[#f2eae4] text-base font-extrabold text-[#2b221d]">
                  <span>{isHindi ? "कुल राशि" : "Total"}</span>
                  <span className="text-xl text-[#a8441b]">₹{total}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#a8441b] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#913712] disabled:opacity-50 active:scale-95"
              >
                {isSubmitting ? (
                  <span>{isHindi ? "ऑर्डर दर्ज हो रहा है..." : "Placing Order..."}</span>
                ) : (
                  <>
                    <span>
                      {isHindi ? "ऑर्डर कन्फर्म करें (₹" + total + ")" : `Place Order (₹${total})`}
                    </span>
                  </>
                )}
              </button>

              <div className="mt-4 space-y-1.5 text-center text-[10px] text-[#8f837c]">
                <p>🔒 256-bit Secure Encryption</p>
                <p>🕉️ 100% Authentic Vedic Assurance</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
