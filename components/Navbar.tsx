"use client";

import { useState } from "react";
import { User } from "lucide-react";

const navItems = [
  "HOME",
  "MUSIC",
  "VIDEOS",
  "TOUR",
  "SHOP",
  "ABOUT",
  "LIVE",
  "CONTACT",
  "MERCH",
];

export default function Navbar() {
  const [active, setActive] = useState("HOME");

  return (
    <header className="w-full sticky top-0 z-50 bg-black border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LEFT LOGO */}
        <div className="text-white font-semibold tracking-[0.3em] text-xs">
          YOUR LABEL
        </div>

        {/* CENTER NAV */}
        <nav className="flex items-center gap-8 text-[11px] tracking-[0.25em] uppercase">
          {navItems.map((item) => {
            const isActive = active === item;

            return (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={`relative transition duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {/* TEXT */}
                <span className="transition">{item}</span>

                {/* UNDERLINE */}
                <span
                  className={`absolute left-0 -bottom-2 h-[1px] w-full bg-white transition-all duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* LIVE DOT */}
                {item === "LIVE" && (
                  <span className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          <button className="text-[11px] px-3 py-1 border border-white/10 rounded-full text-white/50 hover:text-white hover:border-white/30 transition">
            LOGIN
          </button>

          <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-white/30 transition">
            <User size={16} className="text-white/70" />
          </div>
        </div>

      </div>
    </header>
  );
}