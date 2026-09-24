"use node";

import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// ==============================
// 🔥 R2 CLIENT
// ==============================

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// ==============================
// 🧹 SAFE FILE NAME
// ==============================

function sanitizeFileName(fileName: string) {
  return fileName
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");
}

// ==============================
// 🧹 SAFE FOLDER NAME
// ==============================

function sanitizeFolderName(value: string) {
  const safe = value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return safe || "untitled";
}

// ==============================
// 📦 RELEASE TYPE FOLDER
// ==============================

type ReleaseType = "single" | "album" | "ep" | "mixtape";

function getReleaseTypeFolder(type: ReleaseType) {
  switch (type) {
    case "single":
      return "singles";
    case "album":
      return "albums";
    case "ep":
      return "eps";
    case "mixtape":
      return "mixtapes";
  }
}

// ==============================
// 📁 BUILD RELEASE PATH
// ==============================

function buildReleasePath(args: {
  artistId: string;
  artistSlug: string;
  projectId: string;
  projectName: string;
  releaseType: ReleaseType;
  releaseYear: number;
  catalogNumber: string;
}) {
  const artistFolder =
    `${args.artistSlug}--${args.artistId}`;

  const releaseTypeFolder =
    getReleaseTypeFolder(args.releaseType);

  const projectFolder =
    `${args.catalogNumber}--${sanitizeFolderName(args.projectName)}--${args.projectId}`;

  return [
    "artists",
    artistFolder,
    "releases",
    releaseTypeFolder,
    String(args.releaseYear),
    projectFolder,
  ].join("/");
}

// ==============================
// 🎵 CREATE AUDIO UPLOAD URL
// ==============================

export const getAudioUploadUrl = action({
  args: {
    artistId: v.id("artists"),

    projectId: v.id("projects"),
    projectName: v.string(),

    releaseType: v.union(
      v.literal("single"),
      v.literal("album"),
      v.literal("ep"),
      v.literal("mixtape")
    ),

    releaseYear: v.number(),
    catalogNumber: v.string(),

    fileName: v.string(),
    contentType: v.string(),
  },

  handler: async (ctx, args) => {
    const artist = await ctx.runQuery(api.artists.getArtist, {
      id: args.artistId,
    });

    if (!artist) {
      throw new Error("Artist not found");
    }

    const safeName = sanitizeFileName(args.fileName);

    const releasePath = buildReleasePath({
      artistId: args.artistId,
      artistSlug: artist.slug,
      projectId: args.projectId,
      projectName: args.projectName,
      releaseType: args.releaseType,
      releaseYear: args.releaseYear,
      catalogNumber: args.catalogNumber,
    });

    const key =
      `${releasePath}/tracks/${crypto.randomUUID()}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: args.contentType,
    });

    const uploadUrl = await getSignedUrl(R2, command, {
      expiresIn: 15 * 60,
    });

    const publicUrl =
      `${process.env.R2_PUBLIC_URL}/${key}`;

    return {
      uploadUrl,
      publicUrl,
      key,
    };
  },
});

// ==============================
// 🖼️ CREATE ARTWORK UPLOAD URL
// ==============================

export const getImageUploadUrl = action({
  args: {
    artistId: v.id("artists"),

    projectId: v.id("projects"),
    projectName: v.string(),

    releaseType: v.union(
      v.literal("single"),
      v.literal("album"),
      v.literal("ep"),
      v.literal("mixtape")
    ),

    releaseYear: v.number(),
    catalogNumber: v.string(),

    fileName: v.string(),
    contentType: v.string(),
  },

  handler: async (ctx, args) => {
    const artist = await ctx.runQuery(api.artists.getArtist, {
      id: args.artistId,
    });

    if (!artist) {
      throw new Error("Artist not found");
    }

    const safeName = sanitizeFileName(args.fileName);

    const releasePath = buildReleasePath({
      artistId: args.artistId,
      artistSlug: artist.slug,
      projectId: args.projectId,
      projectName: args.projectName,
      releaseType: args.releaseType,
      releaseYear: args.releaseYear,
      catalogNumber: args.catalogNumber,
    });

    const key =
      `${releasePath}/artwork/${crypto.randomUUID()}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: args.contentType,
    });

    const uploadUrl = await getSignedUrl(R2, command, {
      expiresIn: 15 * 60,
    });

    const publicUrl =
      `${process.env.R2_PUBLIC_URL}/${key}`;

    return {
      uploadUrl,
      publicUrl,
      key,
    };
  },
});