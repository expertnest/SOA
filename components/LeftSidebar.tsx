"use client";

import {
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

import { useState, useEffect } from "react";
import Image from "next/image";
import { useMusic } from "@/hooks/MusicContext";

export default function LeftSidebar() {
  const [leftCollapsed, setLeftCollapsed] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [artistDropdownOpen, setArtistDropdownOpen] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  const [shuffle, setShuffle] =
    useState(false);

  const [repeat, setRepeat] =
    useState(false);

  // ======================
  // MUSIC CONTEXT
  // ======================

  const {
    songs,
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
    duration,
  } = useMusic();

  // ======================
  // MOUNT
  // ======================

  useEffect(() => {
    setMounted(true);

    if (
      !currentSong &&
      songs.length > 0
    ) {
      playSong(songs[0]);
    }
  }, [
    songs,
    currentSong,
    playSong,
  ]);

  // ======================
  // ARTISTS
  // ======================

  const artists = [
    "All",
    "MacPhantom",
    "Qmilly",
  ];

  // ======================
  // FILTERED SONGS
  // ======================

  const filteredSongs =
    selectedCategory === "All"
      ? songs
      : songs.filter(
          (song: any) =>
            song.artistName?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  // ======================
  // GROUP SONGS
  // ======================

  const grouped =
    filteredSongs.reduce(
      (
        acc: any,
        song: any
      ) => {
        const key =
          song.projectName ||
          "Singles";

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(song);

        return acc;
      },
      {}
    );

  // ======================
  // DISPLAY SONG
  // ======================

  const displaySong =
    currentSong || {
      coverImage:
        "/assets/soalogo.png",

      title: "",

      artistName: "",
    };

  // ======================
  // CURRENT TIME
  // ======================

  const currentTime =
    duration
      ? Math.floor(
          (progress / 100) *
            duration
        )
      : 0;

  // ======================
  // FORMAT TIME
  // ======================

  const formatTime = (
    t: number
  ) => {
    if (
      isNaN(t) ||
      t < 0 ||
      !isFinite(t)
    ) {
      return "0:00";
    }

    const m =
      Math.floor(
        t / 60
      );

    const s = String(
      Math.floor(
        t % 60
      )
    ).padStart(
      2,
      "0"
    );

    return `${m}:${s}`;
  };

  // ======================
  // MOUNT GUARD
  // ======================

  if (!mounted) {
    return null;
  }

  return (
    <aside
      className={`
        relative

        flex
        flex-col
        flex-shrink-0

        bg-[#080808]
        text-white

        border-r
        border-white/[0.07]

        p-3
        md:p-4

        transition-all
        duration-300

        ${
          leftCollapsed
            ? "w-12 md:w-12"
            : "w-64 md:w-[350px]"
        }

        backdrop-blur-xl

        shadow-[
          0_0_0_1px_rgba(255,255,255,0.025),
          0_20px_40px_rgba(0,0,0,0.6)
        ]

        before:absolute
        before:inset-0
        before:pointer-events-none
        before:bg-gradient-to-b
        before:from-white/[0.035]
        before:via-transparent
        before:to-black/20
      `}
    >
      {/* ======================
          COLLAPSE BUTTON
      ====================== */}

      <button
        type="button"
        onClick={() =>
          setLeftCollapsed(
            !leftCollapsed
          )
        }
        className="
          mb-1
          self-end

          rounded-lg
          p-1.5

          text-white/40

          transition-all

          hover:bg-white/[0.05]
          hover:text-white
        "
        aria-label={
          leftCollapsed
            ? "Expand music player"
            : "Collapse music player"
        }
      >
        <ChevronsLeft
          size={20}
          className={`
            transition-transform
            duration-200

            ${
              leftCollapsed
                ? "rotate-180"
                : ""
            }
          `}
        />
      </button>

      {!leftCollapsed && (
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
          {/* ======================
              LOGO / HEADER
          ====================== */}

          <div
            className="
              mb-3
              flex
              items-center
              justify-between
            "
          >
            <Image
              src="/assets/soalogo.png"
              alt="SOA Logo"
              width={72}
              height={72}
              className="object-contain"
            />

            <span
              className="
                text-[10px]
                uppercase
                tracking-[0.22em]
                text-white/25
              "
            >
              Player
            </span>
          </div>

          <div
            className="
              mb-4
              h-px
              w-full
              bg-white/[0.08]
            "
          />

          {/* ======================
              NOW PLAYING
          ====================== */}

          <section>
            <div
              className="
                relative
                mb-4
                aspect-square
                overflow-hidden
                rounded-2xl

                border
                border-white/[0.08]

                bg-[#101010]

                shadow-[0_18px_45px_rgba(0,0,0,0.45)]
              "
            >
              <Image
                src={
                  displaySong.coverImage ||
                  "/assets/soalogo.png"
                }
                alt={
                  displaySong.title ||
                  "Now Playing"
                }
                fill
                sizes="300px"
                className="object-contain"
                unoptimized
              />

              <div
                className="
                  absolute
                  inset-x-3
                  top-3

                  flex
                  items-center
                  justify-between
                "
              >
                <span
                  className="
                    rounded-full

                    border
                    border-white/10

                    bg-black/60
                    px-2.5
                    py-1

                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.15em]

                    text-white/75

                    backdrop-blur-md
                  "
                >
                  Now Playing
                </span>

                <span
                  className="
                    rounded-full

                    border
                    border-white/10

                    bg-black/60
                    px-2
                    py-1

                    text-[9px]
                    text-white/45

                    backdrop-blur-md
                  "
                >
                  SOA
                </span>
              </div>
            </div>

            {currentSong && (
              <div className="mb-5">
                {/* TRACK INFO */}

                <div className="mb-3">
                  <p
                    className="
                      truncate
                      text-sm
                      font-semibold
                      text-white
                    "
                  >
                    {currentSong.title}
                  </p>

                  <p
                    className="
                      mt-1
                      truncate
                      text-xs
                      text-white/40
                    "
                  >
                    {currentSong.artistName}
                  </p>
                </div>

                {/* ======================
                    CONTROLS
                ====================== */}

                <div
                  className="
                    mb-3
                    flex
                    items-center
                    justify-between
                  "
                >
                  {/* SHUFFLE */}

                  <button
                    type="button"
                    onClick={() =>
                      setShuffle(
                        !shuffle
                      )
                    }
                    className={`
                      rounded-lg
                      p-2

                      transition

                      ${
                        shuffle
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "text-white/35 hover:bg-white/[0.05] hover:text-white"
                      }
                    `}
                    title={
                      shuffle
                        ? "Shuffle ON"
                        : "Shuffle OFF"
                    }
                    aria-label={
                      shuffle
                        ? "Shuffle on"
                        : "Shuffle off"
                    }
                  >
                    <Shuffle
                      size={16}
                    />
                  </button>

                  {/* PREVIOUS */}

                  <button
                    type="button"
                    onClick={
                      handlePrev
                    }
                    className="
                      rounded-lg
                      p-2

                      text-white/55

                      transition

                      hover:bg-white/[0.05]
                      hover:text-white
                    "
                    aria-label="Previous track"
                  >
                    <SkipBack
                      size={18}
                    />
                  </button>

                  {/* PLAY / PAUSE */}

                  <button
                    type="button"
                    onClick={
                      togglePlay
                    }
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center

                      rounded-full

                      bg-white

                      text-black

                      shadow-[0_8px_25px_rgba(255,255,255,0.12)]

                      transition

                      hover:scale-105
                      hover:bg-zinc-100

                      active:scale-95
                    "
                    aria-label={
                      isPlaying
                        ? "Pause"
                        : "Play"
                    }
                  >
                    {isPlaying ? (
                      <Pause
                        size={18}
                        fill="currentColor"
                      />
                    ) : (
                      <Play
                        size={18}
                        fill="currentColor"
                        className="ml-0.5"
                      />
                    )}
                  </button>

                  {/* NEXT */}

                  <button
                    type="button"
                    onClick={
                      handleNext
                    }
                    className="
                      rounded-lg
                      p-2

                      text-white/55

                      transition

                      hover:bg-white/[0.05]
                      hover:text-white
                    "
                    aria-label="Next track"
                  >
                    <SkipForward
                      size={18}
                    />
                  </button>

                  {/* REPEAT */}

                  <button
                    type="button"
                    onClick={() =>
                      setRepeat(
                        !repeat
                      )
                    }
                    className={`
                      rounded-lg
                      p-2

                      transition

                      ${
                        repeat
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "text-white/35 hover:bg-white/[0.05] hover:text-white"
                      }
                    `}
                    title={
                      repeat
                        ? "Repeat ON"
                        : "Repeat OFF"
                    }
                    aria-label={
                      repeat
                        ? "Repeat on"
                        : "Repeat off"
                    }
                  >
                    <Repeat
                      size={16}
                    />
                  </button>
                </div>

                {/* ======================
                    PROGRESS
                ====================== */}

                <div className="mt-4">
                  <button
                    type="button"
                    className="
                      group
                      relative
                      block
                      h-1.5
                      w-full
                      cursor-pointer
                      rounded-full
                      bg-white/10
                    "
                    onClick={(e) => {
                      const rect =
                        e.currentTarget.getBoundingClientRect();

                      const percent =
                        ((e.clientX -
                          rect.left) /
                          rect.width) *
                        100;

                      seek(
                        Math.min(
                          Math.max(
                            percent,
                            0
                          ),
                          100
                        )
                      );
                    }}
                    aria-label="Seek through track"
                  >
                    <span
                      className="
                        absolute
                        left-0
                        top-0
                        h-full
                        rounded-full

                        bg-white

                        transition-[width]
                        duration-150
                      "
                      style={{
                        width: `${Math.min(
                          Math.max(
                            progress,
                            0
                          ),
                          100
                        )}%`,
                      }}
                    />

                    <span
                      className="
                        absolute
                        top-1/2
                        h-3
                        w-3
                        -translate-y-1/2

                        rounded-full

                        bg-white

                        opacity-0

                        transition

                        group-hover:opacity-100
                      "
                      style={{
                        left: `calc(${Math.min(
                          Math.max(
                            progress,
                            0
                          ),
                          100
                        )}% - 6px)`,
                      }}
                    />
                  </button>

                  {/* TIME */}

                  <div
                    className="
                      mt-1.5
                      flex
                      justify-between

                      text-[10px]
                      tabular-nums

                      text-white/30
                    "
                  >
                    <span>
                      {formatTime(
                        currentTime
                      )}
                    </span>

                    <span>
                      {formatTime(
                        duration
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ======================
              ARTIST FILTER
          ====================== */}

          <section className="mb-4">
            <p
              className="
                mb-2
                px-1

                text-[9px]
                font-semibold
                uppercase
                tracking-[0.22em]

                text-white/25
              "
            >
              Artist
            </p>

            <button
              type="button"
              onClick={() =>
                setArtistDropdownOpen(
                  !artistDropdownOpen
                )
              }
              className="
                flex
                w-full
                items-center
                justify-between

                rounded-xl

                border
                border-white/[0.08]

                bg-white/[0.035]

                px-3
                py-2.5

                transition

                hover:border-white/[0.14]
                hover:bg-white/[0.06]
              "
              aria-label="Choose artist"
            >
              <span
                className="
                  text-xs
                  font-semibold
                  text-white/75
                "
              >
                {selectedCategory}
              </span>

              <ChevronDown
                size={15}
                className={`
                  text-white/30

                  transition-transform
                  duration-300

                  ${
                    artistDropdownOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            <div
              className={`
                overflow-hidden

                transition-all
                duration-300

                ${
                  artistDropdownOpen
                    ? "mt-2 max-h-48 opacity-100"
                    : "max-h-0 opacity-0"
                }
              `}
            >
              <div
                className="
                  rounded-xl

                  border
                  border-white/[0.08]

                  bg-[#111111]

                  p-1

                  shadow-[0_20px_40px_rgba(0,0,0,0.45)]
                "
              >
                {artists.map(
                  (artist) => (
                    <button
                      type="button"
                      key={artist}
                      onClick={() => {
                        setSelectedCategory(
                          artist
                        );

                        setArtistDropdownOpen(
                          false
                        );
                      }}
                      className={`
                        w-full

                        rounded-lg

                        px-3
                        py-2

                        text-left
                        text-xs

                        transition

                        ${
                          selectedCategory ===
                          artist
                            ? "bg-white text-black"
                            : "text-white/55 hover:bg-white/[0.05] hover:text-white"
                        }
                      `}
                    >
                      {artist}
                    </button>
                  )
                )}
              </div>
            </div>
          </section>

          {/* ======================
              TRACKLIST
          ====================== */}

          <div
            className="
              mb-4
              min-h-0
              flex-1
              space-y-5
              overflow-y-auto
              pr-1
              scrollbar-thin
              scrollbar-thumb-white/10
            "
          >
            {Object.entries(
              grouped
            ).map(
              ([
                project,
                projectSongs,
              ]: any) => (
                <div
                  key={project}
                >
                  {/* PROJECT NAME */}

                  <div
                    className="
                      mb-2
                      flex
                      items-center
                      gap-2
                      px-1
                    "
                  >
                    <span
                      className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-white/25
                      "
                    >
                      {project}
                    </span>

                    <div
                      className="
                        h-px
                        flex-1
                        bg-white/[0.06]
                      "
                    />
                  </div>

                  {/* SONGS */}

                  <div className="space-y-1">
                    {projectSongs.map(
                      (
                        song: any
                      ) => {
                        const isCurrent =
                          currentSong?.songId ===
                          song.songId;

                        return (
                          <button
                            key={
                              song.songId
                            }
                            type="button"
                            onClick={() =>
                              playSong(
                                song
                              )
                            }
                            className={`
                              group
                              flex
                              w-full
                              items-center
                              justify-between

                              rounded-xl

                              px-2.5
                              py-2.5

                              text-left

                              transition

                              ${
                                isCurrent
                                  ? "bg-white/[0.08] ring-1 ring-white/[0.08]"
                                  : "hover:bg-white/[0.045]"
                              }
                            `}
                          >
                            <div
                              className="
                                min-w-0
                                flex-1
                              "
                            >
                              <p
                                className={`
                                  truncate
                                  text-[11px]
                                  font-medium

                                  ${
                                    isCurrent
                                      ? "text-white"
                                      : "text-white/75 group-hover:text-white"
                                  }
                                `}
                              >
                                {
                                  song.title
                                }
                              </p>

                              <p
                                className="
                                  mt-0.5
                                  truncate
                                  text-[9px]
                                  text-white/30
                                "
                              >
                                {
                                  song.artistName
                                }
                              </p>
                            </div>

                            <span
                              className={`
                                ml-3
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center

                                rounded-full

                                transition

                                ${
                                  isCurrent
                                    ? "bg-white text-black"
                                    : "bg-white/[0.04] text-white/25 group-hover:bg-white/[0.09] group-hover:text-white"
                                }
                              `}
                            >
                              {isCurrent &&
                              isPlaying ? (
                                <Pause
                                  size={11}
                                  fill="currentColor"
                                />
                              ) : (
                                <Play
                                  size={11}
                                  fill="currentColor"
                                />
                              )}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          {/* ======================
              VOLUME
          ====================== */}

          <section
            className="
              border-t
              border-white/[0.07]

              pt-3
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <Volume2
                size={15}
                className="shrink-0 text-white/35"
              />

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) =>
                  setVolume(
                    parseFloat(
                      e.target.value
                    )
                  )
                }
                className="
                  h-1
                  w-full
                  cursor-pointer
                  accent-white
                "
                aria-label="Volume"
              />
            </div>
          </section>

          {/* ======================
              SOCIALS
          ====================== */}

          <div
            className="
              mt-3
              flex
              items-center
              justify-center
              gap-5

              border-t
              border-white/[0.07]

              pt-3

              text-white/30
            "
          >
            <button
              type="button"
              className="
                transition
                hover:text-white
              "
              aria-label="Instagram"
            >
              <Instagram
                size={17}
              />
            </button>

            <button
              type="button"
              className="
                transition
                hover:text-white
              "
              aria-label="Twitter"
            >
              <Twitter
                size={17}
              />
            </button>

            <button
              type="button"
              className="
                transition
                hover:text-white
              "
              aria-label="YouTube"
            >
              <Youtube
                size={17}
              />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}