 
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

    const listenSessions = await ctx.db
      .query("listen_sessions")
      .withIndex("by_songId", (q) =>
        q.eq("songId", songId)
      )
      .collect();

    const song = await ctx.db.get(songId);

    if (!song) {
      throw new Error("Song not found");
    }

    const songDuration =
      typeof song.duration === "number" &&
      song.duration > 0
        ? song.duration
        : 100;

    // ======================
    // EMPTY GUARD
    // ======================

    if (
      (!events || events.length === 0) &&
      (!listenSessions ||
        listenSessions.length === 0)
    ) {
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

    const playEvents =
      events.filter(
        (e) => e.type === "song_play"
      );

    const skipEvents =
      events.filter(
        (e) => e.type === "song_skip"
      );

    const replayEvents =
      events.filter(
        (e) => e.type === "song_replay"
      );

    const progressEvents =
      events.filter(
        (e) => e.type === "song_progress"
      );

    // ======================
    // CORE COUNTS
    // ======================

    const plays =
      playEvents.length;

    const skips =
      skipEvents.length;

    const replays =
      replayEvents.length;

    // ======================
    // UNIQUE LISTENERS
    // ======================

    const uniqueListeners =
      new Set(
        playEvents
          .map((e) => e.userId)
          .filter(Boolean)
          .map((id) => String(id))
      ).size;

    // ======================
    // FIXED DURATIONS
    // ======================

    const durations =
      playEvents
        .map((e) => Number(e.duration))
        .filter(
          (d) =>
            Number.isFinite(d) &&
            d > 0
        );

    const avgDuration =
      durations.length > 0
        ? durations.reduce(
            (a, b) => a + b,
            0
          ) / durations.length
        : 0;

    // ======================
    // PERSISTED LISTENING
    // ======================

    /*
     * listen_sessions contains the actual
     * portions of the song that were played.
     *
     * Each record represents one playback
     * lifecycle for one listener + song.
     *
     * mergedRanges is already merged by the
     * saveListenRanges mutation.
     */

    type ListenRange = {
      startMs: number;
      endMs: number;
    };

    type ListenerSession = {
      userId: string;
      sessionKey: string;
      ranges: ListenRange[];
    };

    const persistedSessions:
      ListenerSession[] = [];

    for (
      const session of listenSessions
    ) {
      if (
        !session.userId ||
        !session.sessionKey ||
        !session.mergedRanges
      ) {
        continue;
      }

      const ranges =
        session.mergedRanges.filter(
          (range) =>
            Number.isFinite(
              range.startMs
            ) &&
            Number.isFinite(
              range.endMs
            ) &&
            range.endMs >
              range.startMs
        );

      if (
        ranges.length === 0
      ) {
        continue;
      }

      persistedSessions.push({
        userId:
          String(
            session.userId
          ),

        sessionKey:
          session.sessionKey,

        ranges,
      });
    }

    // ======================
    // MERGE SESSION RANGES
    // ======================

    /*
     * Build a session-level range map.
     *
     * The mutation already merges ranges,
     * but doing this again here protects the
     * analytics query from malformed or
     * overlapping historical data.
     */

    const mergeRanges =
      (
        ranges: ListenRange[]
      ): ListenRange[] => {
        if (
          ranges.length === 0
        ) {
          return [];
        }

        const sorted =
          ranges
            .filter(
              (range) =>
                Number.isFinite(
                  range.startMs
                ) &&
                Number.isFinite(
                  range.endMs
                ) &&
                range.endMs >
                  range.startMs
            )
            .sort(
              (a, b) =>
                a.startMs -
                b.startMs
            );

        const merged:
          ListenRange[] = [];

        const MERGE_GAP_MS =
          500;

        for (
          const range of sorted
        ) {
          const last =
            merged[
              merged.length - 1
            ];

          if (!last) {
            merged.push({
              startMs:
                range.startMs,

              endMs:
                range.endMs,
            });

            continue;
          }

          if (
            range.startMs <=
            last.endMs +
              MERGE_GAP_MS
          ) {
            last.endMs =
              Math.max(
                last.endMs,
                range.endMs
              );

            continue;
          }

          merged.push({
            startMs:
              range.startMs,

            endMs:
              range.endMs,
          });
        }

        return merged;
      };

    // ======================
    // CHECK SESSION RETENTION
    // ======================

    /*
     * A checkpoint is counted when a listener
     * actually listened across that point.
     *
     * The listener does NOT have to listen
     * continuously from the beginning.
     *
     * Example:
     *
     * 0–25% listened
     * seek to 90%
     * 90–95% listened
     *
     * Results can therefore be:
     *
     * 25% = 1
     * 50% = 0
     * 75% = 0
     * 90% = 1
     */

    const getSessionReachedPoint =
      (
        ranges: ListenRange[],
        percent: number
      ) => {
        const targetMs =
          (
            percent / 100
          ) *
          songDuration *
          1000;

        return ranges.some(
          (range) =>
            range.startMs <=
              targetMs &&
            range.endMs >=
              targetMs
        );
      };

    // ======================
    // LEGACY RETENTION
    // ======================

    /*
     * Existing events may contain retention
     * data from before listen_sessions existed.
     *
     * Keep those listeners and combine them
     * with the new persisted listening data.
     *
     * Sets automatically deduplicate a listener
     * when they exist in both systems.
     */

    const getLegacyMilestoneListeners =
      (percent: number) => {
        const listeners =
          new Set<string>();

        for (
          const event of progressEvents
        ) {
          const position =
            event.position;

          if (
            position !== percent
          ) {
            continue;
          }

          if (
            !event.userId
          ) {
            continue;
          }

          listeners.add(
            String(
              event.userId
            )
          );
        }

        return listeners;
      };

    const legacy10 =
      getLegacyMilestoneListeners(
        10
      );

    const legacy25 =
      getLegacyMilestoneListeners(
        25
      );

    const legacy50 =
      getLegacyMilestoneListeners(
        50
      );

    const legacy75 =
      getLegacyMilestoneListeners(
        75
      );

    const legacy90 =
      getLegacyMilestoneListeners(
        90
      );

    // ======================
    // RETENTION
    // ======================

    /*
     * Start with historical event-based
     * listeners, then add listeners from
     * persisted actual-listening ranges.
     *
     * Because each checkpoint uses a Set,
     * the same listener is only counted once.
     */

    const reached10 =
      new Set<string>(
        legacy10
      );

    const reached25 =
      new Set<string>(
        legacy25
      );

    const reached50 =
      new Set<string>(
        legacy50
      );

    const reached75 =
      new Set<string>(
        legacy75
      );

    const reached90 =
      new Set<string>(
        legacy90
      );

    for (
      const session of persistedSessions
    ) {
      const merged =
        mergeRanges(
          session.ranges
        );

      if (
        getSessionReachedPoint(
          merged,
          10
        )
      ) {
        reached10.add(
          session.userId
        );
      }

      if (
        getSessionReachedPoint(
          merged,
          25
        )
      ) {
        reached25.add(
          session.userId
        );
      }

      if (
        getSessionReachedPoint(
          merged,
          50
        )
      ) {
        reached50.add(
          session.userId
        );
      }

      if (
        getSessionReachedPoint(
          merged,
          75
        )
      ) {
        reached75.add(
          session.userId
        );
      }

      if (
        getSessionReachedPoint(
          merged,
          90
        )
      ) {
        reached90.add(
          session.userId
        );
      }
    }

    // ======================
    // RETENTION RESULT
    // ======================

    const retention = {
      start:
        uniqueListeners,

      tenPercent:
        reached10.size,

      twentyFivePercent:
        reached25.size,

      fiftyPercent:
        reached50.size,

      seventyFivePercent:
        reached75.size,

      ninetyPercent:
        reached90.size,
    };

    // ======================
    // FULL PLAYS
    // ======================

    /*
     * A full play currently means a play
     * that reached the 90% checkpoint.
     *
     * Retention is listener-based while
     * completionRate is play-based, so the
     * result is capped at the total number
     * of plays.
     */

    const fullPlays =
      Math.min(
        reached90.size,
        plays
      );

    // ======================
    // SHORT PLAYS
    // ======================

    const shortPlays =
      durations.filter(
        (d) => d < 5
      ).length;

    // ======================
    // SESSION DEPTH
    // ======================

    const sessionCounts =
      new Map<string, number>();

    for (
      const event of playEvents
    ) {
      if (!event.sessionId) {
        continue;
      }

      sessionCounts.set(
        event.sessionId,
        (
          sessionCounts.get(
            event.sessionId
          ) ?? 0
        ) + 1
      );
    }

    const avgSessionDepth =
      sessionCounts.size > 0
        ? Array.from(
            sessionCounts.values()
          ).reduce(
            (a, b) => a + b,
            0
          ) /
          sessionCounts.size
        : 0;

    // ======================
    // RATES
    // ======================

    const skipRate =
      plays > 0
        ? skips / plays
        : 0;

    const replayRate =
      plays > 0
        ? replays / plays
        : 0;

    const completionRate =
      plays > 0
        ? fullPlays / plays
        : 0;

    // ======================
    // INTELLIGENCE
    // ======================

    const engagementScore =
      plays +
      replays * 2 -
      skips * 2;

    const retentionStrength =
      fullPlays - skips;

    const listenerQuality =
      plays > 0
        ? fullPlays / plays
        : 0;

    // ======================
    // FLAGS
    // ======================

    const isDropOff =
      skipRate > 0.5;

    const isSticky =
      replayRate > 0.3;

    const isHit =
      completionRate > 0.6 &&
      replayRate > 0.2;

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
 
