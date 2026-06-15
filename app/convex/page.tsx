"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function AdminPage() {
  const data = useQuery(api.admin.getAdminStats);

  if (!data) return <div className="text-white p-10">Loading...</div>;

  return (
    <main className="min-h-screen bg-black text-white p-8 space-y-12">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>

      {/* ======================
          🔥 GLOBAL STATS
      ====================== */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Platform Overview</h2>
        <p className="text-gray-400 mb-6 text-sm">
          High-level snapshot of activity across your platform. Helps you
          understand overall growth and engagement.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Stat
            title="Users"
            value={data.totalUsers}
            desc="Total registered listeners on your platform."
          />
          <Stat
            title="Songs"
            value={data.totalSongs}
            desc="Total songs uploaded across all artists."
          />
          <Stat
            title="Events"
            value={data.totalEvents}
            desc="All tracked actions (plays, skips, likes, etc)."
          />
          <Stat
            title="Plays"
            value={data.totalPlays}
            desc="Total number of song plays."
          />
          <Stat
            title="Skips"
            value={data.totalSkips}
            desc="How often users skip songs (negative signal)."
          />
          <Stat
            title="Replays"
            value={data.totalReplays}
            desc="Strong signal — users liked the song enough to replay."
          />
        </div>
      </section>

      {/* ======================
          🎧 TOP SONGS
      ====================== */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Top Songs</h2>
        <p className="text-gray-400 mb-4 text-sm">
          Songs ranked by total plays. Helps you identify what’s working.
        </p>

        <div className="bg-gray-900 rounded-xl p-4 space-y-3">
          {data.topSongs.map((song, i) => (
            <div
              key={song.songId}
              className="flex justify-between items-center border-b border-gray-800 pb-2"
            >
              <div>
                <div className="font-medium">
                  #{i + 1} {song.title}
                </div>
                <div className="text-xs text-gray-400">
                  High play count = strong listener interest
                </div>
              </div>
              <div className="text-sm text-gray-300">
                {song.plays} plays
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================
          👤 TOP USERS
      ====================== */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Top Users</h2>
        <p className="text-gray-400 mb-4 text-sm">
          Your most engaged listeners ranked by superfan score.
        </p>

        <div className="bg-gray-900 rounded-xl p-4 space-y-3">
          {data.topUsers.map((user) => (
            <div
              key={user._id}
              className="border-b border-gray-800 pb-2"
            >
              <div className="font-medium">{user.username}</div>
              <div className="text-sm text-gray-400">
                Score: {user.superfanScore} • {user.engagementLevel}
              </div>
              <div className="text-xs text-gray-500">
                Higher score = more loyal + active listener
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================
          📊 USER BREAKDOWN
      ====================== */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">User Behavior</h2>
        <p className="text-gray-400 mb-4 text-sm">
          Breakdown of how each user interacts with your music.
        </p>

        <div className="bg-gray-900 rounded-xl p-4 space-y-3">
          {data.users.map((user) => (
            <div
              key={user._id}
              className="border-b border-gray-800 pb-2 text-sm"
            >
              <div className="font-medium">{user.username}</div>

              <div className="text-gray-400 text-xs mt-1">
                Plays: {user.totalPlays} • Skip Rate:{" "}
                {user.skipRate.toFixed(2)} • Replay Rate:{" "}
                {user.replayRate.toFixed(2)}
              </div>

              <div className="text-xs text-gray-500">
                Skip rate = dislike signal • Replay rate = strong interest
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================
          ⚡ RECENT EVENTS
      ====================== */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Recent Activity</h2>
        <p className="text-gray-400 mb-4 text-sm">
          Real-time actions happening on your platform. Useful for debugging and
          understanding user behavior.
        </p>

        <div className="bg-gray-900 rounded-xl p-4 space-y-2 text-sm">
          {data.events.map((e) => (
            <div
              key={e._id}
              className="border-b border-gray-800 pb-1 flex justify-between"
            >
              <span className="text-gray-300">
                {e.username} → {e.type}
              </span>
              <span className="text-gray-500">
                {e.songTitle}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({
  title,
  value,
  desc,
}: {
  title: string;
  value: number;
  desc: string;
}) {
  return (
    <div className="bg-gray-900 p-4 rounded-xl">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{desc}</div>
    </div>
  );
}