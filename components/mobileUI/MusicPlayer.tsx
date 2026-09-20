"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Library } from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMusic } from "@/hooks/MusicContext";

/**
 * Full MusicPlayer.tsx (patched)
 *
 * - FIX: SkipForward (Next) no longer triggers UI-level analytics (it only calls handleNext()).
 * - Keeps: normalized songId, reliable seeking rect, fireEvent(song) override, iPad detection,
 *   drag-to-dismiss overlays, category filtering, anon id handling, etc.
 */

type RawSong = any;

const MusicPlayer: React.FC = () => {
  // ======================
  // MusicContext (provider)
  // ======================
  const {
    isPlaying,
    togglePlay,
    handleNext,
    handlePrev,
    currentSong,
    playSong,
    progress,
    seek,
    duration,
  } = useMusic();

  // ======================
  // Convex + Auth
  // ======================
  const rawSongs = useQuery(api.songs.getSongsForFeed) ?? [];
  const trackEvent = useMutation(api.events.trackEvent);
  const { user } = useUser();
  const convexUser = useQuery(api.users.getCurrentUser);

  // ======================
  // Local UI state
  // ======================
  const [showQueue, setShowQueue] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [isIPad, setIsIPad] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [anonId, setAnonId] = useState<string | null>(null);
  const lastTrackedSongRef = useRef<string | null>(null);

  // ======================
  // Normalize songs into canonical shape
  // ======================
  const songs = useMemo(() => {
    return (rawSongs ?? []).map((song: RawSong) => {
      const canonicalId = song.songId ?? song.id ?? (song._id as string) ?? null;
      return {
        ...song,
        songId: canonicalId,
        id: canonicalId,
        image:
          song.coverImage && typeof song.coverImage === "string" && song.coverImage.startsWith("http")
            ? song.coverImage
            : "/assets/soalogo.png",
        artist: song.artistName ?? "Unknown Artist",
        src: song.audioUrl ?? song.src ?? "",
        category: song.genre ?? "Music",
      };
    });
  }, [rawSongs]);

  // ======================
  // anon id creation (compat)
  // ======================
  useEffect(() => {
    if (typeof window === "undefined") return;

    let id = localStorage.getItem("soa_anonymous_id");
    if (!id) {
      const legacy = localStorage.getItem("anonId");
      id = legacy ?? crypto.randomUUID();
      try {
        localStorage.setItem("soa_anonymous_id", id);
      } catch (err) {
        console.warn("failed to write anon id to localStorage", err);
      }
    }
    setAnonId(id);
  }, []);

  // ======================
  // Analytics helper: fireEvent (optional song override)
  // ======================
  const fireEvent = async (
    type: "song_play" | "song_skip" | "song_replay" | "song_end",
    songOverride?: any
  ) => {
    const target = songOverride ?? currentSong;
    if (!target) return;

    const songId = target.songId ?? target.id;
    if (!songId) {
      console.warn("fireEvent missing songId", target);
      return;
    }

    const isAnonymous = !user;
    if (isAnonymous && !anonId) return;
    if (!isAnonymous && !convexUser) return;

    const payload = {
      type,
      songId,
      duration: Math.floor((progress / 100) * (duration || 0)),
      userId: isAnonymous ? anonId! : (convexUser!._id as any),
      isAnonymous,
    };

    try {
      await trackEvent(payload);
    } catch (err) {
      console.error("Failed to send trackEvent:", err);
    }
  };

  // ======================
  // iPad detection
  // ======================
  useEffect(() => {
    if (typeof navigator === "undefined" || typeof document === "undefined") {
      setIsIPad(false);
      return;
    }

    const ua = navigator.userAgent.toLowerCase();
    const classicIPad = /ipad/i.test(ua);
    const modernIPad = ua.includes("macintosh") && "ontouchend" in document;
    setIsIPad(classicIPad || modernIPad);
  }, []);

  // ======================
  // prevent body scrolling when overlays open
  // ======================
  useEffect(() => {
    document.body.style.overflow = showQueue || showFullScreen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showQueue, showFullScreen]);

  // ======================
  // categories and filtering
  // ======================
  const categories = useMemo(() => Array.from(new Set(songs.map((s: any) => s.category))), [songs]);
  const filteredSongs = selectedCategory ? songs.filter((s: any) => s.category === selectedCategory) : songs;

  // ======================
  // formatTime helper (percent -> mm:ss)
  // ======================
  const formatTime = (percent: number) => {
    const dur = duration || 0;
    const sec = Math.floor((percent / 100) * dur);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  // ======================
  // seek handler (range input)
  // ======================
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  // ======================
  // drag end handler for overlays (dismiss by dragging down)
  // ======================
  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    if (info.offset.y > 150) {
      if (showQueue) setShowQueue(false);
      if (showFullScreen) setShowFullScreen(false);
    }
  };

  // ======================
  // central play button behavior
  // ======================
  const handlePlayBtn = async () => {
    if (!currentSong && songs.length > 0) {
      try {
        await trackEvent({
          type: "song_play",
          songId: songs[0].songId ?? songs[0].id,
          duration: Math.floor((progress / 100) * (duration || 0)),
          userId: !user ? (anonId ?? "") : (convexUser!._id as any),
          isAnonymous: !user,
        });
      } catch (err) {
        console.error("analytics error auto-play", err);
      }
      playSong(songs[0]);
      return;
    }

    if (!isPlaying && currentSong) {
      try {
        await fireEvent("song_play");
      } catch (err) {
        console.error("fireEvent(play) failed", err);
      }
      togglePlay();
      return;
    }

    if (isPlaying) {
      togglePlay();
    }
  };

  // ======================
  // inline progress click: compute percent using element rect
  // ======================
  const handleInlineProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.min(100, Math.max(0, (x / rect.width) * 100));
    seek(percent);
  };

  // ======================
  // RENDER
  // ======================
  return (
    <>
      {/* MAIN PLAYER BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-black text-white shadow-lg z-20 border-t border-gray-700">
        <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 relative">
          {/* Song Info */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 cursor-pointer" onClick={() => setShowFullScreen(true)}>
            {currentSong?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentSong.image} alt={currentSong.title} className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover" />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-md" />
            )}

            <div className="leading-tight">
              <h2 className="text-sm sm:text-lg font-semibold truncate max-w-[120px] sm:max-w-[200px]">
                {currentSong?.title ?? "No Song"}
              </h2>

              <p className="hidden sm:block text-xs sm:text-sm text-white">{currentSong?.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* SkipBack: PREVIOUS — do NOT emit song_skip */}
            <SkipBack
              size={20}
              className="cursor-pointer"
              onClick={() => {
                // Previous logic handled by MusicContext; do not fire song_skip here.
                handlePrev();
              }}
            />

            {isPlaying ? (
              <Pause size={isIPad ? 28 : 32} className="cursor-pointer" onClick={handlePlayBtn} />
            ) : (
              <Play size={isIPad ? 28 : 32} className="cursor-pointer" onClick={handlePlayBtn} />
            )}

            {/* SkipForward: NEXT — do NOT emit analytics here; MusicContext will send song_skip appropriately */}
            <SkipForward
              size={20}
              className="cursor-pointer"
              onClick={() => {
                handleNext();
              }}
            />

            <Library size={22} className="cursor-pointer hover:text-teal-400 transition" onClick={() => setShowQueue(true)} />
          </div>
        </div>

        {/* small inline progress bar */}
        <div className="h-1 bg-zinc-800 cursor-pointer" onClick={handleInlineProgressClick} role="presentation">
          <div className="h-1 bg-teal-400" style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} />
        </div>
      </div>

      {/* PLAYLIST POPUP (Queue) */}
      <AnimatePresence>
        {showQueue && (
          <motion.div
            key="queue"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 text-white z-50 flex flex-col"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.4}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-2xl" />

            <div className="relative z-10 w-16 h-2 rounded-full mx-auto my-3 cursor-grab bg-gradient-to-r from-teal-400 via-green-400 to-teal-400" />

            <div className="relative z-10 flex justify-center items-center p-6">
              {currentSong?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={currentSong.image} alt={currentSong.title} className="w-40 h-40 rounded-xl shadow-2xl object-cover" />
              ) : (
                <div className="w-40 h-40 bg-black/30 backdrop-blur-md rounded-xl shadow-2xl" />
              )}
            </div>

            <div className="relative z-10 px-4 mb-3">
              <h3 className="text-xl font-bold text-white mb-2">Filter by Category</h3>

              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm border ${
                    selectedCategory === null ? "bg-teal-400 border-teal-400 text-black" : "border-gray-600 text-white"
                  }`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </button>

                {categories.map((cat: any) => (
                  <button
                    key={cat}
                    className={`px-3 py-1 rounded-full text-sm border ${
                      selectedCategory === cat ? "bg-purple-500 border-purple-500 text-black" : "border-gray-600 text-white"
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className={`relative z-10 flex-1 overflow-y-auto px-4 pb-4 ${isDragging ? "pointer-events-none" : ""}`}>
              <h3 className="text-lg font-semibold text-white mb-3">Up Next</h3>

              <ul className="space-y-2">
                {filteredSongs.map((song: any) => {
                  const isCurrent = currentSong?.songId === song.songId;

                  return (
                    <li
                      key={song.songId}
                      className="p-3 bg-black/30 backdrop-blur-md rounded-xl flex justify-between items-center hover:bg-black/40 transition cursor-pointer"
                      onClick={async () => {
                        try {
                          await fireEvent("song_play", song);
                          playSong(song);
                        } catch (err) {
                          console.error("play-tapped-song analytics failed", err);
                          playSong(song);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {song.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={song.image} alt={song.title} className="w-12 h-12 rounded-md object-cover" />
                        ) : (
                          <div className="w-12 h-12 bg-black/20 rounded-md" />
                        )}

                        <div>
                          <p className="font-semibold text-white">{song.title}</p>
                          <p className="text-sm text-white">{song.artist}</p>
                        </div>
                      </div>

                      <div
                        onClick={(e) => {
                          e.stopPropagation();

                          if (isCurrent && isPlaying) {
                            togglePlay();
                          } else {
                            playSong(song);
                          }
                        }}
                      >
                        {isCurrent && isPlaying ? (
                          <Pause size={20} className="text-teal-400 cursor-pointer" />
                        ) : (
                          <Play size={20} className="text-white cursor-pointer" />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN PLAYER */}
      <AnimatePresence>
        {showFullScreen && (
          <motion.div
            key="fullScreenPlayer"
            className="fixed inset-0 text-white z-[60] flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.4}
            onDragEnd={handleDragEnd}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-2xl" />

            <div className="relative z-10 w-16 h-2 rounded-full mx-auto my-3 cursor-grab bg-gradient-to-r from-teal-400 via-green-400 to-teal-400" />

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
              {currentSong?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={currentSong.image} alt={currentSong.title} className="w-72 h-72 sm:w-80 sm:h-80 rounded-xl shadow-2xl object-cover" />
              ) : (
                <div className="w-72 h-72 sm:w-80 sm:h-80 bg-black/30 backdrop-blur-md rounded-xl shadow-2xl" />
              )}

              <h3 className="text-2xl font-bold mt-6 text-white">{currentSong?.title ?? "No Song"}</h3>
              <p className="text-white text-lg mt-1">{currentSong?.artist}</p>

              <div className="flex items-center gap-6 mt-8">
                {/* SkipBack: PREVIOUS — do NOT emit song_skip */}
                <SkipBack
                  size={32}
                  className="cursor-pointer"
                  onClick={() => {
                    handlePrev();
                  }}
                />

                {isPlaying ? (
                  <Pause size={48} className="cursor-pointer" onClick={handlePlayBtn} />
                ) : (
                  <Play
                    size={48}
                    className="cursor-pointer"
                    onClick={async () => {
                      await handlePlayBtn();
                    }}
                  />
                )}

                {/* SkipForward: NEXT — do NOT emit analytics here; MusicContext will send song_skip appropriately */}
                <SkipForward
                  size={32}
                  className="cursor-pointer"
                  onClick={() => {
                    handleNext();
                  }}
                />
              </div>

              <div className="w-full mt-8">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={handleSeek}
                  className="w-full h-1 appearance-none bg-zinc-700/50 accent-teal-400 cursor-pointer rounded"
                />

                <div className="flex justify-between text-xs text-white mt-1">
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(100)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer;