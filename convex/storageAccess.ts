import { internalQuery } from "./_generated/server";
import { v } from "convex/values";

// ==============================
// GET AUTHORIZED UPLOAD CONTEXT
// ==============================

export const getAuthorizedReleaseUploadContext =
  internalQuery({
    args: {
      clerkId: v.string(),
      projectId: v.id("projects"),
    },

    handler: async (ctx, args) => {
      // ==========================
      // GET USER
      // ==========================

      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) =>
          q.eq("clerkId", args.clerkId)
        )
        .unique();

      if (!user) {
        throw new Error("User not found");
      }

      // ==========================
      // GET PROJECT
      // ==========================

      const project = await ctx.db.get(
        args.projectId
      );

      if (!project) {
        throw new Error(
          "Project not found"
        );
      }

      // ==========================
      // GET ARTIST
      // ==========================

      const artist = await ctx.db.get(
        project.artistId
      );

      if (!artist) {
        throw new Error(
          "Artist not found"
        );
      }

      // ==========================
      // AUTHORIZE USER
      // ==========================

      if (
        user.platformRole !== "admin"
      ) {
        const membership =
          await ctx.db
            .query("artistMembers")
            .withIndex(
              "by_artist_user",
              (q) =>
                q
                  .eq(
                    "artistId",
                    project.artistId
                  )
                  .eq(
                    "userId",
                    user._id
                  )
            )
            .unique();

        if (
          !membership ||
          !membership.isActive
        ) {
          throw new Error(
            "You do not have access to this artist"
          );
        }

        if (
          membership.role !== "owner" &&
          membership.role !== "admin" &&
          membership.role !== "manager"
        ) {
          throw new Error(
            "You do not have permission to upload releases"
          );
        }
      }

      // ==========================
      // VALIDATE RELEASE
      // ==========================

      if (
        project.type === "draft"
      ) {
        throw new Error(
          "Release type must be selected before uploading files"
        );
      }

      if (!project.catalogNumber) {
        throw new Error(
          "Project does not have a catalog number"
        );
      }

      const releaseTimestamp =
        project.releaseDate ??
        project.createdAt;

      const releaseYear =
        new Date(
          releaseTimestamp
        ).getUTCFullYear();

      // ==========================
      // RETURN TRUSTED DATA
      // ==========================

      return {
        artistId:
          project.artistId,

        artistSlug:
          artist.slug,

        projectId:
          project._id,

        projectName:
          project.name,

        releaseType:
          project.type,

        releaseYear,

        catalogNumber:
          project.catalogNumber,
      };
    },
  });