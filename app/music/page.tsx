"use client";

import { useState } from "react";
import {
  Play,
  Shuffle,
  MoreHorizontal,
  Clock3,
  Heart,
  CheckCircle2,
  BarChart3,
  Headphones,
  Music2,
  Flame,
  Radio,
  Disc3,
  CalendarDays,
  Ticket,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export default function Music() {
  const [filter, setFilter] = useState("all");

  const tracks = [
    {
      name: "Midnight Echoes",
      album: "Afterglow",
      plays: "12.4M",
      duration: "3:12",
    },
    {
      name: "Neon Drift",
      album: "Neon Drift",
      plays: "9.1M",
      duration: "2:58",
    },
    {
      name: "Lost Signals",
      album: "Static Dreams",
      plays: "7.6M",
      duration: "3:44",
    },
    {
      name: "Cold Atmosphere",
      album: "Cold Atmosphere",
      plays: "6.2M",
      duration: "4:01",
    },
    {
      name: "Static Dreams",
      album: "Static Dreams",
      plays: "5.8M",
      duration: "3:27",
    },
  ];

  const albums = [
    {
      title: "Afterglow",
      year: 2024,
      image: "/album1.jpg",
    },
    {
      title: "Neon Drift",
      year: 2023,
      image: "/album2.jpg",
    },
    {
      title: "Static Dreams",
      year: 2022,
      image: "/album3.jpg",
    },
  ];

  const playlists = [
    { title: "Late Night Drive", tracks: 18 },
    { title: "Ambient Focus", tracks: 25 },
    { title: "Trap Waves", tracks: 14 },
  ];

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

  const stats = [
    {
      title: "Monthly Listeners",
      value: "18.4M",
      icon: Headphones,
    },
    {
      title: "Total Streams",
      value: "742M",
      icon: Music2,
    },
    {
      title: "Trending Rank",
      value: "#14",
      icon: Flame,
    },
    {
      title: "Radio Plays",
      value: "128K",
      icon: Radio,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[180px]" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-3 sm:p-6">

        {/* HERO */}
      {/* HERO (UNCHANGED) */}
      <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-4 sm:p-6">
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

            {/* LEFT */}
            <div className="flex flex-col md:flex-row gap-5">

              <div className="w-full md:w-[300px] shrink-0">
                <div className="relative overflow-hidden rounded-3xl border border-white/10">
                  <img
                    src="/headerLogo.png"
                    alt="Artist"
                    className="h-[220px] sm:h-[420px] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <button className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:scale-105">
                      <Play size={16} fill="black" />
                      Play Artist
                    </button>

                    <button className="rounded-full bg-black/50 p-3 backdrop-blur-md transition hover:bg-white/10">
                      <Heart size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h1 className="text-5xl sm:text-7xl font-black tracking-tight">
                    Nox
                  </h1>

                  <p className="mt-5 max-w-2xl text-sm text-zinc-300">
                    Nox creates immersive late-night soundscapes blending cinematic synths,
                    ambient textures, and futuristic trap energy.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 text-sm font-bold text-black">
                      Latest Release
                    </button>
                    <button className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm">
                      Join Fan Club
                    </button>
                  </div>
                </div>

                {/* STATS */}
                <div className="mt-8 grid grid-cols-2 gap-3">
  {stats.map((stat, i) => {
    const Icon = stat.icon;
    return (
      <div
        key={i}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
      >
        <div className="flex items-center justify-between">
          <div className="rounded-2xl bg-cyan-500/10 p-2 text-cyan-300">
            <Icon size={18} />
          </div>
          <ArrowUpRight size={14} className="text-zinc-600" />
        </div>

        <h3 className="mt-4 text-2xl font-black">{stat.value}</h3>
        <p className="mt-1 text-xs text-zinc-500">{stat.title}</p>
      </div>
    );
  })}
</div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col gap-5">

              {/* 🔥 REPLACED COMPONENT: LATEST RELEASE */}
              <div className="overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-zinc-900 to-black">

                <div className="border-b border-white/10 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                    Latest Release
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">
                    "Afterglow"
                  </h2>
                </div>

                <div className="p-5">
                  <div className="flex gap-4">
                    <img
                      src="/album1.jpg"
                      className="h-24 w-24 rounded-2xl object-cover"
                    />

                    <div className="flex flex-1 flex-col justify-center">
                      <p className="text-lg font-bold">Afterglow</p>
                      <p className="text-sm text-zinc-400">Released 2024</p>

                      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
                        <BarChart3 size={14} />
                        48.2M streams this month
                      </div>
                    </div>
                  </div>

                  {/* MINI STATS */}
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-white/5 p-3 text-center">
                      <p className="text-xs text-zinc-400">Streams</p>
                      <p className="text-sm font-bold">312M</p>
                    </div>

                    <div className="rounded-xl bg-white/5 p-3 text-center">
                      <p className="text-xs text-zinc-400">Chart</p>
                      <p className="text-sm font-bold">#14</p>
                    </div>

                    <div className="rounded-xl bg-white/5 p-3 text-center">
                      <p className="text-xs text-zinc-400">Growth</p>
                      <p className="text-sm font-bold text-cyan-300">+18%</p>
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="mt-5 flex items-center justify-center gap-3">
                    <button className="rounded-full bg-white p-4 text-black">
                      <Play size={20} fill="black" />
                    </button>

                    <button className="rounded-full border border-white/10 bg-white/5 p-3">
                      <Shuffle size={18} />
                    </button>

                    <button className="rounded-full border border-white/10 bg-white/5 p-3">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* TOUR (UNCHANGED) */}
              <div className="rounded-[30px] border border-white/10 bg-gradient-to-br from-zinc-950 to-black p-5">
                <h2 className="text-2xl font-bold mb-4">Tour Dates</h2>
                {upcomingShows.map((show, i) => (
                  <div key={i} className="flex justify-between p-3 border-b border-white/10">
                    <div>
                      <p>{show.city}</p>
                      <p className="text-xs text-zinc-500">{show.venue}</p>
                    </div>
                    <p className="text-cyan-300">{show.date}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>


        {/* TRACKLIST */}
        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-b from-zinc-950 to-black">

          {/* HEADER */}
          <div className="border-b border-white/10 p-4 sm:p-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  Library
                </p>

                <h2 className="mt-1 text-3xl font-black">
                  {filter === "albums"
                    ? "Albums"
                    : filter === "playlists"
                    ? "Playlists"
                    : "Popular Tracks"}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">

                <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-2 text-sm font-bold text-black transition hover:scale-105">
                  <Play size={16} fill="black" />
                  Play
                </button>

                <button className="rounded-full border border-white/10 bg-white/5 p-3 transition hover:bg-white/10">
                  <Shuffle size={16} />
                </button>

                <button className="rounded-full border border-white/10 bg-white/5 p-3 transition hover:bg-white/10">
                  <MoreHorizontal size={16} />
                </button>

              </div>
            </div>

            {/* FILTERS */}
            <div className="mt-5 flex flex-wrap gap-2">

              {["all", "albums", "playlists"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    filter === item
                      ? "bg-white text-black"
                      : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  {item === "all"
                    ? "Tracks"
                    : item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}

            </div>
          </div>

          {/* CONTENT */}
          <div className="p-3 sm:p-4">

            {filter === "albums" ? (

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

                {albums.map((a, i) => (
                  <div
                    key={i}
                    className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 transition hover:-translate-y-1 hover:border-cyan-500/40"
                  >

                    <div className="relative overflow-hidden">

                      <img
                        src={a.image}
                        className="h-44 w-full object-cover transition duration-500 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />

                      <button className="absolute bottom-4 right-4 rounded-full bg-white p-3 text-black opacity-0 shadow-xl transition group-hover:opacity-100">
                        <Play size={16} fill="black" />
                      </button>

                    </div>

                    <div className="p-4">
                      <p className="font-semibold">{a.title}</p>
                      <p className="mt-1 text-xs text-zinc-400">{a.year}</p>
                    </div>

                  </div>
                ))}

              </div>

            ) : filter === "playlists" ? (

              <div className="grid gap-3">

                {playlists.map((p, i) => (
                  <div
                    key={i}
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/60 p-4 transition hover:border-cyan-500/30 hover:bg-cyan-500/5"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 font-bold text-black">
                        {i + 1}
                      </div>

                      <div>
                        <p className="font-medium">{p.title}</p>
                        <p className="text-xs text-zinc-400">
                          {p.tracks} tracks
                        </p>
                      </div>

                    </div>

                    <button className="rounded-full bg-white/5 p-3 opacity-0 transition group-hover:opacity-100">
                      <Play size={16} />
                    </button>

                  </div>
                ))}

              </div>

            ) : (

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70">

                {/* HEADER */}
                <div className="grid grid-cols-12 border-b border-white/10 px-4 py-4 text-xs uppercase tracking-wider text-zinc-500 sm:px-5">

                  <div className="col-span-1">#</div>

                  <div className="col-span-7 sm:col-span-6">
                    Title
                  </div>

                  <div className="hidden sm:block sm:col-span-3">
                    Album
                  </div>

                  <div className="col-span-4 flex justify-end sm:col-span-2">
                    <Clock3 size={14} />
                  </div>

                </div>

                {/* TRACKS */}
                <div>

                  {tracks.map((track, i) => (
                    <div
                      key={i}
                      className="group grid grid-cols-12 items-center border-b border-white/5 px-4 py-4 transition hover:bg-white/[0.03] sm:px-5"
                    >

                      <div className="col-span-1 text-sm text-zinc-500 group-hover:text-cyan-300">
                        {i + 1}
                      </div>

                      <div className="col-span-7 sm:col-span-6 flex items-center gap-3 sm:gap-4">

                        <div className="relative h-11 w-11 overflow-hidden rounded-xl sm:h-12 sm:w-12">

                          <img
                            src={`/album${(i % 3) + 1}.jpg`}
                            className="h-full w-full object-cover"
                          />

                          <button className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100">
                            <Play size={16} fill="white" />
                          </button>

                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-medium transition group-hover:text-cyan-300 sm:text-base">
                            {track.name}
                          </p>

                          <p className="text-xs text-zinc-500">
                            {track.plays} streams
                          </p>

                        </div>

                      </div>

                      <div className="hidden text-sm text-zinc-400 sm:block sm:col-span-3">
                        {track.album}
                      </div>

                      <div className="col-span-4 flex items-center justify-end gap-2 sm:col-span-2 sm:gap-4">

                        <button className="hidden opacity-0 transition hover:scale-110 hover:text-cyan-300 group-hover:opacity-100 sm:block">
                          <Heart size={16} />
                        </button>

                        <span className="text-xs text-zinc-400 sm:text-sm">
                          {track.duration}
                        </span>

                      </div>

                    </div>
                  ))}

                </div>
              </div>
            )}

          </div>
        </div>

        {/* LOWER GRID */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.75fr]">

          {/* MERCH */}
          <div className="overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-zinc-950 to-black">

            <div className="flex items-center justify-between border-b border-white/10 p-5">

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  Store
                </p>

                <h2 className="mt-1 text-3xl font-black">
                  Merch
                </h2>
              </div>

              <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10">
                View All
              </button>

            </div>

            <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 sm:p-5">

              {merch.map((item, i) => (
                <div
                  key={i}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 transition hover:-translate-y-1 hover:border-cyan-500/40"
                >

                  <div className="relative overflow-hidden">

                    <img
                      src={item.image}
                      className="h-44 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />

                    <button className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black opacity-0 transition group-hover:opacity-100">
                      Buy
                    </button>

                  </div>

                  <div className="p-4">

                    <p className="font-medium">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-cyan-300">
                      {item.price}
                    </p>

                  </div>

                </div>
              ))}

            </div>
          </div>

          {/* SOCIAL FEED */}
          <div className="overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-zinc-950 to-black">

            <div className="border-b border-white/10 p-5">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                    Social Feed
                  </p>

                  <h2 className="mt-1 text-3xl font-black">
                    Instagram
                  </h2>
                </div>

                <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10">
                  @noxsounds
                </button>

              </div>
            </div>

            {/* POSTS */}
            <div className="overflow-x-auto">

              <div className="flex min-w-max gap-4 p-4 sm:p-5">

                {[
                  "/ig1.jpg",
                  "/ig2.jpg",
                  "/ig3.jpg",
                  "/ig4.jpg",
                ].map((img, i) => (
                  <div
                    key={i}
                    className="group w-[190px] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60"
                  >

                    <div className="relative">

                      <img
                        src={img}
                        className="h-[240px] w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />

                      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 backdrop-blur-md">

                        <img
                          src="/headerLogo.png"
                          className="h-5 w-5 rounded-full object-cover"
                        />

                        <p className="text-xs font-medium">
                          noxsounds
                        </p>

                      </div>

                    </div>

                    <div className="p-3">

                      <div className="flex items-center gap-3 text-sm">

                        <button className="transition hover:scale-110 hover:text-red-400">
                          ♥
                        </button>

                        <button className="transition hover:scale-110">
                          ⌾
                        </button>

                        <button className="transition hover:scale-110">
                          ↗
                        </button>

                      </div>

                      <p className="mt-3 text-xs text-zinc-400 line-clamp-2">
                        Late night studio sessions. New music loading...
                      </p>

                    </div>

                  </div>
                ))}

              </div>
            </div>

            {/* FAN MESSAGE */}
            <div className="border-t border-white/10 p-5">

              <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-5">

                <div className="flex items-center gap-2 text-cyan-300">
                  <Sparkles size={16} />
                  <p className="text-sm font-semibold">
                    Fan Community
                  </p>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  Exclusive demos, early merch drops, unreleased snippets,
                  behind-the-scenes content, and private livestreams every
                  month.
                </p>

                <button className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:scale-105">
                  Join Community
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}