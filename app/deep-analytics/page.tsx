 
"use client";

import { useMemo, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DeepAnalyticsPage() {
  const allSongs = useQuery(api.songAnalytics.getSongAnalytics);

  const safeSongs = allSongs ?? [];

  const [selectedArtist, setSelectedArtist] = useState("all");
  const [selectedSongId, setSelectedSongId] =
    useState<string | null>(null);

  const artists = useMemo(() => {
    return Array.from(
      new Set(safeSongs.map((s) => s.artistName))
    );
  }, [safeSongs]);

  const filteredSongs = useMemo(() => {
    if (selectedArtist === "all") return safeSongs;

    return safeSongs.filter(
      (s) => s.artistName === selectedArtist
    );
  }, [safeSongs, selectedArtist]);

  const selectedSong = useMemo(() => {
    return (
      filteredSongs.find(
        (s) => s.songId === selectedSongId
      ) ?? filteredSongs[0]
    );
  }, [filteredSongs, selectedSongId]);

  const deepData = useQuery(
    api.deepAnalytics.getDeepSongAnalytics,
    selectedSong
      ? {
          songId: selectedSong.songId,
        }
      : "skip"
  );

  if (!allSongs)
    return (
      <div className="p-10 text-white">Loading...</div>
    );

  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-10 space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-5xl font-bold tracking-tight">
          Deep Analytics
        </h1>
        <p className="text-gray-400 mt-2">
          Listener behavior intelligence
        </p>
      </div>

      {/* ARTIST FILTER */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">
          Artists
        </p>

        <div className="flex flex-wrap gap-3">
          <Chip
            label="All"
            active={selectedArtist === "all"}
            onClick={() => {
              setSelectedArtist("all");
              setSelectedSongId(null);
            }}
          />

          {artists.map((artist) => (
            <Chip
              key={artist}
              label={artist}
              active={selectedArtist === artist}
              onClick={() => {
                setSelectedArtist(artist);
                setSelectedSongId(null);
              }}
            />
          ))}
        </div>
      </div>

      {/* SONG SELECT */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">
          Songs
        </p>

        <div className="flex flex-wrap gap-3">
          {filteredSongs.map((song) => (
            <button
              key={song.songId}
              onClick={() =>
                setSelectedSongId(song.songId)
              }
              className={`px-5 py-2 rounded-xl border transition-all ${
                selectedSong?.songId === song.songId
                  ? "bg-white text-black"
                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
              }`}
            >
              {song.title}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN ANALYTICS */}
      {deepData && (
        <>
          {/* KPI */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <KPI
              label="Plays"
              value={deepData.plays}
            />
            <KPI
              label="Listeners"
              value={deepData.uniqueListeners}
            />
            <KPI
              label="Skips"
              value={deepData.skips}
              red
            />
            <KPI
              label="Replays"
              value={deepData.replays}
              green
            />
            <KPI
              label="Completion"
              value={`${(
                deepData.completionRate * 100
              ).toFixed(1)}%`}
            />
            <KPI
              label="Session Depth"
              value={deepData.avgSessionDepth.toFixed(1)}
            />
          </div>

          {/* MAIN */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-10">
            <div>
              <h2 className="text-3xl font-bold">
                {selectedSong?.title}
              </h2>
              <p className="text-gray-400">
                {selectedSong?.artistName}
              </p>
            </div>

            {/* RETENTION */}
            <section>
              <div className="flex flex-col gap-1 mb-4">
                <h3 className="text-gray-400">
                  Listener Retention
                </h3>
                <p className="text-xs text-gray-500">
                  Percentage of unique listeners who actually
                  listened through each point of the song.
                  Checkpoints are non-cumulative, so listeners
                  can skip ahead.
                </p>
              </div>

              <RetentionGraph
                data={deepData.retention}
              />
            </section>

            {/* RATES */}
            <section>
              <h3 className="text-gray-400 mb-4">
                Engagement
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                <Stat
                  label="Replay Rate"
                  value={`${(
                    deepData.replayRate * 100
                  ).toFixed(1)}%`}
                  green
                />
                <Stat
                  label="Skip Rate"
                  value={`${(
                    deepData.skipRate * 100
                  ).toFixed(1)}%`}
                  red
                />
                <Stat
                  label="Avg Listen"
                  value={`${Math.round(
                    deepData.avgDuration
                  )}s`}
                />
              </div>
            </section>

            {/* SPLIT */}
            <section>
              <h3 className="text-gray-400 mb-4">
                Listener Behavior
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Skip</span>
                  <span>
                    {(deepData.skipRate * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-orange-400"
                    style={{
                      width: `${deepData.skipRate * 100}%`,
                    }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span>Replay</span>
                  <span>
                    {(deepData.replayRate * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                    style={{
                      width: `${deepData.replayRate * 100}%`,
                    }}
                  />
                </div>
              </div>
            </section>
          </div>
        </>
      )}

      {/* ======================
          📊 DEEP ANALYTICS FORMULAS
      ====================== */}
      <div className="border-t border-gray-800 pt-8 mt-10">
        <div className="text-sm text-gray-400 mb-4">
          📊 Deep Analytics Breakdown (How this system calculates data)
        </div>

        <div className="space-y-2 text-xs text-gray-500 leading-relaxed">
          <p>
            <span className="text-white">Plays</span> = total number of times a listener starts playing the song.
          </p>
          <p>
            <span className="text-white">Listeners</span> = unique users who played the song at least once.
          </p>
          <p>
            <span className="text-white">Duration</span> = amount of time a listener spent listening before leaving or completing the song.
          </p>
          <p>
            <span className="text-white">Average Listen Duration</span> = total listening time ÷ total plays.
          </p>
          <p>
            <span className="text-white">Completion Rate</span> = plays reaching 90% of song duration ÷ total plays × 100.
          </p>
          <p>
            <span className="text-white">Skip Rate</span> = skips ÷ plays × 100.
          </p>
          <p>
            <span className="text-white">Replay Rate</span> = replays ÷ plays × 100.
          </p>
          <p>
            <span className="text-white">Session Depth</span> = total song plays inside sessions ÷ total listening sessions.
          </p>
          <p>
            <span className="text-white">10% Retention</span> = unique listeners who actually listened through the 10% point of the song.
          </p>
          <p>
            <span className="text-white">25% Retention</span> = unique listeners who actually listened through the 25% point of the song.
          </p>
          <p>
            <span className="text-white">50% Retention</span> = unique listeners who actually listened through the 50% point of the song.
          </p>
          <p>
            <span className="text-white">75% Retention</span> = unique listeners who actually listened through the 75% point of the song.
          </p>
          <p>
            <span className="text-white">90% Retention</span> = unique listeners who actually listened through the 90% point of the song.
          </p>
          <p>
            <span className="text-white">Retention Percentage</span> = listeners reaching a checkpoint ÷ total unique listeners × 100.
          </p>
          <p>
            <span className="text-white">Listener Quality</span> = listeners who reached the 90% point ÷ total listeners.
          </p>
          <p>
            <span className="text-white">Engagement Score</span> = plays + (replays × 2) - (skips × 2).
          </p>
          <p>
            <span className="text-white">Retention Strength</span> = completed listeners - skipped listeners.
          </p>
          <p>
            <span className="text-white">Sticky Song</span> = replay rate above 30%.
          </p>
          <p>
            <span className="text-white">Drop-Off Warning</span> = skip rate above 50%.
          </p>
          <p>
            <span className="text-white">Hit Indicator</span> = completion rate above 60% + replay rate above 20%.
          </p>
        </div>
      </div>
    </main>
  );
}

/* ======================
   RETENTION GRAPH
====================== */

function RetentionGraph({ data }: any) {
  const points = [
    { label: "Start", value: data.start },
    { label: "10% Checkpoint", value: data.tenPercent },
    {
      label: "25% Checkpoint",
      value: data.twentyFivePercent,
    },
    {
      label: "50% Checkpoint",
      value: data.fiftyPercent,
    },
    {
      label: "75% Checkpoint",
      value: data.seventyFivePercent,
    },
    {
      label: "90% Checkpoint",
      value: data.ninetyPercent,
    },
  ];

  const totalListeners = data.start || 0;

  return (
    <div className="space-y-5">
      {points.map((p) => {
        const percentage =
          totalListeners > 0
            ? (p.value / totalListeners) * 100
            : 0;

        return (
          <div key={p.label}>
            <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
              <span>{p.label}</span>

              <span>
                {p.value} / {totalListeners} listeners{" "}
                <span className="text-gray-500">
                  ({percentage.toFixed(1)}%)
                </span>
              </span>
            </div>

            <div className="h-4 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-700"
                style={{
                  width: `${Math.min(
                    percentage,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ======================
   KPI
====================== */

function KPI({ label, value, red, green }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`text-3xl font-bold ${
          red
            ? "text-red-400"
            : green
            ? "text-green-400"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ======================
   STAT
====================== */

function Stat({ label, value, green, red }: any) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-xl p-5">
      <p className="text-gray-500 text-xs">{label}</p>
      <p
        className={`text-2xl font-bold ${
          green
            ? "text-green-400"
            : red
            ? "text-red-400"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ======================
   CHIP
====================== */

function Chip({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full border transition ${
        active
          ? "bg-white text-black"
          : "bg-white/5 border-white/10 text-gray-300"
      }`}
    >
      {label}
    </button>
  );
}
 