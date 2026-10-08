"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Disc3,
  Hash,
  ImageOff,
  Layers3,
  Music2,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

export default function ArtistReleasePage() {
  const params = useParams<{
    projectId: string;
  }>();

  const projectId =
    params.projectId as Id<"projects">;

  const project = useQuery(
    api.projects.getArtistProjectForDashboard,
    { projectId }
  );

  if (project === undefined) {
    return <ReleaseLoading />;
  }

  if (!project) {
    return <ReleaseNotFound />;
  }

  const releaseDate =
    project.releaseDate ??
    project.createdAt;

  const formattedDate =
    new Date(
      releaseDate
    ).toLocaleDateString(
      undefined,
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );

  const totalDuration =
    project.tracks.reduce(
      (total, track) =>
        total +
        (Number.isFinite(
          track.duration
        )
          ? track.duration
          : 0),
      0
    );

  const activeTracks =
    project.tracks.filter(
      track => track.isActive
    ).length;

  const inactiveTracks =
    project.tracks.length -
    activeTracks;

  const releaseIssues =
    getReleaseIssues({
      coverImage:
        project.coverImage,
      catalogNumber:
        project.catalogNumber,
      trackCount:
        project.tracks.length,
      inactiveTracks,
      isActive:
        project.isActive,
    });

  const healthComplete =
    releaseIssues.length === 0;

  return (
    <main className="relative w-full bg-[#15171c] text-white">
      {/* AMBIENCE */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-600/[0.045] blur-[150px]" />
        <div className="absolute -right-40 top-[30%] h-[460px] w-[460px] rounded-full bg-violet-600/[0.045] blur-[170px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 pb-24 pt-7 sm:px-8 lg:px-10">
        {/* TOP BAR */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/artist-dashboard/releases"
            className="inline-flex w-fit items-center gap-2 text-sm text-white/40 transition hover:text-white/80"
          >
            <ArrowLeft size={15} />
            Releases
          </Link>

          <Link
            href="/artist-dashboard/analytics"
            className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-violet-400/15 bg-violet-500/[0.055] px-4 text-xs font-medium text-violet-100/65 transition hover:border-violet-400/25 hover:bg-violet-500/[0.09] hover:text-violet-100"
          >
            <BarChart3 size={14} />
            Artist Analytics
          </Link>
        </div>

        {/* ==================================================
            RELEASE HERO
        ================================================== */}

        <section className="relative mt-6 overflow-hidden rounded-[30px] border border-white/[0.07] bg-[#1b1d23] shadow-[0_28px_90px_rgba(0,0,0,0.24)]">
          {project.coverImage && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-[0.09] blur-[2px]"
              style={{
                backgroundImage:
                  `url("${project.coverImage}")`,
              }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#1b1d23] via-[#1b1d23]/96 to-[#1a1627]/88" />
          <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full bg-violet-500/[0.10] blur-[120px]" />

          <div className="relative z-10 p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-end">
              {/* COVER */}
              <div className="aspect-square overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#12141a] shadow-2xl shadow-black/40">
                {project.coverImage ? (
                  <img
                    src={
                      project.coverImage
                    }
                    alt={project.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/[0.035] to-violet-500/[0.045]">
                    <Disc3
                      size={58}
                      className="text-violet-100/15"
                    />
                  </div>
                )}
              </div>

              {/* INFO */}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/15 bg-violet-500/[0.055] px-3 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-violet-100/55">
                    <Sparkles
                      size={10}
                    />
                    Release workspace
                  </span>

                  <StatusBadge
                    active={
                      project.isActive
                    }
                  />

                  <span className="rounded-full border border-white/[0.07] bg-black/15 px-3 py-1 text-[9px] uppercase tracking-[0.13em] text-white/30">
                    {formatType(
                      project.type
                    )}
                  </span>
                </div>

                <h1 className="mt-5 text-4xl font-bold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                  {project.name}
                </h1>

                {project.description && (
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">
                    {
                      project.description
                    }
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/40">
                  <Meta
                    icon={
                      <Music2
                        size={15}
                      />
                    }
                  >
                    {
                      project.tracks
                        .length
                    }{" "}
                    {project.tracks
                      .length === 1
                      ? "track"
                      : "tracks"}
                  </Meta>

                  <Meta
                    icon={
                      <CalendarDays
                        size={15}
                      />
                    }
                  >
                    {formattedDate}
                  </Meta>

                  <Meta
                    icon={
                      <Clock3
                        size={15}
                      />
                    }
                  >
                    {formatDuration(
                      totalDuration
                    )}
                  </Meta>

                  <Meta
                    icon={
                      <Hash
                        size={15}
                      />
                    }
                  >
                    {project.catalogNumber ??
                      "No catalog number"}
                  </Meta>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/artist-dashboard/analytics"
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-black transition hover:bg-violet-50"
                  >
                    <BarChart3
                      size={14}
                    />
                    View Analytics
                  </Link>

                  <Link
                    href="/artist-dashboard/releases"
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-xs font-medium text-white/55 transition hover:bg-white/[0.06] hover:text-white/80"
                  >
                    Catalog
                    <ArrowRight
                      size={13}
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* METRICS */}
            <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
              <HeroMetric
                label="Total Plays"
                value={(
                  project.totalPlays ??
                  0
                ).toLocaleString()}
                icon={
                  <BarChart3
                    size={15}
                  />
                }
              />

              <HeroMetric
                label="Tracks"
                value={String(
                  project.tracks
                    .length
                )}
                icon={
                  <Music2
                    size={15}
                  />
                }
              />

              <HeroMetric
                label="Active Tracks"
                value={String(
                  activeTracks
                )}
                icon={
                  <CheckCircle2
                    size={15}
                  />
                }
              />

              <HeroMetric
                label="Runtime"
                value={formatDuration(
                  totalDuration
                )}
                icon={
                  <Clock3
                    size={15}
                  />
                }
              />
            </div>
          </div>
        </section>

        {/* ==================================================
            RELEASE HEALTH
        ================================================== */}

        <section className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.7fr)]">
          <div className="rounded-2xl border border-white/[0.07] bg-[#1b1d23] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-white/25">
                  Release health
                </p>

                <h2 className="mt-1 text-lg font-semibold tracking-tight">
                  {healthComplete
                    ? "Ready to manage"
                    : `${releaseIssues.length} item${releaseIssues.length === 1 ? "" : "s"} need attention`}
                </h2>
              </div>

              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                  healthComplete
                    ? "border-emerald-400/10 bg-emerald-400/[0.04] text-emerald-200/50"
                    : "border-amber-400/10 bg-amber-400/[0.04] text-amber-200/50"
                }`}
              >
                {healthComplete ? (
                  <CheckCircle2
                    size={16}
                  />
                ) : (
                  <AlertTriangle
                    size={16}
                  />
                )}
              </div>
            </div>

            {healthComplete ? (
              <p className="mt-4 text-sm leading-6 text-white/35">
                Cover art, catalog
                information and track
                setup are all present.
              </p>
            ) : (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {releaseIssues.map(
                  issue => (
                    <div
                      key={issue}
                      className="flex items-center gap-2 rounded-xl border border-amber-400/[0.08] bg-amber-400/[0.025] px-3 py-3 text-xs text-amber-100/45"
                    >
                      <AlertTriangle
                        size={13}
                        className="shrink-0"
                      />
                      {issue}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#1b1d23] p-5">
            <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-white/25">
              Track status
            </p>

            <div className="mt-4 space-y-3">
              <StatusRow
                label="Active"
                value={activeTracks}
              />

              <StatusRow
                label="Inactive"
                value={
                  inactiveTracks
                }
              />

              <StatusRow
                label="Total"
                value={
                  project.tracks
                    .length
                }
              />
            </div>
          </div>
        </section>

        {/* ==================================================
            TRACKLIST
        ================================================== */}

        <section className="mt-10">
          <div className="flex flex-col gap-3 border-b border-white/[0.07] pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-violet-200/35">
                Tracklist
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.035em]">
                Songs
              </h2>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-white/30">
                This page is the release
                management view. Use the
                analytics action on each
                song to drill into plays,
                listeners, skips, replays
                and retention for that
                specific track.
              </p>
            </div>

            <span className="text-xs text-white/30">
              {project.tracks.length}{" "}
              {project.tracks.length ===
              1
                ? "track"
                : "tracks"}
            </span>
          </div>

          {project.tracks.length ===
            0 && (
            <div className="mt-5 rounded-2xl border border-dashed border-white/[0.09] bg-white/[0.012] px-5 py-12 text-center">
              <Music2
                size={24}
                className="mx-auto text-white/15"
              />

              <p className="mt-4 text-sm font-medium text-white/45">
                No tracks yet.
              </p>

              <p className="mt-1 text-xs text-white/25">
                Add songs to this
                release before it goes
                live.
              </p>
            </div>
          )}

          {project.tracks.length >
            0 && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1b1d23]">
              <div className="hidden grid-cols-[56px_minmax(0,1fr)_120px_100px_140px] items-center gap-4 border-b border-white/[0.06] px-4 py-3 text-[9px] font-medium uppercase tracking-[0.14em] text-white/20 md:grid">
                <span>#</span>
                <span>Track</span>
                <span>Status</span>
                <span>Time</span>
                <span className="text-right">
                  Action
                </span>
              </div>

              {project.tracks.map(
                track => (
                  <TrackRow
                    key={track._id}
                    track={track}
                  />
                )
              )}
            </div>
          )}
        </section>

        {/* ==================================================
            RELEASE INFORMATION
        ================================================== */}

        <section className="mt-10">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-violet-200/35">
              Metadata
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              Release information
            </h2>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              label="Release Type"
              value={formatType(
                project.type
              )}
            />

            <InfoCard
              label="Status"
              value={
                project.isActive
                  ? "Live"
                  : "Draft"
              }
            />

            <InfoCard
              label="Catalog Number"
              value={
                project.catalogNumber ??
                "Missing"
              }
              warning={
                !project.catalogNumber
              }
            />

            <InfoCard
              label="Total Plays"
              value={(
                project.totalPlays ??
                0
              ).toLocaleString()}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

// ========================================================
// TRACK ROW
// ========================================================

function TrackRow({
  track,
}: {
  track: {
    _id: Id<"songs">;
    title: string;
    genre?: string;
    isActive: boolean;
    duration: number;
    trackNumber: number;
  };
}) {
  return (
    <div className="group grid gap-3 border-b border-white/[0.05] px-4 py-4 transition last:border-b-0 hover:bg-white/[0.025] md:grid-cols-[56px_minmax(0,1fr)_120px_100px_140px] md:items-center md:gap-4">
      <div className="hidden md:flex">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035] text-xs tabular-nums text-white/30">
          {track.trackNumber}
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.035] text-[10px] text-white/30 md:hidden">
            {track.trackNumber}
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white/85">
              {track.title}
            </p>

            <p className="mt-1 truncate text-[10px] text-white/25">
              {track.genre ??
                "No genre"}{" "}
              • Song
            </p>
          </div>
        </div>
      </div>

      <div>
        <TrackStatus
          active={
            track.isActive
          }
        />
      </div>

      <div className="text-xs tabular-nums text-white/30">
        {formatDuration(
          track.duration
        )}
      </div>

      <div className="flex md:justify-end">
        <Link
          href={`/artist-dashboard/analytics?songId=${track._id}`}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-violet-400/12 bg-violet-500/[0.04] px-3 text-[10px] font-medium text-violet-100/50 transition hover:border-violet-400/25 hover:bg-violet-500/[0.08] hover:text-violet-100"
        >
          <BarChart3
            size={13}
          />
          View Analytics
        </Link>
      </div>
    </div>
  );
}

// ========================================================
// TRACK STATUS
// ========================================================

function TrackStatus({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.12em] ${
        active
          ? "border-emerald-400/12 bg-emerald-400/[0.05] text-emerald-200/60"
          : "border-white/[0.08] bg-white/[0.025] text-white/35"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? "bg-emerald-300"
            : "bg-white/20"
        }`}
      />

      {active
        ? "Live"
        : "Inactive"}
    </span>
  );
}

// ========================================================
// RELEASE HEALTH
// ========================================================

function getReleaseIssues({
  coverImage,
  catalogNumber,
  trackCount,
  inactiveTracks,
  isActive,
}: {
  coverImage?: string;
  catalogNumber?: string;
  trackCount: number;
  inactiveTracks: number;
  isActive: boolean;
}) {
  const issues: string[] = [];

  if (!coverImage) {
    issues.push(
      "Cover art is missing"
    );
  }

  if (!catalogNumber) {
    issues.push(
      "Catalog number is missing"
    );
  }

  if (trackCount === 0) {
    issues.push(
      "No tracks have been added"
    );
  }

  if (
    isActive &&
    inactiveTracks > 0
  ) {
    issues.push(
      `${inactiveTracks} inactive track${inactiveTracks === 1 ? "" : "s"} inside a live release`
    );
  }

  return issues;
}

// ========================================================
// HERO METRIC
// ========================================================

function HeroMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-5 bg-[#1b1d23]/90 px-5 py-4 backdrop-blur-xl">
      <div>
        <p className="text-[9px] uppercase tracking-[0.13em] text-white/25">
          {label}
        </p>

        <p className="mt-1 text-2xl font-semibold tracking-[-0.03em]">
          {value}
        </p>
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/[0.035] text-violet-100/35">
        {icon}
      </div>
    </div>
  );
}

// ========================================================
// STATUS ROW
// ========================================================

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.018] px-3 py-3">
      <span className="text-xs text-white/35">
        {label}
      </span>

      <span className="text-sm font-semibold tabular-nums text-white/70">
        {value}
      </span>
    </div>
  );
}

