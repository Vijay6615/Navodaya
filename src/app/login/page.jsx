"use client";

import { useEffect, useState } from "react";
import {
  signIn,
  useSession,
} from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState("login");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  // ==========================================
  // LOGIN FORM
  // ==========================================
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // ==========================================
  // SIGNUP FORM
  // ==========================================
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ==========================================
  // AUTHENTICATED → HOME
  // ==========================================
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  // ==========================================
  // TAB CHANGE
  // ==========================================
  const changeTab = (tab) => {
    setActiveTab(tab);
    setMessage("");
    setMessageType("");
  };

  // ==========================================
  // NORMAL LOGIN
  // ==========================================
  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (
      !loginForm.email ||
      !loginForm.password
    ) {
      setMessage("Please fill all fields");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const result = await signIn(
        "credentials",
        {
          email: loginForm.email,
          password: loginForm.password,
          redirect: false,
        }
      );

      if (result?.error) {
        setMessage(
          "Invalid email or password"
        );
        setMessageType("error");
        return;
      }

      if (result?.ok) {
        setMessage("Login successful");
        setMessageType("success");

        router.replace("/");
        router.refresh();
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong. Please try again."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CREATE ACCOUNT
  // ==========================================
  const handleSignup = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (
      !signupForm.name ||
      !signupForm.email ||
      !signupForm.password ||
      !signupForm.confirmPassword
    ) {
      setMessage("Please fill all fields");
      setMessageType("error");
      return;
    }

    if (
      signupForm.password !==
      signupForm.confirmPassword
    ) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    if (signupForm.password.length < 6) {
      setMessage(
        "Password must be at least 6 characters"
      );

      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: signupForm.name,
            email: signupForm.email,
            password: signupForm.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to create account"
        );

        setMessageType("error");
        return;
      }

      // SUCCESS
      setMessage(
        "Account created successfully. Please login."
      );

      setMessageType("success");

      // Copy signup email into login form
      setLoginForm({
        email: signupForm.email,
        password: "",
      });

      // Clear signup
      setSignupForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Switch to login after short delay
      setTimeout(() => {
        setActiveTab("login");
      }, 1000);

    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong. Please try again."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GOOGLE LOGIN
  // ==========================================
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      await signIn("google", {
        callbackUrl: "/",
      });
    } catch (error) {
      console.error(error);

      setGoogleLoading(false);

      setMessage(
        "Google login failed"
      );

      setMessageType("error");
    }
  };

  // ==========================================
  // SESSION LOADING
  // ==========================================
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FFF8F4] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  // ==========================================
  // REDIRECT SCREEN
  // ==========================================
  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-[#FFF8F4] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#FFF8F4] via-white to-orange-50 flex items-center justify-center px-5 py-10">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(194,65,12,0.12)] border border-orange-100 p-6 sm:p-8">

          {/* LOGO */}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-4xl shadow-lg shadow-orange-200">
              🪔
            </div>
          </div>

          {/* HEADING */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Navodaya Puja
            </h1>

            <p className="text-sm text-[#8a7060] mt-2">
              Book pujas and manage your bookings
            </p>
          </div>

          {/* TABS */}
          <div className="flex bg-orange-50 rounded-2xl p-1 mb-5">

            <button
              type="button"
              onClick={() =>
                changeTab("login")
              }
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "login"
                  ? "bg-white shadow-sm text-orange-700"
                  : "text-gray-500"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() =>
                changeTab("signup")
              }
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "signup"
                  ? "bg-white shadow-sm text-orange-700"
                  : "text-gray-500"
              }`}
            >
              Sign Up
            </button>

          </div>

          {/* MESSAGE */}
          {message && (
            <div
              className={`mb-5 px-4 py-3 rounded-xl flex items-start gap-2 text-sm font-medium ${
                messageType === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle2
                  size={18}
                  className="shrink-0 mt-0.5"
                />
              ) : (
                <AlertCircle
                  size={18}
                  className="shrink-0 mt-0.5"
                />
              )}

              <span>{message}</span>
            </div>
          )}

          {/* ======================================
              LOGIN
          ====================================== */}
          {activeTab === "login" && (
            <form
              onSubmit={handleLogin}
              className="space-y-4"
            >

              <input
                type="email"
                placeholder="Email Address"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({
                    ...loginForm,
                    email: e.target.value,
                  })
                }
                className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              />

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      password:
                        e.target.value,
                    })
                  }
                  className="w-full h-12 rounded-xl border border-gray-300 px-4 pr-12 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
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
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-700 text-white font-semibold shadow-md shadow-orange-200 disabled:opacity-60"
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>

            </form>
          )}

          {/* ======================================
              SIGN UP
          ====================================== */}
          {activeTab === "signup" && (
            <form
              onSubmit={handleSignup}
              className="space-y-4"
            >

              <input
                type="text"
                placeholder="Full Name"
                value={signupForm.name}
                onChange={(e) =>
                  setSignupForm({
                    ...signupForm,
                    name: e.target.value,
                  })
                }
                className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={signupForm.email}
                onChange={(e) =>
                  setSignupForm({
                    ...signupForm,
                    email: e.target.value,
                  })
                }
                className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              />

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Password"
                  value={
                    signupForm.password
                  }
                  onChange={(e) =>
                    setSignupForm({
                      ...signupForm,
                      password:
                        e.target.value,
                    })
                  }
                  className="w-full h-12 rounded-xl border border-gray-300 px-4 pr-12 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              <div className="relative">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm Password"
                  value={
                    signupForm.confirmPassword
                  }
                  onChange={(e) =>
                    setSignupForm({
                      ...signupForm,
                      confirmPassword:
                        e.target.value,
                    })
                  }
                  className="w-full h-12 rounded-xl border border-gray-300 px-4 pr-12 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
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
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-700 text-white font-semibold shadow-md shadow-orange-200 disabled:opacity-60"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

            </form>
          )}

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />

            <span className="text-xs text-gray-400">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* GOOGLE */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full h-12 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition flex items-center justify-center gap-3 font-medium disabled:opacity-60"
          >
            {googleLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-300 border-t-orange-600 rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 18 18"
                >
                  <path
                    fill="#4285F4"
                    d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.85 2.08-1.81 2.72v2.26h2.92c1.71-1.57 2.69-3.89 2.69-6.62z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.97 10.71c-.18-.54-.28-1.11-.28-1.71s.1-1.17.28-1.71V4.96H.96C.35 6.18 0 7.55 0 9s.35 2.82.96 4.04l3.01-2.33z"
                  />
                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
                  />
                </svg>

                Continue with Google
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center mt-6">
            Secure login powered by Google & Navodaya Puja
          </p>

        </div>
      </div>
    </section>
  );
}