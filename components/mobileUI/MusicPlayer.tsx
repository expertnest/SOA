"use client"

import { Play, Pause, SkipBack, SkipForward, MoreHorizontal, Library, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useMusic } from "@/hooks/MusicContext"
import { songs } from "@/data/songs"
import Link from "next/link"

const MusicPlayer = () => {
  const { isPlaying, togglePlay, handleNext, handlePrev, currentSong, setCurrentSongIndex } = useMusic()
  const [showQueue, setShowQueue] = useState(false)
  const [isIPad, setIsIPad] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    const iPad = /ipad/i.test(ua)
    const modernIPad = ua.includes("macintosh") && "ontouchend" in document
    setIsIPad(iPad || modernIPad)
  }, [])

  // Get unique categories
  const categories = Array.from(new Set(songs.map((s) => s.category)))

  // Filter songs by selected category
  const filteredSongs = selectedCategory ? songs.filter((s) => s.category === selectedCategory) : songs

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-purple-950 via-black to-indigo-950 text-white shadow-lg">
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 relative">
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

        {/* Queue */}
        <AnimatePresence>
  {showQueue && (
    <motion.div
      initial={{ opacity: 0, y: 20, scaleY: 0 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      exit={{ opacity: 0, y: 20, scaleY: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="absolute bottom-full left-0 w-full bg-gradient-to-b from-neutral-900 to-black rounded-t-2xl p-4 shadow-xl origin-bottom"
      style={{ minHeight: "450px" }} // 👈 fixed min-height
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
            selectedCategory === null ? "bg-teal-400 border-teal-400 text-black" : "border-gray-600 text-gray-300"
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-3 py-1 rounded-full text-sm border ${
              selectedCategory === cat ? "bg-purple-500 border-purple-500 text-black" : "border-gray-600 text-gray-300"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Song List */}
      <ul className="space-y-2 overflow-y-auto max-h-[350px]"> {/* 👈 scrollable if too many tracks */}
        {filteredSongs.map((song, idx) => (
          <li
            key={song.id}
            className="p-3 bg-neutral-800 rounded-lg flex justify-between items-center hover:bg-neutral-700 transition"
            onClick={() => {
              setCurrentSongIndex(idx)
              setShowQueue(false)
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
  )
}

export default MusicPlayer
