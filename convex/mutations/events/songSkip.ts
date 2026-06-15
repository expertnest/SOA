import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export const songSkip = mutation({
  args: {
    userId: v.id("users"),
    songId: v.id("songs"),
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    // ======================
    // 1. EVENT
    // ======================
    await ctx.db.insert("events", {
      userId: args.userId,
      type: "song_skip",
      songId: args.songId,
      createdAt: now,
    });

    // ======================
    // 2. UPDATE SONG STATS
    // ======================
    const stat = await ctx.db
      .query("song_stats")
      .withIndex("by_songId", (q) => q.eq("songId", args.songId))
      .unique();

    if (!stat) return { success: true };

    const newSkips = stat.totalSkips + 1;

    await ctx.db.patch(stat._id, {
      totalSkips: newSkips,
      skipRate:
        stat.totalPlays > 0 ? newSkips / stat.totalPlays : 0,
      updatedAt: now,
    });

    return { success: true };
  },
});