"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
  LockKeyhole,
  UserRound,
  ShieldCheck,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("login");
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    setOtpStep(false);
    setOtp("");
    setMessage("");
    setMessageType("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!loginForm.email || !loginForm.password) {
      showMessage("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        email: loginForm.email,
        password: loginForm.password,
        redirect: false,
      });

      if (result?.error) {
        showMessage("Invalid email or password");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      showMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !signupForm.name ||
      !signupForm.email ||
      !signupForm.password ||
      !signupForm.confirmPassword
    ) {
      showMessage("Please fill all fields");
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      showMessage("Passwords do not match");
      return;
    }

    if (signupForm.password.length < 6) {
      showMessage("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/register/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          password: signupForm.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "Unable to send OTP");
        return;
      }

      setOtpEmail(signupForm.email);
      setRegisterPassword(signupForm.password);
      setOtp("");
      setOtpStep(true);
      showMessage("Verification code sent to your email", "success");
    } catch (error) {
      console.error(error);
      showMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      showMessage("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/register/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "OTP verification failed");
        return;
      }

      const result = await signIn("credentials", {
        email: otpEmail,
        password: registerPassword,
        redirect: false,
      });

      if (result?.error) {
        setOtpStep(false);
        setActiveTab("login");
        setLoginForm({ email: otpEmail, password: "" });
        showMessage("Account verified. Please login.", "success");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      showMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      setMessage("");

      const response = await fetch("/api/register/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupForm.name,
          email: otpEmail,
          password: registerPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "Unable to resend OTP");
        return;
      }

      setOtp("");
      showMessage("A new verification code has been sent", "success");
    } catch (error) {
      console.error(error);
      showMessage("Unable to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error(error);
      setGoogleLoading(false);
      showMessage("Google login failed");
    }
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white sm:bg-[#f8f4ef]">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-orange-100 border-t-[#b84b1b]" />
      </div>
    );
  }

  const inputClass =
    "h-[54px] w-full rounded-2xl border border-[#e9e1db] bg-[#fcfbfa] pl-11 pr-4 text-[13px] text-[#2d2019] outline-none transition duration-300 placeholder:text-[#b6a69c] focus:border-[#d98a61] focus:bg-white focus:ring-4 focus:ring-orange-100/60";

  const passwordClass =
    "h-[54px] w-full rounded-2xl border border-[#e9e1db] bg-[#fcfbfa] pl-11 pr-12 text-[13px] text-[#2d2019] outline-none transition duration-300 placeholder:text-[#b6a69c] focus:border-[#d98a61] focus:bg-white focus:ring-4 focus:ring-orange-100/60";

  return (
    <main className="min-h-screen bg-white sm:bg-[#f8f4ef] sm:px-6 sm:py-10">
      <div className="mx-auto min-h-screen w-full max-w-[1160px] overflow-hidden bg-white sm:min-h-[720px] sm:rounded-[36px] sm:border sm:border-black/[0.05] sm:shadow-[0_30px_90px_rgba(67,39,24,0.12)] lg:grid lg:grid-cols-[1.02fr_0.98fr]">
        <aside className="relative hidden min-h-[720px] overflow-hidden bg-[#7f2f1d] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -right-10 top-10 h-48 w-48 rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-40 h-[430px] w-[430px] rounded-full bg-white/[0.05]" />

          <Link href="/" className="relative z-10 inline-flex w-fit">
            <img
              src="/pujadham.png"
              alt="Puja Dham"
              className="h-[86px] w-auto max-w-[280px] object-contain"
            />
          </Link>

          <div className="relative z-10 max-w-[450px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-orange-50">
              <Sparkles size={14} />
              Mantra · Vidhi · Aastha
            </div>

            <h1
              className="mt-7 text-[52px] font-bold leading-[1.03] tracking-[-0.04em]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Faith in every
              <span className="block text-[#ffd9bf]">sacred ritual.</span>
            </h1>

            <p className="mt-6 max-w-[410px] text-[14px] leading-7 text-white/70">
              Authentic Vedic pujas, trusted guidance and timeless traditions,
              brought closer to your family.
            </p>

            <div className="mt-9 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
                <ShieldCheck size={20} className="text-orange-100" />
                <p className="mt-3 text-[12px] font-bold">Secure Access</p>
                <p className="mt-1 text-[10px] text-white/55">Protected account login</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
                <Sparkles size={20} className="text-orange-100" />
                <p className="mt-3 text-[12px] font-bold">Vedic Traditions</p>
                <p className="mt-1 text-[10px] text-white/55">Authentic sacred rituals</p>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-[10px] tracking-[0.16em] text-white/50">
            DEVOTION · TRADITION · TRUST
          </p>
        </aside>

        <section className="flex min-h-screen items-center justify-center bg-white px-6 py-5 sm:px-10 sm:py-10 lg:min-h-0 lg:px-14">
          <div className="w-full max-w-[430px]">
            <div className="relative mb-7 flex min-h-[64px] items-center justify-between lg:hidden">
              <Link
                href="/"
                aria-label="Back to home"
                className="z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#eee5df] bg-white text-[#7f2f1d]"
              >
                <ArrowLeft size={18} />
              </Link>

              <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <img
                  src="/pujadham.png"
                  alt="Puja Dham"
                  className="h-[58px] w-auto max-w-[190px] object-contain"
                />
              </Link>

              <div className="h-10 w-10" />
            </div>

            <div className="text-center lg:text-left">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#a54420]">
                {otpStep ? "Secure verification" : "Welcome to Puja Dham"}
              </p>

              <h2
                className="mt-3 text-[32px] font-bold leading-tight tracking-[-0.035em] text-[#291c16] sm:text-[38px]"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {otpStep
                  ? "Verify your email"
                  : activeTab === "login"
                  ? "Welcome back"
                  : "Create your account"}
              </h2>

              <p className="mt-2 text-[12px] leading-6 text-[#8b776b] sm:text-[13px]">
                {otpStep
                  ? `Enter the 6-digit code sent to ${otpEmail}.`
                  : activeTab === "login"
                  ? "Login to manage your bookings and spiritual journey."
                  : "Join Puja Dham and begin your sacred journey with us."}
              </p>
            </div>

            {!otpStep && (
              <div className="mt-6 grid grid-cols-2 rounded-2xl bg-[#f7f3f0] p-1">
                {["login", "signup"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => changeTab(tab)}
                    className={`h-11 rounded-xl text-[12px] font-extrabold transition ${
                      activeTab === tab
                        ? "bg-white text-[#9d3e1b] shadow-[0_5px_18px_rgba(72,42,25,0.08)]"
                        : "text-[#9b8a80]"
                    }`}
                  >
                    {tab === "login" ? "Login" : "Sign Up"}
                  </button>
                ))}
              </div>
            )}

            {message && (
              <div
                className={`mt-4 flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-[11px] font-semibold ${
                  messageType === "success"
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border-red-100 bg-red-50 text-red-600"
                }`}
              >
                {messageType === "success" ? (
                  <CheckCircle2 size={17} className="shrink-0" />
                ) : (
                  <AlertCircle size={17} className="shrink-0" />
                )}
                <span>{message}</span>
              </div>
            )}

            {activeTab === "login" && !otpStep && (
              <form onSubmit={handleLogin} className="mt-5 space-y-4">
                <FieldLabel>Email Address</FieldLabel>
                <IconInput icon={<Mail size={17} />} className={inputClass}>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    placeholder="Enter your email"
                    autoComplete="email"
                    className={inputClass}
                  />
                </IconInput>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#59463b]">Password</label>
                    <Link href="/forgot-password" className="text-[10px] font-bold text-[#a54420]">
                      Forgot Password?
                    </Link>
                  </div>
                  <PasswordInput
                    value={loginForm.password}
                    onChange={(value) =>
                      setLoginForm({ ...loginForm, password: value })
                    }
                    visible={showPassword}
                    setVisible={setShowPassword}
                    className={passwordClass}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                </div>

                <PrimaryButton loading={loading}>Login</PrimaryButton>
              </form>
            )}

            {activeTab === "signup" && !otpStep && (
              <form onSubmit={handleSignup} className="mt-5 space-y-4">
                <div>
                  <FieldLabel>Full Name</FieldLabel>
                  <IconInput icon={<UserRound size={17} />}>
                    <input
                      type="text"
                      value={signupForm.name}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, name: e.target.value })
                      }
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className={inputClass}
                    />
                  </IconInput>
                </div>

                <div>
                  <FieldLabel>Email Address</FieldLabel>
                  <IconInput icon={<Mail size={17} />}>
                    <input
                      type="email"
                      value={signupForm.email}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, email: e.target.value })
                      }
                      placeholder="Enter your email"
                      autoComplete="email"
                      className={inputClass}
                    />
                  </IconInput>
                </div>

                <div>
                  <FieldLabel>Password</FieldLabel>
                  <PasswordInput
                    value={signupForm.password}
                    onChange={(value) =>
                      setSignupForm({ ...signupForm, password: value })
                    }
                    visible={showPassword}
                    setVisible={setShowPassword}
                    className={passwordClass}
                    placeholder="Create a password"
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <PasswordInput
                    value={signupForm.confirmPassword}
                    onChange={(value) =>
                      setSignupForm({
                        ...signupForm,
                        confirmPassword: value,
                      })
                    }
                    visible={showConfirmPassword}
                    setVisible={setShowConfirmPassword}
                    className={passwordClass}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    shield
                  />
                </div>

                <PrimaryButton loading={loading}>Create Account</PrimaryButton>
              </form>
            )}

            {otpStep && (
              <form onSubmit={handleVerifyOtp} className="mt-7 space-y-5">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#fff3ec] text-[#a54420] ring-1 ring-[#f2ded2]">
                    <KeyRound size={27} strokeWidth={1.8} />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-center text-[11px] font-bold text-[#59463b]">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    autoFocus
                    className="h-[62px] w-full rounded-2xl border border-[#e9e1db] bg-[#fcfbfa] px-4 text-center text-[25px] font-black tracking-[0.45em] text-[#291c16] outline-none transition focus:border-[#d98a61] focus:bg-white focus:ring-4 focus:ring-orange-100/60"
                  />
                </div>

                <PrimaryButton loading={loading} disabled={otp.length !== 6}>
                  Verify & Continue
                </PrimaryButton>

                <div className="flex items-center justify-center gap-1 text-[11px] text-[#8b776b]">
                  <span>Didn't receive the code?</span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                    className="font-extrabold text-[#a54420] disabled:opacity-50"
                  >
                    {resendLoading ? "Sending..." : "Resend OTP"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOtpStep(false);
                    setOtp("");
                    setMessage("");
                  }}
                  className="mx-auto flex items-center gap-2 text-[11px] font-bold text-[#8b776b]"
                >
                  <ArrowLeft size={14} />
                  Change registration details
                </button>
              </form>
            )}

            {!otpStep && (
              <>
                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#eee7e2]" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#aa9a91]">
                    Or continue with
                  </span>
                  <div className="h-px flex-1 bg-[#eee7e2]" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="flex h-[52px] w-full items-center justify-center gap-3 rounded-2xl border border-[#e8e1dc] bg-white text-[12px] font-bold text-[#49382f] shadow-[0_5px_18px_rgba(70,40,20,0.04)] transition hover:bg-[#fcfaf8] disabled:opacity-60"
                >
                  {googleLoading ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#a54420]" />
                  ) : (
                    <>
                      <GoogleIcon />
                      Continue with Google
                    </>
                  )}
                </button>

                <p className="mt-6 text-center text-[11px] text-[#8b776b]">
                  {activeTab === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    type="button"
                    onClick={() =>
                      changeTab(activeTab === "login" ? "signup" : "login")
                    }
                    className="ml-1.5 font-extrabold text-[#a54420]"
                  >
                    {activeTab === "login" ? "Create Account" : "Login"}
                  </button>
                </p>
              </>
            )}

            <div className="mt-6 flex items-center justify-center gap-2 text-[9px] font-medium text-[#aa9a91]">
              <ShieldCheck size={13} className="text-[#b6532c]" />
              Your account information is securely protected.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="mb-2 block text-[11px] font-bold text-[#59463b]">
      {children}
    </label>
  );
}

