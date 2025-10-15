'use client'

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { musicVideos } from "@/data/musicVideos"
import { FaChevronUp, FaChevronDown, FaTimes, FaPlay } from "react-icons/fa"

export default function MusicVideos() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleUpArrow = () => {
    if (activeIndex !== null && activeIndex > 0) {
      const newIndex = activeIndex - 1
      setActiveIndex(newIndex)
      videoRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleDownArrow = () => {
    if (activeIndex !== null && activeIndex < musicVideos.length - 1) {
      const newIndex = activeIndex + 1
      setActiveIndex(newIndex)
      videoRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleScroll = () => {
    if (!videoContainerRef.current) return
    const scrollTop = videoContainerRef.current.scrollTop
    const newIndex = Math.round(scrollTop / window.innerHeight)
    setActiveIndex(newIndex)
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg md:text-xl font-bold uppercase mb-2 flex space-x-4">
        <span className="text-white">Music Videos</span>
        <span className="text-white/50 hover:text-white cursor-pointer">Shorts</span>
        <span className="text-white/50 hover:text-white cursor-pointer">Podcasts</span>
      </h2>

      {/* Horizontal thumbnails */}
      <div className="flex space-x-3 overflow-x-auto pb-2 mt-6 scrollbar-hide snap-x snap-mandatory">
        {musicVideos.map((mv, idx) => (
          <div
            key={mv.id}
            onClick={() => setActiveIndex(idx)}
            className={`flex-shrink-0 w-36 h-52 md:w-48 md:h-64 rounded-lg shadow-lg bg-gradient-to-br ${mv.color} cursor-pointer relative transform transition-transform duration-300 hover:scale-105 flex items-end justify-center`}
          >
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 flex items-center justify-between rounded-b-lg">
              <span className="text-white font-medium text-sm truncate">{mv.title}</span>
              <FaPlay className="text-white text-base" />
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            key={activeIndex}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Scrollable video container */}
            <div
              ref={videoContainerRef}
              className="w-full h-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
              onScroll={handleScroll}
            >
              {musicVideos.map((mv, idx) => (
                <div
                  key={mv.id}
                  ref={(el) => { videoRefs.current[idx] = el }}
                  className="w-full h-screen flex items-center justify-center snap-start"
                >
                  <div
                    className={`w-3/4 h-3/4 rounded-lg shadow-lg bg-gradient-to-br ${mv.color} flex items-center justify-center`}
                  >
                    <p className="text-white text-3xl font-bold text-center">{mv.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Up/Down arrows */}
            <div className="absolute right-24 top-1/2 transform -translate-y-1/2 flex flex-col space-y-3 z-50">
              {activeIndex > 0 && (
                <button
                  onClick={handleUpArrow}
                  className="bg-white/10 hover:bg-white/20 text-white text-xl p-2 rounded transition"
                >
                  <FaChevronUp />
                </button>
              )}
              {activeIndex < musicVideos.length - 1 && (
                <button
                  onClick={handleDownArrow}
                  className="bg-white/10 hover:bg-white/20 text-white text-xl p-2 rounded transition"
                >
                  <FaChevronDown />
                </button>
              )}
            </div>

            {/* Close button fixed to right side */}
            <button
              onClick={() => setActiveIndex(null)}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white text-3xl z-50 bg-black/50 hover:bg-black/70 rounded-full w-12 h-12 flex items-center justify-center"
            >
              <FaTimes />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
