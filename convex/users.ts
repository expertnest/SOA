import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { UserJSON } from "@clerk/backend";

// ==============================
// UPSERT USER (Clerk Webhook - INTERNAL ONLY)
// ==============================
export const upsertFromClerk = internalMutation({
  args: {
    data: v.any(),
  },

  handler: async (ctx, { data }: { data: UserJSON }) => {
    const now = Date.now();

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", data.id)
      )
      .unique();

    const email = data.email_addresses?.[0]?.email_address ?? "";

    const userData = {
      clerkId: data.id,

      username: data.username || email || data.id,

      displayName:
        `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() ||
        data.username ||
        "Unknown User",

      email,
      avatar: data.image_url || "",
      countryCode: "US",

      plan: "free" as const,

      totalListeningTime: 0,
      totalPlays: 0,
      totalSkips: 0,
      totalReplays: 0,

      sessionCount: 0,
      averageSessionDuration: 0,

      skipRate: 0,
      replayRate: 0,
      superfanScore: 0,
      engagementLevel: "casual" as const,

      lifetimeValue: 0,

      affinityTags: [],
      favoriteArtistIds: [],
      mostListenedSongIds: [],

      isOnline: false,
      isBanned: false,
      isVerified: false,

      lastActiveAt: now,
      createdAt: now,

      streakDays: 0,
      loyaltyIndex: 0,
    };

    if (!existingUser) {
      await ctx.db.insert("users", userData);
      return;
    }

    await ctx.db.patch(existingUser._id, {
      username: userData.username,
      displayName: userData.displayName,
      email: userData.email,
      avatar: userData.avatar,
      lastActiveAt: now,
    });
  },
});

// ==============================
// GET USER (FRONTEND SAFE)
// ==============================
export const getByClerkId = query({
  args: {
    clerkId: v.string(),
  },

  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", clerkId)
      )
      .unique();
  },
});

// ==============================
// UPDATE PROFILE (FRONTEND SAFE FIX)
// ==============================
export const updateProfile = mutation({
  args: {
    clerkId: v.string(),
    displayName: v.string(),
    username: v.string(),
    email: v.string(),
    avatar: v.string(),
    countryCode: v.string(),
  },

  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", args.clerkId)
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      displayName: args.displayName,
      username: args.username,
      email: args.email,
      avatar: args.avatar,
      countryCode: args.countryCode,
      lastActiveAt: Date.now(),
    });

    return user._id;
  },
});

// ==============================
// DELETE USER (Clerk webhook - INTERNAL)
// ==============================
export const deleteFromClerk = internalMutation({
  args: {
    clerkUserId: v.string(),
  },

  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", clerkUserId)
      )
      .unique();

    if (!user) return;

    await ctx.db.delete(user._id);
  },
});

// ==============================
// GET CURRENT USER (Clerk → Convex _id)
// ==============================
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    // not logged in
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    return user ?? null;
  },
});