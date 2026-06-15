import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createSingleSeed = mutation({
  args: {
    artistId: v.id("artists"),
    title: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const songTitle = args.title ?? "Test Single";

    // 1. Create project (single)
    const projectId = await ctx.db.insert("projects", {
      name: `${songTitle} (Single)`,
      artistId: args.artistId,
      type: "single",
      description: "Seed single upload",
      coverImage: undefined,
      createdAt: Date.now(),
      totalPlays: 0,
    });

    // 2. Create song
    const songId = await ctx.db.insert("songs", {
      title: songTitle,
      artistId: args.artistId,

      duration: 200,
      genre: "test",

      totalPlays: 0,
      skipRate: 0,
      completionRate: 0,

      uniqueListeners: 0,
      replayRate: 0,
    });

    // 3. Link to project
    await ctx.db.insert("projectSongs", {
      projectId,
      songId,
      trackNumber: 1,
    });

    return {
      success: true,
      projectId,
      songId,
    };
  },
});