 
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
  // PLAYBACK EVENT STATE
  // ======================

  /*
   * Tracks which song has already
   * received its current song_play.
   *
   * This prevents pause/resume from
   * creating another play.
   */
  const startedSongIdRef =
    useRef<string | null>(null);

  /*
   * Used when Previous rewinds the
   * currently playing song.
   *
   * That is a new replay action even
   * though the audio element never
   * stopped playing.
   */
  const replayRequestedRef =
    useRef(false);

  /*
   * Prevents two overlapping playback
   * starts from recording the same event
   * at the exact same time.
   */
  const startingPlaybackRef =
    useRef(false);

  // ======================
  // ACTUAL LISTENING
  // ======================

  /*
   * Total time the listener has actually
   * heard for the current song lifecycle.
   *
   * This is NOT the same as audio.currentTime.
   *
   * Example:
   *
   * Listen 0 -> 20 sec
   * Seek 20 -> 60 sec
   * Listen 60 -> 70 sec
   *
   * Actual listened time = 30 sec.
   *
   * The skipped 20 -> 60 sec is not counted.
   */
  const actualListenedMsRef =
    useRef(0);

  /*
   * Stores portions of the track that
   * were actually heard.
   *
   * Example:
   *
   * [
   *   { start: 0, end: 20 },
   *   { start: 60, end: 70 }
   * ]
   *
   * This allows retention to determine
   * whether a specific position was
   * actually listened through.
   */
  const listenedRangesRef =
    useRef<
      Array<{
        start: number;
        end: number;
      }>
    >([]);

  /*
   * Last playback position used by
   * the listened-time accumulator.
   *
   * We compare the current audio position
   * against this value and only count
   * normal forward playback.
   */
  const lastPlaybackPositionRef =
    useRef<number | null>(null);

  /*
   * Used to reject large jumps that usually
   * indicate a manual seek rather than
   * genuine playback.
   */
  const MAX_TRACKED_DELTA_SECONDS =
    5;

  /*
   * Resets actual-listening state
   * whenever a new song begins.
   */
  const resetActualListening =
    () => {
      actualListenedMsRef.current =
        0;

      lastPlaybackPositionRef.current =
        null;

      listenedRangesRef.current = [];
    };

  /*
   * Adds a genuinely listened interval
   * to the retention range collection.
   *
   * Small gaps are merged because browser
   * timeupdate events are not perfectly
   * continuous.
   */
  const addListenedRange =
    (
      start: number,
      end: number
    ) => {
      if (
        !Number.isFinite(start) ||
        !Number.isFinite(end) ||
        end <= start
      ) {
        return;
      }

      const RANGE_MERGE_GAP_SECONDS =
        0.5;

      const ranges =
        listenedRangesRef.current;

      let newStart =
        Math.max(0, start);

      let newEnd =
        Math.max(
          newStart,
          end
        );

      const remaining: Array<{
        start: number;
        end: number;
      }> = [];

      ranges.forEach(
        (range) => {
          const overlaps =
            range.end +
              RANGE_MERGE_GAP_SECONDS >=
              newStart &&
            range.start -
              RANGE_MERGE_GAP_SECONDS <=
              newEnd;

          if (overlaps) {
            newStart =
              Math.min(
                newStart,
                range.start
              );

            newEnd =
              Math.max(
                newEnd,
                range.end
              );
          } else {
            remaining.push(
              range
            );
          }
        }
      );

      remaining.push({
        start: newStart,
        end: newEnd,
      });

      remaining.sort(
        (a, b) =>
          a.start - b.start
      );

      listenedRangesRef.current =
        remaining;
    };

  /*
   * Adds only genuine forward playback
   * to actual listened time and records
   * the interval for retention.
   */
  const accumulateActualListening =
    (
      audio: HTMLAudioElement
    ) => {
      if (
        audio.paused ||
        seekingRef.current
      ) {
        return;
      }

      if (
        !Number.isFinite(
          audio.currentTime
        )
      ) {
        return;
      }

      const currentTime =
        audio.currentTime;

      const previousTime =
        lastPlaybackPositionRef.current;

      /*
       * First playback sample.
       */
      if (
        previousTime === null
      ) {
        lastPlaybackPositionRef.current =
          currentTime;

        return;
      }

      const delta =
        currentTime -
        previousTime;

      /*
       * Normal forward playback.
       *
       * Small negative values can happen
       * because of browser timing precision.
       */
      if (
        delta > 0 &&
        delta <=
          MAX_TRACKED_DELTA_SECONDS
      ) {
        actualListenedMsRef.current +=
          delta * 1000;

        addListenedRange(
          previousTime,
          currentTime
        );
      }

      /*
       * Always move the tracking cursor
       * forward to the current audio position.
       *
       * Large jumps are therefore ignored.
       */
      lastPlaybackPositionRef.current =
        currentTime;
    };

  /*
   * Returns true when the listener has
   * actually played through the requested
   * percentage of the song.
   *
   * This is intentionally based on the
   * listened ranges, NOT audio.currentTime.
   */
  const hasActuallyListenedThrough =
    (
      point: number,
      songDuration: number
    ) => {
      if (
        !Number.isFinite(
          songDuration
        ) ||
        songDuration <= 0
      ) {
        return false;
      }

      const targetTime =
        (
          point / 100
        ) *
        songDuration;

      const PLAYBACK_POSITION_TOLERANCE =
        0.15;

      return listenedRangesRef.current.some(
        (range) =>
          range.start <=
            targetTime +
              PLAYBACK_POSITION_TOLERANCE &&
          range.end >=
            targetTime -
              PLAYBACK_POSITION_TOLERANCE
      );
    };

  // ======================
  // RETENTION
  // ======================

  const trackedMilestones =
    useRef<Set<number>>(
      new Set()
    );

  // ======================
  // SEEK REFS
  // ======================

  const lastSeekAt =
    useRef<number | null>(null);

  const seekingRef =
    useRef(false);

  const MIN_PLAY_AFTER_SEEK_MS =
    1200;

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
  // GENERIC EVENT
  // ======================

  const sendEvent = async (
    type:
      | "song_play"
      | "song_end"
      | "song_skip"
      | "song_replay",
    song: Song,
    listenedDurationOverrideMs?: number
  ) => {
    if (!song) {
      return;
    }

    const identity =
      getAnalyticsIdentity();

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
     * Use actual listened time when
     * explicitly supplied.
     *
     * Otherwise preserve the existing
     * current-position behavior for
     * play / skip / replay events.
     */
    const playedDuration =
      listenedDurationOverrideMs ??
      (
        Number.isFinite(
          rawCurrentTime
        ) &&
        rawCurrentTime >= 0
          ? rawCurrentTime
          : 0
      );

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
       * Analytics should NEVER
       * break playback.
       */

      console.error(
        "Analytics event failed:",
        error
      );
    }
  };

  // ======================
  // PROGRESS EVENT
  // ======================

  const sendProgress = async (
    point: number,
    song: Song,
    listenedDurationOverrideMs?: number
  ) => {
    if (!song) return;

    const identity =
      getAnalyticsIdentity();

    if (!identity) return;

    const audio =
      audioRef.current;

    const rawCurrentTime =
      audio?.currentTime ?? 0;

    const rawDuration =
      audio?.duration ??
      song.duration ??
      0;

    /*
     * Retention events now carry the
     * actual amount listened rather than
     * blindly using the playhead position.
     */
    const playedDuration =
      listenedDurationOverrideMs ??
      (
        Number.isFinite(
          rawCurrentTime
        ) &&
        rawCurrentTime >= 0
          ? rawCurrentTime
          : 0
      );

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

        type:
          "song_progress",

        songId:
          song.songId,

        position:
          point,

        playedDuration,

        duration:
          durationValue,

        source:
          "retention",

        deviceType:
          "web",
      });
    } catch (err) {
      console.error(
        "Retention event failed:",
        err
      );
    }
  };

  // ======================
  // RECORD PLAYBACK START
  // ======================

  const recordPlaybackStart =
    async (
      song: Song,
      isReplay = false
    ) => {
      if (!song) {
        return;
      }

      if (
        startingPlaybackRef.current
      ) {
        return;
      }

      /*
       * Normal playback:
       *
       * If this exact song has already
       * started and the user merely paused
       * and resumed, do nothing.
       */
      if (
        !isReplay &&
        startedSongIdRef.current ===
          song.songId
      ) {
        return;
      }

      startingPlaybackRef.current =
        true;

      try {
        /*
         * Every genuine new playback
         * start records song_play.
         */
        await sendEvent(
          "song_play",
          song
        );

        /*
         * A replay is additionally
         * classified as a replay.
         */
        if (isReplay) {
          await sendEvent(
            "song_replay",
            song
          );
        }

        startedSongIdRef.current =
          song.songId;
      } finally {
        startingPlaybackRef.current =
          false;
      }
    };

  // ======================
  // SAFE PLAY
  // ======================

  const safelyPlay = async (
    audio: HTMLAudioElement,
    song: Song
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
       * A newer request replaced this one.
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
       * Only process playback if
       * this request is still current.
       */

      if (
        requestId !==
        playRequestRef.current
      ) {
        return;
      }

      setIsPlaying(true);

      /*
       * Start actual-listening tracking
       * at the exact playback position.
       */
      lastPlaybackPositionRef.current =
        audio.currentTime;

      const isReplay =
        replayRequestedRef.current;

      replayRequestedRef.current =
        false;

      /*
       * The browser successfully started
       * actual playback.
       */
      await recordPlaybackStart(
        song,
        isReplay
      );
    } catch (error: any) {
      /*
       * AbortError is normal when another
       * source/load request replaces this one.
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
     * Stop existing playback before
     * replacing the source.
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
     * Reset actual listening for
     * the newly selected song.
     */
    resetActualListening();

    /*
     * A new song starts a new playback
     * lifecycle.
     */

    if (
      startedSongIdRef.current !==
      song.songId
    ) {
      startedSongIdRef.current =
        null;
    }

    /*
     * Set source once.
     */

    if (
      audio.src !== song.src
    ) {
      audio.src = song.src;
    }

    audio.load();

    if (autoPlay) {
      void safelyPlay(
        audio,
        song
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
     * Reset actual listening whenever
     * the selected song changes.
     */
    resetActualListening();

    /*
     * A changed song gets a fresh
     * playback-event state.
     */

    if (
      startedSongIdRef.current !==
      currentSong.songId
    ) {
      startedSongIdRef.current =
        null;
    }

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
    // SEEK START
    // ----------------------

    const handleSeeking = () => {
      /*
       * Any active playback interval
       * ends when the listener seeks.
       *
       * Reset the playback cursor so the
       * seek jump itself is never counted
       * as listened audio.
       */
      accumulateActualListening(
        audio
      );

      seekingRef.current =
        true;

      lastSeekAt.current =
        Date.now();

      lastPlaybackPositionRef.current =
        null;
    };

    // ----------------------
    // SEEK END
    // ----------------------

    const handleSeeked = () => {
      lastSeekAt.current =
        Date.now();

      seekingRef.current =
        false;

      /*
       * Begin a fresh listened interval
       * from the new position.
       */
      lastPlaybackPositionRef.current =
        audio.currentTime;
    };

    // ----------------------
    // PROGRESS
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

        /*
         * Accumulate only genuine playback
         * time before doing any retention work.
         */
        accumulateActualListening(
          audio
        );

        const percent =
          (
            audio.currentTime /
            audio.duration
          ) * 100;

        const safePercent =
          Math.min(
            100,
            Math.max(
              0,
              percent
            )
          );

        setProgress(
          safePercent
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

        const now =
          Date.now();

        milestones.forEach(
          (point) => {
            if (
              trackedMilestones.current.has(
                point
              )
            ) {
              return;
            }

            /*
             * IMPORTANT:
             *
             * A milestone is now based on
             * an actually listened range.
             *
             * Merely dragging the playhead
             * over the milestone does NOT count.
             */
            if (
              !hasActuallyListenedThrough(
                point,
                audio.duration
              )
            ) {
              return;
            }

            /*
             * Keep the existing short
             * post-seek protection.
             */
            if (
              lastSeekAt.current &&
              now -
                lastSeekAt.current <
                MIN_PLAY_AFTER_SEEK_MS
            ) {
              return;
            }

            trackedMilestones.current.add(
              point
            );

            if (
              currentSong
            ) {
              /*
               * Only send an event when
               * an actual retention milestone
               * has been earned.
               */
              void sendProgress(
                point,
                currentSong,
                Math.floor(
                  actualListenedMsRef.current
                )
              );
            }
          }
        );
      };

    // ----------------------
    // PLAY
    // ----------------------

    const handlePlay =
      () => {
        setIsPlaying(true);

        /*
         * Resume actual-listening tracking
         * from the current audio position.
         */
        lastPlaybackPositionRef.current =
          audio.currentTime;
      };

    // ----------------------
    // PAUSE
    // ----------------------

    const handlePause =
      () => {
        /*
         * Capture the final small interval
         * before the browser pauses.
         */
        accumulateActualListening(
          audio
        );

        lastPlaybackPositionRef.current =
          null;

        /*
         * Record a current retention
         * checkpoint on pause so a short
         * listening session is not lost.
         */
        if (
          currentSong &&
          actualListenedMsRef.current >
            0 &&
          Number.isFinite(
            audio.duration
          ) &&
          audio.duration > 0
        ) {
          const safePercent =
            Math.min(
              100,
              Math.max(
                0,
                (
                  audio.currentTime /
                  audio.duration
                ) * 100
              )
            );

          void sendProgress(
            safePercent,
            currentSong,
            Math.floor(
              actualListenedMsRef.current
            )
          );
        }

        /*
         * A normal user pause should
         * not create another event.
         *
         * Source transitions are also
         * allowed to pause quietly.
         */

        if (
          !shouldPlayRef.current
        ) {
          setIsPlaying(false);
        }
      };

    // ----------------------
    // ENDED
    // ----------------------

    const handleEnded =
      async () => {
        if (
          !currentSong
        ) {
          return;
        }

        /*
         * Capture the final portion
         * of actual playback.
         */
        accumulateActualListening(
          audio
        );

        shouldPlayRef.current =
          false;

        setIsPlaying(false);

        /*
         * song_end now carries the
         * actual amount listened.
         */
        await sendEvent(
          "song_end",
          currentSong,
          Math.floor(
            actualListenedMsRef.current
          )
        );

        /*
         * Clear this song's play state
         * because the next playback is
         * a new song.
         */
        startedSongIdRef.current =
          null;

        resetActualListening();

        if (
          currentSongIndex <
          songs.length - 1
        ) {
          const nextIndex =
            currentSongIndex + 1;

          /*
           * Continue automatically.
           */
          shouldPlayRef.current =
            true;

          setCurrentSongIndex(
            nextIndex
          );

          setProgress(0);
        }
      };

    audio.addEventListener(
      "seeking",
      handleSeeking
    );

    audio.addEventListener(
      "seeked",
      handleSeeked
    );

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

    trackedMilestones.current.clear();

    /*
     * Auto-load the newly selected
     * song and actually start playback.
     *
     * recordPlaybackStart()
     * handles song_play after
     * audio.play() succeeds.
     */

    loadSong(
      currentSong,
      true
    );
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

      /*
       * PAUSE
       */

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

      /*
       * RESUME
       *
       * This does NOT reset startedSongIdRef.
       * Therefore it does not create another
       * song_play.
       */

      shouldPlayRef.current =
        true;

      void safelyPlay(
        audio,
        currentSong
      );
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

      /*
       * Only count an explicit Next as
       * a skip when the current track has
       * actually been playing.
       *
       * We will refine the exact skip
       * threshold later.
       */
      if (
        audioRef.current &&
        !audioRef.current.paused &&
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

      /*
       * New song = fresh playback
       * lifecycle.
       */
      startedSongIdRef.current =
        null;

      replayRequestedRef.current =
        false;

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
  async () => {

    console.log(
      "🔥 HANDLE PREV",
      {
        currentTime: audioRef.current?.currentTime,
        paused: audioRef.current?.paused,
        currentSong: currentSong?.title,
      }
    );

    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    // rest of your function...
      /*
       * If we've already listened
       * beyond 3 seconds,
       * Previous means:
       *
       * "restart this same song"
       *
       * not "skip this song".
       */
      if (
        audio.currentTime > 3
      ) {
        const songToReplay =
          currentSong;

        if (!songToReplay) {
          return;
        }

        audio.currentTime = 0;

        setProgress(0);

        /*
         * If the song is currently playing,
         * this is an immediate replay.
         *
         * Record the replay directly.
         *
         * IMPORTANT:
         * We intentionally do NOT send a
         * new song_play here because the
         * backend has a 30-second song_play
         * cooldown.
         */
        if (
          !audio.paused
        ) {
          replayRequestedRef.current =
            false;

          console.log(
            "🔥 REPLAY BUTTON FIRED",
            songToReplay.songId
          );

          await sendEvent(
            "song_replay",
            songToReplay
          );
        } else {
          /*
           * If paused, remember that the
           * next actual playback is a replay.
           */
          replayRequestedRef.current =
            true;
        }

        return;
      }

      /*
       * Otherwise go to the previous
       * track.
       */

      if (
        currentSongIndex <= 0
      ) {
        return;
      }

      const prevIndex =
        currentSongIndex - 1;

      const wasPlaying =
        !audio.paused;

      startedSongIdRef.current =
        null;

      replayRequestedRef.current =
        false;

      shouldPlayRef.current =
        wasPlaying;

      playRequestRef.current++;

      audio.pause();

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

    /*
     * Capture any genuine playback
     * before changing position.
     */
    accumulateActualListening(
      audio
    );

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

    lastSeekAt.current =
      Date.now();

    lastPlaybackPositionRef.current =
      null;

    setProgress(
      clamped
    );
  };

  // ======================
  // PLAY SPECIFIC SONG
  // ======================

  const playSong =
    (song: Song) => {
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

      /*
       * Selecting a song from the
       * track list starts that song.
       */
      shouldPlayRef.current =
        true;

      startedSongIdRef.current =
        null;

      replayRequestedRef.current =
        false;

      playRequestRef.current++;

      /*
       * If this song is already the
       * currently selected song, the
       * currentSong effect will not run
       * again because the index hasn't
       * changed.
       *
       * Explicitly start playback instead.
       */
      if (
        currentSong?.songId ===
        song.songId
      ) {
        const audio =
          audioRef.current;

        if (!audio) {
          return;
        }

        if (
          audio.paused
        ) {
          void safelyPlay(
            audio,
            song
          );
        }

        return;
      }

      /*
       * Change only the selected song.
       * The effect handles source loading
       * and actual playback.
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
 
