"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type Stage = "verifying" | "profile" | "access" | "granted";

const LISTENER_WELCOMES = [
  "Listen to your favorite artists on SOA Music.",
  "Jump back into the music you love.",
  "Discover your next favorite track on SOA.",
  "Your artists, releases, and playlists are ready.",
  "Catch up on new drops from the artists you follow.",
] as const;

export default function PostSignInPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const currentUser = useQuery(
    api.users.getCurrentUser,
    isLoaded && isSignedIn ? {} : "skip"
  );

  const memberships = useQuery(
    api.artists.access.getMyArtistMemberships,
    isLoaded && isSignedIn ? {} : "skip"
  );

  const [gateReady, setGateReady] = useState(false);
  const [stage, setStage] = useState<Stage>("verifying");
  const [listenerWelcomeIndex, setListenerWelcomeIndex] =
    useState(0);

  // ======================================================
  // DESTINATION / EXPERIENCE TYPE
  // ======================================================

  const destination = useMemo(() => {
    if (
      !isLoaded ||
      !isSignedIn ||
      currentUser === undefined ||
      memberships === undefined
    ) {
      return null;
    }

    if (currentUser?.platformRole === "admin") {
      return "/admin";
    }

    if (memberships.length > 0) {
      return "/artist-dashboard";
    }

    return "/";
  }, [
    isLoaded,
    isSignedIn,
    currentUser,
    memberships,
  ]);

  const isListener = destination === "/";

  // ======================================================
  // ROLE-AWARE ENTRANCE TIMING
  // ======================================================

  useEffect(() => {
    if (!destination) return;

    setStage("verifying");
    setGateReady(false);

    if (isListener) {
      setListenerWelcomeIndex(
        Math.floor(
          Math.random() * LISTENER_WELCOMES.length
        )
      );
    }

    const profileDelay = isListener ? 420 : 950;
    const accessDelay = isListener ? 900 : 2050;
    const grantedDelay = isListener ? 1380 : 3350;
    const gateDelay = isListener ? 1800 : 4400;

    const profileTimer = window.setTimeout(() => {
      setStage("profile");
    }, profileDelay);

    const accessTimer = window.setTimeout(() => {
      setStage("access");
    }, accessDelay);

    const grantedTimer = window.setTimeout(() => {
      setStage("granted");
    }, grantedDelay);

    const readyTimer = window.setTimeout(() => {
      setGateReady(true);
    }, gateDelay);

    return () => {
      window.clearTimeout(profileTimer);
      window.clearTimeout(accessTimer);
      window.clearTimeout(grantedTimer);
      window.clearTimeout(readyTimer);
    };
  }, [destination, isListener]);

  // ======================================================
  // ROUTING
  // ======================================================

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/");
      return;
    }

    if (!gateReady || !destination) return;

    const redirectTimer = window.setTimeout(
      () => {
        router.replace(destination);
      },
      isListener ? 260 : 620
    );

    return () => {
      window.clearTimeout(redirectTimer);
    };
  }, [
    isLoaded,
    isSignedIn,
    gateReady,
    destination,
    isListener,
    router,
  ]);

  // ======================================================
  // PERSONALIZATION
  // ======================================================

  const welcomeName =
    currentUser?.displayName?.trim() ||
    user?.firstName?.trim() ||
    currentUser?.username?.trim() ||
    "";

  const destinationLabel =
    destination === "/admin"
      ? "SOA Admin"
      : destination === "/artist-dashboard"
        ? "Artist Workspace"
        : "SOA Music";

  const welcomeHeading =
    stage === "verifying"
      ? "Welcome back."
      : welcomeName
        ? `Welcome, ${welcomeName}.`
        : "Welcome back.";

  // ======================================================
  // ROLE-AWARE COPY
  // ======================================================

  const statusText = isListener
    ? stage === "verifying"
      ? "Signing you in"
      : stage === "profile"
        ? "Loading your profile"
        : stage === "access"
          ? "Getting your music ready"
          : "You're all set"
    : stage === "verifying"
      ? "Verifying identity"
      : stage === "profile"
        ? "Loading your SOA profile"
        : stage === "access"
          ? "Preparing your workspace"
          : "Access granted";

  const progressWidth =
    stage === "verifying"
      ? "22%"
      : stage === "profile"
        ? "48%"
        : stage === "access"
          ? "76%"
          : "100%";

  const listenerWelcome =
    LISTENER_WELCOMES[listenerWelcomeIndex] ??
    LISTENER_WELCOMES[0];

  const subtitle = isListener
    ? stage === "granted"
      ? "Your SOA is ready. Taking you to the music."
      : listenerWelcome
    : stage === "granted"
      ? `${destinationLabel} is ready. Taking you in now.`
      : `Preparing ${destinationLabel} for your session.`;

  const topLabel = isListener
    ? "SOA Member"
    : "Private Access";

  const eyebrow = isListener
    ? "Welcome to SOA"
    : "Members Entrance";

  // ======================================================
  // UI
  // ======================================================

  return (
    <main className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#0c0d11] px-5 text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.08),transparent_52%)]" />
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.06] blur-[120px]" />
        <div className="absolute left-[18%] top-[20%] h-[280px] w-[280px] rounded-full bg-blue-500/[0.04] blur-[110px]" />
        <div className="absolute bottom-[10%] right-[12%] h-[300px] w-[300px] rounded-full bg-purple-500/[0.035] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:52px_52px]" />
      </div>

      {/* ACCESS CARD */}
      <div className="relative w-full max-w-[460px]">
        <div
          className={`absolute -inset-px rounded-[32px] bg-gradient-to-br blur-[0.5px] ${
            isListener
              ? "from-blue-400/25 via-white/[0.04] to-violet-500/20"
              : "from-violet-400/30 via-white/[0.04] to-purple-500/20"
          }`}
        />

        <div className="relative overflow-hidden rounded-[31px] border border-white/[0.08] bg-[#15171c]/92 px-7 py-9 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:px-9 sm:py-10">
          {/* TOP LABEL */}
          <div className="flex items-center justify-between gap-4">
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] ${
                isListener
                  ? "border-blue-300/15 bg-blue-400/[0.05] text-blue-100/55"
                  : "border-violet-300/15 bg-violet-400/[0.05] text-violet-100/55"
              }`}
            >
              {topLabel}
            </div>

            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/20">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  stage === "granted"
                    ? "bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]"
                    : isListener
                      ? "bg-blue-300 shadow-[0_0_10px_rgba(147,197,253,0.9)]"
                      : "bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.9)]"
                }`}
              />
              SOA
            </div>
          </div>

          {/* MARK */}
          <div className="mt-10 flex justify-center">
            <div className="relative">
              <div
                className={`absolute inset-2 rounded-[24px] blur-2xl ${
                  isListener
                    ? "bg-blue-500/20"
                    : "bg-violet-500/25"
                }`}
              />

              <div
                className={`relative flex h-20 w-20 items-center justify-center rounded-[24px] border bg-gradient-to-br from-[#20222a] to-[#111217] ${
                  isListener
                    ? "border-blue-300/20 shadow-[0_0_45px_rgba(59,130,246,0.14)]"
                    : "border-violet-300/20 shadow-[0_0_45px_rgba(124,58,237,0.16)]"
                }`}
              >
                <span
                  className={`bg-gradient-to-r bg-clip-text text-xl font-black tracking-[-0.055em] text-transparent ${
                    isListener
                      ? "from-white via-blue-100 to-violet-200"
                      : "from-white via-violet-100 to-purple-200"
                  }`}
                >
                  SOA
                </span>
              </div>
            </div>
          </div>

          {/* COPY */}
          <div className="mt-8 text-center">
            <p
              className={`text-[10px] font-medium uppercase tracking-[0.24em] ${
                isListener
                  ? "text-blue-200/35"
                  : "text-violet-200/35"
              }`}
            >
              {eyebrow}
            </p>

            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
              {welcomeHeading}
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/35">
              {subtitle}
            </p>

            {welcomeName && (
              <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-white/25">
                <span
                  className={`h-1.5 w-1.5 rounded-full transition duration-500 ${
                    stage === "granted"
                      ? "bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.75)]"
                      : isListener
                        ? "bg-blue-300 shadow-[0_0_10px_rgba(147,197,253,0.65)]"
                        : "bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.65)]"
                  }`}
                />
                {isListener
                  ? `Signed in as ${welcomeName}`
                  : `Session for ${welcomeName}`}
              </div>
            )}
          </div>

          {/* STATUS */}
          <div className="mt-9">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em]">
              <span className="text-white/30">
                {statusText}
              </span>

              <span
                className={
                  stage === "granted"
                    ? "text-emerald-300/70"
                    : isListener
                      ? "text-blue-200/45"
                      : "text-violet-200/45"
                }
              >
                {stage === "granted"
                  ? isListener
                    ? "Ready"
                    : "Verified"
                  : isListener
                    ? "Loading"
                    : "Secure"}
              </span>
            </div>

            <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/[0.055]">
              <div
                className={`h-full rounded-full shadow-[0_0_14px_rgba(139,92,246,0.7)] transition-[width] duration-700 ease-out ${
                  isListener
                    ? "bg-gradient-to-r from-blue-400 via-violet-400 to-blue-200"
                    : "bg-gradient-to-r from-blue-400 via-violet-400 to-purple-300"
                }`}
                style={{
                  width: progressWidth,
                }}
              />
            </div>
          </div>

          {/* EXPERIENCE STEPS */}
          <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <AccessStep
              label="Identity"
              active
              listener={isListener}
            />

            <AccessStep
              label="Profile"
              active={stage !== "verifying"}
              listener={isListener}
            />

            <AccessStep
              label={isListener ? "Library" : "Access"}
              active={
                stage === "access" ||
                stage === "granted"
              }
              listener={isListener}
            />

            <AccessStep
              label={isListener ? "Ready" : "Enter"}
              active={stage === "granted"}
              listener={isListener}
            />
          </div>

          {/* FOOTER */}
          <div className="mt-9 border-t border-white/[0.06] pt-5 text-center">
            <p className="text-[9px] uppercase tracking-[0.22em] text-white/15">
              {isListener
                ? "SOA Music"
                : "SOA Music Private Network"}
            </p>

            <p className="mt-2 text-[9px] tracking-[0.12em] text-white/10">
              {isListener
                ? "Your music. Your profile. Your SOA."
                : `Secure session • ${destinationLabel}`}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

