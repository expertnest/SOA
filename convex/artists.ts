import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ======================
// 🧹 CREATE ARTIST SLUG
// ======================

function createSlug(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug) {
    throw new Error("Artist name cannot generate a valid slug");
  }

  return slug;
}

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
// 🎤 GET ARTIST BY SLUG
// ======================

export const getArtistBySlug = query({
  args: {
    slug: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("artists")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
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
    const name = args.name.trim();

    if (!name) {
      throw new Error("Artist name is required");
    }

    const slug = createSlug(name);

    // Prevent duplicate artist names
    const existingName = await ctx.db
      .query("artists")
      .filter((q) => q.eq(q.field("name"), name))
      .first();

    if (existingName) {
      throw new Error("An artist with this name already exists");
    }

    // Slugs must remain globally unique
    const existingSlug = await ctx.db
      .query("artists")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (existingSlug) {
      throw new Error(
        `Artist slug "${slug}" is already in use`
      );
    }

    // Create canonical artist
    const artistId = await ctx.db.insert("artists", {
      name,
      slug,

      image: args.image,
      bio: args.bio,

      isActive: true,

      followerCount: 0,
      totalStreams: 0,
      superfanCount: 0,
      totalRevenue: 0,
      monthlyListeners: 0,
    });

    // Initialize artist analytics
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