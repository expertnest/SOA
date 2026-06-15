import { mutation } from "./_generated/server";

export const seedMoreSongs = mutation({
  args: {},
  handler: async (ctx) => {
    const songs = [
      {
        title: "After Hours",
        artistName: "Midnight Echo",
        duration: 210,
        genre: "lofi",
      },
      {
        title: "Neon Lights",
        artistName: "Midnight Echo",
        duration: 180,
        genre: "electronic",
      },
      {
        title: "Midnight Drive",
        artistName: "Neon Waves",
        duration: 240,
        genre: "ambient",
      },
      {
        title: "Blue Static",
        artistName: "Neon Waves",
        duration: 200,
        genre: "electronic",
      },
      {
        title: "Slow Burn",
        artistName: "Midnight Echo",
        duration: 195,
        genre: "lofi",
      },
    ];

    for (const song of songs) {
      const artist = await ctx.db
        .query("artists")
        .filter((q) => q.eq(q.field("name"), song.artistName))
        .first();

      if (!artist) {
        console.warn(`Artist not found: ${song.artistName}`);
        continue;
      }

      await ctx.db.insert("songs", {
        title: song.title,
        artistId: artist._id,
        
        duration: song.duration,
        genre: song.genre,

        totalPlays: 0,
        skipRate: 0,
        completionRate: 0,
      });
    }

    return { success: true };
  },
});