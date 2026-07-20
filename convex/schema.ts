import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ======================
  // 👤 USERS
  // ======================
  users: defineTable({
    clerkId: v.string(),
    userId: v.optional(v.string()),
    username: v.string(),
    displayName: v.string(),
    email: v.optional(v.string()),
    avatar: v.string(),
    countryCode: v.string(),
    bio: v.optional(v.string()),

    plan: v.union(
      v.literal("free"),
      v.literal("pro"),
      v.literal("premium")
    ),

    isOnline: v.boolean(),
    isBanned: v.boolean(),
    isVerified: v.boolean(),

    lastActiveAt: v.number(),
    createdAt: v.number(),

    // ===== listening aggregates =====
    totalListeningTime: v.number(),
    totalPlays: v.number(),
    totalSkips: v.number(),
    totalReplays: v.number(),

    sessionCount: v.number(),
    averageSessionDuration: v.number(),

    skipRate: v.number(),
    replayRate: v.number(),

    // ===== fan intelligence =====
    engagementLevel: v.union(
      v.literal("casual"),
      v.literal("active"),
      v.literal("superfan")
    ),

    superfanScore: v.number(),
    lifetimeValue: v.number(),

    loyaltyIndex: v.optional(v.number()),
    revenueGenerated: v.optional(v.number()),
    streakDays: v.optional(v.number()),

    affinityTags: v.optional(v.array(v.string())),
    favoriteArtistIds: v.optional(v.array(v.id("artists"))),
    mostListenedSongIds: v.optional(v.array(v.id("songs"))),
  })
    .index("by_clerkId", ["clerkId"])  
    .index("by_username", ["username"]),

  // ======================
  // 🎤 ARTISTS
  // ======================
  artists: defineTable({
    name: v.string(),
    image: v.optional(v.string()),

    followerCount: v.number(),
    totalStreams: v.number(),
    superfanCount: v.number(),

    totalRevenue: v.optional(v.number()),
    monthlyListeners: v.optional(v.number()),
  }),

  // ======================
  // 📦 PROJECTS
  // ======================
  projects: defineTable({
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
    createdAt: v.number(),

    totalPlays: v.optional(v.number()),
  })
    .index("by_artistId", ["artistId"])
    .index("by_type", ["type"]),

  // ======================
  // 🎧 SONGS
  // ======================
