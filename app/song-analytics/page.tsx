"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useMemo, useState } from "react";

export default function AnalyticsPage() {
  const data = useQuery(api.songAnalytics.getSongAnalytics);

  const [selectedArtist, setSelectedArtist] = useState<string>("all");
  const [openSongId, setOpenSongId] = useState<string | null>(null);

  const safeData = data ?? [];

  // ======================
  // SORT
  // ======================
  const sorted = useMemo(() => {
    return [...safeData].sort((a, b) => b.plays - a.plays);
  }, [safeData]);

  // ======================
  // ARTISTS
  // ======================
  const artists = useMemo(() => {
    return Array.from(new Set(safeData.map((s) => s.artistName))).sort();
  }, [safeData]);

  // ======================
  // FILTER
  // ======================
  const filtered = useMemo(() => {
    if (selectedArtist === "all") return sorted;
    return sorted.filter((s) => s.artistName === selectedArtist);
  }, [sorted, selectedArtist]);

  // ======================
  // HERO STATS
  // ======================
  const stats = useMemo(() => {
    return {
      totalPlays: filtered.reduce((s, x) => s + x.plays, 0),
      totalSongs: filtered.length,
      topSong: filtered[0],
    };
  }, [filtered]);

  if (!data) return <div className="text-white p-10">Loading...</div>;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-5xl font-bold tracking-tight">SOA Charts</h1>
        <p className="text-gray-400 mt-2">
          Top songs ranked by real listener activity
        </p>
      </div>

      {/* HERO */}
      <div className="grid md:grid-cols-3 gap-6">
        <HeroCard label="Total Plays" value={stats.totalPlays} />
        <HeroCard label="Songs Ranked" value={stats.totalSongs} />
        <HeroCard
          label="#1 Song"
          value={stats.topSong?.title || "-"}
          sub={stats.topSong?.artistName}
        />
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap gap-2">
        <Chip
          label="All"
          active={selectedArtist === "all"}
          onClick={() => setSelectedArtist("all")}
        />

        {artists.map((artist) => (
          <Chip
            key={artist}
            label={artist}
            active={selectedArtist === artist}
            onClick={() => setSelectedArtist(artist)}
          />
        ))}
      </div>

      {/* CHART */}
      <div className="space-y-3">
        {filtered.map((song, i) => (
          <ChartItem
            key={song.songId}
            song={song}
            rank={i + 1}
            isOpen={openSongId === song.songId}
            onToggle={() =>
              setOpenSongId((prev) =>
                prev === song.songId ? null : song.songId
              )
            }
          />
        ))}
      </div>
    </main>
  );
}

/* =========================
   CHART ITEM (ROW + DROPDOWN)
========================= */

function ChartItem({ song, rank, isOpen, onToggle }: any) {
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">

      {/* ROW */}
      <div
        onClick={onToggle}
        className="flex items-center justify-between p-4 bg-gradient-to-r from-black to-gray-900 hover:border-gray-600 cursor-pointer transition"
      >
        <div className="flex items-center gap-4">

          {/* RANK */}
          <div className="text-3xl font-bold w-12 text-gray-500">
            {rank}
          </div>

          {/* INFO */}
          <div>
            <div className="text-lg font-semibold">{song.title}</div>
            <div className="text-sm text-gray-400">
              {song.artistName}
            </div>

            <div className="flex gap-2 mt-1 text-xs">
              {song.isBreakout && <Tag label="🚀 Breakout" />}
              {song.isSticky && <Tag label="🔥 Hot" />}
              {song.isDropOff && <Tag label="⚠️ Falling" />}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="text-right">
          <div className="text-xl font-bold">
            {song.plays.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">plays</div>
        </div>
      </div>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="bg-black/60 border-t border-gray-800 p-4 animate-fadeIn">

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

            <Metric label="Listeners" value={song.uniqueListeners} />
            <Metric label="Skips" value={song.skips} negative />
            <Metric label="Replays" value={song.replays} positive />
            <Metric label="Likes" value={song.likes} positive />
            <Metric label="Engagement" value={song.engagementScore} highlight />

            <Metric
              label="Skip Rate"
              value={song.skipRate.toFixed(2)}
              negative
            />
            <Metric
              label="Replay Rate"
              value={song.replayRate.toFixed(2)}
              positive
            />
            <Metric
              label="Like Rate"
              value={song.likeRate.toFixed(2)}
              positive
            />
            <Metric
              label="Retention"
              value={song.retentionStrength}
              highlight
            />

          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   UI
========================= */

function HeroCard({ label, value, sub }: any) {
  return (
    <div className="border border-gray-800 rounded-2xl p-6 bg-gradient-to-br from-gray-900 to-black">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

function Chip({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm border transition ${
        active
          ? "bg-white text-black"
          : "border-gray-700 text-gray-300 hover:border-gray-500"
      }`}
    >
      {label}
    </button>
  );
}

function Metric({ label, value, negative, positive, highlight }: any) {
  let color = "text-white";
  if (positive) color = "text-green-400";
  if (negative) color = "text-red-400";
  if (highlight) color = "text-blue-400";

  return (
    <div className="bg-black/40 border border-gray-800 p-3 rounded-lg">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-lg font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function Tag({ label }: any) {
  return (
    <span className="px-2 py-0.5 bg-white/10 text-white rounded">
      {label}
    </span>
  );
}