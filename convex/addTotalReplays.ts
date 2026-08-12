import { mutation } from "./_generated/server";

export const backfillTotalReplays = mutation({
  handler: async (ctx) => {
    const stats = await ctx.db.query("song_stats").collect();

    let updated = 0;

    for (const stat of stats) {
      if (stat.totalReplays === undefined) {
        await ctx.db.patch(stat._id, {
          totalReplays: 0,
        });
        updated++;
      }
    }

    return {
      success: true,
      updated,
      total: stats.length,
    };
  },
});