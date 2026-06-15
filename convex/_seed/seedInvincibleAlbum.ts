import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createInvincibleAlbum = mutation({
  args: {
    artistId: v.id("artists"),
  },

  handler: async (ctx, args) => {
    // 1. Create project (album)
    const projectId = await ctx.db.insert("projects", {
      name: "Invincible",
      artistId: args.artistId,
      type: "album",
      description: "Invincible album upload test",
      coverImage: undefined,
      createdAt: Date.now(),
      totalPlays: 0,
    });

    // 2. Generate 10 songs + link them
    for (let i = 1; i <= 10; i++) {
      const songId = await ctx.db.insert("songs", {
        title: `Track ${i}`,
        artistId: args.artistId,

        // fake but realistic defaults
        duration: 180 + i * 5, // just to vary lengths

        genre: "hip-hop",

        totalPlays: 0,
        skipRate: 0,
        completionRate: 0,

        uniqueListeners: 0,
        replayRate: 0,
      });

      // 3. Link song → project with ordering
      await ctx.db.insert("projectSongs", {
        projectId,
        songId,
        trackNumber: i,
      });
    }

    return {
      success: true,
      projectId,
      message: "Invincible album created with 10 tracks",
    };
  },
});