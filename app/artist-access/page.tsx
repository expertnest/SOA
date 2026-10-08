"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  AlertCircle,
  CheckCircle2,
  Crown,
  Loader2,
  Mail,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

// =========================================================
// HELPERS
// =========================================================

function formatRole(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

// =========================================================
// PAGE
// =========================================================

export default function ArtistAccessPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  const invites = useQuery(
    api.artists.access.getMyPendingArtistInvites
  );

  const memberships = useQuery(
    api.artists.access.getMyArtistMemberships
  );

  const acceptArtistInvite = useMutation(
    api.artists.access.acceptArtistInvite
  );

  const [acceptingId, setAcceptingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  // =========================================================
  // ACCEPT INVITE
  // =========================================================

  const handleAccept = async (
    inviteId: Id<"artistInvites">
  ) => {
    try {
      setError(null);
      setAcceptingId(String(inviteId));

      await acceptArtistInvite({
        inviteId,
      });
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while accepting the invite."
      );
    } finally {
      setAcceptingId(null);
    }
  };

  // =========================================================
  // CLERK LOADING
  // =========================================================

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-white/50" />
        </div>
      </main>
    );
  }

  // =========================================================
  // NOT SIGNED IN
  // =========================================================

  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 py-20 text-white">
        <div className="mx-auto max-w-xl">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Artist Access
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/50">
              Sign in with the email address that received
              your artist invitation.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // CONVEX LOADING
  // =========================================================

  if (
    invites === undefined ||
    memberships === undefined
  ) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-white/50" />
        </div>
      </main>
    );
  }

  const hasInvites = invites.length > 0;
  const hasMemberships = memberships.length > 0;

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-16 text-white sm:px-8">
      <div className="mx-auto max-w-4xl">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="mb-10">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] shadow-2xl">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-white/35">
            SOA Music
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Artist Access
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
            Accept invitations to manage artist accounts
            connected to your SOA Music profile.
          </p>
        </div>

        {/* ===================================================
            ACCOUNT
        =================================================== */}

        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
              <Mail className="h-4 w-4 text-white/60" />
            </div>

            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.15em] text-white/30">
                Signed in as
              </p>

              <p className="mt-1 truncate text-sm font-medium text-white/80">
                {user.primaryEmailAddress?.emailAddress ??
                  "No email found"}
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

            <div>
              <p className="text-sm font-medium text-red-300">
                Could not accept invite
              </p>

              <p className="mt-1 text-sm text-red-300/60">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ===================================================
            PENDING INVITES
        =================================================== */}

        {hasInvites && (
          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Pending Invitations
                </h2>

                <p className="mt-1 text-sm text-white/35">
                  Artist accounts waiting for your acceptance.
                </p>
              </div>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/45">
                {invites.length}
              </span>
            </div>

            <div className="space-y-4">
              {invites.map((invite) => {
                const isAccepting =
                  acceptingId === String(invite._id);

                return (
                  <div
                    key={invite._id}
                    className="group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 shadow-2xl backdrop-blur-xl transition hover:border-white/15 hover:bg-white/[0.05]"
                  >
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">

                        {/* ARTIST IMAGE */}

                        {invite.artist?.image ? (
                          <img
                            src={invite.artist.image}
                            alt={invite.artist.name}
                            className="h-16 w-16 rounded-2xl object-cover ring-1 ring-white/10"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                            <Crown className="h-6 w-6 text-white/50" />
                          </div>
                        )}

                        {/* ARTIST INFO */}

                        <div>
                          <p className="text-xs uppercase tracking-[0.15em] text-white/30">
                            Artist Invitation
                          </p>

                          <h3 className="mt-1 text-xl font-semibold">
                            {invite.artist?.name ??
                              "Unknown Artist"}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-white/60">
                              {formatRole(invite.role)}
                            </span>

                            <span className="rounded-full border border-amber-400/10 bg-amber-400/[0.05] px-3 py-1 text-xs font-medium text-amber-300/70">
                              Pending
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ACCEPT BUTTON */}

                      <button
                        type="button"
                        onClick={() =>
                          handleAccept(invite._id)
                        }
                        disabled={isAccepting}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isAccepting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Accepting
                          </>
                        ) : (
                          <>
                            <UserRoundCheck className="h-4 w-4" />
                            Accept Access
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ===================================================
            EXISTING ARTIST ACCESS
        =================================================== */}

        {hasMemberships && (
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">
                Your Artist Access
              </h2>

              <p className="mt-1 text-sm text-white/35">
                Artist accounts currently connected to your
                profile.
              </p>
            </div>

            <div className="space-y-3">
              {memberships.map((membership) => (
                <div
                  key={membership._id}
                  className="flex items-center justify-between rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.035] p-5"
                >
                  <div className="flex items-center gap-4">

                    {/* ARTIST IMAGE */}

                    {membership.artist?.image ? (
                      <img
                        src={membership.artist.image}
                        alt={membership.artist.name}
                        className="h-12 w-12 rounded-xl object-cover ring-1 ring-white/10"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      </div>
                    )}

                    {/* ARTIST INFO */}

                    <div>
                      <p className="font-medium">
                        {membership.artist?.name ??
                          "Unknown Artist"}
                      </p>

                      <p className="mt-1 text-xs text-white/40">
                        {formatRole(membership.role)}
                      </p>
                    </div>
                  </div>

                  {/* STATUS */}

                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Active
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===================================================
            EMPTY STATE
        =================================================== */}

        {!hasInvites && !hasMemberships && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Mail className="h-5 w-5 text-white/40" />
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              No artist access yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/40">
              There are currently no pending artist
              invitations associated with this account.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}