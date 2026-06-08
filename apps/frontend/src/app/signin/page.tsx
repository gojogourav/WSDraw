"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { log } from "node:console";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const endpoint = isSignUp ? "/signup" : "/login";
    const payload = isSignUp ? { name, email, password } : { email, password };

    try {
      console.log("starting ");
      const res = await fetch(`http://localhost:3001/auth${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();

      console.log(data);

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (data.token) {
        document.cookie = `access_token=${data.token}; path=/; max-age=86400; SameSite=Strict`;
      }

      // Redirect to dashboard or home page on success
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F8F9FB] flex items-center justify-center px-6 overflow-hidden">
      {/* Background Dotted Pattern matching Footer */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Aesthetic Floating Decorative Shapes matching Hero */}
      <motion.div
        className="absolute z-0 bg-white/40 backdrop-blur-md border border-white/50 w-72 h-72 hidden xl:block rounded-3xl shadow-lg"
        style={{ left: "10%", top: "20%", rotate: "15deg" }}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute z-0 bg-white/40 backdrop-blur-md border border-white/50 w-64 h-64 hidden xl:block rounded-3xl shadow-lg"
        style={{ right: "10%", bottom: "15%", rotate: "-10deg" }}
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
      />

      {/* Main Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo/Brand Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex flex-wrap w-6 h-6 gap-[2px]">
            <div className="w-[10px] h-[10px] bg-[#0066FF] rounded-sm" />
            <div className="w-[10px] h-[10px] bg-neutral-800 rounded-sm" />
            <div className="w-[10px] h-[10px] bg-neutral-800 rounded-sm" />
            <div className="w-[10px] h-[10px] bg-neutral-800 rounded-sm" />
          </div>
          <span className="font-bold text-xl tracking-tight text-neutral-900">
            WSDraw
          </span>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-neutral-100 rounded-[2rem] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
          {/* Custom Styled Dynamic Mode Switcher Toggle */}
          <div className="flex bg-neutral-100 p-1 rounded-2xl mb-8 relative">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError("");
              }}
              className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-xl transition-all relative z-10 ${
                isSignUp
                  ? "text-neutral-900"
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError("");
              }}
              className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-xl transition-all relative z-10 ${
                !isSignUp
                  ? "text-neutral-900"
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              Log In
            </button>
            <motion.div
              className="absolute top-1 bottom-1 left-1 bg-white shadow-sm rounded-xl"
              animate={{
                left: isSignUp ? "4px" : "calc(50% - 4px)",
                width: "calc(50% - 4px)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight mb-2">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-sm text-neutral-500 mb-6">
            {isSignUp
              ? "Start collaborative real-time whiteboarding free."
              : "Pick up right where you left off."}
          </p>

          {/* Form Processing Notifications */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 text-red-600 text-xs font-medium p-3 rounded-xl border border-red-100 mb-4 overflow-hidden"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-medium text-neutral-600 mb-2 ml-1">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Gourav Biswal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-5 py-3.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2 ml-1">
                Email Address
              </label>
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-5 py-3.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2 ml-1">
                Password
              </label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-5 py-3.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-[#0066FF] hover:bg-blue-600 text-white font-medium rounded-xl px-5 py-4 transition-all hover:shadow-[0_8px_25px_-5px_rgba(0,102,255,0.4)] active:scale-[0.98] mt-6 flex justify-center items-center disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
