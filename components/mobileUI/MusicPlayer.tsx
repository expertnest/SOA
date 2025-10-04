"use client";

import { Play, Pause, SkipBack, SkipForward, MoreHorizontal, Library, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useMusic } from "@/hooks/MusicContext";
import { songs } from "@/data/songs";
import Link from "next/link";

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
  const [showArt, setShowArt] = useState(false);
  const [isIPad, setIsIPad] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const iPad = /ipad/i.test(ua);
    const modernIPad = ua.includes("macintosh") && "ontouchend" in document;
    setIsIPad(iPad || modernIPad);
  }, []);

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

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-purple-950 via-black to-indigo-950 text-white shadow-lg">
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 relative">
        {/* Song Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-700 to-indigo-800 rounded-md cursor-pointer"
            onClick={() => setShowArt(true)}
          ></div>
          <div className="leading-tight">
            <h2 className="text-sm sm:text-lg font-semibold truncate max-w-[120px] sm:max-w-[200px]">
              {currentSong?.title ?? "No Song"}
            </h2>
            <p className="hidden sm:block text-xs sm:text-sm text-gray-400">
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
          <MoreHorizontal
            size={22}
            className="cursor-pointer"
            onClick={() => setShowQueue(!showQueue)}
          />
          <Link href="/library">
            <Library size={22} className="cursor-pointer hover:text-purple-400 transition" />
          </Link>
        </div>

        {/* Expanded Album Art */}
        <AnimatePresence>
          {showArt && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
              className="absolute bottom-full left-0 w-full bg-black/95 backdrop-blur-lg rounded-t-2xl p-6 shadow-xl flex flex-col items-center justify-center"
              style={{ minHeight: "400px" }}
            >
              <X
                size={28}
                className="absolute top-4 right-4 text-white cursor-pointer hover:text-gray-400"
                onClick={() => setShowArt(false)}
              />
              <div className="relative">
                <div className="w-60 h-60 sm:w-72 sm:h-72 bg-gradient-to-br from-purple-700 to-indigo-800 rounded-xl shadow-lg"></div>
              </div>
              <h3 className="text-xl font-bold mt-4">{currentSong?.title ?? "No Song"}</h3>
              <p className="text-gray-400">{currentSong?.artist}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Queue */}
        <AnimatePresence>
          {showQueue && (
            <motion.div
              initial={{ opacity: 0, y: 20, scaleY: 0 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: 20, scaleY: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute bottom-full left-0 w-full bg-gradient-to-b from-neutral-900 to-black rounded-t-2xl p-4 shadow-xl origin-bottom"
              style={{ minHeight: "450px" }}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold">Up Next</h3>
                <ChevronDown
                  size={isIPad ? 20 : 28}
                  className="cursor-pointer hover:text-gray-300"
                  onClick={() => setShowQueue(false)}
                />
              </div>

              {/* Category Picker */}
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  className={`px-3 py-1 rounded-full text-sm border ${
                    selectedCategory === null
                      ? "bg-teal-400 border-teal-400 text-black"
                      : "border-gray-600 text-gray-300"
                  }`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`px-3 py-1 rounded-full text-sm border ${
                      selectedCategory === cat
                        ? "bg-purple-500 border-purple-500 text-black"
                        : "border-gray-600 text-gray-300"
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Song List */}
              <ul className="space-y-2 overflow-y-auto max-h-[350px]">
                {filteredSongs.map((song) => {
                  const isCurrent = currentSong?.id === song.id;
                  return (
                    <li
                      key={song.id}
                      className="p-3 bg-neutral-800 rounded-lg flex justify-between items-center hover:bg-neutral-700 transition cursor-pointer"
                      onClick={() => playSong(song)}
                    >
                      <div>
                        <p className="font-semibold">{song.title}</p>
                        <p className="text-sm text-gray-400">{song.artist}</p>
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isCurrent && isPlaying) togglePlay();
                          else playSong(song);
                        }}
                      >
                        {isCurrent && isPlaying ? (
                          <Pause size={20} className="text-teal-400 cursor-pointer" />
                        ) : (
                          <Play size={20} className="text-gray-400 cursor-pointer" />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar UNDER Player Controls */}
      <div className="w-full px-3 pb-2">
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 appearance-none bg-zinc-700/50 accent-teal-400 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(progress)}</span>
          <span>{duration ? formatTime(100) : "0:00"}</span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
