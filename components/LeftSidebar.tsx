"use client";

import {
  ChevronLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Instagram,
  Twitter,
  Youtube,
  Shuffle,
  Repeat,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useMusic } from "@/hooks/MusicContext";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

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

  const trackEvent = useMutation(api.events.trackEvent);

  // ✅ REAL SONGS FROM DB
  const rawSongs = useQuery(api.songs.getSongsForFeed) ?? [];

  // 🔥 FIX: ALWAYS normalize audioUrl → src
  const songs = rawSongs.map((s: any) => ({
    ...s,
    src: s.audioUrl, // ❗ IMPORTANT: REMOVE fallback completely
  }));

  const lastSongIdRef = useRef<string | null>(null);
  const hasEndedRef = useRef(false);

  useEffect(() => {
    setMounted(true);

    if (!currentSong && songs.length > 0) {
      playSong(songs[0]); // now uses REAL r2 url via src
    }
  }, [songs]);

  const fireEvent = async (
    type: "song_play" | "song_skip" | "song_replay" | "song_end"
  ) => {
    if (!currentSong) return;

    await trackEvent({
      type,
      songId: currentSong.songId,
      duration: Math.floor((progress / 100) * 180),
    });
  };

  useEffect(() => {
    if (!currentSong) return;

    if (lastSongIdRef.current !== currentSong.songId) {
      hasEndedRef.current = false;
      lastSongIdRef.current = currentSong.songId;
    }

    if (progress >= 98 && !hasEndedRef.current) {
      hasEndedRef.current = true;
      fireEvent("song_end");

      if (repeat) {
        fireEvent("song_replay");
      }
    }
  }, [progress, currentSong, repeat]);

  const playlists = ["MacPhantom", "Mac808"];
  const filteredSongs = songs;

  const displaySong =
    currentSong || {
      coverImage: "/assets/soalogo.png",
      title: "",
      artistName: "",
    };

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
      <button
        onClick={() => setLeftCollapsed(!leftCollapsed)}
        className="mb-1 self-end hover:text-white/70"
      >
        <ChevronLeft size={20} className={leftCollapsed ? "rotate-180" : ""} />
      </button>

      {!leftCollapsed && (
        <>
          <div className="flex justify-center -mt-2 mb-2">
            <Image
              src="/assets/soalogo.png"
              alt="SOA Logo"
              width={180}
              height={180}
            />
          </div>

          <div className="w-full h-px bg-white/10 mb-4" />

          <div className="relative mb-4 rounded-xl overflow-hidden h-56">
            <Image
              src={displaySong.coverImage}
              alt="Now Playing"
              fill
              className="object-cover"
            />
            <div className="absolute top-2 left-3 text-xs bg-black/50 px-2 py-1 rounded">
              NOW PLAYING
            </div>
          </div>

          {currentSong && (
            <div className="mb-5">
              <p className="text-sm font-semibold truncate">
                {currentSong.title}
              </p>
              <p className="text-xs text-white/50 truncate mb-3">
                {currentSong.artistName}
              </p>

              <div className="flex items-center justify-between mb-2">
                <button onClick={() => setShuffle(!shuffle)}>
                  <Shuffle size={16} />
                </button>

                <button onClick={handlePrev}>
                  <SkipBack size={18} />
                </button>

                <button
                  onClick={async () => {
                    if (progress > 95) {
                      await fireEvent("song_replay");
                    } else {
                      await fireEvent("song_play");
                    }
                    togglePlay();
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                <button
                  onClick={async () => {
                    await fireEvent("song_skip");
                    handleNext();
                  }}
                >
                  <SkipForward size={18} />
                </button>

                <button
                  onClick={async () => {
                    setRepeat(!repeat);
                    if (!repeat) await fireEvent("song_replay");
                  }}
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

          <h2 className="text-sm text-white/60 mb-2">Playlist</h2>

          <ul className="flex flex-col space-y-2 text-sm mb-3">
            {playlists.map((pl) => (
              <li
                key={pl}
                onClick={() => setSelectedCategory(pl)}
                className="cursor-pointer px-2 py-1 rounded hover:bg-white/5"
              >
                {pl}
              </li>
            ))}
          </ul>

          <div className="overflow-y-auto text-sm space-y-2 flex-1 mb-4">
            {filteredSongs.map((song) => {
              const isCurrent = currentSong?.songId === song.songId;

              return (
                <div
                  key={song.songId}
                  onClick={() => playSong(song)}
                  className="p-3 rounded-lg flex justify-between items-center bg-white/5"
                >
                  <div>
                    <p>{song.title}</p>
                    <p className="text-xs text-white/50">
                      {song.artistName}
                    </p>
                  </div>

                  <button>
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

          <div className="mb-4 flex items-center gap-2">
            <Volume2 size={16} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex justify-center gap-4 pt-2 border-t border-white/10">
            <Instagram size={18} />
            <Twitter size={18} />
            <Youtube size={18} />
          </div>
        </>
      )}
    </aside>
  );
}