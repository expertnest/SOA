import { mutation } from "./_generated/server";

export const fixSongs = mutation({
  args: {},
  handler: async (ctx) => {
    const songs = await ctx.db.query("songs").collect();

    // find project
    const midnightFreqProject = await ctx.db
      .query("projects")
      .filter((q) =>
        q.eq(q.field("name"), "Midnight Frequencies")
      )
      .first();

    if (!midnightFreqProject) {
      throw new Error("Midnight Frequencies project not found");
    }

    for (const song of songs) {
      // ONLY attach songs that belong to that project
      const belongsToProject =
        song.title === "Midnight Drive" ||
        song.title === "After Hours";

      if (!belongsToProject) continue;

      // check if relation already exists (avoid duplicates)
      const existing = await ctx.db
        .query("projectSongs")
        .filter((q) =>
          q.and(
            q.eq(q.field("songId"), song._id),
            q.eq(q.field("projectId"), midnightFreqProject._id)
          )
        )
        .first();

      if (existing) continue;

      await ctx.db.insert("projectSongs", {
        projectId: midnightFreqProject._id,
        songId: song._id,
        trackNumber: 1,
      });
    }

    return { success: true };
  },
});