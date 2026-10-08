"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Disc3,
  Headphones,
  ListMusic,
  Loader2,
  Music2,
  Play,
  Radio,
  Repeat2,
  Search,
  SkipForward,
  Sparkles,
  Target,
  Trophy,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

type CatalogFilter =
  | "top"
  | "plays"
  | "retention"
  | "replays"
  | "attention"
  | "all";

// ========================================================
// PAGE
// ========================================================

export default function ArtistAnalyticsPage() {
  // ======================================================
  // SCROLL TARGET
  // ======================================================

  const analyticsTopRef =
    useRef<HTMLDivElement | null>(null);

  // ======================================================
  // ARTIST MEMBERSHIP
  // ======================================================

  const memberships = useQuery(
    api.artists.access.getMyArtistMemberships,
    {}
  );

  // ======================================================
  // ACTIVE ARTIST
  // ======================================================

  const activeMembership = useMemo(() => {
    if (!memberships || memberships.length === 0) {
      return null;
    }

    return (
      memberships.find(
        (membership) => membership.artist
      ) ?? memberships[0]
    );
  }, [memberships]);

  const artist = activeMembership?.artist ?? null;

  const artistId =
    artist?._id ??
    activeMembership?.artistId ??
    null;

  // ======================================================
  // PRIVATE ARTIST SONG ANALYTICS
  // ======================================================

  const songs = useQuery(
    api.songAnalytics.getArtistSongsForAnalytics,
    artistId
      ? {
          artistId,
        }
      : "skip"
  );

  // ======================================================
  // SELECTED SONG
  // ======================================================

  const [
    selectedSongId,
    setSelectedSongId,
  ] = useState<Id<"songs"> | null>(null);

  const [
    catalogFilter,
    setCatalogFilter,
  ] = useState<CatalogFilter>("top");

  const [
    catalogSearch,
    setCatalogSearch,
  ] = useState("");

  // ======================================================
  // DEFAULT SONG SELECTION
  // ======================================================

  useEffect(() => {
    if (songs === undefined) {
      return;
    }

    if (songs.length === 0) {
      if (selectedSongId !== null) {
        setSelectedSongId(null);
      }

      return;
    }

    const stillExists =
      selectedSongId !== null &&
      songs.some(
        (song) =>
          song.songId === selectedSongId
      );

    if (!stillExists) {
      setSelectedSongId(
        songs[0].songId
      );
    }
  }, [songs, selectedSongId]);

  // ======================================================
  // SELECT SONG + SCROLL TO ANALYTICS
  // ======================================================

  const handleSelectSong = (
    songId: Id<"songs">
  ) => {
    setSelectedSongId(songId);

    requestAnimationFrame(() => {
      analyticsTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  // ======================================================
  // SELECTED SONG
  // ======================================================

  const selectedSong = useMemo(() => {
    if (!songs || !selectedSongId) {
      return null;
    }

    return (
      songs.find(
        (song) =>
          song.songId === selectedSongId
      ) ?? null
    );
  }, [songs, selectedSongId]);

  // ======================================================
  // CATALOG PERFORMANCE
  // ======================================================

  const catalogSongs = useMemo(() => {
    if (!songs) {
      return [];
    }

    const searchValue =
      catalogSearch.trim().toLowerCase();

    const filtered =
      songs.filter((song) => {
        const matchesSearch =
          !searchValue ||
          song.title
            .toLowerCase()
            .includes(searchValue) ||
          song.artistName
            .toLowerCase()
            .includes(searchValue) ||
          song.genre
            ?.toLowerCase()
            .includes(searchValue);

        if (!matchesSearch) {
          return false;
        }

        if (
          catalogFilter === "attention"
        ) {
          return (
            song.skipRate >= 0.5 ||
            song.completionRate < 0.5
          );
        }

        return true;
      });

    return [...filtered].sort(
      (a, b) => {
        switch (catalogFilter) {
          case "top":
            return (
              b.engagementScore -
              a.engagementScore
            );

          case "plays":
            return b.plays - a.plays;

          case "retention":
            return (
              b.completionRate -
              a.completionRate
            );

          case "replays":
            return (
              b.replayRate -
              a.replayRate
            );

          case "attention":
            return (
              b.skipRate -
              a.skipRate
            );

          case "all":
          default:
            return a.title.localeCompare(
              b.title
            );
        }
      }
    );
  }, [
    songs,
    catalogFilter,
    catalogSearch,
  ]);

  // ======================================================
  // PRIVATE DEEP ANALYTICS
  // ======================================================

  const deepAnalytics = useQuery(
    api.deepAnalytics.getArtistDeepSongAnalytics,
    selectedSongId
      ? {
          songId: selectedSongId,
        }
      : "skip"
  );

  // ======================================================
  // LOADING MEMBERSHIP
  // ======================================================

  if (memberships === undefined) {
    return (
      <PageLoading
        message="Loading artist analytics..."
      />
    );
  }

  // ======================================================
  // NO ARTIST MEMBERSHIP
  // ======================================================

  if (!activeMembership || !artistId) {
    return (
      <div
        className="
          relative
          w-full
          bg-[#15171c]
          px-4
          py-8
          text-white
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-3xl
            flex-col
            items-center
            justify-center
            rounded-3xl
            border
            border-white/[0.08]
            bg-[#1b1d23]
            px-6
            py-16
            text-center
          "
        >
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              border
              border-white/[0.08]
              bg-white/[0.04]
            "
          >
            <BarChart3
              size={24}
              className="text-white/55"
            />
          </div>

          <h1
            className="
              mt-5
              text-2xl
              font-semibold
              tracking-tight
            "
          >
            No artist workspace selected
          </h1>

          <p
            className="
              mt-2
              max-w-lg
              text-sm
              leading-6
              text-white/45
            "
          >
            Artist analytics requires an active
            artist workspace. Platform-wide artist
            selection can be added later without
            changing the normal artist experience.
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // SONGS LOADING
  // ======================================================

  if (songs === undefined) {
    return (
      <PageLoading
        message="Loading catalog analytics..."
      />
    );
  }

  // ======================================================
  // EMPTY CATALOG
  // ======================================================

  if (songs.length === 0) {
    return (
      <div
        className="
          relative
          w-full
          bg-[#15171c]
          px-4
          py-8
          text-white
          sm:px-6
          lg:px-8
        "
      >
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
              -right-24
              -top-28
              h-96
              w-96
              rounded-full
              bg-violet-500/[0.06]
              blur-3xl
            "
          />
        </div>

        <div
          className="
            relative
            mx-auto
            max-w-7xl
          "
        >
          <PageHeader
            artistName={
              artist?.name ??
              "Artist"
            }
          />

          <div
            className="
              mt-8
              flex
              flex-col
              items-center
              justify-center
              rounded-3xl
              border
              border-white/[0.08]
              bg-[#1b1d23]
              px-6
              py-16
              text-center
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                border-white/[0.08]
                bg-white/[0.04]
              "
            >
              <Disc3
                size={24}
                className="text-white/50"
              />
            </div>

            <h2
              className="
                mt-5
                text-xl
                font-semibold
                tracking-tight
              "
            >
              No songs yet
            </h2>

            <p
              className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-white/45
              "
            >
              Once this artist has songs in the
              catalog, their real listening and
              performance analytics will appear
              here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div
      ref={analyticsTopRef}
      className="
        relative
        w-full
        scroll-mt-4
        bg-[#15171c]
        pb-20
        text-white
      "
    >
      {/* ==================================================
          AMBIENCE
      ================================================== */}

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
            -right-24
            -top-32
            h-[430px]
            w-[430px]
            rounded-full
            bg-violet-500/[0.055]
            blur-3xl
          "
        />

        <div
          className="
            absolute
            left-[30%]
            top-[420px]
            h-[340px]
            w-[340px]
            rounded-full
            bg-blue-500/[0.025]
            blur-3xl
          "
        />
      </div>

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1500px]
          px-4
          py-7
          sm:px-6
          lg:px-8
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <PageHeader
          artistName={
            artist?.name ??
            "Artist"
          }
        />

        {/* =================================================
            SELECTED SONG HERO
        ================================================= */}

        {selectedSong && (
          <section
            className="
              mt-7
              overflow-hidden
              rounded-3xl
              border
              border-white/[0.08]
              bg-[#1b1d23]
              shadow-[0_24px_70px_rgba(0,0,0,0.18)]
            "
          >
            <div
              className="
                relative
                flex
                flex-col
                gap-6
                p-5
                sm:p-6
                lg:flex-row
                lg:items-center
                lg:p-7
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-violet-500/[0.035]
                  via-transparent
                  to-transparent
                "
              />

              <SongArtwork
                src={selectedSong.coverImage}
                title={selectedSong.title}
                size="large"
              />

              <div
                className="
                  relative
                  min-w-0
                  flex-1
                "
              >
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      rounded-full
                      border
                      border-white/[0.08]
                      bg-white/[0.04]
                      px-2.5
                      py-1
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-white/45
                    "
                  >
                    Selected track
                  </span>

                  <span
                    className={`
                      rounded-full
                      border
                      px-2.5
                      py-1
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      ${
                        selectedSong.isActive
                          ? "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300/80"
                          : "border-white/[0.08] bg-white/[0.04] text-white/40"
                      }
                    `}
                  >
                    {selectedSong.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                <h2
                  className="
                    mt-3
                    truncate
                    text-2xl
                    font-semibold
                    tracking-[-0.03em]
                    sm:text-3xl
                  "
                >
                  {selectedSong.title}
                </h2>

                <div
                  className="
                    mt-2
                    flex
                    flex-wrap
                    items-center
                    gap-x-3
                    gap-y-1
                    text-sm
                    text-white/40
                  "
                >
                  <span>
                    {selectedSong.artistName}
                  </span>

                  {selectedSong.genre && (
                    <>
                      <span className="text-white/20">
                        •
                      </span>

                      <span>
                        {selectedSong.genre}
                      </span>
                    </>
                  )}

                  {typeof selectedSong.duration ===
                    "number" && (
                    <>
                      <span className="text-white/20">
                        •
                      </span>

                      <span>
                        {formatDuration(
                          selectedSong.duration
                        )}
                      </span>
                    </>
                  )}
                </div>

                <div
                  className="
                    mt-5
                    flex
                    items-center
                    gap-2
                    text-xs
                    text-white/35
                  "
                >
                  <Radio size={13} />

                  Private artist analytics
                </div>
              </div>

              <div
                className="
                  relative
                  grid
                  grid-cols-2
                  gap-2
                  sm:grid-cols-4
                  lg:w-auto
                  lg:grid-cols-2
                "
              >
                <MiniStat
                  label="Plays"
                  value={formatNumber(
                    selectedSong.plays
                  )}
                />

                <MiniStat
                  label="Listeners"
                  value={formatNumber(
                    selectedSong.uniqueListeners
                  )}
                />

                <MiniStat
                  label="Replays"
                  value={formatNumber(
                    selectedSong.replays
                  )}
                />

                <MiniStat
                  label="Skips"
                  value={formatNumber(
                    selectedSong.skips
                  )}
                />
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            DEEP ANALYTICS LOADING
        ================================================= */}

        {selectedSongId &&
          deepAnalytics === undefined && (
            <DeepAnalyticsLoading />
          )}

        {/* =================================================
            DEEP ANALYTICS
        ================================================= */}

        {selectedSong &&
          deepAnalytics !== undefined && (
            <>
              {/* ===========================================
                  KPI GRID
              =========================================== */}

              <section
                className="
                  mt-5
                  grid
                  grid-cols-2
                  gap-3
                  md:grid-cols-3
                  xl:grid-cols-6
                "
              >
                <MetricCard
                  label="Plays"
                  value={formatNumber(
                    deepAnalytics.plays
                  )}
                  sublabel="Recorded starts"
                  icon={
                    <Play size={17} />
                  }
                />

                <MetricCard
                  label="Unique listeners"
                  value={formatNumber(
                    deepAnalytics.uniqueListeners
                  )}
                  sublabel="Distinct listeners"
                  icon={
                    <Users size={17} />
                  }
                />

                <MetricCard
                  label="Completion"
                  value={formatPercent(
                    deepAnalytics.completionRate
                  )}
                  sublabel="90%+ consumed"
                  icon={
                    <Target size={17} />
                  }
                />

                <MetricCard
                  label="Replay rate"
                  value={formatPercent(
                    deepAnalytics.replayRate
                  )}
                  sublabel={`${formatNumber(
                    deepAnalytics.replays
                  )} replays`}
                  icon={
                    <Repeat2 size={17} />
                  }
                />

                <MetricCard
                  label="Skip rate"
                  value={formatPercent(
                    deepAnalytics.skipRate
                  )}
                  sublabel={`${formatNumber(
                    deepAnalytics.skips
                  )} skips`}
                  icon={
                    <SkipForward size={17} />
                  }
                />

                <MetricCard
                  label="Avg listen"
                  value={formatDuration(
                    deepAnalytics.avgDuration
                  )}
                  sublabel="Actual heard time"
                  icon={
                    <Clock3 size={17} />
                  }
                />
              </section>

              {/* ===========================================
                  MAIN GRID
              =========================================== */}

              <section
                className="
                  mt-5
                  grid
                  gap-5
                  xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.7fr)]
                "
              >
                {/* =========================================
                    RETENTION
                ========================================= */}

                <AnalyticsCard>
                  <SectionHeader
                    icon={
                      <TrendingUp size={18} />
                    }
                    title="Listener retention"
                    description="How far listeners actually reached through the track."
                  />

                  <div className="mt-7">
                    <RetentionChart
                      start={
                        deepAnalytics.retention.start
                      }
                      ten={
                        deepAnalytics.retention
                          .tenPercent
                      }
                      twentyFive={
                        deepAnalytics.retention
                          .twentyFivePercent
                      }
                      fifty={
                        deepAnalytics.retention
                          .fiftyPercent
                      }
                      seventyFive={
                        deepAnalytics.retention
                          .seventyFivePercent
                      }
                      ninety={
                        deepAnalytics.retention
                          .ninetyPercent
                      }
                    />
                  </div>

                  <div
                    className="
                      mt-6
                      rounded-2xl
                      border
                      border-white/[0.07]
                      bg-white/[0.025]
                      px-4
                      py-3.5
                      text-xs
                      leading-5
                      text-white/35
                    "
                  >
                    Retention checkpoints show
                    listeners who actually reached
                    each position in the song.
                    Completion is measured separately
                    using real listened coverage.
                  </div>
                </AnalyticsCard>

                {/* =========================================
                    INSIGHTS
                ========================================= */}

                <AnalyticsCard>
                  <SectionHeader
                    icon={
                      <Sparkles size={18} />
                    }
                    title="Signals"
                    description="Behavioral signals from this track."
                  />

                  <div
                    className="
                      mt-6
                      space-y-2.5
                    "
                  >
                    <SignalRow
                      icon={
                        <Repeat2 size={16} />
                      }
                      label="Sticky"
                      description="Strong replay behavior"
                      active={
                        deepAnalytics.isSticky
                      }
                      activeLabel="Detected"
                      inactiveLabel="Not detected"
                    />

                    <SignalRow
                      icon={
                        <AlertTriangle
                          size={16}
                        />
                      }
                      label="Drop-off"
                      description="High skip behavior"
                      active={
                        deepAnalytics.isDropOff
                      }
                      activeLabel="Detected"
                      inactiveLabel="Healthy"
                      danger
                    />

                    <SignalRow
                      icon={
                        <Zap size={16} />
                      }
                      label="Hit signal"
                      description="Completion + replay signal"
                      active={
                        deepAnalytics.isHit
                      }
                      activeLabel="Detected"
                      inactiveLabel="Not detected"
                    />
                  </div>

                  <div
                    className="
                      mt-5
                      grid
                      grid-cols-2
                      gap-3
                    "
                  >
                    <SmallScoreCard
                      label="Engagement"
                      value={formatNumber(
                        deepAnalytics.engagementScore
                      )}
                    />

                    <SmallScoreCard
                      label="Retention strength"
                      value={formatSignedNumber(
                        deepAnalytics
                          .retentionStrength
                      )}
                    />
                  </div>
                </AnalyticsCard>
              </section>

              {/* ===========================================
                  LISTENING QUALITY
              =========================================== */}

              <section
                className="
                  mt-5
                  grid
                  gap-5
                  lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]
                "
              >
                <AnalyticsCard>
                  <SectionHeader
                    icon={
                      <Headphones size={18} />
                    }
                    title="Listening quality"
                    description="How deeply people are actually consuming this song."
                  />

                  <div
                    className="
                      mt-6
                      grid
                      grid-cols-2
                      gap-3
                      sm:grid-cols-3
                    "
                  >
                    <QualityStat
                      label="Avg listen time"
                      value={formatDuration(
                        deepAnalytics.avgDuration
                      )}
                      icon={
                        <Clock3 size={16} />
                      }
                    />

                    <QualityStat
                      label="Completion"
                      value={formatPercent(
                        deepAnalytics
                          .completionRate
                      )}
                      icon={
                        <CheckCircle2
                          size={16}
                        />
                      }
                    />

                    <QualityStat
                      label="Listener quality"
                      value={formatPercent(
                        deepAnalytics
                          .listenerQuality
                      )}
                      icon={
                        <Activity size={16} />
                      }
                    />

                    <QualityStat
                      label="Full plays"
                      value={formatNumber(
                        deepAnalytics.fullPlays
                      )}
                      icon={
                        <Play size={16} />
                      }
                    />

                    <QualityStat
                      label="Short plays"
                      value={formatNumber(
                        deepAnalytics.shortPlays
                      )}
                      icon={
                        <SkipForward
                          size={16}
                        />
                      }
                    />

                    <QualityStat
                      label="Session depth"
                      value={formatDecimal(
                        deepAnalytics
                          .avgSessionDepth
                      )}
                      icon={
                        <BarChart3
                          size={16}
                        />
                      }
                    />
                  </div>
                </AnalyticsCard>

                {/* =========================================
                    PERFORMANCE BREAKDOWN
                ========================================= */}

                <AnalyticsCard>
                  <SectionHeader
                    icon={
                      <Activity size={18} />
                    }
                    title="Performance"
                    description="Core behavior for the selected track."
                  />

                  <div
                    className="
                      mt-5
                      divide-y
                      divide-white/[0.06]
                    "
                  >
                    <PerformanceRow
                      label="Plays"
                      value={formatNumber(
                        deepAnalytics.plays
                      )}
                    />

                    <PerformanceRow
                      label="Unique listeners"
                      value={formatNumber(
                        deepAnalytics
                          .uniqueListeners
                      )}
                    />

                    <PerformanceRow
                      label="Replays"
                      value={formatNumber(
                        deepAnalytics.replays
                      )}
                    />

                    <PerformanceRow
                      label="Skips"
                      value={formatNumber(
                        deepAnalytics.skips
                      )}
                    />

                    <PerformanceRow
                      label="Replay rate"
                      value={formatPercent(
                        deepAnalytics
                          .replayRate
                      )}
                    />

                    <PerformanceRow
                      label="Skip rate"
                      value={formatPercent(
                        deepAnalytics
                          .skipRate
                      )}
                    />

                    <PerformanceRow
                      label="Completion rate"
                      value={formatPercent(
                        deepAnalytics
                          .completionRate
                      )}
                    />
                  </div>
                </AnalyticsCard>
              </section>
            </>
          )}

        {/* =================================================
          CATALOG PERFORMANCE
      ================================================= */}
      <section className="mt-5">
        <AnalyticsCard>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              icon={<ListMusic size={18} />}
              title="Catalog performance"
              description="Rank, compare and open song-level analytics across your catalog."
            />

            <div className="text-xs text-white/35">
              {catalogSongs.length} of{" "}
              {songs.length}{" "}
              {songs.length === 1
                ? "track"
                : "tracks"}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <CatalogFilterButton
                active={
                  catalogFilter === "top"
                }
                onClick={() =>
                  setCatalogFilter("top")
                }
                icon={<Trophy size={12} />}
              >
                Top Performing
              </CatalogFilterButton>

              <CatalogFilterButton
                active={
                  catalogFilter === "plays"
                }
                onClick={() =>
                  setCatalogFilter("plays")
                }
              >
                Most Played
              </CatalogFilterButton>

              <CatalogFilterButton
                active={
                  catalogFilter === "retention"
                }
                onClick={() =>
                  setCatalogFilter("retention")
                }
              >
                Best Retention
              </CatalogFilterButton>

              <CatalogFilterButton
                active={
                  catalogFilter === "replays"
                }
                onClick={() =>
                  setCatalogFilter("replays")
                }
              >
                Most Replayed
              </CatalogFilterButton>

              <CatalogFilterButton
                active={
                  catalogFilter === "attention"
                }
                onClick={() =>
                  setCatalogFilter("attention")
                }
                icon={
                  <AlertTriangle size={12} />
                }
              >
                Needs Attention
              </CatalogFilterButton>

              <CatalogFilterButton
                active={
                  catalogFilter === "all"
                }
                onClick={() =>
                  setCatalogFilter("all")
                }
              >
                All Songs
              </CatalogFilterButton>
            </div>

            <div className="flex h-10 w-full items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 transition focus-within:border-violet-400/20 focus-within:bg-violet-400/[0.04] xl:w-[290px]">
              <Search
                size={14}
                className="shrink-0 text-white/25"
              />

              <input
                value={catalogSearch}
                onChange={(event) =>
                  setCatalogSearch(
                    event.target.value
                  )
                }
                placeholder="Search songs..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-white/30">
            <span className="rounded-full border border-violet-400/12 bg-violet-400/[0.045] px-2.5 py-1 text-violet-100/55">
              {getCatalogViewLabel(
                catalogFilter
              )}
            </span>

            <span>
              Click a track to load its
              full analytics above.
            </span>
          </div>

          {catalogSongs.length > 0 ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.065] bg-black/[0.08]">
              <div className="hidden grid-cols-[52px_minmax(0,1fr)_90px_90px_90px_90px_48px] items-center gap-3 border-b border-white/[0.07] px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.13em] text-white/22 lg:grid">
                <span>Rank</span>
                <span>Track</span>
                <span className="text-right">
                  Plays
                </span>
                <span className="text-right">
                  Listeners
                </span>
                <span className="text-right">
                  Completion
                </span>
                <span className="text-right">
                  Replay
                </span>
                <span />
              </div>

              {catalogSongs.map(
                (song, index) => {
                  const isSelected =
                    song.songId ===
                    selectedSongId;

                  const tag =
                    getSongTag(song);

                  return (
                    <button
                      key={song.songId}
                      type="button"
                      onClick={() =>
                        handleSelectSong(
                          song.songId
                        )
                      }
                      className={`
                        group
                        grid
                        w-full
                        grid-cols-[42px_minmax(0,1fr)_40px]
                        items-center
                        gap-3
                        border-b
                        border-white/[0.06]
                        px-3
                        py-3.5
                        text-left
                        transition
                        last:border-b-0
                        lg:grid-cols-[52px_minmax(0,1fr)_90px_90px_90px_90px_48px]
                        lg:px-4
                        ${
                          isSelected
                            ? "bg-violet-400/[0.075]"
                            : "hover:bg-white/[0.035]"
                        }
                      `}
                    >
                      <div className="flex items-center">
                        <span
                          className={`
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            border
                            text-xs
                            font-semibold
                            tabular-nums
                            ${
                              index < 3 &&
                              catalogFilter === "top"
                                ? "border-violet-400/15 bg-violet-400/[0.07] text-violet-100/70"
                                : "border-white/[0.06] bg-white/[0.025] text-white/30"
                            }
                          `}
                        >
                          {index + 1}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-center gap-3">
                        <SongArtwork
                          src={song.coverImage}
                          title={song.title}
                          size="small"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 items-center gap-2">
                            <p className="truncate text-sm font-medium text-white/90">
                              {song.title}
                            </p>

                            {!song.isActive && (
                              <span className="shrink-0 rounded-full border border-white/[0.07] bg-white/[0.035] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-white/35">
                                Inactive
                              </span>
                            )}
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="text-[10px] text-white/28">
                              {song.genre ?? "Song"}
                            </span>

                            {tag && (
                              <SongTag
                                label={tag.label}
                                tone={tag.tone}
                              />
                            )}
                          </div>

                          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-white/32 lg:hidden">
                            <span>
                              {formatNumber(
                                song.plays
                              )}{" "}
                              plays
                            </span>

                            <span>
                              {formatNumber(
                                song.uniqueListeners
                              )}{" "}
                              listeners
                            </span>

                            <span>
                              {formatPercent(
                                song.completionRate
                              )}{" "}
                              completion
                            </span>
                          </div>
                        </div>
                      </div>

                      <CatalogMetric
                        value={formatNumber(
                          song.plays
                        )}
                      />

                      <CatalogMetric
                        value={formatNumber(
                          song.uniqueListeners
                        )}
                      />

                      <CatalogMetric
                        value={formatPercent(
                          song.completionRate
                        )}
                      />

                      <CatalogMetric
                        value={formatPercent(
                          song.replayRate
                        )}
                      />

                      <div
                        className={`
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          transition
                          ${
                            isSelected
                              ? "border-violet-300/20 bg-violet-300/10 text-violet-200"
                              : "border-white/[0.07] bg-white/[0.025] text-white/30 group-hover:text-white/65"
                          }
                        `}
                      >
                        <ChevronRight
                          size={15}
                        />
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] px-6 py-12 text-center">
              <Search
                size={20}
                className="mx-auto text-white/15"
              />

              <p className="mt-4 text-sm font-medium text-white/45">
                No songs match this view.
              </p>

              <p className="mt-1 text-xs text-white/25">
                Try another performance
                filter or clear your search.
              </p>

              <button
                type="button"
                onClick={() => {
                  setCatalogFilter("top");
                  setCatalogSearch("");
                }}
                className="mt-5 inline-flex h-9 items-center rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs text-white/45 transition hover:bg-white/[0.05] hover:text-white/70"
              >
                Reset catalog
              </button>
            </div>
          )}
        </AnalyticsCard>
      </section>
    </div>
  </div>
);
}

// ========================================================
// HEADER
// ========================================================

function PageHeader({
  artistName,
}: {
  artistName: string;
}) {
  return (
    <header
      className="
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-end
        sm:justify-between
      "
    >
      <div>
        <div
          className="
            flex
            items-center
            gap-2
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-white/35
          "
        >
          <BarChart3 size={13} />
          Artist Dashboard
        </div>

        <h1
          className="
            mt-2
            text-3xl
            font-semibold
            tracking-[-0.04em]
            sm:text-4xl
          "
        >
          Analytics
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-white/40
          "
        >
          Performance and listener behavior
          for{" "}
          <span className="text-white/65">
            {artistName}
          </span>
          .
        </p>
      </div>
    </header>
  );
}

// ========================================================
// PAGE LOADING
// ========================================================

function PageLoading({
  message,
}: {
  message: string;
}) {
  return (
    <div
      className="
        relative
        flex
        min-h-[520px]
        w-full
        items-center
        justify-center
        bg-[#15171c]
        px-4
        text-white
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
          text-sm
          text-white/40
        "
      >
        <Loader2
          size={18}
          className="animate-spin"
        />

        {message}
      </div>
    </div>
  );
}

// ========================================================
// DEEP ANALYTICS LOADING
// ========================================================

function DeepAnalyticsLoading() {
  return (
    <div
      className="
        mt-5
        grid
        grid-cols-2
        gap-3
        md:grid-cols-3
        xl:grid-cols-6
      "
    >
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="
            h-[126px]
            animate-pulse
            rounded-2xl
            border
            border-white/[0.06]
            bg-[#1b1d23]
          "
        />
      ))}
    </div>
  );
}

// ========================================================
// ANALYTICS CARD
// ========================================================

function AnalyticsCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-white/[0.075]
        bg-[#1b1d23]
        p-5
        shadow-[0_20px_60px_rgba(0,0,0,0.14)]
        sm:p-6
      "
    >
      {children}
    </div>
  );
}

// ========================================================
// SECTION HEADER
// ========================================================

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <span className="text-white/45">
          {icon}
        </span>

        <h2
          className="
            text-base
            font-semibold
            tracking-tight
          "
        >
          {title}
        </h2>
      </div>

      <p
        className="
          mt-1.5
          text-xs
          leading-5
          text-white/35
        "
      >
        {description}
      </p>
    </div>
  );
}

// ========================================================
// METRIC CARD
// ========================================================

function MetricCard({
  label,
  value,
  sublabel,
  icon,
}: {
  label: string;
  value: string;
  sublabel: string;
  icon: ReactNode;
}) {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-white/[0.075]
        bg-[#1b1d23]
        p-4
        transition
        hover:border-white/[0.11]
        hover:bg-[#202229]
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <p
          className="
            text-[11px]
            font-medium
            text-white/40
          "
        >
          {label}
        </p>

        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-xl
            border
            border-white/[0.07]
            bg-white/[0.035]
            text-white/40
            transition
            group-hover:text-white/65
          "
        >
          {icon}
        </div>
      </div>

      <p
        className="
          mt-3
          text-2xl
          font-semibold
          tracking-[-0.03em]
        "
      >
        {value}
      </p>

      <p
        className="
          mt-1
          truncate
          text-[10px]
          text-white/30
        "
      >
        {sublabel}
      </p>
    </div>
  );
}

// ========================================================
// MINI STAT
// ========================================================

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        min-w-[100px]
        rounded-xl
        border
        border-white/[0.07]
        bg-black/[0.12]
        px-3.5
        py-3
      "
    >
      <p
        className="
          text-[10px]
          font-medium
          text-white/35
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-lg
          font-semibold
          tracking-tight
        "
      >
        {value}
      </p>
    </div>
  );
}

// ========================================================
// SONG ARTWORK
// ========================================================

function SongArtwork({
  src,
  title,
  size,
}: {
  src: string | null | undefined;
  title: string;
  size: "small" | "large";
}) {
  const sizeClass =
    size === "large"
      ? "h-28 w-28 sm:h-32 sm:w-32"
      : "h-12 w-12";

  return (
    <div
      className={`
        relative
        shrink-0
        overflow-hidden
        rounded-2xl
        border
        border-white/[0.08]
        bg-[#24262d]
        ${sizeClass}
      `}
    >
      {src ? (
        <img
          src={src}
          alt={`${title} cover`}
          className="
            h-full
            w-full
            object-cover
          "
        />
      ) : (
        <div
          className="
            flex
            h-full
            w-full
            items-center
            justify-center
            bg-gradient-to-br
            from-white/[0.06]
            to-white/[0.015]
          "
        >
          <Music2
            size={
              size === "large"
                ? 28
                : 17
            }
            className="text-white/25"
          />
        </div>
      )}
    </div>
  );
}

// ========================================================
// RETENTION
// ========================================================

function RetentionChart({
  start,
  ten,
  twentyFive,
  fifty,
  seventyFive,
  ninety,
}: {
  start: number;
  ten: number;
  twentyFive: number;
  fifty: number;
  seventyFive: number;
  ninety: number;
}) {
  const points = [
    {
      label: "Start",
      value: start,
    },
    {
      label: "10%",
      value: ten,
    },
    {
      label: "25%",
      value: twentyFive,
    },
    {
      label: "50%",
      value: fifty,
    },
    {
      label: "75%",
      value: seventyFive,
    },
    {
      label: "90%",
      value: ninety,
    },
  ];

  return (
    <div className="space-y-4">
      {points.map((point) => {
        const percent =
          start > 0
            ? Math.min(
                100,
                Math.max(
                  0,
                  (point.value / start) *
                    100
                )
              )
            : 0;

        return (
          <div key={point.label}>
            <div
              className="
                mb-2
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    w-10
                    text-xs
                    font-medium
                    text-white/55
                  "
                >
                  {point.label}
                </span>

                <span
                  className="
                    text-[10px]
                    text-white/30
                  "
                >
                  {formatNumber(
                    point.value
                  )}{" "}
                  listeners
                </span>
              </div>

              <span
                className="
                  text-xs
                  font-medium
                  text-white/60
                "
              >
                {formatWholePercent(
                  percent
                )}
              </span>
            </div>

            <div
              className="
                h-2.5
                overflow-hidden
                rounded-full
                bg-white/[0.055]
              "
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-violet-500/70
                  to-blue-400/65
                  transition-[width]
                  duration-500
                "
                style={{
                  width: `${percent}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ========================================================
// SIGNAL ROW
// ========================================================

function SignalRow({
  icon,
  label,
  description,
  active,
  activeLabel,
  inactiveLabel,
  danger = false,
}: {
  icon: ReactNode;
  label: string;
  description: string;
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  danger?: boolean;
}) {
  const activeClasses = danger
    ? "border-rose-400/15 bg-rose-400/[0.055] text-rose-200"
    : "border-violet-400/15 bg-violet-400/[0.055] text-violet-200";

  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-white/[0.065]
        bg-white/[0.025]
        p-3.5
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-white/[0.07]
          bg-white/[0.035]
          text-white/45
        "
      >
        {icon}
      </div>

      <div
        className="
          min-w-0
          flex-1
        "
      >
        <p
          className="
            text-sm
            font-medium
          "
        >
          {label}
        </p>

        <p
          className="
            mt-0.5
            truncate
            text-[10px]
            text-white/30
          "
        >
          {description}
        </p>
      </div>

      <span
        className={`
          shrink-0
          rounded-full
          border
          px-2.5
          py-1
          text-[9px]
          font-semibold
          uppercase
          tracking-wider
          ${
            active
              ? activeClasses
              : "border-white/[0.07] bg-white/[0.03] text-white/35"
          }
        `}
      >
        {active
          ? activeLabel
          : inactiveLabel}
      </span>
    </div>
  );
}

// ========================================================
// SMALL SCORE
// ========================================================

function SmallScoreCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/[0.065]
        bg-white/[0.025]
        p-4
      "
    >
      <p
        className="
          text-[10px]
          text-white/35
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          text-xl
          font-semibold
          tracking-tight
        "
      >
        {value}
      </p>
    </div>
  );
}

// ========================================================
// QUALITY STAT
// ========================================================

function QualityStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/[0.065]
        bg-white/[0.025]
        p-4
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
          text-white/35
        "
      >
        {icon}

        <span
          className="
            text-[10px]
            font-medium
          "
        >
          {label}
        </span>
      </div>

      <p
        className="
          mt-3
          text-xl
          font-semibold
          tracking-tight
        "
      >
        {value}
      </p>
    </div>
  );
}

// ========================================================
// PERFORMANCE ROW
// ========================================================

function PerformanceRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        py-3
        first:pt-0
        last:pb-0
      "
    >
      <span
        className="
          text-xs
          text-white/40
        "
      >
        {label}
      </span>

      <span
        className="
          text-sm
          font-semibold
          text-white/80
        "
      >
        {value}
      </span>
    </div>
  );
}

// ========================================================
// SONG LIST METRIC
// ========================================================


// ========================================================
// CATALOG PERFORMANCE COMPONENTS
// ========================================================

function CatalogFilterButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 whitespace-nowrap
        rounded-full border px-3.5 py-2
        text-[10px] font-medium transition
        ${
          active
            ? "border-violet-400/20 bg-violet-400/[0.08] text-violet-100"
            : "border-white/[0.06] bg-white/[0.018] text-white/35 hover:border-white/[0.11] hover:bg-white/[0.04] hover:text-white/70"
        }
      `}
    >
      {icon}
      {children}
    </button>
  );
}

function CatalogMetric({
  value,
}: {
  value: string;
}) {
  return (
    <div className="hidden text-right lg:block">
      <p className="text-xs font-medium tabular-nums text-white/55">
        {value}
      </p>
    </div>
  );
}

function SongTag({
  label,
  tone,
}: {
  label: string;
  tone: "violet" | "emerald" | "amber" | "blue";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-400/12 bg-emerald-400/[0.05] text-emerald-200/60"
      : tone === "amber"
        ? "border-amber-400/12 bg-amber-400/[0.05] text-amber-200/60"
        : tone === "blue"
          ? "border-blue-400/12 bg-blue-400/[0.05] text-blue-200/60"
          : "border-violet-400/12 bg-violet-400/[0.05] text-violet-200/60";

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.08em] ${toneClass}`}
    >
      {label}
    </span>
  );
}

function getCatalogViewLabel(
  filter: CatalogFilter
) {
  switch (filter) {
    case "top":
      return "Ranked by engagement score";
    case "plays":
      return "Ranked by total plays";
    case "retention":
      return "Ranked by completion";
    case "replays":
      return "Ranked by replay rate";
    case "attention":
      return "High skip / low completion";
    case "all":
      return "All songs A–Z";
    default:
      return "Catalog";
  }
}

function getSongTag(song: {
  replayRate: number;
  skipRate: number;
  completionRate: number;
}) {
  if (song.skipRate >= 0.5) {
    return {
      label: "High Skip",
      tone: "amber" as const,
    };
  }

  if (song.replayRate >= 0.3) {
    return {
      label: "High Replay",
      tone: "violet" as const,
    };
  }

  if (song.completionRate >= 0.75) {
    return {
      label: "Strong Retention",
      tone: "emerald" as const,
    };
  }

  if (
    song.completionRate >= 0.6 &&
    song.replayRate >= 0.2
  ) {
    return {
      label: "Strong Signal",
      tone: "blue" as const,
    };
  }

  return null;
}

// ========================================================
// FORMATTERS
// ========================================================

function formatNumber(
  value: number
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      notation:
        Math.abs(value) >= 10000
          ? "compact"
          : "standard",
      maximumFractionDigits: 1,
    }
  ).format(value);
}

function formatPercent(
  value: number
) {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${(
    value * 100
  ).toFixed(1)}%`;
}

function formatWholePercent(
  value: number
) {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${Math.round(value)}%`;
}

function formatDuration(
  seconds: number
) {
  if (
    !Number.isFinite(seconds) ||
    seconds <= 0
  ) {
    return "0:00";
  }

  const totalSeconds =
    Math.round(seconds);

  const minutes = Math.floor(
    totalSeconds / 60
  );

  const remainingSeconds =
    totalSeconds % 60;

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

function formatDecimal(
  value: number
) {
  if (!Number.isFinite(value)) {
    return "0.0";
  }

  return value.toFixed(1);
}

function formatSignedNumber(
  value: number
) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  if (value > 0) {
    return `+${formatNumber(value)}`;
  }

  return formatNumber(value);
}
