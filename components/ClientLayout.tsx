'use client';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showUI, setShowUI] = useState(true);
  const [showHeader, setShowHeader] = useState(true); // For top-only header
  const lastScrollRef = useRef(0);

  const isScrollNav = pathname === "/" || pathname === "/news";

  useEffect(() => {
    if (!hideSidebars || !isScrollNav) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScroll = container.scrollTop;

      // Show header only at very top
      setShowHeader(currentScroll === 0);

      // Show/hide navbar on scroll down/up
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
                <div className="text-2xl font-extrabold uppercase tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-white drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]">
                  State of the Art
                </div>
                <nav className="hidden md:flex gap-8 text-sm md:text-base font-medium uppercase tracking-wide">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="relative group cursor-pointer"
                    >
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-blue-300 to-white transition-all duration-300 group-hover:from-white group-hover:via-purple-400 group-hover:to-white">
                        {item.name}
                      </span>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-white transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Main Layout */}
          <div className="flex flex-1 flex-row overflow-hidden">
            {!hideSidebars && <LeftSidebar />}
            <main
              ref={scrollContainerRef}
              className={`flex-1 overflow-y-auto overscroll-contain touch-pan-y pt-[70px] md:pt-[0px]`}
            >
              <div className="min-h-full pb-[100px]">{children}</div>
            </main>
            {!hideSidebars && <RightSidebar />}
          </div>
        </div>

        {/* Mobile Header "State of the Art" above Navbar */}
        {hideSidebars && showHeader && (
          <div className="fixed top-0 left-0 right-0 z-50 text-center py-1 bg-transparent">
            <h1 className="text-lg sm:text-xl font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 drop-shadow-sm">
              State of the Art
            </h1>
          </div>
        )}

        {/* Mobile Navbar */}
        {hideSidebars && (
          <div
            className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${
              isScrollNav ? (showUI ? "translate-y-0" : "-translate-y-full") : ""
            }`}
            style={{ marginTop: showHeader ? '2.25rem' : '0' }} // Push navbar down when header is visible
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
      </div>
    </MusicProvider>
  );
}
