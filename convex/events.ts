import { mutation } from "./_generated/server";
import { v } from "convex/values";

const PLAY_COOLDOWN = 30 * 1000;

export const trackEvent = mutation({
  args: {
    type: v.union(
      v.literal("song_play"),
      v.literal("song_skip"),
      v.literal("song_replay"),
      v.literal("song_like"),
      v.literal("song_end"),
      v.literal("project_view"),
      v.literal("artist_follow"),
      v.literal("playlist_create"),
      v.literal("purchase"),
      v.literal("post_view")
    ),

    songId: v.optional(v.id("songs")),
    projectId: v.optional(v.id("projects")),
    artistId: v.optional(v.id("artists")),
    sessionId: v.optional(v.id("sessions")),
    streamId: v.optional(v.id("streams")),

    source: v.optional(v.string()),
    duration: v.optional(v.number()),
    deviceType: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    // ======================
    // 🔥 0. AUTH
    // ======================
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    if (!user) throw new Error("User not found");

    const userId = user._id;

    // ======================
    // 1. VALIDATION
    // ======================
    const songEvents = new Set([
      "song_play",
      "song_skip",
      "song_replay",
      "song_like",
      "song_end",
    ]);

    if (songEvents.has(args.type) && !args.songId) {
      throw new Error(`${args.type} requires songId`);
    }

    if (args.type === "song_play" && args.duration === undefined) {
      throw new Error("song_play requires duration");
    }

    // ======================
    // 2. ANTI-SPAM
    // ======================
    let history = null;

    if (args.songId) {
      history = await ctx.db
        .query("listening_history")
        .withIndex("by_user_song", (q) =>
          q.eq("userId", userId).eq("songId", args.songId!)
        )
        .unique();

      if (history && now - history.lastPlayedAt < PLAY_COOLDOWN) {
        return { ignored: true };
      }
    }

    // ======================
    // 3. WRITE EVENT
    // ======================
    await ctx.db.insert("events", {
      ...args,
      userId,
      createdAt: now,
    });

    // ======================
    // 4. USER STATS
    // ======================
    const userUpdate: any = {
      lastActiveAt: now,
    };

    if (args.type === "song_play") {
      userUpdate.totalPlays = user.totalPlays + 1;
      userUpdate.totalListeningTime =
        user.totalListeningTime + (args.duration ?? 0);
    }

    if (args.type === "song_skip") {
      userUpdate.totalSkips = user.totalSkips + 1;
    }

    if (args.type === "song_replay") {
      userUpdate.totalReplays = user.totalReplays + 1;
    }

    await ctx.db.patch(userId, userUpdate);

    // ======================
    // 5. SONG STATS (FIXED CLEAN)
    // ======================
    if (args.songId) {
      const songId = args.songId; // ✅ FIX TYPE ONCE

      let stat = await ctx.db
        .query("song_stats")
        .withIndex("by_songId", (q) =>
          q.eq("songId", songId)
        )
        .unique();

      if (!stat) {
        const id = await ctx.db.insert("song_stats", {
          songId,
          totalPlays: 0,
          totalSkips: 0,
          uniqueListeners: 0,
          completionRate: 0,
          skipRate: 0,
          replayRate: 0,
          updatedAt: now,
        });

        stat = await ctx.db.get(id);
      }

      const isNewListener = !history;

      // 🔥 BASE COUNTERS
      let totalPlays = stat!.totalPlays;
      let totalSkips = stat!.totalSkips;

      if (args.type === "song_play") totalPlays += 1;
      if (args.type === "song_skip") totalSkips += 1;

      // 🔥 DERIVED METRICS
      const skipRate = totalPlays > 0 ? totalSkips / totalPlays : 0;

      // simple replay logic (can improve later)
      const replayRate =
        args.type === "song_replay"
          ? stat!.replayRate + 0.01
          : stat!.replayRate;

      const updates: any = {
        totalPlays,
        totalSkips,
        skipRate,
        replayRate,
        updatedAt: now,
      };

      if (args.type === "song_play") {
        updates.uniqueListeners =
          stat!.uniqueListeners + (isNewListener ? 1 : 0);
      }

      await ctx.db.patch(stat!._id, updates);

      // ======================
      // 6. LISTENING HISTORY
      // ======================
      if (history) {
        await ctx.db.patch(history._id, {
          playCount: history.playCount + 1,
          lastPlayedAt: now,
        });
      } else {
        await ctx.db.insert("listening_history", {
          userId,
          songId,
          playCount: 1,
          lastPlayedAt: now,
        });
      }
    }

    return { success: true };
  },
});