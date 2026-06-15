import { mutation } from "../../_generated/server";
import { v } from "convex/values";

const PLAY_COOLDOWN = 30 * 1000;

export const songPlay = mutation({
  args: {
    userId: v.id("users"),
    songId: v.id("songs"),
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    // ======================
    // 1. ANTI-SPAM (FAST PATH)
    // ======================
    const history = await ctx.db
      .query("listening_history")
      .withIndex("by_user_song", (q) =>
        q.eq("userId", args.userId).eq("songId", args.songId)
      )
      .unique();

    if (history && now - history.lastPlayedAt < PLAY_COOLDOWN) {
      return { ignored: true };
    }

    // ======================
    // 2. WRITE EVENT (TRUTH)
    // ======================
    await ctx.db.insert("events", {
      userId: args.userId,
      type: "song_play",
      songId: args.songId,
      createdAt: now,
    });

    // ======================
    // 3. SONG STATS (projection)
    // ======================
    let stat = await ctx.db
      .query("song_stats")
      .withIndex("by_songId", (q) => q.eq("songId", args.songId))
      .unique();

    if (!stat) {
      const id = await ctx.db.insert("song_stats", {
        songId: args.songId,
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

    // ======================
    // 4. LISTENING HISTORY
    // ======================
    let isNewListener = false;

    if (history) {
      await ctx.db.patch(history._id, {
        playCount: history.playCount + 1,
        lastPlayedAt: now,
      });
    } else {
      isNewListener = true;

      await ctx.db.insert("listening_history", {
        userId: args.userId,
        songId: args.songId,
        playCount: 1,
        lastPlayedAt: now,
      });
    }

    // ======================
    // 5. UPDATE STATS (SAFE)
    // ======================
    await ctx.db.patch(stat!._id, {
      totalPlays: stat!.totalPlays + 1,
      uniqueListeners:
        stat!.uniqueListeners + (isNewListener ? 1 : 0),
      updatedAt: now,
    });

    return { success: true };
  },
});