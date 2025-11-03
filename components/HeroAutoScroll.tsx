"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function HeroAutoScroll() {
  const heroRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Smooth scroll to targetY over duration (ms)
  const smoothScrollTo = (targetY: number, duration = 1500) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime: number | null = null;

    const step = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Ease in-out cubic
      const ease =
        progress < 0.5
          ? 4 * progress ** 3
          : 1 - (-2 * progress + 2) ** 3 / 2;

      window.scrollTo(0, startY + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(step);
      } else {
        setScrolled(true);
      }
    };

    requestAnimationFrame(step);
  };

  // Scroll to main content and lock scrolling above it
  const scrollToClientLayout = () => {
    const main = document.getElementById("main");
    if (!main) return;
    smoothScrollTo(main.offsetTop, 1500); // slower scroll
  };

  // Prevent scrolling back above main
  const preventScrollUp = (e: Event) => {
    const main = document.getElementById("main");
    if (!main) return;

    if (window.scrollY < main.offsetTop) {
      window.scrollTo(0, main.offsetTop);
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || scrolled) return;

      const scrollY = window.scrollY;
      const heroHeight = heroRef.current.offsetHeight;

      if (scrollY >= heroHeight * 0.25) {
        scrollToClientLayout();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });

    // Lock scrolling up once scrolled
    if (scrolled) {
      window.addEventListener("scroll", preventScrollUp, { passive: false });
      window.addEventListener("wheel", preventScrollUp, { passive: false });
      window.addEventListener("touchmove", preventScrollUp, { passive: false });
      window.addEventListener("keydown", (e) => {
        // Block ArrowUp, PageUp, Home
        if (
          ["ArrowUp", "PageUp", "Home"].includes(e.key) &&
          window.scrollY < document.getElementById("main")!.offsetTop
        ) {
          e.preventDefault();
        }
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);

      window.removeEventListener("scroll", preventScrollUp);
      window.removeEventListener("wheel", preventScrollUp);
      window.removeEventListener("touchmove", preventScrollUp);
    };
  }, [scrolled]);

  return (
    <>
      {/* Fixed Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1920&q=80')",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex flex-col items-center justify-center text-center z-10 pointer-events-none select-none"
      >
        <div className="px-6">
          <h1 className="text-6xl font-bold mb-4 tracking-tight drop-shadow-lg">
            Scroll
          </h1>
          <p className="text-xl text-gray-200 mb-8 drop-shadow-md">
            Learn. Create. Play. — Your journey into sound starts here.
          </p>

          {/* Arrow in bottom-right */}
          <div className="absolute bottom-6 right-6 flex flex-col items-center animate-bounce opacity-80 pointer-events-auto select-none">
            <ChevronDown className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
        </div>
      </section>
    </>
  );
}
