"use client";

import {
  ChevronLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Star,
  Flame ,
  Music,
  Rocket,
  Moon,
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
      className={`bg-black/60 backdrop-blur-lg text-white border-r border-gray-800 p-3 md:p-4 flex flex-col transition-all duration-300 ${
        leftCollapsed ? "w-12 md:w-12" : "w-64 md:w-72"
      } flex-shrink-0 shadow-lg`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setLeftCollapsed(!leftCollapsed)}
        className="mb-2 md:mb-4 hover:text-white/70 self-end transition-colors duration-200"
      >
        <ChevronLeft
          size={20}
          className={`${leftCollapsed ? "rotate-180" : ""}`}
        />
      </button>

      {!leftCollapsed && (
        <>
          {/* Playlist Header */}
          <h2 className="text-md font-semibold mb-3 tracking-wide text-white/70">
            Playlist
          </h2>

          {/* Playlist Categories */}
          <ul className="flex md:flex-col space-x-3 md:space-x-0 md:space-y-2 text-sm overflow-x-auto md:overflow-visible mb-5">
            {playlists.map((pl) => (
              <li
                key={pl}
                className={`cursor-pointer transition-colors duration-200 px-2 py-1 rounded ${
                  selectedCategory === pl ? "bg-white/10" : "hover:bg-white/5"
                }`}
                onClick={() => {
                  setSelectedCategory(pl);
                  setCurrentSongIndex(0);
                }}
              >
                <span
                  className={`flex items-center gap-1 ${
                    selectedCategory === pl
                      ? "font-semibold text-white"
                      : "text-white/70"
                  }`}
                >
                  {pl === "New Releases" && <Star size={14} />}
                  {pl === "ShottiGotSwag" && <Flame size={14} />}
                  {pl === "QMIlly" && <Music size={14} />}
                  {pl === "SOA" && <Rocket size={14} />}
                  {pl === "Beats" && <Moon size={14} />}
                  {pl}
                </span>
              </li>
            ))}
          </ul>

          {/* Current Song Image */}
          <div className="relative mb-5 rounded-xl overflow-hidden h-56 md:h-60 bg-black/40">
            {displaySong.image && (
              <Image
                src={displaySong.image}
                alt={displaySong.title || "Song"}
                fill
                className="object-cover opacity-90"
              />
            )}
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-md font-semibold truncate">
                {displaySong.title || "Select a song"}
              </p>
              <p className="text-xs text-white/70 truncate">
                {displaySong.artist || ""}
              </p>
            </div>
          </div>

          {/* Song List */}
          <div className="overflow-y-auto flex-1 pr-1 text-sm space-y-1 max-h-[calc(100vh-420px)] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {filteredSongs.map((song) => {
              const isCurrent = currentSong?.id === song.id;
              return (
                <div
                  key={song.id}
                  className={`p-2 rounded cursor-pointer flex justify-between items-center transition-colors duration-150 ${
                    isCurrent ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                  onClick={() => playSong(song)}
                >
                  <div className="flex flex-col min-w-0">
                    <p
                      className={`truncate ${
                        isCurrent ? "font-semibold text-white" : "text-white/70"
                      }`}
                    >
                      {song.title}
                    </p>
                    <p className="text-xs text-white/50 truncate">
                      {song.artist}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCurrent) togglePlay();
                      else playSong(song);
                    }}
                    className="ml-2 p-1 rounded-full hover:bg-white/10 transition"
                  >
                    {isCurrent && isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Now Playing & Controls */}
          {currentSong && (
            <div className="mt-auto pt-3 border-t border-white/20">
              <p className="text-xs text-white/50 uppercase mb-2 tracking-wide">
                Now Playing
              </p>
              <div className="bg-black/40 rounded-lg p-3 flex items-center gap-3 backdrop-blur-sm">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-white">
                    {currentSong.title}
                  </p>
                  <p className="text-xs text-white/50 truncate">
                    {currentSong.artist}
                  </p>
                </div>
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-full hover:bg-white/10 transition"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center justify-between mt-2 text-white/50">
                <button onClick={handlePrev}>
                  <SkipBack size={18} />
                </button>
                <div
                  className="flex-1 h-1 mx-2 bg-white/20 rounded cursor-pointer relative"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percent = (clickX / rect.width) * 100;
                    seek(percent);
                  }}
                >
                  <div
                    className="h-1 bg-white rounded absolute left-0 top-0"
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
                  className="w-full accent-white/70 cursor-pointer"
                />
              </div>
            </div>
          )}
        </>
      )}
    </aside>
  );
}
