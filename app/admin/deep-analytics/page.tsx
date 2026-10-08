"use client";

import { useMemo, useState, type ReactNode } from "react";
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
  Layers3,
  ListMusic,
  Play,
  Radio,
  Repeat2,
  ShieldCheck,
  SkipForward,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export default function DeepAnalyticsPage() {
  const allSongs = useQuery(
    api.songAnalytics.getSongsForAnalyticsSelector
  );

  const safeSongs = allSongs ?? [];

  const [selectedArtist, setSelectedArtist] =
    useState<string>("all");

  const [selectedSongId, setSelectedSongId] =
    useState<Id<"songs"> | null>(null);

  const artists = useMemo(() => {
    return Array.from(
      new Set(safeSongs.map((song) => song.artistName))
    ).sort((a, b) => a.localeCompare(b));
  }, [safeSongs]);

  const filteredSongs = useMemo(() => {
    if (selectedArtist === "all") {
      return safeSongs;
    }

    return safeSongs.filter(
      (song) => song.artistName === selectedArtist
    );
  }, [safeSongs, selectedArtist]);

  const selectedSong = useMemo(() => {
    return (
      filteredSongs.find(
        (song) => song.songId === selectedSongId
      ) ??
      filteredSongs[0] ??
      null
    );
  }, [filteredSongs, selectedSongId]);

  const deepData = useQuery(
    api.deepAnalytics.getDeepSongAnalytics,
    selectedSong
      ? {
          songId: selectedSong.songId,
        }
      : "skip"
  );

  if (allSongs === undefined) {
    return <PageLoading />;
  }

  return (
    <main className="relative w-full bg-[#15171c] pb-20 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-28 -top-32 h-[430px] w-[430px] rounded-full bg-violet-500/[0.07] blur-3xl" />
        <div className="absolute left-[22%] top-[480px] h-[360px] w-[360px] rounded-full bg-fuchsia-500/[0.025] blur-3xl" />
        <div className="absolute bottom-[8%] right-[18%] h-[320px] w-[320px] rounded-full bg-blue-500/[0.02] blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8">
        <PageHeader
          artistCount={artists.length}
          songCount={safeSongs.length}
        />

        <section className="mt-7 grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <FilterCard
              title="Artists"
              description="Filter the platform catalog."
              icon={<Users size={17} />}
            >
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  label="All artists"
                  active={selectedArtist === "all"}
                  onClick={() => {
                    setSelectedArtist("all");
                    setSelectedSongId(null);
                  }}
                />

                {artists.map((artist) => (
                  <FilterChip
                    key={artist}
                    label={artist}
                    active={selectedArtist === artist}
                    onClick={() => {
                      setSelectedArtist(artist);
                      setSelectedSongId(null);
                    }}
                  />
                ))}
              </div>
            </FilterCard>

            <FilterCard
              title="Tracks"
              description={`${filteredSongs.length} ${
                filteredSongs.length === 1 ? "track" : "tracks"
              } in view`}
              icon={<ListMusic size={17} />}
            >
              <div className="space-y-2">
                {filteredSongs.length === 0 ? (
                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-5 text-sm text-white/35">
                    No songs found for this artist.
                  </div>
                ) : (
                  filteredSongs.map((song) => {
                    const active =
                      selectedSong?.songId === song.songId;

                    return (
                      <button
                        key={song.songId}
                        type="button"
                        onClick={() =>
                          setSelectedSongId(song.songId)
                        }
                        className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                          active
                            ? "border-violet-400/20 bg-violet-400/[0.08]"
                            : "border-white/[0.06] bg-white/[0.025] hover:border-white/[0.11] hover:bg-white/[0.045]"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                            active
                              ? "border-violet-300/20 bg-violet-300/10 text-violet-200"
                              : "border-white/[0.07] bg-white/[0.035] text-white/35"
                          }`}
                        >
                          <Disc3 size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white/90">
                            {song.title}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] text-white/35">
                            {song.artistName}
                          </p>
                        </div>

                        <ChevronRight
                          size={15}
                          className={
                            active
                              ? "text-violet-200"
                              : "text-white/25 transition group-hover:text-white/55"
                          }
                        />
                      </button>
                    );
                  })
                )}
              </div>
            </FilterCard>
          </aside>

          <div className="min-w-0">
            {!selectedSong ? (
              <EmptyState />
            ) : (
              <>
                <SelectedTrackHero
                  title={selectedSong.title}
                  artist={selectedSong.artistName}
                />

                {deepData === undefined ? (
                  <AnalyticsLoading />
                ) : (
                  <AnalyticsDashboard data={deepData} />
                )}
              </>
            )}
          </div>
        </section>

        <FormulaReference />
      </div>
    </main>
  );
}

function PageHeader({
  artistCount,
  songCount,
}: {
  artistCount: number;
  songCount: number;
}) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/15 bg-violet-400/[0.07] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-200/80">
            <ShieldCheck size={12} />
            Platform Admin
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/35">
            <Radio size={11} />
            Global analytics
          </span>
        </div>

        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          Deep Analytics
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
          Platform-wide listener behavior, retention, completion,
          replay, and track-quality intelligence.
        </p>
      </div>

      <div className="flex gap-2">
        <HeaderStat
          label="Artists"
          value={formatNumber(artistCount)}
        />
        <HeaderStat
          label="Tracks"
          value={formatNumber(songCount)}
        />
      </div>
    </header>
  );
}

function HeaderStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-[92px] rounded-2xl border border-white/[0.07] bg-[#1b1d23] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-white/90">
        {value}
      </p>
    </div>
  );
}

function FilterCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/[0.07] bg-[#1b1d23] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.14)]">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/[0.055] text-violet-200/70">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-white/85">
            {title}
          </p>
          <p className="mt-0.5 text-[11px] text-white/30">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-violet-300/20 bg-violet-300/10 text-violet-100"
          : "border-white/[0.07] bg-white/[0.025] text-white/45 hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white/75"
      }`}
    >
      {label}
    </button>
  );
}

function SelectedTrackHero({
  title,
  artist,
}: {
  title: string;
  artist: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#1b1d23] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-violet-500/[0.05] via-transparent to-transparent" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-300/[0.08] text-violet-200">
            <Disc3 size={25} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/[0.07] bg-white/[0.035] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                Selected track
              </span>
            </div>

            <h2 className="mt-2 truncate text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
              {title}
            </h2>
            <p className="mt-1 text-sm text-white/40">
              {artist}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-2xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-2.5 text-xs text-white/40 sm:self-auto">
          <Activity size={14} />
          Live backend metrics
        </div>
      </div>
    </section>
  );
}

function AnalyticsDashboard({ data }: { data: any }) {
  return (
    <>
      <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          label="Plays"
          value={formatNumber(data.plays)}
          sublabel="Recorded starts"
          icon={<Play size={17} />}
        />

        <MetricCard
          label="Unique listeners"
          value={formatNumber(data.uniqueListeners)}
          sublabel="Distinct listeners"
          icon={<Users size={17} />}
        />

        <MetricCard
          label="Completion"
          value={formatPercent(data.completionRate)}
          sublabel="90%+ actual coverage"
          icon={<Target size={17} />}
        />

        <MetricCard
          label="Replay rate"
          value={formatPercent(data.replayRate)}
          sublabel={`${formatNumber(data.replays)} replays`}
          icon={<Repeat2 size={17} />}
          tone="positive"
        />

        <MetricCard
          label="Skip rate"
          value={formatPercent(data.skipRate)}
          sublabel={`${formatNumber(data.skips)} skips`}
          icon={<SkipForward size={17} />}
          tone="negative"
        />

        <MetricCard
          label="Avg listen"
          value={formatDuration(data.avgDuration)}
          sublabel="Actual heard time"
          icon={<Clock3 size={17} />}
        />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
        <AnalyticsCard>
          <SectionHeader
            icon={<TrendingUp size={18} />}
            title="Listener retention"
            description="How many listeners actually reached each point in the track."
          />

          <div className="mt-7">
            <RetentionGraph data={data.retention} />
          </div>

          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3.5 text-xs leading-5 text-white/35">
            Retention is positional: a listener counts when they
            actually heard audio crossing that checkpoint. Completion
            is measured separately from real listened coverage.
          </div>
        </AnalyticsCard>

        <AnalyticsCard>
          <SectionHeader
            icon={<Sparkles size={18} />}
            title="Track signals"
            description="Behavioral flags from the selected song."
          />

          <div className="mt-6 space-y-2.5">
            <SignalRow
              icon={<Repeat2 size={16} />}
              label="Sticky"
              description="Replay rate above 30%"
              active={data.isSticky}
              activeLabel="Detected"
              inactiveLabel="Not detected"
            />

            <SignalRow
              icon={<AlertTriangle size={16} />}
              label="Drop-off"
              description="Skip rate above 50%"
              active={data.isDropOff}
              activeLabel="Detected"
              inactiveLabel="Healthy"
              danger
            />

            <SignalRow
              icon={<Zap size={16} />}
              label="Hit signal"
              description="Completion above 60% + replay above 20%"
              active={data.isHit}
              activeLabel="Detected"
              inactiveLabel="Not detected"
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <SmallScoreCard
              label="Engagement"
              value={formatNumber(data.engagementScore)}
            />

            <SmallScoreCard
              label="Retention strength"
              value={formatSignedNumber(data.retentionStrength)}
            />
          </div>
        </AnalyticsCard>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <AnalyticsCard>
          <SectionHeader
            icon={<Headphones size={18} />}
            title="Listening quality"
            description="How deeply listeners are consuming this track."
          />

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <QualityStat
              label="Avg listen time"
              value={formatDuration(data.avgDuration)}
              icon={<Clock3 size={16} />}
            />

            <QualityStat
              label="Completion"
              value={formatPercent(data.completionRate)}
              icon={<CheckCircle2 size={16} />}
            />

            <QualityStat
              label="Listener quality"
              value={formatPercent(data.listenerQuality)}
              icon={<Activity size={16} />}
            />

            <QualityStat
              label="Full plays"
              value={formatNumber(data.fullPlays)}
              icon={<Play size={16} />}
            />

            <QualityStat
              label="Short plays"
              value={formatNumber(data.shortPlays)}
              icon={<SkipForward size={16} />}
            />

            <QualityStat
              label="Session depth"
              value={formatDecimal(data.avgSessionDepth)}
              icon={<BarChart3 size={16} />}
            />
          </div>
        </AnalyticsCard>

        <AnalyticsCard>
          <SectionHeader
            icon={<Layers3 size={18} />}
            title="Behavior breakdown"
            description="Core event and rate relationships."
          />

          <div className="mt-5 divide-y divide-white/[0.06]">
            <PerformanceRow
              label="Plays"
              value={formatNumber(data.plays)}
            />
            <PerformanceRow
              label="Unique listeners"
              value={formatNumber(data.uniqueListeners)}
            />
            <PerformanceRow
              label="Replays"
              value={formatNumber(data.replays)}
            />
            <PerformanceRow
              label="Skips"
              value={formatNumber(data.skips)}
            />
            <PerformanceRow
              label="Replay rate"
              value={formatPercent(data.replayRate)}
            />
            <PerformanceRow
              label="Skip rate"
              value={formatPercent(data.skipRate)}
            />
            <PerformanceRow
              label="Completion rate"
              value={formatPercent(data.completionRate)}
            />
          </div>
        </AnalyticsCard>
      </section>
    </>
  );
}

function AnalyticsCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/[0.07] bg-[#1b1d23] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.14)] sm:p-6">
      {children}
    </div>
  );
}

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
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/[0.055] text-violet-200/75">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white/90">
          {title}
        </h3>
        <p className="mt-1 text-xs leading-5 text-white/30">
          {description}
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sublabel,
  icon,
  tone = "default",
}: {
  label: string;
  value: string;
  sublabel: string;
  icon: ReactNode;
  tone?: "default" | "positive" | "negative";
}) {
  const valueClass =
    tone === "positive"
      ? "text-emerald-300"
      : tone === "negative"
        ? "text-rose-300"
        : "text-white";

  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-[#1b1d23] p-4 transition hover:-translate-y-0.5 hover:border-violet-300/15 hover:bg-[#1e2027]">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
          {label}
        </p>

        <div className="text-white/25 transition group-hover:text-violet-200/65">
          {icon}
        </div>
      </div>

      <p
        className={`mt-3 text-2xl font-semibold tracking-[-0.03em] ${valueClass}`}
      >
        {value}
      </p>

      <p className="mt-1 text-[11px] text-white/25">
        {sublabel}
      </p>
    </div>
  );
}

