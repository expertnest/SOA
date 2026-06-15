import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getSongAnalytics = query({
  handler: async (ctx) => {
    const songs = await ctx.db.query("songs").collect();
    const events = await ctx.db.query("events").collect();
    const artists = await ctx.db.query("artists").collect();

    // 🔥 NEW
    const projects = await ctx.db.query("projects").collect();
    const projectSongs = await ctx.db.query("projectSongs").collect();

    // ======================
    // MAPS (fast lookup)
    // ======================
    const songMap = new Map(songs.map((s) => [s._id, s]));
    const artistMap = new Map(artists.map((a) => [a._id, a]));

    // 🔥 NEW
    const projectMap = new Map(projects.map((p) => [p._id, p]));

    // 🔥 songId → projectId
    const songToProjectMap = new Map(
      projectSongs.map((ps) => [ps.songId, ps.projectId])
    );

    // ======================
    // STATS STORE
    // ======================
    const songStats = new Map<
      Id<"songs">,
      {
        songId: Id<"songs">;
        plays: number;
        skips: number;
        replays: number;
        likes: number;
        listeners: Set<string>;
      }
    >();

    // ======================
    // BUILD STATS FROM EVENTS
    // ======================
    for (const e of events) {
      if (!e.songId) continue;

      if (!songStats.has(e.songId)) {
        songStats.set(e.songId, {
          songId: e.songId,
          plays: 0,
          skips: 0,
          replays: 0,
          likes: 0,
          listeners: new Set(),
        });
      }

      const stat = songStats.get(e.songId)!;

      if (e.type === "song_play") stat.plays++;
      if (e.type === "song_skip") stat.skips++;
      if (e.type === "song_replay") stat.replays++;
      if (e.type === "song_like") stat.likes++;

      stat.listeners.add(e.userId as unknown as string);
    }

    // ======================
    // FINAL OUTPUT
    // ======================
    const analytics = Array.from(songStats.values()).map((s) => {
      const song = songMap.get(s.songId);

      // ======================
      // JOIN ARTIST
      // ======================
      const artist = song ? artistMap.get(song.artistId) : null;

      // 🔥 NEW: JOIN PROJECT
      const projectId = songToProjectMap.get(s.songId);
      const project = projectId ? projectMap.get(projectId) : null;

      const uniqueListeners = s.listeners.size;

      const skipRate = s.plays ? s.skips / s.plays : 0;
      const replayRate = s.plays ? s.replays / s.plays : 0;
      const likeRate = s.plays ? s.likes / s.plays : 0;

      const engagementScore =
        s.plays +
        s.replays * 2 +
        s.likes * 3 -
        s.skips * 2;

      const retentionStrength = s.replays - s.skips;

      return {
        songId: s.songId,

        // ======================
        // SONG INFO
        // ======================
        title: song?.title ?? "Unknown",

        // ======================
        // ARTIST INFO
        // ======================
        artistId: song?.artistId,
        artistName: artist?.name ?? "Unknown Artist",

        // 🔥 NEW PROJECT INFO
        projectId: project?._id ?? null,
        projectName: project?.name ?? "No Project",

        // ======================
        // RAW METRICS
        // ======================
        plays: s.plays,
        uniqueListeners,
        skips: s.skips,
        replays: s.replays,
        likes: s.likes,

        // ======================
        // RATES
        // ======================
        skipRate,
        replayRate,
        likeRate,

        // ======================
        // SCORES
        // ======================
        engagementScore,
        retentionStrength,

        // ======================
        // FLAGS
        // ======================
        isDropOff: skipRate > 0.5,
        isSticky: replayRate > 0.3,
        isBreakout: s.plays > 5 && replayRate > 0.2,
      };
    });

    return analytics.sort(
      (a, b) => b.engagementScore - a.engagementScore
    );
  },
});