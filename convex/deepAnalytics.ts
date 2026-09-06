import { query } from "./_generated/server";
import { v } from "convex/values";

export const getDeepSongAnalytics = query({
  args: {
    songId: v.id("songs"),
  },

  handler: async (ctx, { songId }) => {
    // ======================
    // FETCH DATA
    // ======================

    const events = await ctx.db
      .query("events")
      .withIndex("by_songId", (q) =>
        q.eq("songId", songId)
      )
      .collect();

    const song = await ctx.db.get(songId);

    if (!song) {
      throw new Error("Song not found");
    }

    const songDuration =
      typeof song.duration === "number" && song.duration > 0
        ? song.duration
        : 100;

    // ======================
    // EMPTY GUARD
    // ======================

    if (!events || events.length === 0) {
      return {
        songId,
        plays: 0,
        uniqueListeners: 0,
        skips: 0,
        replays: 0,
        skipRate: 0,
        replayRate: 0,
        completionRate: 0,
        avgDuration: 0,
        avgSessionDepth: 0,
        fullPlays: 0,
        shortPlays: 0,
        listenerQuality: 0,
        retention: {
          start: 0,
          tenPercent: 0,
          twentyFivePercent: 0,
          fiftyPercent: 0,
          seventyFivePercent: 0,
          ninetyPercent: 0,
        },
        engagementScore: 0,
        retentionStrength: 0,
        isDropOff: false,
        isSticky: false,
        isHit: false,
      };
    }

    // ======================
    // EVENT GROUPS
    // ======================

    const playEvents = events.filter(e => e.type === "song_play");
    const skipEvents = events.filter(e => e.type === "song_skip");
    const replayEvents = events.filter(e => e.type === "song_replay");
    const progressEvents = events.filter(e => e.type === "song_progress");
    const endEvents = events.filter(e => e.type === "song_end");

    // ======================
    // CORE COUNTS
    // ======================

    const plays = playEvents.length;
    const skips = skipEvents.length;
    const replays = replayEvents.length;

    // ======================
    // UNIQUE LISTENERS
    // ======================

    const uniqueListeners = new Set(
      playEvents.map(e => e.userId).filter(Boolean)
    ).size;

    // ======================
    // FIXED DURATIONS (NO NaN EVER)
    // ======================

    const durations = playEvents
      .map(e => Number(e.duration))
      .filter(d => Number.isFinite(d) && d > 0);

    const avgDuration =
      durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : 0;

    // ======================
    // RETENTION (PROGRESS BASED)
    // ======================

    const getRetentionCount = (percent: number) => {
      return progressEvents.filter((e) => {
        const pos = e.position ?? 0;
        return pos >= percent;
      }).length;
    };

    const retention = {
      start: plays,
      tenPercent: getRetentionCount(10),
      twentyFivePercent: getRetentionCount(25),
      fiftyPercent: getRetentionCount(50),
      seventyFivePercent: getRetentionCount(75),
      ninetyPercent: getRetentionCount(90),
    };

    // ======================
    // LISTENER QUALITY
    // ======================

    const fullPlays = progressEvents.filter(
      e => (e.position ?? 0) >= 90
    ).length;

    const shortPlays = durations.filter(d => d < 5).length;

    // ======================
    // SESSION DEPTH
    // ======================

    const sessionCounts = new Map<string, number>();

    for (const e of playEvents) {
      if (!e.sessionId) continue;

      sessionCounts.set(
        e.sessionId,
        (sessionCounts.get(e.sessionId) ?? 0) + 1
      );
    }

    const avgSessionDepth =
      sessionCounts.size > 0
        ? Array.from(sessionCounts.values()).reduce(
            (a, b) => a + b,
            0
          ) / sessionCounts.size
        : 0;

    // ======================
    // RATES
    // ======================

    const skipRate = plays > 0 ? skips / plays : 0;
    const replayRate = plays > 0 ? replays / plays : 0;

    const completionRate =
      plays > 0 ? fullPlays / plays : 0;

    // ======================
    // INTELLIGENCE
    // ======================

    const engagementScore =
      plays + replays * 2 - skips * 2;

    const retentionStrength =
      fullPlays - skips;

    const listenerQuality =
      plays > 0 ? fullPlays / plays : 0;

    // ======================
    // FLAGS
    // ======================

    const isDropOff = skipRate > 0.5;
    const isSticky = replayRate > 0.3;
    const isHit =
      completionRate > 0.6 && replayRate > 0.2;

    // ======================
    // RETURN
    // ======================

    return {
      songId,

      plays,
      uniqueListeners,
      skips,
      replays,

      skipRate,
      replayRate,
      completionRate,

      avgDuration,
      avgSessionDepth,

      fullPlays,
      shortPlays,
      listenerQuality,

      retention,

      engagementScore,
      retentionStrength,

      isDropOff,
      isSticky,
      isHit,
    };
  },
});