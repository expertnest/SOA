import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ========================================================
// ⚠️ STAGING RESET PREVIEW
// ========================================================
// Shows exactly how many documents would be deleted.
// Does NOT modify anything.
// ========================================================

export const previewStagingReset = query({
  args: {},

  handler: async (ctx) => {
    const [
      projectSongs,
      songStats,
      listeningHistory,
      anonymousListeningHistory,
      listenSessions,
      events,
      songs,
      projects,
      catalogCounters,
    ] = await Promise.all([
      ctx.db.query("projectSongs").collect(),
      ctx.db.query("song_stats").collect(),
      ctx.db.query("listening_history").collect(),
      ctx.db.query("anonymous_listening_history").collect(),
      ctx.db.query("listen_sessions").collect(),
      ctx.db.query("events").collect(),
      ctx.db.query("songs").collect(),
      ctx.db.query("projects").collect(),
      ctx.db.query("catalogCounters").collect(),
    ]);

    return {
      projectSongs: projectSongs.length,
      songStats: songStats.length,
      listeningHistory: listeningHistory.length,
      anonymousListeningHistory: anonymousListeningHistory.length,
      listenSessions: listenSessions.length,
      events: events.length,
      songs: songs.length,
      projects: projects.length,
      catalogCounters: catalogCounters.length,

      total:
        projectSongs.length +
        songStats.length +
        listeningHistory.length +
        anonymousListeningHistory.length +
        listenSessions.length +
        events.length +
        songs.length +
        projects.length +
        catalogCounters.length,
    };
  },
});

// ========================================================
// 🧹 RESET STAGING MUSIC DATA
// ========================================================
//
// DELETES:
//
// projectSongs
// song_stats
// listening_history
// anonymous_listening_history
// listen_sessions
// events
// songs
// projects
// catalogCounters
//
// KEEPS:
//
// users
// artists
// artist_stats
// playlists
// playlist_songs
// posts
// transactions
// sessions
// products
// purchases
// streams
// stream_viewers
// chat_messages
//
// Cloudflare R2 files are NOT touched.
// ========================================================

export const resetStagingData = mutation({
  args: {
    confirmation: v.string(),
  },

  handler: async (ctx, args) => {
    if (args.confirmation !== "RESET_SOA_STAGING") {
      throw new Error(
        'Invalid confirmation. Use exactly "RESET_SOA_STAGING".'
      );
    }

    const deleted = {
      projectSongs: 0,
      songStats: 0,
      listeningHistory: 0,
      anonymousListeningHistory: 0,
      listenSessions: 0,
      events: 0,
      songs: 0,
      projects: 0,
      catalogCounters: 0,
    };

    // ==============================
    // 🔗 PROJECT SONG LINKS
    // ==============================

    const projectSongs = await ctx.db
      .query("projectSongs")
      .collect();

    for (const doc of projectSongs) {
      await ctx.db.delete(doc._id);
      deleted.projectSongs++;
    }

    // ==============================
    // 📊 SONG STATS
    // ==============================

    const songStats = await ctx.db
      .query("song_stats")
      .collect();

    for (const doc of songStats) {
      await ctx.db.delete(doc._id);
      deleted.songStats++;
    }

    // ==============================
    // 👤 AUTH LISTENING HISTORY
    // ==============================

    const listeningHistory = await ctx.db
      .query("listening_history")
      .collect();

    for (const doc of listeningHistory) {
      await ctx.db.delete(doc._id);
      deleted.listeningHistory++;
    }

    // ==============================
    // 👤 ANONYMOUS LISTENING HISTORY
    // ==============================

    const anonymousListeningHistory = await ctx.db
      .query("anonymous_listening_history")
      .collect();

    for (const doc of anonymousListeningHistory) {
      await ctx.db.delete(doc._id);
      deleted.anonymousListeningHistory++;
    }

    // ==============================
    // 🎧 LISTEN SESSIONS
    // ==============================

    const listenSessions = await ctx.db
      .query("listen_sessions")
      .collect();

    for (const doc of listenSessions) {
      await ctx.db.delete(doc._id);
      deleted.listenSessions++;
    }

    // ==============================
    // ⚡ EVENTS
    // ==============================

    const events = await ctx.db
      .query("events")
      .collect();

    for (const doc of events) {
      await ctx.db.delete(doc._id);
      deleted.events++;
    }

    // ==============================
    // 🎵 SONGS
    // ==============================

    const songs = await ctx.db
      .query("songs")
      .collect();

    for (const doc of songs) {
      await ctx.db.delete(doc._id);
      deleted.songs++;
    }

    // ==============================
    // 📦 PROJECTS
    // ==============================

    const projects = await ctx.db
      .query("projects")
      .collect();

    for (const doc of projects) {
      await ctx.db.delete(doc._id);
      deleted.projects++;
    }

    // ==============================
    // 🏷️ CATALOG COUNTERS
    // ==============================

    const catalogCounters = await ctx.db
      .query("catalogCounters")
      .collect();

    for (const doc of catalogCounters) {
      await ctx.db.delete(doc._id);
      deleted.catalogCounters++;
    }

    const totalDeleted =
      deleted.projectSongs +
      deleted.songStats +
      deleted.listeningHistory +
      deleted.anonymousListeningHistory +
      deleted.listenSessions +
      deleted.events +
      deleted.songs +
      deleted.projects +
      deleted.catalogCounters;

    return {
      success: true,
      totalDeleted,
      deleted,
    };
  },
});