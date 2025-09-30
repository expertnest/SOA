"use client"

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react"
import { songs } from "@/data/songs"

type MusicContextType = {
  isPlaying: boolean
  currentSongIndex: number
  setCurrentSongIndex: (i: number) => void
  togglePlay: () => void
  handleNext: () => void
  handlePrev: () => void
  volume: number
  setVolume: (v: number) => void
  progress: number
  seek: (percent: number) => void
  currentSong: typeof songs[number] | undefined
}

const MusicContext = createContext<MusicContextType | null>(null)

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentSong = songs[currentSongIndex]

  // set volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // play/pause
  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, currentSong])

  // update progress
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }
    audio.addEventListener("timeupdate", updateProgress)
    return () => audio.removeEventListener("timeupdate", updateProgress)
  }, [currentSong])

  const togglePlay = () => setIsPlaying((p) => !p)

  const handleNext = () => {
    setCurrentSongIndex((i) => (i + 1) % songs.length)
    setIsPlaying(true)
  }

  const handlePrev = () => {
    setCurrentSongIndex((i) => (i - 1 + songs.length) % songs.length)
    setIsPlaying(true)
  }

  const seek = (percent: number) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (percent / 100) * audioRef.current.duration
    }
  }

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentSongIndex,
        setCurrentSongIndex,
        togglePlay,
        handleNext,
        handlePrev,
        volume,
        setVolume,
        progress,
        seek,
        currentSong,
      }}
    >
      {children}
      <audio ref={audioRef} src={currentSong?.src} onEnded={handleNext} />
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error("useMusic must be used inside MusicProvider")
  return ctx
}
