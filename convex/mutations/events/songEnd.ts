import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export const songEnd = mutation({
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
      type: "song_end",
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

    // treat as full completion
    const totalPlays = stat.totalPlays;

    const newCompletionRate =
      totalPlays > 0
        ? (stat.completionRate * totalPlays + 1) / totalPlays
        : 0;

    await ctx.db.patch(stat._id, {
      completionRate: newCompletionRate,
      updatedAt: now,
    });

    return { success: true };
  },
});