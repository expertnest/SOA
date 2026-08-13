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
  ChevronsLeft,
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

  // Dynamic Audio Duration state
  const [duration, setDuration] = useState<number>(0);

  const {
    isPlaying,
    togglePlay,
    progress,
    seek,
    volume,
    setVolume,
    playSong,
    currentSong,
  } = useMusic();

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

  // Safely extract audio duration from song object or calculate via lightweight Audio instance
  useEffect(() => {
    if (!currentSong) {
      setDuration(0);
      return;
    }

    // 1. Check if duration already exists on the song payload
    if (currentSong.duration && currentSong.duration > 0) {
      setDuration(Math.floor(currentSong.duration));
      return;
    }

    // 2. Fallback: inspect actual audio file metadata
    const audioUrl = currentSong.src || currentSong.audioUrl;
    if (!audioUrl) return;

    const audio = new Audio();
    audio.src = audioUrl;

    const handleMetaData = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(Math.floor(audio.duration));
      }
    };

    audio.addEventListener("loadedmetadata", handleMetaData);
    audio.load();

    return () => {
      audio.removeEventListener("loadedmetadata", handleMetaData);
    };
  }, [currentSong]);

  const fireEvent = async (
    type: "song_play" | "song_skip" | "song_replay" | "song_end"
  ) => {
    if (!currentSong) return;

    const isAnonymous = !user;

    if (isAnonymous && !anonId) return;
    if (!isAnonymous && !convexUser?._id) return;

    try {
      await trackEvent({
        type,
        songId: currentSong.songId,
        duration: Math.floor((progress / 100) * (duration || 0)),
        userId: isAnonymous ? anonId! : convexUser!._id,
        isAnonymous,
      });
    } catch (err) {
      console.error("❌ event failed", err);
    }
  };

  const artists = ["All", "MacPhantom", "Qmilly"];

  const filteredSongs =
    selectedCategory === "All"
      ? songs
      : songs.filter(
          (song) =>
            song.artistName?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  // NEXT TRACK (HANDLES SHUFFLE & SEQUENTIAL)
  const handleNextTrack = async () => {
    if (filteredSongs.length === 0) return;

    await fireEvent("song_skip");

    if (shuffle) {
      let randomIndex = Math.floor(Math.random() * filteredSongs.length);
      if (filteredSongs.length > 1 && currentSong) {
        const currentIndex = filteredSongs.findIndex(
          (s) => s.songId === currentSong.songId
        );
        while (randomIndex === currentIndex) {
          randomIndex = Math.floor(Math.random() * filteredSongs.length);
        }
      }
      playSong(filteredSongs[randomIndex]);
    } else {
      const currentIndex = filteredSongs.findIndex(
        (s) => s.songId === currentSong?.songId
      );
      const nextIndex =
        currentIndex >= 0 ? (currentIndex + 1) % filteredSongs.length : 0;
      playSong(filteredSongs[nextIndex]);
    }
  };

  // PREVIOUS TRACK (HANDLES SHUFFLE & REWIND)
  const handlePrevTrack = () => {
    if (filteredSongs.length === 0) return;

    if (progress > 3) {
      seek(0);
      return;
    }

    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * filteredSongs.length);
      playSong(filteredSongs[randomIndex]);
    } else {
      const currentIndex = filteredSongs.findIndex(
        (s) => s.songId === currentSong?.songId
      );
      const prevIndex =
        currentIndex > 0 ? currentIndex - 1 : filteredSongs.length - 1;
      playSong(filteredSongs[prevIndex]);
    }
  };

  // TRACK END / REPEAT / AUTO ADVANCE LISTENER
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
        seek(0);
        setTimeout(() => {
          hasEndedRef.current = false;
        }, 1000);
      } else {
        handleNextTrack();
      }
    }
  }, [progress, currentSong, repeat, shuffle, filteredSongs]);

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

  // Synchronize elapsed current time using percentage progress and calculated duration
  const currentTime = duration ? Math.floor((progress / 100) * duration) : 0;

  const formatTime = (t: number) => {
    if (isNaN(t) || t < 0 || !isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = String(Math.floor(t % 60)).padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!mounted || !isLoaded) return null;

  return (
    <aside
      className={`
        relative
        bg-neutral-950/80
        text-white
        p-3 md:p-4
        flex flex-col
        transition-all duration-300
        ${leftCollapsed ? "w-12 md:w-12" : "w-64 md:w-[350px]"}
        flex-shrink-0
        backdrop-blur-lg
        shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_40px_rgba(0,0,0,0.6)]
        before:absolute before:inset-0
        before:bg-gradient-to-b before:from-white/[0.04] before:to-transparent
        before:pointer-events-none
      `}
    >
      <button
        onClick={() => setLeftCollapsed(!leftCollapsed)}
        className="mb-1 self-end hover:text-white/70"
      >
        <ChevronsLeft
          size={20}
          className={`transition-transform duration-200 ${
            leftCollapsed ? "rotate-180" : ""
          }`}
        />
      </button>

      {!leftCollapsed && (
        <>
          <div className="flex mb-2">
            <Image
              src="/assets/soalogo.png"
              alt="SOA Logo"
              width={100}
              height={100}
            />
          </div>

          <div className="w-full h-px bg-white/10 mb-4" />

          {/* COVER IMAGE */}
          <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-black/20">
  <Image
    src={displaySong.coverImage || "/assets/soalogo.png"}
    alt="Now Playing"
    fill
    sizes="300px"
    className="object-contain"
    unoptimized
  />

  <div className="absolute left-3 top-2 rounded bg-black/50 px-2 py-1 text-xs">
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

              {/* CONTROLS */}
              <div className="flex items-center justify-between mb-2">
                {/* SHUFFLE BUTTON */}
                <button
                  onClick={() => setShuffle(!shuffle)}
                  className={`p-1.5 rounded-lg transition ${
                    shuffle
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-white/50 hover:text-white"
                  }`}
                  title={shuffle ? "Shuffle ON" : "Shuffle OFF"}
                >
                  <Shuffle size={16} />
                </button>

                {/* PREVIOUS BUTTON */}
                <button
                  onClick={handlePrevTrack}
                  className="text-white/70 hover:text-white transition"
                >
                  <SkipBack size={18} />
                </button>

                {/* PLAY/PAUSE BUTTON */}
                <button
                  onClick={async () => {
                    if (progress > 95) await fireEvent("song_replay");
                    else await fireEvent("song_play");
                    togglePlay();
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                {/* NEXT BUTTON */}
                <button
                  onClick={handleNextTrack}
                  className="text-white/70 hover:text-white transition"
                >
                  <SkipForward size={18} />
                </button>

                {/* REPEAT BUTTON */}
                <button
                  onClick={async () => {
                    const nextRepeatState = !repeat;
                    setRepeat(nextRepeatState);
                    if (nextRepeatState) await fireEvent("song_replay");
                  }}
                  className={`p-1.5 rounded-lg transition ${
                    repeat
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-white/50 hover:text-white"
                  }`}
                  title={repeat ? "Repeat ON" : "Repeat OFF"}
                >
                  <Repeat size={16} />
                </button>
              </div>

              {/* PROGRESS BAR */}
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
                  className="h-1 bg-white absolute top-0 left-0 rounded"
                  style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                />
              </div>

              {/* TIME DISPLAY */}
              <div className="flex justify-between text-xs text-white/50 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* ARTIST DROPDOWN */}
          <div className="mb-4">
            <p className="text-[10px] tracking-widest text-white/40 mb-1 px-1">
              CHOOSE ARTIST
            </p>

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

          {/* PROJECT + SONG GROUPING */}
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
                        className="p-3 rounded-lg flex justify-between items-center bg-white/5 hover:bg-white/10 cursor-pointer transition"
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

          {/* VOLUME CONTROL */}
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

          {/* FOOTER SOCIALS */}
          <div className="flex justify-center gap-4 pt-2 border-t border-white/10 text-white/60">
            <Instagram size={18} className="hover:text-white cursor-pointer transition" />
            <Twitter size={18} className="hover:text-white cursor-pointer transition" />
            <Youtube size={18} className="hover:text-white cursor-pointer transition" />
          </div>
        </>
      )}
    </aside>
  );
} 