"use client";

import { Play, Pause, SkipBack, SkipForward, Library } from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useState, useEffect } from "react";
import { useMusic } from "@/hooks/MusicContext";
import { songs } from "@/data/songs";

const MusicPlayer = () => {
  const {
    isPlaying,
    togglePlay,
    handleNext,
    handlePrev,
    currentSong,
    playSong,
    progress,
    seek,
    duration,
  } = useMusic();

  const [showQueue, setShowQueue] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [isIPad, setIsIPad] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const iPad = /ipad/i.test(ua);
    const modernIPad = ua.includes("macintosh") && "ontouchend" in document;
    setIsIPad(iPad || modernIPad);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showQueue || showFullScreen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showQueue, showFullScreen]);

  const categories = Array.from(new Set(songs.map((s) => s.category)));
  const filteredSongs = selectedCategory
    ? songs.filter((s) => s.category === selectedCategory)
    : songs;

  const formatTime = (percent: number) => {
    const current = Math.floor((percent / 100) * duration);
    const mins = Math.floor(current / 60);
    const secs = current % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    if (info.offset.y > 150) {
      if (showQueue) setShowQueue(false);
      if (showFullScreen) setShowFullScreen(false);
    }
  };

  return (
    <>
      {/* MAIN PLAYER BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-black text-white shadow-lg z-20 relative overflow-hidden border-t border-gray-800">

        {/* ✨ animated glow line */}
        <div className="absolute top-0 left-0 w-full h-[2px]">
          <div className="glow-line" />
        </div>

        <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 relative">
          
          {/* Song Info */}
          <div
            className="flex items-center gap-2 sm:gap-3 flex-1 cursor-pointer"
            onClick={() => setShowFullScreen(true)}
          >
            {currentSong?.image ? (
              <img
                src={currentSong.image}
                alt={currentSong.title}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-md"></div>
            )}
            <div className="leading-tight">
              <h2 className="text-sm sm:text-lg font-semibold truncate max-w-[120px] sm:max-w-[200px]">
                {currentSong?.title ?? "No Song"}
              </h2>
              <p className="hidden sm:block text-xs sm:text-sm text-white">
                {currentSong?.artist}
              </p>
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
            <Library
              size={22}
              className="cursor-pointer hover:text-teal-400 transition"
              onClick={() => setShowQueue(true)}
            />
          </div>
        </div>
      </div>

      {/* PLAYLIST POPUP (UNCHANGED) */}
      <AnimatePresence>
        {showQueue && (
          <motion.div
            key="queue"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 text-white z-30 flex flex-col"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.4}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-2xl" />
            <div className="relative z-10 w-16 h-2 rounded-full mx-auto my-3 cursor-grab bg-gradient-to-r from-teal-400 via-green-400 to-teal-400" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN PLAYER (UNCHANGED) */}
      <AnimatePresence>
        {showFullScreen && (
          <motion.div
            key="fullScreenPlayer"
            className="fixed inset-0 text-white z-40 flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✨ GLOW ANIMATION STYLE */}
      <style jsx>{`
        .glow-line {
          width: 40%;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            #22d3ee,
            #a855f7,
            transparent
          );
          filter: blur(1px);
          animation: moveGlow 2.5s linear infinite;
        }

        @keyframes moveGlow {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </>
  );
};

export default MusicPlayer;