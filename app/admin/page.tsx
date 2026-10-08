"use client";

import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Disc3,
  Gauge,
  Heart,
  LibraryBig,
  Music2,
  Radio,
  Repeat2,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Upload,
  UserRoundCog,
  Users,
  Zap,
} from "lucide-react";

export default function AdminPage() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const songAnalytics = useQuery(api.songAnalytics.getSongAnalytics);

  const songs = songAnalytics ?? [];

  const summary = useMemo(() => {
    const artistNames = new Set(
      songs
        .map((song) => song.artistName)
        .filter(Boolean)
    );

    const totalPlays = songs.reduce(
      (total, song) => total + (song.plays ?? 0),
      0
    );

    const totalListeners = songs.reduce(
      (total, song) => total + (song.uniqueListeners ?? 0),
      0
    );

    const totalReplays = songs.reduce(
      (total, song) => total + (song.replays ?? 0),
      0
    );

    const totalSkips = songs.reduce(
      (total, song) => total + (song.skips ?? 0),
      0
    );

    const totalLikes = songs.reduce(
      (total, song) => total + (song.likes ?? 0),
      0
    );

    const replayRate =
      totalPlays > 0 ? totalReplays / totalPlays : 0;

    const skipRate =
      totalPlays > 0 ? totalSkips / totalPlays : 0;

    const likeRate =
      totalPlays > 0 ? totalLikes / totalPlays : 0;

    const stickySongs = songs.filter(
      (song) => song.isSticky
    ).length;

    const dropOffSongs = songs.filter(
      (song) => song.isDropOff
    ).length;

    const breakoutSongs = songs.filter(
      (song) => song.isBreakout
    ).length;

    return {
      artists: artistNames.size,
      tracks: songs.length,
      totalPlays,
      totalListeners,
      totalReplays,
      totalSkips,
      totalLikes,
      replayRate,
      skipRate,
      likeRate,
      stickySongs,
      dropOffSongs,
      breakoutSongs,
    };
  }, [songs]);

  const topSongs = useMemo(() => {
    return [...songs]
      .sort(
        (a, b) =>
          (b.engagementScore ?? 0) -
          (a.engagementScore ?? 0)
      )
      .slice(0, 5);
  }, [songs]);

  const needsAttention = useMemo(() => {
    return songs
      .filter(
        (song) =>
          song.isDropOff ||
          (song.skipRate ?? 0) > 0.4
      )
      .sort(
        (a, b) =>
          (b.skipRate ?? 0) -
          (a.skipRate ?? 0)
      )
      .slice(0, 4);
  }, [songs]);

  if (
    currentUser === undefined ||
    songAnalytics === undefined
  ) {
    return <AdminLoading />;
  }

  const adminName =
    currentUser?.displayName ||
    currentUser?.username ||
    "Admin";

  return (
    <main className="relative w-full bg-[#15171c] pb-20 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-28 h-[420px] w-[420px] rounded-full bg-violet-500/[0.07] blur-3xl" />
        <div className="absolute left-[28%] top-[520px] h-[320px] w-[320px] rounded-full bg-fuchsia-500/[0.025] blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8">
        <Header adminName={adminName} />

        <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
          <MetricCard
            label="Tracks"
            value={formatNumber(summary.tracks)}
            sublabel="Catalog songs"
            icon={<Music2 size={17} />}
          />

          <MetricCard
            label="Artists"
            value={formatNumber(summary.artists)}
            sublabel="Active catalog names"
            icon={<Users size={17} />}
          />

          <MetricCard
            label="Plays"
            value={formatNumber(summary.totalPlays)}
            sublabel="Recorded starts"
            icon={<Radio size={17} />}
          />

          <MetricCard
            label="Song listeners"
            value={formatNumber(summary.totalListeners)}
            sublabel="Summed per-track uniques"
            icon={<Activity size={17} />}
          />

          <MetricCard
            label="Replay rate"
            value={formatPercent(summary.replayRate)}
            sublabel={`${formatNumber(summary.totalReplays)} replays`}
            icon={<Repeat2 size={17} />}
            tone="positive"
          />

          <MetricCard
            label="Skip rate"
            value={formatPercent(summary.skipRate)}
            sublabel={`${formatNumber(summary.totalSkips)} skips`}
            icon={<TrendingDown size={17} />}
            tone="negative"
          />
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <Panel>
            <SectionHeader
              icon={<Gauge size={18} />}
              title="Platform pulse"
              description="Quick read on catalog engagement across SOA."
              action={
                <Link
                  href="/admin/analytics"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-200/70 transition hover:text-violet-100"
                >
                  Deep analytics
                  <ArrowUpRight size={13} />
                </Link>
              }
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <PulseCard
                label="Sticky tracks"
                value={summary.stickySongs}
                description="Replay rate above 30%"
                icon={<Sparkles size={17} />}
                tone="violet"
              />

              <PulseCard
                label="Breakout signals"
                value={summary.breakoutSongs}
                description="Play + replay momentum"
                icon={<Zap size={17} />}
                tone="green"
              />

              <PulseCard
                label="Drop-off warnings"
                value={summary.dropOffSongs}
                description="Skip rate above 50%"
                icon={<AlertTriangle size={17} />}
                tone="rose"
              />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
              <RateBlock
                label="Replay rate"
                value={summary.replayRate}
                icon={<Repeat2 size={15} />}
              />

              <RateBlock
                label="Like rate"
                value={summary.likeRate}
                icon={<Heart size={15} />}
              />
            </div>
          </Panel>

          <Panel>
            <SectionHeader
              icon={<ShieldCheck size={18} />}
              title="Admin controls"
              description="Fast access to core platform management."
            />

            <div className="mt-5 space-y-2.5">
              <QuickAction
                href="/admin/artists"
                icon={<UserRoundCog size={17} />}
                title="Manage artists"
                description="Artist accounts, access, and roster."
              />

              <QuickAction
                href="/admin/upload"
                icon={<Upload size={17} />}
                title="Upload music"
                description="Create and manage catalog releases."
              />

              <QuickAction
                href="/admin/analytics"
                icon={<BarChart3 size={17} />}
                title="Deep analytics"
                description="Retention and listener behavior."
              />

              <QuickAction
                href="/music"
                icon={<LibraryBig size={17} />}
                title="View public catalog"
                description="Inspect the listener-facing music experience."
              />
            </div>
          </Panel>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.72fr)]">
          <Panel>
            <SectionHeader
              icon={<TrendingUp size={18} />}
              title="Top-performing tracks"
              description="Ranked by current engagement score."
              action={
                <Link
                  href="/admin/analytics"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-200/70 transition hover:text-violet-100"
                >
                  Explore
                  <ArrowUpRight size={13} />
                </Link>
              }
            />

            <div className="mt-5">
              {topSongs.length === 0 ? (
                <EmptyRows text="No song analytics yet." />
              ) : (
                <div className="divide-y divide-white/[0.06]">
                  {topSongs.map((song, index) => (
                    <SongRow
                      key={String(song.songId)}
                      rank={index + 1}
                      title={song.title}
                      artist={song.artistName}
                      plays={song.plays ?? 0}
                      replayRate={song.replayRate ?? 0}
                      engagementScore={
                        song.engagementScore ?? 0
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </Panel>

          <Panel>
            <SectionHeader
              icon={<AlertTriangle size={18} />}
              title="Needs attention"
              description="Tracks with elevated skip behavior."
            />

            <div className="mt-5 space-y-2.5">
              {needsAttention.length === 0 ? (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-300"
                  />
                  <div>
                    <p className="text-sm font-medium text-white/80">
                      Catalog looks healthy
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/30">
                      No elevated drop-off signals right now.
                    </p>
                  </div>
                </div>
              ) : (
                needsAttention.map((song) => (
                  <AttentionRow
                    key={String(song.songId)}
                    title={song.title}
                    artist={song.artistName}
                    skipRate={song.skipRate ?? 0}
                  />
                ))
              )}
            </div>
          </Panel>
        </section>

        <section className="mt-5">
          <Panel>
            <SectionHeader
              icon={<Disc3 size={18} />}
              title="Catalog snapshot"
              description="Current aggregate engagement totals."
            />

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <SnapshotStat
                label="Total likes"
                value={formatNumber(summary.totalLikes)}
              />
              <SnapshotStat
                label="Total replays"
                value={formatNumber(summary.totalReplays)}
              />
              <SnapshotStat
                label="Total skips"
                value={formatNumber(summary.totalSkips)}
              />
              <SnapshotStat
                label="Like rate"
                value={formatPercent(summary.likeRate)}
              />
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function Header({
  adminName,
}: {
  adminName: string;
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
            SOA Control Center
          </span>
        </div>

        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          Welcome back, {adminName}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
          Monitor catalog performance, spot listener trends,
          and jump into the parts of SOA that need attention.
        </p>
      </div>

      <Link
        href="/admin/analytics"
        className="inline-flex w-fit items-center gap-2 rounded-2xl border border-violet-300/15 bg-violet-300/[0.08] px-4 py-2.5 text-xs font-medium text-violet-100 transition hover:border-violet-300/25 hover:bg-violet-300/[0.12]"
      >
        <BarChart3 size={15} />
        Open analytics
        <ArrowUpRight size={13} />
      </Link>
    </header>
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

function Panel({
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
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/[0.055] text-violet-200/75">
          {icon}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white/90">
            {title}
          </h2>
          <p className="mt-1 text-xs leading-5 text-white/30">
            {description}
          </p>
        </div>
      </div>

      {action}
    </div>
  );
}

function PulseCard({
  label,
  value,
  description,
  icon,
  tone,
}: {
  label: string;
  value: number;
  description: string;
  icon: ReactNode;
  tone: "violet" | "green" | "rose";
}) {
  const classes = {
    violet: {
      wrap: "border-violet-400/10 bg-violet-400/[0.04]",
      icon: "text-violet-200",
    },
    green: {
      wrap: "border-emerald-400/10 bg-emerald-400/[0.035]",
      icon: "text-emerald-300",
    },
    rose: {
      wrap: "border-rose-400/10 bg-rose-400/[0.035]",
      icon: "text-rose-300",
    },
  }[tone];

  return (
    <div
      className={`rounded-2xl border p-4 ${classes.wrap}`}
    >
      <div className={classes.icon}>{icon}</div>
      <p className="mt-4 text-2xl font-semibold">
        {formatNumber(value)}
      </p>
      <p className="mt-1 text-xs font-medium text-white/60">
        {label}
      </p>
      <p className="mt-1 text-[11px] text-white/25">
        {description}
      </p>
    </div>
  );
}

function RateBlock({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  const width = Math.min(100, Math.max(0, value * 100));

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/45">
          {icon}
          <span className="text-xs">{label}</span>
        </div>
        <span className="text-xs font-semibold text-violet-200/80">
          {formatPercent(value)}
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
          style={{
            width: `${width}%`,
          }}
        />
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition hover:border-violet-300/15 hover:bg-violet-300/[0.04]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-white/35 transition group-hover:border-violet-300/15 group-hover:text-violet-200">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white/80">
          {title}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-white/28">
          {description}
        </p>
      </div>

      <ArrowUpRight
        size={14}
        className="text-white/20 transition group-hover:text-violet-200"
      />
    </Link>
  );
}

function SongRow({
  rank,
  title,
  artist,
  plays,
  replayRate,
  engagementScore,
}: {
  rank: number;
  title: string;
  artist: string;
  plays: number;
  replayRate: number;
  engagementScore: number;
}) {
  return (
    <div className="grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-3 py-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-xs font-semibold text-white/35">
        {rank}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white/80">
          {title}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-white/28">
          {artist} · {formatNumber(plays)} plays ·{" "}
          {formatPercent(replayRate)} replay
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-violet-200/80">
          {formatSignedNumber(engagementScore)}
        </p>
        <p className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-white/20">
          score
        </p>
      </div>
    </div>
  );
}

function AttentionRow({
  title,
  artist,
  skipRate,
}: {
  title: string;
  artist: string;
  skipRate: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-rose-400/[0.09] bg-rose-400/[0.025] p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-400/[0.07] text-rose-300">
        <AlertTriangle size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white/80">
          {title}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-white/28">
          {artist}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-rose-300">
          {formatPercent(skipRate)}
        </p>
        <p className="text-[9px] uppercase tracking-[0.12em] text-white/20">
          skip
        </p>
      </div>
    </div>
  );
}

function SnapshotStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-white/25">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-white/85">
        {value}
      </p>
    </div>
  );
}

function EmptyRows({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-8 text-center text-sm text-white/30">
      {text}
    </div>
  );
}

function AdminLoading() {
  return (
    <div className="w-full bg-[#15171c] px-4 py-7 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="h-8 w-56 animate-pulse rounded-xl bg-white/[0.06]" />
        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded-lg bg-white/[0.035]" />

        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[118px] animate-pulse rounded-2xl border border-white/[0.06] bg-[#1b1d23]"
            />
          ))}
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <div className="h-[360px] animate-pulse rounded-3xl border border-white/[0.06] bg-[#1b1d23]" />
          <div className="h-[360px] animate-pulse rounded-3xl border border-white/[0.06] bg-[#1b1d23]" />
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

function formatSignedNumber(value: number) {
  const safeValue = Number(value ?? 0);

  if (safeValue > 0) {
    return `+${formatNumber(safeValue)}`;
  }

  return formatNumber(safeValue);
}