// ========================================================
// STEP
// ========================================================

function AccessStep({
  label,
  active,
  listener,
}: {
  label: string;
  active: boolean;
  listener: boolean;
}) {
  return (
    <div
      className={`
        rounded-xl
        border
        px-3
        py-3
        text-center
        transition
        duration-500

        ${
          active
            ? listener
              ? `
                  border-blue-300/15
                  bg-blue-400/[0.045]
                `
              : `
                  border-violet-300/15
                  bg-violet-400/[0.055]
                `
            : `
                border-white/[0.05]
                bg-white/[0.015]
              `
        }
      `}
    >
      <div
        className={`
          mx-auto
          h-1.5
          w-1.5
          rounded-full
          transition
          duration-500

          ${
            active
              ? listener
                ? `
                    bg-blue-300
                    shadow-[0_0_10px_rgba(147,197,253,0.8)]
                  `
                : `
                    bg-violet-300
                    shadow-[0_0_10px_rgba(196,181,253,0.8)]
                  `
              : `
                  bg-white/10
                `
          }
        `}
      />

      <p
        className={`
          mt-2
          text-[8px]
          font-medium
          uppercase
          tracking-[0.16em]
          transition
          duration-500

          ${
            active
              ? "text-white/45"
              : "text-white/15"
          }
        `}
      >
        {label}
      </p>
    </div>
  );
}
