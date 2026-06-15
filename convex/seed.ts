import { mutation } from "./_generated/server";
import { v } from "convex/values";

const rand = <T,>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

const now = Date.now();

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("🌱 Starting full music platform seed...");

    // ======================
    // 1. ARTISTS
    // ======================
    const artistNames = [
      "Nova K",
      "Luna Wave",
      "Drift City",
      "Echo Bloom",
      "ZeroPhase",
    ];

    const artistIds: any[] = [];

    for (const name of artistNames) {
      const id = await ctx.db.insert("artists", {
        name,
        image: "",
        followerCount: 0,
        totalStreams: 0,
        superfanCount: 0,
        totalRevenue: 0,
        monthlyListeners: 0,
      });

      artistIds.push(id);
    }

    // ======================
    // 2. USERS
    // ======================
    const userIds: any[] = [];

    for (let i = 1; i <= 25; i++) {
      const id = await ctx.db.insert("users", {
        clerkId: `clerk_user_${i}`,
        username: `user_${i}`,
        displayName: `User ${i}`,
        email: `user${i}@test.com`,
        avatar: "",
        countryCode: "US",
        bio: "test user",

        plan: "free",

        isOnline: false,
        isBanned: false,
        isVerified: false,

        lastActiveAt: now,
        createdAt: now,

        totalListeningTime: 0,
        totalPlays: 0,
        totalSkips: 0,
        totalReplays: 0,

        sessionCount: 0,
        averageSessionDuration: 0,

        skipRate: 0,
        replayRate: 0,

        engagementLevel: "casual",
        superfanScore: 0,
        lifetimeValue: 0,
      });

      userIds.push(id);
    }

    // ======================
    // 3. PROJECTS (ALBUMS)
    // ======================
    const projectIds: any[] = [];

    const albumNames = [
      "Midnight Frequencies",
      "Neon Dreams",
      "Ocean Static",
      "Broken Signals",
      "Digital Echoes",
    ];

    for (let i = 0; i < albumNames.length; i++) {
      const artistId = rand(artistIds);

      const id = await ctx.db.insert("projects", {
        name: albumNames[i],
        artistId,

        description: "seed album",
        coverImage: "",

        type: "album",

        releaseDate: now,
        createdAt: now,

        totalPlays: 0,
      });

      projectIds.push(id);
    }

    // ======================
    // 4. SONGS
    // ======================
    const songTitles = [
      "Midnight Drive",
      "Ocean Eyes",
      "Static Dreams",
      "Neon Pulse",
      "Cold Signals",
      "Lost Frequency",
      "Skyline Fade",
      "Digital Rain",
      "Broken Waves",
      "Afterlight",
      "Ghost Transmission",
      "Velvet Code",
    ];

    const songIds: any[] = [];

    for (const title of songTitles) {
      const artistId = rand(artistIds);

      const id = await ctx.db.insert("songs", {
        title,
        artistId,

        duration: 180 + Math.floor(Math.random() * 120),
        genre: "electronic",

        totalPlays: 0,
        skipRate: 0,
        completionRate: 0,

        uniqueListeners: 0,
        replayRate: 0,
      });

      songIds.push(id);
    }

    // ======================
    // 5. PROJECT SONGS (TRACK ORDER)
    // ======================
    for (const projectId of projectIds) {
      const shuffled = [...songIds].sort(() => Math.random() - 0.5);

      const tracks = shuffled.slice(0, 5);

      tracks.forEach(async (songId, index) => {
        await ctx.db.insert("projectSongs", {
          projectId,
          songId,
          trackNumber: index + 1,
        });
      });
    }

    // ======================
    // 6. LISTENING HISTORY
    // ======================
    for (const userId of userIds) {
      for (const songId of songIds.slice(0, 6)) {
        const plays = Math.floor(Math.random() * 5);

        if (plays === 0) continue;

        await ctx.db.insert("listening_history", {
          userId,
          songId,
          playCount: plays,
          lastPlayedAt: now,
        });
      }
    }

    // ======================
    // 7. EVENTS (REAL BEHAVIOR SIMULATION)
    // ======================
    const eventTypes = ["song_play", "song_skip", "song_like"];

    for (let i = 0; i < 400; i++) {
      const userId = rand(userIds);
      const songId = rand(songIds);
      const type = rand(eventTypes);

      await ctx.db.insert("events", {
        userId,
        songId,
        type: type as any,
        createdAt: now - Math.floor(Math.random() * 1000000),
      });
    }

    console.log("✅ Full seed complete");

    return {
      artists: artistIds.length,
      users: userIds.length,
      projects: projectIds.length,
      songs: songIds.length,
      events: 400,
    };
  },
});