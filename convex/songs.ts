import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ==============================
// GET CURRENT USER
// ==============================

async function getCurrentUser(ctx: any) {
  const identity =
    await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) =>
      q.eq("clerkId", identity.subject)
    )
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

// ==============================
// REQUIRE ARTIST WRITE ACCESS
// ==============================

async function requireArtistWriteAccess(
  ctx: any,
  artistId: any
) {
  const user =
    await getCurrentUser(ctx);

  // SOA platform admin can manage
  // any artist.
  if (
    user.platformRole === "admin"
  ) {
    return user;
  }

  const membership = await ctx.db
    .query("artistMembers")
    .withIndex(
      "by_artist_user",
      (q: any) =>
        q
          .eq("artistId", artistId)
          .eq("userId", user._id)
    )
    .unique();

  if (
    !membership ||
    !membership.isActive
  ) {
    throw new Error(
      "You do not have access to this artist"
    );
  }

  if (
    membership.role !== "owner" &&
    membership.role !== "admin" &&
    membership.role !== "manager"
  ) {
    throw new Error(
      "You do not have permission to manage releases"
    );
  }

  return user;
}

// ==============================
// GET SONGS (FEED)
// ==============================

export const getSongsForFeed = query({
  handler: async (ctx) => {
    const songs =
      await ctx.db
        .query("songs")
        .collect();

    const stats =
      await ctx.db
        .query("song_stats")
        .collect();

    const artists =
      await ctx.db
        .query("artists")
        .collect();

    const statsMap = new Map(
      stats.map((s) => [
        s.songId,
        s,
      ])
    );

    const artistMap = new Map(
      artists.map((a) => [
        a._id,
        a,
      ])
    );

    return songs.map((song) => {
      const stat =
        statsMap.get(song._id);

      const artist =
        artistMap.get(
          song.artistId
        );

      return {
        songId:
          song._id,

        title:
          song.title,

        artistName:
          artist?.name ??
          "Unknown",

        coverImage:
          song.coverImage ??
          "/assets/soalogo.png",

        duration:
          song.duration ??
          180,

        audioUrl:
          song.audioUrl ??
          "",

        totalPlays:
          stat?.totalPlays ??
          0,

        skipRate:
          stat?.skipRate ??
          0,

        replayRate:
          stat?.replayRate ??
          0,
      };
    });
  },
});

// ==============================
// CREATE SONG
// ==============================

export const createSong = mutation({
  args: {
    title: v.string(),
    artistId:
      v.id("artists"),

    genre:
      v.optional(
        v.string()
      ),

    audioUrl:
      v.string(),

    coverImage:
      v.optional(
        v.string()
      ),

    duration:
      v.number(),

    projectId:
      v.optional(
        v.id("projects")
      ),

    trackNumber:
      v.optional(
        v.number()
      ),
  },

  handler: async (ctx, args) => {
    // ==========================
    // AUTHORIZE ARTIST
    // ==========================

    await requireArtistWriteAccess(
      ctx,
      args.artistId
    );

    const artist =
      await ctx.db.get(
        args.artistId
      );

    if (!artist) {
      throw new Error(
        "Artist not found"
      );
    }

    // ==========================
    // VALIDATE PROJECT
    // ==========================

    if (args.projectId) {
      const project =
        await ctx.db.get(
          args.projectId
        );

      if (!project) {
        throw new Error(
          "Project not found"
        );
      }

      if (
        project.artistId !==
        args.artistId
      ) {
        throw new Error(
          "This project does not belong to this artist"
        );
      }
    }

    const now = Date.now();

    // ==========================
    // CREATE SONG
    // ==========================

    const songId =
      await ctx.db.insert(
        "songs",
        {
          title:
            args.title,

          artistId:
            args.artistId,

          genre:
            args.genre,

          audioUrl:
            args.audioUrl,

          coverImage:
            args.coverImage,

          duration:
            args.duration,

          isActive: false,

          totalPlays: 0,
          skipRate: 0,
          completionRate: 0,
          uniqueListeners: 0,
          replayRate: 0,
        }
      );

    // ==========================
    // CREATE SONG STATS
    // ==========================

    await ctx.db.insert(
      "song_stats",
      {
        songId,

        totalPlays: 0,
        totalSkips: 0,
        totalReplays: 0,
        totalLikes: 0,
        uniqueListeners: 0,
        completionRate: 0,
        skipRate: 0,
        replayRate: 0,

        updatedAt: now,
      }
    );

    // ==========================
    // LINK TO PROJECT
    // ==========================

    if (args.projectId) {
      await ctx.db.insert(
        "projectSongs",
        {
          projectId:
            args.projectId,

          songId,

          trackNumber:
            args.trackNumber ??
            1,
        }
      );
    }

    return songId;
  },
});