import { query } from "./_generated/server";
import { v } from "convex/values";

// =========================================================
// AUTH HELPERS
// =========================================================

async function getCurrentUser(ctx: any) {
  const identity =
    await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) =>
      q.eq(
        "clerkId",
        identity.subject
      )
    )
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

// =========================================================
// REQUIRE PLATFORM ADMIN
// =========================================================

async function requirePlatformAdmin(
  ctx: any
) {
  const user =
    await getCurrentUser(ctx);

  if (
    user.platformRole !== "admin"
  ) {
    throw new Error(
      "Platform admin access required"
    );
  }

  return user;
}

// =========================================================
// REQUIRE ARTIST ANALYTICS ACCESS
// =========================================================

async function requireArtistAnalyticsAccess(
  ctx: any,
  artistId: any
) {
  const user =
    await getCurrentUser(ctx);

  // =======================================================
  // SOA PLATFORM ADMIN
  // Can inspect analytics for any artist.
  // =======================================================

  if (
    user.platformRole === "admin"
  ) {
    return {
      user,
      membership: null,
      isPlatformAdmin: true,
    };
  }

  // =======================================================
  // ARTIST MEMBERSHIP
  // owner / admin / manager / analyst may all READ analytics.
  // =======================================================

  const membership = await ctx.db
    .query("artistMembers")
    .withIndex(
      "by_artist_user",
      (q: any) =>
        q
          .eq(
            "artistId",
            artistId
          )
          .eq(
            "userId",
            user._id
          )
    )
    .unique();

  if (
    !membership ||
    !membership.isActive
  ) {
    throw new Error(
      "You do not have access to this artist's analytics"
    );
  }

  return {
    user,
    membership,
    isPlatformAdmin: false,
  };
}

// =========================================================
// GLOBAL SONG ANALYTICS
// ADMIN ONLY
// =========================================================

export const getSongAnalytics = query({
  handler: async (ctx) => {
    // ======================
    // AUTHORIZE ADMIN
    // ======================

    await requirePlatformAdmin(ctx);

    // ======================
    // FETCH ONLY WHAT WE NEED
    // ======================

    const songs = await ctx.db
      .query("songs")
      .collect();

    const artists = await ctx.db
      .query("artists")
      .collect();

    const songStats = await ctx.db
      .query("song_stats")
      .collect();

    // ======================
    // MAPS
    // ======================

    const songMap = new Map(
      songs.map((song) => [
        song._id,
        song,
      ])
    );

    const artistMap = new Map(
      artists.map((artist) => [
        artist._id,
        artist,
      ])
    );

    // ======================
    // BUILD ANALYTICS
    // ======================

    const analytics =
      songStats.map((stat) => {
        const song =
          songMap.get(
            stat.songId
          );

        const artist =
          song
            ? artistMap.get(
                song.artistId
              )
            : null;

        // ======================
        // CORE METRICS
        // ======================

        const plays =
          stat.totalPlays ?? 0;

        const skips =
          stat.totalSkips ?? 0;

        const replays =
          stat.totalReplays ?? 0;

        const uniqueListeners =
          stat.uniqueListeners ?? 0;

        const likes =
          stat.totalLikes ?? 0;

        // ======================
        // RATES
        // ======================

        const skipRate =
          stat.skipRate ?? 0;

        const replayRate =
          stat.replayRate ?? 0;

        const likeRate =
          plays > 0
            ? likes / plays
            : 0;

        // ======================
        // SCORES
        // ======================

        const engagementScore =
          plays +
          replays * 2 -
          skips * 2;

        const retentionStrength =
          replays - skips;

        // ======================
        // RETURN
        // ======================

        return {
          songId:
            stat.songId,

          title:
            song?.title ??
            "Unknown",

          artistId:
            song?.artistId,

          artistName:
            artist?.name ??
            "Unknown Artist",

          plays,
          uniqueListeners,
          skips,
          replays,
          likes,

          skipRate,
          replayRate,
          likeRate,

          engagementScore,
          retentionStrength,

          isDropOff:
            skipRate > 0.5,

          isSticky:
            replayRate > 0.3,

          isBreakout:
            plays > 5 &&
            replayRate > 0.2,
        };
      });

    // ======================
    // RANKING
    // ======================

    return analytics.sort(
      (a, b) =>
        b.engagementScore -
        a.engagementScore
    );
  },
});

