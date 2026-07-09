import { query } from "./_generated/server";

export const getSongsForFeed = query({
  handler: async (ctx) => {
    // ======================
    // FETCH
    // ======================
    const songs = await ctx.db.query("songs").collect();
    const stats = await ctx.db.query("song_stats").collect();
    const artists = await ctx.db.query("artists").collect();

    // 🔥 ADD THESE
    const projects = await ctx.db.query("projects").collect();
    const projectSongs = await ctx.db.query("projectSongs").collect();

    // ======================
    // MAPS
    // ======================
    const statsMap = new Map(stats.map((s) => [s.songId, s]));
    const artistMap = new Map(artists.map((a) => [a._id, a]));

    const projectMap = new Map(projects.map((p) => [p._id, p]));
    const songToProjectMap = new Map(
      projectSongs.map((ps) => [ps.songId, ps.projectId])
    );

    // ======================
    // BUILD RESULT
    // ======================
    const result = songs.map((song) => {
      const stat = statsMap.get(song._id);
      const artist = artistMap.get(song.artistId);

      // 🔥 GET PROJECT (if exists)
      const projectId = songToProjectMap.get(song._id);
      const project = projectId ? projectMap.get(projectId) : null;

      // 🔥 COVER LOGIC (THIS IS THE KEY)
      const coverImage =
        project?.coverImage ?? song.coverImage ?? null;

      const plays = stat?.totalPlays ?? 0;
      const skipRate = stat?.skipRate ?? 0;
      const replayRate = stat?.replayRate ?? 0;

      return {
        songId: song._id,
        title: song.title,
        artistName: artist?.name ?? "Unknown",

        duration: song.duration,
        coverImage,

        totalPlays: plays,
        skipRate,
        replayRate,

        isHot: plays > 20,
        isTrending: replayRate > 0.25,
      };
    });

    return result.sort((a, b) => b.totalPlays - a.totalPlays);
  },
});