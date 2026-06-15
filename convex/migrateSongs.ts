import { mutation } from "./_generated/server";

export const migrateSongs = mutation({
  args: {},
  handler: async (ctx) => {
    const songs = await ctx.db.query("songs").collect();

    let migratedCount = 0;

    for (const song of songs) {
      // 1. Create projectSongs relation if project exists
      if ((song as any).projectId) {
        await ctx.db.insert("projectSongs", {
          projectId: (song as any).projectId,
          songId: song._id,
          trackNumber: 1, // you can refine later
        });
      }

      // 2. Clean the song document (REMOVE old fields)
      await ctx.db.replace(song._id, {
        title: song.title,
        artistId: song.artistId,
        duration: song.duration,
        genre: song.genre,
        totalPlays: song.totalPlays,
        skipRate: song.skipRate,
        completionRate: song.completionRate,
      });

      migratedCount++;
    }

    return {
      success: true,
      migratedCount,
    };
  },
});