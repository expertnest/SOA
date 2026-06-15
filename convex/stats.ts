import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const updateUserStats = internalMutation({
  args: {
    userId: v.id("users"),
  },

  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return;

    const skipRate =
      user.totalPlays > 0
        ? user.totalSkips / user.totalPlays
        : 0;

    const replayRate =
      user.totalPlays > 0
        ? user.totalReplays / user.totalPlays
        : 0;

    const superfanScore =
      Math.min(1000,
        user.totalListeningTime * 0.01 +
        user.totalPlays * 2 +
        replayRate * 200 -
        skipRate * 150 +
        user.sessionCount * 5
      );

    const engagementLevel =
      superfanScore > 700
        ? "superfan"
        : superfanScore > 300
        ? "active"
        : "casual";

    await ctx.db.patch(args.userId, {
      skipRate,
      replayRate,
      superfanScore,
      engagementLevel,
    });
  },
});