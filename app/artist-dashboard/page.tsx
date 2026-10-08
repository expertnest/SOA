"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  CircleUserRound,
  Disc3,
  DollarSign,
  Eye,
  Headphones,
  LayoutDashboard,
  Music2,
  Plus,
  Settings,
  ShieldX,
  Sparkles,
  TrendingUp,
  UserRound,
  UsersRound,
} from "lucide-react";

// =========================================================
// PAGE
// =========================================================

export default function ArtistDashboardPage() {
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

  const canManage =
    membership?.role === "owner" ||
    membership?.role === "admin" ||
    membership?.role === "manager";

  // ======================================================
  // LOADING / ACCESS
  // ======================================================

  if (
    memberships === undefined ||
    (artistId &&
      projects === undefined)
  ) {
    return <DashboardLoading />;
  }

  if (memberships.length === 0) {
    return <NoArtistAccess />;
  }

  if (!membership || !artist) {
    return (
      <div className="flex min-h-[55vh] w-full items-center justify-center bg-[#15171c] text-white">
        <p className="text-sm text-white/40">
          Artist could not be loaded.
        </p>
      </div>
    );
  }

  // ======================================================
  // REAL ARTIST METRICS
  // ======================================================

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

  const recentProjects =
    projects?.slice(0, 5) ?? [];

  const latestProject =
    recentProjects[0] ?? null;

  const streamsPerListener =
    monthlyListeners > 0
      ? totalStreams /
        monthlyListeners
      : 0;

  const followerConversion =
    monthlyListeners > 0
      ? (followers /
          monthlyListeners) *
        100
      : 0;

  const superfanRate =
    followers > 0
      ? (superfans /
          followers) *
        100
      : 0;

  // ======================================================
  // PROFILE HEALTH
  // ======================================================

  const profileChecks = [
    {
      label: "Artist image",
      complete: Boolean(
        artist.image
      ),
      href: "/artist-dashboard/settings",
    },
    {
      label: "Artist bio",
      complete: Boolean(
        artist.bio?.trim()
      ),
      href: "/artist-dashboard/settings",
    },
    {
      label: "Music uploaded",
      complete:
        totalReleases > 0,
      href: "/artist-dashboard/releases",
    },
    {
      label: "Live release",
      complete:
        liveReleases > 0,
      href: "/artist-dashboard/releases",
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

  // ======================================================
  // NEEDS ATTENTION
  // ======================================================

  const attentionItems: Array<{
    title: string;
    description: string;
    href: string;
    tone:
      | "warning"
      | "neutral"
      | "good";
  }> = [];

  if (!artist.image) {
    attentionItems.push({
      title: "Artist image missing",
      description:
        "Add profile artwork so your artist identity feels complete.",
      href: "/artist-dashboard/settings",
      tone: "warning",
    });
  }

  if (!artist.bio?.trim()) {
    attentionItems.push({
      title: "Artist bio incomplete",
      description:
        "Give listeners context about your sound and identity.",
      href: "/artist-dashboard/settings",
      tone: "warning",
    });
  }

  if (draftReleases > 0) {
    attentionItems.push({
      title: `${draftReleases} draft ${
        draftReleases === 1
          ? "release"
          : "releases"
      }`,
      description:
        "Review unfinished releases and decide what is ready to publish.",
      href: "/artist-dashboard/releases",
      tone: "neutral",
    });
  }

  if (totalReleases === 0) {
    attentionItems.push({
      title: "No music uploaded yet",
      description:
        "Create your first release to start building the artist catalog.",
      href: "/artist-dashboard/releases/new",
      tone: "warning",
    });
  }

  if (
    attentionItems.length === 0
  ) {
    attentionItems.push({
      title: "Workspace looks healthy",
      description:
        "Your core artist profile and catalog setup are in good shape.",
      href: "/artist-dashboard/profile",
      tone: "good",
    });
  }

  // ======================================================
  // WORKSPACE SIGNALS
  // ======================================================

  const workspaceSignals = [
    latestProject
      ? {
          title: latestProject.name,
          description: `${
            latestProject.isActive
              ? "Live"
              : "Draft"
          } • ${formatType(
            latestProject.type
          )} • ${
            latestProject.trackCount
          } ${
            latestProject.trackCount ===
            1
              ? "track"
              : "tracks"
          }`,
          href: `/artist-dashboard/releases/${latestProject._id}`,
          icon: (
            <Disc3 size={15} />
          ),
        }
      : null,

    totalStreams > 0
      ? {
          title: `${formatNumber(
            totalStreams
          )} total streams`,
          description:
            "Open analytics to understand how listeners are consuming your songs.",
          href: "/artist-dashboard/analytics",
          icon: (
            <BarChart3
              size={15}
            />
          ),
        }
      : null,

    {
      title: `${profileCompletion}% profile complete`,
      description:
        profileCompletion === 100
          ? "Your artist profile is fully set up."
          : "Finish your artist identity to strengthen the public profile.",
      href: "/artist-dashboard/settings",
      icon: (
        <CircleUserRound
          size={15}
        />
      ),
    },
  ].filter(Boolean) as Array<{
    title: string;
    description: string;
    href: string;
    icon: ReactNode;
  }>;

  // ======================================================
  // UI
  // ======================================================

  return (
    <main className="relative w-full bg-[#15171c] pb-24 text-white">
      {/* AMBIENCE */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-violet-500/[0.055] blur-3xl" />
        <div className="absolute left-[8%] top-[600px] h-[360px] w-[360px] rounded-full bg-blue-500/[0.025] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* ==================================================
            CONTROL CENTER HEADER
        ================================================== */}

        <header className="flex flex-col gap-5 border-b border-white/[0.065] pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200/35">
              <LayoutDashboard
                size={13}
              />
              Artist control center
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] sm:text-4xl">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-white via-violet-100 to-purple-200 bg-clip-text text-transparent">
                {artist.name}
              </span>
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/42">
              Your artist business at a glance — performance, catalog health,
              audience and the next things that need your attention.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/artist-dashboard/profile"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs font-medium text-white/45 transition hover:bg-white/[0.05] hover:text-white/75"
            >
              <Eye size={14} />
              View profile
            </Link>

            {canManage && (
              <Link
                href="/artist-dashboard/releases/new"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-black transition hover:bg-violet-50"
              >
                <Plus size={14} />
                New release
              </Link>
            )}
          </div>
        </header>

        {/* ==================================================
            PRIMARY KPI STRIP
        ================================================== */}

        <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <KpiCard
            label="Revenue"
            value={formatCurrency(
              totalRevenue
            )}
            icon={
              <DollarSign
                size={17}
              />
            }
            accent="money"
          />

          <KpiCard
            label="Streams"
            value={formatNumber(
              totalStreams
            )}
            icon={
              <Headphones
                size={17}
              />
            }
          />

          <KpiCard
            label="Listeners"
            value={formatNumber(
              monthlyListeners
            )}
            icon={
              <UsersRound
                size={17}
              />
            }
          />

          <KpiCard
            label="Followers"
            value={formatNumber(
              followers
            )}
            icon={
              <UserRound
                size={17}
              />
            }
          />

          <KpiCard
            label="Superfans"
            value={formatNumber(
              superfans
            )}
            icon={
              <Sparkles
                size={17}
              />
            }
          />

          <KpiCard
            label="Catalog"
            value={formatNumber(
              totalTracks
            )}
            sublabel={`${totalReleases} ${
              totalReleases === 1
                ? "release"
                : "releases"
            }`}
            icon={
              <Music2
                size={17}
              />
            }
          />
        </section>

        {/* ==================================================
            QUICK ACTIONS
        ================================================== */}

        <section className="mt-6">
          <SectionHeading
            eyebrow="Quick actions"
            title="Run the workspace"
            description="Jump directly into the most common artist tasks."
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {canManage && (
              <QuickAction
                href="/artist-dashboard/releases/new"
                icon={
                  <Plus size={18} />
                }
                title="New release"
                description="Create a single, EP, album or mixtape."
                primary
              />
            )}

            <QuickAction
              href="/artist-dashboard/analytics"
              icon={
                <BarChart3
                  size={18}
                />
              }
              title="View analytics"
              description="See song performance and listener behavior."
            />

            <QuickAction
              href="/artist-dashboard/settings"
              icon={
                <CircleUserRound
                  size={18}
                />
              }
              title="Edit profile"
              description="Update your artist image, name and bio."
            />

            <QuickAction
              href="/artist-dashboard/releases"
              icon={
                <Disc3
                  size={18}
                />
              }
              title="Manage catalog"
              description="Review releases, drafts and track counts."
            />
          </div>
        </section>

        {/* ==================================================
            MAIN ADMIN GRID
        ================================================== */}

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(330px,0.65fr)]">
          {/* RECENT RELEASES */}
          <Panel>
            <PanelHeader
              eyebrow="Catalog"
              title="Recent releases"
              description="The newest releases connected to this artist workspace."
              href="/artist-dashboard/releases"
              action="View all"
            />

            {recentProjects.length > 0 ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.06] bg-black/[0.08]">
                {recentProjects.map(
                  (project, index) => (
                    <ReleaseRow
                      key={
                        project._id
                      }
                      index={
                        index + 1
                      }
                      project={
                        project
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <EmptyBlock
                icon={
                  <Disc3
                    size={23}
                  />
                }
                title="No releases yet"
                description="Create the first release to start building your catalog."
                href={
                  canManage
                    ? "/artist-dashboard/releases/new"
                    : "/artist-dashboard/releases"
                }
                action={
                  canManage
                    ? "Create release"
                    : "View catalog"
                }
              />
            )}
          </Panel>

          {/* NEEDS ATTENTION */}
          <Panel>
            <PanelHeader
              eyebrow="Workspace"
              title="Needs attention"
              description="The most useful things to review next."
            />

            <div className="mt-5 space-y-2.5">
              {attentionItems
                .slice(0, 4)
                .map(
                  item => (
                    <AttentionRow
                      key={
                        item.title
                      }
                      {...item}
                    />
                  )
                )}
            </div>
          </Panel>
        </section>

        {/* ==================================================
            AUDIENCE + HEALTH
        ================================================== */}

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <Panel>
            <PanelHeader
              eyebrow="Audience"
              title="Audience snapshot"
              description="A fast read on how listeners move deeper into your artist ecosystem."
              href="/artist-dashboard/analytics"
              action="Open analytics"
            />

            <div className="mt-6 grid grid-cols-2 gap-3">
              <MetricTile
                label="Streams / listener"
                value={
                  formatDecimal(
                    streamsPerListener
                  )
                }
                description="Audience depth"
              />

              <MetricTile
                label="Follower conversion"
                value={
                  formatPercent(
                    followerConversion
                  )
                }
                description="Listeners → followers"
              />

              <MetricTile
                label="Superfan rate"
                value={
                  formatPercent(
                    superfanRate
                  )
                }
                description="Followers → superfans"
              />

              <MetricTile
                label="Monthly listeners"
                value={formatNumber(
                  monthlyListeners
                )}
                description="Current audience"
              />
            </div>

            <div className="mt-6">
              <AudienceBar
                label="Monthly listeners"
                value={
                  monthlyListeners
                }
                max={Math.max(
                  monthlyListeners,
                  followers,
                  superfans,
                  1
                )}
              />

              <AudienceBar
                label="Followers"
                value={
                  followers
                }
                max={Math.max(
                  monthlyListeners,
                  followers,
                  superfans,
                  1
                )}
              />

              <AudienceBar
                label="Superfans"
                value={
                  superfans
                }
                max={Math.max(
                  monthlyListeners,
                  followers,
                  superfans,
                  1
                )}
              />
            </div>
          </Panel>

          <Panel>
            <PanelHeader
              eyebrow="Artist health"
              title="Profile & catalog readiness"
              description="How complete and publish-ready your artist workspace is."
              href="/artist-dashboard/settings"
              action="Manage profile"
            />

            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-semibold tracking-[-0.045em]">
                  {profileCompletion}%
                </p>

                <p className="mt-1 text-xs text-white/30">
                  profile complete
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold text-white/70">
                  {liveReleases}
                  <span className="text-white/25">
                    /{totalReleases}
                  </span>
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/22">
                  releases live
                </p>
              </div>
            </div>

            <ProgressBar
              value={
                profileCompletion
              }
            />

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {profileChecks.map(
                item => (
                  <HealthRow
                    key={
                      item.label
                    }
                    label={
                      item.label
                    }
                    complete={
                      item.complete
                    }
                    href={
                      item.href
                    }
                  />
                )
              )}
            </div>
          </Panel>
        </section>

        {/* ==================================================
            WORKSPACE SIGNALS
        ================================================== */}

        <section className="mt-6">
          <Panel>
            <PanelHeader
              eyebrow="Workspace"
              title="Recent signals"
              description="Current catalog and performance signals worth keeping in view."
            />

            <div className="mt-5 divide-y divide-white/[0.06]">
              {workspaceSignals.map(
                signal => (
                  <SignalRow
                    key={
                      signal.title
                    }
                    {...signal}
                  />
                )
              )}
            </div>
          </Panel>
        </section>

        {/* ==================================================
            FOOTER SHORTCUTS
        ================================================== */}

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FooterShortcut
            href="/artist-dashboard/releases"
            icon={
              <Disc3 size={16} />
            }
            label="Releases"
          />

          <FooterShortcut
            href="/artist-dashboard/analytics"
            icon={
              <BarChart3
                size={16}
              />
            }
            label="Analytics"
          />

          <FooterShortcut
            href="/artist-dashboard/profile"
            icon={
              <CircleUserRound
                size={16}
              />
            }
            label="Artist profile"
          />

          <FooterShortcut
            href="/artist-dashboard/settings"
            icon={
              <Settings
                size={16}
              />
            }
            label="Settings"
          />
        </section>
      </div>
    </main>
  );
}

// =========================================================
// COMPONENTS
// =========================================================

function KpiCard({
  label,
  value,
  sublabel,
  icon,
  accent = "default",
}: {
  label: string;
  value: string;
  sublabel?: string;
  icon: ReactNode;
  accent?:
    | "default"
    | "money";
}) {
  return (
    <div
      className={`rounded-2xl border p-4 transition ${
        accent === "money"
          ? "border-emerald-400/10 bg-emerald-400/[0.025]"
          : "border-white/[0.065] bg-[#1b1d23]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-white/35">
          {label}
        </p>

        <div
          className={
            accent === "money"
              ? "text-emerald-200/40"
              : "text-violet-100/35"
          }
        >
          {icon}
        </div>
      </div>

      <p
        className={`mt-3 truncate text-2xl font-semibold tracking-[-0.03em] ${
          accent === "money"
            ? "text-emerald-100/90"
            : "text-white"
        }`}
      >
        {value}
      </p>

      {sublabel && (
        <p className="mt-1 truncate text-[10px] text-white/30">
          {sublabel}
        </p>
      )}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
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
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
  primary = false,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-2xl border p-4 transition hover:-translate-y-0.5 ${
        primary
          ? "border-violet-400/15 bg-gradient-to-br from-violet-500/[0.09] to-blue-500/[0.035] hover:border-violet-400/25"
          : "border-white/[0.065] bg-[#1b1d23] hover:border-violet-300/15 hover:bg-[#1e2027]"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
          primary
            ? "border-violet-300/15 bg-violet-300/[0.08] text-violet-100/70"
            : "border-white/[0.07] bg-white/[0.025] text-violet-100/40"
        }`}
      >
        {icon}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-white/80">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-white/30">
            {description}
          </p>
        </div>

        <ChevronRight
          size={15}
          className="mt-0.5 shrink-0 text-white/15 transition group-hover:translate-x-0.5 group-hover:text-violet-100/55"
        />
      </div>
    </Link>
  );
}

function Panel({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-white/[0.07] bg-[#1b1d23] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.13)] sm:p-6">
      {children}
    </div>
  );
}

function PanelHeader({
  eyebrow,
  title,
  description,
  href,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href?: string;
  action?: string;
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

      {href && action && (
        <Link
          href={href}
          className="hidden shrink-0 items-center gap-1.5 text-xs font-medium text-violet-200/45 transition hover:text-violet-100 sm:inline-flex"
        >
          {action}
          <ArrowRight
            size={13}
          />
        </Link>
      )}
    </div>
  );
}

function ReleaseRow({
  project,
  index,
}: {
  project: {
    _id: string;
    name: string;
    type?: string;
    coverImage?: string;
    isActive: boolean;
    trackCount: number;
  };
  index: number;
}) {
  return (
    <Link
      href={`/artist-dashboard/releases/${project._id}`}
      className="group grid grid-cols-[30px_52px_minmax(0,1fr)_auto] items-center gap-3 border-b border-white/[0.06] px-3 py-3.5 transition last:border-b-0 hover:bg-violet-300/[0.03]"
    >
      <span className="text-xs tabular-nums text-white/20">
        {String(index).padStart(
          2,
          "0"
        )}
      </span>

      <div className="h-12 w-12 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.025]">
        {project.coverImage ? (
          <img
            src={
              project.coverImage
            }
            alt={
              project.name
            }
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Disc3
              size={18}
              className="text-violet-100/20"
            />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-[15px] font-medium text-white/85">
          {project.name}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-white/28">
          <span>
            {formatType(
              project.type
            )}
          </span>

          <span>•</span>

          <span>
            {project.trackCount}{" "}
            {project.trackCount === 1
              ? "track"
              : "tracks"}
          </span>

          <span>•</span>

          <span
            className={
              project.isActive
                ? "text-emerald-300/55"
                : "text-amber-200/45"
            }
          >
            {project.isActive
              ? "Live"
              : "Draft"}
          </span>
        </div>
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02] text-white/20 transition group-hover:text-violet-100/55">
        <ChevronRight
          size={14}
        />
      </div>
    </Link>
  );
}

function AttentionRow({
  title,
  description,
  href,
  tone,
}: {
  title: string;
  description: string;
  href: string;
  tone:
    | "warning"
    | "neutral"
    | "good";
}) {
  const icon =
    tone === "good" ? (
      <Check size={14} />
    ) : tone ===
      "warning" ? (
      <AlertTriangle
        size={14}
      />
    ) : (
      <Disc3 size={14} />
    );

  const classes =
    tone === "good"
      ? "border-emerald-400/10 bg-emerald-400/[0.025] text-emerald-200/55"
      : tone === "warning"
        ? "border-amber-400/10 bg-amber-400/[0.025] text-amber-200/50"
        : "border-white/[0.06] bg-white/[0.018] text-violet-100/35";

  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-2xl border border-white/[0.055] bg-white/[0.012] p-3.5 transition hover:border-white/[0.10] hover:bg-white/[0.025]"
    >
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${classes}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white/65">
          {title}
        </p>

        <p className="mt-1 text-[10px] leading-5 text-white/28">
          {description}
        </p>
      </div>

      <ChevronRight
        size={14}
        className="mt-2 shrink-0 text-white/12 transition group-hover:translate-x-0.5 group-hover:text-violet-100/50"
      />
    </Link>
  );
}

function MetricTile({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.018] p-4">
      <p className="text-[9px] font-semibold uppercase tracking-[0.11em] text-white/25">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-white/24">
        {description}
      </p>
    </div>
  );
}

function AudienceBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const width =
    max > 0
      ? Math.max(
          3,
          (value / max) * 100
        )
      : 0;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] text-white/32">
          {label}
        </span>

        <span className="text-[10px] font-medium tabular-nums text-white/45">
          {formatNumber(
            value
          )}
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.045]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-purple-400"
          style={{
            width:
              `${Math.min(
                100,
                width
              )}%`,
          }}
        />
      </div>
    </div>
  );
}

