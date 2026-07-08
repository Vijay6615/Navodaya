"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("login");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FFF8F4] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#FFF8F4] to-orange-50 flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-6">

          {/* Logo */}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-4xl shadow-lg">
              🪔
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Navodaya Puja
            </h1>

            <p className="text-sm text-[#8a7060] mt-2">
              Book pujas and manage your bookings
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-orange-50 rounded-2xl p-1 mb-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "login"
                  ? "bg-white shadow text-orange-700"
                  : "text-gray-500"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "signup"
                  ? "bg-white shadow text-orange-700"
                  : "text-gray-500"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* LOGIN FORM */}
          {activeTab === "login" && (
            <div className="space-y-4">

              <input
                type="email"
                placeholder="Email Address"
                className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-orange-300"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full h-12 rounded-xl border border-gray-300 px-4 pr-12 outline-none focus:ring-2 focus:ring-orange-300"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="text-right">
                <a
                  href="/forgot-password"
                  className="text-sm text-orange-600 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                className="w-full h-12 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition"
              >
                Login
              </button>
            </div>
          )}

          {/* SIGNUP FORM */}
          {activeTab === "signup" && (
            <div className="space-y-4">

              <input
                type="text"
                placeholder="Full Name"
                className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-orange-300"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-orange-300"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full h-12 rounded-xl border border-gray-300 px-4 pr-12 outline-none focus:ring-2 focus:ring-orange-300"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full h-12 rounded-xl border border-gray-300 px-4 pr-12 outline-none focus:ring-2 focus:ring-orange-300"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <button
                className="w-full h-12 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition"
              >
                Create Account
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Sign In */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full h-12 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition flex items-center justify-center gap-3 font-medium"
          >
            <svg width="20" height="20" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.85 2.08-1.81 2.72v2.26h2.92c1.71-1.57 2.69-3.89 2.69-6.62z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z"/>
              <path fill="#FBBC05" d="M3.97 10.71c-.18-.54-.28-1.11-.28-1.71s.1-1.17.28-1.71V4.96H.96C.35 6.18 0 7.55 0 9s.35 2.82.96 4.04l3.01-2.33z"/>
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
            </svg>

            Continue with Google
          </button>

          <p className="text-xs text-gray-400 text-center mt-6">
            Secure login powered by Google & Navodaya Puja
          </p>

        </div>
      </div>
    </section>
  );
}