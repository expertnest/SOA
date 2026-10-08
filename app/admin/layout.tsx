"use client";

import {
  type ReactNode,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  useAuth,
} from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  CircleUserRound,
  Disc3,
  Gauge,
  LockKeyhole,
  Menu,
  Music2,
  ShieldAlert,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";

type AdminLayoutProps = {
  children: ReactNode;
};

const MINIMUM_LOADING_TIME = 3000;

// ========================================================
// PAGE
// ========================================================

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const pathname =
    usePathname();

  const [
    mobileNavOpen,
    setMobileNavOpen,
  ] = useState(false);

  // ======================================================
  // AUTH
  // ======================================================

  const {
    isLoaded,
    isSignedIn,
  } = useAuth();

  // ======================================================
  // MINIMUM PREMIUM LOADING TIME
  // ======================================================

  const [
    minimumLoadComplete,
    setMinimumLoadComplete,
  ] = useState(false);

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          setMinimumLoadComplete(
            true
          );
        },
        MINIMUM_LOADING_TIME
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, []);

  // ======================================================
  // CURRENT USER
  // ======================================================

  const currentUser =
    useQuery(
      api.users.getCurrentUser,
      isSignedIn
        ? {}
        : "skip"
    );

  // ======================================================
  // CLERK LOADING
  // ======================================================

  if (!isLoaded) {
    return (
      <AdminLoading />
    );
  }

  // ======================================================
  // NOT SIGNED IN
  // ======================================================

  if (!isSignedIn) {
    return (
      <AccessScreen
        title="Sign in required"
        description="Sign in with an authorized SOA administrator account."
      >
        <SignInButton mode="modal">
          <button
            type="button"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Sign In
          </button>
        </SignInButton>
      </AccessScreen>
    );
  }

  // ======================================================
  // CONVEX + PREMIUM LOADING
  // ======================================================

  if (
    currentUser === undefined ||
    !minimumLoadComplete
  ) {
    return (
      <AdminLoading />
    );
  }

  // ======================================================
  // NOT PLATFORM ADMIN
  // ======================================================

  if (
    !currentUser ||
    currentUser.platformRole !==
      "admin"
  ) {
    return (
      <AccessScreen
        title="Admin access required"
        description="This account does not have permission to access the SOA administration area."
      >
        <Link
          href="/"
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          Return to SOA Music
        </Link>
      </AccessScreen>
    );
  }

  // ======================================================
  // ALLOWED / ADMIN SHELL
  // ======================================================

  return (
    <div className="relative flex min-h-full w-full bg-[#15171c] text-white">
      {/* DESKTOP ADMIN SIDEBAR */}
      <aside className="hidden w-[245px] shrink-0 border-r border-white/[0.065] bg-[#111319] xl:sticky xl:top-0 xl:flex xl:h-screen xl:self-start xl:flex-col">
        <AdminSidebar
          pathname={pathname}
        />
      </aside>

      {/* MOBILE / TABLET TOP BAR */}
      <div className="fixed left-0 right-0 top-0 z-40 border-b border-white/[0.065] bg-[#111319]/95 backdrop-blur-xl xl:hidden">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-300/10 bg-violet-400/[0.04]">
              <ShieldAlert
                size={15}
                className="text-violet-100/45"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-white/80">
                SOA Admin
              </p>

              <p className="text-[9px] uppercase tracking-[0.14em] text-violet-200/35">
                Control center
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setMobileNavOpen(
                true
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-white/50"
            aria-label="Open admin navigation"
          >
            <Menu size={17} />
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="Close admin navigation"
            onClick={() =>
              setMobileNavOpen(
                false
              )
            }
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          />

          <div className="absolute bottom-0 left-0 top-0 w-[290px] max-w-[86vw] border-r border-white/[0.07] bg-[#111319] shadow-[30px_0_80px_rgba(0,0,0,0.45)]">
            <div className="flex h-14 items-center justify-between border-b border-white/[0.06] px-4">
              <p className="text-xs font-semibold text-white/65">
                Admin navigation
              </p>

              <button
                type="button"
                onClick={() =>
                  setMobileNavOpen(
                    false
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-white/40"
                aria-label="Close admin navigation"
              >
                <X size={15} />
              </button>
            </div>

            <AdminSidebar
              pathname={
                pathname
              }
              onNavigate={() =>
                setMobileNavOpen(
                  false
                )
              }
            />
          </div>
        </div>
      )}

      {/* PAGE CONTENT */}
      <main className="min-w-0 flex-1 pt-14 xl:pt-0">
        {children}
      </main>
    </div>
  );
}

