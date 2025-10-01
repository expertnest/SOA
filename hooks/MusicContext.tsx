"use client"

import { createContext, useContext, useState, useRef, useEffect } from "react"
import { songs } from "@/data/songs"

type MusicContextType = {
  isPlaying: boolean
  togglePlay: () => void
  handleNext: () => void
  handlePrev: () => void
  currentSong: typeof songs[0] | null
  progress: number
  seek: (value: number) => void
  volume: number
  setVolume: (v: number) => void
  playSong: (song: typeof songs[0]) => void
  setCurrentSongIndex: React.Dispatch<React.SetStateAction<number>>
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(songs[currentSongIndex].src)
      audioRef.current.volume = volume
    }

    const audio = audioRef.current

    const updateProgress = () => {
      if (audio) {
        setProgress((audio.currentTime / audio.duration) * 100 || 0)
      }
    }

    audio.addEventListener("timeupdate", updateProgress)

    return () => {
      audio.removeEventListener("timeupdate", updateProgress)
    }
  }, [currentSongIndex])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length
    setCurrentSongIndex(nextIndex)
    if (audioRef.current) {
      audioRef.current.src = songs[nextIndex].src
      if (isPlaying) audioRef.current.play()
    }
  }

  const handlePrev = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length
    setCurrentSongIndex(prevIndex)
    if (audioRef.current) {
      audioRef.current.src = songs[prevIndex].src
      if (isPlaying) audioRef.current.play()
    }
  }

  const seek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration
    }
  }

  const playSong = (song: typeof songs[0]) => {
    const index = songs.findIndex((s) => s.id === song.id)
    if (index !== -1) {
      setCurrentSongIndex(index)
      if (audioRef.current) {
        audioRef.current.src = song.src
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        togglePlay,
        handleNext,
        handlePrev,
        currentSong: songs[currentSongIndex],
        progress,
        seek,
        volume,
        setVolume,
        playSong,
        setCurrentSongIndex,
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error("useMusic must be used within a MusicProvider")
  return ctx
}
