'use client'

import { useState, useRef, useEffect } from "react"
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
    const container = videoContainerRef.current
    const scrollTop = container.scrollTop
    const sectionHeight = window.innerHeight

    let closestIndex = 0
    let smallestDiff = Infinity

    videoRefs.current.forEach((ref, i) => {
      if (!ref) return
      const offset = i * sectionHeight
      const diff = Math.abs(scrollTop - offset)
      if (diff < smallestDiff) {
        smallestDiff = diff
        closestIndex = i
      }
    })

    setActiveIndex(closestIndex)
  }

  useEffect(() => {
    if (activeIndex !== null) {
      videoRefs.current[activeIndex]?.scrollIntoView({ behavior: "instant" })
    }
  }, [activeIndex])

  return (
    <div className="mt-4 md:mt-6">
      {/* ===== Mobile-only "State of the Art" Heading ===== */}
      <div className="text-center mb-4 md:hidden">
        <h1 className="text-4xl font-extrabold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 drop-shadow-lg select-none">
          State of the Art
        </h1>
      </div>

      {/* ===== Music Videos Tabs ===== */}
      <div className="text-center">
        <h2 className="text-lg md:text-xl font-bold uppercase mb-2 flex justify-center gap-4">
          <span className="text-white">Music Videos</span>
          <span className="text-white/50 hover:text-white cursor-pointer">Shorts</span>
          <span className="text-white/50 hover:text-white cursor-pointer">Podcasts</span>
        </h2>
      </div>

      {/* ===== Horizontal thumbnails ===== */}
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

      {/* ===== Fullscreen overlay ===== */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            key={activeIndex}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* ===== Top Heading "State of the Art" overlay ===== */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
              <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 drop-shadow-lg select-none">
                State of the Art
              </h1>
            </div>

            {/* ===== Scrollable video container ===== */}
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

            {/* ===== Controls (Close + Arrows) ===== */}
            <div
              className="
                absolute right-0 top-1/2 -translate-y-1/2 
                flex flex-col items-center space-y-3
                md:right-24 md:top-1/2 md:-translate-y-1/2
              "
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveIndex(null)}
                className="bg-black/50 hover:bg-black/70 text-white text-3xl rounded-full w-12 h-12 flex items-center justify-center transition"
              >
                <FaTimes />
              </button>

              {/* Up Arrow */}
              {activeIndex > 0 && (
                <button
                  onClick={handleUpArrow}
                  className="bg-white/10 hover:bg-white/20 text-white text-xl p-2 rounded transition"
                >
                  <FaChevronUp />
                </button>
              )}

              {/* Down Arrow */}
              {activeIndex < musicVideos.length - 1 && (
                <button
                  onClick={handleDownArrow}
                  className="bg-white/10 hover:bg-white/20 text-white text-xl p-2 rounded transition"
                >
                  <FaChevronDown />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
