import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getSongAnalytics = query({
  handler: async (ctx) => {
    const songs = await ctx.db.query("songs").collect();
    const artists = await ctx.db.query("artists").collect();
    const songStats = await ctx.db.query("song_stats").collect();

    const projects = await ctx.db.query("projects").collect();
    const projectSongs = await ctx.db.query("projectSongs").collect();

    // ======================
    // MAPS
    // ======================

    const songMap = new Map(
      songs.map((song) => [song._id, song])
    );

    const artistMap = new Map(
      artists.map((artist) => [artist._id, artist])
    );

    const projectMap = new Map(
      projects.map((project) => [project._id, project])
    );

    const songToProjectMap = new Map(
      projectSongs.map((ps) => [
        ps.songId,
        ps.projectId,
      ])
    );


    // ======================
    // BUILD ANALYTICS
    // ======================

    const analytics = songStats.map((stat) => {

      const song = songMap.get(stat.songId);

      const artist = song
        ? artistMap.get(song.artistId)
        : null;


      const projectId = songToProjectMap.get(
        stat.songId
      );

      const project = projectId
        ? projectMap.get(projectId)
        : null;


      const plays = stat.totalPlays;
      const skips = stat.totalSkips;

      const replays =
        Math.round(stat.replayRate * plays);


      const likes = 0;


      const skipRate =
        plays > 0
          ? skips / plays
          : 0;


      const replayRate =
        stat.replayRate ?? 0;


      const likeRate =
        plays > 0
          ? likes / plays
          : 0;


      const engagementScore =
        plays +
        replays * 2 -
        skips * 2;


      const retentionStrength =
        replays - skips;


      return {

        songId: stat.songId,


        // SONG

        title:
          song?.title ??
          "Unknown",


        // ARTIST

        artistId:
          song?.artistId,


        artistName:
          artist?.name ??
          "Unknown Artist",


        // PROJECT

        projectId:
          project?._id ??
          null,


        projectName:
          project?.name ??
          "No Project",



        // METRICS

        plays,

        uniqueListeners:
          stat.uniqueListeners,


        skips,

        replays,

        likes,



        // RATES

        skipRate,

        replayRate,

        likeRate,



        // SCORES

        engagementScore,

        retentionStrength,



        // FLAGS

        isDropOff:
          skipRate > 0.5,


        isSticky:
          replayRate > 0.3,


        isBreakout:
          plays > 5 &&
          replayRate > 0.2,
      };
    });


    return analytics.sort(
      (a,b) =>
        b.engagementScore -
        a.engagementScore
    );
  },
});