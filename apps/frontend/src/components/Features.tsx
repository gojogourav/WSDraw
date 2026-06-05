"use client";

import { motion } from "framer-motion";

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-24 bg-[#F8F9FB] relative z-10" id="features">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="px-4 py-1.5 rounded-full border border-neutral-200 text-xs font-semibold text-neutral-500 tracking-wide uppercase mb-6 inline-block bg-white">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight mb-4">
            Keep everything in one place
          </h2>
          <p className="text-neutral-500">
            Forget complex project management tools.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Feature 1 */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm flex flex-col items-center text-center"
          >
            <div className="w-full h-48 bg-neutral-50 rounded-xl mb-8 flex items-center justify-center overflow-hidden border border-neutral-100 relative">
              {/* Decorative UI element */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 w-48 text-left">
                <div className="text-[10px] text-blue-500 font-semibold mb-2 bg-blue-50 w-fit px-2 py-0.5 rounded">
                  Members 2
                </div>
                <div className="flex -space-x-2">
                  <img
                    className="w-8 h-8 rounded-full border-2 border-white"
                    src="https://i.pravatar.cc/150?u=5"
                    alt=""
                  />
                  <img
                    className="w-8 h-8 rounded-full border-2 border-white"
                    src="https://i.pravatar.cc/150?u=6"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              Seamless Collaboration
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-[280px]">
              Work together with your team effortlessly, share tasks, and update
              progress in real-time.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm flex flex-col items-center text-center"
          >
            <div className="w-full h-48 bg-neutral-50 rounded-xl mb-8 flex items-center justify-center overflow-hidden border border-neutral-100">
              {/* Decorative UI element */}
              <div className="flex gap-2 items-end h-24">
                <div className="w-8 bg-[#00C48C] rounded-t-md h-full"></div>
                <div className="w-8 bg-[#1DA1F2] rounded-t-md h-3/4"></div>
                <div className="w-8 bg-neutral-200 rounded-t-md h-1/2"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              Time Management Tools
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-[280px]">
              Optimize your time with integrated tools like timers, reminders,
              and schedules.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm flex flex-col items-center text-center"
          >
            <div className="w-full h-48 bg-neutral-50 rounded-xl mb-8 flex items-center justify-center overflow-hidden border border-neutral-100">
              <div className="w-full px-6 space-y-3">
                <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full w-[70%] bg-yellow-400"></div>
                </div>
                <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full w-[40%] bg-blue-500"></div>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              Advanced task tracking
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-[280px]">
              A bird's eye view of your entire behaviour and productivity.
            </p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm flex flex-col items-center text-center"
          >
            <div className="w-full h-48 bg-neutral-50 rounded-xl mb-8 flex items-center justify-center overflow-hidden border border-neutral-100 relative">
              <div className="bg-white p-3 rounded-xl shadow-md absolute text-lg font-bold text-neutral-800 rotate-[-5deg]">
                04:21
              </div>
              <div className="bg-yellow-400 p-2 rounded-lg shadow-md absolute right-12 top-10 text-white rotate-[10deg]">
                Widgets
              </div>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              Customizable Workspaces
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-[280px]">
              Adapt the platform to fit your unique workflow seamlessly.
            </p>
          </motion.div>
        </motion.div>

        <p className="text-center text-sm font-medium text-neutral-400 mt-10">
          and a lot more features...
        </p>
      </div>
    </section>
  );
}