songs: defineTable({
  title: v.string(),
  artistId: v.id("artists"),

  audioUrl: v.string(), // ✅ ADD HERE (Cloudflare / R2 link)

  duration: v.number(),
  genre: v.optional(v.string()),
  coverImage: v.optional(v.string()),

  totalPlays: v.number(),
  skipRate: v.number(),
  completionRate: v.number(),

  uniqueListeners: v.optional(v.number()),
  replayRate: v.optional(v.number()),
})
.index("by_artistId", ["artistId"]),

  // ======================
  // 🔗 PROJECT SONGS
  // ======================
  projectSongs: defineTable({
    projectId: v.id("projects"),
    songId: v.id("songs"),
    trackNumber: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_songId", ["songId"]),

  // ======================
  // 📁 PLAYLISTS
  // ======================
  playlists: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    isPublic: v.boolean(),
    createdAt: v.number(),
  }),

  playlist_songs: defineTable({
    playlistId: v.id("playlists"),
    songId: v.id("songs"),
    position: v.number(),
    addedAt: v.number(),
  }),

  // ======================
  // ⚡ EVENTS (UPDATED)
  // ======================
  events: defineTable({
    userId: v.union(v.id("users"), v.string()),

    isAnonymous: v.optional(v.boolean()), // 👈 ADD THIS

    type: v.union(
      v.literal("song_play"),
      v.literal("song_skip"),
      v.literal("song_replay"),
      v.literal("song_like"),
      v.literal("song_end"),
      v.literal("project_view"),
      v.literal("artist_follow"),
      v.literal("playlist_create"),
      v.literal("purchase"),
      v.literal("post_view")
    ),

    songId: v.optional(v.id("songs")),
    projectId: v.optional(v.id("projects")),
    artistId: v.optional(v.id("artists")),

    sessionId: v.optional(v.id("sessions")),
    streamId: v.optional(v.id("streams")),

    source: v.optional(v.string()),
    duration: v.optional(v.number()),
    deviceType: v.optional(v.string()),

    createdAt: v.number(),
  })
    .index("by_songId", ["songId"])
    .index("by_projectId", ["projectId"])
    .index("by_artistId", ["artistId"])
    .index("by_userId", ["userId"])
    .index("by_sessionId", ["sessionId"])

    // 🔥 ADDED
    .index("by_user_song_type", ["userId", "songId", "type"]),

  // ======================
  // ⚡ SESSIONS
  // ======================
  sessions: defineTable({
    userId: v.id("users"),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    deviceType: v.optional(v.string()),
  }),

  // ======================
  // 🎥 STREAMS
  // ======================
  streams: defineTable({
    artistId: v.id("artists"),
    title: v.string(),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    viewerCount: v.number(),
  }),

  stream_viewers: defineTable({
    streamId: v.id("streams"),
    userId: v.id("users"),
    joinTime: v.number(),
    leaveTime: v.optional(v.number()),
  }),

  // ======================
  // 💬 CHAT
  // ======================
  chat_messages: defineTable({
    streamId: v.id("streams"),
    userId: v.id("users"),
    message: v.string(),
    createdAt: v.number(),
  }),

  // ======================
  // 💰 TRANSACTIONS
  // ======================
  transactions: defineTable({
    userId: v.id("users"),
    type: v.string(),
    amount: v.number(),

    songId: v.optional(v.id("songs")),
    projectId: v.optional(v.id("projects")),
    artistId: v.optional(v.id("artists")),

    createdAt: v.number(),
  }),

  // ======================
  // 🛒 PRODUCTS
  // ======================
  products: defineTable({
    artistId: v.id("artists"),
    name: v.string(),
    price: v.number(),

    type: v.union(
      v.literal("merch"),
      v.literal("digital")
    ),

    image: v.optional(v.string()),
    stock: v.optional(v.number()),

    createdAt: v.number(),
  })
    .index("by_artistId", ["artistId"]),

  // ======================
  // 🛒 PURCHASES
  // ======================
  purchases: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),

    amount: v.number(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_productId", ["productId"]),

  // ======================
  // 📰 POSTS
  // ======================
  posts: defineTable({
    artistId: v.id("artists"),

    type: v.union(
      v.literal("song_drop"),
      v.literal("merch_drop"),
      v.literal("update")
    ),

    songId: v.optional(v.id("songs")),
    projectId: v.optional(v.id("projects")),

    title: v.string(),
    image: v.optional(v.string()),

    createdAt: v.number(),
  })
    .index("by_artistId", ["artistId"]),

  // ======================
  // 📊 SONG STATS
  // ======================
  song_stats: defineTable({
    songId: v.id("songs"),
  
    totalPlays: v.number(),
    totalSkips: v.number(),
    totalReplays: v.optional(v.number()),
    uniqueListeners: v.number(),
  
    completionRate: v.number(),
    skipRate: v.number(),
    replayRate: v.number(),
  
    updatedAt: v.number(),
  })
  .index("by_songId", ["songId"]),

  // ======================
  // 📊 ARTIST STATS
  // ======================
  artist_stats: defineTable({
    artistId: v.id("artists"),

    totalStreams: v.number(),
    totalRevenue: v.number(),
    superfanCount: v.number(),

    topSongId: v.optional(v.id("songs")),

    updatedAt: v.number(),
  })
    .index("by_artistId", ["artistId"]),

  // ======================
  // 👤 LISTENING HISTORY (UPDATED)
  // ======================
  // ======================
// 👤 LISTENING HISTORY (AUTH USERS)
// ======================
listening_history: defineTable({
  userId: v.id("users"),
  songId: v.id("songs"),

  lastPlayedAt: v.number(),
  playCount: v.number(),
})
  .index("by_userId", ["userId"])
  .index("by_songId", ["songId"])
  .index("by_user_song", ["userId", "songId"]),


// ======================
// 👤 ANONYMOUS LISTENING HISTORY
// ======================
anonymous_listening_history: defineTable({
  anonId: v.string(),
  songId: v.id("songs"),

  lastPlayedAt: v.number(),
  playCount: v.number(),
})
  .index("by_anon_song", ["anonId", "songId"]),
});

// ======================
// 👤 ANONYMOUS LISTENING HISTORY
// ======================
anonymous_listening_history: defineTable({
  anonId: v.string(),
  songId: v.id("songs"),

  lastPlayedAt: v.number(),
  playCount: v.number(),
})
.index(
  "by_anon_song",
  ["anonId", "songId"]
)