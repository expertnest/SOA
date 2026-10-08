"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  CircleUserRound,
  Disc3,
  DollarSign,
  Headphones,
  Image as ImageIcon,
  Music2,
  Pencil,
  Settings,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";

// ========================================================
// PAGE
// ========================================================

export default function ArtistProfilePage() {
  const memberships = useQuery(
    api.artists.access.getMyArtistMemberships
  );

  const membership =
    memberships?.[0] ?? null;

  const artist =
    membership?.artist ?? null;

  const artistId =
    artist?._id ?? null;

  const projects = useQuery(
    api.projects.getArtistProjectsForDashboard,
    artistId
      ? { artistId }
      : "skip"
  );

  if (
    memberships === undefined ||
    (artistId &&
      projects === undefined)
  ) {
    return <ProfileLoading />;
  }

  if (
    memberships.length === 0 ||
    !membership ||
    !artist
  ) {
    return <NoArtistProfile />;
  }

  const totalStreams =
    artist.totalStreams ?? 0;

  const monthlyListeners =
    artist.monthlyListeners ?? 0;

  const followers =
    artist.followerCount ?? 0;

  const superfans =
    artist.superfanCount ?? 0;

  const totalRevenue =
    artist.totalRevenue ?? 0;

  const totalReleases =
    projects?.length ?? 0;

  const liveReleases =
    projects?.filter(
      project => project.isActive
    ).length ?? 0;

  const totalTracks =
    projects?.reduce(
      (total, project) =>
        total + project.trackCount,
      0
    ) ?? 0;

  const latestRelease =
    projects?.[0] ?? null;

  const profileChecks = [
    {
      label: "Artist image",
      complete: Boolean(
        artist.image
      ),
      icon: <ImageIcon size={14} />,
    },
    {
      label: "Artist bio",
      complete: Boolean(
        artist.bio?.trim()
      ),
      icon: <UserRound size={14} />,
    },
    {
      label: "Music uploaded",
      complete:
        totalReleases > 0,
      icon: <Music2 size={14} />,
    },
    {
      label: "Live release",
      complete:
        liveReleases > 0,
      icon: <Disc3 size={14} />,
    },
  ];

  const completedChecks =
    profileChecks.filter(
      item => item.complete
    ).length;

  const profileCompletion =
    Math.round(
      (completedChecks /
        profileChecks.length) *
        100
    );

  return (
    <main className="relative w-full bg-[#15171c] pb-24 text-white">
      {/* AMBIENCE */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-violet-500/[0.055] blur-3xl" />
        <div className="absolute left-[10%] top-[720px] h-[340px] w-[340px] rounded-full bg-blue-500/[0.025] blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* TOP */}
        <div className="flex flex-col gap-4 border-b border-white/[0.06] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/artist-dashboard"
            className="inline-flex w-fit items-center gap-2 text-sm text-white/40 transition hover:text-white/75"
          >
            <ArrowLeft size={15} />
            Artist dashboard
          </Link>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/artist-dashboard/analytics"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs font-medium text-white/50 transition hover:border-violet-300/15 hover:bg-violet-300/[0.04] hover:text-white/75"
            >
              <BarChart3 size={14} />
              Analytics
            </Link>

            <Link
              href="/artist-dashboard/settings"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-violet-400/15 bg-violet-400/[0.05] px-4 text-xs font-medium text-violet-100/60 transition hover:border-violet-400/25 hover:bg-violet-400/[0.08] hover:text-violet-100"
            >
              <Pencil size={14} />
              Edit profile
            </Link>
          </div>
        </div>

        {/* ==================================================
            PROFILE HERO
        ================================================== */}
        <section className="relative mt-6 overflow-hidden rounded-[30px] border border-violet-400/15 bg-[#0b0d14] shadow-[0_30px_90px_rgba(0,0,0,0.30)]">
          {artist.image && (
            <div
              className="absolute inset-0 scale-110 bg-cover bg-center opacity-[0.24] blur-[3px]"
              style={{
                backgroundImage:
                  `url("${artist.image}")`,
              }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#080910] via-[#0b0d16]/96 to-[#171022]/88" />
          <div className="pointer-events-none absolute -left-20 -top-36 h-[420px] w-[420px] rounded-full bg-blue-500/[0.16] blur-[130px]" />
          <div className="pointer-events-none absolute -right-16 -top-28 h-[380px] w-[380px] rounded-full bg-violet-600/[0.20] blur-[130px]" />

          <div className="relative z-10 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-7 sm:flex-row sm:items-end">
                <ArtistAvatar
                  image={artist.image}
                  name={artist.name}
                />

                <div className="min-w-0 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/15 bg-violet-300/[0.055] px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-violet-100/60">
                      <Sparkles size={10} />
                      Artist profile
                    </span>

                    <span className="rounded-full border border-white/[0.08] bg-black/20 px-3 py-1.5 text-[9px] font-medium capitalize tracking-[0.08em] text-white/40">
                      {membership.role}
                    </span>
                  </div>

                  <h1 className="mt-4 bg-gradient-to-r from-white via-violet-100 to-purple-200 bg-clip-text text-5xl font-black tracking-[-0.055em] text-transparent sm:text-6xl lg:text-[4.6rem]">
                    {artist.name}
                  </h1>

                  <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/50">
                    {artist.bio?.trim()
                      ? artist.bio
                      : "Add a bio to tell listeners who you are, what you make, and what makes your sound yours."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <ProfileStatus
                      complete={
                        profileCompletion ===
                        100
                      }
                      label={`${profileCompletion}% complete`}
                    />

                    <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[10px] text-white/35">
                      {totalReleases}{" "}
                      {totalReleases === 1
                        ? "release"
                        : "releases"}
                    </span>

                    <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[10px] text-white/35">
                      {totalTracks}{" "}
                      {totalTracks === 1
                        ? "track"
                        : "tracks"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/artist-dashboard/releases"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.08] bg-black/25 px-4 text-sm font-medium text-white/60 backdrop-blur-xl transition hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white"
                >
                  <Disc3 size={15} />
                  Catalog
                </Link>

                <Link
                  href="/artist-dashboard/settings"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-violet-50"
                >
                  <Settings size={15} />
                  Manage profile
                </Link>
              </div>
            </div>

            {/* HERO STATS */}
            <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-5">
              <HeroStat
                label="Streams"
                value={formatNumber(
                  totalStreams
                )}
                icon={
                  <Headphones
                    size={15}
                  />
                }
              />

              <HeroStat
                label="Monthly listeners"
                value={formatNumber(
                  monthlyListeners
                )}
                icon={
                  <UsersRound
                    size={15}
                  />
                }
              />

              <HeroStat
                label="Followers"
                value={formatNumber(
                  followers
                )}
                icon={
                  <UserRound
                    size={15}
                  />
                }
              />

              <HeroStat
                label="Superfans"
                value={formatNumber(
                  superfans
                )}
                icon={
                  <Sparkles
                    size={15}
                  />
                }
              />

              <HeroStat
                label="Revenue"
                value={formatCurrency(
                  totalRevenue
                )}
                icon={
                  <DollarSign
                    size={15}
                  />
                }
              />
            </div>
          </div>
        </section>

        {/* ==================================================
            PROFILE GRID
        ================================================== */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
          {/* PUBLIC PROFILE PREVIEW */}
          <Panel>
            <SectionHeader
              eyebrow="Public presence"
              title="Profile preview"
              description="A cleaner preview of the identity listeners see across SOA Music."
              actionHref="/artist-dashboard/settings"
              actionLabel="Edit"
            />

            <div className="mt-5 overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#101218]">
              <div className="relative min-h-[280px] overflow-hidden p-6 sm:p-8">
                {artist.image && (
                  <div
                    className="absolute inset-0 scale-110 bg-cover bg-center opacity-[0.13] blur-[4px]"
                    style={{
                      backgroundImage:
                        `url("${artist.image}")`,
                    }}
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-[#11131c]/94 to-violet-950/50" />

                <div className="relative z-10 flex min-h-[220px] flex-col justify-end">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                    <div className="h-24 w-24 overflow-hidden rounded-[22px] border border-white/[0.10] bg-white/[0.04] shadow-xl shadow-black/30">
                      {artist.image ? (
                        <img
                          src={
                            artist.image
                          }
                          alt={
                            artist.name
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Music2
                            size={30}
                            className="text-white/20"
                          />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200/35">
                        SOA Artist
                      </p>

                      <h2 className="mt-1 text-3xl font-bold tracking-[-0.04em]">
                        {artist.name}
                      </h2>

                      <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
                        {artist.bio?.trim()
                          ? artist.bio
                          : "Your public artist bio will appear here."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          {/* READINESS */}
          <Panel>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-violet-200/35">
                  Profile
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Artist readiness
                </h2>
              </div>

              <div className="text-right">
                <p className="text-3xl font-semibold tracking-[-0.04em] text-violet-100">
                  {profileCompletion}%
                </p>

                <p className="text-[9px] uppercase tracking-[0.12em] text-white/20">
                  complete
                </p>
              </div>
            </div>

            <ProgressBar
              value={
                profileCompletion
              }
            />

            <div className="mt-6 space-y-3">
              {profileChecks.map(
                item => (
                  <ReadinessRow
                    key={
                      item.label
                    }
                    icon={
                      item.icon
                    }
                    label={
                      item.label
                    }
                    complete={
                      item.complete
                    }
                  />
                )
              )}
            </div>

            <Link
              href="/artist-dashboard/settings"
              className="mt-6 flex h-11 items-center justify-center gap-2 rounded-xl border border-violet-300/15 bg-violet-300/[0.045] text-sm font-medium text-violet-50/65 transition hover:border-violet-300/30 hover:bg-violet-300/[0.08] hover:text-white"
            >
              Complete profile
              <ArrowRight size={14} />
            </Link>
          </Panel>
        </section>

        {/* ==================================================
            AUDIENCE + LATEST RELEASE
        ================================================== */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Panel>
            <SectionHeader
              eyebrow="Audience"
              title="Listener connection"
              description="A quick picture of how your audience moves from listeners to deeper fans."
              actionHref="/artist-dashboard/analytics"
              actionLabel="Analytics"
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <AudienceCard
                label="Monthly listeners"
                value={formatNumber(
                  monthlyListeners
                )}
                description="Current audience"
                icon={
                  <UsersRound
                    size={17}
                  />
                }
              />

              <AudienceCard
                label="Followers"
                value={formatNumber(
                  followers
                )}
                description="Artist followers"
                icon={
                  <UserRound
                    size={17}
                  />
                }
              />

              <AudienceCard
                label="Superfans"
                value={formatNumber(
                  superfans
                )}
                description="Core audience"
                icon={
                  <Sparkles
                    size={17}
                  />
                }
              />

              <AudienceCard
                label="Streams"
                value={formatNumber(
                  totalStreams
                )}
                description="Lifetime plays"
                icon={
                  <Headphones
                    size={17}
                  />
                }
              />
            </div>
          </Panel>

          <Panel>
            <SectionHeader
              eyebrow="Catalog"
              title="Latest release"
              description="The newest release connected to this artist workspace."
              actionHref="/artist-dashboard/releases"
              actionLabel="See catalog"
            />

            {latestRelease ? (
              <Link
                href={`/artist-dashboard/releases/${latestRelease._id}`}
                className="group mt-6 flex flex-col gap-5 rounded-2xl border border-white/[0.065] bg-white/[0.018] p-4 transition hover:border-violet-300/15 hover:bg-violet-300/[0.035] sm:flex-row sm:items-center"
              >
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                  {latestRelease.coverImage ? (
                    <img
                      src={
                        latestRelease.coverImage
                      }
                      alt={
                        latestRelease.name
                      }
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Disc3
                        size={30}
                        className="text-violet-100/20"
                      />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-violet-200/35">
                      {formatType(
                        latestRelease.type
                      )}
                    </span>

                    <StatusPill
                      active={
                        latestRelease.isActive
                      }
                    />
                  </div>

                  <h3 className="mt-2 truncate text-2xl font-semibold tracking-tight text-white/90">
                    {latestRelease.name}
                  </h3>

                  <p className="mt-2 text-sm text-white/35">
                    {latestRelease.trackCount}{" "}
                    {latestRelease.trackCount ===
                    1
                      ? "track"
                      : "tracks"}
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.025] text-white/30 transition group-hover:translate-x-0.5 group-hover:text-violet-100/65">
                  <ArrowRight
                    size={15}
                  />
                </div>
              </Link>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] px-6 py-10 text-center">
                <Disc3
                  size={24}
                  className="mx-auto text-white/15"
                />

                <p className="mt-4 text-sm font-medium text-white/45">
                  No releases yet.
                </p>

                <p className="mt-1 text-xs text-white/25">
                  Your latest release will appear here once music is added.
                </p>
              </div>
            )}
          </Panel>
        </section>

        {/* ==================================================
            PROFILE ACTIONS
        ================================================== */}
        <section className="mt-6">
          <div className="mb-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-violet-200/35">
              Manage
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Artist profile tools
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ToolCard
              href="/artist-dashboard/settings"
              icon={
                <Pencil size={18} />
              }
              title="Edit profile"
              description="Update your artist identity and workspace."
            />

            <ToolCard
              href="/artist-dashboard/releases"
              icon={
                <Disc3 size={18} />
              }
              title="Manage music"
              description="Releases, tracks and catalog status."
            />

            <ToolCard
              href="/artist-dashboard/analytics"
              icon={
                <BarChart3 size={18} />
              }
              title="View analytics"
              description="Audience and song performance."
            />

            <ToolCard
              href="/artist-dashboard"
              icon={
                <CircleUserRound
                  size={18}
                />
              }
              title="Artist home"
              description="Return to your main workspace."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

// ========================================================
// COMPONENTS
// ========================================================

function ArtistAvatar({
  image,
  name,
}: {
  image?: string;
  name: string;
}) {
  return (
    <div className="relative shrink-0">
      <div className="absolute inset-3 rounded-[30px] bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 opacity-55 blur-2xl" />

      <div className="relative rounded-[30px] bg-gradient-to-br from-blue-300/80 via-violet-400/80 to-purple-500/80 p-px shadow-[0_0_40px_rgba(99,102,241,0.26)]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-36 w-36 rounded-[29px] object-cover sm:h-44 sm:w-44"
          />
        ) : (
          <div className="flex h-36 w-36 items-center justify-center rounded-[29px] bg-[#0c0d16] sm:h-44 sm:w-44">
            <Music2
              size={44}
              className="text-violet-200/35"
            />
          </div>
        )}
      </div>

      <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-[#0a0b12] bg-violet-500 shadow-[0_0_18px_rgba(124,58,237,0.55)]">
        <Check
          size={14}
          className="text-white"
        />
      </div>
    </div>
  );
}

function ProfileStatus({
  complete,
  label,
}: {
  complete: boolean;
  label: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-medium ${
        complete
          ? "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-200/65"
          : "border-amber-400/15 bg-amber-400/[0.05] text-amber-200/55"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          complete
            ? "bg-emerald-300"
            : "bg-amber-300"
        }`}
      />
      {label}
    </span>
  );
}

function HeroStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 bg-[#11131a]/80 px-5 py-4 backdrop-blur-xl">
      <div>
        <p className="text-[9px] uppercase tracking-[0.13em] text-white/25">
          {label}
        </p>

        <p className="mt-1 text-2xl font-semibold tracking-[-0.03em]">
          {value}
        </p>
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/[0.035] text-violet-100/35">
        {icon}
      </div>
    </div>
  );
}

function Panel({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-white/[0.07] bg-[#1b1d23] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.14)]">
      {children}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-violet-200/35">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          {title}
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-white/35">
          {description}
        </p>
      </div>

      {actionHref &&
        actionLabel && (
          <Link
            href={actionHref}
            className="hidden shrink-0 items-center gap-1.5 text-xs font-medium text-violet-200/50 transition hover:text-violet-100 sm:inline-flex"
          >
            {actionLabel}
            <ArrowRight
              size={13}
            />
          </Link>
        )}
    </div>
  );
}

function ProgressBar({
  value,
}: {
  value: number;
}) {
  const safeValue =
    Math.max(
      0,
      Math.min(100, value)
    );

  return (
    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.05]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-purple-400"
        style={{
          width:
            `${safeValue}%`,
        }}
      />
    </div>
  );
}

function ReadinessRow({
  icon,
  label,
  complete,
}: {
  icon: ReactNode;
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
            complete
              ? "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300"
              : "border-white/[0.07] bg-white/[0.025] text-white/20"
          }`}
        >
          {icon}
        </div>

        <span className="text-sm text-white/50">
          {label}
        </span>
      </div>

      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
          complete
            ? "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300"
            : "border-white/[0.07] bg-white/[0.025] text-white/15"
        }`}
      >
        {complete && (
          <Check
            size={12}
          />
        )}
      </div>
    </div>
  );
}

function AudienceCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.065] bg-white/[0.018] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
          {label}
        </p>

        <div className="text-violet-100/35">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-white/25">
        {description}
      </p>
    </div>
  );
}

function StatusPill({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[9px] font-medium ${
        active
          ? "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300/80"
          : "border-amber-300/15 bg-amber-300/[0.05] text-amber-200/55"
      }`}
    >
      {active
        ? "Live"
        : "Draft"}
    </span>
  );
}

function ToolCard({
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
      className="group rounded-2xl border border-white/[0.065] bg-[#1b1d23] p-5 transition hover:-translate-y-0.5 hover:border-violet-300/15 hover:bg-[#1e2027]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-300/[0.04] text-violet-100/45 transition group-hover:text-violet-100/75">
        {icon}
      </div>

      <h3 className="mt-4 text-[15px] font-semibold text-white/80">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-white/30">
        {description}
      </p>

      <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-medium text-violet-200/45 transition group-hover:text-violet-100">
        Open
        <ArrowRight
          size={12}
        />
      </div>
    </Link>
  );
}

// ========================================================
// LOADING / EMPTY
// ========================================================

function ProfileLoading() {
  return (
    <main className="w-full bg-[#15171c] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1500px] animate-pulse">
        <div className="h-4 w-28 rounded-full bg-white/[0.04]" />

        <section className="mt-6 rounded-[30px] border border-white/[0.06] bg-[#101218] p-8">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-end">
            <div className="h-40 w-40 rounded-[28px] bg-white/[0.05]" />

            <div className="flex-1">
              <div className="h-6 w-36 rounded-full bg-white/[0.04]" />
              <div className="mt-5 h-14 w-72 max-w-full rounded-xl bg-white/[0.07]" />
              <div className="mt-4 h-3 w-[520px] max-w-full rounded-full bg-white/[0.04]" />
              <div className="mt-2 h-3 w-[380px] max-w-full rounded-full bg-white/[0.03]" />
            </div>
          </div>

          <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({
              length: 5,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-20 rounded-xl bg-white/[0.035]"
                />
              )
            )}
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="h-80 rounded-[26px] bg-white/[0.025]" />
          <div className="h-80 rounded-[26px] bg-white/[0.025]" />
        </div>
      </div>
    </main>
  );
}

function NoArtistProfile() {
  return (
    <main className="flex min-h-[65vh] w-full items-center justify-center bg-[#15171c] px-5 text-white">
      <div className="w-full max-w-lg rounded-[28px] border border-violet-400/15 bg-[#1b1d23] p-8 text-center">
        <CircleUserRound
          size={30}
          className="mx-auto text-violet-100/30"
        />

        <h1 className="mt-5 text-2xl font-semibold">
          Artist profile unavailable
        </h1>

        <p className="mt-2 text-sm leading-6 text-white/35">
          Your account is not currently connected to an active artist workspace.
        </p>

        <Link
          href="/artist-dashboard"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white/55 transition hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeft size={14} />
          Artist dashboard
        </Link>
      </div>
    </main>
  );
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

function formatCurrency(
  value: number
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(value);
}

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
