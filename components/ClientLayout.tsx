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

export default function ClientLayout({ children }: { children: ReactNode }) {
  const hideSidebars = useIsMobile();
  const pathname = usePathname();
  const [showUI, setShowUI] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollRef = useRef(0);

  const isScrollNav = pathname === "/" || pathname === "/news"; // Only scroll-hide on these routes

  useEffect(() => {
    if (!hideSidebars || !isScrollNav) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScroll = container.scrollTop;
      if (currentScroll > lastScrollRef.current + 10) setShowUI(false);
      else if (currentScroll < lastScrollRef.current - 10) setShowUI(true);
      lastScrollRef.current = currentScroll;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hideSidebars, isScrollNav]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Merch", href: "/merch" },
    { name: "Videos", href: "/videos" },
    { name: "Tour", href: "/tour" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <MusicProvider>
      <div className="relative w-full h-screen flex flex-col overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Desktop Navbar */}
          {!hideSidebars && (
            <div className="sticky top-0 z-50 flex justify-center bg-gradient-to-r from-black via-[#0a0a0a] to-black shadow-lg border-b border-gray-800">
              <div className="flex-1 max-w-[calc(100%-500px)] px-4 py-3 flex items-center justify-between">
                {/* Brand */}
                <div className="text-2xl font-extrabold uppercase tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] via-white to-[#00ffff] drop-shadow-[0_0_6px_rgba(0,255,255,0.6)]">
                  State of the Art
                </div>

                {/* Nav Links */}
                <nav className="hidden md:flex gap-8 text-sm md:text-base font-medium uppercase tracking-wide">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="relative text-gray-300 hover:text-[#00ffff] transition-colors duration-200 group"
                    >
                      {item.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00ffff] transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Main Layout */}
          <div className="flex flex-1 flex-row overflow-hidden">
            {!hideSidebars && <LeftSidebar />}
            <main ref={scrollContainerRef} className="flex-1 overflow-y-auto pt-[70px] md:pt-[0px]">
              {children}
            </main>
            {!hideSidebars && <RightSidebar />}
          </div>
        </div>

        {/* Mobile Navbar */}
        {hideSidebars && (
          <div
            className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
              isScrollNav ? (showUI ? "translate-y-0" : "-translate-y-full") : ""
            }`}
          >
            <Navbar />
          </div>
        )}

        {/* Mobile Music Player */}
        {hideSidebars && (
          <div className="fixed bottom-0 left-0 right-0 z-50  ">
            <MusicPlayer />
          </div>
        )}
      </div>
    </MusicProvider>
  );
}
