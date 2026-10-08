import { mutation } from "../_generated/server";
import { v } from "convex/values";

const MANAGER_ROLES = new Set([
  "owner",
  "admin",
  "manager",
]);

export const updateMyArtistProfile = mutation({
  args: {
    artistId: v.id("artists"),
    name: v.string(),
    image: v.union(
      v.string(),
      v.null()
    ),
    bio: v.union(
      v.string(),
      v.null()
    ),
  },

  handler: async (
    ctx,
    {
      artistId,
      name,
      image,
      bio,
    }
  ) => {
    // ------------------------------------------------------
    // AUTHENTICATE
    // ------------------------------------------------------

    const identity =
      await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error(
        "Authentication required."
      );
    }

    // ------------------------------------------------------
    // CURRENT SOA USER
    // ------------------------------------------------------

    const user =
      await ctx.db
        .query("users")
        .withIndex(
          "by_clerkId",
          q =>
            q.eq(
              "clerkId",
              identity.subject
            )
        )
        .unique();

    if (!user) {
      throw new Error(
        "SOA user not found."
      );
    }

    // ------------------------------------------------------
    // ARTIST EXISTS
    // ------------------------------------------------------

    const artist =
      await ctx.db.get(
        artistId
      );

    if (!artist) {
      throw new Error(
        "Artist not found."
      );
    }

    // ------------------------------------------------------
    // AUTHORIZE
    // Platform admins may manage any artist.
    // Artist owner/admin/manager may manage their artist.
    // Analysts remain read-only.
    // ------------------------------------------------------

    const isPlatformAdmin =
      user.platformRole ===
      "admin";

    let canManage =
      isPlatformAdmin;

    if (!canManage) {
      const membership =
        await ctx.db
          .query(
            "artistMembers"
          )
          .withIndex(
            "by_artist_user",
            q =>
              q
                .eq(
                  "artistId",
                  artistId
                )
                .eq(
                  "userId",
                  user._id
                )
          )
          .unique();

      canManage =
        Boolean(
          membership &&
            membership.isActive &&
            MANAGER_ROLES.has(
              membership.role
            )
        );
    }

    if (!canManage) {
      throw new Error(
        "You do not have permission to edit this artist."
      );
    }

    // ------------------------------------------------------
    // VALIDATE
    // ------------------------------------------------------

    const cleanName =
      name.trim();

    const cleanImage =
      image?.trim() ?? "";

    const cleanBio =
      bio?.trim() ?? "";

    if (!cleanName) {
      throw new Error(
        "Artist name is required."
      );
    }

    if (
      cleanName.length > 80
    ) {
      throw new Error(
        "Artist name must be 80 characters or fewer."
      );
    }

    if (
      cleanBio.length > 1200
    ) {
      throw new Error(
        "Artist bio must be 1,200 characters or fewer."
      );
    }

    // ------------------------------------------------------
    // UPDATE
    // ------------------------------------------------------

    await ctx.db.patch(
      artistId,
      {
        name: cleanName,
        image:
          cleanImage || undefined,
        bio:
          cleanBio || undefined,
      }
    );

    return {
      ok: true,
      artistId,
    };
  },
});
