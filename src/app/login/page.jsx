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

                w-48                h-48

                rounded-full

                border
                border-white/10
              "
            />

            <div
              className="
                absolute
                -bottom-32
                -left-32

                w-96
                h-96

                rounded-full

                bg-white/[0.06]

                blur-2xl
              "
            />

            <div
              className="
                absolute
                bottom-24
                right-12

                w-28
                h-28

                rounded-full

                border
                border-orange-100/20
              "
            />

            {/* TOP BRAND LOGO */}
            <div className="relative z-10">
              <Link
                href="/"
                aria-label="Puja Dham Home"
                className="
                  inline-flex
                  items-center
                  group
                "
              >
                <img
                  src="/pujadham.png"
                  alt="Puja Dham Logo"
                  className="
                    block
                    w-auto

                    h-[78px]
                    xl:h-[88px]

                    max-w-[240px]
                    xl:max-w-[280px]

                    object-contain

                    transition-transform
                    duration-300

                    group-hover:scale-[1.03]
                  "
                />
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

                  px-3
                  py-2

                  rounded-full

                  bg-white/10

                  border
                  border-white/15

                  backdrop-blur-xl
                "
              >
                <Sparkles
                  size={15}
                  strokeWidth={2}
                  className="text-orange-100"
                />

                <span
                  className="
                    text-[11px]

                    font-bold

                    uppercase

                    tracking-[0.14em]

                    text-orange-50
                  "
                >
                  Sacred Rituals • Divine Blessings
                </span>
              </div>

              <h1
                className="
                  mt-6

                  text-[42px]
                  xl:text-[50px]

                  font-black

                  leading-[1.05]

                  tracking-[-0.035em]

                  text-white
                "
                style={{
                  fontFamily:
                    'Georgia, "Times New Roman", ui-serif, serif',
                }}
              >
                Your sacred
                <span
                  className="
                    block
                    text-orange-100
                  "
                >
                  journey begins here.
                </span>
              </h1>

              <p
                className="
                  mt-5

                  max-w-[430px]

                  text-[14px]
                  xl:text-[15px]

                  leading-7

                  text-orange-50/80
                "
              >
                Book authentic Vedic pujas, connect with
                trusted Pandit Ji, and bring divine traditions
                closer to your home with Puja Dham.
              </p>

              {/* FEATURES */}
              <div
                className="
                  mt-8

                  grid
                  grid-cols-1
                  xl:grid-cols-2

                  gap-3
                "
              >
                <div
                  className="
                    flex
                    items-center

                    gap-3

                    px-4
                    py-3

                    rounded-2xl

                    bg-white/[0.08]

                    border
                    border-white/[0.10]

                    backdrop-blur-xl
                  "
                >
                  <div
                    className="
                      w-9
                      h-9

                      shrink-0

                      rounded-xl

                      flex
                      items-center
                      justify-center

                      bg-white/10

                      text-orange-100
                    "
                  >
                    <ShieldCheck
                      size={18}
                      strokeWidth={2}
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-[12px]
                        font-bold
                        text-white
                      "
                    >
                      Secure Access
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[9px]
                        text-orange-50/60
                      "
                    >
                      Protected account login
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex
                    items-center

                    gap-3

                    px-4
                    py-3

                    rounded-2xl

                    bg-white/[0.08]

                    border
                    border-white/[0.10]

                    backdrop-blur-xl
                  "
                >
                  <div
                    className="
                      w-9
                      h-9

                      shrink-0

                      rounded-xl

                      flex
                      items-center
                      justify-center

                      bg-white/10

                      text-orange-100
                    "
                  >
                    <Sparkles
                      size={18}
                      strokeWidth={2}
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-[12px]
                        font-bold
                        text-white
                      "
                    >
                      Vedic Traditions
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[9px]
                        text-orange-50/60
                      "
                    >
                      Authentic sacred rituals
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM TRUST TEXT */}
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
                  flex
                  -space-x-2
                "
              >
                <div
                  className="
                    w-8
                    h-8

                    rounded-full

                    border-2
                    border-[#c45719]

                    bg-orange-100
                  "
                />

                <div
                  className="
                    w-8
                    h-8

                    rounded-full

                    border-2
                    border-[#c45719]

                    bg-amber-100
                  "
                />

                <div
                  className="
                    w-8
                    h-8

                    rounded-full

                    border-2
                    border-[#c45719]

                    bg-rose-100
                  "
                />
              </div>

              <div>
                <p
                  className="
                    text-[11px]
                    font-bold
                    text-white
                  "
                >
                  Trusted spiritual experience
                </p>

                <p
                  className="
                    mt-0.5

                    text-[9px]

                    text-orange-50/60
                  "
                >
                  Devotion • Tradition • Trust
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT LOGIN / SIGNUP PANEL
          ================================================== */}
          <div
            className="
              relative

              flex
              items-center
              justify-center

              px-5
              sm:px-8
              lg:px-10
              xl:px-14

              py-7
              sm:py-10
              lg:py-12

              bg-white/90
            "
          >
            <div
              className="
                w-full
                max-w-[430px]
              "
            >
              {/* =============================================
                  MOBILE / IOS TOP BAR
              ============================================= */}
              <div
                className="
                  relative

                  mb-7

                  min-h-[60px]

                  flex
                  items-center
                  justify-between

                  lg:hidden
                "
              >
                {/* BACK BUTTON */}
                <Link
                  href="/"
                  aria-label="Back to home"
                  className="
                    relative
                    z-30

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
                    duration-300

                    hover:bg-orange-100

                    active:scale-90
                  "
                >
                  <ArrowLeft
                    size={18}
                    strokeWidth={2.2}
                  />
                </Link>

                {/* MOBILE CENTER LOGO */}
                <Link
                  href="/"
                  aria-label="Puja Dham Home"
                  className="
                    absolute

                    left-1/2
                    top-1/2

                    -translate-x-1/2
                    -translate-y-1/2

                    flex
                    items-center
                    justify-center

                    z-20
                  "
                >
                  <img
                    src="/pujadham.png"
                    alt="Puja Dham Logo"
                    className="
                      block
                      w-auto

                      h-[54px]
                      min-[390px]:h-[60px]

                      max-w-[170px]
                      min-[390px]:max-w-[195px]

                      object-contain
                    "
                  />
                </Link>

                {/* RIGHT EMPTY SPACE
                    Keeps logo perfectly centered */}
                <div
                  className="
                    w-10
                    h-10
                  "
                  aria-hidden="true"
                />
              </div>

              {/* =============================================
                  HEADING
              ============================================= */}
              <div
                className="
                  text-center
                  lg:text-left
                "
              >
                <div
                  className="
                    inline-flex

                    items-center

                    gap-2

                    px-3
                    py-1.5

                    rounded-full

                    bg-orange-50

                    border
                    border-orange-100

                    text-[10px]

                    font-bold

                    uppercase

                    tracking-[0.12em]

                    text-orange-700
                  "
                >
                  <Sparkles
                    size={13}
                    strokeWidth={2.2}
                  />

                  Welcome to Puja Dham
                </div>

                <h2
                  className="
                    mt-4

                    text-[30px]
                    sm:text-[34px]
                    lg:text-[38px]

                    font-black

                    leading-tight

                    tracking-[-0.035em]

                    text-[#2f1b12]
                  "
                >
                  {activeTab === "login"
                    ? "Welcome back"
                    : "Create your account"}
                </h2>

                <p
                  className="
                    mt-2

                    text-[12px]
                    sm:text-[13px]

                    leading-6

                    text-[#8a7060]
                  "
                >
                  {activeTab === "login"
                    ? "Login to manage your puja bookings and spiritual journey."
                    : "Join Puja Dham and begin your sacred journey with us."}
                </p>
              </div>

              {/* =============================================
                  LOGIN / SIGNUP TABS
              ============================================= */}
              <div
                className="
                  mt-6

                  grid
                  grid-cols-2

                  p-1

                  rounded-2xl

                  bg-[#fff7ed]

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

                    text-[12px]

                    font-bold

                    transition-all
                    duration-300

                    ${
                      activeTab === "login"
                        ? `
                          bg-white
                          text-orange-700

                          shadow-[0_6px_20px_rgba(130,62,18,0.10)]
                        `
                        : `
                          text-[#9b8171]

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

                    text-[12px]

                    font-bold

                    transition-all
                    duration-300

                    ${
                      activeTab === "signup"
                        ? `
                          bg-white
                          text-orange-700

                          shadow-[0_6px_20px_rgba(130,62,18,0.10)]
                        `
                        : `
                          text-[#9b8171]

                          hover:text-orange-700
                        `
                    }
                  `}
                >
                  Sign Up
                </button>
              </div>

              {/* =============================================
                  MESSAGE BOX
              ============================================= */}
              {message && (
                <div
                  className={`
                    mt-4

                    flex
                    items-start

                    gap-2.5

                    px-4
                    py-3

                    rounded-2xl

                    border

                    text-[11px]
                    sm:text-[12px]

                    font-semibold

                    ${
                      messageType === "success"
                        ? `
                          bg-emerald-50
                          border-emerald-100
                          text-emerald-700
                        `
                        : `
                          bg-red-50
                          border-red-100
                          text-red-600
                        `
                    }
                  `}
                >
                  {messageType === "success" ? (
                    <CheckCircle2
                      size={17}
                      strokeWidth={2.2}
                      className="
                        mt-0.5
                        shrink-0
                      "
                    />
                  ) : (
                    <AlertCircle
                      size={17}
                      strokeWidth={2.2}
                      className="
                        mt-0.5
                        shrink-0
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
                  className="
                    mt-5
                    space-y-4
                  "
                >
                  {/* EMAIL */}
                  <div>
                    <label
                      className="
                        mb-2
                        block

                        text-[11px]

                        font-bold

                        text-[#5c4335]
                      "
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        strokeWidth={2}
                        className="
                          pointer-events-none

                          absolute

                          left-4
                          top-1/2

                          -translate-y-1/2

                          text-[#b39a8a]
                        "
                      />

                      <input
                        type="email"
                        value={loginForm.email}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            email: e.target.value,
                          })
                        }
                        placeholder="Enter your email"
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

                          text-[13px]

                          text-[#3b2417]

                          outline-none

                          transition-all
                          duration-300

                          placeholder:text-[#bca99c]

                          focus:border-orange-300
                          focus:bg-white

                          focus:ring-4
                          focus:ring-orange-100/70
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

                          text-[#5c4335]
                        "
                      >
                        Password
                      </label>

                      <Link
                        href="/forgot-password"
                        className="
                          text-[10px]

                          font-bold

                          text-orange-600

                          transition-colors

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
                          pointer-events-none

                          absolute

                          left-4
                          top-1/2

                          -translate-y-1/2

                          text-[#b39a8a]
                        "
                      />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            password:
                              e.target.value,
                          })
                        }
                        placeholder="Enter your password"
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

                          text-[13px]

                          text-[#3b2417]

                          outline-none

                          transition-all
                          duration-300

                          placeholder:text-[#bca99c]

                          focus:border-orange-300
                          focus:bg-white

                          focus:ring-4
                          focus:ring-orange-100/70
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

                          right-3
                          top-1/2

                          -translate-y-1/2

                          w-9
                          h-9

                          rounded-full

                          flex
                          items-center
                          justify-center

                          text-[#9f8879]

                          transition-all

                          hover:bg-orange-50
                          hover:text-orange-700
                        "
                      >
                        {showPassword ? (
                          <EyeOff
                            size={17}
                            strokeWidth={2}
                          />
                        ) : (
                          <Eye
                            size={17}
                            strokeWidth={2}
                          />
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
                      from-[#dd641d]
                      to-[#a93d10]

                      text-[13px]

                      font-extrabold

                      text-white

                      shadow-[0_12px_30px_rgba(181,65,14,0.24)]

                      transition-all
                      duration-300

                      hover:-translate-y-0.5

                      hover:shadow-[0_16px_36px_rgba(181,65,14,0.30)]

                      active:scale-[0.98]

                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      disabled:hover:translate-y-0
                    "
                  >
                    {loading ? (
                      <span
                        className="
                          w-5
                          h-5

                          rounded-full

                          border-2
                          border-white/40
                          border-t-white

                          animate-spin
                        "
                      />
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>
              )}              {/* =============================================
                  SIGNUP FORM
              ============================================= */}
              {activeTab === "signup" && (
                <form
                  onSubmit={handleSignup}
                  className="
                    mt-5
                    space-y-4
                  "
                >
                  {/* FULL NAME */}
                  <div>
                    <label
                      className="
                        mb-2
                        block

                        text-[11px]

                        font-bold

                        text-[#5c4335]
                      "
                    >
                      Full Name
                    </label>

                    <div className="relative">
                      <UserRound
                        size={17}
                        strokeWidth={2}
                        className="
                          pointer-events-none

                          absolute

                          left-4
                          top-1/2

                          -translate-y-1/2

                          text-[#b39a8a]
                        "
                      />

                      <input
                        type="text"
                        value={signupForm.name}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter your full name"
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

                          text-[13px]

                          text-[#3b2417]

                          outline-none

                          transition-all
                          duration-300

                          placeholder:text-[#bca99c]

                          focus:border-orange-300
                          focus:bg-white

                          focus:ring-4
                          focus:ring-orange-100/70
                        "
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label
                      className="
                        mb-2
                        block

                        text-[11px]

                        font-bold

                        text-[#5c4335]
                      "
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        strokeWidth={2}
                        className="
                          pointer-events-none

                          absolute

                          left-4
                          top-1/2

                          -translate-y-1/2

                          text-[#b39a8a]
                        "
                      />

                      <input
                        type="email"
                        value={signupForm.email}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            email: e.target.value,
                          })
                        }
                        placeholder="Enter your email"
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

                          text-[13px]

                          text-[#3b2417]

                          outline-none

                          transition-all
                          duration-300

                          placeholder:text-[#bca99c]

                          focus:border-orange-300
                          focus:bg-white

                          focus:ring-4
                          focus:ring-orange-100/70
                        "
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label
                      className="
                        mb-2
                        block

                        text-[11px]

                        font-bold

                        text-[#5c4335]
                      "
                    >
                      Password
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={17}
                        strokeWidth={2}
                        className="
                          pointer-events-none

                          absolute

                          left-4
                          top-1/2

                          -translate-y-1/2

                          text-[#b39a8a]
                        "
                      />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={signupForm.password}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            password:
                              e.target.value,
                          })
                        }
                        placeholder="Create a password"
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

                          text-[13px]

                          text-[#3b2417]

                          outline-none

                          transition-all
                          duration-300

                          placeholder:text-[#bca99c]

                          focus:border-orange-300
                          focus:bg-white

                          focus:ring-4
                          focus:ring-orange-100/70
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

                          right-3
                          top-1/2

                          -translate-y-1/2

                          w-9
                          h-9

                          rounded-full

                          flex
                          items-center
                          justify-center

                          text-[#9f8879]

                          transition-all

                          hover:bg-orange-50
                          hover:text-orange-700
                        "
                      >
                        {showPassword ? (
                          <EyeOff
                            size={17}
                            strokeWidth={2}
                          />
                        ) : (
                          <Eye
                            size={17}
                            strokeWidth={2}
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label
                      className="
                        mb-2
                        block

                        text-[11px]

                        font-bold

                        text-[#5c4335]
                      "
                    >
                      Confirm Password
                    </label>

                    <div className="relative">
                      <ShieldCheck
                        size={17}
                        strokeWidth={2}
                        className="
                          pointer-events-none

                          absolute

                          left-4
                          top-1/2

                          -translate-y-1/2

                          text-[#b39a8a]
                        "
                      />

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
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
                        placeholder="Confirm your password"
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

                          text-[13px]

                          text-[#3b2417]

                          outline-none

                          transition-all
                          duration-300

                          placeholder:text-[#bca99c]

                          focus:border-orange-300
                          focus:bg-white

                          focus:ring-4
                          focus:ring-orange-100/70
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
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        className="
                          absolute

                          right-3
                          top-1/2

                          -translate-y-1/2

                          w-9
                          h-9

                          rounded-full

                          flex
                          items-center
                          justify-center

                          text-[#9f8879]

                          transition-all

                          hover:bg-orange-50
                          hover:text-orange-700
                        "
                      >
                        {showConfirmPassword ? (
                          <EyeOff
                            size={17}
                            strokeWidth={2}
                          />
                        ) : (
                          <Eye
                            size={17}
                            strokeWidth={2}
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* CREATE ACCOUNT BUTTON */}
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
                      from-[#dd641d]
                      to-[#a93d10]

                      text-[13px]

                      font-extrabold

                      text-white

                      shadow-[0_12px_30px_rgba(181,65,14,0.24)]

                      transition-all
                      duration-300

                      hover:-translate-y-0.5

                      hover:shadow-[0_16px_36px_rgba(181,65,14,0.30)]

                      active:scale-[0.98]

                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      disabled:hover:translate-y-0
                    "
                  >
                    {loading ? (
                      <span
                        className="
                          w-5
                          h-5

                          rounded-full

                          border-2
                          border-white/40
                          border-t-white

                          animate-spin
                        "
                      />
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
                    h-px
                    flex-1
                    bg-[#eee2da]
                  "
                />

                <span
                  className="
                    text-[10px]

                    font-semibold

                    uppercase

                    tracking-[0.12em]

                    text-[#aa9486]
                  "
                >
                  Or continue with
                </span>

                <div
                  className="
                    h-px
                    flex-1
                    bg-[#eee2da]
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

                  flex
                  items-center
                  justify-center

                  gap-3

                  border
                  border-[#e8ddd5]

                  bg-white

                  text-[12px]

                  font-bold

                  text-[#4b3529]

                  shadow-[0_6px_20px_rgba(70,40,20,0.05)]

                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:border-orange-200
                  hover:bg-orange-50/40

                  active:scale-[0.98]

                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {googleLoading ? (
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
                ) : (
                  <>
                    {/* GOOGLE LOGO */}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill="#4285F4"
                        d="M21.35 12.2c0-.74-.07-1.45-.19-2.13H12v4.03h5.24a4.48 4.48 0 0 1-1.94 2.94v2.62h3.14c1.84-1.69 2.91-4.19 2.91-7.46Z"
                      />

                      <path
                        fill="#34A853"
                        d="M12 21.7c2.62 0 4.82-.87 6.43-2.35l-3.14-2.62c-.87.58-1.98.93-3.29.93-2.53 0-4.67-1.71-5.44-4.01H3.32v2.7A9.7 9.7 0 0 0 12 21.7Z"
                      />

                      <path
                        fill="#FBBC05"
                        d="M6.56 13.65A5.82 5.82 0 0 1 6.25 12c0-.57.1-1.12.31-1.65v-2.7H3.32A9.7 9.7 0 0 0 2.3 12c0 1.56.37 3.04 1.02 4.35l3.24-2.7Z"
                      />

                      <path
                        fill="#EA4335"
                        d="M12 6.34c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.82 3.43 14.62 2.3 12 2.3a9.7 9.7 0 0 0-8.68 5.35l3.24 2.7c.77-2.3 2.91-4.01 5.44-4.01Z"
                      />
                    </svg>

                    Continue with Google
                  </>
                )}
              </button>

              {/* =============================================
                  SWITCH LOGIN / SIGNUP TEXT
              ============================================= */}
              <p
                className="
                  mt-6

                  text-center

                  text-[11px]
                  sm:text-[12px]

                  text-[#927b6d]
                "
              >
                {activeTab === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}

                <button
                  type="button"
                  onClick={() =>
                    changeTab(
                      activeTab === "login"
                        ? "signup"
                        : "login"
                    )
                  }
                  className="
                    ml-1.5

                    font-extrabold

                    text-orange-600

                    transition-colors

                    hover:text-orange-700
                  "
                >
                  {activeTab === "login"
                    ? "Create Account"
                    : "Login"}
                </button>
              </p>

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

                  text-[9px]
                  sm:text-[10px]

                  font-medium

                  text-[#ad988b]
                "
              >
                <ShieldCheck
                  size={13}
                  strokeWidth={2}
                  className="text-orange-500"
                />

                Your account information is securely protected.
              </div>

              {/* =============================================
                  TERMS / PRIVACY NOTE
              ============================================= */}
              <p
                className="
                  mt-4

                  text-center

                  text-[9px]
                  sm:text-[10px]

                  leading-5

                  text-[#b09b8e]
                "
              >
                By continuing, you agree to Puja Dham&apos;s{" "}
                <Link
                  href="/terms"
                  className="
                    font-semibold
                    text-orange-600

                    transition-colors

                    hover:text-orange-700
                  "
                >
                  Terms of Service
                </Link>

                {" "}and{" "}

                <Link
                  href="/privacy"
                  className="
                    font-semibold
                    text-orange-600

                    transition-colors

                    hover:text-orange-700
                  "
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}