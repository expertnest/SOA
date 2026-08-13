import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ==============================
// 🎧 GET SONGS (FEED)
// ==============================
export const getSongsForFeed = query({
  handler: async (ctx) => {
    const songs = await ctx.db.query("songs").collect();
    const stats = await ctx.db.query("song_stats").collect();
    const artists = await ctx.db.query("artists").collect();

    const statsMap = new Map(stats.map((s) => [s.songId, s]));
    const artistMap = new Map(artists.map((a) => [a._id, a]));

    return songs.map((song) => {
      const stat = statsMap.get(song._id);
      const artist = artistMap.get(song.artistId);

      return {
        songId: song._id,
        title: song.title,
        artistName: artist?.name ?? "Unknown",
        coverImage: song.coverImage ?? "/assets/soalogo.png",
        duration: song.duration ?? 180,
        audioUrl: song.audioUrl ?? "",
        totalPlays: stat?.totalPlays ?? 0,
        skipRate: stat?.skipRate ?? 0,
        replayRate: stat?.replayRate ?? 0,
      };
    });
  },
});

// ==============================
// 🚀 CREATE SONG (UPDATED FOR PROJECTS)
// ==============================
export const createSong = mutation({
  args: {
    title: v.string(),
    artistId: v.id("artists"),
    genre: v.optional(v.string()),
    audioUrl: v.string(),
    coverImage: v.optional(v.string()),
    duration: v.number(),

    // 🔥 ADD THESE
    projectId: v.optional(v.id("projects")),
    trackNumber: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    const songId = await ctx.db.insert("songs", {
      title: args.title,
      artistId: args.artistId,
      genre: args.genre,
      audioUrl: args.audioUrl,
      coverImage: args.coverImage,
      duration: args.duration,

      totalPlays: 0,
      skipRate: 0,
      completionRate: 0,
      uniqueListeners: 0,
      replayRate: 0,
    });

    // 🔥 CREATE SONG STATS (UNCHANGED)
    await ctx.db.insert("song_stats", {
      songId,
      totalPlays: 0,
      totalSkips: 0,
      totalReplays: 0,
      uniqueListeners: 0,
      completionRate: 0,
      skipRate: 0,
      replayRate: 0,
      updatedAt: now,
    });

    // ==============================
    // 🔗 LINK TO PROJECT (NEW)
    // ==============================
    if (args.projectId) {
      await ctx.db.insert("projectSongs", {
        projectId: args.projectId,
        songId: songId,
        trackNumber: args.trackNumber ?? 1,
      });
    }

    return songId;
  },
});