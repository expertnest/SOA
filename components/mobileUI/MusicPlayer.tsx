"use client";

import { Play, Pause, SkipBack, SkipForward, MoreHorizontal, Library, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useMusic } from "@/hooks/MusicContext";
import { songs } from "@/data/songs";
import Link from "next/link";

const MusicPlayer = () => {
  const { isPlaying, togglePlay, handleNext, handlePrev, currentSong, setCurrentSongIndex } = useMusic();
  const [showQueue, setShowQueue] = useState(false);
  const [isIPad, setIsIPad] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  // Detect iPad for icon sizing
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const iPad = /ipad/i.test(ua);
    const modernIPad = ua.includes("macintosh") && "ontouchend" in document;
    setIsIPad(iPad || modernIPad);
  }, []);

  // Add bottom padding to body to avoid content being hidden
  useEffect(() => {
    const updatePadding = () => {
      const playerHeight = playerRef.current?.offsetHeight ?? 0;
      document.body.style.paddingBottom = `${playerHeight}px`;
    };

    updatePadding();
    window.addEventListener("resize", updatePadding);
    return () => window.removeEventListener("resize", updatePadding);
  }, [showQueue]);

  return (
    <div
      ref={playerRef}
      className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-purple-950 via-black to-indigo-950 text-white shadow-lg z-50"
    >
      <div className="flex flex-col gap-2 px-3 py-2 sm:px-4 sm:py-3 relative">
        {/* Song Info and Controls */}
        <div className="flex items-center justify-between">
          {/* Song Info */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-700 to-indigo-800 rounded-md"></div>
            <div className="leading-tight">
              <h2 className="text-sm sm:text-lg font-semibold truncate max-w-[120px] sm:max-w-[200px]">
                {currentSong?.title ?? "No Song"}
              </h2>
              <p className="hidden sm:block text-xs sm:text-sm text-gray-400">{currentSong?.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            <SkipBack size={20} className="cursor-pointer" onClick={handlePrev} />
            {isPlaying ? (
              <Pause size={isIPad ? 28 : 32} className="cursor-pointer" onClick={togglePlay} />
            ) : (
              <Play size={isIPad ? 28 : 32} className="cursor-pointer" onClick={togglePlay} />
            )}
            <SkipForward size={20} className="cursor-pointer" onClick={handleNext} />

            {/* Queue Toggle */}
            <MoreHorizontal size={22} className="cursor-pointer" onClick={() => setShowQueue(!showQueue)} />

            <Link href="/library">
              <Library size={22} className="cursor-pointer hover:text-purple-400 transition" />
            </Link>
          </div>
        </div>

        {/* Queue */}
        <AnimatePresence>
          {showQueue && (
            <motion.div
              initial={{ opacity: 0, y: 20, scaleY: 0 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: 20, scaleY: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full bg-gradient-to-b from-neutral-900 to-black rounded-t-2xl p-4 shadow-xl origin-bottom"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold">Up Next</h3>
                <ChevronDown
                  size={isIPad ? 20 : 28}
                  className="cursor-pointer hover:text-gray-300"
                  onClick={() => setShowQueue(false)}
                />
              </div>
              <ul className="space-y-2">
                {songs.map((song, idx) => (
                  <li
                    key={song.id}
                    className="p-3 bg-neutral-800 rounded-lg flex justify-between items-center hover:bg-neutral-700 transition"
                    onClick={() => {
                      setCurrentSongIndex(idx);
                      setShowQueue(false);
                    }}
                  >
                    <div>
                      <p className="font-semibold">{song.title}</p>
                      <p className="text-sm text-gray-400">{song.artist}</p>
                    </div>
                    <Play size={20} className="text-gray-400 cursor-pointer" />
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MusicPlayer;
