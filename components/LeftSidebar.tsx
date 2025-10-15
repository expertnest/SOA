"use client"; // MUST be at the top

import {
  ChevronLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useMusic } from "@/hooks/MusicContext";
import { songs } from "@/data/songs";

export default function LeftSidebar() {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("New Releases");
  const [mounted, setMounted] = useState(false);

  const {
    isPlaying,
    togglePlay,
    handleNext,
    handlePrev,
    progress,
    seek,
    volume,
    setVolume,
    playSong,
    currentSong,
    setCurrentSongIndex,
  } = useMusic();

  useEffect(() => {
    setMounted(true);
  }, []);

  const playlists = ["New Releases", "ShottiGotSwag", "QMIlly", "SOA", "Beats"];
  const filteredSongs = songs.filter(
    (song) => song.category === selectedCategory
  );

  const displaySong = currentSong || filteredSongs[0];

  if (!mounted) return null;

  return (
    <aside
      className={`bg-gradient-to-b from-[#120a23] via-[#000000] to-[#1a0f2b] text-white border-t md:border-t-0 md:border-r border-gray-800 p-3 md:p-4 flex flex-col transition-all duration-300 ${
        leftCollapsed ? "w-12 md:w-12" : "w-64 md:w-72"
      } flex-shrink-0 shadow-lg`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setLeftCollapsed(!leftCollapsed)}
        className="mb-2 md:mb-4 hover:text-purple-400 self-end transition-colors duration-200"
      >
        <ChevronLeft
          size={20}
          className={`${leftCollapsed ? "rotate-180" : ""}`}
        />
      </button>

      {!leftCollapsed && (
        <>
          {/* Playlist Header */}
          <h2 className="text-lg font-semibold uppercase mb-3 tracking-wide text-gray-300">
            Playlist
          </h2>

          {/* Playlist Categories */}
          <ul className="flex md:flex-col space-x-3 md:space-x-0 md:space-y-3 text-sm overflow-x-auto md:overflow-visible mb-5">
            {playlists.map((pl) => (
              <li
                key={pl}
                className={`cursor-pointer hover:text-white transition-colors duration-200 rounded-lg px-3 py-2 transform hover:scale-105 hover:bg-gray-800 ${
                  selectedCategory === pl ? "bg-gray-800" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(pl);
                  setCurrentSongIndex(0);
                }}
              >
                <span
                  className={`${
                    selectedCategory === pl
                      ? "bg-gradient-to-r from-white/90 via-purple-500 to-white/80 bg-clip-text text-transparent font-semibold"
                      : "text-white"
                  }`}
                >
                  {pl === "New Releases"
                    ? "💥 New Releases"
                    : pl === "ShottiGotSwag"
                    ? "🔥 ShottiGotSwag"
                    : pl === "QMIlly"
                    ? "🎶 QMIlly"
                    : pl === "SOA"
                    ? "🚀 SOA"
                    : "🌙 Beats"}
                </span>
              </li>
            ))}
          </ul>

          {/* Current Song Image / Placeholder with Dark Purple Gradient */}
          <div className="relative mb-5">
            {displaySong.image ? (
              <Image
                src={displaySong.image}
                alt={displaySong.title || "Song"}
                width={600}
                height={400}
                className="object-cover w-full h-56 md:h-60 rounded-xl opacity-90"
              />
            ) : (
              <div className="w-full h-56 md:h-60 rounded-xl bg-gradient-to-br from-purple-900 via-black to-indigo-900 opacity-80"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent rounded-xl"></div>
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-lg font-semibold truncate">
                {displaySong.title || "Select a song to play"}
              </p>
              <p className="text-xs text-white/70 truncate">
                {displaySong.artist || ""}
              </p>
            </div>
          </div>

          {/* Scrollable Song List */}
          <div className="overflow-y-auto flex-1 pr-1 text-sm space-y-2 max-h-[calc(100vh-420px)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {filteredSongs.map((song) => {
              const isCurrent = currentSong?.id === song.id;
              return (
                <div
                  key={song.id}
                  className={`p-2 rounded-lg cursor-pointer flex justify-between items-center transition-colors duration-200 ${
                    isCurrent ? "bg-gray-800" : "hover:bg-gray-800"
                  }`}
                  onClick={() => playSong(song)}
                >
                  <div className="flex flex-col min-w-0">
                    <p
                      className={`font-semibold truncate ${
                        isCurrent
                          ? "bg-gradient-to-r from-white/90 via-purple-500 to-white/80 bg-clip-text text-transparent"
                          : "text-white"
                      }`}
                    >
                      {song.title}
                    </p>
                    <p className="text-xs text-white/60 truncate">
                      {song.artist}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCurrent) togglePlay();
                      else playSong(song);
                    }}
                    className="ml-2 p-1 rounded-full hover:bg-gray-700"
                  >
                    {isCurrent && isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Now Playing & Controls */}
          {currentSong && (
            <div className="mt-auto pt-3 border-t border-gray-700">
              <p className="text-xs text-white/70 uppercase mb-2 tracking-wide">
                Now Playing
              </p>
              <div className="bg-gray-800/80 rounded-lg p-3 flex items-center gap-3 backdrop-blur-sm">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-transparent bg-clip-text bg-gradient-to-r from-white/90 via-purple-500 to-white/80">
                    {currentSong.title}
                  </p>
                  <p className="text-xs text-white/60 truncate">{currentSong.artist}</p>
                </div>
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-full hover:bg-gray-700 transition"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center justify-between mt-2 text-white/70">
                <button onClick={handlePrev}>
                  <SkipBack size={18} />
                </button>
                <div
                  className="flex-1 h-1 mx-2 bg-gray-600 rounded cursor-pointer relative"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percent = (clickX / rect.width) * 100;
                    seek(percent);
                  }}
                >
                  <div
                    className="h-1 bg-purple-700 rounded absolute left-0 top-0"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <button onClick={handleNext}>
                  <SkipForward size={18} />
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2 mt-3">
                <Volume2 size={16} />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-purple-700 cursor-pointer"
                />
              </div>
            </div>
          )}
        </>
      )}
    </aside>
  );
}
