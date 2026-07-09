import { query } from "./_generated/server";

export const getArtistAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const artists = await ctx.db.query("artists").collect();
    const results = [];

    const users = await ctx.db.query("users").collect();

    const projectSongs = await ctx.db.query("projectSongs").collect();

    // projectId → song count
    const projectSongMap = new Map<string, number>();
    for (const ps of projectSongs) {
      projectSongMap.set(
        ps.projectId,
        (projectSongMap.get(ps.projectId) || 0) + 1
      );
    }

    for (const artist of artists) {
      // =========================
      // 🎧 SONGS FOR ARTIST
      // =========================
      const songs = await ctx.db
        .query("songs")
        .withIndex("by_artistId", (q) =>
          q.eq("artistId", artist._id)
        )
        .collect();

      const songIds = songs.map((s) => s._id);

      // =========================
      // 📊 SONG STATS (NEW)
      // =========================
      const stats = await Promise.all(
        songIds.map((id) =>
          ctx.db
            .query("song_stats")
            .withIndex("by_songId", (q) =>
              q.eq("songId", id)
            )
            .unique()
        )
      );

      const validStats = stats.filter(Boolean);

      // =========================
      // 📊 CORE METRICS
      // =========================
      const totalStreams = validStats.reduce(
        (sum, s) => sum + s!.totalPlays,
        0
      );

      const totalSkips = validStats.reduce(
        (sum, s) => sum + s!.totalSkips,
        0
      );

      const totalReplays = validStats.reduce(
        (sum, s) => sum + (s!.replayRate ?? 0) * s!.totalPlays,
        0
      );

      const uniqueListeners = validStats.reduce(
        (sum, s) => sum + s!.uniqueListeners,
        0
      );

      const avgStreamsPerListener =
        uniqueListeners > 0
          ? totalStreams / uniqueListeners
          : 0;

      const skipRate =
        totalStreams > 0 ? (totalSkips / totalStreams) * 100 : 0;

      const replayRate =
        totalStreams > 0 ? (totalReplays / totalStreams) * 100 : 0;

      // =========================
      // 💎 SUPERFANS
      // =========================
      const superfanUsers = users.filter(
        (u) => u.superfanScore >= 300
      );

      const superfanDensity =
        uniqueListeners > 0
          ? (superfanUsers.length / uniqueListeners) * 100
          : 0;

      // =========================
      // 🚀 MOMENTUM (still needs events)
      // =========================
      const now = Date.now();
      const cutoff = now - 30 * 24 * 60 * 60 * 1000;

      const events = await ctx.db
        .query("events")
        .withIndex("by_artistId", (q) =>
          q.eq("artistId", artist._id)
        )
        .collect();

      const plays = events.filter((e) => e.type === "song_play");

      const recentPlays = plays.filter(
        (e) => e.createdAt > cutoff
      ).length;

      const oldPlays =
        plays.filter((e) => e.createdAt <= cutoff).length || 1;

      const momentumGrowth =
        ((recentPlays - oldPlays) / oldPlays) * 100;

      // =========================
      // 📚 PROJECTS
      // =========================
      const projects = await ctx.db
        .query("projects")
        .withIndex("by_artistId", (q) =>
          q.eq("artistId", artist._id)
        )
        .collect();

      const projectsWithSongs = projects.filter(
        (p) => (projectSongMap.get(p._id) || 0) > 0
      );

      const emptyProjects = projects.filter(
        (p) => (projectSongMap.get(p._id) || 0) === 0
      );

      const projectCount = projectsWithSongs.length;

      // =========================
      // 📊 CATALOG QUALITY
      // =========================
      const avgCompletion =
        songs.length > 0
          ? songs.reduce((sum, s) => sum + s.completionRate, 0) /
            songs.length
          : 0;

      const avgSkip =
        songs.length > 0
          ? songs.reduce((sum, s) => sum + s.skipRate, 0) /
            songs.length
          : 0;

      const catalogStrength = avgCompletion - avgSkip;

      // =========================
      // 📦 OUTPUT
      // =========================
      results.push({
        artistId: artist._id,
        name: artist.name,

        totalStreams,
        uniqueListeners,
        avgStreamsPerListener,
        totalSkips,
        totalReplays,

        skipRate,
        replayRate,

        fanConversionRate: 0, // can add later properly
        superfanDensity,

        momentumGrowth,

        songCount: songs.length,
        projectCount,
        emptyProjectCount: emptyProjects.length,
        catalogStrength,

        isRising: momentumGrowth > 10,
        isDeclining: momentumGrowth < -10,
        isConsistent: Math.abs(momentumGrowth) <= 10,
      });
    }

    return results;
  },
});