import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// ==============================
// ROLES
// ==============================

const artistRole = v.union(
  v.literal("owner"),
  v.literal("admin"),
  v.literal("manager"),
  v.literal("analyst")
);

// ==============================
// GET CURRENT USER
// ==============================

async function getCurrentUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) =>
      q.eq("clerkId", identity.subject)
    )
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

// ==============================
// REQUIRE PLATFORM ADMIN
// ==============================

async function requirePlatformAdmin(ctx: any) {
  const user = await getCurrentUser(ctx);

  if (user.platformRole !== "admin") {
    throw new Error("Platform admin access required");
  }

  return user;
}

// ==============================
// CREATE ARTIST INVITE
// PLATFORM ADMIN ONLY
// ==============================

export const createArtistInvite = mutation({
  args: {
    artistId: v.id("artists"),
    email: v.string(),
    role: artistRole,
  },

  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx);

    const artist = await ctx.db.get(args.artistId);

    if (!artist) {
      throw new Error("Artist not found");
    }

    const email = args.email.trim().toLowerCase();

    if (!email) {
      throw new Error("Email is required");
    }

    const existingInvites = await ctx.db
      .query("artistInvites")
      .withIndex("by_artist_email", (q) =>
        q
          .eq("artistId", args.artistId)
          .eq("email", email)
      )
      .collect();

    const pendingInvite = existingInvites.find(
      (invite) => invite.status === "pending"
    );

    if (pendingInvite) {
      throw new Error(
        "A pending invite already exists for this email"
      );
    }

    const inviteId = await ctx.db.insert(
      "artistInvites",
      {
        artistId: args.artistId,
        email,
        role: args.role,
        status: "pending",
        createdAt: Date.now(),
      }
    );

    return inviteId;
  },
});

// ==============================
// GET MY PENDING ARTIST INVITES
// ==============================

export const getMyPendingArtistInvites = query({
  args: {},

  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    if (!user || !user.email || !user.isVerified) {
      return [];
    }

    const email = user.email
      .trim()
      .toLowerCase();

    const invites = await ctx.db
      .query("artistInvites")
      .withIndex("by_email", (q) =>
        q.eq("email", email)
      )
      .collect();

    const pendingInvites = invites.filter(
      (invite) => invite.status === "pending"
    );

    return await Promise.all(
      pendingInvites.map(async (invite) => {
        const artist = await ctx.db.get(
          invite.artistId
        );

        return {
          ...invite,
          artist,
        };
      })
    );
  },
});

// ==============================
// ACCEPT ARTIST INVITE
// ==============================

export const acceptArtistInvite = mutation({
  args: {
    inviteId: v.id("artistInvites"),
  },

  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    if (!user.email) {
      throw new Error(
        "Your account does not have an email address"
      );
    }

    if (!user.isVerified) {
      throw new Error(
        "Your email address must be verified"
      );
    }

    const invite = await ctx.db.get(args.inviteId);

    if (!invite) {
      throw new Error("Invite not found");
    }

    if (invite.status !== "pending") {
      throw new Error("Invite is no longer active");
    }

    const userEmail = user.email
      .trim()
      .toLowerCase();

    const inviteEmail = invite.email
      .trim()
      .toLowerCase();

    if (userEmail !== inviteEmail) {
      throw new Error(
        "This invite belongs to a different email address"
      );
    }

    const artist = await ctx.db.get(
      invite.artistId
    );

    if (!artist) {
      throw new Error("Artist not found");
    }

    const existingMembership = await ctx.db
      .query("artistMembers")
      .withIndex("by_artist_user", (q) =>
        q
          .eq("artistId", invite.artistId)
          .eq("userId", user._id)
      )
      .unique();

    if (existingMembership) {
      if (existingMembership.isActive) {
        throw new Error(
          "You already have access to this artist"
        );
      }

      await ctx.db.patch(
        existingMembership._id,
        {
          role: invite.role,
          isActive: true,
        }
      );
    } else {
      await ctx.db.insert(
        "artistMembers",
        {
          artistId: invite.artistId,
          userId: user._id,
          role: invite.role,
          isActive: true,
          createdAt: Date.now(),
        }
      );
    }

    await ctx.db.patch(args.inviteId, {
      status: "accepted",
      acceptedAt: Date.now(),
    });

    return {
      success: true,
      artistId: invite.artistId,
      role: invite.role,
    };
  },
});

// ==============================
// GET MY ARTIST MEMBERSHIPS
// ==============================

export const getMyArtistMemberships = query({
  args: {},

  handler: async (ctx) => {
    const identity =
      await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    if (!user) {
      return [];
    }

    const memberships = await ctx.db
      .query("artistMembers")
      .withIndex("by_userId", (q) =>
        q.eq("userId", user._id)
      )
      .collect();

    const activeMemberships =
      memberships.filter(
        (membership) =>
          membership.isActive
      );

    return await Promise.all(
      activeMemberships.map(
        async (membership) => {
          const artist =
            await ctx.db.get(
              membership.artistId
            );

          return {
            ...membership,
            artist,
          };
        }
      )
    );
  },
});

// ==============================
// GET ARTIST MEMBERS
// PLATFORM ADMIN ONLY FOR NOW
// ==============================

export const getArtistMembers = query({
  args: {
    artistId: v.id("artists"),
  },

  handler: async (ctx, args) => {
    const identity =
      await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    if (!currentUser) {
      throw new Error("User not found");
    }

    if (
      currentUser.platformRole !== "admin"
    ) {
      throw new Error(
        "Platform admin access required"
      );
    }

    const members = await ctx.db
      .query("artistMembers")
      .withIndex("by_artistId", (q) =>
        q.eq("artistId", args.artistId)
      )
      .collect();

    return await Promise.all(
      members.map(async (membership) => {
        const user = await ctx.db.get(
          membership.userId
        );

        return {
          ...membership,
          user,
        };
      })
    );
  },
});

// ==============================
// REVOKE ARTIST INVITE
// PLATFORM ADMIN ONLY
// ==============================

export const revokeArtistInvite = mutation({
  args: {
    inviteId: v.id("artistInvites"),
  },

  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx);

    const invite = await ctx.db.get(
      args.inviteId
    );

    if (!invite) {
      throw new Error("Invite not found");
    }

    if (invite.status !== "pending") {
      throw new Error(
        "Only pending invites can be revoked"
      );
    }

    await ctx.db.patch(args.inviteId, {
      status: "revoked",
    });

    return {
      success: true,
    };
  },
});

// ==============================
// REMOVE ARTIST MEMBER
// PLATFORM ADMIN ONLY
// ==============================

export const removeArtistMember = mutation({
  args: {
    memberId: v.id("artistMembers"),
  },

  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx);

    const membership = await ctx.db.get(
      args.memberId
    );

    if (!membership) {
      throw new Error(
        "Artist membership not found"
      );
    }

    await ctx.db.patch(args.memberId, {
      isActive: false,
    });

    return {
      success: true,
    };
  },
});