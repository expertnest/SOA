import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const trackEvent = mutation({
  args: {
    userId: v.id("users"),

    type: v.union(
      v.literal("song_play"),
      v.literal("song_skip"),
      v.literal("song_replay"),
      v.literal("song_like"),
      v.literal("project_view"),
      v.literal("artist_follow"),
      v.literal("playlist_create"),
      v.literal("purchase"),
      v.literal("post_view")
    ),

    songId: v.optional(v.id("songs")),
    projectId: v.optional(v.id("projects")),
    artistId: v.optional(v.id("artists")),
    playlistId: v.optional(v.id("playlists")),
    sessionId: v.optional(v.id("sessions")),
    streamId: v.optional(v.id("streams")),

    source: v.optional(v.string()),
    duration: v.optional(v.number()),
    deviceType: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    // ======================
    // 🧠 VALIDATION RULES (IMPORTANT FIX)
    // ======================

    const songEvents = new Set([
      "song_play",
      "song_skip",
      "song_replay",
      "song_like",
    ]);

    const projectEvents = new Set([
      "project_view",
    ]);

    const artistEvents = new Set([
      "artist_follow",
    ]);

    // 🚨 SONG EVENTS REQUIRE songId
    if (songEvents.has(args.type) && !args.songId) {
      throw new Error(`songId is required for event type: ${args.type}`);
    }

    // 🚨 PROJECT EVENTS REQUIRE projectId
    if (projectEvents.has(args.type) && !args.projectId) {
      throw new Error(`projectId is required for event type: ${args.type}`);
    }

    // 🚨 ARTIST EVENTS REQUIRE artistId
    if (artistEvents.has(args.type) && !args.artistId) {
      throw new Error(`artistId is required for event type: ${args.type}`);
    }

    // ======================
    // 🧠 1. STORE EVENT
    // ======================
    await ctx.db.insert("events", {
      ...args,
      createdAt: now,
    });

    // ======================
    // ⚡ 2. USER UPDATES
    // ======================
    const user = await ctx.db.get(args.userId);
    if (!user) return;

    const updates: Partial<typeof user> = {
      lastActiveAt: now,
    };

    if (args.type === "song_play") {
      updates.totalPlays = user.totalPlays + 1;
      updates.totalListeningTime =
        user.totalListeningTime + (args.duration ?? 0);
    }

    if (args.type === "song_skip") {
      updates.totalSkips = user.totalSkips + 1;
    }

    if (args.type === "song_replay") {
      updates.totalReplays = user.totalReplays + 1;
    }

    if (args.type === "song_like") {
      // placeholder for future like system
    }

    await ctx.db.patch(args.userId, updates);
  },
});