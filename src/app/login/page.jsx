"use client";

import { useEffect, useState } from "react";
import {
  signIn,
  useSession,
} from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Mail,
  LockKeyhole,
  UserRound,
  ShieldCheck,
  Sparkles,
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

  /* =========================================================
     LOGIN FORM
  ========================================================= */
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  /* =========================================================
     SIGNUP FORM
  ========================================================= */
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /* =========================================================
     AUTHENTICATED USER → HOME
  ========================================================= */
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  /* =========================================================
     CHANGE TAB
  ========================================================= */
  const changeTab = (tab) => {
    setActiveTab(tab);
    setMessage("");
    setMessageType("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  /* =========================================================
     NORMAL LOGIN
  ========================================================= */
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

  /* =========================================================
     CREATE ACCOUNT
  ========================================================= */
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

      setMessage(
        "Account created successfully. Please login."
      );

      setMessageType("success");

      setLoginForm({
        email: signupForm.email,
        password: "",
      });

      setSignupForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

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

  /* =========================================================
     GOOGLE LOGIN
  ========================================================= */
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

  /* =========================================================
     SESSION LOADING
  ========================================================= */
  if (status === "loading") {
    return (
      <div
        className="
          min-h-screen

          flex
          items-center
          justify-center

          bg-[#fffaf4]
        "
      >
        <div
          className="
            w-10
            h-10

            rounded-full

            border-[3px]
            border-orange-100
            border-t-orange-600

            animate-spin
          "
        />
      </div>
    );
  }

  /* =========================================================
     AUTHENTICATED REDIRECT SCREEN
  ========================================================= */
  if (status === "authenticated") {
    return (
      <div
        className="
          min-h-screen

          flex
          items-center
          justify-center

          bg-[#fffaf4]
        "
      >
        <div
          className="
            w-10
            h-10

            rounded-full

            border-[3px]
            border-orange-100
            border-t-orange-600

            animate-spin
          "
        />
      </div>
    );
  }

  return (
    <section
      className="
        relative

        min-h-screen

        overflow-hidden

        bg-[#fffaf4]

        px-4
        sm:px-6

        py-6
        sm:py-10

        pt-[max(24px,env(safe-area-inset-top))]
        pb-[max(24px,env(safe-area-inset-bottom))]
      "
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}
      <div
        className="
          pointer-events-none

          absolute
          -top-32
          -right-32

          w-[360px]
          h-[360px]

          rounded-full

          bg-orange-200/40

          blur-[90px]
        "
      />

      <div
        className="
          pointer-events-none

          absolute
          -bottom-40
          -left-40

          w-[420px]
          h-[420px]

          rounded-full

          bg-amber-200/40

          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none

          absolute
          top-1/2
          left-1/2

          -translate-x-1/2
          -translate-y-1/2

          w-[300px]
          h-[300px]

          rounded-full

          bg-rose-100/30

          blur-[100px]
        "
      />

      {/* =====================================================
          PAGE CONTAINER
      ====================================================== */}
      <div
        className="
          relative
          z-10

          w-full
          max-w-[1120px]

          min-h-[calc(100vh-48px)]

          mx-auto

          flex
          items-center
          justify-center
        "
      >
        <div
          className="
            w-full

            grid
            lg:grid-cols-[1.05fr_0.95fr]

            overflow-hidden

            rounded-[28px]
            sm:rounded-[34px]

            bg-white/90
            backdrop-blur-2xl

            border
            border-orange-950/[0.07]

            shadow-[0_30px_90px_rgba(91,44,12,0.14)]
          "
        >
          {/* =================================================
              LEFT PREMIUM BRAND PANEL
              Desktop only
          ================================================== */}
          <div
            className="
              relative

              hidden
              lg:flex

              min-h-[680px]

              overflow-hidden

              flex-col
              justify-between

              p-10
              xl:p-12

              bg-gradient-to-br
              from-[#8f3512]
              via-[#b84c16]
              to-[#e06b20]

              text-white
            "
          >
            {/* DECORATIVE CIRCLES */}
            <div
              className="
                absolute
                -top-24
                -right-24

                w-72
                h-72

                rounded-full

                border
                border-white/15
              "
            />

            <div
              className="
                absolute
                -top-10
                -right-10

                w-48
                h-48

                rounded-full

                border
                border-white/15
              "
            />

            <div
              className="
                absolute
                -bottom-28
                -left-28

                w-80
                h-80

                rounded-full

                bg-white/5
              "
            />

            {/* TOP BRAND */}
            <div className="relative z-10">
              <Link
                href="/"
                className="
                  inline-flex
                  flex-col

                  group
                "
              >
                <span
                  className="
                    text-[24px]

                    font-black

                    tracking-[0.09em]

                    leading-none
                  "
                  style={{
                    fontFamily:
                      'Georgia, "Times New Roman", ui-serif, serif',
                  }}
                >
                  NAVODAYA PUJA
                </span>

                <span
                  className="
                    mt-2

                    text-[9px]

                    font-bold

                    uppercase

                    tracking-[0.34em]

                    text-orange-100
                  "
                >
                  Vedic Traditions
                </span>
              </Link>
            </div>

            {/* CENTER CONTENT */}
            <div
              className="
                relative
                z-10

                max-w-md
              "
            >
              <div
                className="
                  inline-flex
                  items-center

                  gap-2

                  px-3.5
                  py-2

                  rounded-full

                  bg-white/10
                  backdrop-blur-xl

                  border
                  border-white/15

                  text-[11px]

                  font-bold

                  tracking-wide
                "
              >
                <Sparkles
                  size={15}
                  strokeWidth={2}
                />

                Authentic Vedic Experiences
              </div>

              <h2
                className="
                  mt-6

                  text-[42px]
                  xl:text-[50px]

                  font-black

                  leading-[1.08]

                  tracking-[-0.03em]
                "
                style={{
                  fontFamily:
                    'Georgia, "Times New Roman", ui-serif, serif',
                }}
              >
                Sacred traditions,
                <br />
                thoughtfully
                <br />
                preserved.
              </h2>

              <p
                className="
                  mt-5

                  max-w-sm

                  text-[15px]

                  leading-7

                  text-orange-50/85
                "
              >
                Sign in to book authentic pujas,
                manage your ceremonies and stay
                connected with timeless Vedic
                traditions.
              </p>
            </div>

            {/* BOTTOM TRUST */}
            <div
              className="
                relative
                z-10

                flex
                items-center

                gap-3
              "
            >
              <div
                className="
                  w-10
                  h-10

                  rounded-full

                  flex
                  items-center
                  justify-center

                  bg-white/10

                  border
                  border-white/15
                "
              >
                <ShieldCheck
                  size={19}
                  strokeWidth={2}
                />
              </div>

              <div>
                <p
                  className="
                    text-[12px]

                    font-bold
                  "
                >
                  Secure & Private
                </p>

                <p
                  className="
                    mt-0.5

                    text-[10px]

                    text-orange-100/75
                  "
                >
                  Your account is protected
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT AUTH PANEL
          ================================================== */}
          <div
            className="
              relative

              flex
              items-center
              justify-center

              px-5
              py-7

              sm:px-10
              sm:py-10

              lg:px-12
              xl:px-16

              bg-white/80
            "
          >
            <div
              className="
                w-full
                max-w-[420px]
              "
            >
              {/* =============================================
                  MOBILE TOP BAR
              ============================================= */}
              <div
                className="
                  mb-7

                  flex
                  items-center
                  justify-between

                  lg:hidden
                "
              >
                <Link
                  href="/"
                  aria-label="Back to home"
                  className="
                    w-10
                    h-10

                    rounded-full

                    flex
                    items-center
                    justify-center

                    bg-orange-50

                    border
                    border-orange-100

                    text-orange-700

                    transition-all

                    active:scale-90
                  "
                >
                  <ArrowLeft
                    size={18}
                    strokeWidth={2.2}
                  />
                </Link>

                <Link
                  href="/"
                  className="
                    absolute
                    left-1/2

                    -translate-x-1/2

                    text-center

                    whitespace-nowrap
                  "
                >
                  <span
                    className="
                      block

                      text-[18px]

                      font-black

                      tracking-[0.06em]

                      leading-none

                      text-[#3b2417]
                    "
                    style={{
                      fontFamily:
                        'Georgia, "Times New Roman", ui-serif, serif',
                    }}
                  >
                    NAVODAYA PUJA
                  </span>

                  <span
                    className="
                      block

                      mt-1

                      text-[7px]

                      font-bold

                      uppercase

                      tracking-[0.28em]

                      text-orange-600
                    "
                  >
                    Vedic Traditions
                  </span>
                </Link>

                <div className="w-10 h-10" />
              </div>

              {/* =============================================
                  HEADING
              ============================================= */}
              <div
                className="
                  mb-6

                  text-center
                  sm:text-left
                "
              >
                <p
                  className="
                    text-[11px]

                    font-extrabold

                    uppercase

                    tracking-[0.22em]

                    text-orange-600
                  "
                >
                  {activeTab === "login"
                    ? "Welcome Back"
                    : "Join Navodaya"}
                </p>

                <h1
                  className="
                    mt-2

                    text-[30px]
                    sm:text-[34px]

                    font-black

                    tracking-[-0.035em]

                    leading-tight

                    text-[#2f211a]
                  "
                  style={{
                    fontFamily:
                      'Georgia, "Times New Roman", ui-serif, serif',
                  }}
                >
                  {activeTab === "login"
                    ? "Sign in to your account"
                    : "Create your account"}
                </h1>

                <p
                  className="
                    mt-2

                    text-[13px]
                    sm:text-[14px]

                    leading-6

                    text-[#806f64]
                  "
                >
                  {activeTab === "login"
                    ? "Continue your spiritual journey with Navodaya Puja."
                    : "Create an account to manage pujas and bookings."}
                </p>
              </div>

              {/* =============================================
                  TABS
              ============================================= */}
              <div
                className="
                  relative

                  mb-5

                  grid
                  grid-cols-2

                  p-1

                  rounded-2xl

                  bg-[#fff5ea]

                  border
                  border-orange-100
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    changeTab("login")
                  }
                  className={`
                    h-11

                    rounded-xl

                    text-[13px]

                    font-bold

                    transition-all
                    duration-300

                    ${
                      activeTab === "login"
                        ? `
                          bg-white

                          text-orange-700

                          shadow-[0_4px_16px_rgba(154,75,22,0.10)]
                        `
                        : `
                          text-[#9a887c]

                          hover:text-orange-700
                        `
                    }
                  `}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeTab("signup")
                  }
                  className={`
                    h-11

                    rounded-xl

                    text-[13px]

                    font-bold

                    transition-all
                    duration-300

                    ${
                      activeTab === "signup"
                        ? `
                          bg-white

                          text-orange-700

                          shadow-[0_4px_16px_rgba(154,75,22,0.10)]
                        `
                        : `
                          text-[#9a887c]

                          hover:text-orange-700
                        `
                    }
                  `}
                >
                  Sign Up
                </button>
              </div>

              {/* =============================================
                  MESSAGE
              ============================================= */}
              {message && (
                <div
                  className={`
                    mb-5

                    px-4
                    py-3

                    rounded-2xl

                    flex
                    items-start

                    gap-2.5

                    text-[12px]
                    sm:text-[13px]

                    font-semibold

                    ${
                      messageType === "success"
                        ? `
                          bg-emerald-50

                          text-emerald-700

                          border
                          border-emerald-200
                        `
                        : `
                          bg-red-50

                          text-red-700

                          border
                          border-red-200
                        `
                    }
                  `}
                >
                  {messageType === "success" ? (
                    <CheckCircle2
                      size={18}
                      className="
                        shrink-0
                        mt-0.5
                      "
                    />
                  ) : (
                    <AlertCircle
                      size={18}
                      className="
                        shrink-0
                        mt-0.5
                      "
                    />
                  )}

                  <span>{message}</span>
                </div>
              )}

              {/* =============================================
                  LOGIN FORM
              ============================================= */}
              {activeTab === "login" && (
                <form
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  {/* EMAIL */}
                  <div>
                    <label
                      className="
                        block

                        mb-2

                        text-[11px]

                        font-bold

                        uppercase

                        tracking-[0.08em]

                        text-[#69584e]
                      "
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        strokeWidth={2}
                        className="
                          absolute

                          left-4
                          top-1/2

                          -translate-y-1/2

                          text-[#b39d8e]
                        "
                      />

                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={loginForm.email}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            email: e.target.value,
                          })
                        }
                        autoComplete="email"
                        className="
                          w-full
                          h-[52px]

                          rounded-2xl

                          border
                          border-[#eadfd7]

                          bg-[#fffdfb]

                          pl-11
                          pr-4

                          text-[14px]

                          text-[#33251d]

                          placeholder:text-[#b6a69b]

                          outline-none

                          transition-all
                          duration-300

                          focus:bg-white

                          focus:border-orange-400

                          focus:ring-4
                          focus:ring-orange-100
                        "
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <div
                      className="
                        mb-2

                        flex
                        items-center
                        justify-between
                      "
                    >
                      <label
                        className="
                          text-[11px]

                          font-bold

                          uppercase

                          tracking-[0.08em]

                          text-[#69584e]
                        "
                      >
                        Password
                      </label>

                      <Link
                        href="/forgot-password"
                        className="
                          text-[11px]

                          font-bold

                          text-orange-600

                          hover:text-orange-700
                        "
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    <div className="relative">
                      <LockKeyhole
                        size={17}
                        strokeWidth={2}
                        className="
                          absolute

                          left-4
                          top-1/2

                          -translate-y-1/2

                          text-[#b39d8e]
                        "
                      />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            password:
                              e.target.value,
                          })
                        }
                        autoComplete="current-password"
                        className="
                          w-full
                          h-[52px]

                          rounded-2xl

                          border
                          border-[#eadfd7]

                          bg-[#fffdfb]

                          pl-11
                          pr-12

                          text-[14px]

                          text-[#33251d]

                          placeholder:text-[#b6a69b]

                          outline-none

                          transition-all
                          duration-300

                          focus:bg-white

                          focus:border-orange-400

                          focus:ring-4
                          focus:ring-orange-100
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (prev) => !prev
                          )
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="
                          absolute

                          right-4
                          top-1/2

                          -translate-y-1/2

                          text-[#9f8b7e]

                          transition-colors

                          hover:text-orange-700
                        "
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* LOGIN BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full
                      h-[52px]

                      rounded-2xl

                      flex
                      items-center
                      justify-center

                      bg-gradient-to-r
                      from-[#df651b]
                      to-[#a93d10]

                      text-white

                      text-[14px]

                      font-extrabold

                      shadow-[0_10px_24px_rgba(181,65,14,0.24)]

                      transition-all
                      duration-300

                      hover:-translate-y-0.5

                      hover:shadow-[0_14px_30px_rgba(181,65,14,0.30)]

                      active:scale-[0.98]

                      disabled:opacity-60
                      disabled:pointer-events-none
                    "
                  >
                    {loading ? (
                      <span
                        className="
                          flex
                          items-center

                          gap-2
                        "
                      >
                        <span
                          className="
                            w-4
                            h-4

                            rounded-full

                            border-2
                            border-white/40
                            border-t-white

                            animate-spin
                          "
                        />

                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>
              )}

              {/* =============================================
                  SIGNUP FORM
              ============================================= */}
              {activeTab === "signup" && (
                <form
                  onSubmit={handleSignup}
                  className="space-y-4"
                >
                  {/* NAME */}
                  <div>
                    <label
                      className="
                        block

                        mb-2

                        text-[11px]

                        font-bold

                        uppercase

                        tracking-[0.08em]

                        text-[#69584e]
                      "
                    >
                      Full Name
                    </label>

                    <div className="relative">
                      <UserRound
                        size={17}
                        strokeWidth={2}
                        className="
                          absolute

                          left-4
                          top-1/2

                          -translate-y-1/2

                          text-[#b39d8e]
                        "
                      />

                      <input
                        type="text"
                        placeholder="Your full name"
                        value={signupForm.name}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            name: e.target.value,
                          })
                        }
                        autoComplete="name"
                        className="
                          w-full
                          h-[52px]

                          rounded-2xl

                          border
                          border-[#eadfd7]

                          bg-[#fffdfb]

                          pl-11
                          pr-4

                          text-[14px]

                          text-[#33251d]

                          placeholder:text-[#b6a69b]

                          outline-none

                          transition-all
                          duration-300

                          focus:bg-white

                          focus:border-orange-400

                          focus:ring-4
                          focus:ring-orange-100
                        "
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label
                      className="
                        block

                        mb-2

                        text-[11px]

                        font-bold

                        uppercase

                        tracking-[0.08em]

                        text-[#69584e]
                      "
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        strokeWidth={2}
                        className="
                          absolute

                          left-4
                          top-1/2

                          -translate-y-1/2

                          text-[#b39d8e]
                        "
                      />

                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={signupForm.email}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            email: e.target.value,
                          })
                        }
                        autoComplete="email"
                        className="
                          w-full
                          h-[52px]

                          rounded-2xl

                          border
                          border-[#eadfd7]

                          bg-[#fffdfb]

                          pl-11
                          pr-4

                          text-[14px]

                          text-[#33251d]

                          placeholder:text-[#b6a69b]

                          outline-none

                          transition-all
                          duration-300

                          focus:bg-white

                          focus:border-orange-400

                          focus:ring-4
                          focus:ring-orange-100
                        "
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label
                      className="
                        block

                        mb-2

                        text-[11px]

                        font-bold

                        uppercase

                        tracking-[0.08em]

                        text-[#69584e]
                      "
                    >
                      Password
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={17}
                        strokeWidth={2}
                        className="
                          absolute

                          left-4
                          top-1/2

                          -translate-y-1/2

                          text-[#b39d8e]
                        "
                      />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Minimum 6 characters"
                        value={signupForm.password}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            password:
                              e.target.value,
                          })
                        }
                        autoComplete="new-password"
                        className="
                          w-full
                          h-[52px]

                          rounded-2xl

                          border
                          border-[#eadfd7]

                          bg-[#fffdfb]

                          pl-11
                          pr-12

                          text-[14px]

                          text-[#33251d]

                          placeholder:text-[#b6a69b]

                          outline-none

                          transition-all
                          duration-300

                          focus:bg-white

                          focus:border-orange-400

                          focus:ring-4
                          focus:ring-orange-100
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (prev) => !prev
                          )
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="
                          absolute

                          right-4
                          top-1/2

                          -translate-y-1/2

                          text-[#9f8b7e]

                          hover:text-orange-700
                        "
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label
                      className="
                        block

                        mb-2

                        text-[11px]

                        font-bold

                        uppercase

                        tracking-[0.08em]

                        text-[#69584e]
                      "
                    >
                      Confirm Password
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={17}
                        strokeWidth={2}
                        className="
                          absolute

                          left-4
                          top-1/2

                          -translate-y-1/2

                          text-[#b39d8e]
                        "
                      />

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Repeat your password"
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
                        autoComplete="new-password"
                        className="
                          w-full
                          h-[52px]

                          rounded-2xl

                          border
                          border-[#eadfd7]

                          bg-[#fffdfb]

                          pl-11
                          pr-12

                          text-[14px]

                          text-[#33251d]

                          placeholder:text-[#b6a69b]

                          outline-none

                          transition-all
                          duration-300

                          focus:bg-white

                          focus:border-orange-400

                          focus:ring-4
                          focus:ring-orange-100
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (prev) => !prev
                          )
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="
                          absolute

                          right-4
                          top-1/2

                          -translate-y-1/2

                          text-[#9f8b7e]

                          hover:text-orange-700
                        "
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* CREATE ACCOUNT */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full
                      h-[52px]

                      rounded-2xl

                      flex
                      items-center
                      justify-center

                      bg-gradient-to-r
                      from-[#df651b]
                      to-[#a93d10]

                      text-white

                      text-[14px]

                      font-extrabold

                      shadow-[0_10px_24px_rgba(181,65,14,0.24)]

                      transition-all
                      duration-300

                      hover:-translate-y-0.5

                      active:scale-[0.98]

                      disabled:opacity-60
                      disabled:pointer-events-none
                    "
                  >
                    {loading ? (
                      <span
                        className="
                          flex
                          items-center

                          gap-2
                        "
                      >
                        <span
                          className="
                            w-4
                            h-4

                            rounded-full

                            border-2
                            border-white/40
                            border-t-white

                            animate-spin
                          "
                        />

                        Creating account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>
              )}

              {/* =============================================
                  DIVIDER
              ============================================= */}
              <div
                className="
                  my-6

                  flex
                  items-center

                  gap-3
                "
              >
                <div
                  className="
                    flex-1
                    h-px

                    bg-[#eadfd7]
                  "
                />

                <span
                  className="
                    text-[10px]

                    font-bold

                    uppercase

                    tracking-[0.16em]

                    text-[#aa988c]
                  "
                >
                  Or continue with
                </span>

                <div
                  className="
                    flex-1
                    h-px

                    bg-[#eadfd7]
                  "
                />
              </div>

              {/* =============================================
                  GOOGLE LOGIN
              ============================================= */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="
                  w-full
                  h-[52px]

                  rounded-2xl

                  border
                  border-[#e4d8cf]

                  bg-white

                  flex
                  items-center
                  justify-center

                  gap-3

                  text-[13px]

                  font-bold

                  text-[#49382e]

                  shadow-[0_4px_16px_rgba(68,42,25,0.04)]

                  transition-all
                  duration-300

                  hover:bg-[#fffaf6]

                  hover:border-orange-200

                  active:scale-[0.98]

                  disabled:opacity-60
                "
              >
                {googleLoading ? (
                  <>
                    <span
                      className="
                        w-5
                        h-5

                        rounded-full

                        border-2
                        border-gray-200
                        border-t-orange-600

                        animate-spin
                      "
                    />

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

              {/* =============================================
                  SECURITY NOTE
              ============================================= */}
              <div
                className="
                  mt-6

                  flex
                  items-center
                  justify-center

                  gap-2

                  text-[10px]
                  sm:text-[11px]

                  font-medium

                  text-[#9d8b7f]
                "
              >
                <ShieldCheck
                  size={14}
                  strokeWidth={2}
                  className="text-orange-600"
                />

                Secure access by Navodaya Puja
              </div>

              {/* MOBILE HOME LINK */}
              <div
                className="
                  mt-5

                  text-center

                  lg:hidden
                "
              >
                <Link
                  href="/"
                  className="
                    text-[11px]

                    font-bold

                    text-orange-700

                    hover:underline
                  "
                >
                  Continue without login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}