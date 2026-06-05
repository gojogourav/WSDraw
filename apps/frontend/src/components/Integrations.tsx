"use client";

import { motion } from "framer-motion";

const tools = [
  { icon: "🔺", bg: "bg-white" }, // Placeholders for actual tool logos (Drive, Figma, Slack etc.)
  { icon: "🎨", bg: "bg-white" },
  { icon: "📧", bg: "bg-white" },
  { icon: "💬", bg: "bg-white" },
  { icon: "📅", bg: "bg-white" },
  { icon: "☁️", bg: "bg-white" },
  { icon: "📊", bg: "bg-white" },
  { icon: "📬", bg: "bg-white" },
  { icon: "🟢", bg: "bg-white" },
  { icon: "🐙", bg: "bg-white" },
  { icon: "31", bg: "bg-white" },
  { icon: "⚡", bg: "bg-white" },
];

export default function Integrations() {
  return (
    <section className="py-24 bg-white relative z-10" id="integrations">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="px-4 py-1.5 rounded-full border border-neutral-200 text-xs font-semibold text-neutral-500 tracking-wide uppercase mb-6 inline-block">
          Integrations
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight mb-16">
          Connect integrations
          <br />
          you use every day
        </h2>

        <div className="relative">
          {/* Subtle line connecting the icons conceptually */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-neutral-100 -z-10 hidden md:block"></div>

          <motion.div
            className="flex flex-wrap justify-center gap-4 md:gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } },
            }}
          >
            {tools.map((tool, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 10 },
                  show: { opacity: 1, scale: 1, y: 0 },
                }}
                whileHover={{ y: -5, scale: 1.05 }}
                className={`w-16 h-16 md:w-20 md:h-20 ${tool.bg} rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-50 flex items-center justify-center text-2xl md:text-3xl cursor-pointer transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]`}
              >
                {tool.icon}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
