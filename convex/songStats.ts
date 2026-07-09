import { query } from "./_generated/server";

export const getSongStats = query({
  handler: async (ctx) => {
    const stats = await ctx.db.query("song_stats").collect();
    const songs = await ctx.db.query("songs").collect();
    const artists = await ctx.db.query("artists").collect();

    const songMap = new Map(songs.map((s) => [s._id, s]));
    const artistMap = new Map(artists.map((a) => [a._id, a]));

    return stats
      .map((stat) => {
        const song = songMap.get(stat.songId);
        const artist = song ? artistMap.get(song.artistId) : null;

        const engagementScore =
          stat.totalPlays +
          stat.totalSkips * -2 +
          stat.replayRate * stat.totalPlays * 2;

        const retentionStrength =
          stat.replayRate * stat.totalPlays - stat.totalSkips;

        return {
          songId: stat.songId,

          title: song?.title ?? "Unknown",
          artistName: artist?.name ?? "Unknown Artist",

          plays: stat.totalPlays,
          skips: stat.totalSkips,
          uniqueListeners: stat.uniqueListeners,

          replayRate: stat.replayRate,
          skipRate: stat.skipRate,

          // 🔥 derived (needed for your UI)
          replays: Math.round(stat.replayRate * stat.totalPlays),
          likes: 0, // you’re not tracking likes yet in stats

          likeRate: 0,

          engagementScore,
          retentionStrength,

          isDropOff: stat.skipRate > 0.5,
          isSticky: stat.replayRate > 0.3,
          isBreakout:
            stat.totalPlays > 5 && stat.replayRate > 0.2,

          updatedAt: stat.updatedAt,
        };
      })
      .sort((a, b) => b.engagementScore - a.engagementScore);
  },
});