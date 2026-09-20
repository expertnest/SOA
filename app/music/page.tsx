 
"use client";

import { useState } from "react";
import {
  Play,
  Heart,
  ArrowUpRight,
  MoreHorizontal,
  Instagram,
  Twitter,
  Youtube,
  Music2,
} from "lucide-react";

// =========================================================
// TYPES
// =========================================================

type ReleaseItem = {
  title: string;
  year: number;
  image: string;
  tracks?: number;
};

// =========================================================
// PAGE
// =========================================================

export default function Music() {
  const [filter, setFilter] = useState<
    "all" | "albums" | "eps" | "singles"
  >("all");

  // =========================================================
  // ARTIST
  // =========================================================

  const artist = {
    name: "Nox",
    handle: "@noxsounds",
    genre: "Electronic / Trap",
    bio: "Nox creates immersive late-night soundscapes blending cinematic synths, ambient textures, and futuristic trap energy.",
    heroImage: "/headerLogo.png",
  };

  // =========================================================
  // FEATURED TRACKS
  // =========================================================

  const tracks = [
    {
      id: 1,
      name: "Midnight Echoes",
      album: "Afterglow",
      type: "album",
      plays: "12.4M",
      duration: "3:12",
      image: "/album1.jpg",
    },
    {
      id: 2,
      name: "Neon Drift",
      album: "Neon Drift",
      type: "single",
      plays: "9.1M",
      duration: "2:58",
      image: "/album2.jpg",
    },
    {
      id: 3,
      name: "Lost Signals",
      album: "Static Dreams",
      type: "ep",
      plays: "7.6M",
      duration: "3:44",
      image: "/album3.jpg",
    },
    {
      id: 4,
      name: "Cold Atmosphere",
      album: "Cold Atmosphere",
      type: "single",
      plays: "6.2M",
      duration: "4:01",
      image: "/album1.jpg",
    },
  ];

  // =========================================================
  // ALBUMS
  // =========================================================

  const albums: ReleaseItem[] = [
    {
      title: "Afterglow",
      year: 2024,
      tracks: 12,
      image: "/album1.jpg",
    },
    {
      title: "Neon Drift",
      year: 2023,
      tracks: 10,
      image: "/album2.jpg",
    },
    {
      title: "Static Dreams",
      year: 2022,
      tracks: 9,
      image: "/album3.jpg",
    },
  ];

  // =========================================================
  // EPS
  // =========================================================

  const eps: ReleaseItem[] = [
    {
      title: "Static Dreams",
      year: 2022,
      tracks: 6,
      image: "/album3.jpg",
    },
    {
      title: "After Hours",
      year: 2021,
      tracks: 5,
      image: "/album2.jpg",
    },
  ];

  // =========================================================
  // SINGLES
  // =========================================================

  const singles: ReleaseItem[] = [
    {
      title: "Neon Drift",
      year: 2023,
      image: "/album2.jpg",
    },
    {
      title: "Cold Atmosphere",
      year: 2024,
      image: "/album1.jpg",
    },
  ];

  // =========================================================
  // MERCH
  // =========================================================

  const merch = [
    {
      name: "Afterglow Hoodie",
      price: "$80",
      image: "/merch1.jpg",
    },
    {
      name: "Nox Vinyl",
      price: "$35",
      image: "/merch2.jpg",
    },
    {
      name: "Static Tee",
      price: "$45",
      image: "/merch3.jpg",
    },
  ];

  // =========================================================
  // TOUR
  // =========================================================

  const upcomingShows = [
    {
      city: "Los Angeles",
      venue: "The Novo",
      date: "JUN 12",
    },
    {
      city: "New York",
      venue: "Brooklyn Mirage",
      date: "JUN 20",
    },
    {
      city: "Tokyo",
      venue: "Zepp Shinjuku",
      date: "JUL 08",
    },
  ];

  // =========================================================
  // SOCIAL
  // =========================================================

  const socialImages = [
    "/ig1.jpg",
    "/ig2.jpg",
    "/ig3.jpg",
    "/ig4.jpg",
  ];

  // =========================================================
  // RELEASE FILTER
  // =========================================================

  const releaseItems: ReleaseItem[] =
    filter === "all"
      ? [...albums, ...eps, ...singles]
      : filter === "albums"
      ? albums
      : filter === "eps"
      ? eps
      : singles;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[30%] top-[-160px] h-[420px] w-[420px] rounded-full bg-cyan-400/[0.045] blur-[180px]" />

        <div className="absolute right-[-120px] top-[35%] h-[360px] w-[360px] rounded-full bg-blue-500/[0.035] blur-[180px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="overflow-hidden rounded-[28px] border border-zinc-800/80 bg-[#090909]">
          <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
            {/* HERO IMAGE */}

            <div className="relative min-h-[380px] overflow-hidden sm:min-h-[520px] lg:min-h-[590px]">
              <img
                src={artist.heroImage}
                alt={artist.name}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
                      SOA Artist
                    </span>

                    <span className="h-1 w-1 rounded-full bg-white/30" />

                    <span className="text-[9px] uppercase tracking-[0.2em] text-white/35">
                      {artist.genre}
                    </span>
                  </div>

                  <h1 className="mt-2 text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl">
                    {artist.name}
                  </h1>

                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
                    {artist.bio}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:bg-zinc-200"
                    >
                      <Play
                        size={15}
                        fill="currentColor"
                      />
                      Play
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-full border border-zinc-700 bg-black/40 px-5 py-2.5 text-sm font-semibold text-white/80 backdrop-blur-md transition hover:bg-black/60 hover:text-white"
                    >
                      <Heart size={15} />
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* LATEST RELEASE */}

            <div className="flex flex-col justify-between bg-[#090909] p-5 sm:p-7 lg:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-zinc-600">
                    Latest Release
                  </p>

                  <button
                    type="button"
                    aria-label="More release options"
                    className="rounded-full border border-zinc-800 p-2.5 text-zinc-500 transition hover:bg-zinc-900 hover:text-white"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-800/80">
                  <img
                    src="/album1.jpg"
                    alt="Afterglow"
                    className="aspect-square w-full object-cover"
                  />
                </div>

                <div className="mt-4">
                  <h2 className="text-2xl font-bold">
                    Afterglow
                  </h2>

                  <p className="mt-1 text-xs text-zinc-500">
                    Album · 2024 · 12 tracks
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                    A late-night collection built around dark synths,
                    atmospheric textures, and heavy futuristic production.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="mt-7 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-left transition hover:bg-zinc-900"
              >
                <span className="text-xs font-semibold text-zinc-300">
                  Open release
                </span>

                <ArrowUpRight
                  size={15}
                  className="text-zinc-500"
                />
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            RELEASES
        ===================================================== */}

        <section className="mt-12">
          <div className="flex flex-col gap-4 border-b border-zinc-800/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-cyan-300">
                Discography
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Releases
              </h2>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                {
                  id: "all",
                  label: "All",
                },
                {
                  id: "albums",
                  label: "Albums",
                },
                {
                  id: "eps",
                  label: "EPs",
                },
                {
                  id: "singles",
                  label: "Singles",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setFilter(
                      item.id as
                        | "all"
                        | "albums"
                        | "eps"
                        | "singles"
                    )
                  }
                  className={`rounded-full px-3.5 py-2 text-[10px] font-semibold transition ${
                    filter === item.id
                      ? "bg-white text-black"
                      : "border border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {releaseItems.map((item) => (
              <button
                key={`${item.title}-${item.year}`}
                type="button"
                className="group text-left"
              >
                <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#0a0a0a]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <span className="rounded-full border border-zinc-700/70 bg-black/45 px-2.5 py-1 text-[8px] uppercase tracking-[0.16em] text-zinc-300 backdrop-blur-md">
                      {item.tracks
                        ? filter === "eps"
                          ? "EP"
                          : "Album"
                        : "Single"}
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black opacity-0 transition group-hover:opacity-100">
                      <Play
                        size={13}
                        fill="currentColor"
                      />
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="truncate text-sm font-semibold text-zinc-100">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    {item.year}
                    {item.tracks
                      ? ` · ${item.tracks} tracks`
                      : ""}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* =====================================================
            FEATURED TRACKS
        ===================================================== */}

        <section className="mt-14">
          <div className="flex items-end justify-between border-b border-zinc-800/80 pb-5">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-zinc-600">
                Selected Tracks
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Featured
              </h2>
            </div>

            <button
              type="button"
              className="flex items-center gap-1 text-xs text-zinc-500 transition hover:text-white"
            >
              View music
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                type="button"
                className="group flex items-center gap-3 rounded-xl border border-zinc-800/70 bg-[#090909] p-3 text-left transition hover:bg-zinc-900"
              >
                <span className="w-5 text-center text-[10px] tabular-nums text-zinc-700">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <img
                  src={track.image}
                  alt={track.album}
                  className="h-11 w-11 rounded-lg object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-200 group-hover:text-white">
                    {track.name}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-zinc-600">
                    {track.album}
                  </p>
                </div>

                <span className="hidden text-xs text-zinc-700 sm:block">
                  {track.plays}
                </span>

                <span className="text-xs tabular-nums text-zinc-600">
                  {track.duration}
                </span>

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-zinc-500 transition group-hover:bg-white group-hover:text-black">
                  <Play
                    size={12}
                    fill="currentColor"
                  />
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* =====================================================
            MERCH + TOUR
        ===================================================== */}

        <section className="mt-14 grid gap-10 border-t border-zinc-800/80 pt-10 lg:grid-cols-[1fr_0.8fr]">
          {/* MERCH */}

          <div>
            <div className="flex items-end justify-between border-b border-zinc-800/80 pb-5">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-zinc-600">
                  Shop
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Merch
                </h2>
              </div>

              <button
                type="button"
                className="flex items-center gap-1 text-xs text-zinc-500 transition hover:text-white"
              >
                View all
                <ArrowUpRight size={13} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {merch.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className="group text-left"
                >
                  <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#090909]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-3">
                    <p className="truncate text-sm font-medium text-zinc-200">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      {item.price}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* TOUR */}

          <div>
            <div className="border-b border-zinc-800/80 pb-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-zinc-600">
                Live
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Tour Dates
              </h2>
            </div>

            <div className="mt-2">
              {upcomingShows.map((show) => (
                <button
                  key={`${show.city}-${show.date}`}
                  type="button"
                  className="flex w-full items-center justify-between border-b border-zinc-800/70 py-4 text-left transition hover:bg-zinc-900/40"
                >
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">
                      {show.city}
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      {show.venue}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-cyan-300">
                      {show.date}
                    </span>

                    <ArrowUpRight
                      size={13}
                      className="text-zinc-700"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            ABOUT + SOCIAL
        ===================================================== */}

        <section className="mt-14 grid gap-10 border-t border-zinc-800/80 pt-10 lg:grid-cols-[0.7fr_1.3fr]">
          {/* ABOUT */}

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-zinc-600">
              About
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {artist.name}
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-500">
              {artist.bio}
            </p>

            <p className="mt-4 text-xs text-zinc-700">
              {artist.handle}
            </p>
          </div>

          {/* SOCIAL */}

          <div>
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-zinc-600">
                  Social
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  {artist.handle}
                </h3>
              </div>

              <div className="flex items-center gap-4 text-zinc-600">
                <button
                  type="button"
                  aria-label="Instagram"
                  className="transition hover:text-white"
                >
                  <Instagram size={17} />
                </button>

                <button
                  type="button"
                  aria-label="Twitter"
                  className="transition hover:text-white"
                >
                  <Twitter size={17} />
                </button>

                <button
                  type="button"
                  aria-label="YouTube"
                  className="transition hover:text-white"
                >
                  <Youtube size={17} />
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {socialImages.map(
                (image, index) => (
                  <button
                    key={image}
                    type="button"
                    className="group overflow-hidden rounded-xl border border-zinc-800/80"
                    aria-label={`Open social post ${
                      index + 1
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${artist.name} social post ${
                        index + 1
                      }`}
                      className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            FOLLOW CTA
        ===================================================== */}

        <section className="mt-14 border-t border-zinc-800/80 py-12 text-center">
          <Music2
            size={20}
            className="mx-auto text-cyan-300"
          />

          <h2 className="mt-4 text-3xl font-black tracking-tight">
            Stay close to {artist.name}.
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
            Follow for new releases, visuals, merch drops, live dates,
            and everything coming next.
          </p>

          <button
            type="button"
            className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            Follow {artist.name}
          </button>
        </section>
      </div>
    </main>
  );
}
 
