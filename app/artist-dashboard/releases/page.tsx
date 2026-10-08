"use client";

import {
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Disc3,
  FileAudio,
  Hash,
  ImageOff,
  Layers3,
  Music2,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// =========================================================
// TYPES
// =========================================================

type Filter =
  | "all"
  | "live"
  | "draft"
  | "attention"
  | "single"
  | "album"
  | "ep"
  | "mixtape";

type SortMode =
  | "newest"
  | "oldest"
  | "name"
  | "status";

type ReleaseProject = {
  _id: string;
  name: string;
  coverImage?: string;
  catalogNumber?: string;
  type?: string;
  releaseDate?: number;
  createdAt: number;
  isActive: boolean;
  trackCount: number;
};

// =========================================================
// PAGE
// =========================================================

export default function ArtistReleasesPage() {
  const [filter, setFilter] =
    useState<Filter>("all");

  const [search, setSearch] =
    useState("");

  const [sortMode, setSortMode] =
    useState<SortMode>("newest");

  // ======================================================
  // ARTIST MEMBERSHIP
  // ======================================================

  const memberships =
    useQuery(
      api.artists.access
        .getMyArtistMemberships
    );

  const membership =
    memberships?.[0] ?? null;

  const artist =
    membership?.artist ?? null;

  const artistId =
    artist?._id ?? null;

  // ======================================================
  // RELEASES
  // ======================================================

  const projects =
    useQuery(
      api.projects
        .getArtistProjectsForDashboard,
      artistId
        ? { artistId }
        : "skip"
    ) as ReleaseProject[] | undefined;

  // ======================================================
  // PERMISSIONS
  // ======================================================

  const canManageReleases =
    membership?.role === "owner" ||
    membership?.role === "admin" ||
    membership?.role === "manager";

  // ======================================================
  // CATALOG METRICS
  // ======================================================

  const totalReleases =
    projects?.length ?? 0;

  const liveReleases =
    projects?.filter(
      project => project.isActive
    ).length ?? 0;

  const draftReleases =
    projects?.filter(
      project => !project.isActive
    ).length ?? 0;

  const totalTracks =
    projects?.reduce(
      (total, project) =>
        total + project.trackCount,
      0
    ) ?? 0;

  const needsAttention =
    projects?.filter(
      project =>
        getReleaseIssues(project)
          .length > 0
    ).length ?? 0;

  const readyReleases =
    Math.max(
      totalReleases -
        needsAttention,
      0
    );

  const livePercentage =
    totalReleases > 0
      ? Math.round(
          (liveReleases /
            totalReleases) *
            100
        )
      : 0;

  // ======================================================
  // FILTER + SEARCH + SORT
  // ======================================================

  const filteredProjects =
    useMemo(() => {
      if (!projects) {
        return [];
      }

      const searchValue =
        search
          .trim()
          .toLowerCase();

      const result =
        projects.filter(
          project => {
            const issues =
              getReleaseIssues(
                project
              );

            const matchesType =
              filter === "all"
                ? true
                : filter === "live"
                  ? project.isActive
                  : filter === "draft"
                    ? !project.isActive
                    : filter ===
                        "attention"
                      ? issues.length >
                        0
                      : project.type ===
                        filter;

            const typeLabel =
              project.type
                ? formatType(
                    project.type
                  )
                : "Release";

            const matchesSearch =
              !searchValue ||
              project.name
                .toLowerCase()
                .includes(
                  searchValue
                ) ||
              project.catalogNumber
                ?.toLowerCase()
                .includes(
                  searchValue
                ) ||
              typeLabel
                .toLowerCase()
                .includes(
                  searchValue
                );

            return (
              matchesType &&
              matchesSearch
            );
          }
        );

      return [...result].sort(
        (a, b) => {
          const aDate =
            a.releaseDate ??
            a.createdAt;

          const bDate =
            b.releaseDate ??
            b.createdAt;

          if (
            sortMode ===
            "newest"
          ) {
            return bDate - aDate;
          }

          if (
            sortMode ===
            "oldest"
          ) {
            return aDate - bDate;
          }

          if (
            sortMode ===
            "name"
          ) {
            return a.name.localeCompare(
              b.name
            );
          }

          if (
            sortMode ===
            "status"
          ) {
            return Number(
              b.isActive
            ) -
              Number(
                a.isActive
              );
          }

          return 0;
        }
      );
    }, [
      projects,
      filter,
      search,
      sortMode,
    ]);

  // ======================================================
  // LOADING
  // ======================================================

  if (
    memberships === undefined ||
    (
      artistId &&
      projects === undefined
    )
  ) {
    return <LoadingState />;
  }

  // ======================================================
  // NO ARTIST
  // ======================================================

  if (!artist) {
    return <NoArtistState />;
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="relative w-full bg-[#111318] text-white">
      {/* AMBIENCE */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-[-160px] h-[420px] w-[420px] rounded-full bg-blue-600/[0.045] blur-[150px]" />
        <div className="absolute -right-40 top-[38%] h-[460px] w-[460px] rounded-full bg-violet-600/[0.04] blur-[170px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 pb-28 pt-7 sm:px-8 lg:px-10">
        {/* ==================================================
            HERO
        ================================================== */}

        <section className="relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-[#171920] shadow-[0_28px_90px_rgba(0,0,0,0.24)]">
          {artist.image && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-[0.10] blur-[1px]"
              style={{
                backgroundImage:
                  `url("${artist.image}")`,
              }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#171920] via-[#171920]/95 to-[#171426]/85" />
          <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-blue-600/[0.10] blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-36 left-[35%] h-80 w-80 rounded-full bg-purple-600/[0.08] blur-[120px]" />

          <div className="relative z-10 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[22px] border border-violet-400/15 bg-white/[0.03] shadow-2xl shadow-black/40 sm:h-28 sm:w-28">
                  {artist.image ? (
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Disc3
                        size={32}
                        className="text-violet-200/25"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/15 bg-violet-500/[0.05] px-3 py-1 text-[9px] font-medium uppercase tracking-[0.17em] text-violet-100/55">
                      <Sparkles size={10} />
                      Artist catalog
                    </span>

                    <span className="rounded-full border border-white/[0.07] bg-black/20 px-3 py-1 text-[9px] capitalize tracking-[0.10em] text-white/35">
                      {membership?.role}
                    </span>
                  </div>

                  <h1 className="text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
                    Releases
                  </h1>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
                    Manage, review and
                    prepare the music
                    catalog for{" "}
                    <span className="font-medium text-white/70">
                      {artist.name}
                    </span>
                    .
                  </p>
                </div>
              </div>

              {canManageReleases && (
                <Link
                  href="/artist-dashboard/releases/new"
                  className="group inline-flex h-12 w-fit items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black shadow-xl shadow-black/20 transition hover:bg-violet-50 active:scale-[0.98]"
                >
                  <Plus size={16} />
                  New Release
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              )}
            </div>

            <div className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-5">
              <HeroMetric
                label="Releases"
                value={totalReleases}
                icon={
                  <Disc3 size={15} />
                }
              />

              <HeroMetric
                label="Live"
                value={liveReleases}
                icon={
                  <FileAudio size={15} />
                }
              />

              <HeroMetric
                label="Drafts"
                value={draftReleases}
                icon={
                  <Layers3 size={15} />
                }
              />

              <HeroMetric
                label="Tracks"
                value={totalTracks}
                icon={
                  <Music2 size={15} />
                }
              />

              <HeroMetric
                label="Needs attention"
                value={needsAttention}
                icon={
                  <AlertTriangle size={15} />
                }
                attention={
                  needsAttention > 0
                }
              />
            </div>
          </div>
        </section>

        {/* ==================================================
            WORKSPACE / QUICK ACTIONS
        ================================================== */}

        {totalReleases > 0 && (
          <section className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.8fr)]">
            <div className="rounded-2xl border border-white/[0.07] bg-[#1b1d23] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-white/25">
                    Catalog health
                  </p>

                  <p className="mt-1 text-sm font-medium text-white/75">
                    {readyReleases} of{" "}
                    {totalReleases} releases
                    have the basic catalog
                    details filled in.
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-2xl font-semibold tracking-[-0.03em]">
                    {livePercentage}%
                  </p>
                  <p className="text-[9px] uppercase tracking-[0.12em] text-white/25">
                    catalog live
                  </p>
                </div>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-purple-400 shadow-[0_0_12px_rgba(124,58,237,0.35)]"
                  style={{
                    width:
                      `${livePercentage}%`,
                  }}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-white/30">
                <span>
                  {liveReleases} live
                </span>
                <span>•</span>
                <span>
                  {draftReleases} drafts
                </span>
                <span>•</span>
                <span>
                  {needsAttention} need
                  attention
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#1b1d23] p-5">
              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-white/25">
                Quick actions
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {canManageReleases && (
                  <QuickLink
                    href="/artist-dashboard/releases/new"
                    icon={
                      <Plus size={14} />
                    }
                    label="New release"
                  />
                )}

                <QuickLink
                  href="/artist-dashboard/analytics"
                  icon={
                    <BarChart3
                      size={14}
                    />
                  }
                  label="Analytics"
                />

                <button
                  type="button"
                  onClick={() =>
                    setFilter(
                      "attention"
                    )
                  }
                  className="flex h-11 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-left text-[10px] font-medium text-white/45 transition hover:border-violet-400/20 hover:bg-violet-500/[0.04] hover:text-white/75"
                >
                  <AlertTriangle
                    size={14}
                    className="text-amber-300/55"
                  />
                  Needs attention
                </button>

                <QuickLink
                  href="/artist-dashboard"
                  icon={
                    <ArrowLeft
                      size={14}
                    />
                  }
                  label="Overview"
                />
              </div>
            </div>
          </section>
        )}

        {/* ==================================================
            CONTROLS
        ================================================== */}

        <section className="mt-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <FilterButton
                  active={
                    filter === "all"
                  }
                  onClick={() =>
                    setFilter("all")
                  }
                >
                  All
                  <FilterCount
                    value={
                      totalReleases
                    }
                  />
                </FilterButton>

                <FilterButton
                  active={
                    filter === "live"
                  }
                  onClick={() =>
                    setFilter("live")
                  }
                >
                  Live
                  <FilterCount
                    value={
                      liveReleases
                    }
                  />
                </FilterButton>

                <FilterButton
                  active={
                    filter === "draft"
                  }
                  onClick={() =>
                    setFilter("draft")
                  }
                >
                  Drafts
                  <FilterCount
                    value={
                      draftReleases
                    }
                  />
                </FilterButton>

                <FilterButton
                  active={
                    filter ===
                    "attention"
                  }
                  onClick={() =>
                    setFilter(
                      "attention"
                    )
                  }
                >
                  Needs attention
                  <FilterCount
                    value={
                      needsAttention
                    }
                  />
                </FilterButton>

                <FilterButton
                  active={
                    filter ===
                    "single"
                  }
                  onClick={() =>
                    setFilter(
                      "single"
                    )
                  }
                >
                  Singles
                </FilterButton>

                <FilterButton
                  active={
                    filter ===
                    "album"
                  }
                  onClick={() =>
                    setFilter("album")
                  }
                >
                  Albums
                </FilterButton>

                <FilterButton
                  active={
                    filter === "ep"
                  }
                  onClick={() =>
                    setFilter("ep")
                  }
                >
                  EPs
                </FilterButton>

                <FilterButton
                  active={
                    filter ===
                    "mixtape"
                  }
                  onClick={() =>
                    setFilter(
                      "mixtape"
                    )
                  }
                >
                  Mixtapes
                </FilterButton>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 transition focus-within:border-violet-400/20 focus-within:bg-violet-500/[0.025] sm:w-[300px]">
                  <Search
                    size={15}
                    className="shrink-0 text-white/25"
                  />

                  <input
                    value={search}
                    onChange={event =>
                      setSearch(
                        event.target
                          .value
                      )
                    }
                    placeholder="Search title, type or catalog #..."
                    className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                  />
                </div>

                <div className="relative">
                  <ArrowUpDown
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                  />

                  <select
                    value={sortMode}
                    onChange={event =>
                      setSortMode(
                        event.target
                          .value as SortMode
                      )
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-white/[0.07] bg-[#1b1d23] pl-9 pr-9 text-[11px] text-white/55 outline-none transition hover:border-white/[0.11] focus:border-violet-400/20 sm:w-[165px]"
                  >
                    <option value="newest">
                      Newest
                    </option>
                    <option value="oldest">
                      Oldest
                    </option>
                    <option value="name">
                      Name A–Z
                    </option>
                    <option value="status">
                      Live first
                    </option>
                  </select>

                  <SlidersHorizontal
                    size={13}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/20"
                  />
                </div>
              </div>
            </div>

            {(filter !== "all" ||
              search.trim()) && (
              <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3">
                <p className="text-[10px] text-white/30">
                  Showing{" "}
                  <span className="font-medium text-white/55">
                    {
                      filteredProjects.length
                    }
                  </span>{" "}
                  matching release
                  {filteredProjects.length ===
                  1
                    ? ""
                    : "s"}
                  .
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setFilter("all");
                    setSearch("");
                    setSortMode(
                      "newest"
                    );
                  }}
                  className="text-[10px] font-medium text-violet-200/50 transition hover:text-violet-100"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ==================================================
            STATES
        ================================================== */}

        {projects?.length === 0 && (
          <EmptyCatalog
            canManageReleases={
              canManageReleases
            }
            artistName={
              artist.name
            }
          />
        )}

        {projects &&
          projects.length > 0 &&
          filteredProjects.length ===
            0 && (
            <NoResults
              search={search}
              onReset={() => {
                setFilter("all");
                setSearch("");
              }}
            />
          )}

        {/* ==================================================
            RELEASE GRID
        ================================================== */}

        {filteredProjects.length >
          0 && (
          <section className="mt-8">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-violet-200/35">
                  Catalog
                </p>

                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.035em]">
                  Your Releases
                </h2>
              </div>

              <span className="text-[10px] text-white/25">
                {
                  filteredProjects.length
                }{" "}
                {filteredProjects.length ===
                1
                  ? "release"
                  : "releases"}
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredProjects.map(
                project => (
                  <ReleaseCard
                    key={
                      project._id
                    }
                    project={
                      project
                    }
                  />
                )
              )}
            </div>
          </section>
        )}

        <div className="h-8" />
      </div>
    </div>
  );
}

// =========================================================
// LOADING
// =========================================================

function LoadingState() {
  return (
    <div className="w-full bg-[#111318] px-5 py-7 text-white sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1500px] animate-pulse">
        <div className="rounded-[30px] border border-white/[0.06] bg-[#171920] p-8">
          <div className="h-24 w-24 rounded-[22px] bg-white/[0.05]" />
          <div className="mt-6 h-4 w-28 rounded-full bg-white/[0.05]" />
          <div className="mt-4 h-11 w-52 rounded-xl bg-white/[0.07]" />
          <div className="mt-3 h-3 w-80 max-w-full rounded-full bg-white/[0.04]" />

          <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div
                key={index}
                className="h-20 rounded-xl bg-white/[0.035]"
              />
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div key={index}>
              <div className="aspect-square rounded-[22px] bg-white/[0.04]" />
              <div className="mt-4 h-4 w-2/3 rounded-full bg-white/[0.05]" />
              <div className="mt-2 h-3 w-1/3 rounded-full bg-white/[0.03]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================================
// NO ARTIST
// =========================================================

function NoArtistState() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center bg-[#111318] px-5 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.07] bg-[#1b1d23] p-8 text-center">
        <Disc3
          size={26}
          className="mx-auto text-violet-200/30"
        />

        <h1 className="mt-5 text-xl font-semibold">
          No artist workspace
        </h1>

        <p className="mt-2 text-sm leading-6 text-white/35">
          This account does not
          currently have an artist
          catalog available.
        </p>

        <Link
          href="/artist-dashboard"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm text-white/60 transition hover:bg-white/[0.07] hover:text-white"
        >
          <ArrowLeft size={14} />
          Artist overview
        </Link>
      </div>
    </div>
  );
}

// =========================================================
// HERO METRIC
// =========================================================

function HeroMetric({
  label,
  value,
  icon,
  attention = false,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  attention?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-5 bg-[#171920]/90 px-5 py-4 backdrop-blur-xl">
      <div>
        <p className="text-[9px] uppercase tracking-[0.13em] text-white/25">
          {label}
        </p>

        <p
          className={`mt-1 text-2xl font-semibold tracking-[-0.03em] ${
            attention
              ? "text-amber-200/90"
              : "text-white"
          }`}
        >
          {value.toLocaleString()}
        </p>
      </div>

      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
          attention
            ? "border-amber-400/12 bg-amber-400/[0.04] text-amber-200/45"
            : "border-violet-400/10 bg-violet-500/[0.035] text-violet-100/35"
        }`}
      >
        {icon}
      </div>
    </div>
  );
}

// =========================================================
// RELEASE CARD
// =========================================================

function ReleaseCard({
  project,
}: {
  project: ReleaseProject;
}) {
  const releaseDate =
    project.releaseDate ??
    project.createdAt;

  const date =
    new Date(
      releaseDate
    ).toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );

  const typeLabel =
    project.type
      ? formatType(
          project.type
        )
      : "Release";

  const issues =
    getReleaseIssues(project);

  return (
    <Link
      href={`/artist-dashboard/releases/${project._id}`}
      className="group block rounded-[24px] border border-transparent p-2 transition hover:border-white/[0.05] hover:bg-white/[0.015]"
    >
      <div className="relative aspect-square overflow-hidden rounded-[22px] border border-white/[0.06] bg-[#171920] transition duration-300 group-hover:border-violet-400/20 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.07)]">
        {project.coverImage ? (
          <img
            src={
              project.coverImage
            }
            alt={project.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/[0.035] to-violet-500/[0.04]">
            <Disc3
              size={42}
              className="text-violet-100/15"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10 opacity-75" />

        <div className="absolute right-3 top-3">
          <StatusBadge
            active={
              project.isActive
            }
          />
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <span className="rounded-full border border-white/[0.10] bg-black/40 px-2.5 py-1 text-[8px] uppercase tracking-[0.13em] text-white/55 backdrop-blur-xl">
            {typeLabel}
          </span>

          <div className="flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-xl transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight
              size={14}
            />
          </div>
        </div>
      </div>

      <div className="px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold tracking-tight text-white/85 transition group-hover:text-white">
              {project.name}
            </h3>

            <p className="mt-1 text-[10px] text-white/30">
              {typeLabel}
              {" • "}
              {project.trackCount}{" "}
              {project.trackCount ===
              1
                ? "track"
                : "tracks"}
            </p>
          </div>

          {issues.length === 0 ? (
            <span
              title="Catalog details complete"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-400/10 bg-emerald-400/[0.035] text-emerald-200/45"
            >
              <CheckCircle2
                size={13}
              />
            </span>
          ) : (
            <span
              title={`${issues.length} item${issues.length === 1 ? "" : "s"} need attention`}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-amber-400/10 bg-amber-400/[0.04] text-amber-200/50"
            >
              <AlertTriangle
                size={13}
              />
            </span>
          )}
        </div>

        <div className="mt-4 grid gap-2 border-t border-white/[0.05] pt-3">
          <MetaRow
            icon={
              <CalendarDays
                size={12}
              />
            }
          >
            {date}
          </MetaRow>

          <MetaRow
            icon={
              <Hash size={12} />
            }
            warning={
              !project.catalogNumber
            }
          >
            {project.catalogNumber ??
              "Catalog number missing"}
          </MetaRow>

          {!project.coverImage && (
            <MetaRow
              icon={
                <ImageOff
                  size={12}
                />
              }
              warning
            >
              Cover art missing
            </MetaRow>
          )}

          {project.trackCount ===
            0 && (
            <MetaRow
              icon={
                <Music2
                  size={12}
                />
              }
              warning
            >
              No tracks added
            </MetaRow>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-3">
          <span className="text-[9px] uppercase tracking-[0.12em] text-white/20">
            {issues.length > 0
              ? `${issues.length} issue${issues.length === 1 ? "" : "s"}`
              : "Ready"}
          </span>

          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-violet-200/45 transition group-hover:text-violet-100/70">
            Open release
            <ArrowRight
              size={11}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

// =========================================================
// STATUS BADGE
// =========================================================

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.12em] backdrop-blur-xl ${
        active
          ? "border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-200/70"
          : "border-white/[0.10] bg-black/35 text-white/45"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? "bg-emerald-300"
            : "bg-white/25"
        }`}
      />

      {active
        ? "Live"
        : "Draft"}
    </span>
  );
}

// =========================================================
// FILTER BUTTON
// =========================================================

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-[10px] font-medium transition ${
        active
          ? "border-violet-400/18 bg-violet-500/[0.08] text-violet-100"
          : "border-white/[0.06] bg-white/[0.018] text-white/35 hover:border-white/[0.10] hover:bg-white/[0.04] hover:text-white/70"
      }`}
    >
      {children}
    </button>
  );
}

function FilterCount({
  value,
}: {
  value: number;
}) {
  return (
    <span className="rounded-full bg-black/20 px-1.5 py-0.5 text-[8px] text-white/35">
      {value}
    </span>
  );
}

// =========================================================
// QUICK LINK
// =========================================================

function QuickLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex h-11 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-[10px] font-medium text-white/45 transition hover:border-violet-400/20 hover:bg-violet-500/[0.04] hover:text-white/75"
    >
      <span className="text-violet-200/40">
        {icon}
      </span>
      {label}
    </Link>
  );
}

// =========================================================
// META ROW
// =========================================================

function MetaRow({
  icon,
  children,
  warning = false,
}: {
  icon: ReactNode;
  children: ReactNode;
  warning?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 items-center gap-2 text-[10px] ${
        warning
          ? "text-amber-200/45"
          : "text-white/30"
      }`}
    >
      <span
        className={`shrink-0 ${
          warning
            ? "text-amber-200/40"
            : "text-violet-100/25"
        }`}
      >
        {icon}
      </span>

      <span className="truncate">
        {children}
      </span>
    </div>
  );
}

