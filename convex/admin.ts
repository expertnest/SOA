import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getAdminStats = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const songs = await ctx.db.query("songs").collect();
    const events = await ctx.db.query("events").collect();

    // ======================
    // 🔢 GLOBAL STATS
    // ======================
    const totalUsers = users.length;
    const totalSongs = songs.length;
    const totalEvents = events.length;

    const totalPlays = events.filter(e => e.type === "song_play").length;
    const totalSkips = events.filter(e => e.type === "song_skip").length;
    const totalReplays = events.filter(e => e.type === "song_replay").length;

    // ======================
    // 🎧 TOP SONGS (TYPE SAFE)
    // ======================
    const songPlayMap: Record<string, number> = {};

    for (const e of events) {
      if (e.type === "song_play" && e.songId) {
        const key = e.songId as unknown as string;
        songPlayMap[key] = (songPlayMap[key] || 0) + 1;
      }
    }

    const topSongsRaw = Object.entries(songPlayMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topSongs = await Promise.all(
      topSongsRaw.map(async ([songId, plays]) => {
        const song = await ctx.db.get(songId as Id<"songs">);

        return {
          songId,
          title: song?.title ?? "Unknown",
          plays,
        };
      })
    );

    // ======================
    // 👤 TOP USERS
    // ======================
    const topUsers = users
      .sort((a, b) => b.superfanScore - a.superfanScore)
      .slice(0, 5);

    // ======================
    // ⚡ ENRICH EVENTS (TYPE SAFE)
    // ======================
    const enrichedEvents = await Promise.all(
      events
        .slice(-20)
        .reverse()
        .map(async (e) => {
          const user = await ctx.db.get(e.userId as Id<"users">);

          const song = e.songId
            ? await ctx.db.get(e.songId as Id<"songs">)
            : null;

          return {
            _id: e._id,
            type: e.type,
            username: user?.username ?? "Unknown",
            songTitle: song?.title ?? "Unknown",
            createdAt: e.createdAt,
          };
        })
    );

    return {
      totalUsers,
      totalSongs,
      totalEvents,
      totalPlays,
      totalSkips,
      totalReplays,
      users,
      songs,
      topSongs,
      topUsers,
      events: enrichedEvents,
    };
  },
});