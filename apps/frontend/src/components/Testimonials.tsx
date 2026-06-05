"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    text: "This task manager has completely transformed the way my team works. We now collaborate in real-time and always meet deadlines.",
    name: "John D.",
    role: "Marketing Lead",
    avatar: "https://i.pravatar.cc/150?u=10",
    colSpan: "col-span-1",
  },
  {
    text: "An essential tool for anyone looking to manage their tasks better.",
    name: "Sarah W.",
    role: "Freelance Designer",
    avatar: "https://i.pravatar.cc/150?u=11",
    colSpan: "col-span-1",
  },
  {
    text: "The built-in analytics give me a complete overview of our team's productivity.",
    name: "Sam J.",
    role: "Project Coordinator",
    avatar: "https://i.pravatar.cc/150?u=12",
    colSpan: "col-span-1",
  },
  {
    text: "I love how easy it is to create and assign tasks. The platform's interface makes work feel less overwhelming.",
    name: "Daniela T.",
    role: "Operations Manager",
    avatar: "https://i.pravatar.cc/150?u=13",
    colSpan: "col-span-1",
  },
  {
    text: "The time-tracking feature has been a game-changer for my freelance projects. It helps me stay organized and productive.",
    name: "Alex M.",
    role: "Freelance Developer",
    avatar: "https://i.pravatar.cc/150?u=14",
    colSpan: "col-span-1",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#F8F9FB] relative z-10" id="testimonials">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="px-4 py-1.5 rounded-full border border-neutral-200 text-xs font-semibold text-neutral-500 tracking-wide uppercase mb-6 inline-block bg-white">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
            People just like you
            <br />
            are already using WSDraw
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 auto-rows-min">
          {testimonials.map((testi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm flex flex-col justify-between ${
                i === 0 || i === 4 ? "md:row-span-2" : "" // Creates the masonry effect
              }`}
            >
              <p className="text-neutral-600 leading-relaxed mb-8 text-sm md:text-base">
                "{testi.text}"
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <img
                  src={testi.avatar}
                  alt={testi.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-sm text-neutral-900">
                    {testi.name}
                  </div>
                  <div className="text-xs text-neutral-500">{testi.role}</div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Video Placeholder Card to match design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-neutral-900 rounded-3xl overflow-hidden relative shadow-lg md:row-span-2 min-h-[250px]"
          >
            <img
              src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="Video cover"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-red-600 text-white w-12 h-8 rounded-xl flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                ▶
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <span className="text-white text-xs font-medium bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
                Watch video review
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
