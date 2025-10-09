"use client"; // MUST be at the top

import { ChevronLeft, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
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

  // Prevent SSR hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const playlists = ["New Releases", "ShottiGotSwag", "QMIlly", "SOA", "Beats"];
  const filteredSongs = songs.filter((song) => song.category === selectedCategory);

  if (!mounted) return null; // render nothing on server

  return (
    <aside
      className={`bg-gradient-to-b from-[#0f0f0f] via-[#111827] to-[#1f1f1f] text-white border-t md:border-t-0 md:border-r border-gray-800 p-3 md:p-4 flex flex-col transition-all duration-300 ${
        leftCollapsed ? "w-12 md:w-12" : "w-64 md:w-64"
      } flex-shrink-0 shadow-lg`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setLeftCollapsed(!leftCollapsed)}
        className="mb-2 md:mb-4 hover:text-[#00ffff] self-end transition-colors duration-200"
      >
        <ChevronLeft size={20} className={`${leftCollapsed ? "rotate-180" : ""}`} />
      </button>

      {!leftCollapsed && (
        <>
          {/* Playlist Categories */}
          <h2 className="text-lg font-semibold uppercase mb-2 md:mb-4 tracking-wide text-[#00ffff]">
            Playlist
          </h2>
          <ul className="flex md:flex-col space-x-3 md:space-x-0 md:space-y-3 text-sm overflow-x-auto md:overflow-visible mb-2 md:mb-6">
            {playlists.map((pl) => (
              <li
                key={pl}
                className={`cursor-pointer hover:text-[#00ffff] transition-colors duration-200 rounded-lg px-3 py-2 transform hover:scale-105 hover:bg-gray-800 ${
                  selectedCategory === pl ? "bg-gray-800 text-[#00ffff] font-semibold" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(pl);
                  setCurrentSongIndex(0);
                }}
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
              </li>
            ))}
          </ul>

          {/* Song List */}
          <div className="overflow-y-auto flex-1 pr-1 space-y-2 text-sm max-h-[calc(100vh-300px)]">
            {filteredSongs.map((song, index) => {
              const isCurrent = currentSong?.id === song.id;
              return (
                <li
                  key={song.id}
                  className={`p-2 rounded-lg cursor-pointer flex justify-between items-center transition-colors duration-200 ${
                    isCurrent ? "bg-gray-800" : "hover:bg-gray-800"
                  }`}
                  onClick={() => playSong(song)}
                >
                  <div>
                    <p className="font-semibold">{song.title}</p>
                    <p className="text-xs text-white/60">{song.artist}</p>
                  </div>

                  {/* Play/Pause button for each track */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent triggering playSong again
                      if (isCurrent) togglePlay(); // toggle if it's the current song
                      else playSong(song); // play if it's a different song
                    }}
                    className="ml-2 p-1 rounded-full hover:bg-gray-700"
                  >
                    {isCurrent && isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                </li>
              );
            })}
          </div>

          {/* Now Playing & Controls */}
          <div className="mt-auto pt-2 border-t border-gray-700">
            <p className="text-xs text-white/70 uppercase mb-2">Now Playing</p>
            <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500 rounded"></div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{currentSong?.title || "Nothing"}</p>
                <p className="text-xs text-white/60">{currentSong?.artist || ""}</p>
              </div>
              <button onClick={togglePlay} className="p-2 rounded-full hover:bg-gray-700">
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
            </div>

            <div className="flex items-center justify-between mt-2 text-white/70">
              <button onClick={handlePrev}>
                <SkipBack size={18} />
              </button>
              <div
                className="flex-1 h-1 mx-2 bg-gray-600 rounded cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const percent = (clickX / rect.width) * 100;
                  seek(percent);
                }}
              >
                <div className="h-1 bg-cyan-500 rounded" style={{ width: `${progress}%` }}></div>
              </div>
              <button onClick={handleNext}>
                <SkipForward size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <Volume2 size={16} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
