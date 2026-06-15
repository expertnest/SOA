import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createSong = mutation({
  args: {
    title: v.string(),
    artistId: v.id("artists"),
   
    duration: v.number(),
    genre: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    const songId = await ctx.db.insert("songs", {
      title: args.title,
      artistId: args.artistId,
    

      duration: args.duration,
      genre: args.genre ?? undefined,

      totalPlays: 0,
      skipRate: 0,
      completionRate: 0,

      
    });

    return songId;
  },
});