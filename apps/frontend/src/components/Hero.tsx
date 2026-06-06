"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Hero() {
  return (
    <div className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center z-10 min-h-[95vh] justify-center overflow-hidden">
      {/* 2. Floating Checkmark (Behind Sticky Note) */}

      <motion.div
        className="absolute z-20   bg-white/40 backdrop-blur-md border border-white/50 w-72 h-72 hidden xl:block rounded-3xl shadow-lg"
        style={{ left: "0%", top: "16rem", rotate: "15deg" }}
        animate={{ y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute z-30 top-96 hidden xl:block"
        style={{ left: "7%", top: "18rem" }}
        animate={{ y: [0, 5, 0], rotate: 0 }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      >
        <div className="bg-white  p-4 -left-1/2 -top-96  rounded-2xl shadow-[0_8px_25px_rgb(0,0,0,0.06)] border border-neutral-50">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-inner">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Floating Sticky Note (Existing) */}
      <motion.div
        className="absolute hidden xl:block z-0 "
        style={{ left: "6%", top: "8rem" }}
        animate={{ y: [0, 5, 0], rotate: 5 }}
        transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
      >
        <div className="bg-[#FFF9C4] w-60 h-52 -left-1/4 p-5 rounded-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] w-48 relative border border-yellow-100">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-400 rounded-full shadow-sm" />
          <p className="text-xs font-mono font-medium text-neutral-700 leading-relaxed text-left">
            Take notes to keep track of crucial details, and accomplish more
            tasks with ease.
          </p>
        </div>
      </motion.div>

      {/* Floating Reminder Card (Existing) */}
      <motion.div
        className="absolute hidden xl:block z-10"
        style={{ right: "8%", top: "9rem" }}
        animate={{ y: [0, 15, 0], rotate: 1 }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        <div className="bg-white rounded-2xl p-4 w-52 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.08)] border border-neutral-100 text-left">
          <div className="flex justify-between items-start mb-2">
            <div className="text-[10px] font-bold text-neutral-400">
              Reminders
            </div>
            <div className="text-[9px] text-neutral-300">Meetings</div>
          </div>
          <div className="text-xs font-bold text-neutral-900 mb-0.5 mt-2">
            Today's Meeting
          </div>
          <div className="text-[10px] text-neutral-400 mb-3">
            Call with marketing team
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-blue-500 bg-blue-50 py-1.5 rounded-lg">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            13:00 – 13:45
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute hidden xl:block z-20"
        style={{ right: "19%", top: "12rem" }}
        animate={{ y: [0, -10, 0], rotate: 8 }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
      >
        <div className="bg-white p-3 rounded-2xl shadow-[0_8px_25px_rgb(0,0,0,0.08)] border border-neutral-50">
          <div className="w-10 h-10 rounded-full border-4 border-neutral-800 flex items-center justify-center relative">
            <div className="w-1 h-3 bg-neutral-800 absolute top-1 rounded-full origin-bottom rotate-45"></div>
            <div className="w-1 h-2 bg-neutral-800 absolute top-3 left-3 rounded-full origin-bottom rotate-[-30deg]"></div>
          </div>
        </div>
      </motion.div>

      {/* 4. Today's Tasks Card (Bottom Left) */}
      <motion.div
        className="absolute hidden lg:block z-0"
        style={{ left: "5%", bottom: "5rem" }}
        animate={{ y: [0, -10, 0], rotate: -4 }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      >
        <div className="bg-white rounded-2xl p-5 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-neutral-100 w-64 text-left">
          <div className="bg-neutral-100 rounded-t-xl h-4 w-24 absolute -top-4 left-0"></div>
          <h3 className="font-bold text-sm text-neutral-800 mb-4">
            Today's tasks
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded">
                  8
                </div>
                <div className="text-[11px] font-medium text-neutral-700 truncate flex-1">
                  New Ideas for campaign
                </div>
                <div className="flex -space-x-1.5">
                  <img
                    src="https://i.pravatar.cc/150?u=1"
                    className="w-4 h-4 rounded-full border border-white"
                    alt=""
                  />
                  <img
                    src="https://i.pravatar.cc/150?u=2"
                    className="w-4 h-4 rounded-full border border-white"
                    alt=""
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-neutral-400">
                <span>Sep 10</span>
                <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="w-[60%] h-full bg-blue-500"></div>
                </div>
                <span>60%</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-green-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded">
                  3
                </div>
                <div className="text-[11px] font-medium text-neutral-700 truncate flex-1">
                  Design PPT #4
                </div>
                <div className="flex -space-x-1.5">
                  <img
                    src="https://i.pravatar.cc/150?u=3"
                    className="w-4 h-4 rounded-full border border-white"
                    alt=""
                  />
                  <img
                    src="https://i.pravatar.cc/150?u=4"
                    className="w-4 h-4 rounded-full border border-white"
                    alt=""
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-neutral-400">
                <span>Sep 18</span>
                <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden flex">
                  <div className="w-[80%] h-full bg-blue-500"></div>
                  <div className="w-[20%] h-full bg-red-500"></div>
                </div>
                <span>112%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 5. 100+ Integrations Card (Bottom Right) */}
      <motion.div
        className="absolute hidden lg:block z-0"
        style={{ right: "6%", bottom: "6rem" }}
        animate={{ y: [0, 10, 0], rotate: 4 }}
        transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut" }}
      >
        <div className="bg-white rounded-2xl p-5 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-neutral-100 w-64 text-left">
          <div className="bg-neutral-100 rounded-t-xl h-4 w-24 absolute -top-4 right-0"></div>
          <h3 className="font-bold text-xs text-neutral-800 mb-4">
            100+ Integrations
          </h3>
          <div className="flex gap-3">
            <div className="w-14 h-14 bg-white rounded-xl shadow-md border border-neutral-50 flex items-center justify-center text-2xl">
              M
            </div>
            <div className="w-14 h-14 bg-white rounded-xl shadow-md border border-neutral-50 flex items-center justify-center text-2xl">
              💬
            </div>
            <div className="w-14 h-14 bg-white rounded-xl shadow-md border border-neutral-50 flex items-center justify-center text-xl font-bold text-blue-500">
              31
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Typography */}
      <section className="max-w-3xl mx-auto z-10 mb-12 mt-10">
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

// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { v4 as uuidv4 } from "uuid";

function ActionCard() {
  const [isJoining, setIsJoining] = useState(false);
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  const handleSubmit = async () => {
    if (!name.trim()) return;

    if (isJoining) {
      router.push(`/room/${roomId.trim()}?name=${encodeURIComponent(name)}`);
    } else {
      const res = await fetch("http://localhost:3001/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: uuidv4() }),
      });
      const data = await res.json();
      router.push(`/room/${data.room.id}?name=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className="w-full max-w-md relative z-20">
      <div className="bg-white/80 backdrop-blur-xl border border-neutral-100 rounded-[2rem] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] text-left">
        {/* ... your existing toggle ... */}

        <label className="block text-sm font-medium text-neutral-600 mb-2 ml-1">
          Your Name
        </label>
        <input
          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-5 py-3.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all mb-4"
          type="text"
          placeholder="e.g. Gourav"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {isJoining && (
          <input
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-5 py-3.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all mb-4"
            type="text"
            placeholder="Paste Room ID here"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-[#0066FF] hover:bg-blue-600 text-white font-medium rounded-xl px-5 py-4 transition-all hover:shadow-[0_8px_25px_-5px_rgba(0,102,255,0.4)] active:scale-[0.98] mt-2"
        >
          {isJoining ? "Enter Workspace" : "Start Drawing Free"}
        </button>
      </div>
    </div>
  );
}
