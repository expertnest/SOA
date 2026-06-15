"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ArtistComparisonPage() {
  const data = useQuery(api.artistComparison.getArtistComparison);

  // Convex loading state
  if (data === undefined) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold">Artist Comparison</h1>
        <p className="text-gray-400 text-sm mt-1">
          Side-by-side performance intelligence & ranking system.
        </p>
      </div>

      {/* LIST */}
      <div className="space-y-6">
        {data.map((artist, index) => (
          <div
            key={artist.artistId}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-semibold">
                  #{index + 1} {artist.name}
                </h2>
                <p className="text-xs text-gray-500">
                  Score: {artist.score.toFixed(0)}
                </p>
              </div>
            </div>

            {/* CORE METRICS */}
            <Grid>
              <Metric label="Streams" value={artist.totalStreams} />
              <Metric label="Listeners" value={artist.uniqueListeners} />
              <Metric label="Avg/Song" value={artist.avgPlaysPerSong} />

              <Metric
                label="Skip Rate"
                value={`${(artist.skipRate * 100).toFixed(2)}%`}
                negative
              />

              <Metric
                label="Replay Rate"
                value={`${(artist.replayRate * 100).toFixed(2)}%`}
                positive
              />
            </Grid>

            {/* ADVANCED */}
            <div className="mt-6">
              <Grid>
                <Metric
                  label="Fan Conversion"
                  value={`${artist.fanConversionRate.toFixed(2)}%`}
                />

                <Metric
                  label="Superfan Density"
                  value={`${artist.superfanDensity.toFixed(2)}%`}
                />

                <Metric
                  label="Momentum"
                  value={artist.momentumGrowth.toFixed(0)}
                  positive
                />

                <Metric
                  label="Consistency"
                  value={artist.consistencyScore.toFixed(1)}
                />
              </Grid>
            </div>
          </div>
        ))}
      </div>

      {/* 🧠 NUTRITION LABEL */}
  {/* 🧠 NUTRITION LABEL */}
<div className="border-t border-gray-800 pt-6 mt-10">
  <div className="text-sm text-gray-400 mb-3">
    📊 Comparison Breakdown (Nutrition Label)
  </div>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-gray-400">
    
    <div className="bg-black/40 border border-gray-800 p-3 rounded-lg">
      <p className="text-white font-semibold">Score</p>
      <p>Weighted performance across all metrics</p>
    </div>

    <div className="bg-black/40 border border-gray-800 p-3 rounded-lg">
      <p className="text-white font-semibold">Streams</p>
      <p>Total playback volume across catalog</p>
    </div>

    <div className="bg-black/40 border border-gray-800 p-3 rounded-lg">
      <p className="text-white font-semibold">Listeners</p>
      <p>Estimated unique audience size</p>
    </div>

    <div className="bg-black/40 border border-gray-800 p-3 rounded-lg">
      <p className="text-white font-semibold">Avg/Song</p>
      <p>Average plays per track in catalog</p>
    </div>

    <div className="bg-black/40 border border-gray-800 p-3 rounded-lg">
      <p className="text-white font-semibold">Skip Rate</p>
      <p>Percentage of early exits (lower = better)</p>
    </div>

    <div className="bg-black/40 border border-gray-800 p-3 rounded-lg">
      <p className="text-white font-semibold">Replay Rate</p>
      <p>Repeat engagement strength</p>
    </div>

    <div className="bg-black/40 border border-gray-800 p-3 rounded-lg">
      <p className="text-white font-semibold">Fan Conversion</p>
      <p>Listeners who become repeat engagers</p>
    </div>

    <div className="bg-black/40 border border-gray-800 p-3 rounded-lg">
      <p className="text-white font-semibold">Superfan Density</p>
      <p>Share of highly engaged listeners</p>
    </div>

    <div className="bg-black/40 border border-gray-800 p-3 rounded-lg">
      <p className="text-white font-semibold">Momentum</p>
      <p>Recent growth vs historical activity</p>
    </div>

    <div className="bg-black/40 border border-gray-800 p-3 rounded-lg">
      <p className="text-white font-semibold">Consistency</p>
      <p>How evenly engagement spreads across catalog</p>
    </div>

  </div>
</div>
    </main>
  );
}

/* ---------------- UI ---------------- */

function Grid({ children }: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {children}
    </div>
  );
}

function Metric({ label, value, positive, negative }: any) {
  let color = "text-white";

  if (positive) color = "text-green-400";
  if (negative) color = "text-red-400";

  return (
    <div className="bg-black/40 border border-gray-800 p-3 rounded-lg">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-lg font-semibold ${color}`}>{value}</div>
    </div>
  );
}