"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  // 1. Check for token on mount safely without causing hydration pops
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3001/auth/me", {
          method: "GET",
          credentials: "include", // Essential so the browser sends the cookie to Express
        });
        const data = await res.json();
        queueMicrotask(() => setIsSignedIn(data.authenticated));
      } catch {
        queueMicrotask(() => setIsSignedIn(false));
      }
    };

    checkAuth();
  }, [pathname]);

  // 2. Close dropdown if clicking outside of the element
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Evict cookie session cleanly
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
    setIsSignedIn(false);
    setShowDropdown(false);
    router.push("/signin");
  };

  return (
    <nav className="relative z-50 flex items-center justify-between px-6 md:px-8 py-6 max-w-7xl mx-auto">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-xl tracking-tight text-neutral-900"
      >
        <div className="flex flex-wrap w-5 h-5 gap-[2px]">
          <span className="w-[9px] h-[9px] bg-[#0066FF] rounded-[2px]" />
          <span className="w-[9px] h-[9px] bg-neutral-800 rounded-[2px]" />
          <span className="w-[9px] h-[9px] bg-neutral-800 rounded-[2px]" />
          <span className="w-[9px] h-[9px] bg-neutral-800 rounded-[2px]" />
        </div>
        WSDraw
      </Link>

      {/* Navigation Links */}
      <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-500">
        <li>
          <Link
            href="#features"
            className="hover:text-neutral-900 transition-colors"
          >
            Features
          </Link>
        </li>
        <li>
          <Link
            href="#solutions"
            className="hover:text-neutral-900 transition-colors"
          >
            Solutions
          </Link>
        </li>
        <li>
          <Link
            href="#pricing"
            className="hover:text-neutral-900 transition-colors"
          >
            Pricing
          </Link>
        </li>
        <li>
          <Link
            href="#integrations"
            className="hover:text-neutral-900 transition-colors"
          >
            Integrations
          </Link>
        </li>
      </ul>

      {/* Dynamic Actions Interface */}
      <div className="flex items-center gap-4" ref={dropdownRef}>
        {isSignedIn ? (
          <div className="flex items-center gap-4 relative">
            {/* Elegant Workspace Redirection Link */}
            <Link
              href="/"
              className="px-5 py-2 text-sm font-medium text-white rounded-full bg-neutral-900 hover:bg-neutral-800 hover:shadow-sm transition-all"
            >
              Go to Workspace
            </Link>

            {/* Profile Avatar Control Panel */}
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-9 h-9 rounded-xl bg-white border border-neutral-200/80 shadow-sm flex items-center justify-center text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-all active:scale-[0.97]"
            >
              U
            </button>

            {/* Micro-Interaction Profile Menu Dropdown */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-12 w-48 bg-white/90 backdrop-blur-xl border border-neutral-100 rounded-2xl p-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)] text-left flex flex-col gap-0.5"
                >
                  <div className="px-3 py-2 mb-1">
                    <p className="text-xs font-medium text-neutral-400">
                      Signed in as
                    </p>
                    <p className="text-sm font-semibold text-neutral-800 truncate">
                      Gourav Biswal
                    </p>
                  </div>

                  <div className="h-[1px] bg-neutral-100 my-1 w-[90%] mx-auto" />

                  <Link
                    href="/"
                    onClick={() => setShowDropdown(false)}
                    className="w-full text-left px-3 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 font-medium text-xs transition-colors"
                  >
                    Account Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-xl text-red-500 hover:bg-red-50/60 font-medium text-xs transition-colors"
                  >
                    Log Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
            <Link
              href="/signin"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors hidden sm:block"
            >
              Sign in
            </Link>
            <button className="px-5 py-2 text-sm font-medium border border-neutral-200 text-neutral-900 rounded-full bg-white hover:bg-neutral-50 hover:shadow-sm transition-all">
              Get demo
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
