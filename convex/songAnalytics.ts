import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getSongAnalytics = query({
  handler: async (ctx) => {
    const songs = await ctx.db.query("songs").collect();
    const artists = await ctx.db.query("artists").collect();
    const songStats = await ctx.db.query("song_stats").collect();

    const projects = await ctx.db.query("projects").collect();
    const projectSongs = await ctx.db.query("projectSongs").collect();

    const events = await ctx.db.query("events").collect();

    // ======================
    // MAPS
    // ======================

    const songMap = new Map(
      songs.map((song) => [song._id, song])
    );

    const artistMap = new Map(
      artists.map((artist) => [artist._id, artist])
    );

    const projectMap = new Map(
      projects.map((project) => [project._id, project])
    );

    const songToProjectMap = new Map(
      projectSongs.map((ps) => [
        ps.songId,
        ps.projectId,
      ])
    );

    // ======================
    // 🔥 UNIQUE LISTENERS
    // ======================

    const listenerMap = new Map<string, Set<string>>();

    // ======================
    // 🔥 DEEP ANALYTICS MAPS (NEW)
    // ======================

    const durationBuckets = new Map<string, number[]>();
    const sessionMap = new Map<string, Set<string>>();

    events.forEach((event) => {
      if (
        event.type === "song_play" &&
        event.songId &&
        event.userId
      ) {
        const key = event.songId;

        if (!listenerMap.has(key)) {
          listenerMap.set(key, new Set());
        }

        if ((event.duration ?? 0) < 5) return;

        listenerMap.get(key)!.add(event.userId);

        // 🔥 track durations
        if (!durationBuckets.has(key)) {
          durationBuckets.set(key, []);
        }

        durationBuckets.get(key)!.push(
          event.duration ?? 0
        );

        // 🔥 track sessions
        if (event.sessionId) {
          if (!sessionMap.has(key)) {
            sessionMap.set(key, new Set());
          }

          sessionMap
            .get(key)!
            .add(event.sessionId);
        }
      }
    });

    // ======================
    // BUILD ANALYTICS
    // ======================

    const analytics = songStats.map((stat) => {

      const song = songMap.get(stat.songId);

      const artist = song
        ? artistMap.get(song.artistId)
        : null;

      const projectId = songToProjectMap.get(
        stat.songId
      );

      const project = projectId
        ? projectMap.get(projectId)
        : null;

      const plays = stat.totalPlays;
      const skips = stat.totalSkips;

      const replays =
        Math.round((stat.replayRate ?? 0) * plays);

      const likes = 0;

      const skipRate =
        plays > 0 ? skips / plays : 0;

      const replayRate =
        stat.replayRate ?? 0;

      const likeRate =
        plays > 0 ? likes / plays : 0;

      const engagementScore =
        plays +
        replays * 2 -
        skips * 2;

      const retentionStrength =
        replays - skips;

      const uniqueListeners =
        listenerMap.get(stat.songId)?.size ?? 0;

      // ======================
      // 🔥 NEW: DEEP METRICS
      // ======================

      const durations =
        durationBuckets.get(stat.songId) ?? [];

      const avgDuration =
        durations.length > 0
          ? durations.reduce((a, b) => a + b, 0) /
            durations.length
          : 0;

      const shortPlays =
        durations.filter((d) => d < 5).length;

      const fullPlays =
        durations.filter(
          (d) =>
            song?.duration &&
            d >= song.duration * 0.9
        ).length;

      const completionRate =
        plays > 0
          ? fullPlays / plays
          : 0;

      const sessions =
        sessionMap.get(stat.songId)?.size ?? 0;

      // ======================
      // 🔥 RETENTION CURVE (SIMPLIFIED)
      // ======================

      const retentionCurve = [
        100,
        Math.max(100 - skipRate * 100 * 0.5, 0),
        Math.max(100 - skipRate * 100, 0),
        Math.max(100 - skipRate * 150, 0),
      ];

      return {
        songId: stat.songId,

        title:
          song?.title ?? "Unknown",

        artistId:
          song?.artistId,

        artistName:
          artist?.name ??
          "Unknown Artist",

        projectId:
          project?._id ?? null,

        projectName:
          project?.name ??
          "No Project",

        // ======================
        // CORE METRICS
        // ======================

        plays,
        uniqueListeners,
        skips,
        replays,
        likes,

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
        // 🔥 NEW DEEP METRICS
        // ======================

        avgDuration,
        shortPlays,
        fullPlays,
        completionRate,
        sessions,
        retentionCurve,

        // ======================
        // FLAGS
        // ======================

        isDropOff:
          skipRate > 0.5,

        isSticky:
          replayRate > 0.3,

        isBreakout:
          plays > 5 &&
          replayRate > 0.2,
      };
    });

    return analytics.sort(
      (a, b) =>
        b.engagementScore -
        a.engagementScore
    );
  },
});