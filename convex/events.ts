import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

const PLAY_COOLDOWN = 30 * 1000;

export const trackEvent = mutation({
  args: {
    userId: v.union(v.id("users"), v.string()),
    isAnonymous: v.boolean(),

    type: v.union(
      v.literal("song_play"),
      v.literal("song_skip"),
      v.literal("song_replay"),
      v.literal("song_like"),
      v.literal("song_end"),
      v.literal("song_progress"),
      v.literal("project_view"),
      v.literal("artist_follow"),
      v.literal("playlist_create"),
      v.literal("purchase"),
      v.literal("post_view")
    ),

    /*
     * TRUE only when a song_play event is
     * being created because of a genuine replay.
     *
     * This allows legitimate replay plays to
     * bypass the normal 30-second duplicate
     * protection while keeping the protection
     * for ordinary accidental duplicate calls.
     */
    isReplay: v.optional(v.boolean()),

    songId: v.optional(v.id("songs")),
    projectId: v.optional(v.id("projects")),
    artistId: v.optional(v.id("artists")),
    sessionId: v.optional(v.id("sessions")),
    streamId: v.optional(v.id("streams")),

    source: v.optional(v.string()),

    duration: v.optional(v.number()),
    playedDuration: v.optional(v.number()),
    position: v.optional(v.number()),

    deviceType: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    // ======================
    // 0. USER RESOLUTION
    // ======================

    let realUserId: Id<"users"> | null = null;
    let eventUserId: Id<"users"> | string =
      args.userId;

    if (!args.isAnonymous) {
      const identity =
        await ctx.auth.getUserIdentity();

      if (!identity) {
        throw new Error(
          "Not authenticated"
        );
      }

      const user =
        await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) =>
            q.eq(
              "clerkId",
              identity.subject
            )
          )
          .unique();

      if (!user) {
        throw new Error(
          "User not found"
        );
      }

      realUserId = user._id;
      eventUserId = user._id;
    }

    // ======================
    // 1. VALIDATION
    // ======================

    const songEvents = new Set([
      "song_play",
      "song_skip",
      "song_replay",
      "song_like",
      "song_end",
      "song_progress",
    ]);

    if (
      songEvents.has(args.type) &&
      !args.songId
    ) {
      throw new Error(
        `${args.type} requires songId`
      );
    }

    if (
      args.type === "song_progress" &&
      args.position === undefined
    ) {
      throw new Error(
        "song_progress requires position"
      );
    }

    /*
     * Never allow invalid numeric analytics
     * values into the database.
     *
     * JavaScript can produce NaN or Infinity
     * from failed duration calculations.
     */
    if (
      args.duration !== undefined &&
      !Number.isFinite(
        args.duration
      )
    ) {
      throw new Error(
        "duration must be a finite number"
      );
    }

    if (
      args.playedDuration !== undefined &&
      !Number.isFinite(
        args.playedDuration
      )
    ) {
      throw new Error(
        "playedDuration must be a finite number"
      );
    }

    if (
      args.position !== undefined &&
      !Number.isFinite(
        args.position
      )
    ) {
      throw new Error(
        "position must be a finite number"
      );
    }

    // ======================
    // 2. UNIQUE LISTENER CHECK
    // ======================

    let alreadyListener = false;

    if (
      args.songId &&
      args.type === "song_play"
    ) {
      const previousPlay =
        await ctx.db
          .query("events")
          .withIndex(
            "by_user_song_type",
            (q) =>
              q
                .eq(
                  "userId",
                  eventUserId
                )
                .eq(
                  "songId",
                  args.songId!
                )
                .eq(
                  "type",
                  "song_play"
                )
          )
          .first();

      alreadyListener =
        !!previousPlay;
    }

    // ======================
    // 3. LISTENING HISTORY
    // ======================

    let history: any = null;
    let anonymousHistory: any =
      null;

    if (
      args.songId &&
      args.type === "song_play"
    ) {
      // ----------------------
      // AUTH USER HISTORY
      // ----------------------

      if (realUserId) {
        history =
          await ctx.db
            .query(
              "listening_history"
            )
            .withIndex(
              "by_user_song",
              (q) =>
                q
                  .eq(
                    "userId",
                    realUserId!
                  )
                  .eq(
                    "songId",
                    args.songId!
                  )
            )
            .first();

        /*
         * The normal cooldown protects
         * ordinary duplicate song_play calls.
         *
         * A genuine replay explicitly bypasses
         * this check.
         */
        if (
          history &&
          !args.isReplay &&
          now -
            history.lastPlayedAt <
            PLAY_COOLDOWN
        ) {
          return {
            ignored: true,
            reason:
              "play_cooldown",
          };
        }
      }

      // ----------------------
      // ANONYMOUS HISTORY
      // ----------------------

      if (
        args.isAnonymous &&
        typeof args.userId ===
          "string"
      ) {
        /*
         * IMPORTANT:
         *
         * Do NOT use .unique() here.
         *
         * Existing data already contains multiple
         * rows for the same anonId + songId.
         *
         * .unique() throws when that happens.
         *
         * .first() safely selects one existing row.
         */

        anonymousHistory =
          await ctx.db
            .query(
              "anonymous_listening_history"
            )
            .withIndex(
              "by_anon_song",
              (q) =>
                q
                  .eq(
                    "anonId",
                    args.userId as string
                  )
                  .eq(
                    "songId",
                    args.songId!
                  )
            )
            .first();

        if (
          anonymousHistory &&
          !args.isReplay &&
          now -
            anonymousHistory.lastPlayedAt <
            PLAY_COOLDOWN
        ) {
          return {
            ignored: true,
            reason:
              "play_cooldown",
          };
        }
      }
    }

    // ======================
    // 4. WRITE EVENT
    // ======================

    /*
     * isReplay is an internal control flag used
     * by this mutation to identify a legitimate
     * replay play. It is NOT stored in events.
     */
    const {
      isReplay: _isReplay,
      ...eventArgs
    } = args;

    await ctx.db.insert(
      "events",
      {
        ...eventArgs,

        userId:
          eventUserId,

        isAnonymous:
          args.isAnonymous,

        createdAt:
          now,
      }
    );

    // ======================
    // 5. USER STATS
    // ======================

    if (realUserId) {
      const user =
        await ctx.db.get(
          realUserId
        );

      if (user) {
        const userUpdate: any =
          {
            lastActiveAt:
              now,
          };

        if (
          args.type ===
          "song_play"
        ) {
          userUpdate.totalPlays =
            (user.totalPlays ??
              0) + 1;

          userUpdate.totalListeningTime =
            (user.totalListeningTime ??
              0) +
            (args.playedDuration ??
              0);
        }

        if (
          args.type ===
          "song_skip"
        ) {
          userUpdate.totalSkips =
            (user.totalSkips ??
              0) + 1;
        }

        if (
          args.type ===
          "song_replay"
        ) {
          userUpdate.totalReplays =
            (user.totalReplays ??
              0) + 1;
        }

        await ctx.db.patch(
          realUserId,
          userUpdate
        );
      }
    }

    // ======================
    // 6. SONG STATS
    // ======================

    if (args.songId) {
      const songId =
        args.songId;

      let stat =
        await ctx.db
          .query("song_stats")
          .withIndex(
            "by_songId",
            (q) =>
              q.eq(
                "songId",
                songId
              )
          )
          .first();

      if (!stat) {
        const id =
          await ctx.db.insert(
            "song_stats",
            {
              songId,

              totalPlays: 0,
              totalSkips: 0,
              totalReplays: 0,

              // NEW
              totalLikes: 0,

              uniqueListeners: 0,

              completionRate: 0,
              skipRate: 0,
              replayRate: 0,

              updatedAt:
                now,
            }
          );

        stat =
          await ctx.db.get(
            id
          );
      }

      if (!stat) {
        throw new Error(
          "Unable to create song stats"
        );
      }

      let totalPlays =
        stat.totalPlays;

      let totalSkips =
        stat.totalSkips;

      let totalReplays =
        stat.totalReplays;

      // NEW:
      // Existing song_stats documents may not
      // have totalLikes yet, so safely use 0.
      let totalLikes =
        stat.totalLikes ?? 0;

      if (
        args.type ===
        "song_play"
      ) {
        totalPlays++;
      }

      if (
        args.type ===
        "song_skip"
      ) {
        totalSkips++;
      }

      if (
        args.type ===
        "song_replay"
      ) {
        totalReplays++;
      }

      // ======================
      // LIKES
      // ======================

      if (
        args.type ===
        "song_like"
      ) {
        totalLikes++;
      }

      // ======================
      // RATES
      // ======================

      let completionRate =
        stat.completionRate;

      let replayRate =
        stat.replayRate;

      if (
        args.type ===
        "song_end"
      ) {
        completionRate =
          totalPlays > 0
            ? (
                stat.completionRate *
                  Math.max(
                    totalPlays - 1,
                    0
                  ) +
                1
              ) /
              totalPlays
            : 0;
      }

      if (
        args.type ===
        "song_replay"
      ) {
        replayRate =
          totalPlays > 0
            ? totalReplays /
              totalPlays
            : 0;
      }

      const updates: any =
        {
          totalPlays,
          totalSkips,
          totalReplays,

          // NEW
          totalLikes,

          skipRate:
            totalPlays > 0
              ? totalSkips /
                totalPlays
              : 0,

          replayRate,
          completionRate,

          updatedAt:
            now,
        };

      if (
        args.type ===
        "song_play"
      ) {
        updates.uniqueListeners =
          stat.uniqueListeners +
          (alreadyListener
            ? 0
            : 1);
      }

      await ctx.db.patch(
        stat._id,
        updates
      );

      // ======================
      // 7. AUTH LISTENING HISTORY
      // ======================

      if (realUserId) {
        if (history) {
          await ctx.db.patch(
            history._id,
            {
              playCount:
                history.playCount +
                1,

              lastPlayedAt:
                now,
            }
          );
        } else {
          await ctx.db.insert(
            "listening_history",
            {
              userId:
                realUserId,

              songId,

              playCount: 1,
              lastPlayedAt:
                now,
            }
          );
        }
      }

      // ======================
      // 8. ANONYMOUS HISTORY
      // ======================

      if (
        args.isAnonymous &&
        typeof args.userId ===
          "string"
      ) {
        if (
          anonymousHistory
        ) {
          await ctx.db.patch(
            anonymousHistory._id,
            {
              playCount:
                anonymousHistory.playCount +
                1,

              lastPlayedAt:
                now,
            }
          );
        } else {
          await ctx.db.insert(
            "anonymous_listening_history",
            {
              anonId:
                args.userId,

              songId,

              playCount: 1,
              lastPlayedAt:
                now,
            }
          );
        }
      }
    }

    return {
      success: true,
    };
  },
  
});