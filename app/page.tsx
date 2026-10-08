"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Disc3,
  Headphones,
  Home as HomeIcon,
  Music2,
  Pause,
  Play,
  Radio,
  Search,
  ShoppingBag,
  Sparkles,
  Ticket,
  Users,
  Video,
  X,
} from "lucide-react";
import {
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useMusic } from "@/hooks/MusicContext";

// =========================================================
// TYPES
// =========================================================

type Song = {
  _id?: string;
  songId?: string;
  title?: string;
  artistName?: string;
  projectName?: string;
  coverImage?: string;
  genre?: string;
  duration?: number;
  releaseDate?: number | string;
};

type Artist = {
  name: string;
  image: string;
  songCount: number;
};

// =========================================================
// NAV
// =========================================================

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    label: "Music",
    href: "/music",
    icon: Music2,
  },
  {
    label: "Videos",
    href: "/videos",
    icon: Video,
  },
  {
    label: "Live",
    href: "/live",
    icon: Radio,
  },
  {
    label: "Tour",
    href: "/tour",
    icon: Ticket,
  },
  {
    label: "Shop",
    href: "/shop",
    icon: ShoppingBag,
  },
];

// =========================================================
// PAGE
// =========================================================

export default function Home() {
  // ======================================================
  // MUSIC
  // ======================================================

  const {
    songs: musicSongs,
    currentSong,
    isPlaying,
    togglePlay,
    playSong,
  } = useMusic();

  const songs = (musicSongs ?? []) as Song[];

  // ======================================================
  // LOCAL STATE
  // ======================================================

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtist, setSelectedArtist] =
    useState("All");

  // ======================================================
  // ARTISTS
  // ======================================================

  const artists = useMemo<Artist[]>(() => {
    const map = new Map<string, Artist>();

    songs.forEach(song => {
      const name =
        song.artistName?.trim() ||
        "Unknown Artist";

      const existing = map.get(name);

      if (existing) {
        existing.songCount += 1;

        if (
          existing.image ===
            "/assets/soalogo.png" &&
          song.coverImage
        ) {
          existing.image =
            song.coverImage;
        }

        return;
      }

      map.set(name, {
        name,
        image:
          song.coverImage ||
          "/assets/soalogo.png",
        songCount: 1,
      });
    });

    return Array.from(map.values());
  }, [songs]);

  // ======================================================
  // ARTIST FILTER
  // ======================================================

  const artistFilteredSongs =
    useMemo(() => {
      if (selectedArtist === "All") {
        return songs;
      }

      return songs.filter(
        song =>
          song.artistName ===
          selectedArtist
      );
    }, [songs, selectedArtist]);

  // ======================================================
  // SEARCH
  // ======================================================

  const normalizedSearch =
    searchQuery.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!normalizedSearch) {
      return [];
    }

    return songs.filter(song => {
      const title =
        song.title?.toLowerCase() ?? "";

      const artist =
        song.artistName?.toLowerCase() ??
        "";

      const project =
        song.projectName?.toLowerCase() ??
        "";

      const genre =
        song.genre?.toLowerCase() ?? "";

      return (
        title.includes(normalizedSearch) ||
        artist.includes(
          normalizedSearch
        ) ||
        project.includes(
          normalizedSearch
        ) ||
        genre.includes(normalizedSearch)
      );
    });
  }, [songs, normalizedSearch]);

  const matchingArtists =
    useMemo(() => {
      if (!normalizedSearch) {
        return [];
      }

      return artists.filter(artist =>
        artist.name
          .toLowerCase()
          .includes(normalizedSearch)
      );
    }, [
      artists,
      normalizedSearch,
    ]);

  // ======================================================
  // DISCOVERY DATA
  // ======================================================

  const featuredSong =
    artistFilteredSongs[0] ??
    songs[0] ??
    null;

  const quickPicks =
    artistFilteredSongs.slice(0, 6);

  const discoverySongs =
    artistFilteredSongs.slice(0, 10);

  const latestSongs =
    [...artistFilteredSongs]
      .reverse()
      .slice(0, 10);

  // ======================================================
  // PLAYER
  // ======================================================

  const isCurrentSong = (
    song: Song
  ) => {
    return (
      getSongId(currentSong) ===
      getSongId(song)
    );
  };

  const handlePlay = (
    song: Song
  ) => {
    if (isCurrentSong(song)) {
      togglePlay();
      return;
    }

    playSong(song as any);
  };

  // ======================================================
  // EMPTY CATALOG
  // ======================================================

  if (songs.length === 0) {
    return <EmptyHome />;
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-full w-full overflow-x-hidden bg-[#15171c] text-white">
      {/* ==================================================
          AMBIENCE
      ================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[-160px] h-[440px] w-[440px] rounded-full bg-blue-600/[0.035] blur-[150px]" />

        <div className="absolute right-[-180px] top-[24%] h-[520px] w-[520px] rounded-full bg-violet-600/[0.04] blur-[180px]" />

        <div className="absolute bottom-[-200px] left-[35%] h-[480px] w-[480px] rounded-full bg-purple-600/[0.025] blur-[180px]" />
      </div>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-4 pb-28 pt-4 sm:px-6 lg:px-8 xl:px-10">
        {/* ==================================================
            CENTER NAV
        ================================================== */}

        <header className="sticky top-0 z-40 -mx-4 px-4 pb-3 pt-2 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 xl:-mx-10 xl:px-10">
          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#15171c]/90 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.16)]">
            {/* BRAND */}

            <Link
              href="/"
              className="flex h-10 shrink-0 items-center gap-2 rounded-xl px-2 text-white transition hover:bg-white/[0.04]"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-400/15 bg-violet-500/[0.07]">
                <Music2
                  size={14}
                  className="text-violet-200"
                />
              </div>

              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70 xl:block">
                SOA
              </span>
            </Link>

            {/* NAV */}

            <nav className="hidden min-w-0 items-center gap-1 lg:flex">
              {navItems.map(item => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex
                      h-9
                      items-center
                      gap-1.5
                      rounded-lg
                      px-2.5
                      text-[10px]
                      font-medium
                      transition
                      ${
                        item.href === "/"
                          ? "bg-white/[0.065] text-white"
                          : "text-white/42 hover:bg-white/[0.045] hover:text-white/75"
                      }
                    `}
                  >
                    <Icon
                      size={12}
                      strokeWidth={1.8}
                    />

                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* SEARCH */}

            <div className="relative ml-auto min-w-0 flex-1 lg:max-w-[360px]">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              />

              <input
                value={searchQuery}
                onChange={event =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Search artists, songs, releases..."
                aria-label="Search SOA Music"
                className="
                  h-10
                  w-full
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-white/[0.035]
                  pl-9
                  pr-9
                  text-[11px]
                  text-white/80
                  outline-none
                  transition
                  placeholder:text-white/25
                  hover:border-white/[0.12]
                  focus:border-violet-400/25
                  focus:bg-white/[0.045]
                "
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchQuery("")
                  }
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* MOBILE NAV */}

          <div className="mt-2 flex gap-1 overflow-x-auto pb-1 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  shrink-0
                  rounded-full
                  border
                  px-3
                  py-1.5
                  text-[9px]
                  font-medium
                  transition
                  ${
                    item.href === "/"
                      ? "border-violet-400/20 bg-violet-500/[0.09] text-violet-100"
                      : "border-white/[0.07] bg-white/[0.025] text-white/40 hover:text-white/70"
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </header>

        {/* ==================================================
            SEARCH RESULTS
        ================================================== */}

        {normalizedSearch && (
          <section className="mt-5">
            <SectionHeader
              eyebrow="Search"
              title={`Results for “${searchQuery.trim()}”`}
            />

            {matchingArtists.length >
              0 && (
              <>
                <p className="mt-5 text-[9px] font-medium uppercase tracking-[0.16em] text-white/32">
                  Artists
                </p>

                <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {matchingArtists.map(
                    artist => (
                      <ArtistCard
                        key={
                          artist.name
                        }
                        artist={
                          artist
                        }
                        active={
                          selectedArtist ===
                          artist.name
                        }
                        onSelect={() => {
                          setSelectedArtist(
                            artist.name
                          );
                          setSearchQuery(
                            ""
                          );
                        }}
                      />
                    )
                  )}
                </div>
              </>
            )}

            {searchResults.length >
            0 ? (
              <>
                <p className="mt-6 text-[9px] font-medium uppercase tracking-[0.16em] text-white/32">
                  Tracks
                </p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {searchResults
                    .slice(0, 12)
                    .map(
                      (
                        song,
                        index
                      ) => (
                        <TrackRow
                          key={getSongKey(
                            song,
                            index
                          )}
                          song={song}
                          current={isCurrentSong(
                            song
                          )}
                          playing={
                            isCurrentSong(
                              song
                            ) &&
                            isPlaying
                          }
                          onPlay={() =>
                            handlePlay(
                              song
                            )
                          }
                        />
                      )
                    )}
                </div>
              </>
            ) : (
              matchingArtists.length ===
                0 && (
                <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-8 text-center">
                  <Search
                    size={20}
                    className="mx-auto text-white/20"
                  />

                  <p className="mt-3 text-sm font-medium text-white/60">
                    Nothing found.
                  </p>

                  <p className="mt-1 text-[10px] text-white/30">
                    Try another song,
                    artist or release.
                  </p>
                </div>
              )
            )}
          </section>
        )}

        {/* ==================================================
            NORMAL HOME
        ================================================== */}

        {!normalizedSearch && (
          <>
            {/* ==============================================
                WELCOME
            ============================================== */}

            <section className="pt-6 sm:pt-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.19em] text-violet-200/40">
                    <Sparkles size={11} />

                    SOA Music
                  </div>

                  <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                    Music lives here.
                  </h1>

                  <p className="mt-3 max-w-xl text-xs leading-6 text-white/42 sm:text-sm">
                    Discover releases,
                    artists, visuals and
                    everything happening
                    across SOA.
                  </p>
                </div>

                <div className="flex items-center gap-5 text-[10px] text-white/32">
                  <span>
                    <strong className="font-semibold text-white/62">
                      {artists.length}
                    </strong>{" "}
                    artists
                  </span>

                  <span>
                    <strong className="font-semibold text-white/62">
                      {songs.length}
                    </strong>{" "}
                    tracks
                  </span>
                </div>
              </div>
            </section>

            {/* ==============================================
                FEATURED RELEASE
            ============================================== */}

            {featuredSong && (
              <section className="mt-7">
                <div className="relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#181a20]">
                  {/* BACKDROP */}

                  <img
                    src={
                      featuredSong.coverImage ||
                      "/assets/soalogo.png"
                    }
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full scale-110 object-cover opacity-[0.16] blur-3xl"
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-[#171920] via-[#171920]/90 to-[#171920]/55" />

                  <div className="relative grid min-h-[330px] gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end lg:p-9 xl:grid-cols-[minmax(0,1fr)_300px]">
                    {/* INFO */}

                    <div className="order-2 flex min-w-0 flex-col justify-end lg:order-1">
                      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.09] bg-black/20 px-3 py-1.5 text-[8px] font-medium uppercase tracking-[0.16em] text-white/45 backdrop-blur-xl">
                        <Sparkles
                          size={10}
                          className="text-violet-200"
                        />
                        Featured release
                      </div>

                      <p className="mt-6 text-[11px] font-medium text-violet-200/65">
                        {featuredSong.artistName ||
                          "SOA Artist"}
                      </p>

                      <h2 className="mt-1 max-w-3xl text-4xl font-bold tracking-[-0.055em] sm:text-5xl xl:text-6xl">
                        {featuredSong.title ||
                          "Untitled"}
                      </h2>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[9px] text-white/35">
                        {featuredSong.projectName && (
                          <>
                            <span>
                              {
                                featuredSong.projectName
                              }
                            </span>
                            <span>•</span>
                          </>
                        )}

                        {featuredSong.genre && (
                          <>
                            <span>
                              {
                                featuredSong.genre
                              }
                            </span>
                            <span>•</span>
                          </>
                        )}

                        <span>
                          SOA Music
                        </span>
                      </div>

                      <div className="mt-7 flex flex-wrap gap-2.5">
                        <button
                          type="button"
                          onClick={() =>
                            handlePlay(
                              featuredSong
                            )
                          }
                          className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[11px] font-semibold text-black transition hover:scale-[1.02] hover:bg-violet-50 active:scale-[0.98]"
                        >
                          {isCurrentSong(
                            featuredSong
                          ) &&
                          isPlaying ? (
                            <Pause
                              size={14}
                              fill="currentColor"
                            />
                          ) : (
                            <Play
                              size={14}
                              fill="currentColor"
                              className="ml-px"
                            />
                          )}

                          {isCurrentSong(
                            featuredSong
                          ) &&
                          isPlaying
                            ? "Pause"
                            : "Play"}
                        </button>

                        <Link
                          href="/music"
                          className="inline-flex h-11 items-center gap-2 rounded-full border border-white/[0.11] bg-black/20 px-5 text-[11px] font-medium text-white/60 backdrop-blur-xl transition hover:border-violet-400/20 hover:bg-white/[0.045] hover:text-white"
                        >
                          View music
                          <ArrowRight
                            size={13}
                          />
                        </Link>
                      </div>
                    </div>

                    {/* ARTWORK */}

                    <div className="order-1 mx-auto w-full max-w-[220px] lg:order-2 lg:max-w-none">
                      <div className="relative aspect-square overflow-hidden rounded-[24px] border border-white/[0.11] bg-[#111318] shadow-[0_25px_70px_rgba(0,0,0,0.48)]">
                        <img
                          src={
                            featuredSong.coverImage ||
                            "/assets/soalogo.png"
                          }
                          alt={
                            featuredSong.title ||
                            "Featured release"
                          }
                          className="h-full w-full object-cover"
                        />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ==============================================
                CONTINUE LISTENING
            ============================================== */}

            {currentSong && (
              <section className="mt-10">
                <SectionHeader
                  eyebrow="Your session"
                  title="Continue listening"
                />

                <button
                  type="button"
                  onClick={() =>
                    handlePlay(
                      currentSong
                    )
                  }
                  className="group mt-4 flex w-full max-w-xl items-center gap-3 rounded-2xl border border-violet-400/15 bg-violet-500/[0.045] p-3 text-left transition hover:border-violet-400/25 hover:bg-violet-500/[0.07]"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/[0.04]">
                    <img
                      src={
                        currentSong.coverImage ||
                        "/assets/soalogo.png"
                      }
                      alt={
                        currentSong.title ||
                        "Current song"
                      }
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white/80">
                      {
                        currentSong.title
                      }
                    </p>

                    <p className="mt-1 truncate text-[9px] text-white/35">
                      {
                        currentSong.artistName
                      }
                    </p>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition group-hover:scale-105">
                    {isPlaying ? (
                      <Pause
                        size={13}
                        fill="currentColor"
                      />
                    ) : (
                      <Play
                        size={13}
                        fill="currentColor"
                        className="ml-px"
                      />
                    )}
                  </div>
                </button>
              </section>
            )}

            {/* ==============================================
                ARTISTS
            ============================================== */}

            {artists.length > 0 && (
              <section className="mt-12">
                <SectionHeader
                  eyebrow="Artists"
                  title="Explore the roster"
                  href="/music"
                />

                <div className="mt-5 flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <ArtistCard
                    artist={{
                      name: "All",
                      image:
                        "/assets/soalogo.png",
                      songCount:
                        songs.length,
                    }}
                    active={
                      selectedArtist ===
                      "All"
                    }
                    onSelect={() =>
                      setSelectedArtist(
                        "All"
                      )
                    }
                  />

                  {artists.map(artist => (
                    <ArtistCard
                      key={artist.name}
                      artist={artist}
                      active={
                        selectedArtist ===
                        artist.name
                      }
                      onSelect={() =>
                        setSelectedArtist(
                          artist.name
                        )
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ==============================================
                QUICK PICKS
            ============================================== */}

            {quickPicks.length > 0 && (
              <section className="mt-12">
                <SectionHeader
                  eyebrow={
                    selectedArtist ===
                    "All"
                      ? "Start listening"
                      : selectedArtist
                  }
                  title="Quick picks"
                  href="/music"
                />

                <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {quickPicks.map(
                    (
                      song,
                      index
                    ) => (
                      <TrackRow
                        key={getSongKey(
                          song,
                          index
                        )}
                        song={song}
                        current={isCurrentSong(
                          song
                        )}
                        playing={
                          isCurrentSong(
                            song
                          ) &&
                          isPlaying
                        }
                        onPlay={() =>
                          handlePlay(
                            song
                          )
                        }
                      />
                    )
                  )}
                </div>
              </section>
            )}

            {/* ==============================================
                DISCOVERY
            ============================================== */}

            <SongShelf
              eyebrow="Discover"
              title="Explore the catalog"
              href="/music"
            >
              {discoverySongs.map(
                (
                  song,
                  index
                ) => (
                  <SongCard
                    key={getSongKey(
                      song,
                      index
                    )}
                    song={song}
                    current={isCurrentSong(
                      song
                    )}
                    playing={
                      isCurrentSong(
                        song
                      ) &&
                      isPlaying
                    }
                    onPlay={() =>
                      handlePlay(song)
                    }
                  />
                )
              )}
            </SongShelf>

            {/* ==============================================
                NEW RELEASES
            ============================================== */}

            <SongShelf
              eyebrow="Releases"
              title="New from SOA"
              href="/music"
            >
              {latestSongs.map(
                (
                  song,
                  index
                ) => (
                  <SongCard
                    key={`latest-${getSongKey(
                      song,
                      index
                    )}`}
                    song={song}
                    current={isCurrentSong(
                      song
                    )}
                    playing={
                      isCurrentSong(
                        song
                      ) &&
                      isPlaying
                    }
                    onPlay={() =>
                      handlePlay(song)
                    }
                  />
                )
              )}
            </SongShelf>

            {/* ==============================================
                VISUALS
            ============================================== */}

            <section className="mt-14">
              <SectionHeader
                eyebrow="Visuals"
                title="Watch SOA"
                href="/videos"
              />

              <Link
                href="/videos"
                className="group relative mt-5 block min-h-[280px] overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#181a20] sm:min-h-[340px]"
              >
                <img
                  src="/headerLogo.png"
                  alt="SOA visuals"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-2xl transition duration-300 group-hover:scale-110">
                    <Play
                      size={18}
                      fill="currentColor"
                      className="ml-1"
                    />
                  </div>
                </div>

                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-sm font-semibold">
                    SOA Visuals
                  </p>

                  <p className="mt-1 text-[10px] text-white/45">
                    Music videos,
                    performances and visual
                    worlds.
                  </p>
                </div>
              </Link>
            </section>

            {/* ==============================================
                EXPLORE
            ============================================== */}

            <section className="mt-14">
              <SectionHeader
                eyebrow="Beyond the music"
                title="Explore SOA"
              />

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <ExploreCard
                  href="/music"
                  title="Music"
                  description="Browse the complete SOA catalog."
                  icon={
                    <Disc3 size={20} />
                  }
                />

                <ExploreCard
                  href="/videos"
                  title="Videos"
                  description="Watch official visuals and releases."
                  icon={
                    <Video size={20} />
                  }
                />

                <ExploreCard
                  href="/live"
                  title="Live"
                  description="Streams, premieres and live moments."
                  icon={
                    <Radio size={20} />
                  }
                />

                <ExploreCard
                  href="/shop"
                  title="Shop"
                  description="Official SOA releases and merchandise."
                  icon={
                    <ShoppingBag
                      size={20}
                    />
                  }
                />
              </div>
            </section>

            {/* ==============================================
                TOUR / COMMUNITY
            ============================================== */}

            <section className="mt-12 grid gap-3 lg:grid-cols-2">
              <FeatureLink
                href="/tour"
                eyebrow="Live events"
                title="Tour"
                description="See upcoming SOA performances and events."
                icon={
                  <Ticket size={18} />
                }
              />

              <FeatureLink
                href="/about"
                eyebrow="The roster"
                title="Meet the artists"
                description="Explore the people building the SOA sound."
                icon={
                  <Users size={18} />
                }
              />
            </section>

            {/* ==============================================
                FOOTER
            ============================================== */}

            <footer className="mt-16 flex flex-col gap-5 border-t border-white/[0.08] pb-7 pt-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-white/42">
                  SOA Music
                </p>

                <p className="mt-1 text-[9px] text-white/25">
                  © 2026 SOA Music.
                </p>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-[9px] uppercase tracking-[0.12em] text-white/32">
                <Link
                  href="/music"
                  className="transition hover:text-white"
                >
                  Music
                </Link>

                <Link
                  href="/videos"
                  className="transition hover:text-white"
                >
                  Videos
                </Link>

                <Link
                  href="/tour"
                  className="transition hover:text-white"
                >
                  Tour
                </Link>

                <Link
                  href="/shop"
                  className="transition hover:text-white"
                >
                  Shop
                </Link>

                <Link
                  href="/about"
                  className="transition hover:text-white"
                >
                  About
                </Link>

                <Link
                  href="/contact"
                  className="transition hover:text-white"
                >
                  Contact
                </Link>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

// =========================================================
// TRACK ROW
// =========================================================

function TrackRow({
  song,
  current,
  playing,
  onPlay,
}: {
  song: Song;
  current: boolean;
  playing: boolean;
  onPlay: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPlay}
      className={`
        group
        flex
        min-w-0
        items-center
        rounded-xl
        border
        p-2
        text-left
        transition
        ${
          current
            ? "border-violet-400/18 bg-violet-500/[0.06]"
            : "border-white/[0.07] bg-white/[0.025] hover:border-white/[0.11] hover:bg-white/[0.045]"
        }
      `}
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#1d2027]">
        <img
          src={
            song.coverImage ||
            "/assets/soalogo.png"
          }
          alt={song.title || "Track"}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1 px-3">
        <p className="truncate text-[11px] font-semibold text-white/75">
          {song.title ||
            "Untitled"}
        </p>

        <p className="mt-1 truncate text-[9px] text-white/32">
          {song.artistName ||
            "SOA Artist"}

          {song.projectName
            ? ` • ${song.projectName}`
            : ""}
        </p>
      </div>

      <div
        className={`
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-full
          transition
          ${
            current
              ? "bg-white text-black"
              : "bg-white/[0.055] text-white/55 group-hover:bg-white group-hover:text-black"
          }
        `}
      >
        {playing ? (
          <Pause
            size={11}
            fill="currentColor"
          />
        ) : (
          <Play
            size={11}
            fill="currentColor"
            className="ml-px"
          />
        )}
      </div>
    </button>
  );
}

// =========================================================
// SONG CARD
// =========================================================

function SongCard({
  song,
  current,
  playing,
  onPlay,
}: {
  song: Song;
  current: boolean;
  playing: boolean;
  onPlay: () => void;
}) {
  return (
    <article className="group w-[155px] shrink-0 sm:w-[175px] xl:w-[190px]">
      <div
        className={`
          relative
          aspect-square
          overflow-hidden
          rounded-[18px]
          border
          bg-[#1b1d23]
          transition
          ${
            current
              ? "border-violet-400/25"
              : "border-white/[0.08]"
          }
        `}
      >
        <img
          src={
            song.coverImage ||
            "/assets/soalogo.png"
          }
          alt={
            song.title || "Track"
          }
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-60" />

        <button
          type="button"
          onClick={onPlay}
          aria-label={
            playing
              ? `Pause ${song.title}`
              : `Play ${song.title}`
          }
          className={`
            absolute
            bottom-3
            right-3
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-white
            text-black
            shadow-xl
            transition
            duration-200
            ${
              current
                ? "opacity-100"
                : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
            }
          `}
        >
          {playing ? (
            <Pause
              size={13}
              fill="currentColor"
            />
          ) : (
            <Play
              size={13}
              fill="currentColor"
              className="ml-px"
            />
          )}
        </button>
      </div>

      <div className="px-1 pt-3">
        <p className="truncate text-[12px] font-medium text-white/75">
          {song.title ||
            "Untitled"}
        </p>

        <p className="mt-1 truncate text-[9px] text-white/32">
          {song.artistName ||
            "SOA Artist"}
        </p>

        {song.projectName && (
          <p className="mt-0.5 truncate text-[8px] text-white/22">
            {song.projectName}
          </p>
        )}
      </div>
    </article>
  );
}

// =========================================================
// ARTIST CARD
// =========================================================

function ArtistCard({
  artist,
  active,
  onSelect,
}: {
  artist: Artist;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group w-[130px] shrink-0 text-left sm:w-[145px]"
    >
      <div
        className={`
          relative
          aspect-square
          overflow-hidden
          rounded-full
          border
          bg-[#1b1d23]
          transition
          duration-300
          ${
            active
              ? "border-violet-400/35 ring-4 ring-violet-500/[0.05]"
              : "border-white/[0.09] group-hover:border-white/[0.16]"
          }
        `}
      >
        <img
          src={artist.image}
          alt={artist.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      </div>

      <div className="mt-3 text-center">
        <p
          className={`
            truncate
            text-[11px]
            font-semibold
            transition
            ${
              active
                ? "text-violet-100"
                : "text-white/70 group-hover:text-white"
            }
          `}
        >
          {artist.name === "All"
            ? "All Artists"
            : artist.name}
        </p>

        <p className="mt-1 text-[8px] uppercase tracking-[0.12em] text-white/27">
          {artist.songCount}{" "}
          {artist.songCount === 1
            ? "track"
            : "tracks"}
        </p>
      </div>
    </button>
  );
}

// =========================================================
// SONG SHELF
// =========================================================

function SongShelf({
  eyebrow,
  title,
  href,
  children,
}: {
  eyebrow: string;
  title: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-14">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        href={href}
      />

      <div className="mt-5 flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </section>
  );
}

// =========================================================
// SECTION HEADER
// =========================================================

function SectionHeader({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-5">
      <div className="min-w-0">
        <p className="text-[8px] font-medium uppercase tracking-[0.19em] text-violet-200/36">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-white sm:text-2xl">
          {title}
        </h2>
      </div>

      {href && (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-1 text-[9px] font-medium text-white/32 transition hover:text-white"
        >
          Show all

          <ChevronRight
            size={12}
          />
        </Link>
      )}
    </div>
  );
}

// =========================================================
// EXPLORE CARD
// =========================================================

function ExploreCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative min-h-[160px] overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#181a20] p-5 transition hover:-translate-y-0.5 hover:border-violet-400/15 hover:bg-[#1b1d24]"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-white/42 transition group-hover:border-violet-400/15 group-hover:text-violet-100">
        {icon}
      </div>

      <div className="absolute bottom-5 left-5 right-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-white/80">
            {title}
          </h3>

          <ArrowUpRight
            size={14}
            className="text-white/25 transition group-hover:text-white/60"
          />
        </div>

        <p className="mt-2 text-[9px] leading-5 text-white/35">
          {description}
        </p>
      </div>
    </Link>
  );
}

// =========================================================
// FEATURE LINK
// =========================================================

function FeatureLink({
  href,
  eyebrow,
  title,
  description,
  icon,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-[150px] items-center justify-between gap-5 rounded-[22px] border border-white/[0.08] bg-white/[0.025] p-5 transition hover:border-violet-400/15 hover:bg-white/[0.04]"
    >
      <div>
        <div className="flex items-center gap-2 text-[8px] font-medium uppercase tracking-[0.17em] text-white/28">
          {icon}
          {eyebrow}
        </div>

        <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white/85">
          {title}
        </h3>

        <p className="mt-2 max-w-sm text-[9px] leading-5 text-white/35">
          {description}
        </p>
      </div>

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/30 transition group-hover:border-violet-400/20 group-hover:bg-violet-500/[0.06] group-hover:text-violet-100">
        <ArrowRight size={13} />
      </div>
    </Link>
  );
}

// =========================================================
// EMPTY HOME
// =========================================================

function EmptyHome() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#15171c] px-5 text-white">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.09] bg-white/[0.04] text-violet-200/45">
          <Headphones size={22} />
        </div>

        <h1 className="mt-5 text-xl font-semibold">
          SOA is getting ready.
        </h1>

        <p className="mt-2 text-sm leading-6 text-white/40">
          Releases and artists will
          appear here as soon as music
          is available in the catalog.
        </p>
      </div>
    </div>
  );
}

// =========================================================
// HELPERS
// =========================================================

function getSongId(
  song: any
): string | undefined {
  if (!song) return undefined;

  return (
    song.songId?.toString() ||
    song._id?.toString()
  );
}

function getSongKey(
  song: Song,
  index: number
) {
  return (
    getSongId(song) ||
    `${song.artistName ?? "artist"}-${song.title ?? "song"}-${index}`
  );
}