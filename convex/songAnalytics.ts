import { query } from "./_generated/server";

export const getSongAnalytics = query({
  handler: async (ctx) => {
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

    const analytics = songStats.map(
      (stat) => {
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
      }
    );

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


// ======================
// DEEP ANALYTICS SELECTOR
// ======================

export const getSongsForAnalyticsSelector = query({
  handler: async (ctx) => {
    const songs = await ctx.db
      .query("songs")
      .collect();

    const artists = await ctx.db
      .query("artists")
      .collect();

    const artistMap = new Map(
      artists.map((artist) => [
        artist._id,
        artist,
      ])
    );

    return songs.map((song) => ({
      songId: song._id,
      title: song.title,
      artistId: song.artistId,
      artistName:
        artistMap.get(song.artistId)?.name ??
        "Unknown Artist",
    }));
  },
});