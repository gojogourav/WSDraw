"use client";

import { motion } from "framer-motion";

const featuresList = [
  "All product features",
  "Unlimited lists & tasks",
  "Priority support",
  "Unlimited tasks",
  "Unlimited file storage",
  "Unlimited projects",
];

export default function Pricing() {
  return (
    <section className="py-24 bg-white relative z-10" id="pricing">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <span className="px-4 py-1.5 rounded-full border border-neutral-200 text-xs font-semibold text-neutral-500 tracking-wide uppercase mb-6 inline-block">
          Pricing
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight mb-16">
          Simple pricing plans
        </h2>

        <div className="grid md:grid-cols-3 gap-6 items-center">
          {/* Basic Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#F8F9FB] rounded-3xl p-8 text-left border border-neutral-100"
          >
            <h3 className="text-lg font-semibold text-neutral-900">
              Basic plan
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Perfect for individuals.
            </p>
            <div className="text-5xl font-bold tracking-tight text-neutral-900 mb-8">
              $5
              <span className="text-xl font-normal text-neutral-400">/mo</span>
            </div>
            <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold mb-8 hover:bg-blue-700 transition-colors">
              Get started
            </button>
            <ul className="space-y-4 mb-6">
              {featuresList.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center text-sm text-neutral-600"
                >
                  <span className="text-neutral-400 mr-3">✓</span> {f}
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="text-xs text-neutral-500 underline underline-offset-4"
            >
              Learn more
            </a>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-blue-600 text-white rounded-[2rem] p-8 text-left shadow-2xl relative md:-mt-8 md:mb-8 scale-105"
          >
            <div className="absolute -top-4 -right-4 bg-white text-yellow-400 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg rotate-[10deg]">
              ⚡
            </div>
            <h3 className="text-lg font-semibold">Pro plan</h3>
            <p className="text-xs text-blue-200 mb-6">Ideal for small teams.</p>
            <div className="text-5xl font-bold tracking-tight mb-2">
              $9<span className="text-xl font-normal text-blue-200">/mo</span>
            </div>
            <div className="text-xs font-medium text-blue-200 mb-4">
              Best choice
            </div>
            <button className="w-full py-3 px-4 bg-white text-blue-600 rounded-xl font-semibold mb-8 hover:bg-neutral-50 transition-colors shadow-sm">
              Get started
            </button>
            <ul className="space-y-4 mb-6">
              {featuresList.map((f, i) => (
                <li key={i} className="flex items-center text-sm text-blue-50">
                  <span className="text-blue-300 mr-3">✓</span> {f}
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="text-xs text-blue-200 underline underline-offset-4"
            >
              Learn more
            </a>
          </motion.div>

          {/* Advanced Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#F8F9FB] rounded-3xl p-8 text-left border border-neutral-100"
          >
            <h3 className="text-lg font-semibold text-neutral-900">
              Advanced plan
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Best for large organizations.
            </p>
            <div className="text-5xl font-bold tracking-tight text-neutral-900 mb-8">
              $15
              <span className="text-xl font-normal text-neutral-400">/mo</span>
            </div>
            <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold mb-8 hover:bg-blue-700 transition-colors">
              Get started
            </button>
            <ul className="space-y-4 mb-6">
              {featuresList.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center text-sm text-neutral-600"
                >
                  <span className="text-neutral-400 mr-3">✓</span> {f}
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="text-xs text-neutral-500 underline underline-offset-4"
            >
              Learn more
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