function IconInput({ icon, children }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#aa978c]">
        {icon}
      </span>
      {children}
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
  visible,
  setVisible,
  className,
  placeholder,
  autoComplete,
  shield = false,
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#aa978c]">
        {shield ? <ShieldCheck size={17} /> : <LockKeyhole size={17} />}
      </span>

      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={className}
      />

      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#9c887d] transition hover:bg-[#f8f3ef]"
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}

function PrimaryButton({ children, loading, disabled = false }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="flex h-[52px] w-full items-center justify-center rounded-2xl bg-[#8f351f] text-[13px] font-extrabold text-white shadow-[0_12px_28px_rgba(126,45,25,0.20)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#7f2f1d] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
    >
      {loading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : (
        children
      )}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.35 12.2c0-.74-.07-1.45-.19-2.13H12v4.03h5.24a4.48 4.48 0 0 1-1.94 2.94v2.62h3.14c1.84-1.69 2.91-4.19 2.91-7.46Z" />
      <path fill="#34A853" d="M12 21.7c2.62 0 4.82-.87 6.43-2.35l-3.14-2.62c-.87.58-1.98.93-3.29.93-2.53 0-4.67-1.71-5.44-4.01H3.32v2.7A9.7 9.7 0 0 0 12 21.7Z" />
      <path fill="#FBBC05" d="M6.56 13.65A5.82 5.82 0 0 1 6.25 12c0-.57.1-1.12.31-1.65v-2.7H3.32A9.7 9.7 0 0 0 2.3 12c0 1.56.37 3.04 1.02 4.35l3.24-2.7Z" />
      <path fill="#EA4335" d="M12 6.34c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.82 3.43 14.62 2.3 12 2.3a9.7 9.7 0 0 0-8.68 5.35l3.24 2.7c.77-2.3 2.91-4.01 5.44-4.01Z" />
    </svg>
  );
}
