"use client";

import {
  ChevronLeft,
  ChevronDown,
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

import { useUser } from "@clerk/nextjs";

export default function LeftSidebar() {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [artistDropdownOpen, setArtistDropdownOpen] = useState(false);

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

  // 🔥 FIXED: correct mutation path
  const trackEvent = useMutation(api.events.trackEvent);

  const { user, isLoaded } = useUser();
  const convexUser = useQuery(api.users.getCurrentUser);

  const [anonId, setAnonId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem("anonId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("anonId", id);
    }
    setAnonId(id);
  }, []);

  const rawSongs = useQuery(api.songs.getSongsForFeed) ?? [];

  const songs = rawSongs.map((s: any) => ({
    ...s,
    src: s.audioUrl,
    coverImage:
      s.coverImage && s.coverImage.startsWith("http")
        ? s.coverImage
        : "/assets/soalogo.png",
  }));

  const lastSongIdRef = useRef<string | null>(null);
  const hasEndedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    if (!currentSong && songs.length > 0) {
      playSong(songs[0]);
    }
  }, [songs]);

  // 🔥 FIXED + DEBUG
  const fireEvent = async (
    type: "song_play" | "song_skip" | "song_replay" | "song_end"
  ) => {
    if (!currentSong) return;

    const isAnonymous = !user;

    if (isAnonymous && !anonId) return;
    if (!isAnonymous && !convexUser?._id) return; // ✅ safer

    console.log("🔥 firing event", type, currentSong.songId);

    try {
      await trackEvent({
        type,
        songId: currentSong.songId,
        duration: Math.floor((progress / 100) * 180),
        userId: isAnonymous ? anonId! : convexUser!._id,
        isAnonymous,
      });

      console.log("✅ event sent");
    } catch (err) {
      console.error("❌ event failed", err);
    }
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

  const artists = ["All", "MacPhantom", "Qmilly"];

  const filteredSongs =
    selectedCategory === "All"
      ? songs
      : songs.filter(
          (song) =>
            song.artistName?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  const grouped = filteredSongs.reduce((acc: any, song: any) => {
    const key = song.projectName || "Singles";
    if (!acc[key]) acc[key] = [];
    acc[key].push(song);
    return acc;
  }, {});

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

  if (!mounted || !isLoaded) return null;

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

          {/* 🔥 FIXED IMAGE BLOCK */}
          <div className="relative mb-4 rounded-xl overflow-hidden h-56">
            <Image
              src={displaySong.coverImage || "/assets/soalogo.png"}
              alt="Now Playing"
              fill
              sizes="300px"
              className="object-cover"
              unoptimized // ✅ important for external URLs
            />
            <div className="absolute top-2 left-3 text-xs bg-black/50 px-2 py-1 rounded">
              NOW PLAYING
            </div>
          </div>

          {currentSong && (
            <div className="mb-5">
              <p className="text-sm font-semibold truncate">{currentSong.title}</p>
              <p className="text-xs text-white/50 truncate mb-3">{currentSong.artistName}</p>

              {/* controls unchanged */}
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => setShuffle(!shuffle)}>
                  <Shuffle size={16} />
                </button>

                <button onClick={handlePrev}>
                  <SkipBack size={18} />
                </button>

                <button
                  onClick={async () => {
                    if (progress > 95) await fireEvent("song_replay");
                    else await fireEvent("song_play");
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
                  const percent = ((e.clientX - rect.left) / rect.width) * 100;
                  seek(percent);
                }}
              >
                <div className="h-1 bg-white absolute top-0 left-0" style={{ width: `${progress}%` }} />
              </div>

              <div className="flex justify-between text-xs text-white/50 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* ✅ DROPDOWN */}
 {/* ✅ IMPROVED DROPDOWN */}
<div className="mb-4">
  {/* Label */}
  <p className="text-[10px] tracking-widest text-white/40 mb-1 px-1">
    CHOOSE ARTIST
  </p>

  {/* Trigger */}
  <button
    onClick={() => setArtistDropdownOpen(!artistDropdownOpen)}
    className="w-full flex items-center justify-between bg-white/5 px-3 py-2.5 rounded-lg hover:bg-white/10 transition border border-white/10"
  >
    <span className="text-sm font-semibold">
      {selectedCategory}
    </span>

    <ChevronDown
      size={16}
      className={`transition-transform duration-300 ${
        artistDropdownOpen ? "rotate-180" : ""
      }`}
    />
  </button>

  {/* Dropdown */}
  <div
    className={`overflow-hidden transition-all duration-300 ${
      artistDropdownOpen ? "max-h-48 mt-2" : "max-h-0"
    }`}
  >
    <div className="bg-black/40 rounded-lg border border-white/10 p-1">
      {artists.map((artist) => (
        <div
          key={artist}
          onClick={() => {
            setSelectedCategory(artist);
            setArtistDropdownOpen(false);
          }}
          className={`px-3 py-2 text-sm rounded cursor-pointer transition ${
            selectedCategory === artist
              ? "bg-white text-black"
              : "hover:bg-white/5"
          }`}
        >
          {artist}
        </div>
      ))}
    </div>
  </div>
</div>

          {/* ✅ PROJECT + SONG GROUPING */}
          <div className="overflow-y-auto text-sm space-y-4 flex-1 mb-4">
            {Object.entries(grouped).map(([project, songs]: any) => (
              <div key={project} className="transition-all duration-300">
                <p className="text-xs text-white/40 mb-1 px-1">{project}</p>

                <div className="space-y-2">
                  {songs.map((song: any) => {
                    const isCurrent = currentSong?.songId === song.songId;

                    return (
                      <div
                        key={song.songId}
                        onClick={() => playSong(song)}
                        className="p-3 rounded-lg flex justify-between items-center bg-white/5 hover:bg-white/10 transition"
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
              </div>
            ))}
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