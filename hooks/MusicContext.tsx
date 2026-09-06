"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

import {
  useQuery,
  useMutation,
} from "convex/react";

import { api } from "@/convex/_generated/api";

import type { Id } from "@/convex/_generated/dataModel";

import { useUser } from "@clerk/nextjs";

/* =========================
   LOCAL PLAYER TYPE
========================= */

export type Song = {
  songId: Id<"songs">;

  id?: string;

  title: string;

  artistName: string;
  artist?: string;

  coverImage?: string;
  image?: string;

  duration: number;

  totalPlays: number;
  skipRate: number;
  replayRate: number;

  src: string;

  audioUrl?: string;

  genre?: string;
  category?: string;
};

type MusicContextType = {
  isPlaying: boolean;

  togglePlay: () => void;

  handleNext: () => void;

  handlePrev: () => void;

  currentSong: Song | null;

  progress: number;

  seek: (value: number) => void;

  volume: number;

  setVolume: (v: number) => void;

  playSong: (song: Song) => void;

  setCurrentSongIndex: React.Dispatch<
    React.SetStateAction<number>
  >;

  duration: number;

  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
};

const MusicContext =
  createContext<
    MusicContextType | undefined
  >(undefined);

/* =========================
   PROVIDER
========================= */

export function MusicProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // ======================
  // RAW CONVEX SONGS
  // ======================

  const rawSongs =
    useQuery(
      api.songs.getSongsForFeed
    ) ?? [];

  // ======================
  // AUTHENTICATION
  // ======================

  const { user, isLoaded } = useUser();

  const convexUser =
    useQuery(api.users.getCurrentUser);

  // ======================
  // ANALYTICS
  // ======================

  const trackEvent =
    useMutation(
      api.events.trackEvent
    );

  // ======================
  // ANONYMOUS ID
  // ======================

  const anonymousId =
    useRef<string | null>(null);

  useEffect(() => {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    /*
     * Canonical anonymous identity:
     *
     * soa_anonymous_id
     *
     * If an older anonId exists from the
     * previous implementation, preserve it
     * by migrating it into the canonical key.
     */

    let id =
      localStorage.getItem(
        "soa_anonymous_id"
      );

    if (!id) {
      const legacyId =
        localStorage.getItem(
          "anonId"
        );

      id =
        legacyId ??
        crypto.randomUUID();

      localStorage.setItem(
        "soa_anonymous_id",
        id
      );
    }

    anonymousId.current = id;
  }, []);

  // ======================
  // MAP SONGS
  // ======================

  const songs: Song[] =
    rawSongs.map((s: any) => ({
      songId: s.songId,

      id: s.songId,

      title: s.title,

      artistName:
        s.artistName ??
        "Unknown Artist",

      artist:
        s.artistName ??
        "Unknown Artist",

      coverImage:
        s.coverImage ??
        "/assets/soalogo.png",

      image:
        s.coverImage &&
        s.coverImage.startsWith("http")
          ? s.coverImage
          : "/assets/soalogo.png",

      duration:
        s.duration ?? 0,

      totalPlays:
        s.totalPlays ?? 0,

      skipRate:
        s.skipRate ?? 0,

      replayRate:
        s.replayRate ?? 0,

      audioUrl:
        s.audioUrl,

      src:
        s.audioUrl ??
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",

      genre:
        s.genre ?? "Music",

      category:
        s.genre ?? "Music",
    }));

  // ======================
  // STATE
  // ======================

  const [
    isPlaying,
    setIsPlaying,
  ] = useState(false);

  const [
    currentSongIndex,
    setCurrentSongIndex,
  ] = useState(0);

  const [
    progress,
    setProgress,
  ] = useState(0);

  const [
    volume,
    setVolume,
  ] = useState(1);

  const [
    duration,
    setDuration,
  ] = useState(0);

  // ======================
  // AUDIO
  // ======================

  const audioRef =
    useRef<HTMLAudioElement | null>(
      null
    );

  const playRequestRef =
    useRef(0);

  const shouldPlayRef =
    useRef(false);

  const currentSong =
    songs[currentSongIndex] ??
    null;

  // ======================
  // RETENTION
  // ======================

  const trackedMilestones =
    useRef<Set<number>>(
      new Set()
    );

  // ======================
  // SEEK / IDENTITY / SESSION REFS
  // ======================

  // last time a seek started (ms since epoch) or a grace-until timestamp
  const lastSeekAt = useRef<number | null>(null);
  // whether the player is currently in a seeking state (browser firing seeking/seeked)
  const seekingRef = useRef(false);

  // track when we last started a 'song_play' session from client to avoid duplicates
  const sessionStartedAtRef =
    useRef<number | null>(null);

  // minimum ms of actual playback required after a seek before we allow progress milestones
  const MIN_PLAY_AFTER_SEEK_MS = 1200;

  // ======================
  // IDENTITY RESOLUTION
  // ======================

  const getAnalyticsIdentity =
    () => {
      /*
       * Do not send analytics until Clerk
       * has finished determining auth state.
       */

      if (!isLoaded) {
        return null;
      }

      /*
       * LOGGED-IN USER
       *
       * Use the Convex users._id as the
       * canonical event userId.
       */

      if (user) {
        if (!convexUser?._id) {
          return null;
        }

        return {
          userId: convexUser._id,
          isAnonymous: false,
        };
      }

      /*
       * LOGGED-OUT USER
       *
       * Use one persistent anonymous ID.
       */

      if (!anonymousId.current) {
        return null;
      }

      return {
        userId: anonymousId.current,
        isAnonymous: true,
      };
    };

  // ======================
  // HELPER: send a generic event (play/end/skip/replay)
  // ======================

  const sendEvent = async (
    type:
      | "song_play"
      | "song_end"
      | "song_skip"
      | "song_replay",
    song: Song
  ) => {
    if (!song) {
      return;
    }

    const identity =
      getAnalyticsIdentity();

    /*
     * Don't send an event until identity
     * is fully resolved.
     */

    if (!identity) {
      return;
    }

    const audio =
      audioRef.current;

    const rawCurrentTime =
      audio?.currentTime ?? 0;

    const rawDuration =
      audio?.duration ??
      song.duration ??
      0;

    /*
     * Never send NaN or Infinity to Convex.
     */

    const playedDuration =
      Number.isFinite(
        rawCurrentTime
      ) &&
      rawCurrentTime >= 0
        ? rawCurrentTime
        : 0;

    const durationValue =
      Number.isFinite(
        rawDuration
      ) &&
      rawDuration > 0
        ? rawDuration
        : 0;

    try {
      await trackEvent({
        userId:
          identity.userId,

        isAnonymous:
          identity.isAnonymous,

        type,

        songId:
          song.songId,

        playedDuration,

        duration:
          durationValue,

        source:
          "music_player",

        deviceType:
          "web",
      });
    } catch (error) {
      /*
       * Analytics should NEVER break
       * music playback.
       */

      console.error(
        "Analytics event failed:",
        error
      );
    }
  };

  // ======================
  // HELPER: send progress milestone
  // ======================

  const sendProgress = async (
    point: number,
    song: Song
  ) => {
    if (!song) return;

    const identity =
      getAnalyticsIdentity();

    if (!identity) return;

    const audio = audioRef.current;

    const rawCurrentTime =
      audio?.currentTime ?? 0;

    const rawDuration =
      audio?.duration ??
      song.duration ??
      0;

    const playedDuration =
      Number.isFinite(rawCurrentTime) &&
      rawCurrentTime >= 0
        ? rawCurrentTime
        : 0;

    const durationValue =
      Number.isFinite(rawDuration) &&
      rawDuration > 0
        ? rawDuration
        : 0;

    try {
      await trackEvent({
        userId: identity.userId,
        isAnonymous: identity.isAnonymous,
        type: "song_progress",
        songId: song.songId,
        position: point,
        playedDuration,
        duration: durationValue,
        source: "retention",
        deviceType: "web",
      });
    } catch (err) {
      console.error("Retention event failed:", err);
    }
  };

  // ======================
  // SINGLE START: ensure only one source of truth for starting a playback session
  // ======================

  const startPlaybackIfNeeded = async (song: Song | null) => {
    if (!song) return;

    const now = Date.now();
    const PLAY_COOLDOWN_MS = 30 * 1000;

    if (
      sessionStartedAtRef.current &&
      now - sessionStartedAtRef.current < PLAY_COOLDOWN_MS
    ) {
      // still cooling down — do not send another song_play
      return;
    }

    sessionStartedAtRef.current = now;

    // decide whether this should be a replay event or a play
    // if the user clicks play when progress > 90% treat as replay
    const isReplay = progress > 90;

    if (isReplay) {
      await sendEvent("song_replay", song);
    } else {
      await sendEvent("song_play", song);
    }
  };

  // ======================
  // SAFE PLAY
  // ======================

  const safelyPlay = async (
    audio: HTMLAudioElement
  ) => {
    const requestId =
      ++playRequestRef.current;

    try {
      /*
       * Wait until the browser has enough
       * information to begin playback.
       */

      if (
        audio.readyState <
        HTMLMediaElement.HAVE_FUTURE_DATA
      ) {
        await new Promise<void>(
          (resolve) => {
            const handleCanPlay =
              () => {
                audio.removeEventListener(
                  "canplay",
                  handleCanPlay
                );

                resolve();
              };

            audio.addEventListener(
              "canplay",
              handleCanPlay,
              {
                once: true,
              }
            );
          }
        );
      }

      /*
       * A newer request may have happened
       * while we were waiting.
       */

      if (
        requestId !==
        playRequestRef.current
      ) {
        return;
      }

      if (
        !shouldPlayRef.current
      ) {
        return;
      }

      await audio.play();

      /*
       * Only mark the player as playing
       * if this request is still current.
       */

      if (
        requestId ===
        playRequestRef.current
      ) {
        setIsPlaying(true);
        // only call startPlayback from the success path once playback actually began
        if (shouldPlayRef.current) {
          void startPlaybackIfNeeded(currentSong);
        }
      }
    } catch (error: any) {
      /*
       * AbortError is normal when another
       * source/load/play request replaces
       * this one.
       */

      if (
        error?.name ===
        "AbortError"
      ) {
        return;
      }

      console.error(
        "Audio playback failed:",
        error
      );

      setIsPlaying(false);
    }
  };

  // ======================
  // SAFE SOURCE LOADING
  // ======================

  const loadSong = (
    song: Song,
    autoPlay: boolean
  ) => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    shouldPlayRef.current =
      autoPlay;

    playRequestRef.current++;

    /*
     * Stop any existing playback
     * before replacing src.
     */

    audio.pause();

    setIsPlaying(false);

    /*
     * Reset playback state.
     */

    setProgress(0);

    setDuration(
      song.duration ?? 0
    );

    /*
     * Set source ONCE.
     */

    if (
      audio.src !== song.src
    ) {
      audio.src = song.src;
    }

    /*
     * Tell Safari/Chrome that the source
     * has changed.
     */

    audio.load();

    if (autoPlay) {
      void safelyPlay(audio);
    }
  };

  // ======================
  // CREATE AUDIO
  // ======================

  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const audio =
      new Audio();

    audio.preload = "auto";

    audio.volume = volume;

    audioRef.current =
      audio;

    return () => {
      shouldPlayRef.current =
        false;

      playRequestRef.current++;

      audio.pause();

      audio.src = "";

      audio.load();

      audioRef.current =
        null;
    };
  }, []);

  // ======================
  // LOAD CURRENT SONG
  // ======================

  useEffect(() => {
    if (!currentSong) {
      return;
    }

    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    trackedMilestones.current.clear();

    /*
     * Loading a song here does NOT
     * automatically play it.
     *
     * playSong() controls autoPlay.
     */

    const currentSrc =
      audio.getAttribute("src");

    if (
      currentSrc !==
      currentSong.src
    ) {
      audio.pause();

      playRequestRef.current++;

      audio.src =
        currentSong.src;

      audio.load();

      setProgress(0);

      setDuration(
        currentSong.duration ?? 0
      );
    }
  }, [
    currentSong?.songId,
  ]);

  // ======================
  // AUDIO EVENTS
  // ======================

  useEffect(() => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    // ----------------------
    // seeking handlers
    // ----------------------
    const handleSeeking = () => {
      seekingRef.current = true;
      lastSeekAt.current = Date.now();
    };

    const handleSeeked = () => {
      // require a small grace period of real playback after a seek before firing milestones
      lastSeekAt.current = Date.now();
      seekingRef.current = false;
    };

    audio.addEventListener("seeking", handleSeeking);
    audio.addEventListener("seeked", handleSeeked);

    // ----------------------
    // progress updater
    // ----------------------
    const updateProgress =
      () => {
        if (
          !Number.isFinite(
            audio.duration
          ) ||
          audio.duration <= 0
        ) {
          return;
        }

        const percent =
          audio.duration > 0
            ? (audio.currentTime / audio.duration) * 100
            : 0;

        setProgress(
          Math.min(
            100,
            Math.max(
              0,
              percent
            )
          )
        );

        setDuration(
          audio.duration
        );

        // ======================
        // RETENTION
        // ======================

        const milestones = [
          10,
          25,
          50,
          75,
          90,
        ];

        const now = Date.now();

        milestones.forEach(
          (point) => {
            if (
              (percent >= point) &&
              !trackedMilestones.current.has(
                point
              )
            ) {
              // gate milestone if user recently sought/jumped
              if (lastSeekAt.current) {
                // require that we've observed at least MIN_PLAY_AFTER_SEEK_MS of real play time (simple heuristic)
                if (now - lastSeekAt.current < MIN_PLAY_AFTER_SEEK_MS) {
                  // skip firing this milestone for now
                  return;
                }
              }

              trackedMilestones.current.add(
                point
              );

              /*
               * Resolve the same identity used
               * by every other player event.
               */

              const identity =
                getAnalyticsIdentity();

              if (
                identity &&
                currentSong
              ) {
                void sendProgress(point, currentSong);
              }
            }
          }
        );
      };

    const handlePlay =
      () => {
        setIsPlaying(true);
      };

    const handlePause =
      () => {
        /*
         * Do not force false during
         * source transitions if a new
         * play request is pending.
         */

        if (
          !shouldPlayRef.current
        ) {
          setIsPlaying(false);
        }
      };

    const handleEnded =
      async () => {
        if (!audioRef.current) {
          return;
        }

        if (!currentSong) {
          return;
        }

        shouldPlayRef.current =
          false;

        setIsPlaying(false);

        await sendEvent(
          "song_end",
          currentSong
        );

        if (
          currentSongIndex <
          songs.length - 1
        ) {
          const nextIndex =
            currentSongIndex + 1;

          setCurrentSongIndex(
            nextIndex
          );

          setProgress(0);

          /*
           * Automatically continue
           * if the playlist has another song.
           */

          shouldPlayRef.current =
            true;
        }
      };

    audio.addEventListener(
      "timeupdate",
      updateProgress
    );

    audio.addEventListener(
      "play",
      handlePlay
    );

    audio.addEventListener(
      "pause",
      handlePause
    );

    audio.addEventListener(
      "ended",
      handleEnded
    );

    return () => {
      audio.removeEventListener(
        "seeking",
        handleSeeking
      );
      audio.removeEventListener(
        "seeked",
        handleSeeked
      );

      audio.removeEventListener(
        "timeupdate",
        updateProgress
      );

      audio.removeEventListener(
        "play",
        handlePlay
      );

      audio.removeEventListener(
        "pause",
        handlePause
      );

      audio.removeEventListener(
        "ended",
        handleEnded
      );
    };
  }, [
    currentSong?.songId,
    currentSongIndex,
    songs.length,
    isLoaded,
    user,
    convexUser?._id,
  ]);

  // ======================
  // AUTO PLAY NEXT SONG
  // ======================

  useEffect(() => {
    if (
      !currentSong ||
      !shouldPlayRef.current
    ) {
      return;
    }

    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    /*
     * The ended event changed the index.
     * Now safely load the new source.
     */

    trackedMilestones.current.clear();

    loadSong(
      currentSong,
      true
    );

    // NOTE: do NOT call sendEvent("song_play") here.
    // startPlaybackIfNeeded will be called after actual playback starts (in safelyPlay).
  }, [
    currentSong?.songId,
    isLoaded,
    user,
    convexUser?._id,
  ]);

  // ======================
  // PLAY / PAUSE
  // ======================

  const togglePlay =
    () => {
      const audio =
        audioRef.current;

      if (
        !audio ||
        !currentSong
      ) {
        return;
      }

      if (
        !audio.paused
      ) {
        shouldPlayRef.current =
          false;

        playRequestRef.current++;

        audio.pause();

        setIsPlaying(false);

        return;
      }

      shouldPlayRef.current =
        true;

      void safelyPlay(
        audio
      );

      // No direct sendEvent here — safelyPlay will call startPlaybackIfNeeded() once play actually begins.
    };

  // ======================
  // NEXT
  // ======================

  const handleNext =
    async () => {
      if (
        !currentSong
      ) {
        return;
      }

      if (
        audioRef.current &&
        audioRef.current.currentTime >
          3
      ) {
        await sendEvent(
          "song_skip",
          currentSong
        );
      }

      if (
        currentSongIndex >=
        songs.length - 1
      ) {
        shouldPlayRef.current =
          false;

        setIsPlaying(false);

        return;
      }

      const nextIndex =
        currentSongIndex + 1;

      const wasPlaying =
        !audioRef.current
          ?.paused;

      shouldPlayRef.current =
        wasPlaying;

      playRequestRef.current++;

      audioRef.current?.pause();

      setIsPlaying(false);

      setCurrentSongIndex(
        nextIndex
      );

      setProgress(0);
    };

  // ======================
  // PREVIOUS
  // ======================

  const handlePrev =
    () => {
      // If currentTime > 3s, rewind to start of same track
      const audio = audioRef.current;
      if (!audio) return;

      if (audio.currentTime > 3) {
        audio.currentTime = 0;
        setProgress(0);
        // Do not immediately send song_replay here; startPlaybackIfNeeded will handle replay if they press play or playback resumes.
        return;
      }

      if (currentSongIndex <= 0) {
        return;
      }

      const prevIndex =
        currentSongIndex - 1;

      const wasPlaying =
        !audioRef.current
          ?.paused;

      shouldPlayRef.current =
        wasPlaying;

      playRequestRef.current++;

      audioRef.current?.pause();

      setIsPlaying(false);

      setCurrentSongIndex(
        prevIndex
      );

      setProgress(0);
    };

  // ======================
  // SEEK
  // ======================

  const seek = (
    value: number
  ) => {
    const audio =
      audioRef.current;

    if (
      !audio ||
      !Number.isFinite(
        audio.duration
      ) ||
      audio.duration <= 0
    ) {
      return;
    }

    const clamped =
      Math.min(
        100,
        Math.max(
          0,
          value
        )
      );

    audio.currentTime =
      (clamped / 100) *
      audio.duration;

    // mark lastSeekAt so progress gating applies immediately
    lastSeekAt.current = Date.now();

    setProgress(
      clamped
    );
  };

  // ======================
  // PLAY SPECIFIC SONG
  // ======================

  const playSong = (
    song: Song
  ) => {
    const index =
      songs.findIndex(
        (s) =>
          s.songId ===
          song.songId
      );

    if (
      index === -1
    ) {
      return;
    }

    trackedMilestones.current.clear();

    shouldPlayRef.current =
      true;

    playRequestRef.current++;

    /*
     * Do NOT manually set src + play here.
     *
     * We only change the index.
     * The effect will safely load
     * the new source and play it.
     */

    setCurrentSongIndex(
      index
    );

    setProgress(0);
  };

  // ======================
  // VOLUME
  // ======================

  useEffect(() => {
    if (
      audioRef.current
    ) {
      audioRef.current.volume =
        volume;
    }
  }, [
    volume,
  ]);

  // ======================
  // PROVIDER
  // ======================

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

        audioRef,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

// ======================
// HOOK
// ======================

export function useMusic() {
  const ctx =
    useContext(
      MusicContext
    );

  if (!ctx) {
    throw new Error(
      "useMusic must be used within MusicProvider"
    );
  }

  return ctx;
}