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

    const songDurationMs =
      songDuration * 1000;

    const completionThresholdMs =
      songDurationMs * 0.9;

    // ======================
    // EMPTY GUARD
    // ======================

    if (
      events.length === 0 &&
      listenSessions.length === 0
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
        (e) =>
          e.type === "song_play"
      );

    const skipEvents =
      events.filter(
        (e) =>
          e.type === "song_skip"
      );

    const replayEvents =
      events.filter(
        (e) =>
          e.type === "song_replay"
      );

    const progressEvents =
      events.filter(
        (e) =>
          e.type === "song_progress"
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

    const uniqueListenerIds =
      new Set(
        playEvents
          .map((e) => e.userId)
          .filter(Boolean)
          .map((id) =>
            String(id)
          )
      );

    const uniqueListeners =
      uniqueListenerIds.size;

    // ======================
    // UNIQUE SKIPPED LISTENERS
    // ======================

    const uniqueSkippedListeners =
      new Set(
        skipEvents
          .map((e) => e.userId)
          .filter(Boolean)
          .map((id) =>
            String(id)
          )
      );

    // ======================
    // TYPES
    // ======================

    type ListenRange = {
      startMs: number;
      endMs: number;
    };

    type ListenerSession = {
      userId: string;
      sessionKey: string;
      ranges: ListenRange[];
    };

    // ======================
    // MERGE SESSION RANGES
    // ======================

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

        if (
          sorted.length === 0
        ) {
          return [];
        }

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
    // PERSISTED LISTENING
    // ======================

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

      const merged =
        mergeRanges(
          session.mergedRanges
        );

      if (
        merged.length === 0
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

        ranges:
          merged,
      });
    }

    // ======================
    // ACTUAL LISTENED TIME
    // ======================

    /*
     * Add together the merged portions of
     * audio that were actually heard.
     *
     * Seeking across a section does NOT
     * count that skipped section.
     */

    const getSessionListenedMs =
      (
        ranges: ListenRange[]
      ) => {
        return ranges.reduce(
          (
            total,
            range
          ) =>
            total +
            (
              range.endMs -
              range.startMs
            ),
          0
        );
      };

    const sessionListenDurations =
      persistedSessions.map(
        (session) =>
          getSessionListenedMs(
            session.ranges
          ) / 1000
      );

    // ======================
    // LEGACY DURATIONS
    // ======================

    /*
     * Fallback for historical records created
     * before listen_sessions existed.
     */

    const legacyDurations =
      playEvents
        .map((event) =>
          Number(
            event.duration
          )
        )
        .filter(
          (duration) =>
            Number.isFinite(
              duration
            ) &&
            duration > 0
        );

    // ======================
    // AVERAGE LISTEN DURATION
    // ======================

    const durationsForAnalytics =
      sessionListenDurations.length >
      0
        ? sessionListenDurations
        : legacyDurations;

    const avgDuration =
      durationsForAnalytics.length >
      0
        ? durationsForAnalytics.reduce(
            (total, duration) =>
              total +
              duration,
            0
          ) /
          durationsForAnalytics.length
        : 0;

    // ======================
    // SESSION CHECKPOINT
    // ======================

    /*
     * Retention checkpoints are positional.
     *
     * A listener counts at 90% if they actually
     * heard audio crossing the 90% position.
     *
     * This is NOT the same as completion.
     */

    const getSessionReachedPoint =
      (
        ranges: ListenRange[],
        percent: number
      ) => {
        const targetMs =
          (
            percent /
            100
          ) *
          songDurationMs;

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

    const getLegacyMilestoneListeners =
      (
        percent: number
      ) => {
        const listeners =
          new Set<string>();

        for (
          const event of progressEvents
        ) {
          if (
            event.position !==
            percent
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
    // LISTENER RETENTION
    // ======================

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

    // ======================
    // TRUE COMPLETION
    // ======================

    /*
     * Completion is based on ACTUAL LISTENED
     * COVERAGE, not position.
     *
     * Example:
     *
     * 0–10% listened
     * seek to 90%
     * 90–95% listened
     *
     * 90% retention checkpoint = YES
     * completed play = NO
     *
     * because only ~15% of the song was
     * actually consumed.
     */

    let persistedCompletedPlays =
      0;

    const persistedCompletedListeners =
      new Set<string>();

    for (
      const session of persistedSessions
    ) {
      const ranges =
        session.ranges;

      // RETENTION CHECKPOINTS

      if (
        getSessionReachedPoint(
          ranges,
          10
        )
      ) {
        reached10.add(
          session.userId
        );
      }

      if (
        getSessionReachedPoint(
          ranges,
          25
        )
      ) {
        reached25.add(
          session.userId
        );
      }

      if (
        getSessionReachedPoint(
          ranges,
          50
        )
      ) {
        reached50.add(
          session.userId
        );
      }

      if (
        getSessionReachedPoint(
          ranges,
          75
        )
      ) {
        reached75.add(
          session.userId
        );
      }

      if (
        getSessionReachedPoint(
          ranges,
          90
        )
      ) {
        reached90.add(
          session.userId
        );
      }

      // TRUE COMPLETION

      const listenedMs =
        getSessionListenedMs(
          ranges
        );

      if (
        listenedMs >=
        completionThresholdMs
      ) {
        persistedCompletedPlays++;

        persistedCompletedListeners.add(
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
    // LEGACY COMPLETION
    // ======================

    /*
     * Older data cannot prove true listened
     * coverage because listen_sessions did
     * not exist yet.
     *
     * We preserve historical 90% milestones
     * as a legacy fallback.
     */

    let legacyCompletedPlays =
      0;

    const legacyCompletedListeners =
      new Set<string>();

    for (
      const userId of legacy90
    ) {
      if (
        !persistedCompletedListeners.has(
          userId
        )
      ) {
        legacyCompletedPlays++;

        legacyCompletedListeners.add(
          userId
        );
      }
    }

    // ======================
    // FULL PLAYS
    // ======================

    const fullPlays =
      Math.min(
        persistedCompletedPlays +
          legacyCompletedPlays,
        plays
      );

    // ======================
    // COMPLETED LISTENERS
    // ======================

    const completedListenerIds =
      new Set<string>([
        ...persistedCompletedListeners,
        ...legacyCompletedListeners,
      ]);

    const completedListeners =
      completedListenerIds.size;

    // ======================
    // SHORT PLAYS
    // ======================

    const shortPlays =
      durationsForAnalytics.filter(
        (duration) =>
          duration < 5
      ).length;

    // ======================
    // SESSION DEPTH
    // ======================

    const sessionCounts =
      new Map<
        string,
        number
      >();

    for (
      const event of playEvents
    ) {
      if (
        !event.sessionId
      ) {
        continue;
      }

      const key =
        String(
          event.sessionId
        );

      sessionCounts.set(
        key,
        (
          sessionCounts.get(
            key
          ) ?? 0
        ) + 1
      );
    }

    const avgSessionDepth =
      sessionCounts.size > 0
        ? Array.from(
            sessionCounts.values()
          ).reduce(
            (a, b) =>
              a + b,
            0
          ) /
          sessionCounts.size
        : 0;

    // ======================
    // RATES
    // ======================

    const skipRate =
      plays > 0
        ? skips /
          plays
        : 0;

    const replayRate =
      plays > 0
        ? replays /
          plays
        : 0;

    const completionRate =
      plays > 0
        ? fullPlays /
          plays
        : 0;

    // ======================
    // LISTENER QUALITY
    // ======================

    const listenerQuality =
      uniqueListeners > 0
        ? completedListeners /
          uniqueListeners
        : 0;

    // ======================
    // INTELLIGENCE
    // ======================

    const engagementScore =
      plays +
      replays * 2 -
      skips * 2;

    const retentionStrength =
      completedListeners -
      uniqueSkippedListeners.size;

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

      // CORE
      plays,
      uniqueListeners,
      skips,
      replays,

      // RATES
      skipRate,
      replayRate,
      completionRate,

      // LISTENING
      avgDuration,
      avgSessionDepth,

      // COMPLETION
      fullPlays,
      shortPlays,
      listenerQuality,

      // RETENTION
      retention,

      // INTELLIGENCE
      engagementScore,
      retentionStrength,

      // FLAGS
      isDropOff,
      isSticky,
      isHit,
    };
  },
});