function RetentionGraph({ data }: { data: any }) {
  const points = [
    { label: "Start", value: data.start },
    { label: "10%", value: data.tenPercent },
    { label: "25%", value: data.twentyFivePercent },
    { label: "50%", value: data.fiftyPercent },
    { label: "75%", value: data.seventyFivePercent },
    { label: "90%", value: data.ninetyPercent },
  ];

  const start = data.start || 0;

  return (
    <div className="space-y-5">
      {points.map((point) => {
        const percent =
          start > 0
            ? Math.min(100, (point.value / start) * 100)
            : 0;

        return (
          <div key={point.label}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-10 text-xs font-medium text-white/55">
                  {point.label}
                </span>
                <span className="text-[11px] text-white/25">
                  {formatNumber(point.value)} listeners
                </span>
              </div>

              <span className="text-xs font-medium text-violet-200/75">
                {percent.toFixed(1)}%
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full border border-white/[0.05] bg-white/[0.04]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-400 to-fuchsia-400 transition-all duration-700"
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
  const activeStyle = danger
    ? "border-rose-400/15 bg-rose-400/[0.055]"
    : "border-violet-400/15 bg-violet-400/[0.055]";

  const iconStyle = active
    ? danger
      ? "text-rose-300"
      : "text-violet-200"
    : "text-white/25";

  const badgeStyle = active
    ? danger
      ? "border-rose-400/15 bg-rose-400/[0.07] text-rose-300"
      : "border-violet-400/15 bg-violet-400/[0.07] text-violet-200"
    : "border-white/[0.06] bg-white/[0.025] text-white/30";

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-3.5 ${
        active
          ? activeStyle
          : "border-white/[0.06] bg-white/[0.02]"
      }`}
    >
      <div className={iconStyle}>{icon}</div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white/80">
          {label}
        </p>
        <p className="mt-0.5 text-[11px] text-white/30">
          {description}
        </p>
      </div>

      <span
        className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${badgeStyle}`}
      >
        {active ? activeLabel : inactiveLabel}
      </span>
    </div>
  );
}

function SmallScoreCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3.5">
      <p className="text-[10px] uppercase tracking-[0.13em] text-white/25">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-white/85">
        {value}
      </p>
    </div>
  );
}

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
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
      <div className="flex items-center gap-2 text-violet-200/60">
        {icon}
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
          {label}
        </p>
      </div>

      <p className="mt-3 text-xl font-semibold text-white/90">
        {value}
      </p>
    </div>
  );
}

function PerformanceRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
      <span className="text-sm text-white/40">
        {label}
      </span>
      <span className="text-sm font-medium text-white/80">
        {value}
      </span>
    </div>
  );
}

function FormulaReference() {
  const items = [
    {
      label: "Plays",
      value: "Total recorded song starts.",
    },
    {
      label: "Unique listeners",
      value: "Distinct users who generated song-play events.",
    },
    {
      label: "Average listen",
      value:
        "Average actual heard time from persisted listen sessions, with legacy duration fallback.",
    },
    {
      label: "Completion rate",
      value:
        "Full plays with at least 90% actual listened coverage ÷ total plays.",
    },
    {
      label: "Retention checkpoint",
      value:
        "Listeners who actually heard audio crossing the 10%, 25%, 50%, 75%, or 90% position.",
    },
    {
      label: "Skip rate",
      value: "Skips ÷ plays.",
    },
    {
      label: "Replay rate",
      value: "Replays ÷ plays.",
    },
    {
      label: "Session depth",
      value:
        "Average number of song-play events across tracked listening sessions.",
    },
    {
      label: "Listener quality",
      value:
        "Completed listeners ÷ unique listeners.",
    },
    {
      label: "Engagement score",
      value: "Plays + (replays × 2) − (skips × 2).",
    },
    {
      label: "Retention strength",
      value:
        "Completed listeners − unique skipped listeners.",
    },
    {
      label: "Sticky",
      value: "Replay rate above 30%.",
    },
    {
      label: "Drop-off",
      value: "Skip rate above 50%.",
    },
    {
      label: "Hit signal",
      value:
        "Completion rate above 60% and replay rate above 20%.",
    },
  ];

  return (
    <section className="mt-5 rounded-3xl border border-white/[0.07] bg-[#1b1d23] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/[0.055] text-violet-200/75">
          <BarChart3 size={18} />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white/90">
            Metric reference
          </h3>
          <p className="mt-1 text-xs leading-5 text-white/30">
            Admin reference for how the current deep analytics
            backend interprets each metric.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-x-8 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="border-b border-white/[0.05] pb-4"
          >
            <p className="text-xs font-medium text-white/70">
              {item.label}
            </p>
            <p className="mt-1 text-[11px] leading-5 text-white/30">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AnalyticsLoading() {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-[118px] animate-pulse rounded-2xl border border-white/[0.06] bg-[#1b1d23]"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-white/[0.07] bg-[#1b1d23] px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035] text-white/35">
        <Disc3 size={24} />
      </div>

      <h2 className="mt-5 text-xl font-semibold">
        No track selected
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
        Choose an artist and track to inspect its platform-wide
        listener behavior.
      </p>
    </div>
  );
}

function PageLoading() {
  return (
    <div className="w-full bg-[#15171c] px-4 py-7 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="h-9 w-56 animate-pulse rounded-xl bg-white/[0.06]" />
        <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded-lg bg-white/[0.035]" />

        <div className="mt-7 grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="h-[520px] animate-pulse rounded-3xl border border-white/[0.06] bg-[#1b1d23]" />
          <div className="h-[520px] animate-pulse rounded-3xl border border-white/[0.06] bg-[#1b1d23]" />
        </div>
      </div>
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatPercent(value: number) {
  return `${((value ?? 0) * 100).toFixed(1)}%`;
}

function formatDuration(value: number) {
  const totalSeconds = Math.max(0, Math.round(value ?? 0));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatDecimal(value: number) {
  return Number(value ?? 0).toFixed(1);
}

function formatSignedNumber(value: number) {
  const safeValue = Number(value ?? 0);

  if (safeValue > 0) {
    return `+${formatNumber(safeValue)}`;
  }

  return formatNumber(safeValue);
}