// ========================================================
// META
// ========================================================

function Meta({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-white/25">
        {icon}
      </span>

      {children}
    </div>
  );
}

// ========================================================
// INFO CARD
// ========================================================

function InfoCard({
  label,
  value,
  warning = false,
}: {
  label: string;
  value: string;
  warning?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#1b1d23] p-4">
      <p className="text-[9px] uppercase tracking-[0.14em] text-white/25">
        {label}
      </p>

      <p
        className={`mt-2 text-sm font-medium ${
          warning
            ? "text-amber-200/60"
            : "text-white/80"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

// ========================================================
// STATUS BADGE
// ========================================================

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] ${
        active
          ? "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-200/65"
          : "border-white/[0.08] bg-black/20 text-white/35"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? "bg-emerald-300"
            : "bg-white/20"
        }`}
      />

      {active
        ? "Live"
        : "Draft"}
    </span>
  );
}

// ========================================================
// LOADING
// ========================================================

function ReleaseLoading() {
  return (
    <main className="w-full bg-[#15171c] px-5 py-7 text-white sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1500px] animate-pulse">
        <div className="h-4 w-28 rounded-full bg-white/[0.04]" />

        <section className="mt-6 rounded-[30px] border border-white/[0.06] bg-[#1b1d23] p-8">
          <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-end">
            <div className="aspect-square rounded-[24px] bg-white/[0.045]" />

            <div>
              <div className="h-6 w-36 rounded-full bg-white/[0.04]" />
              <div className="mt-5 h-12 w-72 max-w-full rounded-xl bg-white/[0.07]" />
              <div className="mt-4 h-3 w-[420px] max-w-full rounded-full bg-white/[0.04]" />
              <div className="mt-8 h-10 w-40 rounded-xl bg-white/[0.05]" />
            </div>
          </div>

          <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="h-20 rounded-xl bg-white/[0.035]"
              />
            ))}
          </div>
        </section>

        <div className="mt-8 space-y-3">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <div
              key={index}
              className="h-16 rounded-xl bg-white/[0.025]"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

