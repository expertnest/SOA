"use client";

import { createContext, useContext, useState, useRef, useEffect } from "react";
import { songs } from "@/data/songs";

type MusicContextType = {
  isPlaying: boolean;
  togglePlay: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  currentSong: typeof songs[0] | null;
  progress: number;
  seek: (value: number) => void;
  volume: number;
  setVolume: (v: number) => void;
  playSong: (song: typeof songs[0]) => void;
  setCurrentSongIndex: React.Dispatch<React.SetStateAction<number>>;
  duration: number;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentSong.src);
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio && audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (currentSongIndex < songs.length - 1) handleNext();
      else setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSongIndex, isPlaying, currentSong.src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentSongIndex >= songs.length - 1) return;
    const nextIndex = currentSongIndex + 1;
    setCurrentSongIndex(nextIndex);
    if (audioRef.current) {
      audioRef.current.src = songs[nextIndex].src;
      if (isPlaying) audioRef.current.play();
    }
  };

  const handlePrev = () => {
    if (currentSongIndex <= 0) return;
    const prevIndex = currentSongIndex - 1;
    setCurrentSongIndex(prevIndex);
    if (audioRef.current) {
      audioRef.current.src = songs[prevIndex].src;
      if (isPlaying) audioRef.current.play();
    }
  };

  const seek = (value: number) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
      setProgress(value);
    }
  };

  const playSong = (song: typeof songs[0]) => {
    const index = songs.findIndex((s) => s.id === song.id);
    if (index !== -1) {
      setCurrentSongIndex(index);
      if (audioRef.current) {
        audioRef.current.src = song.src;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        togglePlay,
        handleNext,
        handlePrev,
        currentSong,
        progress,
        seek,
        volume,
        setVolume,
        playSong,
        setCurrentSongIndex,
        duration,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within a MusicProvider");
  return ctx;
}
