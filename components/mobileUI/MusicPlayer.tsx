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
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-purple-950 via-black to-indigo-950 text-white shadow-lg z-20">
        <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 relative">
          {/* Song Info (FULL CLICKABLE AREA) */}
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-950 via-black to-indigo-950 rounded-md"></div>
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
              <Pause
                size={isIPad ? 28 : 32}
                className="cursor-pointer"
                onClick={togglePlay}
              />
            ) : (
              <Play
                size={isIPad ? 28 : 32}
                className="cursor-pointer"
                onClick={togglePlay}
              />
            )}
            <SkipForward size={20} className="cursor-pointer" onClick={handleNext} />
            <Library
              size={22}
              className="cursor-pointer hover:text-purple-400 transition"
              onClick={() => setShowQueue(true)}
            />
          </div>
        </div>
      </div>

      {/* FULLSCREEN QUEUE */}
      <AnimatePresence>
        {showQueue && (
          <motion.div
            key="queue"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-black text-white z-30 flex flex-col"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
          >
            {/* Drag handle */}
            <div className="w-12 h-1 bg-gray-500/50 rounded-full mx-auto my-3 cursor-grab"></div>

            {/* Top Image Section with Purple Gradient Header */}
            <div className="flex justify-center items-center p-6 bg-gradient-to-r from-purple-950 via-black to-indigo-950 rounded-b-3xl">
              {currentSong?.image ? (
                <img
                  src={currentSong.image}
                  alt={currentSong.title}
                  className="w-40 h-40 rounded-lg shadow-lg object-cover"
                />
              ) : (
                <div className="w-40 h-40 bg-gray-800 rounded-lg shadow-lg"></div>
              )}
            </div>

            {/* Category Picker */}
            <div className="px-4 mb-3">
              <h3 className="text-xl font-bold text-white mb-2">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm border ${
                    selectedCategory === null
                      ? "bg-teal-400 border-teal-400 text-black"
                      : "border-gray-600 text-white"
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
                        : "border-gray-600 text-white"
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Song List */}
            <div
              className={`flex-1 overflow-y-auto px-4 pb-4 ${
                isDragging ? "pointer-events-none" : ""
              }`}
            >
              <h3 className="text-lg font-semibold text-white mb-3">Up Next</h3>
              <ul className="space-y-2">
                {filteredSongs.map((song) => {
                  const isCurrent = currentSong?.id === song.id;
                  return (
                    <li
                      key={song.id}
                      className="p-3 bg-neutral-800 rounded-lg flex justify-between items-center hover:bg-neutral-700 transition cursor-pointer"
                      onClick={() => playSong(song)}
                    >
                      <div className="flex items-center gap-3">
                        {song.image ? (
                          <img
                            src={song.image}
                            alt={song.title}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-700 rounded-md"></div>
                        )}
                        <div>
                          <p className="font-semibold text-white">{song.title}</p>
                          <p className="text-sm text-white">{song.artist}</p>
                        </div>
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
                          <Play size={20} className="text-white cursor-pointer" />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL SCREEN PLAYER */}
      <AnimatePresence>
        {showFullScreen && (
          <motion.div
            key="fullScreenPlayer"
            className="fixed inset-0 bg-gradient-to-r from-purple-950 via-black to-indigo-950 text-white z-40 flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
          >
            {/* Drag handle */}
            <div className="w-12 h-1 bg-gray-500/40 rounded-full mx-auto my-3 cursor-grab"></div>

            <div className="flex-1 flex flex-col items-center justify-center px-6">
              {/* Album Art */}
              {currentSong?.image ? (
                <img
                  src={currentSong.image}
                  alt={currentSong.title}
                  className="w-72 h-72 sm:w-80 sm:h-80 rounded-xl shadow-lg object-cover"
                />
              ) : (
                <div className="w-72 h-72 sm:w-80 sm:h-80 bg-gradient-to-r from-purple-950 via-black to-indigo-950 rounded-xl shadow-lg"></div>
              )}

              <h3 className="text-2xl font-bold mt-6 text-white">
                {currentSong?.title ?? "No Song"}
              </h3>
              <p className="text-white text-lg mt-1">{currentSong?.artist}</p>

              {/* Playback Controls */}
              <div className="flex items-center gap-6 mt-8">
                <SkipBack size={32} className="cursor-pointer" onClick={handlePrev} />
                {isPlaying ? (
                  <Pause size={48} className="cursor-pointer" onClick={togglePlay} />
                ) : (
                  <Play size={48} className="cursor-pointer" onClick={togglePlay} />
                )}
                <SkipForward size={32} className="cursor-pointer" onClick={handleNext} />
              </div>

              {/* Progress Bar */}
              <div className="w-full mt-8">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={handleSeek}
                  className="w-full h-1 appearance-none bg-zinc-700/50 accent-teal-400 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white mt-1">
                  <span>{formatTime(progress)}</span>
                  <span>{duration ? formatTime(100) : "0:00"}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer;