function ProgressBar({
  value,
}: {
  value: number;
}) {
  return (
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.045]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-purple-400"
        style={{
          width:
            `${Math.max(
              0,
              Math.min(
                100,
                value
              )
            )}%`,
        }}
      />
    </div>
  );
}

function HealthRow({
  label,
  complete,
  href,
}: {
  label: string;
  complete: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.055] bg-white/[0.015] px-3.5 py-3 transition hover:bg-white/[0.03]"
    >
      <span className="text-xs text-white/42">
        {label}
      </span>

      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
          complete
            ? "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300"
            : "border-white/[0.07] bg-white/[0.02] text-white/12"
        }`}
      >
        {complete && (
          <Check
            size={11}
          />
        )}
      </div>
    </Link>
  );
}

function SignalRow({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-300/[0.035] text-violet-100/35">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white/65">
          {title}
        </p>

        <p className="mt-1 text-[10px] leading-5 text-white/27">
          {description}
        </p>
      </div>

      <ChevronRight
        size={14}
        className="shrink-0 text-white/12 transition group-hover:translate-x-0.5 group-hover:text-violet-100/50"
      />
    </Link>
  );
}

function FooterShortcut({
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
      className="flex h-12 items-center justify-between rounded-2xl border border-white/[0.06] bg-[#1b1d23] px-4 text-xs font-medium text-white/42 transition hover:border-violet-300/12 hover:bg-[#1e2027] hover:text-white/70"
    >
      <span className="flex items-center gap-2.5">
        <span className="text-violet-100/35">
          {icon}
        </span>

        {label}
      </span>

      <ChevronRight
        size={13}
        className="text-white/15"
      />
    </Link>
  );
}

function EmptyBlock({
  icon,
  title,
  description,
  href,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.012] px-6 py-10 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-violet-100/25">
        {icon}
      </div>

      <p className="mt-4 text-sm font-medium text-white/50">
        {title}
      </p>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-white/25">
        {description}
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex h-9 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs text-white/45 transition hover:bg-white/[0.05] hover:text-white/75"
      >
        {action}
        <ArrowRight
          size={12}
        />
      </Link>
    </div>
  );
}

// =========================================================
// LOADING / ACCESS
// =========================================================

function DashboardLoading() {
  return (
    <main className="w-full bg-[#15171c] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1500px] animate-pulse">
        <div className="h-4 w-36 rounded-full bg-white/[0.04]" />
        <div className="mt-4 h-10 w-80 max-w-full rounded-xl bg-white/[0.06]" />
        <div className="mt-3 h-3 w-[520px] max-w-full rounded-full bg-white/[0.03]" />

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {Array.from({
            length: 6,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="h-28 rounded-2xl border border-white/[0.05] bg-white/[0.025]"
              />
            )
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({
            length: 4,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="h-32 rounded-2xl border border-white/[0.05] bg-white/[0.025]"
              />
            )
          )}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="h-[420px] rounded-[26px] bg-white/[0.025]" />
          <div className="h-[420px] rounded-[26px] bg-white/[0.025]" />
        </div>
      </div>
    </main>
  );
}

function NoArtistAccess() {
  return (
    <main className="flex min-h-[60vh] w-full items-center justify-center bg-[#15171c] px-5 text-white">
      <div className="w-full max-w-lg rounded-[28px] border border-red-400/10 bg-[#1b1d23] p-8 text-center">
        <ShieldX
          size={30}
          className="mx-auto text-red-200/30"
        />

        <h1 className="mt-5 text-2xl font-semibold">
          No artist access
        </h1>

        <p className="mt-2 text-sm leading-6 text-white/35">
          Your account is not connected to an active artist workspace.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-sm text-white/50 transition hover:bg-white/[0.05] hover:text-white"
        >
          Back to SOA
          <ArrowRight
            size={14}
          />
        </Link>
      </div>
    </main>
  );
}

// =========================================================
// FORMATTERS
// =========================================================

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

function formatPercent(
  value: number
) {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  if (value >= 100) {
    return `${Math.round(
      value
    )}%`;
  }

  return `${value.toFixed(
    1
  )}%`;
}

function formatDecimal(
  value: number
) {
  if (!Number.isFinite(value)) {
    return "0.0";
  }

  if (value >= 100) {
    return value.toFixed(0);
  }

  if (value >= 10) {
    return value.toFixed(1);
  }

  return value.toFixed(2);
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
