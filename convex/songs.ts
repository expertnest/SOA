import { audio } from "framer-motion/client";
import { query } from "./_generated/server";

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