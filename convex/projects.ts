import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ==============================
// 🚀 CREATE PROJECT (Release)
// ==============================
export const createProject = mutation({
  args: {
    name: v.string(),
    artistId: v.id("artists"),

    description: v.optional(v.string()),
    coverImage: v.optional(v.string()),

    type: v.optional(
      v.union(
        v.literal("single"),
        v.literal("album"),
        v.literal("ep"),
        v.literal("mixtape"),
        v.literal("draft")
      )
    ),

    releaseDate: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      artistId: args.artistId,

      description: args.description,
      coverImage: args.coverImage,

      type: args.type ?? "draft",
      releaseDate: args.releaseDate,

      createdAt: now,
      totalPlays: 0,
    });

    return projectId;
  },
});

// ==============================
// 📦 GET PROJECTS (by artist)
// ==============================
export const getProjectsByArtist = query({
  args: {
    artistId: v.id("artists"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_artistId", (q) =>
        q.eq("artistId", args.artistId)
      )
      .collect();
  },
});

// ==============================
// 📦 GET SINGLE PROJECT
// ==============================
export const getProject = query({
  args: {
    projectId: v.id("projects"),
  },

  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);

    if (!project) return null;

    // 🔥 Get songs in this project
    const links = await ctx.db
      .query("projectSongs")
      .withIndex("by_projectId", (q) =>
        q.eq("projectId", args.projectId)
      )
      .collect();

    const songs = await Promise.all(
      links.map((link) =>
        ctx.db.get(link.songId)
      )
    );

    return {
      ...project,
      tracks: songs
        .filter(Boolean)
        .sort((a, b) => {
          const aTrack = links.find(l => l.songId === a!._id);
          const bTrack = links.find(l => l.songId === b!._id);
          return (aTrack?.trackNumber ?? 0) - (bTrack?.trackNumber ?? 0);
        }),
    };
  },
});

// ==============================
// ✏️ UPDATE PROJECT
// ==============================
export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),

    name: v.optional(v.string()),
    description: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    releaseDate: v.optional(v.number()),
    type: v.optional(
      v.union(
        v.literal("single"),
        v.literal("album"),
        v.literal("ep"),
        v.literal("mixtape"),
        v.literal("draft")
      )
    ),
  },

  handler: async (ctx, args) => {
    const { projectId, ...updates } = args;

    await ctx.db.patch(projectId, updates);

    return projectId;
  },
});

// ==============================
// 🚀 PUBLISH PROJECT
// ==============================
export const publishProject = mutation({
  args: {
    projectId: v.id("projects"),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, {
      type: "album", // or keep original type logic
    });

    return { success: true };
  },
});