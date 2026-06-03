"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import TaskCard from "@/components/ui/TaskCard";

export default function LandingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newRoomId = uuidv4().slice(0, 8);
    router.push(`/room/${newRoomId}?name=${encodeURIComponent(name)}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roomId.trim()) return;
    router.push(`/room/${roomId}?name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] relative overflow-hidden font-sans text-neutral-900">
      {/* Subtle dotted background pattern */}
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Navbar mock */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap w-6 h-6 gap-[2px]">
            <div className="w-[10px] h-[10px] bg-blue-500 rounded-sm" />
            <div className="w-[10px] h-[10px] bg-neutral-800 rounded-sm" />
            <div className="w-[10px] h-[10px] bg-neutral-800 rounded-sm" />
            <div className="w-[10px] h-[10px] bg-neutral-800 rounded-sm" />
          </div>
          <span className="font-bold text-xl tracking-tight">WSDraw</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-neutral-500">
          <span className="hover:text-neutral-900 cursor-pointer transition-colors">
            Features
          </span>
          <span className="hover:text-neutral-900 cursor-pointer transition-colors">
            Templates
          </span>
          <span className="hover:text-neutral-900 cursor-pointer transition-colors">
            Resources
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium cursor-pointer text-neutral-600 hover:text-neutral-900">
            Sign in
          </span>
          <button className="px-5 py-2 text-sm font-medium border border-neutral-200 rounded-full hover:shadow-sm transition-all bg-white">
            Get demo
          </button>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center pt-20 px-4">
        {/* Floating Decorative Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%] hidden lg:flex flex-col items-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] bg-white rounded-2xl p-4 rotate-[-6deg]"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-2">
            <div className="w-6 h-6 border-2 border-blue-500 rounded-md" />
          </div>

          {/* Floating Task Card Section */}

          <div className="w-16 h-2 bg-neutral-100 rounded-full" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-40 right-[15%] hidden lg:block shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] bg-[#FFF9C4] rounded-sm p-4 w-40 rotate-[4deg]"
        >
          <div className="w-2 h-2 rounded-full bg-red-400 absolute -top-1 left-1/2 transform -translate-x-1/2 shadow-sm" />
          <p className="text-[10px] font-medium text-neutral-700 leading-relaxed font-mono">
            Sketch ideas, diagram architectures, and align your team instantly.
          </p>
        </motion.div>

        {/* Hero Typography */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-4 text-neutral-900">
            Think, draw, and track <br />
            <span className="text-neutral-400 font-light">
              all in one place
            </span>
          </h1>
          <p className="text-lg text-neutral-500 mt-6">
            Real-time collaborative whiteboarding to boost productivity.
          </p>
        </div>

        {/* Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-neutral-100 rounded-[2rem] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]"
        >
          {/* Custom Pill Toggle */}
          <div className="flex p-1 bg-neutral-100 rounded-2xl mb-8 relative">
            <motion.div
              className="absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm"
              animate={{ left: isJoining ? "calc(50% + 2px)" : "4px" }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
            <button
              onClick={() => setIsJoining(false)}
              className={`flex-1 py-2.5 text-sm font-semibold z-10 transition-colors ${!isJoining ? "text-neutral-900" : "text-neutral-500"}`}
            >
              Create Room
            </button>
            <button
              onClick={() => setIsJoining(true)}
              className={`flex-1 py-2.5 text-sm font-semibold z-10 transition-colors ${isJoining ? "text-neutral-900" : "text-neutral-500"}`}
            >
              Join Room
            </button>
          </div>

          <form
            onSubmit={isJoining ? handleJoinRoom : handleCreateRoom}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2 ml-1">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Gourav"
                required
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {isJoining && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden"
              >
                <div className="pt-1">
                  <label className="block text-sm font-medium text-neutral-600 mb-2 ml-1">
                    Room ID
                  </label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Paste Room ID here"
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full mt-4 bg-[#0066FF] hover:bg-blue-600 text-white font-medium rounded-2xl px-5 py-4 transition-all hover:shadow-[0_8px_25px_-5px_rgba(0,102,255,0.4)] active:scale-[0.98]"
            >
              {isJoining ? "Enter Workspace" : "Start Drawing Free"}
            </button>
          </form>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -50, rotate: -10 }}
          animate={{
            opacity: 1,
            x: 0,
            rotate: -4, // Base tilted angle
            y: [0, -12, 0], // Continuous floating loop
          }}
          transition={{
            opacity: { duration: 0.8, ease: "easeOut" },
            x: { duration: 0.8, ease: "easeOut" },
            rotate: { duration: 0.8, ease: "easeOut" },
            y: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="absolute bg-white bottom-12 left-[8%] hidden xl:block pointer-events-auto cursor-grab active:cursor-grabbing"
        >
          <TaskCard />
        </motion.div>
      </main>
    </div>
  );
}
