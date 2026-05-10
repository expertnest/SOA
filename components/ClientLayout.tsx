"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import useIsMobile from "@/hooks/useIsMobile";
import MusicPlayer from "@/components/mobileUI/MusicPlayer";
import Navbar from "./mobileUI/Navbar";
import { MusicProvider } from "@/hooks/MusicContext";
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
];

export default function ClientLayout({ children }: { children: ReactNode }) {
  const hideSidebars = useIsMobile();
  const pathname = usePathname();

  const [showUI, setShowUI] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollRef = useRef(0);

  const isScrollNav = pathname === "/" || pathname === "/news";

  useEffect(() => {
    if (!hideSidebars || !isScrollNav) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    let ticking = false;

    const handleScroll = () => {
      const currentScroll = container.scrollTop;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScroll > lastScrollRef.current + 10) setShowUI(false);
          else if (currentScroll < lastScrollRef.current - 10) setShowUI(true);

          lastScrollRef.current = currentScroll;
          ticking = false;
        });

        ticking = true;
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hideSidebars, isScrollNav]);

  return (
    <MusicProvider>
      <div className="relative w-full h-screen flex flex-col bg-black text-white overflow-hidden">

        <div className="flex flex-1 min-h-0">

          {/* LEFT SIDEBAR */}
          {!hideSidebars && <LeftSidebar />}

          {/* CENTER AREA */}
          <div className="flex-1 flex flex-col min-h-0 bg-black">

            {/* 🔥 NAVBAR */}
            {!hideSidebars && (
              <div className="w-full flex justify-center px-6 py-4 border-b border-gray-800 shrink-0">
                <div className="w-full max-w-[1400px] flex justify-center">

                  <div className="flex items-center justify-between w-full px-8 py-3
                    bg-black/40 backdrop-blur-xl 
                    border border-white/10 
                    rounded-2xl 
                    shadow-[0_0_35px_rgba(99,102,241,0.08)]">

                    {/* BRAND */}
                    <div className="flex items-center gap-6">
                      <div className="text-xs tracking-[0.35em] text-white font-semibold">
                        SOA
                      </div>
                    </div>

                    {/* NAV ITEMS */}
                    <div className="flex items-center gap-8">
                      {navItems.map((item) => (
                        <button
                          key={item}
                          className="relative text-[11px] tracking-[0.28em] text-white/50 hover:text-white transition group"
                        >
                          {item}
                          <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-indigo-400 transition-all duration-300 group-hover:w-full" />
                        </button>
                      ))}
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                      <button className="text-xs text-white/60 hover:text-white transition tracking-wide">
                        LOGIN
                      </button>

                      <User className="w-5 h-5 text-white/60 hover:text-indigo-400 cursor-pointer transition" />
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* 🔥 MAIN BODY */}
            <div className="flex flex-1 min-h-0">

              {/* MAIN CONTENT */}
              <main
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto scroll-smooth min-h-0"
              >
                <div className="min-h-full pb-[120px]">
                  {children}
                </div>
              </main>

              {/* RIGHT SIDEBAR */}
              {!hideSidebars && (
                <div className="w-[260px] flex flex-col min-h-0 border-l border-gray-800">
                  <RightSidebar />
                </div>
              )}

            </div>
          </div>
        </div>

        {/* 📱 MOBILE NAV */}
        {hideSidebars && (
          <div
            className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-200 ${
              isScrollNav ? (showUI ? "translate-y-0" : "-translate-y-full") : ""
            }`}
          >
            <div className="flex justify-center">
              <div className="w-full max-w-5xl">
                <Navbar />
              </div>
            </div>
          </div>
        )}

        {/* 📱 MOBILE MUSIC PLAYER */}
        {hideSidebars && (
          <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
            <div className="w-full max-w-5xl">
              <MusicPlayer />
            </div>
          </div>
        )}

      </div>
    </MusicProvider>
  );
}