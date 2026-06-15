import { query } from "./_generated/server";

export const getArtistComparison = query({
  args: {},
  handler: async (ctx) => {
    const artists = await ctx.db.query("artists").collect();

    const results = await Promise.all(
      artists.map(async (artist) => {
        const songs = await ctx.db
          .query("songs")
          .withIndex("by_artistId", (q) =>
            q.eq("artistId", artist._id)
          )
          .collect();

        const projects = await ctx.db
          .query("projects")
          .withIndex("by_artistId", (q) =>
            q.eq("artistId", artist._id)
          )
          .collect();

        let totalStreams = 0;
        let totalSkips = 0;
        let totalReplays = 0;

        for (const song of songs) {
          totalStreams += song.totalPlays || 0;
          totalSkips += (song.skipRate || 0) * (song.totalPlays || 0);
          totalReplays += (song.completionRate || 0) * (song.totalPlays || 0);
        }

        const avgPlaysPerSong =
          songs.length > 0 ? totalStreams / songs.length : 0;

        const skipRate =
          totalStreams > 0 ? totalSkips / totalStreams : 0;

        const replayRate =
          totalStreams > 0 ? totalReplays / totalStreams : 0;

        const uniqueListeners =
          totalStreams > 0 ? totalStreams * 0.65 : 0;

        const fanConversionRate =
          replayRate > 0 ? replayRate * 80 : 0;

        const superfanDensity =
          uniqueListeners > 0 && artist.superfanCount
            ? (artist.superfanCount / uniqueListeners) * 100
            : 0;

        const momentumGrowth = totalStreams * 0.02;

        const variance =
          songs.length > 0
            ? songs.reduce((acc, s) => {
                const diff = (s.totalPlays || 0) - avgPlaysPerSong;
                return acc + diff * diff;
              }, 0) / songs.length
            : 0;

        const consistencyScore = Math.max(0, 100 - variance / 100);

        const score =
          totalStreams * 0.4 +
          replayRate * 1000 +
          (1 - skipRate) * 500 +
          superfanDensity * 10;

        return {
          artistId: artist._id,
          name: artist.name,

          // =========================
          // METRICS
          // =========================
          totalStreams,
          uniqueListeners,
          avgPlaysPerSong,

          totalSkips,
          totalReplays,

          skipRate,
          replayRate,

          fanConversionRate,
          superfanDensity,

          momentumGrowth,
          consistencyScore,

          score,

          projectCount: projects.length,
          songCount: songs.length,

          // =========================
          // 🧪 NUTRIENTS (FORMULAS)
          // =========================
          nutrients: {
            totalStreams: "Σ(song.totalPlays)",

            totalSkips:
              "Σ(song.skipRate × song.totalPlays)",

            totalReplays:
              "Σ(song.completionRate × song.totalPlays)",

            avgPlaysPerSong:
              "totalStreams ÷ songCount",

            skipRate:
              "totalSkips ÷ totalStreams",

            replayRate:
              "totalReplays ÷ totalStreams",

            uniqueListeners:
              "totalStreams × 0.65 (estimated)",

            fanConversionRate:
              "replayRate × 80",

            superfanDensity:
              "(artist.superfanCount ÷ uniqueListeners) × 100",

            momentumGrowth:
              "totalStreams × 0.02",

            consistencyScore:
              "100 − (variance ÷ 100)",

            variance:
              "Σ((songPlays − avgPlaysPerSong)²) ÷ songCount",

            score:
              "(totalStreams × 0.4) + (replayRate × 1000) + ((1 - skipRate) × 500) + (superfanDensity × 10)",
          },
        };
      })
    );

    return results.sort((a, b) => b.score - a.score);
  },
});