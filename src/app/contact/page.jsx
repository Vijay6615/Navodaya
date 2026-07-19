"use client";

import { useEffect, useState } from "react";
import { Cormorant_Garamond } from "next/font/google";
import emailjs from "@emailjs/browser";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  X,
} from "lucide-react";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const pujas = [
  "Others",
  "Ganesh Puja",
  "Satyanarayan Puja",
  "Rudrabhishek",
  "Mahamrityunjay Jaap",
  "Lakshmi Puja",
  "Griha Pravesh Puja",
  "Bhoomi Puja",
  "Vastu Shanti Puja",
  "Navagraha Shanti",
  "Kaal Sarp Dosh Puja",
  "Naamkaran Sanskar",
  "Mundan Sanskar",
  "Pitru Dosh Puja",
  "Shiv Puja / Rudrabhishek",
  "Durga Puja",
  "Vishnu Puja",
  "Rahu–Ketu Shanti Puja",
  "Dhan Prapti Havan",
  "Shanti Havan",
  "Saraswati Puja",
  "SundarKand Path",
  "Hanuman Chalisa Path",
  "Akhand Ramayan Path",
  "Office Opening Puja",
];

export default function ContactPage() {
  const { status } = useSession();
  const router = useRouter();

  const isLoggedIn = status === "authenticated";

  const requireLogin = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return false;
    }
    return true;
  };

  const [pageReady, setPageReady] = useState(false);

  const [form, setForm] = useState({
    name: "",
    surname: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    puja: "",
    message: "",
  });

  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => setPageReady(true), 80);

    return () => clearTimeout(timer);
  }, []);

  const showToast = (type, message) => {
    setToast({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setToast({
        show: false,
        type: "",
        message: "",
      });
    }, 4000);
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    if (!requireLogin()) return;

    try {
      setLoading(true);

      await emailjs.send(
        "service_lsuicww",
        "template_2ki9qd8",
        form,
        "gGm69Djy_97dOYF1O"
      );

      showToast("success", "Message sent successfully 🙏");

      setForm({
        name: "",
        surname: "",
        age: "",
        gender: "",
        email: "",
        phone: "",
        puja: "",
        message: "",
      });
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredPujas = pujas.filter((puja) =>
    puja.toLowerCase().includes(form.puja.toLowerCase())
  );

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#28221f]">
      {/* TOAST */}

      {toast.show && (
        <div
          className={`
            contactToast
            fixed
            right-5
            top-6
            z-[9999]
            flex
            max-w-[360px]
            items-center
            gap-3
            rounded-2xl
            border
            bg-white
            px-5
            py-4
            shadow-[0_20px_60px_rgba(40,20,10,0.16)]

            ${
              toast.type === "success"
                ? "border-green-100"
                : "border-red-100"
            }
          `}
        >
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              toast.type === "success"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />

          <p className="flex-1 text-sm font-semibold text-[#4b403a]">
            {toast.message}
          </p>

          <button
            type="button"
            onClick={() =>
              setToast((prev) => ({
                ...prev,
                show: false,
              }))
            }
            className="text-gray-400 transition hover:text-[#a8441b]"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <section className="relative">
        {/* BACKGROUND */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 top-20 h-[440px] w-[440px] rounded-full bg-[#fff4ed] blur-[110px]" />

          <div className="absolute -right-40 top-80 h-[460px] w-[460px] rounded-full bg-[#faf1eb] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-[1280px] px-5 py-12 sm:px-8 md:py-16 lg:px-10 lg:py-20">
          {/* HEADING */}

          <div
            className={`max-w-4xl transition-all duration-1000 ease-out ${
              pageReady
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            

            <h1
              className={`${displayFont.className} mt-5 text-[47px] font-semibold leading-[0.94] tracking-[-0.035em] sm:text-6xl lg:text-[78px]`}
            >
              Guidance begins
              <br />
              with a conversation.
            </h1>
          </div>

          {/* MAIN */}

          <div className="mt-12 grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:gap-10">
            {/* CONTACT INFO */}

            <div
              className={`flex flex-col justify-between border border-[#eee8e2] bg-[#431407] p-7 text-white transition-all delay-150 duration-1000 ease-out sm:p-9 lg:p-11 ${
                pageReady
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-14 opacity-0"
              }`}
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                  Contact Information
                </p>

                <h2
                  className={`${displayFont.className} mt-5 text-4xl font-semibold leading-[1] sm:text-5xl`}
                >
                  We&apos;re here to
                  <br />
                  guide you.
                </h2>

                <div className="mt-10 space-y-3">
                  <ContactItem
                    icon={<MapPin size={18} />}
                    label="Location"
                    value="Mumbai / Palghar"
                  />

                  <ContactItem
                    icon={<Phone size={18} />}
                    label="Phone"
                    value="Click to call"
                    href="tel:+919594943609"
                    requireLogin={requireLogin}
                  />

                  <ContactItem
                    icon={<MessageCircle size={18} />}
                    label="WhatsApp"
                    value="Available"
                    href="https://wa.me/919594943609"
                    requireLogin={requireLogin}
                  />

                  <ContactItem
                    icon={<Mail size={18} />}
                    label="Email"
                    value="pujadham@gmail.com"
                    href="mailto:pujadham@gmail.com"
                    requireLogin={requireLogin}
                  />
                </div>
              </div>

              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                Mantra · Vidhi · Aastha
              </p>
            </div>

            {/* FORM */}

            <div
              className={`border border-[#eee8e2] bg-[#fffdfb] p-6 transition-all delay-300 duration-1000 ease-out sm:p-9 lg:p-11 ${
                pageReady
                  ? "translate-x-0 opacity-100"
                  : "translate-x-14 opacity-0"
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a8441b]">
                Send a message
              </p>

              <h2
                className={`${displayFont.className} mt-4 text-4xl font-semibold leading-none tracking-[-0.025em] sm:text-5xl`}
              >
                Tell us how we can help.
              </h2>

              <form
                onSubmit={sendEmail}
                className="mt-9 space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    name="name"
                    placeholder="First Name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="contactInput"
                  />

                  <input
                    name="surname"
                    placeholder="Surname"
                    required
                    value={form.surname}
                    onChange={handleChange}
                    className="contactInput"
                  />

                  <input
                    name="age"
                    type="number"
                    placeholder="Age"
                    required
                    value={form.age}
                    onChange={handleChange}
                    className="contactInput"
                  />

                  <select
                    name="gender"
                    required
                    value={form.gender}
                    onChange={handleChange}
                    className="contactInput"
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>

                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="contactInput"
                  />

                  <input
                    name="phone"
                    placeholder="Phone Number"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    className="contactInput"
                  />
                </div>

                {/* PUJA SEARCH */}

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search or select Puja"
                    value={form.puja}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        puja: e.target.value,
                      }));

                      setShowList(true);
                    }}
                    onFocus={() => setShowList(true)}
                    className="contactInput"
                  />

                  {showList && (
                    <div className="pujaList absolute z-50 mt-2 max-h-52 w-full overflow-y-auto rounded-2xl border border-[#eee8e2] bg-white p-2 shadow-[0_20px_50px_rgba(50,25,10,0.12)]">
                      {filteredPujas.map((puja) => (
                        <button
                          key={puja}
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              puja,
                            }));

                            setShowList(false);
                          }}
                          className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-[#574b44] transition hover:bg-[#fff6f0] hover:text-[#a8441b]"
                        >
                          {puja}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <textarea
                  name="message"
                  rows={4}
                  placeholder="Describe your requirement"
                  required
                  value={form.message}
                  onChange={handleChange}
                  className="contactInput resize-none"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full bg-[#a8441b] px-7 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#873515] hover:shadow-[0_16px_35px_rgba(168,68,27,0.24)] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {loading ? "Sending..." : "Send Message"}

                  {!loading && (
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .contactInput {
          width: 100%;
          min-height: 54px;
          border: 1px solid #ebe3de;
          border-radius: 14px;
          padding: 0 17px;
          background: #ffffff;
          color: #28221f;
          font-size: 14px;
          outline: none;
          transition:
            border-color 0.3s ease,
            box-shadow 0.3s ease,
            transform 0.3s ease;
        }

        textarea.contactInput {
          padding-top: 16px;
        }

        .contactInput::placeholder {
          color: #a39790;
        }

        .contactInput:hover {
          border-color: #ddcbc0;
        }

        .contactInput:focus {
          border-color: #a8441b;
          box-shadow: 0 0 0 4px rgba(168, 68, 27, 0.07);
          transform: translateY(-1px);
        }

        .contactToast {
          animation: contactToast 0.5s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .pujaList {
          animation: pujaListReveal 0.35s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes contactToast {
          from {
            opacity: 0;
            transform: translateX(30px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pujaListReveal {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </main>
  );
}

function ContactItem({ icon, label, value, href, requireLogin }) {
  const content = (
    <div className="group flex items-center gap-4 border-b bordder-[#6b2a18] bg-[#541b0d] px-4 py-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/80 transition duration-300 group-hover:bg-white group-hover:text-[#431407]">
        {icon}
      </div>

      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-white">
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <button
        type="button"
        onClick={() => {
          if (!requireLogin()) return;

          if (href.startsWith("https")) {
            window.open(href, "_blank", "noopener,noreferrer");
          } else {
            window.location.href = href;
          }
        }}
        className="block w-full text-left"
      >
        {content}
      </button>
    );
  }

  return content;
}
