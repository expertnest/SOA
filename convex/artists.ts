import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ======================
// 🎤 GET ALL ACTIVE ARTISTS
// ======================

export const getArtists = query({
  args: {},

  handler: async (ctx) => {
    return await ctx.db
      .query("artists")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// ======================
// 🎤 GET SINGLE ARTIST
// ======================

export const getArtist = query({
  args: {
    id: v.id("artists"),
  },

  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// ======================
// 🎤 CREATE ARTIST
// ======================

export const createArtist = mutation({
  args: {
    name: v.string(),
    image: v.optional(v.string()),
    bio: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    // Prevent duplicate artist names
    const existing = await ctx.db
      .query("artists")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();

    if (existing) {
      throw new Error("An artist with this name already exists");
    }

    // Create artist
    const artistId = await ctx.db.insert("artists", {
      name: args.name,
      image: args.image,
      bio: args.bio,

      // Active by default
      isActive: true,

      // Initial analytics
      followerCount: 0,
      totalStreams: 0,
      superfanCount: 0,
      totalRevenue: 0,
      monthlyListeners: 0,
    });

    // Initialize artist stats
    await ctx.db.insert("artist_stats", {
      artistId,
      totalStreams: 0,
      totalRevenue: 0,
      superfanCount: 0,
      updatedAt: Date.now(),
    });

    return artistId;
  },
});

// ======================
// 🎤 ARCHIVE ARTIST
// ======================

export const archiveArtist = mutation({
  args: {
    id: v.id("artists"),
  },

  handler: async (ctx, args) => {
    const artist = await ctx.db.get(args.id);

    if (!artist) {
      throw new Error("Artist not found");
    }

    await ctx.db.patch(args.id, {
      isActive: false,
    });

    return {
      success: true,
    };
  },
});