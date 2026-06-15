"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ArtistAnalyticsPage() {
  const data = useQuery(api.artistAnalytics.getArtistAnalytics);

  if (!data) return <div className="text-white p-10">Loading...</div>;

  // =========================
  // GLOBAL COMPARISON (ranking system)
  // =========================
  const ranked = [...data].sort(
    (a, b) =>
      b.totalStreams +
      b.fanConversionRate +
      b.momentumGrowth -
      (a.totalStreams +
        a.fanConversionRate +
        a.momentumGrowth)
  );

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold">Artist Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">
          Full catalog performance + artist comparison engine
        </p>
      </div>

      {/* ========================= */}
      {/* 🏆 GLOBAL COMPARISON */}
      {/* ========================= */}
      <div>
        <div className="text-sm text-gray-400 mb-3">
          🏆 Artist Ranking (Overall Performance)
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {ranked.slice(0, 6).map((artist, i) => (
            <div
              key={artist.artistId}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4"
            >
              <div className="text-xs text-gray-500 mb-1">
                Rank #{i + 1}
              </div>

              <div className="text-lg font-semibold">
                {artist.name}
              </div>

              <div className="text-xs text-gray-400 mt-1">
                Streams: {artist.totalStreams}
              </div>

              <div className="text-xs text-gray-400">
                Momentum: {artist.momentumGrowth.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================= */}
      {/* ARTIST CARDS */}
      {/* ========================= */}
      <div className="space-y-8">
        {data.map((artist) => (
          <div
            key={artist.artistId}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 space-y-6"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold">
                  {artist.name}
                </h2>
                <p className="text-xs text-gray-500">
                  Full artist performance breakdown
                </p>
              </div>

              <div className="flex gap-2 text-xs">
                {artist.isRising && <Tag label="🚀 Rising" color="green" />}
                {artist.isDeclining && <Tag label="⚠️ Declining" color="red" />}
                {artist.isConsistent && <Tag label="📊 Stable" color="blue" />}
              </div>
            </div>

            {/* ========================= */}
            {/* 📊 CORE METRICS */}
            {/* ========================= */}
            <Section title="Core Metrics">
              <Grid>
                <Metric label="Total Streams" value={artist.totalStreams} />
                <Metric label="Unique Listeners" value={artist.uniqueListeners} />
                <Metric
                  label="Avg Plays / Song"
                  value={artist.avgStreamsPerListener.toFixed(2)}
                />
                <Metric label="Total Replays" value={artist.totalReplays} positive />
                <Metric label="Total Skips" value={artist.totalSkips} negative />
              </Grid>
            </Section>

            {/* ========================= */}
            {/* 🔥 ADVANCED INSIGHTS */}
            {/* ========================= */}
            <Section title="Advanced Insights">
              <Grid>
                <Metric
                  label="Fan Conversion"
                  value={`${artist.fanConversionRate.toFixed(1)}%`}
                  highlight
                />
                <Metric
                  label="Superfan Density"
                  value={`${artist.superfanDensity.toFixed(1)}%`}
                  highlight
                />
                <Metric
                  label="Momentum"
                  value={`${artist.momentumGrowth.toFixed(1)}%`}
                  positive
                />
                <Metric
                  label="Replay Rate"
                  value={`${artist.replayRate.toFixed(1)}%`}
                  positive
                />
                <Metric
                  label="Skip Rate"
                  value={`${artist.skipRate.toFixed(1)}%`}
                  negative
                />
              </Grid>
            </Section>

            {/* ========================= */}
            {/* 📚 CATALOG */}
            {/* ========================= */}
            <Section title="Catalog">
              <Grid>
                <Metric label="Projects" value={artist.projectCount ?? 0} />
                <Metric label="Library Size" value={artist.songCount ?? 0} />
                <Metric
                  label="Catalog Strength"
                  value={calculateCatalogStrength(artist)}
                  highlight
                />
              </Grid>
            </Section>
          </div>
        ))}
      </div>

      {/* ========================= */}
      {/* 📊 FORMULA BREAKDOWN */}
      {/* ========================= */}
      <div className="border-t border-gray-800 pt-6">
        <div className="text-sm text-gray-400 mb-3">
          📊 How Metrics Are Calculated
        </div>

        <div className="text-xs text-gray-500 space-y-2">
          <p><span className="text-white">Total Streams</span> = total play events per artist</p>
          <p><span className="text-white">Unique Listeners</span> = distinct userIds</p>
          <p><span className="text-white">Avg Plays / Song</span> = streams ÷ songs</p>
          <p><span className="text-white">Fan Conversion</span> = repeat listeners ÷ listeners × 100</p>
          <p><span className="text-white">Superfan Density</span> = superfans ÷ listeners × 100</p>
          <p><span className="text-white">Momentum</span> = (recent − old) ÷ old × 100</p>
          <p><span className="text-white">Catalog Strength</span> = replay rate − skip rate</p>
        </div>
      </div>
    </main>
  );
}

/* ---------------- HELPERS ---------------- */

function calculateCatalogStrength(artist: any) {
  const score = artist.replayRate - artist.skipRate;
  return score.toFixed(1);
}

/* ---------------- UI COMPONENTS ---------------- */

function Section({ title, children }: any) {
  return (
    <div>
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

function Metric({ label, value, positive, negative, highlight }: any) {
  let color = "text-white";
  if (positive) color = "text-green-400";
  if (negative) color = "text-red-400";
  if (highlight) color = "text-blue-400";

  return (
    <div className="bg-black/40 border border-gray-800 p-3 rounded-lg">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-lg font-semibold ${color}`}>
        {value}
      </div>
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