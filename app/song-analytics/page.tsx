"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useMemo, useState } from "react";

export default function AnalyticsPage() {
  const data = useQuery(api.songAnalytics.getSongAnalytics);

  const [view, setView] = useState<"all" | "artist">("all");
  const [selectedArtist, setSelectedArtist] = useState<string>("all");

  const safeData = data ?? [];

  // ======================
  // SORT BY PLAYS
  // ======================
  const sortedData = useMemo(() => {
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
  const filteredData = useMemo(() => {
    if (selectedArtist === "all") return sortedData;
    return sortedData.filter((s) => s.artistName === selectedArtist);
  }, [sortedData, selectedArtist]);

  // ======================
  // GROUP BY ARTIST
  // ======================
  const groupedByArtist = useMemo(() => {
    return filteredData.reduce((acc: any, song) => {
      const artist = song.artistName || "Unknown Artist";
      if (!acc[artist]) acc[artist] = [];
      acc[artist].push(song);
      return acc;
    }, {});
  }, [filteredData]);

  // ======================
  // KPIs (OG + FULL)
  // ======================
  const kpis = useMemo(() => {
    return {
      plays: filteredData.reduce((s, x) => s + x.plays, 0),
      listeners: filteredData.reduce((s, x) => s + x.uniqueListeners, 0),
      skips: filteredData.reduce((s, x) => s + x.skips, 0),
      replays: filteredData.reduce((s, x) => s + x.replays, 0),
      likes: filteredData.reduce((s, x) => s + x.likes, 0),
      engagement: filteredData.reduce((s, x) => s + x.engagementScore, 0),
      retention: filteredData.reduce((s, x) => s + x.retentionStrength, 0),
    };
  }, [filteredData]);

  if (!data) return <div className="text-white p-10">Loading...</div>;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 space-y-8">

      {/* ======================
          HEADER
      ====================== */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">Song Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">
            Real performance data based on listener behavior.
          </p>
        </div>

        <div className="flex gap-2">
          <Toggle
            active={view === "all"}
            onClick={() => setView("all")}
            label="All Songs"
          />
          <Toggle
            active={view === "artist"}
            onClick={() => setView("artist")}
            label="By Artist"
          />
        </div>
      </div>

      {/* ======================
          KPI STRIP
      ====================== */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        <KPI label="Plays" value={kpis.plays} />
        <KPI label="Listeners" value={kpis.listeners} />
        <KPI label="Skips" value={kpis.skips} danger />
        <KPI label="Replays" value={kpis.replays} highlight />
        <KPI label="Likes" value={kpis.likes} highlight />
        <KPI label="Engagement" value={kpis.engagement} highlight />
        <KPI label="Retention" value={kpis.retention} />
      </div>

      {/* ======================
          FILTER PILLS
      ====================== */}
      <div className="flex flex-wrap gap-2">
        <Chip
          active={selectedArtist === "all"}
          onClick={() => setSelectedArtist("all")}
          label="All Artists"
        />

        {artists.map((artist) => (
          <Chip
            key={artist}
            active={selectedArtist === artist}
            onClick={() => setSelectedArtist(artist)}
            label={artist}
          />
        ))}
      </div>

      {/* ======================
          ALL VIEW
      ====================== */}
      {view === "all" && (
        <div className="space-y-6">
          {filteredData.map((song) => (
            <SongCard key={song.songId} song={song} />
          ))}
        </div>
      )}

      {/* ======================
          BY ARTIST VIEW
      ====================== */}
      {view === "artist" && (
        <div className="space-y-10">
          {Object.entries(groupedByArtist)
            .sort((a: any, b: any) => {
              const aPlays = a[1].reduce((s: any, x: any) => s + x.plays, 0);
              const bPlays = b[1].reduce((s: any, x: any) => s + x.plays, 0);
              return bPlays - aPlays;
            })
            .map(([artist, songs]: any) => (
              <div key={artist}>
                <h2 className="text-2xl font-bold">{artist}</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Songs: {songs.length} • Plays:{" "}
                  {songs.reduce((s: any, x: any) => s + x.plays, 0)}
                </p>

                <div className="space-y-4">
                  {songs.map((song: any) => (
                    <SongCard key={song.songId} song={song} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ======================
          📊 ANALYTICS BREAKDOWN (RESTORED)
      ====================== */}
      <div className="border-t border-gray-800 pt-8 mt-10">
        <div className="text-sm text-gray-400 mb-4">
          📊 Analytics Breakdown (How this system works)
        </div>

        <div className="space-y-2 text-xs text-gray-500 leading-relaxed">
          <p><span className="text-white">Plays</span> = total number of times a song starts playing.</p>
          <p><span className="text-white">Listeners</span> = unique users who played a song at least once.</p>
          <p><span className="text-white">Skips</span> = times users left before finishing the song.</p>
          <p><span className="text-white">Replays</span> = times users replayed the same song after first listen.</p>
          <p><span className="text-white">Likes</span> = explicit engagement signals (likes/favorites).</p>
          <p><span className="text-white">Skip Rate</span> = (skips ÷ plays) × 100.</p>
          <p><span className="text-white">Replay Rate</span> = (replays ÷ plays) × 100.</p>
          <p><span className="text-white">Like Rate</span> = (likes ÷ plays) × 100.</p>
          <p><span className="text-white">Engagement Score</span> = weighted score combining plays, likes, replays, minus skips.</p>
          <p><span className="text-white">Retention Strength</span> = how consistently users complete vs abandon playback.</p>
        </div>
      </div>
    </main>
  );
}

/* =========================
   SONG CARD
========================= */

function SongCard({ song }: any) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-md">

      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-semibold">{song.title}</h2>
          <p className="text-sm text-gray-400">{song.artistName}</p>
        </div>

        <div className="flex gap-2 text-xs">
          {song.isSticky && <Tag label="🔥 Sticky" color="green" />}
          {song.isDropOff && <Tag label="⚠️ Drop-off" color="red" />}
          {song.isBreakout && <Tag label="🚀 Breakout" color="blue" />}
        </div>
      </div>

      <Section title="Core Metrics">
        <Grid>
          <Metric label="Plays" value={song.plays} />
          <Metric label="Listeners" value={song.uniqueListeners} />
          <Metric label="Skips" value={song.skips} negative />
          <Metric label="Replays" value={song.replays} positive />
          <Metric label="Likes" value={song.likes} positive />
        </Grid>
      </Section>

      <Section title="Engagement Rates">
        <Grid>
          <Metric label="Skip Rate" value={song.skipRate.toFixed(2)} negative />
          <Metric label="Replay Rate" value={song.replayRate.toFixed(2)} positive />
          <Metric label="Like Rate" value={song.likeRate.toFixed(2)} positive />
        </Grid>
      </Section>

      <Section title="Insights">
        <Grid>
          <Metric label="Engagement Score" value={song.engagementScore} highlight />
          <Metric label="Retention Strength" value={song.retentionStrength} highlight />
        </Grid>
      </Section>
    </div>
  );
}

/* =========================
   UI COMPONENTS
========================= */

function KPI({ label, value, danger, highlight }: any) {
  let color = "text-white";
  if (danger) color = "text-red-400";
  if (highlight) color = "text-blue-400";

  return (
    <div className="border border-gray-800 bg-black/40 p-4 rounded-xl">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
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

function Toggle({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm border transition ${
        active
          ? "bg-white text-black"
          : "border-gray-700 text-gray-300"
      }`}
    >
      {label}
    </button>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="mb-4">
      <div className="text-sm text-gray-400 mb-2">{title}</div>
      {children}
    </div>
  );
}

function Grid({ children }: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {children}
    </div>
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

function Tag({ label, color }: any) {
  const colors: any = {
    green: "bg-green-500/10 text-green-400",
    red: "bg-red-500/10 text-red-400",
    blue: "bg-blue-500/10 text-blue-400",
  };

  return (
    <span className={`px-2 py-1 rounded ${colors[color]}`}>
      {label}
    </span>
  );
}