"use client"

import { ChevronLeft, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { useState } from "react"
import { useMusic } from "@/hooks/MusicContext"
import { songs } from "@/data/songs"

export default function LeftSidebar() {
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("New Releases")

  const {
    isPlaying,
    togglePlay,
    handleNext,
    handlePrev,
    progress,
    seek,
    volume,
    setVolume,
    setCurrentSongIndex,
    currentSong,
  } = useMusic()

  const playlists = ["New Releases", "ShottiGotSwag", "QMIlly", "SOA", "Beats"]
  const filteredSongs = songs.filter((song) => song.category === selectedCategory)

  return (
    <aside
      className={`bg-gradient-to-b from-[#0f0f0f] via-[#111827] to-[#1f1f1f] text-white border-t md:border-t-0 md:border-r border-gray-800 p-3 md:p-4 flex flex-col transition-all duration-300 ${
        leftCollapsed ? "w-12 md:w-12" : "w-64 md:w-64"
      } flex-shrink-0`}
    >
      <button
        onClick={() => setLeftCollapsed(!leftCollapsed)}
        className="mb-2 md:mb-4 hover:text-[#00ffff] self-end transition-colors duration-200"
      >
        <ChevronLeft size={20} className={`${leftCollapsed ? "rotate-180" : ""}`} />
      </button>

      {!leftCollapsed && (
        <>
          <h2 className="text-lg font-bold uppercase mb-2 md:mb-4 tracking-wide text-[#00ffff]">
            Playlist
          </h2>

          <ul className="flex md:flex-col space-x-3 md:space-x-0 md:space-y-3 text-sm overflow-x-auto md:overflow-visible mb-2 md:mb-6">
            {playlists.map((pl) => (
              <li
                key={pl}
                className={`cursor-pointer hover:text-[#00ffff] transition-colors duration-200 ${
                  selectedCategory === pl ? "text-[#00ffff] font-semibold" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(pl)
                  setCurrentSongIndex(0)
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

          <div className="overflow-y-auto flex-1 pr-1 space-y-2 text-sm">
            {filteredSongs.map((song, index) => (
              <li
                key={song.id}
                className={`p-2 rounded cursor-pointer hover:bg-gray-800 ${
                  currentSong?.id === song.id ? "bg-gray-800" : ""
                } transition-colors duration-200`}
                onClick={() => {
                  setCurrentSongIndex(index)
                }}
              >
                <p className="font-semibold">{song.title}</p>
                <p className="text-xs text-white/60">{song.artist}</p>
              </li>
            ))}
          </div>

          <div className="mt-auto pt-2 border-t border-gray-700">
            <p className="text-xs text-white/70 uppercase mb-2">Now Playing</p>
            <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500 rounded"></div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{currentSong?.title}</p>
                <p className="text-xs text-white/60">{currentSong?.artist}</p>
              </div>
              <button onClick={togglePlay}>
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
                  const rect = e.currentTarget.getBoundingClientRect()
                  const clickX = e.clientX - rect.left
                  const percent = (clickX / rect.width) * 100
                  seek(percent)
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
  )
}