// =========================================================
// GLOBAL DEEP ANALYTICS SELECTOR
// ADMIN ONLY
// =========================================================

export const getSongsForAnalyticsSelector =
  query({
    handler: async (ctx) => {
      // ======================
      // AUTHORIZE ADMIN
      // ======================

      await requirePlatformAdmin(ctx);

      // ======================
      // FETCH SONGS / ARTISTS
      // ======================

      const songs =
        await ctx.db
          .query("songs")
          .collect();

      const artists =
        await ctx.db
          .query("artists")
          .collect();

      const artistMap =
        new Map(
          artists.map(
            (artist) => [
              artist._id,
              artist,
            ]
          )
        );

      return songs.map(
        (song) => ({
          songId:
            song._id,

          title:
            song.title,

          artistId:
            song.artistId,

          artistName:
            artistMap.get(
              song.artistId
            )?.name ??
            "Unknown Artist",
        })
      );
    },
  });

// =========================================================
// PRIVATE ARTIST SONG ANALYTICS
// ARTIST DASHBOARD
// =========================================================

export const getArtistSongsForAnalytics =
  query({
    args: {
      artistId:
        v.id("artists"),
    },

    handler: async (
      ctx,
      { artistId }
    ) => {
      // ===================================================
      // VERIFY ARTIST
      // ===================================================

      const artist =
        await ctx.db.get(
          artistId
        );

      if (!artist) {
        throw new Error(
          "Artist not found"
        );
      }

      // ===================================================
      // AUTHORIZE
      // ===================================================

      await requireArtistAnalyticsAccess(
        ctx,
        artistId
      );

      // ===================================================
      // GET ONLY THIS ARTIST'S SONGS
      // ===================================================

      const songs =
        await ctx.db
          .query("songs")
          .withIndex(
            "by_artistId",
            (q) =>
              q.eq(
                "artistId",
                artistId
              )
          )
          .collect();

      // ===================================================
      // BUILD SONG ANALYTICS
      // ===================================================

      const analytics =
        await Promise.all(
          songs.map(
            async (song) => {
              const stat =
                await ctx.db
                  .query(
                    "song_stats"
                  )
                  .withIndex(
                    "by_songId",
                    (q) =>
                      q.eq(
                        "songId",
                        song._id
                      )
                  )
                  .first();

              // ======================
              // CORE METRICS
              // ======================

              const plays =
                stat?.totalPlays ??
                0;

              const skips =
                stat?.totalSkips ??
                0;

              const replays =
                stat?.totalReplays ??
                0;

              const uniqueListeners =
                stat?.uniqueListeners ??
                0;

              const likes =
                stat?.totalLikes ??
                0;

              // ======================
              // RATES
              // ======================

              const skipRate =
                stat?.skipRate ??
                0;

              const replayRate =
                stat?.replayRate ??
                0;

              const completionRate =
                stat?.completionRate ??
                0;

              const likeRate =
                plays > 0
                  ? likes /
                    plays
                  : 0;

              // ======================
              // SCORES
              // ======================

              const engagementScore =
                plays +
                replays * 2 -
                skips * 2;

              const retentionStrength =
                replays -
                skips;

              // ======================
              // RETURN
              // ======================

              return {
                songId:
                  song._id,

                artistId:
                  song.artistId,

                artistName:
                  artist.name,

                title:
                  song.title,

                coverImage:
                  song.coverImage ??
                  null,

                duration:
                  song.duration,

                genre:
                  song.genre ??
                  null,

                isActive:
                  song.isActive ??
                  true,

                plays,
                uniqueListeners,
                skips,
                replays,
                likes,

                skipRate,
                replayRate,
                completionRate,
                likeRate,

                engagementScore,
                retentionStrength,

                isDropOff:
                  skipRate >
                  0.5,

                isSticky:
                  replayRate >
                  0.3,

                isBreakout:
                  plays > 5 &&
                  replayRate >
                    0.2,
              };
            }
          )
        );

      // ===================================================
      // RANK BY ENGAGEMENT
      // ===================================================

      return analytics.sort(
        (a, b) =>
          b.engagementScore -
          a.engagementScore
      );
    },
  });