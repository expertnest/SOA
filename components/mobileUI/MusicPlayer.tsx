"use client";

import {
  ChevronDown,
  Disc3,
  ListMusic,
  Loader2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Users,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

import Image from "next/image";

import {
  AnimatePresence,
  motion,
  type PanInfo,
} from "framer-motion";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import {
  useMusic,
  type Song,
} from "@/hooks/MusicContext";

// =========================================================
// TYPES
// =========================================================

type LibraryTrack = {
  songId?: string;
  _id?: string;

  title?: string;

  artistId?: string;
  artistName?: string;

  coverImage?: string;

  duration?: number;
  audioUrl?: string;

  genre?: string;

  totalPlays?: number;
  skipRate?: number;
  replayRate?: number;

  projectId?: string | null;
  projectName?: string | null;
  projectType?: string | null;
  projectCoverImage?: string | null;

  trackNumber?: number | null;
};

type LibraryProject = {
  projectKey: string;

  projectId?: string | null;

  name: string;
  type?: string;

  coverImage?: string;

  releaseDate?: number | null;

  tracks: LibraryTrack[];
};

type LibraryArtist = {
  artistId: string;

  name: string;
  slug?: string;

  image?: string;

  projects: LibraryProject[];
  popularTracks: LibraryTrack[];
};

type SheetView =
  | "queue"
  | "library";

// =========================================================
// MOBILE MUSIC PLAYER
// =========================================================
//
// Playback + analytics stay inside MusicContext.
//
// This component only queries project/artist library metadata
// so mobile can browse the same hierarchy as SidebarLibrary:
//
// Artists
//   -> Artist
//      -> Projects newest -> oldest
//         -> Tracks
//
// Clicking a track resolves it back to the canonical Song
// already owned by MusicContext, then calls playSong(song).
//
// No duplicate song_play / song_skip analytics are sent here.
// =========================================================

export default function MusicPlayer() {
  // =======================================================
  // MUSIC CONTEXT
  // =======================================================

  const {
    songs,

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

  // =======================================================
  // LIBRARY DATA
  // =======================================================

  const libraryData =
    useQuery(
      api.projects.getSidebarLibrary
    );

  const artists =
    (libraryData?.artists ??
      []) as LibraryArtist[];

  const trendingTracks =
    (libraryData?.trending ??
      []) as LibraryTrack[];

  // =======================================================
  // LOCAL UI STATE
  // =======================================================

  const [
    showFullScreen,
    setShowFullScreen,
  ] = useState(false);

  const [
    showSheet,
    setShowSheet,
  ] = useState(false);

  const [
    sheetView,
    setSheetView,
  ] =
    useState<SheetView>(
      "library"
    );

  const [
    selectedArtistId,
    setSelectedArtistId,
  ] =
    useState<string | null>(
      null
    );

  const [
    selectedProjectKey,
    setSelectedProjectKey,
  ] =
    useState<string | null>(
      null
    );

  // =======================================================
  // CURRENT DISPLAY SONG
  // =======================================================

  const displaySong =
    currentSong ??
    songs[0] ??
    null;

  const hasSong =
    Boolean(
      displaySong
    );

  const playerImage =
    getSongArtwork(
      displaySong
    );

  const playerTitle =
    displaySong?.title ??
    "Choose a track";

  const playerArtist =
    displaySong
      ?.artistName ??
    displaySong?.artist ??
    "SOA Music";

  // =======================================================
  // SAFE PLAYER VALUES
  // =======================================================

  const safeProgress =
    clampPercent(
      progress
    );

  const safeDuration =
    Number.isFinite(
      duration
    ) &&
    duration > 0
      ? duration
      : displaySong
            ?.duration ??
        0;

  const currentTime =
    safeDuration > 0
      ? (
          safeProgress /
          100
        ) *
        safeDuration
      : 0;

  // =======================================================
  // GLOBAL QUEUE VIEW
  // =======================================================

  const currentSongIndex =
    useMemo(() => {
      if (
        !displaySong ||
        songs.length === 0
      ) {
        return -1;
      }

      const currentId =
        getSongId(
          displaySong
        );

      return songs.findIndex(
        song =>
          getSongId(
            song
          ) ===
          currentId
      );
    }, [
      displaySong,
      songs,
    ]);

  const orderedQueue =
    useMemo(() => {
      if (
        songs.length ===
        0
      ) {
        return [];
      }

      if (
        currentSongIndex <
        0
      ) {
        return songs;
      }

      return [
        ...songs.slice(
          currentSongIndex
        ),

        ...songs.slice(
          0,
          currentSongIndex
        ),
      ];
    }, [
      songs,
      currentSongIndex,
    ]);

  // =======================================================
  // SELECTED ARTIST
  // =======================================================

  const activeArtist =
    useMemo(() => {
      if (
        !selectedArtistId
      ) {
        return null;
      }

      return (
        artists.find(
          artist =>
            artist.artistId.toString() ===
            selectedArtistId
        ) ??
        null
      );
    }, [
      artists,
      selectedArtistId,
    ]);

  // =======================================================
  // ARTIST PROJECTS
  // =======================================================

  /*
   * Same rule as desktop SidebarLibrary:
   *
   * newest release on the left
   * oldest release on the right
   */

  const projects =
    useMemo(() => {
      return [
        ...(
          activeArtist
            ?.projects ??
          []
        ),
      ].sort(
        (
          a,
          b
        ) =>
          (
            b.releaseDate ??
            0
          ) -
          (
            a.releaseDate ??
            0
          )
      );
    }, [
      activeArtist,
    ]);

  // =======================================================
  // SELECTED PROJECT
  // =======================================================

  const activeProject =
    useMemo(() => {
      if (
        !selectedProjectKey
      ) {
        return null;
      }

      return (
        projects.find(
          project =>
            project.projectKey ===
            selectedProjectKey
        ) ??
        null
      );
    }, [
      projects,
      selectedProjectKey,
    ]);

  // =======================================================
  // LIBRARY TRACKS
  // =======================================================

  const displayedLibraryTracks =
    activeProject
      ? activeProject.tracks
      : activeArtist
        ? activeArtist.popularTracks
        : trendingTracks;

  const libraryTitle =
    activeProject
      ? activeProject.name
      : activeArtist
        ? activeArtist.name
        : "Trending";

  const librarySubtitle =
    activeProject
      ? [
          activeArtist?.name ??
            "SOA Music",

          formatProjectType(
            activeProject.type
          ),

          formatReleaseYear(
            activeProject
              .releaseDate
          ),
        ]
          .filter(Boolean)
          .join(" • ")
      : activeArtist
        ? "Popular tracks • choose a project"
        : "Popular across SOA";

  // =======================================================
  // BODY SCROLL LOCK
  // =======================================================

  useEffect(() => {
    if (
      !showFullScreen &&
      !showSheet
    ) {
      return;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    showFullScreen,
    showSheet,
  ]);

  // =======================================================
  // PLAY / PAUSE
  // =======================================================

  const handlePrimaryPlay =
    () => {
      /*
       * Existing current song:
       * pause / resume through MusicContext.
       */

      if (currentSong) {
        togglePlay();

        return;
      }

      /*
       * No current song yet.
       *
       * Only start the first song because
       * the listener explicitly pressed Play.
       */

      if (songs[0]) {
        playSong(
          songs[0]
        );
      }
    };

  // =======================================================
  // GLOBAL QUEUE TRACK CLICK
  // =======================================================

  const handleQueueTrack =
    (
      song: Song
    ) => {
      const selectedId =
        getSongId(
          song
        );

      const currentId =
        getSongId(
          currentSong
        );

      if (
        selectedId &&
        selectedId ===
          currentId
      ) {
        togglePlay();

        return;
      }

      playSong(
        song
      );
    };

  // =======================================================
  // LIBRARY NAVIGATION
  // =======================================================

  const handleArtistSelect =
    (
      artist: LibraryArtist
    ) => {
      setSelectedArtistId(
        artist.artistId.toString()
      );

      /*
       * Same desktop behavior:
       *
       * selecting an artist changes the right-side bubbles
       * into that artist's projects, but does not auto-select
       * the newest release.
       */

      setSelectedProjectKey(
        null
      );
    };

  const handleBackToArtists =
    () => {
      setSelectedArtistId(
        null
      );

      setSelectedProjectKey(
        null
      );
    };

  const handleProjectSelect =
    (
      project: LibraryProject
    ) => {
      setSelectedProjectKey(
        project.projectKey
      );
    };

  // =======================================================
  // LIBRARY TRACK CLICK
  // =======================================================

  const handleLibraryTrack =
    (
      track: LibraryTrack
    ) => {
      const trackId =
        getLibraryTrackId(
          track
        );

      if (!trackId) {
        return;
      }

      /*
       * Resolve the library result back to the canonical
       * Song instance from MusicContext.
       *
       * This matters because MusicContext.playSong()
       * searches its own songs array by songId.
       */

      const canonicalSong =
        songs.find(
          song =>
            getSongId(
              song
            ) ===
            trackId
        );

      if (
        !canonicalSong
      ) {
        console.warn(
          "Library track is not present in MusicContext songs:",
          track
        );

        return;
      }

      if (
        getSongId(
          currentSong
        ) ===
        trackId
      ) {
        togglePlay();

        return;
      }

      playSong(
        canonicalSong
      );
    };

  // =======================================================
  // OPEN SHEET HELPERS
  // =======================================================

  const openQueue =
    () => {
      setSheetView(
        "queue"
      );

      setShowFullScreen(
        false
      );

      setShowSheet(
        true
      );
    };

  const openLibrary =
    () => {
      setSheetView(
        "library"
      );

      setShowFullScreen(
        false
      );

      setShowSheet(
        true
      );
    };

  // =======================================================
  // SEEK
  // =======================================================

  const handleInlineSeek =
    (
      event: ReactMouseEvent<HTMLButtonElement>
    ) => {
      const rect =
        event.currentTarget
          .getBoundingClientRect();

      if (
        rect.width <=
        0
      ) {
        return;
      }

      const percent =
        (
          (
            event.clientX -
            rect.left
          ) /
          rect.width
        ) *
        100;

      seek(
        clampPercent(
          percent
        )
      );
    };

  // =======================================================
  // DRAG DOWN TO CLOSE
  // =======================================================

  const handleDragEnd =
    (
      _event:
        | globalThis.MouseEvent
        | TouchEvent
        | PointerEvent,

      info: PanInfo,

      close:
        () => void
    ) => {
      const draggedFarEnough =
        info.offset.y >
        120;

      const flickedDown =
        info.velocity.y >
        700;

      if (
        draggedFarEnough ||
        flickedDown
      ) {
        close();
      }
    };

  // =======================================================
  // EMPTY CATALOG
  // =======================================================

  if (
    !hasSong &&
    songs.length === 0
  ) {
    return null;
  }

  // =======================================================
  // UI
  // =======================================================

  return (
    <>
      {/* ===================================================
          MINI MOBILE PLAYER
      =================================================== */}

      <div
        className="
          fixed
          inset-x-0
          bottom-0
          z-40
          border-t
          border-white/[0.09]
          bg-[#12141a]/96
          text-white
          shadow-[0_-18px_45px_rgba(0,0,0,0.32)]
          backdrop-blur-2xl
          lg:hidden
        "
      >
        <div
          className="
            flex
            min-h-[68px]
            items-center
            gap-2
            px-2.5
            pt-2
            pb-[calc(0.5rem+env(safe-area-inset-bottom))]
            sm:px-4
          "
        >
          {/* SONG INFO */}

          <button
            type="button"
            onClick={() =>
              setShowFullScreen(
                true
              )
            }
            disabled={
              !displaySong
            }
            className="
              group
              flex
              min-w-0
              flex-1
              items-center
              gap-2.5
              rounded-xl
              text-left
              transition
              hover:bg-white/[0.035]
              disabled:cursor-default
            "
            aria-label="Open full player"
          >
            <div
              className="
                relative
                h-11
                w-11
                shrink-0
                overflow-hidden
                rounded-xl
                border
                border-white/[0.10]
                bg-[#191c23]
                shadow-[0_8px_20px_rgba(0,0,0,0.28)]
              "
            >
              <Image
                src={
                  playerImage
                }
                alt={
                  playerTitle
                }
                fill
                sizes="44px"
                className="object-cover"
                unoptimized
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/25
                  via-transparent
                  to-white/[0.02]
                "
              />

              {isPlaying && (
                <div
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    h-[2px]
                    bg-gradient-to-r
                    from-blue-400
                    via-violet-400
                    to-purple-400
                  "
                />
              )}
            </div>

            <div
              className="
                min-w-0
                flex-1
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <p
                  className="
                    truncate
                    text-[12px]
                    font-semibold
                    tracking-tight
                    text-white/90
                    sm:text-[13px]
                  "
                >
                  {playerTitle}
                </p>

                {isPlaying && (
                  <NowPlayingBars
                    active
                    compact
                  />
                )}
              </div>

              <p
                className="
                  mt-0.5
                  truncate
                  text-[9px]
                  text-white/38
                  sm:text-[10px]
                "
              >
                {playerArtist}
              </p>
            </div>
          </button>

          {/* CONTROLS */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-0.5
              sm:gap-1
            "
          >
            <IconButton
              label="Previous track"
              disabled={
                !hasSong
              }
              onClick={() => {
                void handlePrev();
              }}
            >
              <SkipBack
                size={17}
                fill="currentColor"
              />
            </IconButton>

            <button
              type="button"
              onClick={
                handlePrimaryPlay
              }
              disabled={
                !hasSong
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white
                text-black
                shadow-[0_8px_22px_rgba(0,0,0,0.30)]
                transition
                hover:scale-[1.04]
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
              aria-label={
                isPlaying
                  ? "Pause"
                  : "Play"
              }
            >
              {isPlaying ? (
                <Pause
                  size={17}
                  fill="currentColor"
                />
              ) : (
                <Play
                  size={17}
                  fill="currentColor"
                  className="ml-0.5"
                />
              )}
            </button>

            <IconButton
              label="Next track"
              disabled={
                !hasSong
              }
              onClick={() => {
                void handleNext();
              }}
            >
              <SkipForward
                size={17}
                fill="currentColor"
              />
            </IconButton>

            <button
              type="button"
              onClick={
                openLibrary
              }
              className="
                ml-0.5
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                text-violet-200/55
                transition
                hover:bg-violet-500/[0.08]
                hover:text-violet-100
              "
              aria-label="Open music library"
            >
              <ListMusic
                size={17}
              />
            </button>
          </div>
        </div>

        {/* MINI PROGRESS */}

        <button
          type="button"
          onClick={
            handleInlineSeek
          }
          disabled={
            !hasSong
          }
          className="
            group
            relative
            block
            h-1
            w-full
            bg-white/[0.06]
            disabled:cursor-default
          "
          aria-label="Seek through track"
        >
          <span
            className="
              absolute
              inset-y-0
              left-0
              rounded-r-full
              bg-gradient-to-r
              from-blue-400
              via-violet-400
              to-purple-400
              shadow-[0_0_8px_rgba(139,92,246,0.30)]
            "
            style={{
              width:
                `${safeProgress}%`,
            }}
          />
        </button>
      </div>

      {/* ===================================================
          FULL SCREEN PLAYER
      =================================================== */}

      <AnimatePresence>
        {showFullScreen && (
          <motion.div
            key="full-mobile-player"
            initial={{
              y: "100%",
            }}
            animate={{
              y: 0,
            }}
            exit={{
              y: "100%",
            }}
            transition={{
              type: "tween",
              duration: 0.3,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            drag="y"
            dragConstraints={{
              top: 0,
              bottom: 0,
            }}
            dragElastic={
              0.2
            }
            onDragEnd={(
              event,
              info
            ) =>
              handleDragEnd(
                event,
                info,
                () =>
                  setShowFullScreen(
                    false
                  )
              )
            }
            className="
              fixed
              inset-0
              z-[80]
              flex
              flex-col
              overflow-hidden
              bg-[#0f1116]
              text-white
              lg:hidden
            "
          >
            {/* BACKGROUND */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                overflow-hidden
              "
            >
              <div
                className="
                  absolute
                  inset-0
                  scale-110
                  opacity-[0.10]
                  blur-[44px]
                "
              >
                <Image
                  src={
                    playerImage
                  }
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-b
                  from-[#151822]/82
                  via-[#101217]/95
                  to-[#0d0f13]
                "
              />

              <div
                className="
                  absolute
                  -left-28
                  top-[16%]
                  h-72
                  w-72
                  rounded-full
                  bg-blue-600/[0.07]
                  blur-[110px]
                "
              />

              <div
                className="
                  absolute
                  -right-28
                  top-[42%]
                  h-80
                  w-80
                  rounded-full
                  bg-violet-600/[0.08]
                  blur-[120px]
                "
              />
            </div>

            {/* HEADER */}

            <div
              className="
                relative
                z-10
                shrink-0
                px-4
                pt-[calc(0.75rem+env(safe-area-inset-top))]
              "
            >
              <div
                className="
                  mx-auto
                  mb-3
                  h-1
                  w-11
                  rounded-full
                  bg-white/20
                "
              />

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowFullScreen(
                      false
                    )
                  }
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/[0.06]
                    bg-white/[0.035]
                    text-white/55
                    backdrop-blur-xl
                    transition
                    hover:bg-white/[0.07]
                    hover:text-white
                  "
                  aria-label="Close player"
                >
                  <ChevronDown
                    size={19}
                  />
                </button>

                <div
                  className="
                    min-w-0
                    flex-1
                    text-center
                  "
                >
                  <p
                    className="
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-violet-200/38
                    "
                  >
                    Now Playing
                  </p>

                  <p
                    className="
                      mt-0.5
                      truncate
                      text-[10px]
                      text-white/35
                    "
                  >
                    SOA Music
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    openLibrary
                  }
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-violet-400/10
                    bg-violet-500/[0.045]
                    text-violet-200/60
                    backdrop-blur-xl
                    transition
                    hover:bg-violet-500/[0.09]
                    hover:text-violet-100
                  "
                  aria-label="Open library"
                >
                  <ListMusic
                    size={18}
                  />
                </button>
              </div>
            </div>

            {/* CONTENT */}

            <div
              className="
                relative
                z-10
                flex
                min-h-0
                flex-1
                flex-col
                justify-center
                overflow-y-auto
                px-6
                pb-[calc(1.75rem+env(safe-area-inset-bottom))]
                pt-4
              "
            >
              {/* ARTWORK */}

              <div
                className="
                  mx-auto
                  aspect-square
                  w-full
                  max-w-[370px]
                "
              >
                <div
                  className="
                    relative
                    h-full
                    w-full
                  "
                >
                  {displaySong && (
                    <div
                      className="
                        absolute
                        inset-8
                        rounded-[40px]
                        bg-gradient-to-br
                        from-blue-500/20
                        via-violet-500/18
                        to-purple-500/20
                        blur-[42px]
                      "
                    />
                  )}

                  <div
                    className="
                      relative
                      h-full
                      w-full
                      overflow-hidden
                      rounded-[28px]
                      border
                      border-white/[0.10]
                      bg-[#191c23]
                      shadow-[0_30px_80px_rgba(0,0,0,0.48)]
                    "
                  >
                    <Image
                      src={
                        playerImage
                      }
                      alt={
                        playerTitle
                      }
                      fill
                      sizes="min(92vw, 370px)"
                      className="object-cover"
                      unoptimized
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/30
                        via-transparent
                        to-white/[0.025]
                      "
                    />

                    <div
                      className="
                        absolute
                        left-3
                        top-3
                      "
                    >
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          border
                          border-white/[0.10]
                          bg-black/50
                          px-2.5
                          py-1
                          text-[8px]
                          font-medium
                          uppercase
                          tracking-[0.13em]
                          text-white/65
                          backdrop-blur-xl
                        "
                      >
                        <span
                          className={`
                            h-1.5
                            w-1.5
                            rounded-full

                            ${
                              isPlaying
                                ? "bg-violet-300 shadow-[0_0_8px_rgba(196,181,253,0.75)]"
                                : "bg-white/25"
                            }
                          `}
                        />

                        {isPlaying
                          ? "Playing"
                          : "Ready"}
                      </span>
                    </div>

                    <div
                      className="
                        absolute
                        right-3
                        top-3
                      "
                    >
                      <span
                        className="
                          rounded-full
                          border
                          border-white/[0.10]
                          bg-black/50
                          px-2.5
                          py-1
                          text-[8px]
                          font-medium
                          tracking-[0.14em]
                          text-white/42
                          backdrop-blur-xl
                        "
                      >
                        SOA
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TRACK INFO */}

              <div
                className="
                  mx-auto
                  mt-6
                  flex
                  w-full
                  max-w-[420px]
                  items-end
                  justify-between
                  gap-4
                "
              >
                <div
                  className="
                    min-w-0
                    flex-1
                  "
                >
                  <h2
                    className="
                      truncate
                      text-[22px]
                      font-semibold
                      tracking-tight
                      text-white
                      sm:text-[26px]
                    "
                  >
                    {playerTitle}
                  </h2>

                  <p
                    className="
                      mt-1
                      truncate
                      text-[13px]
                      text-white/42
                      sm:text-[14px]
                    "
                  >
                    {playerArtist}
                  </p>
                </div>

                <NowPlayingBars
                  active={
                    isPlaying
                  }
                />
              </div>

              {/* PROGRESS */}

              <div
                className="
                  mx-auto
                  mt-5
                  w-full
                  max-w-[420px]
                "
              >
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.1}
                  value={
                    safeProgress
                  }
                  onChange={
                    event =>
                      seek(
                        clampPercent(
                          Number(
                            event.target.value
                          )
                        )
                      )
                  }
                  className="
                    h-1
                    w-full
                    cursor-pointer
                    appearance-none
                    rounded-full
                    bg-white/[0.10]
                    accent-violet-300
                  "
                  aria-label="Seek through track"
                />

                <div
                  className="
                    mt-1.5
                    flex
                    items-center
                    justify-between
                    text-[9px]
                    tabular-nums
                    text-white/28
                  "
                >
                  <span>
                    {formatTime(
                      currentTime
                    )}
                  </span>

                  <span>
                    {formatTime(
                      safeDuration
                    )}
                  </span>
                </div>
              </div>

              {/* PLAYER CONTROLS */}

              <div
                className="
                  mx-auto
                  mt-6
                  flex
                  w-full
                  max-w-[320px]
                  items-center
                  justify-between
                "
              >
                <button
                  type="button"
                  onClick={() => {
                    void handlePrev();
                  }}
                  disabled={
                    !hasSong
                  }
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    text-white/55
                    transition
                    hover:bg-white/[0.055]
                    hover:text-white
                    active:scale-95
                    disabled:opacity-25
                  "
                  aria-label="Previous track"
                >
                  <SkipBack
                    size={25}
                    fill="currentColor"
                  />
                </button>

                <button
                  type="button"
                  onClick={
                    handlePrimaryPlay
                  }
                  disabled={
                    !hasSong
                  }
                  className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-black
                    shadow-[0_16px_35px_rgba(0,0,0,0.34)]
                    transition
                    hover:scale-[1.04]
                    active:scale-95
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                  aria-label={
                    isPlaying
                      ? "Pause"
                      : "Play"
                  }
                >
                  {isPlaying ? (
                    <Pause
                      size={26}
                      fill="currentColor"
                    />
                  ) : (
                    <Play
                      size={26}
                      fill="currentColor"
                      className="ml-1"
                    />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    void handleNext();
                  }}
                  disabled={
                    !hasSong
                  }
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    text-white/55
                    transition
                    hover:bg-white/[0.055]
                    hover:text-white
                    active:scale-95
                    disabled:opacity-25
                  "
                  aria-label="Next track"
                >
                  <SkipForward
                    size={25}
                    fill="currentColor"
                  />
                </button>
              </div>

              {/* PLAYER SHORTCUTS */}

              <div
                className="
                  mx-auto
                  mt-7
                  grid
                  w-full
                  max-w-[420px]
                  grid-cols-2
                  gap-2.5
                "
              >
                <button
                  type="button"
                  onClick={
                    openLibrary
                  }
                  className="
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-white/[0.025]
                    p-3
                    text-left
                    transition
                    hover:border-violet-400/15
                    hover:bg-violet-500/[0.045]
                  "
                >
                  <span
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-violet-500/[0.08]
                      text-violet-200/65
                    "
                  >
                    <Users
                      size={17}
                    />
                  </span>

                  <span
                    className="
                      mt-3
                      block
                      text-[11px]
                      font-semibold
                      text-white/78
                    "
                  >
                    Browse Library
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      text-[9px]
                      leading-4
                      text-white/30
                    "
                  >
                    Artists, projects and releases
                  </span>
                </button>

                <button
                  type="button"
                  onClick={
                    openQueue
                  }
                  className="
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-white/[0.025]
                    p-3
                    text-left
                    transition
                    hover:border-violet-400/15
                    hover:bg-violet-500/[0.045]
                  "
                >
                  <span
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-500/[0.07]
                      text-blue-200/60
                    "
                  >
                    <ListMusic
                      size={17}
                    />
                  </span>

                  <span
                    className="
                      mt-3
                      block
                      text-[11px]
                      font-semibold
                      text-white/78
                    "
                  >
                    Up Next
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      text-[9px]
                      leading-4
                      text-white/30
                    "
                  >
                    Current MusicContext order
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================
          LIBRARY / QUEUE SHEET
      =================================================== */}

      <AnimatePresence>
        {showSheet && (
          <motion.div
            key="mobile-library-sheet"
            initial={{
              y: "100%",
            }}
            animate={{
              y: 0,
            }}
            exit={{
              y: "100%",
            }}
            transition={{
              type: "tween",
              duration: 0.3,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            drag="y"
            dragConstraints={{
              top: 0,
              bottom: 0,
            }}
            dragElastic={
              0.2
            }
            onDragEnd={(
              event,
              info
            ) =>
              handleDragEnd(
                event,
                info,
                () =>
                  setShowSheet(
                    false
                  )
              )
            }
            className="
              fixed
              inset-0
              z-[90]
              flex
              flex-col
              overflow-hidden
              bg-[#101217]
              text-white
              lg:hidden
            "
          >
            {/* BACKGROUND */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                overflow-hidden
              "
            >
              <div
                className="
                  absolute
                  -left-24
                  top-20
                  h-64
                  w-64
                  rounded-full
                  bg-blue-600/[0.055]
                  blur-[100px]
                "
              />

              <div
                className="
                  absolute
                  -right-28
                  top-[40%]
                  h-72
                  w-72
                  rounded-full
                  bg-violet-600/[0.07]
                  blur-[115px]
                "
              />
            </div>

            {/* HEADER */}

            <div
              className="
                relative
                z-10
                shrink-0
                border-b
                border-white/[0.07]
                bg-[#101217]/92
                px-4
                pb-3
                pt-[calc(0.65rem+env(safe-area-inset-top))]
                backdrop-blur-2xl
              "
            >
              <div
                className="
                  mx-auto
                  mb-3
                  h-1
                  w-11
                  rounded-full
                  bg-white/20
                "
              />

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <div
                  className="
                    min-w-0
                  "
                >
                  <p
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-violet-200/42
                    "
                  >
                    SOA Music
                  </p>

                  <h2
                    className="
                      mt-1
                      text-[20px]
                      font-semibold
                      tracking-tight
                      text-white/92
                    "
                  >
                    {sheetView ===
                    "library"
                      ? "Library"
                      : "Up Next"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowSheet(
                      false
                    )
                  }
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/[0.07]
                    bg-white/[0.035]
                    text-white/50
                    transition
                    hover:bg-white/[0.07]
                    hover:text-white
                  "
                  aria-label="Close"
                >
                  <X
                    size={18}
                  />
                </button>
              </div>

              {/* VIEW SWITCHER */}

              <div
                className="
                  mt-3
                  grid
                  grid-cols-2
                  rounded-xl
                  border
                  border-white/[0.06]
                  bg-black/15
                  p-1
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setSheetView(
                      "library"
                    )
                  }
                  className={`
                    rounded-lg
                    px-3
                    py-2
                    text-[10px]
                    font-semibold
                    transition

                    ${
                      sheetView ===
                      "library"
                        ? "bg-violet-500/[0.11] text-violet-100"
                        : "text-white/35 hover:text-white/65"
                    }
                  `}
                >
                  Library
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSheetView(
                      "queue"
                    )
                  }
                  className={`
                    rounded-lg
                    px-3
                    py-2
                    text-[10px]
                    font-semibold
                    transition

                    ${
                      sheetView ===
                      "queue"
                        ? "bg-blue-500/[0.09] text-blue-100"
                        : "text-white/35 hover:text-white/65"
                    }
                  `}
                >
                  Up Next
                </button>
              </div>
            </div>

            {/* ===============================================
                LIBRARY VIEW
            =============================================== */}

            {sheetView ===
            "library" ? (
              <div
                className="
                  relative
                  z-10
                  flex
                  min-h-0
                  flex-1
                  flex-col
                "
              >
                {libraryData ===
                undefined ? (
                  <div
                    className="
                      flex
                      min-h-0
                      flex-1
                      items-center
                      justify-center
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-white/[0.07]
                        bg-white/[0.025]
                        px-4
                        py-3
                      "
                    >
                      <Loader2
                        size={15}
                        className="animate-spin text-violet-200/45"
                      />

                      <span
                        className="
                          text-[10px]
                          text-white/35
                        "
                      >
                        Loading library
                      </span>
                    </div>
                  </div>
                ) : artists.length ===
                    0 &&
                  trendingTracks.length ===
                    0 ? (
                  <div
                    className="
                      flex
                      min-h-0
                      flex-1
                      items-center
                      justify-center
                      px-8
                      text-center
                    "
                  >
                    <p
                      className="
                        text-[11px]
                        leading-5
                        text-white/35
                      "
                    >
                      No published music is available yet.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* ARTISTS / PROJECTS NAV */}

                    <div
                      className="
                        shrink-0
                        border-b
                        border-white/[0.06]
                        bg-[#101217]/92
                        px-3
                        pt-3
                        backdrop-blur-xl
                      "
                    >
                      <div
                        className="
                          flex
                          min-w-0
                          items-start
                          gap-3
                        "
                      >
                        {/* PERMANENT ARTISTS HOME */}

                        <div
                          className="
                            shrink-0
                            border-r
                            border-white/[0.07]
                            pr-3
                          "
                        >
                          <MobileCircleButton
                            label="Artists"
                            image="/assets/soalogo.png"
                            active={
                              !activeArtist
                            }
                            icon={
                              <Users
                                size={17}
                              />
                            }
                            onClick={
                              handleBackToArtists
                            }
                          />
                        </div>

                        {/* ONLY THIS SIDE SCROLLS */}

                        <div
                          className="
                            min-w-0
                            flex-1
                            overflow-x-auto
                            pb-3
                            [scrollbar-width:none]
                            [&::-webkit-scrollbar]:hidden
                          "
                        >
                          <div
                            className="
                              flex
                              w-max
                              gap-3
                            "
                          >
                            {/* ARTIST HOME */}

                            {!activeArtist &&
                              artists.map(
                                artist => (
                                  <MobileCircleButton
                                    key={
                                      artist.artistId.toString()
                                    }
                                    label={
                                      artist.name
                                    }
                                    image={
                                      artist.image ||
                                      "/assets/soalogo.png"
                                    }
                                    active={
                                      false
                                    }
                                    onClick={() =>
                                      handleArtistSelect(
                                        artist
                                      )
                                    }
                                  />
                                )
                              )}

                            {/* ARTIST PROJECTS */}

                            {activeArtist &&
                              projects.map(
                                project => (
                                  <MobileCircleButton
                                    key={
                                      project.projectKey
                                    }
                                    label={
                                      project.name
                                    }
                                    image={
                                      project.coverImage ||
                                      activeArtist.image ||
                                      "/assets/soalogo.png"
                                    }
                                    active={
                                      activeProject?.projectKey ===
                                      project.projectKey
                                    }
                                    icon={
                                      project.type ===
                                      "single" ? (
                                        <Disc3
                                          size={15}
                                        />
                                      ) : undefined
                                    }
                                    onClick={() =>
                                      handleProjectSelect(
                                        project
                                      )
                                    }
                                  />
                                )
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CURRENT LIBRARY CONTEXT */}

                    <div
                      className="
                        shrink-0
                        border-b
                        border-white/[0.06]
                        bg-[#101217]/86
                        px-4
                        py-3
                        backdrop-blur-xl
                      "
                    >
                      <div
                        className="
                          flex
                          items-end
                          justify-between
                          gap-3
                        "
                      >
                        <div
                          className="
                            min-w-0
                          "
                        >
                          <p
                            className="
                              truncate
                              text-[13px]
                              font-semibold
                              text-white/86
                            "
                          >
                            {libraryTitle}
                          </p>

                          <p
                            className="
                              mt-1
                              truncate
                              text-[8px]
                              uppercase
                              tracking-[0.11em]
                              text-white/28
                            "
                          >
                            {librarySubtitle}
                          </p>
                        </div>

                        {activeArtist && (
                          <button
                            type="button"
                            onClick={
                              handleBackToArtists
                            }
                            className="
                              shrink-0
                              text-[9px]
                              font-medium
                              text-violet-200/48
                              transition
                              hover:text-violet-100
                            "
                          >
                            All artists
                          </button>
                        )}
                      </div>
                    </div>

                    {/* LIBRARY TRACKS */}

                    <div
                      className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        overscroll-contain
                        px-3
                        pb-[calc(1rem+env(safe-area-inset-bottom))]
                        pt-2
                        [scrollbar-color:rgba(255,255,255,0.12)_transparent]
                        [scrollbar-width:thin]
                      "
                    >
                      {displayedLibraryTracks.length ===
                      0 ? (
                        <div
                          className="
                            flex
                            min-h-[160px]
                            items-center
                            justify-center
                            px-6
                            text-center
                          "
                        >
                          <p
                            className="
                              text-[10px]
                              leading-5
                              text-white/30
                            "
                          >
                            {activeArtist
                              ? "Choose one of this artist's projects above."
                              : "No tracks available."}
                          </p>
                        </div>
                      ) : (
                        <div
                          className="
                            space-y-1
                          "
                        >
                          {displayedLibraryTracks.map(
                            (
                              track,
                              index
                            ) => {
                              const trackId =
                                getLibraryTrackId(
                                  track
                                );

                              const current =
                                trackId &&
                                getSongId(
                                  currentSong
                                ) ===
                                  trackId;

                              const playing =
                                Boolean(
                                  current &&
                                    isPlaying
                                );

                              const canonicalExists =
                                Boolean(
                                  songs.find(
                                    song =>
                                      getSongId(
                                        song
                                      ) ===
                                      trackId
                                  )
                                );

                              return (
                                <button
                                  key={
                                    trackId ||
                                    `${track.artistName ?? "artist"}-${track.title ?? "track"}-${index}`
                                  }
                                  type="button"
                                  onClick={() =>
                                    handleLibraryTrack(
                                      track
                                    )
                                  }
                                  disabled={
                                    !canonicalExists
                                  }
                                  className={`
                                    group
                                    flex
                                    w-full
                                    min-w-0
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    px-2.5
                                    py-2.5
                                    text-left
                                    transition
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40

                                    ${
                                      current
                                        ? "border-violet-400/12 bg-violet-500/[0.07]"
                                        : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.035]"
                                    }
                                  `}
                                >
                                  <div
                                    className="
                                      relative
                                      h-12
                                      w-12
                                      shrink-0
                                      overflow-hidden
                                      rounded-xl
                                      border
                                      border-white/[0.08]
                                      bg-[#191c23]
                                    "
                                  >
                                    <Image
                                      src={
                                        getLibraryArtwork(
                                          track
                                        )
                                      }
                                      alt={
                                        track.title ||
                                        "Track"
                                      }
                                      fill
                                      sizes="48px"
                                      className="object-cover"
                                      unoptimized
                                    />

                                    <div
                                      className={`
                                        absolute
                                        inset-0
                                        flex
                                        items-center
                                        justify-center
                                        bg-black/45
                                        transition

                                        ${
                                          current
                                            ? "opacity-100"
                                            : "opacity-0 group-hover:opacity-100"
                                        }
                                      `}
                                    >
                                      {playing ? (
                                        <Pause
                                          size={15}
                                          fill="currentColor"
                                        />
                                      ) : (
                                        <Play
                                          size={15}
                                          fill="currentColor"
                                          className="ml-0.5"
                                        />
                                      )}
                                    </div>
                                  </div>

                                  <div
                                    className="
                                      min-w-0
                                      flex-1
                                    "
                                  >
                                    <div
                                      className="
                                        flex
                                        items-center
                                        gap-2
                                      "
                                    >
                                      <p
                                        className={`
                                          truncate
                                          text-[12px]
                                          font-semibold
                                          transition

                                          ${
                                            current
                                              ? "text-violet-100"
                                              : "text-white/78 group-hover:text-white"
                                          }
                                        `}
                                      >
                                        {track.title ||
                                          "Untitled"}
                                      </p>

                                      {current && (
                                        <span
                                          className="
                                            shrink-0
                                            rounded-full
                                            bg-violet-500/[0.10]
                                            px-1.5
                                            py-0.5
                                            text-[7px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.12em]
                                            text-violet-200/70
                                          "
                                        >
                                          Playing
                                        </span>
                                      )}
                                    </div>

                                    <p
                                      className="
                                        mt-1
                                        truncate
                                        text-[9px]
                                        text-white/30
                                      "
                                    >
                                      {activeProject
                                        ? `${track.trackNumber ?? index + 1}. ${track.artistName || "SOA Artist"}`
                                        : track.projectName
                                          ? `${track.artistName || "SOA Artist"} • ${track.projectName}`
                                          : track.artistName || "SOA Artist"}
                                    </p>
                                  </div>

                                  <span
                                    className="
                                      shrink-0
                                      pr-1
                                      text-[9px]
                                      tabular-nums
                                      text-white/20
                                    "
                                  >
                                    {track.duration
                                      ? formatTime(
                                          track.duration
                                        )
                                      : current
                                        ? "NOW"
                                        : ""}
                                  </span>
                                </button>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* =============================================
                 UP NEXT VIEW
              ============================================= */

              <div
                className="
                  relative
                  z-10
                  flex
                  min-h-0
                  flex-1
                  flex-col
                "
              >
                {/* NOW PLAYING CARD */}

                {displaySong && (
                  <div
                    className="
                      shrink-0
                      px-3
                      pt-3
                    "
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setShowSheet(
                          false
                        );

                        setShowFullScreen(
                          true
                        );
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        border-violet-400/10
                        bg-gradient-to-r
                        from-violet-500/[0.075]
                        to-blue-500/[0.035]
                        p-2.5
                        text-left
                        shadow-[0_12px_32px_rgba(0,0,0,0.18)]
                        transition
                        hover:border-violet-400/20
                      "
                    >
                      <div
                        className="
                          relative
                          h-14
                          w-14
                          shrink-0
                          overflow-hidden
                          rounded-xl
                          border
                          border-white/[0.10]
                          bg-[#191c23]
                        "
                      >
                        <Image
                          src={
                            playerImage
                          }
                          alt={
                            playerTitle
                          }
                          fill
                          sizes="56px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >
                        <p
                          className="
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-[0.14em]
                            text-violet-200/48
                          "
                        >
                          Now Playing
                        </p>

                        <p
                          className="
                            mt-1
                            truncate
                            text-[12px]
                            font-semibold
                            text-white/88
                          "
                        >
                          {playerTitle}
                        </p>

                        <p
                          className="
                            mt-0.5
                            truncate
                            text-[9px]
                            text-white/35
                          "
                        >
                          {playerArtist}
                        </p>
                      </div>

                      <NowPlayingBars
                        active={
                          isPlaying
                        }
                      />
                    </button>
                  </div>
                )}

                {/* QUEUE LIST */}

                <div
                  className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    overscroll-contain
                    px-3
                    pb-[calc(1rem+env(safe-area-inset-bottom))]
                    pt-3
                    [scrollbar-color:rgba(255,255,255,0.12)_transparent]
                    [scrollbar-width:thin]
                  "
                >
                  <div
                    className="
                      mb-2
                      flex
                      items-center
                      justify-between
                      px-1
                    "
                  >
                    <p
                      className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.15em]
                        text-white/28
                      "
                    >
                      Playback order
                    </p>

                    <p
                      className="
                        text-[9px]
                        tabular-nums
                        text-white/22
                      "
                    >
                      {songs.length}{" "}
                      {songs.length ===
                      1
                        ? "track"
                        : "tracks"}
                    </p>
                  </div>

                  <div
                    className="
                      space-y-1
                    "
                  >
                    {orderedQueue.map(
                      (
                        song,
                        index
                      ) => {
                        const current =
                          getSongId(
                            currentSong
                          ) ===
                          getSongId(
                            song
                          );

                        const isNext =
                          currentSongIndex >=
                          0
                            ? !current &&
                              index ===
                                1
                            : index ===
                              0;

                        return (
                          <button
                            key={
                              getSongId(
                                song
                              ) ||
                              `${song.title}-${index}`
                            }
                            type="button"
                            onClick={() =>
                              handleQueueTrack(
                                song
                              )
                            }
                            className={`
                              group
                              flex
                              w-full
                              items-center
                              gap-3
                              rounded-xl
                              border
                              px-2.5
                              py-2.5
                              text-left
                              transition

                              ${
                                current
                                  ? "border-violet-400/15 bg-violet-500/[0.07]"
                                  : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.035]"
                              }
                            `}
                          >
                            <div
                              className="
                                relative
                                h-12
                                w-12
                                shrink-0
                                overflow-hidden
                                rounded-xl
                                border
                                border-white/[0.08]
                                bg-[#191c23]
                              "
                            >
                              <Image
                                src={
                                  getSongArtwork(
                                    song
                                  )
                                }
                                alt={
                                  song.title
                                }
                                fill
                                sizes="48px"
                                className="object-cover"
                                unoptimized
                              />

                              <div
                                className={`
                                  absolute
                                  inset-0
                                  flex
                                  items-center
                                  justify-center
                                  bg-black/45
                                  transition

                                  ${
                                    current
                                      ? "opacity-100"
                                      : "opacity-0 group-hover:opacity-100"
                                  }
                                `}
                              >
                                {current &&
                                isPlaying ? (
                                  <Pause
                                    size={15}
                                    fill="currentColor"
                                  />
                                ) : (
                                  <Play
                                    size={15}
                                    fill="currentColor"
                                    className="ml-0.5"
                                  />
                                )}
                              </div>
                            </div>

                            <div
                              className="
                                min-w-0
                                flex-1
                              "
                            >
                              <div
                                className="
                                  flex
                                  items-center
                                  gap-2
                                "
                              >
                                <p
                                  className={`
                                    truncate
                                    text-[12px]
                                    font-semibold

                                    ${
                                      current
                                        ? "text-violet-100"
                                        : "text-white/78"
                                    }
                                  `}
                                >
                                  {song.title}
                                </p>

                                {current && (
                                  <span
                                    className="
                                      shrink-0
                                      rounded-full
                                      bg-violet-500/[0.10]
                                      px-1.5
                                      py-0.5
                                      text-[7px]
                                      font-semibold
                                      uppercase
                                      tracking-[0.12em]
                                      text-violet-200/70
                                    "
                                  >
                                    Playing
                                  </span>
                                )}

                                {isNext && (
                                  <span
                                    className="
                                      shrink-0
                                      rounded-full
                                      bg-white/[0.045]
                                      px-1.5
                                      py-0.5
                                      text-[7px]
                                      font-semibold
                                      uppercase
                                      tracking-[0.12em]
                                      text-white/35
                                    "
                                  >
                                    Next
                                  </span>
                                )}
                              </div>

                              <p
                                className="
                                  mt-1
                                  truncate
                                  text-[9px]
                                  text-white/32
                                "
                              >
                                {song.artistName ??
                                  song.artist ??
                                  "SOA Artist"}
                              </p>
                            </div>

                            <span
                              className="
                                shrink-0
                                pr-1
                                text-[9px]
                                tabular-nums
                                text-white/20
                              "
                            >
                              {current
                                ? "NOW"
                                : String(
                                    index
                                  ).padStart(
                                    2,
                                    "0"
                                  )}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// =========================================================
// MOBILE CIRCLE BUTTON
// =========================================================

function MobileCircleButton({
  label,
  image,
  active,
  icon,
  onClick,
}: {
  label: string;

  image: string;

  active: boolean;

  icon?: React.ReactNode;

  onClick:
    () => void;
}) {
  const isArtistsButton =
    label ===
    "Artists";

  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="
        group
        w-[66px]
        shrink-0
        text-center
      "
      title={
        label
      }
    >
      <div
        className={`
          relative
          mx-auto
          flex
          h-14
          w-14
          items-center
          justify-center
          overflow-hidden
          rounded-full
          border
          bg-[#191c23]
          shadow-[0_8px_22px_rgba(0,0,0,0.18)]
          transition
          duration-200

          ${
            active
              ? "border-violet-400/45 ring-2 ring-violet-500/[0.09]"
              : "border-white/[0.09] group-hover:border-violet-400/25"
          }
        `}
      >
        {icon &&
        isArtistsButton ? (
          <div
            className={`
              flex
              h-full
              w-full
              items-center
              justify-center

              ${
                active
                  ? "bg-violet-500/[0.10] text-violet-200"
                  : "bg-white/[0.025] text-white/42 group-hover:text-white/70"
              }
            `}
          >
            {icon}
          </div>
        ) : (
          <>
            <Image
              src={
                image
              }
              alt={
                label
              }
              fill
              sizes="56px"
              className="
                object-cover
                transition
                duration-300
                group-hover:scale-105
              "
              unoptimized
            />

            {icon && (
              <div
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  bg-black/45
                  text-white
                "
              >
                {icon}
              </div>
            )}
          </>
        )}
      </div>

      <p
        className={`
          mt-1.5
          truncate
          text-[8px]
          font-medium
          transition

          ${
            active
              ? "text-violet-100"
              : "text-white/32 group-hover:text-white/65"
          }
        `}
      >
        {label}
      </p>
    </button>
  );
}

// =========================================================
// ICON BUTTON
// =========================================================

function IconButton({
  children,
  label,
  disabled = false,
  onClick,
}: {
  children:
    React.ReactNode;

  label: string;

  disabled?: boolean;

  onClick:
    () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      disabled={
        disabled
      }
      className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        text-white/52
        transition
        hover:bg-white/[0.055]
        hover:text-white
        active:scale-95
        disabled:cursor-not-allowed
        disabled:opacity-25
      "
      aria-label={
        label
      }
    >
      {children}
    </button>
  );
}

// =========================================================
// NOW PLAYING BARS
// =========================================================

function NowPlayingBars({
  active,
  compact = false,
}: {
  active: boolean;

  compact?: boolean;
}) {
  if (compact) {
    return (
      <div
        className="
          flex
          shrink-0
          items-end
          gap-[1px]
        "
      >
        <span
          className={`
            w-[2px]
            rounded-full

            ${
              active
                ? "h-1.5 bg-blue-300"
                : "h-1 bg-white/15"
            }
          `}
        />

        <span
          className={`
            w-[2px]
            rounded-full

            ${
              active
                ? "h-2.5 bg-violet-300"
                : "h-1.5 bg-white/15"
            }
          `}
        />

        <span
          className={`
            w-[2px]
            rounded-full

            ${
              active
                ? "h-3.5 bg-purple-300"
                : "h-2 bg-white/15"
            }
          `}
        />
      </div>
    );
  }

  return (
    <div
      className="
        mb-1
        flex
        shrink-0
        items-end
        gap-[3px]
      "
    >
      <span
        className={`
          w-[3px]
          rounded-full

          ${
            active
              ? "h-2 bg-blue-300"
              : "h-1 bg-white/15"
          }
        `}
      />

      <span
        className={`
          w-[3px]
          rounded-full

          ${
            active
              ? "h-4 bg-violet-300"
              : "h-2 bg-white/15"
          }
        `}
      />

      <span
        className={`
          w-[3px]
          rounded-full

          ${
            active
              ? "h-6 bg-purple-300"
              : "h-3 bg-white/15"
          }
        `}
      />

      <span
        className={`
          w-[3px]
          rounded-full

          ${
            active
              ? "h-4 bg-violet-300"
              : "h-2 bg-white/15"
          }
        `}
      />
    </div>
  );
}

// =========================================================
// HELPERS
// =========================================================

function getSongId(
  song:
    | Song
    | null
    | undefined
) {
  if (!song) {
    return "";
  }

  return (
    song.songId
      ?.toString() ||
    song.id
      ?.toString() ||
    ""
  );
}

function getLibraryTrackId(
  track:
    | LibraryTrack
    | null
    | undefined
) {
  if (!track) {
    return "";
  }

  return (
    track.songId
      ?.toString() ||
    track._id
      ?.toString() ||
    ""
  );
}

function getSongArtwork(
  song:
    | Song
    | null
    | undefined
) {
  if (!song) {
    return "/assets/soalogo.png";
  }

  return (
    song.coverImage ||
    song.image ||
    "/assets/soalogo.png"
  );
}

function getLibraryArtwork(
  track:
    | LibraryTrack
    | null
    | undefined
) {
  if (!track) {
    return "/assets/soalogo.png";
  }

  return (
    track.coverImage ||
    track.projectCoverImage ||
    "/assets/soalogo.png"
  );
}

function formatProjectType(
  type?: string
) {
  if (!type) {
    return "Release";
  }

  if (
    type ===
    "ep"
  ) {
    return "EP";
  }

  return (
    type
      .charAt(0)
      .toUpperCase() +
    type.slice(1)
  );
}

function formatReleaseYear(
  value?:
    | number
    | null
) {
  if (
    !value ||
    !Number.isFinite(
      value
    )
  ) {
    return "";
  }

  const milliseconds =
    value <
    10_000_000_000
      ? value *
        1000
      : value;

  const date =
    new Date(
      milliseconds
    );

  const year =
    date.getFullYear();

  if (
    !Number.isFinite(
      year
    )
  ) {
    return "";
  }

  return String(
    year
  );
}

function clampPercent(
  value: number
) {
  if (
    !Number.isFinite(
      value
    )
  ) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      value
    )
  );
}

function formatTime(
  value: number
) {
  if (
    !Number.isFinite(
      value
    ) ||
    value < 0
  ) {
    return "0:00";
  }

  const totalSeconds =
    Math.floor(
      value
    );

  const minutes =
    Math.floor(
      totalSeconds /
        60
    );

  const seconds =
    String(
      totalSeconds %
        60
    ).padStart(
      2,
      "0"
    );

  return `${minutes}:${seconds}`;
}

// =========================================================
// END OF MusicPlayer.tsx
// =========================================================