// ========================================================
// NOT FOUND
// ========================================================

function ReleaseNotFound() {
  return (
    <main className="flex min-h-[60vh] w-full items-center justify-center bg-[#15171c] px-5 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.07] bg-[#1b1d23] p-8 text-center">
        <Disc3
          size={28}
          className="mx-auto text-white/20"
        />

        <h1 className="mt-5 text-xl font-semibold">
          Release not found
        </h1>

        <p className="mt-2 text-sm leading-6 text-white/35">
          This release is not
          available in your artist
          workspace.
        </p>

        <Link
          href="/artist-dashboard/releases"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 text-sm text-white/55 transition hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to releases
        </Link>
      </div>
    </main>
  );
}

// ========================================================
// FORMAT TYPE
// ========================================================

function formatType(
  type?: string
) {
  switch (type) {
    case "single":
      return "Single";
    case "album":
      return "Album";
    case "ep":
      return "EP";
    case "mixtape":
      return "Mixtape";
    case "draft":
      return "Draft";
    default:
      return "Release";
  }
}

// ========================================================
// FORMAT DURATION
// ========================================================

function formatDuration(
  seconds: number
) {
  const safeSeconds =
    Number.isFinite(seconds)
      ? Math.max(
          0,
          Math.floor(seconds)
        )
      : 0;

  const hours =
    Math.floor(
      safeSeconds / 3600
    );

  const minutes =
    Math.floor(
      (safeSeconds % 3600) /
        60
    );

  const remainingSeconds =
    safeSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(
      minutes
    ).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(
      2,
      "0"
    )}`;
  }

  return `${minutes}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}
