"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CircleUserRound,
  Disc3,
  Eye,
  Headphones,
  Image as ImageIcon,
  Loader2,
  Music2,
  Save,
  Shield,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";

// ========================================================
// PAGE
// ========================================================

export default function ArtistManageProfilePage() {
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

  const updateArtistProfile =
    useMutation(
      api.artists.profile.updateMyArtistProfile
    );

  const [
    name,
    setName,
  ] = useState("");

  const [
    image,
    setImage,
  ] = useState("");

  const [
    bio,
    setBio,
  ] = useState("");

  const [
    saveStatus,
    setSaveStatus,
  ] = useState<
    | "idle"
    | "saving"
    | "saved"
    | "error"
  >("idle");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  // ======================================================
  // PERMISSIONS
  // ======================================================

  const canManage =
    membership?.role === "owner" ||
    membership?.role === "admin" ||
    membership?.role === "manager";

  // ======================================================
  // SYNC ARTIST -> FORM
  // ======================================================

  useEffect(() => {
    if (!artist) {
      return;
    }

    setName(
      artist.name ?? ""
    );

    setImage(
      artist.image ?? ""
    );

    setBio(
      artist.bio ?? ""
    );
  }, [artist]);

  // ======================================================
  // DERIVED
  // ======================================================

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

  const totalStreams =
    artist?.totalStreams ?? 0;

  const monthlyListeners =
    artist?.monthlyListeners ?? 0;

  const followers =
    artist?.followerCount ?? 0;

  const superfans =
    artist?.superfanCount ?? 0;

  const bioCount =
    bio.trim().length;

  const previewName =
    name.trim() ||
    artist?.name ||
    "Artist";

  const previewImage =
    image.trim();

  const previewBio =
    bio.trim();

  const profileChecks =
    useMemo(
      () => [
        {
          label: "Artist name",
          complete:
            name.trim().length > 0,
        },
        {
          label: "Artist image",
          complete:
            image.trim().length > 0,
        },
        {
          label: "Artist bio",
          complete:
            bio.trim().length > 0,
        },
        {
          label: "Live music",
          complete:
            liveReleases > 0,
        },
      ],
      [
        name,
        image,
        bio,
        liveReleases,
      ]
    );

  const profileCompletion =
    Math.round(
      (profileChecks.filter(
        item => item.complete
      ).length /
        profileChecks.length) *
        100
    );

  const hasChanges =
    Boolean(artist) &&
    (
      name.trim() !==
        (artist?.name ?? "") ||
      image.trim() !==
        (artist?.image ?? "") ||
      bio.trim() !==
        (artist?.bio ?? "")
    );

  // ======================================================
  // SAVE
  // ======================================================

  const saveProfile =
    async () => {
      if (
        !artistId ||
        !canManage
      ) {
        return;
      }

      const cleanName =
        name.trim();

      const cleanImage =
        image.trim();

      const cleanBio =
        bio.trim();

      if (!cleanName) {
        setSaveStatus(
          "error"
        );

        setErrorMessage(
          "Artist name is required."
        );

        return;
      }

      if (
        cleanBio.length > 1200
      ) {
        setSaveStatus(
          "error"
        );

        setErrorMessage(
          "Artist bio must be 1,200 characters or fewer."
        );

        return;
      }

      try {
        setSaveStatus(
          "saving"
        );

        setErrorMessage("");

        await updateArtistProfile({
          artistId,
          name: cleanName,
          image:
            cleanImage || null,
          bio:
            cleanBio || null,
        });

        setSaveStatus(
          "saved"
        );

        window.setTimeout(
          () => {
            setSaveStatus(
              "idle"
            );
          },
          1800
        );
      } catch (error) {
        console.error(
          "Failed to update artist profile:",
          error
        );

        setSaveStatus(
          "error"
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Could not save artist profile."
        );
      }
    };

  const resetForm =
    () => {
      if (!artist) {
        return;
      }

      setName(
        artist.name ?? ""
      );

      setImage(
        artist.image ?? ""
      );

      setBio(
        artist.bio ?? ""
      );

      setSaveStatus(
        "idle"
      );

      setErrorMessage("");
    };

  // ======================================================
  // LOADING
  // ======================================================

  if (
    memberships === undefined ||
    (artistId &&
      projects === undefined)
  ) {
    return <ManageProfileLoading />;
  }

  // ======================================================
  // NO ARTIST
  // ======================================================

  if (
    memberships.length === 0 ||
    !membership ||
    !artist
  ) {
    return <NoArtistState />;
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <main className="relative w-full bg-[#15171c] pb-24 text-white">
      {/* AMBIENCE */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-28 -top-28 h-[430px] w-[430px] rounded-full bg-violet-500/[0.055] blur-3xl" />
        <div className="absolute left-[12%] top-[650px] h-[340px] w-[340px] rounded-full bg-blue-500/[0.025] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1450px] px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <header className="flex flex-col gap-4 border-b border-white/[0.065] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/artist-dashboard/profile"
              className="inline-flex items-center gap-2 text-xs text-white/35 transition hover:text-white/70"
            >
              <ArrowLeft size={14} />
              Artist profile
            </Link>

            <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200/35">
              <CircleUserRound
                size={13}
              />
              Artist identity
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] sm:text-4xl">
              Manage profile
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/42">
              Control the artist identity that appears across SOA Music.
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

            <button
              type="button"
              onClick={
                saveProfile
              }
              disabled={
                !canManage ||
                saveStatus ===
                  "saving" ||
                !hasChanges
              }
              className={`
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                px-4
                text-xs
                font-semibold
                transition
                active:scale-[0.98]

                ${
                  saveStatus ===
                  "saved"
                    ? "bg-emerald-300 text-black"
                    : saveStatus ===
                        "error"
                      ? "bg-red-400 text-black"
                      : "bg-white text-black hover:bg-violet-50"
                }

                disabled:cursor-not-allowed
                disabled:opacity-45
              `}
            >
              {saveStatus ===
              "saving" ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : saveStatus ===
                "saved" ? (
                <Check size={14} />
              ) : (
                <Save size={14} />
              )}

              {saveStatus ===
              "saving"
                ? "Saving..."
                : saveStatus ===
                    "saved"
                  ? "Saved"
                  : "Save changes"}
            </button>
          </div>
        </header>

        {/* HERO */}
        <section className="relative mt-6 overflow-hidden rounded-[30px] border border-violet-400/12 bg-[#0c0e15] shadow-[0_28px_80px_rgba(0,0,0,0.26)]">
          {previewImage && (
            <div
              className="absolute inset-0 scale-110 bg-cover bg-center opacity-[0.16] blur-[4px]"
              style={{
                backgroundImage:
                  `url("${previewImage}")`,
              }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#090a11] via-[#0d0f17]/96 to-[#171021]/90" />

          <div className="relative z-10 p-6 sm:p-8 lg:p-9">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
                <PreviewAvatar
                  image={
                    previewImage
                  }
                  name={
                    previewName
                  }
                />

                <div className="min-w-0 pb-1">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-violet-400/15 bg-violet-400/[0.055] px-3 py-1 text-[9px] font-medium uppercase tracking-[0.15em] text-violet-100/55">
                      Profile preview
                    </span>

                    <span className="rounded-full border border-white/[0.07] bg-black/20 px-3 py-1 text-[9px] capitalize text-white/35">
                      {membership.role}
                    </span>
                  </div>

                  <h2 className="mt-4 truncate text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                    {previewName}
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
                    {previewBio ||
                      "Your artist bio preview will appear here as you type."}
                  </p>
                </div>
              </div>

              <div className="min-w-[220px] rounded-2xl border border-white/[0.07] bg-black/20 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.14em] text-white/25">
                      Profile health
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                      {profileCompletion}%
                    </p>
                  </div>

                  <Sparkles
                    size={18}
                    className="text-violet-200/40"
                  />
                </div>

                <ProgressBar
                  value={
                    profileCompletion
                  }
                />
              </div>
            </div>

            <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 xl:grid-cols-4">
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
                label="Listeners"
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
            </div>
          </div>
        </section>

        {/* MAIN */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
          {/* FORM */}
          <Panel>
            <SectionTitle
              eyebrow="Public profile"
              title="Artist identity"
              description="These fields power the artist profile across SOA."
              icon={
                <CircleUserRound
                  size={18}
                />
              }
            />

            <div className="mt-7 space-y-6">
              <Field>
                <FieldLabel
                  icon={
                    <UserRound
                      size={14}
                    />
                  }
                  title="Artist name"
                  description="The public name listeners see."
                />

                <input
                  value={name}
                  onChange={
                    event => {
                      setName(
                        event.target.value
                      );

                      if (
                        saveStatus ===
                        "error"
                      ) {
                        setSaveStatus(
                          "idle"
                        );
                      }
                    }
                  }
                  disabled={
                    !canManage
                  }
                  maxLength={80}
                  placeholder="Artist name"
                  className={inputClass}
                />

                <FieldMeta
                  left="Required"
                  right={`${name.length}/80`}
                />
              </Field>

              <Divider />

              <Field>
                <FieldLabel
                  icon={
                    <ImageIcon
                      size={14}
                    />
                  }
                  title="Artist image"
                  description="Paste the public URL for your artist artwork or profile image."
                />

                <input
                  value={image}
                  onChange={
                    event =>
                      setImage(
                        event.target.value
                      )
                  }
                  disabled={
                    !canManage
                  }
                  placeholder="https://..."
                  className={inputClass}
                />

                <FieldMeta
                  left="Leave blank to remove the current image."
                  right={
                    image.trim()
                      ? "Preview active"
                      : "No image"
                  }
                />
              </Field>

              <Divider />

              <Field>
                <FieldLabel
                  icon={
                    <Music2
                      size={14}
                    />
                  }
                  title="Artist bio"
                  description="Tell listeners who you are, what you make, and what defines your sound."
                />

                <textarea
                  value={bio}
                  onChange={
                    event =>
                      setBio(
                        event.target.value.slice(
                          0,
                          1200
                        )
                      )
                  }
                  disabled={
                    !canManage
                  }
                  rows={8}
                  placeholder="Write your artist bio..."
                  className={`${inputClass} min-h-[190px] resize-y py-3 leading-6`}
                />

                <FieldMeta
                  left="Keep it focused and useful to listeners."
                  right={`${bioCount}/1200`}
                />
              </Field>
            </div>

            <div className="mt-7 flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {errorMessage ? (
                  <p className="text-xs text-red-300/75">
                    {errorMessage}
                  </p>
                ) : (
                  <p className="text-xs text-white/30">
                    {hasChanges
                      ? "You have unsaved changes."
                      : "Profile is up to date."}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={
                    resetForm
                  }
                  disabled={
                    !hasChanges ||
                    saveStatus ===
                      "saving"
                  }
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs font-medium text-white/45 transition hover:bg-white/[0.05] hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={
                    saveProfile
                  }
                  disabled={
                    !canManage ||
                    !hasChanges ||
                    saveStatus ===
                      "saving"
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-black transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {saveStatus ===
                  "saving" ? (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  ) : saveStatus ===
                    "saved" ? (
                    <Check size={14} />
                  ) : (
                    <Save size={14} />
                  )}

                  {saveStatus ===
                  "saving"
                    ? "Saving..."
                    : saveStatus ===
                        "saved"
                      ? "Saved"
                      : "Save profile"}
                </button>
              </div>
            </div>
          </Panel>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <Panel>
              <SectionTitle
                eyebrow="Readiness"
                title="Profile checklist"
                description="Make sure your artist profile is ready for listeners."
                icon={
                  <Sparkles
                    size={18}
                  />
                }
              />

              <div className="mt-6 space-y-3">
                {profileChecks.map(
                  item => (
                    <CheckRow
                      key={
                        item.label
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
            </Panel>

            {!canManage && (
              <div className="rounded-[24px] border border-amber-400/10 bg-amber-400/[0.025] p-5">
                <div className="flex gap-3">
                  <Shield
                    size={18}
                    className="mt-0.5 shrink-0 text-amber-200/45"
                  />

                  <div>
                    <p className="text-sm font-medium text-white/70">
                      Read-only access
                    </p>

                    <p className="mt-1.5 text-xs leading-5 text-white/35">
                      Analysts can view the artist profile but cannot edit it. Owners, admins and managers can save changes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Panel>
              <SectionTitle
                eyebrow="Catalog"
                title="Artist footprint"
                description="A quick snapshot of the catalog attached to this profile."
                icon={
                  <Disc3
                    size={18}
                  />
                }
              />

              <div className="mt-6 grid grid-cols-2 gap-3">
                <MiniStat
                  label="Releases"
                  value={formatNumber(
                    totalReleases
                  )}
                />

                <MiniStat
                  label="Live"
                  value={formatNumber(
                    liveReleases
                  )}
                />

                <MiniStat
                  label="Tracks"
                  value={formatNumber(
                    totalTracks
                  )}
                />

                <MiniStat
                  label="Completion"
                  value={`${profileCompletion}%`}
                />
              </div>

              <div className="mt-5 grid gap-2">
                <Link
                  href="/artist-dashboard/releases"
                  className="flex h-10 items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 text-xs text-white/45 transition hover:bg-white/[0.05] hover:text-white/75"
                >
                  Manage catalog
                  <ArrowRight
                    size={13}
                  />
                </Link>

                <Link
                  href="/artist-dashboard/analytics"
                  className="flex h-10 items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 text-xs text-white/45 transition hover:bg-white/[0.05] hover:text-white/75"
                >
                  View analytics
                  <BarChart3
                    size={13}
                  />
                </Link>
              </div>
            </Panel>
          </div>
        </section>
      </div>
    </main>
  );
}

// ========================================================
// COMPONENTS
// ========================================================

function PreviewAvatar({
  image,
  name,
}: {
  image?: string;
  name: string;
}) {
  return (
    <div className="relative shrink-0">
      <div className="absolute inset-3 rounded-[28px] bg-gradient-to-br from-blue-500 via-violet-500 to-purple-500 opacity-45 blur-2xl" />

      <div className="relative h-36 w-36 overflow-hidden rounded-[28px] border border-violet-300/18 bg-[#171923] shadow-2xl shadow-black/35 sm:h-40 sm:w-40">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music2
              size={38}
              className="text-violet-100/25"
            />
          </div>
        )}
      </div>
    </div>
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
    <div className="flex items-center justify-between gap-4 bg-[#11131a]/90 px-5 py-4 backdrop-blur-xl">
      <div>
        <p className="text-[9px] uppercase tracking-[0.13em] text-white/25">
          {label}
        </p>

        <p className="mt-1 text-2xl font-semibold tracking-[-0.03em]">
          {value}
        </p>
      </div>

      <div className="text-violet-100/30">
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
    <div className="rounded-[26px] border border-white/[0.07] bg-[#1b1d23] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.13)] sm:p-6">
      {children}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
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

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-300/[0.04] text-violet-100/40">
        {icon}
      </div>
    </div>
  );
}

function Field({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}

function FieldLabel({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-3 flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-violet-100/35">
        {icon}
      </div>

      <div>
        <p className="text-sm font-medium text-white/70">
          {title}
        </p>

        <p className="mt-1 text-[10px] leading-5 text-white/30">
          {description}
        </p>
      </div>
    </div>
  );
}

function FieldMeta({
  left,
  right,
}: {
  left: string;
  right: string;
}) {
  return (
    <div className="mt-2 flex items-center justify-between gap-4 text-[9px] text-white/25">
      <span>
        {left}
      </span>

      <span className="shrink-0 tabular-nums">
        {right}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <div className="h-px bg-white/[0.065]" />
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
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.05]">
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

function CheckRow({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.055] bg-white/[0.018] px-3.5 py-3">
      <span className="text-xs text-white/45">
        {label}
      </span>

      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
          complete
            ? "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300"
            : "border-white/[0.07] bg-white/[0.025] text-white/15"
        }`}
      >
        {complete && (
          <Check size={12} />
        )}
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
      <p className="text-[9px] uppercase tracking-[0.12em] text-white/25">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold">
        {value}
      </p>
    </div>
  );
}

function ManageProfileLoading() {
  return (
    <main className="w-full bg-[#15171c] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1450px] animate-pulse">
        <div className="h-4 w-28 rounded-full bg-white/[0.04]" />

        <div className="mt-5 h-10 w-64 rounded-xl bg-white/[0.06]" />

        <section className="mt-6 rounded-[30px] border border-white/[0.06] bg-[#101218] p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="h-40 w-40 rounded-[28px] bg-white/[0.05]" />

            <div className="flex-1">
              <div className="h-5 w-32 rounded-full bg-white/[0.04]" />
              <div className="mt-4 h-12 w-72 max-w-full rounded-xl bg-white/[0.07]" />
              <div className="mt-4 h-3 w-[480px] max-w-full rounded-full bg-white/[0.035]" />
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
          <div className="h-[620px] rounded-[26px] bg-white/[0.025]" />
          <div className="h-[420px] rounded-[26px] bg-white/[0.025]" />
        </div>
      </div>
    </main>
  );
}

function NoArtistState() {
  return (
    <main className="flex min-h-[60vh] w-full items-center justify-center bg-[#15171c] px-5 text-white">
      <div className="w-full max-w-lg rounded-[28px] border border-violet-400/12 bg-[#1b1d23] p-8 text-center">
        <CircleUserRound
          size={28}
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
// STYLES / FORMATTERS
// ========================================================

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-[#15171c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/18 focus:border-violet-400/25 focus:bg-violet-400/[0.025] disabled:cursor-not-allowed disabled:opacity-50";

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
