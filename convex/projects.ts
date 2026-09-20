import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

type CatalogType = "single" | "album" | "ep" | "mixtape";

function getCatalogPrefix(type: CatalogType) {
  switch (type) {
    case "single":
      return "S";
    case "album":
      return "ALB";
    case "ep":
      return "EP";
    case "mixtape":
      return "MIX";
  }
}

async function getNextCatalogNumber(ctx: any, type: CatalogType) {
  const now = Date.now();

  const existingCounter = await ctx.db
    .query("catalogCounters")
    .withIndex("by_type", (q: any) => q.eq("type", type))
    .unique();

  let nextNumber = 1;

  if (existingCounter) {
    nextNumber = existingCounter.currentNumber + 1;

    await ctx.db.patch(existingCounter._id, {
      currentNumber: nextNumber,
      updatedAt: now,
    });
  } else {
    await ctx.db.insert("catalogCounters", {
      type,
      currentNumber: nextNumber,
      updatedAt: now,
    });
  }

  const prefix = getCatalogPrefix(type);
  const paddedNumber = String(nextNumber).padStart(3, "0");

  return `SOA-${prefix}-${paddedNumber}`;
}

// ==============================
// 🚀 CREATE PROJECT
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
    const projectType = args.type ?? "draft";

    let catalogNumber: string | undefined;

    if (projectType !== "draft") {
      catalogNumber = await getNextCatalogNumber(ctx, projectType);
    }

    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      artistId: args.artistId,
      description: args.description,
      coverImage: args.coverImage,
      catalogNumber,
      type: projectType,
      releaseDate: args.releaseDate,
      createdAt: now,
      totalPlays: 0,
    });

    return {
      projectId,
      catalogNumber: catalogNumber!,
    };
  },
});

// ==============================
// 📦 GET PROJECTS BY ARTIST
// ==============================
export const getProjectsByArtist = query({
  args: {
    artistId: v.id("artists"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_artistId", (q) => q.eq("artistId", args.artistId))
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

    const links = await ctx.db
      .query("projectSongs")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();

    const songs = await Promise.all(
      links.map((link) => ctx.db.get(link.songId))
    );

    return {
      ...project,
      tracks: songs.filter(Boolean).sort((a, b) => {
        const aTrack = links.find((link) => link.songId === a!._id);
        const bTrack = links.find((link) => link.songId === b!._id);

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
    catalogNumber: v.optional(v.string()),
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
    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new Error("Project not found.");
    }

    if (project.type === "draft") {
      throw new Error("Draft projects need a release type before publishing.");
    }

    await ctx.db.patch(args.projectId, {
      isActive: true,
    });

    return { success: true };
  },
});