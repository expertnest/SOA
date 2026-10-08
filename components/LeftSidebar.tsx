"use client";

import {

  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  ChevronsLeft,
  ListMusic,
  User,
  LayoutDashboard,
} from "lucide-react";

import {

  useEffect,
  useState,
} from "react";

import Image from "next/image";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {

  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import { useMusic } from "@/hooks/MusicContext";

import SidebarLibrary from "@/components/SidebarLibrary";

// =========================================================

// LEFT SIDEBAR
// =========================================================

export default function LeftSidebar({
  isSignedIn,
  dashboardHref,
}: {
  isSignedIn: boolean;

  dashboardHref: string | null;

}) {
  const pathname = usePathname();

  const { user } = useUser();

  const accountName =
    user?.fullName ||
    user?.firstName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "SOA Listener";

  const accountRole =
    dashboardHref === "/admin"
      ? "Platform Admin"
      : dashboardHref === "/artist-dashboard"
        ? "Artist"
        : "Listener";

  const isWorkspaceRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/artist-dashboard");

  // ======================================================

  // LOCAL UI STATE
  // ======================================================

  const [
    leftCollapsed,
    setLeftCollapsed,
  ] = useState(false);

  useEffect(() => {
    setLeftCollapsed(isWorkspaceRoute);

  }, [pathname, isWorkspaceRoute]);
const [
    mounted,
    setMounted,
  ] = useState(false);

  const [
    shuffle,
    setShuffle,
  ] = useState(false);

  const [
    repeat,
    setRepeat,
  ] = useState(false);

  // ======================================================

  // MUSIC CONTEXT
  // ======================================================

  const {
    songs,
    isPlaying,
    togglePlay,
    handleNext,
    handlePrev,
    progress,
    seek,
    volume,
    setVolume,
    playSong,
    currentSong,
    duration,
  } = useMusic();

  // ======================================================

  // MOUNT
  // ======================================================

  useEffect(() => {
    setMounted(true);

    if (
      !currentSong &&
      songs.length > 0
    ) {
      playSong(
        songs[0]
      );

    }

  }, [
    songs,
    currentSong,
    playSong,
  ]);

  // ======================================================

  // DISPLAY SONG
  // ======================================================

  const displaySong =
    currentSong || {
      coverImage:
        "/assets/soalogo.png",
      title:
        "Nothing playing",
      artistName:
        "SOA Music",
    };

  // ======================================================

  // SAFE PROGRESS
  // ======================================================

  const safeProgress =
    Math.min(
      Math.max(
        progress || 0,
        0
      ),
      100
    );

  // ======================================================

  // CURRENT TIME
  // ======================================================

  const currentTime =
    duration
      ? Math.floor(
          (
            safeProgress /
            100
          ) *
            duration
        )
      : 0;

  // ======================================================

  // FORMAT TIME
  // ======================================================

  const formatTime = (
    time: number
  ) => {
    if (
      isNaN(time) ||
      time < 0 ||
      !isFinite(time)
    ) {
      return "0:00";

    }

    const minutes =
      Math.floor(
        time /
          60
      );

    const seconds =
      String(
        Math.floor(
          time %
            60
        )
      ).padStart(
        2,
        "0"
      );

    return `${minutes}:${seconds}`;

  };

  // ======================================================

  // MOUNT GUARD
  // ======================================================

  if (!mounted) {
    return null;

  }

  // ======================================================

  // UI
  // ======================================================

  return (
    <aside
      className={`
        relative
        flex
        h-full
        min-h-0
        flex-shrink-0
        flex-col
        overflow-hidden
        border-r
        border-white/[0.09]
        bg-[#12141a]
        text-white
        transition-[width]
        duration-300
        ${
          leftCollapsed
            ? "w-[64px]"
            : "w-[280px] xl:w-[310px] 2xl:w-[350px]"
        }

      `}
    >
      {/* ==================================================
          AMBIENT BACKGROUND
      \\\\\\\\================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -left-24
            top-20
            h-64
            w-64
            rounded-full
            bg-blue-600/[0.045]
            blur-[100px]
          "
        />
        <div
          className="
            absolute
            -right-28
            top-[38%]
            h-72
            w-72
            rounded-full
            bg-violet-600/[0.045]
            blur-[110px]
          "
        />
      </div>
      {/* ==================================================
          COLLAPSED MODE
      \\\\\\\\================================================== */}

      {leftCollapsed ? (
        <div
          className="
            relative
            z-10
            flex
            h-full
            min-h-0
            flex-col
            items-center
            px-2
            py-3
          "
        >
          {/* EXPAND */}

          <button
            type="button"
            onClick={() =>
              setLeftCollapsed(
                false
              )
            }

            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              text-white/45
              transition
              hover:bg-white/[0.065]
              hover:text-white
            "
            aria-label="Expand music player"
          >
            <ChevronsLeft
              size={18}
              className="rotate-180"
            />
          </button>
          {/* LOGO */}

          <div
            className="
              mt-4
              flex
              h-10
              w-10
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              border
              border-white/[0.09]
              bg-white/[0.035]
            "
          >
            <Image
              src="/assets/soalogo.png"
              alt="SOA"
              width={34}
              height={34}
              className="object-contain"
            />
          </div>
          {/* LINE */}

          <div
            className="
              my-4
              h-px
              w-7
              bg-white/[0.085]
            "
          />
          {/* CURRENT COVER */}

          <div
            className="
              relative
              h-10
              w-10
              overflow-hidden
              rounded-xl
              border
              border-violet-400/15
              bg-[#181b22]
              shadow-[0_0_16px_rgba(124,58,237,0.08)]
            "
          >
            <Image
              src={
                displaySong.coverImage ||
                "/assets/soalogo.png"
              }

              alt={
                displaySong.title ||
                "Current track"
              }

              fill
              sizes="40px"
              className={
                displaySong.coverImage
                  ? "object-cover"
                  : "object-contain"
              }

              unoptimized
            />
          </div>
          {/* PLAY */}

          <button
            type="button"
            onClick={
              togglePlay
            }

            disabled={
              !currentSong
            }

            className="
              mt-4
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-white
              text-black
              shadow-[0_0_18px_rgba(255,255,255,0.10)]
              transition
              hover:scale-105
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
            aria-label={
              isPlaying
                ? "Pause"
                : "Play"
            }

          >
            {isPlaying ? (
              <Pause
                size={16}
                fill="currentColor"
              />
            ) : (
              <Play
                size={16}
                fill="currentColor"
                className="ml-0.5"
              />
            )}
          </button>
          {/* MINI PROGRESS */}

          <div
            className="
              relative
              mt-5
              h-24
              w-1
              overflow-hidden
              rounded-full
              bg-white/[0.085]
            "
          >
            <div
              className="
                absolute
                bottom-0
                left-0
                w-full
                rounded-full
                bg-gradient-to-t
                from-blue-400
                via-violet-400
                to-purple-400
                shadow-[0_0_8px_rgba(124,58,237,0.45)]
              "
              style={{
                height:
                  `${safeProgress}%`,
              }}
            />
          </div>
          {/* ACCOUNT */}

        <div
          className="
            mt-auto
            flex
            flex-col
            items-center
            gap-2
          "
        >
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button
                type="button"
                aria-label="Login"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-white/[0.035]
                  text-white/45
                  transition
                  hover:border-violet-400/20
                  hover:bg-violet-500/[0.07]
                  hover:text-white
                "
              >
                <User size={15} />
              </button>
            </SignInButton>
          ) : (
            <>
              {dashboardHref && (
                <Link
                  href={dashboardHref}
                  aria-label="Dashboard"
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-violet-400/15
                    bg-violet-500/[0.055]
                    text-violet-200/70
                    transition
                    hover:border-violet-400/25
                    hover:bg-violet-500/[0.09]
                    hover:text-violet-100
                  "
                >
                  <LayoutDashboard size={15} />
                </Link>
              )}
              <Link
                href="/profile"
                aria-label="Profile"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-white/[0.035]
                  text-white/45
                  transition
                  hover:border-violet-400/20
                  hover:bg-violet-500/[0.07]
                  hover:text-white
                "
              >
                <User size={15} />
              </Link>
              <div className="flex h-9 w-9 items-center justify-center">
                <UserButton />
              </div>
            </>
          )}
        </div>
        {/* LIBRARY ICON */}

          <div
            className="
              mt-auto
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              text-white/34
            "
          >
            <ListMusic
              size={17}
            />
          </div>
        </div>
      ) : (
        // ==================================================

        // EXPANDED MODE
        // ==================================================

        <div
          className="
            relative
            z-10
            flex
            h-full
            min-h-0
            flex-col
            px-3
            pb-3
            pt-3
            xl:px-4
            xl:pb-4
            [@media(max-height:820px)]:pb-2
            [@media(max-height:820px)]:pt-2
          "
        >
          {/* ==================================================
              ACCOUNT HEADER
          \\================================================== */}

          <header
            className="
              flex
              shrink-0
              items-center
              justify-between
              gap-2
              pb-2
              xl:pb-3
              [@media(max-height:820px)]:pb-1.5
            "
          >
            <div className="min-w-0 flex-1">
              {isSignedIn ? (
                <div className="flex min-w-0 items-center gap-2.5">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/[0.09]
                      bg-white/[0.035]
                    "
                  >
                    <UserButton />
                  </div>
                  <Link
                    href="/profile"
                    className="
                      group
                      min-w-0
                      flex-1
                      rounded-lg
                      px-1
                      py-0.5
                      transition
                      hover:bg-white/[0.035]
                    "
                  >
                    <p
                      className="
                        truncate
                        text-[11px]
                        font-semibold
                        tracking-[0.01em]
                        text-white/85
                        transition
                        group-hover:text-white
                      "
                    >
                      {accountName}
                    </p>
                    <p
                      className="
                        mt-0.5
                        truncate
                        text-[8px]
                        uppercase
                        tracking-[0.14em]
                        text-white/34
                      "
                    >
                      {accountRole}
                    </p>
                  </Link>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="
                      flex
                      w-full
                      min-w-0
                      items-center
                      gap-2.5
                      rounded-xl
                      border
                      border-white/[0.07]
                      bg-white/[0.025]
                      p-1.5
                      text-left
                      transition
                      hover:border-violet-400/15
                      hover:bg-violet-500/[0.045]
                    "
                  >
                    <span
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-white/[0.055]
                        text-white/45
                      "
                    >
                      <User size={14} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] font-medium text-white/70">
                        Sign in
                      </span>
                      <span className="mt-0.5 block text-[8px] uppercase tracking-[0.13em] text-white/30">
                        SOA account
                      </span>
                    </span>
                  </button>
                </SignInButton>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {isSignedIn && dashboardHref && (
                <Link
                  href={dashboardHref}
                  aria-label="Dashboard"
                  title="Dashboard"
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    text-violet-200/55
                    transition
                    hover:bg-violet-500/[0.075]
                    hover:text-violet-100
                  "
                >
                  <LayoutDashboard size={14} />
                </Link>
              )}
              <button
                type="button"
                onClick={() => setLeftCollapsed(true)}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-white/45
                  transition
                  hover:bg-white/[0.055]
                  hover:text-white
                "
                aria-label="Collapse music player"
              >
                <ChevronsLeft size={17} />
              </button>
            </div>
          </header>
          <div
            className="
              h-px
              shrink-0
              bg-white/[0.075]
            "
          />
          {/* ==================================================
              NOW PLAYING
          \\\\\\\\================================================== */}

          <section
            className="
              shrink-0
              pt-3
              xl:pt-4
              [@media(max-height:820px)]:pt-2
            "
          >
            {/* ARTWORK */}

            <div
              className="
                relative
                mx-auto
                aspect-square
                w-full
                max-w-[175px]
                xl:max-w-[205px]
                2xl:max-w-[235px]
                [@media(max-height:900px)]:max-w-[160px]
                [@media(max-height:820px)]:max-w-[140px]
                [@media(max-height:740px)]:max-w-[120px]
              "
            >
              {/* GLOW */}

              {currentSong && (
                <div
                  className="
                    absolute
                    inset-4
                    rounded-[28px]
                    bg-gradient-to-br
                    from-blue-500/25
                    via-violet-500/20
                    to-purple-500/25
                    blur-[32px]
                  "
                />
              )}
              {/* COVER FRAME */}

              <div
                className="
                  relative
                  h-full
                  w-full
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-white/[0.10]
                  bg-[#171a21]
                  shadow-[0_20px_55px_rgba(0,0,0,0.50)]
                "
              >
                <Image
                  src={
                    displaySong.coverImage ||
                    "/assets/soalogo.png"
                  }

                  alt={
                    displaySong.title ||
                    "Now Playing"
                  }

                  fill
                  sizes="300px"
                  className={
                    displaySong.coverImage
                      ? "object-cover"
                      : "object-contain p-7"
                  }

                  unoptimized
                />
                {/* COVER OVERLAY */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/35
                    via-transparent
                    to-transparent
                  "
                />
                {/* NOW PLAYING BADGE */}

                <div
                  className="
                    absolute
                    left-3
                    top-3
                  "
                >
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-white/[0.10]
                      bg-black/55
                      px-2.5
                      py-1
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.13em]
                      text-white/65
                      backdrop-blur-xl
                    "
                  >
                    {isPlaying && (
                      <span
                        className="
                          h-1.5
                          w-1.5
                          rounded-full
                          bg-violet-300
                          shadow-[0_0_8px_rgba(196,181,253,0.75)]
                        "
                      />
                    )}
                    Now Playing
                  </span>
                </div>
                {/* SOA BADGE */}

                <div
                  className="
                    absolute
                    right-3
                    top-3
                  "
                >
                  <span
                    className="
                      rounded-full
                      border
                      border-white/[0.10]
                      bg-black/55
                      px-2
                      py-1
                      text-[8px]
                      font-medium
                      tracking-[0.14em]
                      text-white/45
                      backdrop-blur-xl
                    "
                  >
                    SOA
                  </span>
                </div>
              </div>
            </div>
            {/* ==================================================
                TRACK INFO
            \\\\\\\\================================================== */}

            <div
              className="
                mt-2.5
                xl:mt-3
                [@media(max-height:820px)]:mt-1.5
                flex
                items-start
                justify-between
                gap-4
              "
            >
              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <p
                  className="
                    truncate
                    text-[13px]
                    xl:text-[15px]
                    [@media(max-height:820px)]:text-[12px]
                    font-semibold
                    tracking-tight
                    text-white
                  "
                >
                  {
                    displaySong.title
                  }

                </p>
                <p
                  className="
                    mt-1
                    truncate
                    text-[11px]
                    text-white/45
                  "
                >
                  {
                    displaySong.artistName
                  }

                </p>
              </div>
              {currentSong && (
                <div
                  className="
                    mt-1
                    flex
                    shrink-0
                    items-center
                    gap-1
                  "
                >
                  <span
                    className={`
                      h-1
                      w-1
                      rounded-full
                      transition
                      ${
                        isPlaying
                          ? "bg-blue-300"
                          : "bg-white/15"
                      }

                    `}
                  />
                  <span
                    className={`
                      h-2
                      w-1
                      rounded-full
                      transition
                      ${
                        isPlaying
                          ? "bg-violet-300"
                          : "bg-white/15"
                      }

                    `}
                  />
                  <span
                    className={`
                      h-3
                      w-1
                      rounded-full
                      transition
                      ${
                        isPlaying
                          ? "bg-purple-300"
                          : "bg-white/15"
                      }

                    `}
                  />
                  <span
                    className={`
                      h-2
                      w-1
                      rounded-full
                      transition
                      ${
                        isPlaying
                          ? "bg-violet-300"
                          : "bg-white/15"
                      }

                    `}
                  />
                </div>
              )}
            </div>
            {/* ==================================================
                CONTROLS
            \\\\\\\\================================================== */}

            {currentSong && (
              <>
                <div
                  className="
                    mt-3
                    flex
                    xl:mt-4
                    [@media(max-height:820px)]:mt-2
                    items-center
                    justify-between
                  "
                >
                  {/* SHUFFLE */}

                  <button
                    type="button"
                    onClick={() =>
                      setShuffle(
                        !shuffle
                      )
                    }

                    className={`
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-xl
                      transition
                      ${
                        shuffle
                          ? `
                            bg-violet-500/[0.10]
                            text-violet-200
                          `
                          : `
                            text-white/38
                            hover:bg-white/[0.055]
                            hover:text-white/70
                          `
                      }

                    `}
                    title={
                      shuffle
                        ? "Shuffle ON"
                        : "Shuffle OFF"
                    }

                    aria-label={
                      shuffle
                        ? "Shuffle on"
                        : "Shuffle off"
                    }

                  >
                    <Shuffle
                      size={15}
                    />
                  </button>
                  {/* PREVIOUS */}

                  <button
                    type="button"
                    onClick={
                      handlePrev
                    }

                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      text-white/55
                      transition
                      hover:bg-white/[0.055]
                      hover:text-white
                      active:scale-95
                    "
                    aria-label="Previous track"
                  >
                    <SkipBack
                      size={17}
                      fill="currentColor"
                    />
                  </button>
                  {/* PLAY */}

                  <button
                    type="button"
                    onClick={
                      togglePlay
                    }

                    className="
                      relative
                      flex
                      h-11
                      w-11
                      xl:h-11
                      xl:w-11
                      [@media(max-height:820px)]:h-10
                      [@media(max-height:820px)]:w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-black
                      shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_10px_25px_rgba(0,0,0,0.4)]
                      transition
                      duration-200
                      hover:scale-105
                      hover:bg-violet-50
                      active:scale-95
                    "
                    aria-label={
                      isPlaying
                        ? "Pause"
                        : "Play"
                    }

                  >
                    {isPlaying ? (
                      <Pause
                        size={17}
                        fill="currentColor"
                      />
                    ) : (
                      <Play
                        size={17}
                        fill="currentColor"
                        className="ml-0.5"
                      />
                    )}
                  </button>
                  {/* NEXT */}

                  <button
                    type="button"
                    onClick={
                      handleNext
                    }

                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      text-white/55
                      transition
                      hover:bg-white/[0.055]
                      hover:text-white
                      active:scale-95
                    "
                    aria-label="Next track"
                  >
                    <SkipForward
                      size={17}
                      fill="currentColor"
                    />
                  </button>
                  {/* REPEAT */}

                  <button
                    type="button"
                    onClick={() =>
                      setRepeat(
                        !repeat
                      )
                    }

                    className={`
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      transition
                      ${
                        repeat
                          ? `
                            bg-violet-500/[0.10]
                            text-violet-200
                          `
                          : `
                            text-white/38
                            hover:bg-white/[0.055]
                            hover:text-white/70
                          `
                      }

                    `}
                    title={
                      repeat
                        ? "Repeat ON"
                        : "Repeat OFF"
                    }

                    aria-label={
                      repeat
                        ? "Repeat on"
                        : "Repeat off"
                    }

                  >
                    <Repeat
                      size={15}
                    />
                  </button>
                </div>
                {/* ==================================================
                    PROGRESS
                \\\\\\\\================================================== */}

                <div
                  className="
                    mt-2.5
                    xl:mt-3.5
                    [@media(max-height:820px)]:mt-1.5
                  "
                >
                  <button
                    type="button"
                    className="
                      group
                      relative
                      block
                      h-1.5
                      w-full
                      cursor-pointer
                      rounded-full
                      bg-white/[0.095]
                    "
                    onClick={
                      event => {
                        const rect =
                          event.currentTarget.getBoundingClientRect();

                        const percent =
                          (
                            (
                              event.clientX -
                              rect.left
                            ) /
                            rect.width
                          ) *
                          100;

                        seek(
                          Math.min(
                            Math.max(
                              percent,
                              0
                            ),
                            100
                          )
                        );

                      }

                    }

                    aria-label="Seek through track"
                  >
                    {/* FILLED PROGRESS */}

                    <span
                      className="
                        absolute
                        bottom-0
                        left-0
                        top-0
                        rounded-full
                        bg-gradient-to-r
                        from-blue-400
                        via-violet-400
                        to-purple-400
                        shadow-[0_0_10px_rgba(124,58,237,0.45)]
                        transition-[width]
                        duration-150
                      "
                      style={{
                        width:
                          `${safeProgress}%`,
                      }}
                    />
                    {/* HOVER THUMB */}

                    <span
                      className="
                        absolute
                        top-1/2
                        h-3
                        w-3
                        -translate-y-1/2
                        rounded-full
                        border
                        border-white/50
                        bg-white
                        opacity-0
                        shadow-[0_0_10px_rgba(196,181,253,0.55)]
                        transition
                        group-hover:opacity-100
                      "
                      style={{
                        left:
                          `calc(${safeProgress}% - 6px)`,
                      }}
                    />
                  </button>
                  {/* TIME */}

                  <div
                    className="
                      mt-2
                      flex
                      justify-between
                      text-[9px]
                      tabular-nums
                      text-white/34
                    "
                  >
                    <span>
                      {formatTime(
                        currentTime
                      )}
                    </span>
                    <span>
                      {formatTime(
                        duration
                      )}
                    </span>
                  </div>
                </div>
              </>
            )}
          </section>
          {/* ==================================================
            SIDEBAR LIBRARY
        ================================================== */}
        <SidebarLibrary />
        {/* ==================================================
              BOTTOM PLAYER UTILITIES
          \\\\\\\\================================================== */}

          <div
            className="
              shrink-0
              border-t
              border-white/[0.10]
              pt-2
              xl:pt-3
              [@media(max-height:820px)]:pt-1.5
            "
          >
            {/* VOLUME */}

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <Volume2
                size={14}
                className="
                  shrink-0
                  text-white/50
                "
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={
                  volume
                }

                onChange={
                  event =>
                    setVolume(
                      parseFloat(
                        event.target.value
                      )
                    )
                }

                className="
                  h-1
                  w-full
                  cursor-pointer
                  accent-violet-400
                "
                aria-label="Volume"
              />
              <span
                className="
                  w-7
                  text-right
                  text-[9px]
                  tabular-nums
                  text-white/50
                "
              >
                {Math.round(
                  volume *
                    100
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );

}
