"use client";

import { motion } from "framer-motion";

export default function Solutions() {
  return (
    <section className="py-24 bg-white relative z-10" id="solutions">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <span className="px-4 py-1.5 rounded-full border border-neutral-200 text-xs font-semibold text-neutral-500 tracking-wide uppercase mb-6 inline-block">
            Solutions
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
            Solve your team's
            <br />
            biggest challenges
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10 mb-16 text-left">
          {[
            {
              icon: "✧",
              text: "Ensure your team is always on the same page with task-sharing and transparent updates.",
            },
            {
              icon: "≡",
              text: "Prioritize and manage tasks effectively so your team can focus on what matters most.",
            },
            {
              icon: "👤",
              text: "Hold everyone accountable without the need for constant check-ins.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col gap-3"
            >
              <div className="text-xl text-yellow-500 mb-1">{item.icon}</div>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mockup Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative bg-gradient-to-b from-[#25A0FF] to-[#0066FF] rounded-[2rem] p-4 md:p-6 shadow-2xl"
        >
          <div className="bg-white rounded-xl h-[400px] w-full overflow-hidden shadow-inner flex items-center justify-center text-neutral-300 font-medium">
            {/* Replace this div with your actual dashboard image/UI */}
            Dashboard UI Mockup goes here
          </div>

          {/* Floating decorative elements over the mockup */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -left-6 top-1/2 bg-white rounded-xl shadow-lg p-4 font-bold text-xl text-neutral-800 rotate-[-10deg]"
          >
            20
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -right-4 top-1/3 bg-white rounded-xl shadow-lg p-3 text-green-500 rotate-[10deg]"
          >
            ✓
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
