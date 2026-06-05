"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="relative z-50 flex items-center justify-between px-6 md:px-8 py-6 max-w-7xl mx-auto">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-xl tracking-tight text-neutral-900"
      >
        <div className="flex flex-wrap w-5 h-5 gap-[2px]">
          <span className="w-[9px] h-[9px] bg-blue-500 rounded-[2px]" />
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

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors hidden sm:block">
          Sign in
        </button>
        <button className="px-5 py-2 text-sm font-medium border border-neutral-200 text-neutral-900 rounded-full bg-white hover:bg-neutral-50 hover:shadow-sm transition-all">
          Get demo
        </button>
      </div>
    </nav>
  );
}
