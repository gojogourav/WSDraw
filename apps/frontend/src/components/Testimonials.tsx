"use client";

import { motion } from "framer-motion";

// Column 1 Data
const col1 = [
  {
    text: "This task manager has completely transformed the way my team works. We now collaborate in real-time and always meet deadlines.",
    name: "John D.",
    role: "Marketing Lead",
    avatar: "https://i.pravatar.cc/150?u=10",
    hasFloatingBubble: true, // Specific to this card in the design
  },
  {
    text: "I love how easy it is to create and assign tasks. The platform's interface makes work feel less overwhelming.",
    name: "Daniela T.",
    role: "Operations Manager",
    avatar: "https://i.pravatar.cc/150?u=13",
  },
];

// Column 2 Data
const col2 = [
  {
    text: "An essential tool for anyone looking to manage their tasks better.",
    name: "Sarah W.",
    role: "Freelance Designer",
    avatar: "https://i.pravatar.cc/150?u=11",
  },
  {
    text: "The time-tracking feature has been a game-changer for my freelance projects. It helps me stay organized and productive.",
    name: "Alex M.",
    role: "Freelance Developer",
    avatar: "https://i.pravatar.cc/150?u=14",
  },
];

// Column 3 Data
const col3 = [
  {
    text: "The built-in analytics give me a complete overview of our team's productivity.",
    name: "Sam J.",
    role: "Project Coordinator",
    avatar: "https://i.pravatar.cc/150?u=12",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#F8F9FB] relative z-10" id="testimonials">
      <div className="max-w-[70rem] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="px-5 py-2 rounded-full border border-neutral-200 text-[11px] font-bold text-neutral-500 tracking-widest uppercase mb-6 inline-block bg-white shadow-sm">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
            People just like you
            <br />
            are already using WSDraw
          </h2>
        </div>

        {/* 3-Column Masonry Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            {col1.map((testi, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                className="bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-neutral-100 flex flex-col justify-between relative"
              >
                {/* Floating Speech Bubble specific to the first card */}
                {testi.hasFloatingBubble && (
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white rounded-2xl p-3 shadow-xl border border-neutral-50 rotate-[-8deg] z-10 hidden lg:block"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9CA3AF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      <line x1="9" y1="10" x2="15" y2="10"></line>
                    </svg>
                  </motion.div>
                )}

                <p className="text-neutral-700 leading-relaxed text-[15px] mb-12">
                  "{testi.text}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testi.avatar}
                    alt={testi.name}
                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                  />
                  <div>
                    <div className="font-semibold text-sm text-neutral-900">
                      {testi.name}
                    </div>
                    <div className="text-xs text-neutral-500 font-medium mt-0.5">
                      {testi.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6 pt-0 md:pt-4">
            {col2.map((testi, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-neutral-100 flex flex-col justify-between h-full"
              >
                <p className="text-neutral-700 leading-relaxed text-[15px] mb-12">
                  "{testi.text}"
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <img
                    src={testi.avatar}
                    alt={testi.name}
                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                  />
                  <div>
                    <div className="font-semibold text-sm text-neutral-900">
                      {testi.name}
                    </div>
                    <div className="text-xs text-neutral-500 font-medium mt-0.5">
                      {testi.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            {col3.map((testi, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-neutral-100 flex flex-col justify-between"
              >
                <p className="text-neutral-700 leading-relaxed text-[15px] mb-12">
                  "{testi.text}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testi.avatar}
                    alt={testi.name}
                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                  />
                  <div>
                    <div className="font-semibold text-sm text-neutral-900">
                      {testi.name}
                    </div>
                    <div className="text-xs text-neutral-500 font-medium mt-0.5">
                      {testi.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Video Placeholder Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative w-full h-[320px] rounded-[2rem] bg-neutral-100 mt-2"
            >
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)]">
                <img
                  src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Video cover"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom pill overlay */}
              <div className="absolute bottom-5 left-5 right-14 flex justify-start items-center z-10">
                <span className="text-white text-xs font-semibold bg-black/30 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-sm">
                  Watch video review
                </span>
              </div>

              {/* Floating Play Button overlaying the bottom right corner */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 15 }}
                className="absolute -right-4 -bottom-4 rotate-20 bg-white p-2.5 rounded-3xl shadow-xl z-20 cursor-pointer"
              >
                <div className="bg-[#FF0000] w-14 h-11  rounded-2xl flex items-center justify-center shadow-[0_4px_15px_rgba(255,0,0,0.3)]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="white"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
