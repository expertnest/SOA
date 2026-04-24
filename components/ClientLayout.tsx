"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import useIsMobile from "@/hooks/useIsMobile";
import MusicPlayer from "@/components/mobileUI/MusicPlayer";
import Navbar from "./mobileUI/Navbar";
import { MusicProvider } from "@/hooks/MusicContext";

// ✅ Contribution Tab Component (masculine Tidal-style)
function ContributionTab() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const bottomPosition = isMobile ? "80px" : "20px";

  return (
    <div
      className="fixed right-4 z-40 flex flex-col items-end"
      style={{ bottom: bottomPosition }}
    >
      {/* Panel */}
      <div
        className={`flex flex-col items-center rounded-3xl shadow-2xl p-5 gap-4 mb-2 transition-all duration-300 backdrop-blur-xl bg-gray-900/80 border border-gray-700 ${
          open ? "max-w-xs opacity-100 scale-100" : "max-w-0 opacity-0 scale-90"
        }`}
      >
        <p className="text-gray-200 font-semibold text-center text-sm">
          🎵 Enjoy our music? Support the artist!
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          {["$5", "$10", "$25"].map((amount) => (
            <button
              key={amount}
              className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 py-3 px-6 rounded-xl text-gray-100 font-bold transition-all shadow-lg hover:scale-105"
            >
              💵 {amount}
            </button>
          ))}
          <button className="bg-gradient-to-r from-green-800 via-green-700 to-green-600 hover:from-green-700 hover:via-green-600 hover:to-green-500 py-3 px-6 rounded-xl text-gray-100 font-bold transition-all shadow-lg hover:scale-105">
            💳 Custom
          </button>
        </div>
      </div>

      {/* Fire Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-gray-800 text-gray-100 p-4 rounded-full shadow-lg hover:bg-gray-700 transition-all text-2xl"
      >
        🔥
      </button>
    </div>
  );
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  const hideSidebars = useIsMobile();
  const pathname = usePathname();
  const [showUI, setShowUI] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollRef = useRef(0);
  const isScrollNav = pathname === "/" || pathname === "/news";

  // ✅ Handle show/hide mobile navbar on scroll
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

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Merch", href: "/merch" },
    { name: "Videos", href: "/videos" },
    { name: "Tour", href: "/tour" },
    { name: "Artist", href: "/artists" },
    { name: "Contact", href: "/contact" },
  ];

   ;

  return (
    <MusicProvider>
      <div className="relative w-full md:h-screen flex-1 flex flex-col overflow-hidden bg-black text-white">
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Desktop Navbar */}
          {!hideSidebars && (
            <div className="sticky top-0 z-50 flex justify-center bg-black/95 backdrop-blur-sm shadow-lg border-b border-gray-800">
              <div className="flex-1 max-w-[calc(100%-500px)] mx-auto px-4 py-3 flex">
                {/* Left: Brand */}
                <div className="w-1/3 flex justify-start">
                  <div className="text-2xl font-extrabold uppercase tracking-[0.15em] text-white">
                 SOA Music
                  </div>
                </div>

                {/* Middle: Nav Links */}
                <nav className="w-1/3 flex justify-center gap-8 text-sm md:text-base font-medium uppercase tracking-wide">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="relative group cursor-pointer"
                    >
                      <span className="text-white/70 transition-all duration-300 group-hover:text-white">
                        {item.name}
                      </span>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  ))}
                </nav>

                {/* Right: Extra Links */}
              
              </div>
            </div>
          )}

          {/* Main Layout */}
          <div className="flex flex-1 flex-row overflow-hidden">
            {!hideSidebars && <LeftSidebar />}
            <main
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto overscroll-contain touch-pan-y pt-[70px] md:pt-[0px] will-change-transform transform-gpu scroll-smooth"
            >
              <div className="min-h-full pb-[100px]">{children}</div>
            </main>
            {!hideSidebars && <RightSidebar />}
          </div>
        </div>

        {/* Mobile Navbar */}
        {hideSidebars && (
          <div
            className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-200 ease-out ${
              isScrollNav ? (showUI ? "translate-y-0" : "-translate-y-full") : ""
            }`}
          >
            <Navbar />
          </div>
        )}

        {/* Mobile Music Player */}
        {hideSidebars && (
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <MusicPlayer />
          </div>
        )}

        {/* ✅ Contribution Tab */}
        <ContributionTab />
      </div>
    </MusicProvider>
  );
}
