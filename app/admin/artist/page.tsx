"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

import {
  AlertCircle,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Crown,
  Mail,
  MailPlus,
  Music2,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";

// ==============================
// TYPES
// ==============================

type ArtistRole =
  | "owner"
  | "admin"
  | "manager"
  | "analyst";

// ==============================
// ROLE DATA
// ==============================

const roles: {
  value: ArtistRole;
  label: string;
  description: string;
  icon: typeof Crown;
}[] = [
  {
    value: "owner",
    label: "Owner",
    description: "Primary controller with full artist access.",
    icon: Crown,
  },
  {
    value: "admin",
    label: "Admin",
    description: "Trusted team member with broad management access.",
    icon: ShieldCheck,
  },
  {
    value: "manager",
    label: "Manager",
    description: "Manage releases, campaigns, and artist operations.",
    icon: BriefcaseBusiness,
  },
  {
    value: "analyst",
    label: "Analyst",
    description: "Analytics-focused access with limited management.",
    icon: BarChart3,
  },
];

// ==============================
// PAGE
// ==============================

export default function AdminArtistsPage() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const artists = useQuery(api.artists.getArtists);

  const createArtistInvite = useMutation(
    api.artists.access.createArtistInvite
  );

  const [selectedArtistId, setSelectedArtistId] =
    useState("");

  const [email, setEmail] = useState("");

  const [role, setRole] =
    useState<ArtistRole>("owner");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  // ==============================
  // SELECTED ARTIST
  // ==============================

  const selectedArtist = useMemo(() => {
    if (!artists || !selectedArtistId) {
      return null;
    }

    return artists.find(
      (artist) =>
        artist._id === selectedArtistId
    );
  }, [artists, selectedArtistId]);

  const selectedRole = roles.find(
    (item) => item.value === role
  );

  // ==============================
  // SUBMIT INVITE
  // ==============================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!selectedArtistId) {
      setErrorMessage(
        "Choose an artist before creating the invite."
      );

      return;
    }

    if (!normalizedEmail) {
      setErrorMessage(
        "Enter the email address you want to invite."
      );

      return;
    }

    try {
      setIsSubmitting(true);

      await createArtistInvite({
        artistId:
          selectedArtistId as Id<"artists">,

        email: normalizedEmail,

        role,
      });

      setSuccessMessage(
        `Invite created for ${normalizedEmail}.`
      );

      setEmail("");
      setRole("owner");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the invite."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==============================
  // LOADING
  // ==============================

  if (
    currentUser === undefined ||
    artists === undefined
  ) {
    return (
      <main className="min-h-screen bg-[#050505] px-5 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="mb-3 h-4 w-32 rounded bg-white/10" />

            <div className="mb-3 h-10 w-72 rounded-lg bg-white/10" />

            <div className="mb-10 h-4 w-96 max-w-full rounded bg-white/5" />

            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="h-[520px] rounded-3xl border border-white/10 bg-white/[0.03]" />

              <div className="h-[360px] rounded-3xl border border-white/10 bg-white/[0.03]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==============================
  // NOT SIGNED IN
  // ==============================

  if (!currentUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
            <ShieldCheck className="h-6 w-6 text-white/80" />
          </div>

          <h1 className="text-2xl font-semibold">
            Admin access required
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/50">
            Sign in with your SOA platform admin
            account to manage artist access.
          </p>
        </div>
      </main>
    );
  }

  // ==============================
  // NOT PLATFORM ADMIN
  // ==============================

  if (
    currentUser.platformRole !== "admin"
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
            <ShieldCheck className="h-6 w-6 text-red-300" />
          </div>

          <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-white/40">
            SOA Music
          </p>

          <h1 className="text-2xl font-semibold">
            Restricted area
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/50">
            Your account is signed in, but it
            does not have platform administrator
            permission.
          </p>
        </div>
      </main>
    );
  }

  // ==============================
  // ADMIN UI
  // ==============================

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-8 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        {/* ============================== */}
        {/* HEADER */}
        {/* ============================== */}

        <header className="mb-10">
          <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-white/40">
            <ShieldCheck className="h-4 w-4" />
            SOA Administration
          </div>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Artist Access
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 md:text-base">
                Invite approved users into an
                artist workspace and assign their
                permissions before they enter the
                Artist Dashboard.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06]">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
              </div>

              <div>
                <p className="text-xs text-white/40">
                  Platform role
                </p>

                <p className="text-sm font-medium">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ============================== */}
        {/* CONTENT */}
        {/* ============================== */}

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          {/* ============================== */}
          {/* INVITE FORM */}
          {/* ============================== */}

          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] backdrop-blur-xl">
            <div className="border-b border-white/10 px-6 py-5 md:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <MailPlus className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Create artist invite
                  </h2>

                  <p className="mt-1 text-sm text-white/40">
                    Grant access using the user's
                    verified Clerk email.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-7 p-6 md:p-7"
            >
              {/* ARTIST */}

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Artist
                </label>

                <div className="relative">
                  <select
                    value={selectedArtistId}
                    onChange={(event) => {
                      setSelectedArtistId(
                        event.target.value
                      );

                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-[#0b0b0b] px-4 pr-10 text-sm text-white outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/5"
                  >
                    <option value="">
                      Select an artist
                    </option>

                    {artists.map((artist) => (
                      <option
                        key={artist._id}
                        value={artist._id}
                      >
                        {artist.name}
                      </option>
                    ))}
                  </select>

                  <Music2 className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                </div>

                {artists.length === 0 && (
                  <p className="mt-2 text-xs text-amber-300/80">
                    No active artists are available
                    yet.
                  </p>
                )}
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Invite email
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);

                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    placeholder="artist@example.com"
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#0b0b0b] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25 focus:ring-2 focus:ring-white/5"
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-white/35">
                  This must match the verified email
                  on the user's Clerk account.
                </p>
              </div>

              {/* ROLE */}

              <div>
                <div className="mb-3">
                  <p className="text-sm font-medium text-white/80">
                    Artist role
                  </p>

                  <p className="mt-1 text-xs text-white/35">
                    Permissions apply only to the
                    selected artist.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {roles.map((item) => {
                    const Icon = item.icon;

                    const active =
                      role === item.value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setRole(item.value);

                          setErrorMessage("");
                          setSuccessMessage("");
                        }}
                        className={`group rounded-2xl border p-4 text-left transition ${
                          active
                            ? "border-cyan-400/40 bg-cyan-400/[0.08]"
                            : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                              active
                                ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
                                : "border-white/10 bg-white/[0.04] text-white/50"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-medium">
                              {item.label}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-white/40">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STATUS */}

              {errorMessage && (
                <div className="flex gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.07] p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />

                  <p className="text-sm leading-5 text-red-200">
                    {errorMessage}
                  </p>
                </div>
              )}

              {successMessage && (
                <div className="flex gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />

                  <p className="text-sm leading-5 text-emerald-200">
                    {successMessage}
                  </p>
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !selectedArtistId ||
                  !email.trim()
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    Creating invite
                  </>
                ) : (
                  <>
                    <MailPlus className="h-4 w-4" />
                    Create Invite
                  </>
                )}
              </button>
            </form>
          </section>

          {/* ============================== */}
          {/* SIDEBAR */}
          {/* ============================== */}

          <aside className="space-y-6">
            {/* SELECTED ARTIST */}

            <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-2">
                <Music2 className="h-4 w-4 text-white/50" />

                <p className="text-sm font-medium">
                  Selected Artist
                </p>
              </div>

              {selectedArtist ? (
                <div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05]">
                      {selectedArtist.image ? (
                        <img
                          src={selectedArtist.image}
                          alt={selectedArtist.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Music2 className="h-5 w-5 text-white/30" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">
                        {selectedArtist.name}
                      </h3>

                      <p className="mt-1 truncate text-xs text-white/35">
                        /{selectedArtist.slug}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-xs text-white/35">
                        Streams
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {selectedArtist.totalStreams.toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-xs text-white/35">
                        Followers
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {selectedArtist.followerCount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 px-5 py-10 text-center">
                  <Music2 className="mx-auto h-6 w-6 text-white/20" />

                  <p className="mt-3 text-sm text-white/40">
                    Choose an artist to view their
                    access context.
                  </p>
                </div>
              )}
            </section>

            {/* ACCESS SUMMARY */}

            <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-2">
                <Users className="h-4 w-4 text-white/50" />

                <p className="text-sm font-medium">
                  Access Summary
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                    <UserCog className="h-4 w-4 text-white/50" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {selectedRole?.label}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/40">
                      {selectedRole?.description}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                    <ShieldCheck className="h-4 w-4 text-white/50" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Invite protected
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/40">
                      Access is attached to the
                      invited email and cannot be
                      accepted by another account.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* FLOW */}

            <section className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.035] p-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-200/60">
                Access Flow
              </p>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px]">
                    1
                  </span>

                  <p className="text-white/55">
                    SOA creates the invite.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px]">
                    2
                  </span>

                  <p className="text-white/55">
                    Artist signs in with Clerk.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px]">
                    3
                  </span>

                  <p className="text-white/55">
                    Verified email accepts access.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px]">
                    4
                  </span>

                  <p className="text-white/55">
                    Artist Dashboard unlocks.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}