import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export const songLike = mutation({
  args: {
    userId: v.id("users"),
    songId: v.id("songs"),
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    await ctx.db.insert("events", {
      userId: args.userId,
      type: "song_like",
      songId: args.songId,
      createdAt: now,
    });

    return { success: true };
  },
});