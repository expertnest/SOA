"use client";

import {
  ChevronLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Flame,
  Moon,
  Instagram,
  Twitter,
  Youtube,
  Shuffle,
  Repeat,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useMusic } from "@/hooks/MusicContext";
import { songs, defaultArt } from "@/data/songs";

export default function LeftSidebar() {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("MacPhantom");
  const [mounted, setMounted] = useState(false);

  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

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
  } = useMusic();

  useEffect(() => {
    setMounted(true);

    if (!currentSong) {
      const defaultSong = songs.find((s) => s.id === 12);
      if (defaultSong) playSong(defaultSong);
    }
  }, []);

  const playlists = ["MacPhantom", "Mac808"];

  const filteredSongs = songs.filter(
    (song) => song.category === selectedCategory
  );

  const displaySong =
    currentSong || { image: defaultArt, title: "", artist: "" };

  const duration = 180;
  const currentTime = Math.floor((progress / 100) * duration);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = String(t % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!mounted) return null;

  return (
    <aside
      className={`bg-black/60 backdrop-blur-lg text-white border-r border-gray-800 p-3 md:p-4 flex flex-col transition-all duration-300 ${
        leftCollapsed ? "w-12 md:w-12" : "w-64 md:w-[245px]"
      } flex-shrink-0 shadow-lg`}
    >
      {/* Collapse */}
      <button
        onClick={() => setLeftCollapsed(!leftCollapsed)}
        className="mb-1 self-end hover:text-white/70"
      >
        <ChevronLeft size={20} className={leftCollapsed ? "rotate-180" : ""} />
      </button>

      {!leftCollapsed && (
        <>
          {/* LOGO */}
          <div className="flex justify-center -mt-2 mb-2">
            <Image
              src="/assets/soalogo.png"
              alt="SOA Logo"
              width={180}
              height={180}
              className="object-contain"
              priority
            />
          </div>

          {/* divider */}
          <div className="w-full h-px bg-white/10 mb-4" />

          {/* NOW PLAYING IMAGE */}
          <div className="relative mb-4 rounded-xl overflow-hidden h-56">
            <Image
              src={displaySong.image || defaultArt}
              alt="Now Playing"
              fill
              className="object-cover"
            />

            <div className="absolute top-2 left-3 text-xs bg-black/50 px-2 py-1 rounded">
              NOW PLAYING
            </div>
          </div>

          {/* PLAYER */}
          {currentSong && (
            <div className="mb-5">
              <p className="text-sm font-semibold truncate">
                {currentSong.title}
              </p>
              <p className="text-xs text-white/50 truncate mb-3">
                {currentSong.artist}
              </p>

              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShuffle(!shuffle)}
                  className={shuffle ? "text-indigo-400" : "text-white/60"}
                >
                  <Shuffle size={16} />
                </button>

                <button onClick={handlePrev}>
                  <SkipBack size={18} />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                <button onClick={handleNext}>
                  <SkipForward size={18} />
                </button>

                <button
                  onClick={() => setRepeat(!repeat)}
                  className={repeat ? "text-indigo-400" : "text-white/60"}
                >
                  <Repeat size={16} />
                </button>
              </div>

              <div
                className="h-1 bg-white/20 rounded cursor-pointer relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent =
                    ((e.clientX - rect.left) / rect.width) * 100;
                  seek(percent);
                }}
              >
                <div
                  className="h-1 bg-white absolute top-0 left-0"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-white/50 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* PLAYLIST */}
          <h2 className="text-sm text-white/60 mb-2">Playlist</h2>

          <ul className="flex flex-col space-y-2 text-sm mb-3">
            {playlists.map((pl) => (
              <li
                key={pl}
                onClick={() => setSelectedCategory(pl)}
                className={`cursor-pointer px-2 py-1 rounded ${
                  selectedCategory === pl
                    ? "bg-white/10"
                    : "hover:bg-white/5"
                }`}
              >
                <span className="flex items-center gap-2">
                  {pl === "MacPhantom" && <Flame size={14} />}
                  {pl === "Mac808" && <Moon size={14} />}
                  {pl}
                </span>
              </li>
            ))}
          </ul>

          {/* SONG LIST */}
          <div className="overflow-y-auto text-sm space-y-2 flex-1 mb-4">
            {filteredSongs.map((song) => {
              const isCurrent = currentSong?.id === song.id;

              return (
                <div
                  key={song.id}
                  onClick={() => playSong(song)}
                  className={`p-3 rounded-lg flex justify-between items-center cursor-pointer
                  ${
                    isCurrent
                      ? "bg-indigo-500/25 border border-indigo-400/30"
                      : "bg-indigo-500/10 hover:bg-indigo-500/20"
                  }`}
                >
                  <div>
                    <p className="truncate">{song.title}</p>
                    <p className="text-xs text-white/50 truncate">
                      {song.artist}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      isCurrent ? togglePlay() : playSong(song);
                    }}
                  >
                    {isCurrent && isPlaying ? (
                      <Pause size={16} />
                    ) : (
                      <Play size={16} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* VOLUME */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Volume2 size={16} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-indigo-400"
              />
            </div>
          </div>

          {/* SOCIALS */}
          <div className="flex justify-center gap-4 pt-2 border-t border-white/10">
            <a href="#"><Instagram size={18} /></a>
            <a href="#"><Twitter size={18} /></a>
            <a href="#"><Youtube size={18} /></a>
          </div>
        </>
      )}
    </aside>
  );
}