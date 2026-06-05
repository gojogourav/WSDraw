"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center z-10 min-h-[80vh] justify-center">
      {/* Floating Sticky Note */}
      <motion.div
        className="absolute hidden lg:block z-0"
        style={{ left: "8%", top: "6rem" }}
        animate={{ y: [0, -12, 0], rotate: -6 }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      >
        <div className="bg-[#FFF9C4] p-5 rounded-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] w-48 relative border border-yellow-100">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-400 rounded-full shadow-sm" />
          <p className="text-xs font-mono font-medium text-neutral-700 leading-relaxed text-left">
            Sketch ideas, diagram architectures, and align your team instantly.
          </p>
        </div>
      </motion.div>

      {/* Floating Reminder Card */}
      <motion.div
        className="absolute hidden lg:block z-0"
        style={{ right: "10%", top: "8rem" }}
        animate={{ y: [0, 15, 0], rotate: 4 }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        <div className="bg-white rounded-2xl p-4 w-52 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.08)] border border-neutral-100 text-left">
          <div className="flex justify-between items-start mb-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Live session
            </div>
            <div className="w-7 h-7 rounded-full border-2 border-neutral-100 flex items-center justify-center text-neutral-500">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div className="text-sm font-bold text-neutral-900 mb-1">
            Team brainstorm
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            14:00 – 14:45
          </div>
        </div>
      </motion.div>

      {/* Hero Typography */}
      <section className="max-w-3xl mx-auto z-10 mb-12">
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-neutral-900 tracking-tight leading-[1.1] mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Think, draw, and track
          <br />
          <span className="text-neutral-400 font-light italic">
            all in one place
          </span>
        </motion.h1>
        <motion.p
          className="text-lg text-neutral-500 mx-auto max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Real-time collaborative whiteboarding to boost productivity.
        </motion.p>
      </section>

      <ActionCard />
    </div>
  );
}

function ActionCard() {
  const [isJoining, setIsJoining] = useState(false);

  return (
    <div className="w-full max-w-md relative z-20">
      <div className="bg-white/80 backdrop-blur-xl border border-neutral-100 rounded-[2rem] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] text-left">
        {/* Pill Toggle */}
        <div className="flex p-1 bg-neutral-100 rounded-2xl mb-6 relative">
          <motion.div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            layout
            initial={false}
            animate={{ x: isJoining ? "100%" : "0%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ left: isJoining ? "4px" : "4px" }}
          />
          <button
            className={`flex-1 py-2.5 text-sm font-semibold z-10 transition-colors ${
              !isJoining
                ? "text-neutral-900"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
            onClick={() => setIsJoining(false)}
          >
            Create Room
          </button>
          <button
            className={`flex-1 py-2.5 text-sm font-semibold z-10 transition-colors ${
              isJoining
                ? "text-neutral-900"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
            onClick={() => setIsJoining(true)}
          >
            Join Room
          </button>
        </div>

        {/* Input Fields */}
        <label className="block text-sm font-medium text-neutral-600 mb-2 ml-1">
          Your Name
        </label>
        <input
          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-5 py-3.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all mb-4"
          type="text"
          placeholder="e.g. Gourav"
        />

        <AnimatePresence>
          {isJoining && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2">
                <label className="block text-sm font-medium text-neutral-600 mb-2 ml-1">
                  Room ID
                </label>
                <input
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-5 py-3.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all mb-4"
                  type="text"
                  placeholder="Paste Room ID here"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button className="w-full bg-[#0066FF] hover:bg-blue-600 text-white font-medium rounded-xl px-5 py-4 transition-all hover:shadow-[0_8px_25px_-5px_rgba(0,102,255,0.4)] active:scale-[0.98] mt-2">
          {isJoining ? "Enter Workspace" : "Start Drawing Free"}
        </button>
      </div>
    </div>
  );
}
