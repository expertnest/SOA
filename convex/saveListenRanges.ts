 
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveListenRanges = mutation({
  args: {
    userId: v.union(
      v.id("users"),
      v.string()
    ),

    isAnonymous: v.boolean(),

    songId: v.id("songs"),

    sessionKey: v.string(),

    ranges: v.array(
      v.object({
        startMs: v.number(),
        endMs: v.number(),
      })
    ),

    lastPosition: v.optional(
      v.number()
    ),
  },

  handler: async (
    ctx,
    {
      userId,
      isAnonymous,
      songId,
      sessionKey,
      ranges,
      lastPosition,
    }
  ) => {
    // ======================
    // VALIDATE RANGES
    // ======================

    const validRanges = ranges
      .filter(
        (range) =>
          Number.isFinite(
            range.startMs
          ) &&
          Number.isFinite(
            range.endMs
          ) &&
          range.startMs >= 0 &&
          range.endMs > range.startMs
      )
      .map((range) => ({
        startMs:
          Math.max(
            0,
            range.startMs
          ),

        endMs:
          Math.max(
            0,
            range.endMs
          ),
      }));

    if (
      validRanges.length === 0
    ) {
      return {
        addedMs: 0,
        totalListenedMs: 0,
        uniqueListenedMs: 0,
      };
    }

    // ======================
    // FIND EXISTING RECORD
    // ======================

    const existing =
      await ctx.db
        .query("listen_sessions")
        .withIndex(
          "by_user_song_session",
          (q) =>
            q
              .eq(
                "userId",
                userId
              )
              .eq(
                "songId",
                songId
              )
              .eq(
                "sessionKey",
                sessionKey
              )
        )
        .first();

    // ======================
    // EXISTING RANGES
    // ======================

    const existingRanges =
      existing?.mergedRanges ??
      [];

    const previousUniqueMs =
      existing?.uniqueListenedMs ??
      0;

    const previousTotalMs =
      existing?.totalListenedMs ??
      0;

    // ======================
    // COMBINE RANGES
    // ======================

    const allRanges = [
      ...existingRanges,
      ...validRanges,
    ].sort(
      (a, b) =>
        a.startMs -
        b.startMs
    );

    // ======================
    // MERGE OVERLAPS
    // ======================

    const MERGE_GAP_MS =
      500;

    const mergedRanges: Array<{
      startMs: number;
      endMs: number;
    }> = [];

    for (
      const range of allRanges
    ) {
      const last =
        mergedRanges[
          mergedRanges.length - 1
        ];

      if (!last) {
        mergedRanges.push({
          startMs:
            range.startMs,

          endMs:
            range.endMs,
        });

        continue;
      }

      /*
       * Merge overlapping ranges
       * and tiny gaps caused by
       * browser timing differences.
       */
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

      mergedRanges.push({
        startMs:
          range.startMs,

        endMs:
          range.endMs,
      });
    }

    // ======================
    // UNIQUE LISTENED TIME
    // ======================

    const uniqueListenedMs =
      mergedRanges.reduce(
        (total, range) =>
          total +
          Math.max(
            0,
            range.endMs -
              range.startMs
          ),
        0
      );

    // ======================
    // TOTAL LISTENED TIME
    // ======================

    /*
     * This represents the raw playback
     * time represented by the incoming
     * ranges, including repeated listening.
     *
     * For now we add incoming range
     * lengths to the previous total.
     *
     * The client is responsible for only
     * sending newly observed playback
     * ranges.
     */
    const incomingTotalMs =
      validRanges.reduce(
        (total, range) =>
          total +
          Math.max(
            0,
            range.endMs -
              range.startMs
          ),
        0
      );

    const totalListenedMs =
      previousTotalMs +
      incomingTotalMs;

    // ======================
    // NEW UNIQUE LISTENED
    // ======================

    const addedMs =
      Math.max(
        0,
        uniqueListenedMs -
          previousUniqueMs
      );

    const now =
      Date.now();

    // ======================
    // SAVE
    // ======================

    if (existing) {
      await ctx.db.patch(
        existing._id,
        {
          isAnonymous,

          mergedRanges,

          totalListenedMs,

          uniqueListenedMs,

          ...(lastPosition !==
          undefined
            ? {
                lastPosition,
              }
            : {}),

          updatedAt:
            now,
        }
      );
    } else {
      await ctx.db.insert(
        "listen_sessions",
        {
          userId,

          isAnonymous,

          songId,

          sessionKey,

          mergedRanges,

          totalListenedMs,

          uniqueListenedMs,

          ...(lastPosition !==
          undefined
            ? {
                lastPosition,
              }
            : {}),

          createdAt:
            now,

          updatedAt:
            now,
        }
      );
    }

    // ======================
    // RETURN
    // ======================

    return {
      addedMs,

      totalListenedMs,

      uniqueListenedMs,
    };
  },
});
 
