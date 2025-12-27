"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Normally you check credentials here
    router.push("/dashboard"); // Redirect to dashboard
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-black/70 backdrop-blur-xl shadow-2xl rounded-2xl p-10 w-[90%] max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-white focus:ring-2 focus:ring-white outline-none transition"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-white focus:ring-2 focus:ring-white outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Don’t have an account?{" "}
          <a href="/signup" className="text-white underline hover:text-gray-300">
            Sign Up
          </a>
        </p>
      </motion.div>
    </div>
  );
}
        