"use client";

import { motion } from "framer-motion";

interface Task {
  id: string;
  iconColor: string;
  number: number;
  title: string;
  date: string;
  progress: number;
  avatars: string[];
}

const tasks: Task[] = [
  {
    id: "1",
    iconColor: "bg-[#FF5733]", // Vibrant red-orange
    number: 8,
    title: "New Ideas for campaign",
    date: "Sep 10",
    progress: 60,
    avatars: ["https://i.pravatar.cc/150?u=1", "https://i.pravatar.cc/150?u=2"],
  },
  {
    id: "2",
    iconColor: "bg-[#00C48C]", // Vibrant green
    number: 3,
    title: "Design PPT #4",
    date: "Sep 18",
    progress: 112,
    avatars: ["https://i.pravatar.cc/150?u=3", "https://i.pravatar.cc/150?u=4"],
  },
];

export default function TaskCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-80 drop-shadow-[0_15px_35px_rgba(0,0,0,0.05)]"
    >
      <div className="absolute -top-10 left-0 h-12 w-36 bg-[#F4F5F7] rounded-t-2xl z-0" />

      <div className="absolute -top-4 left-[8.5rem] w-4 h-4 bg-transparent rounded-bl-xl shadow-[-5px_5px_0_0_#F4F5F7] z-10" />

      <div className="relative z-10 bg-[#F4F5F7] rounded-2xl rounded-tl-none p-5 pb-6">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4 tracking-tight">
          Today's tasks
        </h3>

        <div className="space-y-3">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl p-4 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.03)] border border-white/60"
            >
              {/* Top Row: Icon, Title, Avatars */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-[0.3rem] ${task.iconColor} text-white text-[11px] flex items-center justify-center font-bold shadow-sm`}
                  >
                    {task.number}
                  </div>
                  <span className="font-medium text-sm text-neutral-700 truncate max-w-[130px]">
                    {task.title}
                  </span>
                </div>

                {/* Overlapping Avatars */}
                <div className="flex -space-x-1.5">
                  {task.avatars.map((avatar, i) => (
                    <img
                      key={i}
                      className="w-6 h-6 rounded-full border-[1.5px] border-white object-cover shadow-sm"
                      src={avatar}
                      alt="Assignee avatar"
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Row: Date, Progress Bar, Percentage */}
              <div className="flex items-center justify-between text-[11px] font-medium text-neutral-400 gap-3">
                <span className="w-10">{task.date}</span>

                {/* Custom Progress Bar Engine */}
                <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden flex">
                  {task.progress <= 100 ? (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${task.progress}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-[#1DA1F2] rounded-full"
                    />
                  ) : (
                    <>
                      {/* Base 100% equivalent (scaled down visually) */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "80%" }} // Visual scaling for overflow
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-[#1DA1F2] rounded-l-full"
                      />
                      {/* Overflow indicator (the red segment) */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "20%" }}
                        transition={{ duration: 0.5, delay: 1 }}
                        className="h-full bg-[#FF5733] rounded-r-full"
                      />
                    </>
                  )}
                </div>

                <span className="text-neutral-600 w-8 text-right">
                  {task.progress}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
