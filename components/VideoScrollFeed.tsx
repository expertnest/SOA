"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { videoScrollData } from "@/data/videoScrollData";
import { FaChevronUp, FaChevronDown, FaTimes } from "react-icons/fa";

export default function VideoScrollFeed() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Start from selected index (?start=2)
  const startIndexParam = searchParams.get("start");
  const startIndex = startIndexParam ? parseInt(startIndexParam, 10) : 0;

  const [activeIndex, setActiveIndex] = useState(startIndex);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);

  const NAVBAR_HEIGHT = 64; // adjust if your navbar is taller (px)
  const FOOTER_HEIGHT = 80; // adjust for music player/footer height (px)

  // Scroll up
  const handleUpArrow = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      setActiveIndex(newIndex);
      videoRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll down
  const handleDownArrow = () => {
    if (activeIndex < videoScrollData.length - 1) {
      const newIndex = activeIndex + 1;
      setActiveIndex(newIndex);
      videoRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Smooth snap after user scrolls manually
  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return;

    let timeout: NodeJS.Timeout;
    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const scrollY = container.scrollTop;
        const height = window.innerHeight - NAVBAR_HEIGHT - FOOTER_HEIGHT;
        const closestIndex = Math.round(scrollY / height);
        setActiveIndex(closestIndex);
        videoRefs.current[closestIndex]?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll immediately to starting video
  useEffect(() => {
    videoRefs.current[startIndex]?.scrollIntoView({ behavior: "instant" });
  }, [startIndex]);

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Scrollable video feed */}
      <div
        ref={videoContainerRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{
          paddingTop: `${NAVBAR_HEIGHT}px`,
          paddingBottom: `${FOOTER_HEIGHT}px`,
        }}
      >
        {videoScrollData.map((video, idx) => (
          <div
            key={video.id}
            ref={(el) => {
              videoRefs.current[idx] = el;
            }}
            className="w-full h-[calc(100vh-144px)] flex items-center justify-center snap-start snap-always relative"
          >
            <div
              className={`relative w-[90%] md:w-3/4 h-[80%] rounded-2xl overflow-hidden border-2 border-transparent bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 p-[2px] shadow-[0_0_25px_rgba(139,92,246,0.3)]`}
            >
              <div className="rounded-2xl w-full h-full bg-black relative flex flex-col items-center justify-center">
                <video
                  src={video.src}
                  controls
                  className="w-full h-full object-cover rounded-2xl"
                />
                {/* Title text above footer */}
                <div className="absolute bottom-24 left-6 right-6 md:bottom-20">
                  <p className="text-xl md:text-2xl font-semibold drop-shadow-lg text-white/90">
                    {video.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Controls */}
      <div className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-30">
        {/* Close */}
        <button
          onClick={() => router.push("/")}
          className="group bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 hover:from-pink-500/30 hover:to-blue-500/30 text-white p-3 rounded-full border border-white/30 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-110"
        >
          <FaTimes className="text-2xl group-hover:text-pink-300 transition" />
        </button>

        {/* Up */}
        {activeIndex > 0 && (
          <button
            onClick={handleUpArrow}
            className="group bg-gradient-to-br from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white p-3 rounded-full border border-white/30 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-110"
          >
            <FaChevronUp className="text-xl group-hover:text-blue-300 transition" />
          </button>
        )}

        {/* Down */}
        {activeIndex < videoScrollData.length - 1 && (
          <button
            onClick={handleDownArrow}
            className="group bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white p-3 rounded-full border border-white/30 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-110"
          >
            <FaChevronDown className="text-xl group-hover:text-pink-300 transition" />
          </button>
        )}
      </div>
    </div>
  );
}
