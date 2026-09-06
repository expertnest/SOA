 
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

    let id =
      localStorage.getItem(
        "soa_anonymous_id"
      );

    if (!id) {
      id = crypto.randomUUID();

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
  // ANALYTICS
  // ======================

  const sendEvent = async (
    type:
      | "song_play"
      | "song_end"
      | "song_skip"
      | "song_replay",
    song: Song
  ) => {
    if (
      !anonymousId.current
    ) {
      return;
    }

    try {
      await trackEvent({
        userId:
          anonymousId.current,

        isAnonymous: true,

        type,

        songId:
          song.songId,

        playedDuration:
          audioRef.current
            ?.currentTime ?? 0,

        duration:
          audioRef.current
            ?.duration ??
          song.duration,

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

        milestones.forEach(
          (point) => {
            if (
              percent >= point &&
              !trackedMilestones.current.has(
                point
              )
            ) {
              trackedMilestones.current.add(
                point
              );

              if (
                anonymousId.current &&
                currentSong
              ) {
                void trackEvent({
                  userId:
                    anonymousId.current,

                  isAnonymous: true,

                  type:
                    "song_progress",

                  songId:
                    currentSong.songId,

                  position:
                    point,

                  playedDuration:
                    audio.currentTime,

                  duration:
                    audio.duration,

                  source:
                    "retention",

                  deviceType:
                    "web",
                }).catch(
                  (error) => {
                    console.error(
                      "Retention event failed:",
                      error
                    );
                  }
                );
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

        if (!audioRef.current) return;
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

    void sendEvent(
      "song_play",
      currentSong
    );
  }, [
    currentSong?.songId,
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

      if (progress < 2) {
        void sendEvent("song_play", currentSong);
      } else if (progress > 90) {
        void sendEvent("song_replay", currentSong);
      }
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

      if (audioRef.current && audioRef.current.currentTime > 3) {
        await sendEvent("song_skip", currentSong);
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
      if (
        currentSongIndex <= 0
      ) {
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
      (
        clamped / 100
      ) *
      audio.duration;

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

        audioRef
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
 