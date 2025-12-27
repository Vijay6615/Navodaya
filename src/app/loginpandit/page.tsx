"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [lastLogin, setLastLogin] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedLogin = localStorage.getItem("lastLogin");
    if (savedLogin) setLastLogin(savedLogin);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.email && user.password) {
      const now = new Date().toLocaleString();
      localStorage.setItem("lastLogin", now);
      alert("🙏 Login successful!");
      router.push("/profilepandit");
    } else {
      alert("Please fill all fields.");
    }
  };

  const sanskritWords = ["ॐ", "शान्ति", "धर्म", "कर्म", "मोक्ष", "सत्य", "शक्ति"];

  return (
    <main className="relative h-screen flex justify-center items-center overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-100">
      {/* Background Sanskrit animations */}
      <div className="absolute inset-0 overflow-hidden">
        {sanskritWords.map((word, i) => (
          <motion.div
            key={i}
            className="absolute text-orange-300 text-6xl font-bold select-none"
            initial={{ opacity: 0, x: Math.random() * 800, y: Math.random() * 600 }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              y: [Math.random() * 500, Math.random() * 500 - 100],
            }}
            transition={{
              repeat: Infinity,
              duration: 10 + Math.random() * 10,
              delay: i * 2,
            }}
          >
            {word}
          </motion.div>
        ))}
      </div>

      {/* Login form */}
      <motion.form
        onSubmit={handleLogin}
        className="relative z-10 bg-white shadow-2xl p-10 rounded-3xl w-96 backdrop-blur-md bg-opacity-90"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-orange-700 text-center mb-5 drop-shadow">
          🔱 Pandit Ji Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="w-full border-2 border-orange-200 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="w-full border-2 border-orange-200 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />

        <button
          type="submit"
          className="bg-orange-600 text-white w-full py-3 rounded-lg font-semibold text-lg hover:bg-orange-700 transition-all"
        >
          Login
        </button>

        {lastLogin && (
          <p className="text-sm text-gray-500 mt-4 text-center">
            🕉️ Last login: <span className="font-medium">{lastLogin}</span>
          </p>
        )}
      </motion.form>
    </main>
  );
}
