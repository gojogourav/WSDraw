"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-[#F8F9FB] pt-24 pb-8 overflow-hidden relative">
      {/* Background dotted pattern */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 mb-24">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex flex-wrap w-6 h-6 gap-[2px]">
                <div className="w-[10px] h-[10px] bg-blue-500 rounded-sm" />
                <div className="w-[10px] h-[10px] bg-neutral-800 rounded-sm" />
                <div className="w-[10px] h-[10px] bg-neutral-800 rounded-sm" />
                <div className="w-[10px] h-[10px] bg-neutral-800 rounded-sm" />
              </div>
              <span className="font-bold text-xl tracking-tight">WSDraw</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight max-w-sm leading-tight">
              Stay organized and boost your productivity
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="flex flex-col gap-4">
              <a
                href="#"
                className="text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                About Us
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Contact
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                What's New
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Careers
              </a>
            </div>
            <div className="flex flex-col gap-4">
              <a
                href="#"
                className="text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Product
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Solutions
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Integrations
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Price
              </a>
            </div>
          </div>
        </div>

        {/* Floating Icons Display */}
        <div className="relative h-40 mb-16 flex justify-center items-center">
          {[
            { icon: "20", top: "20%", left: "20%", delay: 0 },
            { icon: "💬", top: "60%", left: "10%", delay: 1 },
            { icon: "✓", top: "70%", left: "30%", delay: 0.5, textBlue: true },
            { icon: "⏱", top: "80%", left: "45%", delay: 1.5 },
            { icon: "🚩", top: "30%", left: "50%", delay: 0.2, textBlue: true },
            { icon: "🗓", top: "10%", left: "70%", delay: 2 },
            { icon: "⏳", top: "85%", left: "65%", delay: 0.8 },
            { icon: "💡", top: "40%", left: "85%", delay: 1.2 },
            { icon: "»", top: "75%", left: "90%", delay: 0.4, textBlue: true },
          ].map((item, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: item.delay,
                ease: "easeInOut",
              }}
              className={`absolute bg-white w-14 h-14 rounded-2xl shadow-[0_10px_30px_rgb(0,0,0,0.06)] flex items-center justify-center text-xl font-bold ${item.textBlue ? "text-blue-500" : "text-neutral-700"}`}
              style={{ top: item.top, left: item.left }}
            >
              {item.icon}
            </motion.div>
          ))}
        </div>

        <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-neutral-400">
          <p>© 2026. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-neutral-600 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
