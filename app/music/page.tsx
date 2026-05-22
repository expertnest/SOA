"use client";

import { useState } from "react";
import {
  Play,
  Shuffle,
  MoreHorizontal,
  Clock3,
  Heart,
  Headphones,
  Music2,
  Flame,
  Radio,
} from "lucide-react";

/* ================= TYPES ================= */

type Track = {
  name: string;
  album: string;
  plays: string;
  duration: string;
};

type Album = {
  title: string;
  year: number;
  image: string;
};

type Playlist = {
  title: string;
  tracks: number;
};

type FilterType = "all" | "albums" | "playlists";

/* ================= DATA ================= */

// 👇 EXPLICITLY TYPED (this prevents NEVER errors)
const FILTERS: readonly FilterType[] = ["all", "albums", "playlists"];

const TRACKS: readonly Track[] = [
  { name: "Midnight Echoes", album: "Afterglow", plays: "12.4M", duration: "3:12" },
  { name: "Neon Drift", album: "Neon Drift", plays: "9.1M", duration: "2:58" },
  { name: "Lost Signals", album: "Static Dreams", plays: "7.6M", duration: "3:44" },
  { name: "Cold Atmosphere", album: "Cold Atmosphere", plays: "6.2M", duration: "4:01" },
  { name: "Static Dreams", album: "Static Dreams", plays: "5.8M", duration: "3:27" },
];

const ALBUMS: readonly Album[] = [
  { title: "Afterglow", year: 2024, image: "/album1.jpg" },
  { title: "Neon Drift", year: 2023, image: "/album2.jpg" },
  { title: "Static Dreams", year: 2022, image: "/album3.jpg" },
];

const PLAYLISTS: readonly Playlist[] = [
  { title: "Late Night Drive", tracks: 18 },
  { title: "Ambient Focus", tracks: 25 },
  { title: "Trap Waves", tracks: 14 },
];

const STATS = [
  { title: "Monthly Listeners", value: "18.4M", icon: Headphones },
  { title: "Total Streams", value: "742M", icon: Music2 },
  { title: "Trending Rank", value: "#14", icon: Flame },
  { title: "Radio Plays", value: "128K", icon: Radio },
] as const;

/* ================= PAGE ================= */

export default function Music() {
  const [filter, setFilter] = useState<FilterType>("all");

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl p-4 space-y-6">

        {/* HERO */}
        <div className="rounded-3xl border border-white/10 p-6 bg-zinc-900">
          <h1 className="text-5xl font-black">Nox</h1>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="p-4 border border-white/10 rounded-2xl">
                  <Icon size={20} />
                  <h3 className="text-xl font-bold mt-2">{stat.value}</h3>
                  <p className="text-xs text-zinc-500">{stat.title}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* TRACKLIST */}
        <TracklistSection
          filter={filter}
          setFilter={setFilter}
        />
      </div>
    </div>
  );
}

/* ================= TRACKLIST ================= */

type TracklistProps = {
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
};

function TracklistSection({ filter, setFilter }: TracklistProps) {
  return (
    <div className="border border-white/10 rounded-3xl p-4 bg-zinc-900">

      {/* FILTERS */}
      <div className="flex gap-2 mb-4">
        {FILTERS.map((val) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-full text-sm ${
              filter === val ? "bg-white text-black" : "bg-white/5"
            }`}
          >
            {val}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {filter === "albums" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {ALBUMS.map((a, i) => (
            <div key={i}>
              <img src={a.image} className="rounded-xl" />
              <p>{a.title}</p>
              <p className="text-xs text-zinc-400">{a.year}</p>
            </div>
          ))}
        </div>
      ) : filter === "playlists" ? (
        <div>
          {PLAYLISTS.map((p, i) => (
            <div key={i} className="flex justify-between p-2">
              <p>{p.title}</p>
              <p className="text-zinc-400">{p.tracks} tracks</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {TRACKS.map((t, i) => (
            <div
              key={i}
              className="flex justify-between p-2 border-b border-white/10"
            >
              <p>{i + 1}. {t.name}</p>
              <p className="text-zinc-400">{t.duration}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}