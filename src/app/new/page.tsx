"use client";

import { motion } from "framer-motion";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-black/70 backdrop-blur-xl shadow-2xl rounded-2xl p-10 w-[90%] max-w-md"
      >
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
        <p className="text-gray-400 text-center mb-8">
          Create your account and start your journey 🚀
        </p>

        {/* Form */}
        <form className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-white focus:ring-2 focus:ring-white outline-none transition"
            />
          </div>

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
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-white underline hover:text-gray-300">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}