// ========================================================
// ADMIN SIDEBAR
// ========================================================

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  exact?: boolean;
  disabled?: boolean;
  badge?: string;
};

function AdminSidebar({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const overviewNav: NavItem[] = [
    {
      label: "Overview",
      href: "/admin",
      icon: <Gauge size={16} />,
      exact: true,
    },
  ];

  const platformNav: NavItem[] = [
    {
      label: "Users",
      href: "/admin/users",
      icon: (
        <UsersRound size={16} />
      ),
      disabled: true,
      badge: "Soon",
    },
    {
      label: "Artists",
      href: "/admin/artists",
      icon: (
        <CircleUserRound
          size={16}
        />
      ),
      disabled: true,
      badge: "Soon",
    },
    {
      label: "Music",
      href: "/admin/music",
      icon: <Music2 size={16} />,
      disabled: true,
      badge: "Soon",
    },
  ];

  const insightsNav: NavItem[] = [
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: (
        <BarChart3 size={16} />
      ),
      disabled: true,
      badge: "Soon",
    },
  ];

  const workspaceNav: NavItem[] = [
    {
      label: "Artist Dashboard",
      href: "/artist-dashboard",
      icon: <Disc3 size={16} />,
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* BRAND */}
      <div className="border-b border-white/[0.06] p-4">
        <Link
          href="/admin"
          onClick={
            onNavigate
          }
          className="flex items-center gap-3 rounded-2xl border border-violet-400/10 bg-violet-400/[0.035] p-3 transition hover:border-violet-300/18 hover:bg-violet-400/[0.055]"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/12 bg-violet-300/[0.05]">
            <ShieldAlert
              size={18}
              className="text-violet-100/55"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-semibold text-white/82">
                SOA Admin
              </p>

              <Sparkles
                size={11}
                className="shrink-0 text-violet-200/35"
              />
            </div>

            <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-white/25">
              Platform control
            </p>
          </div>
        </Link>
      </div>

      {/* NAV */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <NavGroup
          items={overviewNav}
          pathname={pathname}
          onNavigate={
            onNavigate
          }
        />

        <NavSection
          title="Platform"
          items={platformNav}
          pathname={pathname}
          onNavigate={
            onNavigate
          }
        />

        <NavSection
          title="Insights"
          items={insightsNav}
          pathname={pathname}
          onNavigate={
            onNavigate
          }
        />

        <NavSection
          title="Workspace"
          items={workspaceNav}
          pathname={pathname}
          onNavigate={
            onNavigate
          }
        />

        <div className="mt-5 border-t border-white/[0.06] pt-4">
          <Link
            href="/"
            onClick={
              onNavigate
            }
            className="group flex items-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.025] px-3 py-2.5 text-xs text-white/45 transition hover:border-emerald-400/20 hover:bg-emerald-400/[0.045] hover:text-white/75"
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.85)]" />
            </span>

            <span className="flex-1">
              View Live Site
            </span>

            <ArrowUpRight
              size={13}
              className="text-emerald-200/45 transition group-hover:text-emerald-200/70"
            />
          </Link>
        </div>
      </div>

    </div>
  );
}

// ========================================================
// NAV HELPERS
// ========================================================

function NavSection({
  title,
  items,
  pathname,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="mt-5">
      <p className="px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/18">
        {title}
      </p>

      <div className="mt-2 space-y-1">
        <NavGroup
          items={items}
          pathname={
            pathname
          }
          onNavigate={
            onNavigate
          }
        />
      </div>
    </div>
  );
}

