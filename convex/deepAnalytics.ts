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
      .withIndex("by_songId", (q) => q.eq("songId", songId))
      .collect();

    const song = await ctx.db.get(songId);

    if (!song) throw new Error("Song not found");

    // ======================
    // CORE COUNTS (FIXED)
    // ======================

    const plays = events.filter(
      (e) =>
        e.type === "song_play" &&
        !e.source?.includes("retention")
    ).length;

    const skips = events.filter(
      (e) => e.type === "song_skip"
    ).length;

    const replays = events.filter(
      (e) => e.type === "song_replay"
    ).length;

    const ends = events.filter(
      (e) => e.type === "song_end"
    ).length;

    // ======================
    // UNIQUE LISTENERS
    // ======================

    const listeners = new Set(
      events
        .filter(
          (e) =>
            e.type === "song_play" &&
            !e.source?.includes("retention")
        )
        .map((e) => e.userId)
    );

    const uniqueListeners = listeners.size;

    // ======================
    // DURATIONS
    // ======================

    const durations = events
      .filter(
        (e) =>
          e.type === "song_play" &&
          !e.source?.includes("retention")
      )
      .map((e) => e.duration ?? 0);

    const avgDuration =
      durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) /
          durations.length
        : 0;

    // ======================
    // LISTENER QUALITY
    // ======================

    const fullPlays = durations.filter(
      (d) => d >= song.duration * 0.9
    ).length;

    const shortPlays = durations.filter(
      (d) => d < 5
    ).length;

    // ======================
    // RETENTION (REAL EVENTS)
    // ======================

    const retention = {
        start: plays,
      
        tenPercent:
          durations.filter(
            d => d >= song.duration * 0.10
          ).length,
      
        twentyFivePercent:
          durations.filter(
            d => d >= song.duration * 0.25
          ).length,
      
        fiftyPercent:
          durations.filter(
            d => d >= song.duration * 0.50
          ).length,
      
        seventyFivePercent:
          durations.filter(
            d => d >= song.duration * 0.75
          ).length,
      
        ninetyPercent:
          durations.filter(
            d => d >= song.duration * 0.90
          ).length,
      };

    // ======================
    // SESSION DEPTH (CLEAN)
    // ======================

    const sessions = new Map<string, number>();

    events.forEach((e) => {
      if (!e.sessionId) return;
      if (e.type !== "song_play") return;
      if (e.source?.includes("retention")) return;

      const key = e.sessionId;
      sessions.set(
        key,
        (sessions.get(key) ?? 0) + 1
      );
    });

    const avgSessionDepth =
      sessions.size > 0
        ? Array.from(sessions.values()).reduce(
            (a, b) => a + b,
            0
          ) / sessions.size
        : 0;

    // ======================
    // RATES
    // ======================

    const skipRate =
      plays > 0 ? skips / plays : 0;

    const replayRate =
      plays > 0 ? replays / plays : 0;

    const completionRate =
      plays > 0 ? ends / plays : 0;

    // ======================
    // ENGAGEMENT INTELLIGENCE
    // ======================

    const engagementScore =
      plays + replays * 2 - skips * 2;

    const retentionStrength =
      fullPlays - skips;

    const listenerQuality =
      plays > 0 ? fullPlays / plays : 0;

    // ======================
    // RETURN
    // ======================

    return {
      songId,

      // core
      plays,
      uniqueListeners,
      skips,
      replays,

      // rates
      skipRate,
      replayRate,
      completionRate,

      // deep metrics
      avgDuration,
      avgSessionDepth,

      fullPlays,
      shortPlays,
      listenerQuality,

      retention,

      // intelligence
      engagementScore,
      retentionStrength,

      // flags
      isDropOff: skipRate > 0.5,
      isSticky: replayRate > 0.3,
      isHit:
        completionRate > 0.6 &&
        replayRate > 0.2,
    };
  },
});