// =========================================================
// EMPTY CATALOG
// =========================================================

function EmptyCatalog({
  canManageReleases,
  artistName,
}: {
  canManageReleases: boolean;
  artistName: string;
}) {
  return (
    <section className="mt-10 flex min-h-[420px] items-center justify-center rounded-[26px] border border-dashed border-white/[0.08] bg-white/[0.012] px-6 py-14 text-center">
      <div className="max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/12 bg-violet-500/[0.04] text-violet-100/30">
          <Music2 size={22} />
        </div>

        <h2 className="mt-5 text-xl font-semibold">
          Start the catalog.
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/30">
          Singles, EPs, albums
          and mixtapes from{" "}
          {artistName} will live
          here.
        </p>

        {canManageReleases && (
          <Link
            href="/artist-dashboard/releases/new"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-violet-50"
          >
            <Plus size={15} />
            Create first release
          </Link>
        )}
      </div>
    </section>
  );
}

// =========================================================
// NO RESULTS
// =========================================================

function NoResults({
  search,
  onReset,
}: {
  search: string;
  onReset: () => void;
}) {
  return (
    <section className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.015] px-6 py-14 text-center">
      <Search
        size={20}
        className="mx-auto text-white/15"
      />

      <p className="mt-4 text-sm font-medium text-white/45">
        No releases found.
      </p>

      {search.trim() && (
        <p className="mt-1 text-xs text-white/20">
          Nothing matched
          {" "}
          “{search}”.
        </p>
      )}

      <button
        type="button"
        onClick={onReset}
        className="mt-5 inline-flex h-10 items-center rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs text-white/45 transition hover:bg-white/[0.05] hover:text-white/70"
      >
        Clear filters
      </button>
    </section>
  );
}

// =========================================================
// RELEASE HEALTH
// =========================================================

function getReleaseIssues(
  project: ReleaseProject
) {
  const issues: string[] = [];

  if (!project.coverImage) {
    issues.push(
      "Missing cover art"
    );
  }

  if (!project.catalogNumber) {
    issues.push(
      "Missing catalog number"
    );
  }

  if (project.trackCount === 0) {
    issues.push(
      "No tracks added"
    );
  }

  return issues;
}

// =========================================================
// FORMAT RELEASE TYPE
// =========================================================

function formatType(
  type: string
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