function NavGroup({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {items.map(item => {
        const active =
          item.exact
            ? pathname ===
              item.href
            : pathname ===
                item.href ||
              pathname.startsWith(
                `${item.href}/`
              );

        if (item.disabled) {
          return (
            <div
              key={item.href}
              className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/20"
            >
              <span>
                {item.icon}
              </span>

              <span className="flex-1">
                {item.label}
              </span>

              {item.badge && (
                <span className="rounded-full border border-white/[0.05] bg-white/[0.02] px-2 py-0.5 text-[8px] uppercase tracking-[0.09em] text-white/20">
                  {item.badge}
                </span>
              )}
            </div>
          );
        }

        return (
          <Link
            key={
              item.href
            }
            href={
              item.href
            }
            onClick={
              onNavigate
            }
            className={`
              flex
              items-center
              gap-3
              rounded-xl
              border
              px-3
              py-2.5
              text-xs
              transition

              ${
                active
                  ? "border-violet-400/12 bg-violet-400/[0.07] text-violet-100/85"
                  : "border-transparent text-white/36 hover:bg-white/[0.035] hover:text-white/70"
              }
            `}
          >
            <span
              className={
                active
                  ? "text-violet-200/65"
                  : "text-white/28"
              }
            >
              {item.icon}
            </span>

            <span className="flex-1">
              {item.label}
            </span>

            {active && (
              <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_8px_rgba(196,181,253,0.7)]" />
            )}
          </Link>
        );
      })}
    </>
  );
}

// ========================================================
// LOADING
// ========================================================

function AdminLoading() {
  return (
    <main className="relative w-full overflow-hidden bg-[#15171c] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-[360px] w-[360px] rounded-full bg-violet-500/[0.06] blur-3xl" />
        <div className="absolute left-[10%] top-[520px] h-[280px] w-[280px] rounded-full bg-blue-500/[0.025] blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] animate-pulse">
        <div className="flex flex-col gap-4 border-b border-violet-400/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl border border-violet-300/10 bg-white/[0.05]" />

            <div>
              <div className="h-3.5 w-28 rounded-full bg-white/[0.08]" />
              <div className="mt-2 h-2.5 w-20 rounded-full bg-white/[0.04]" />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="h-8 w-20 rounded-lg bg-white/[0.045]" />
            <div className="h-8 w-20 rounded-lg bg-white/[0.045]" />
            <div className="h-8 w-20 rounded-lg bg-white/[0.045]" />
          </div>
        </div>

        <section className="mt-6 overflow-hidden rounded-[30px] border border-violet-400/15 bg-[#171920] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <div className="relative min-h-[300px] p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.035] via-transparent to-blue-500/[0.025]" />

            <div className="relative">
              <div className="h-7 w-36 rounded-full border border-white/[0.05] bg-white/[0.04]" />

              <div className="mt-6 h-12 w-64 rounded-xl bg-white/[0.075] sm:h-14 sm:w-80" />

              <div className="mt-4 h-3 w-full max-w-[520px] rounded-full bg-white/[0.045]" />

              <div className="mt-2 h-3 w-[70%] max-w-[420px] rounded-full bg-white/[0.035]" />

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="h-11 w-32 rounded-xl bg-white/[0.05]" />

                <div className="h-11 w-32 rounded-xl bg-violet-500/[0.10]" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {Array.from({
            length: 4,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/[0.07] bg-[#1b1d23] p-4"
              >
                <div className="h-2.5 w-20 rounded-full bg-white/[0.04]" />

                <div className="mt-4 h-7 w-24 rounded-lg bg-white/[0.07]" />

                <div className="mt-3 h-2.5 w-16 rounded-full bg-white/[0.035]" />
              </div>
            )
          )}
        </section>
      </div>
    </main>
  );
}

// ========================================================
// ACCESS SCREEN
// ========================================================

function AccessScreen({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#15171c] px-5 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#1b1d23] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.05]">
          <ShieldAlert
            size={20}
            className="text-violet-200/60"
          />
        </div>

        <h1 className="text-xl font-semibold tracking-tight">
          {title}
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/40">
          {description}
        </p>

        <div className="mt-6 flex justify-center">
          {children}
        </div>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-xs text-white/35 transition hover:text-white/70"
        >
          <ArrowLeft
            size={13}
          />
          Back to SOA Music
        </Link>
      </div>
    </main>
  );
}
