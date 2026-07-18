import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createProjectWithSongs = mutation({
  args: {
    project: v.object({
      name: v.string(),
      artistId: v.id("artists"),
      description: v.optional(v.string()),
      coverImage: v.optional(v.string()),
      releaseDate: v.optional(v.number()),

      // ✅ ADD THIS (required by your schema)
      type: v.union(
        v.literal("single"),
        v.literal("album"),
        v.literal("ep"),
        v.literal("draft")
      ),
    }),

    songs: v.array(
      v.object({
        title: v.string(),
        duration: v.number(),
        genre: v.optional(v.string()),
      })
    ),
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    // =========================
    // 📦 CREATE PROJECT
    // =========================
    const projectId = await ctx.db.insert("projects", {
      name: args.project.name,
      artistId: args.project.artistId,
      description: args.project.description,
      coverImage: args.project.coverImage,
      releaseDate: args.project.releaseDate,

      type: args.project.type,
      createdAt: now,
    });

    // =========================
    // 🎧 CREATE SONGS
    // =========================
    const songIds: any[] = [];

    for (const song of args.songs) {
      const songId = await ctx.db.insert("songs", {
        title: song.title,
        artistId: args.project.artistId,

        duration: song.duration,

        // ✅ REQUIRED BY SONG SCHEMA
        audioUrl:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",

        genre: song.genre ?? undefined,

        totalPlays: 0,
        skipRate: 0,
        completionRate: 0,

        replayRate: 0,
        uniqueListeners: 0,

        coverImage: args.project.coverImage,
      });

      songIds.push(songId);
    }

    return {
      projectId,
      songIds,
    };
  },
});