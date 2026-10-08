"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// ==============================
// R2 CLIENT
// ==============================

const R2 = new S3Client({
  region: "auto",

  endpoint:
    `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,

  credentials: {
    accessKeyId:
      process.env.R2_ACCESS_KEY_ID!,

    secretAccessKey:
      process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// ==============================
// SAFE FILE NAME
// ==============================

function sanitizeFileName(
  fileName: string
) {
  return fileName
    .replace(/\s+/g, "-")
    .replace(
      /[^a-zA-Z0-9._-]/g,
      ""
    );
}

// ==============================
// SAFE FOLDER NAME
// ==============================

function sanitizeFolderName(
  value: string
) {
  const safe = value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(
      /[^a-z0-9_-]/g,
      ""
    )
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return safe || "untitled";
}

// ==============================
// RELEASE TYPES
// ==============================

type ReleaseType =
  | "single"
  | "album"
  | "ep"
  | "mixtape";

function getReleaseTypeFolder(
  type: ReleaseType
) {
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
// BUILD RELEASE PATH
// ==============================

function buildReleasePath(args: {
  artistId: string;
  artistSlug: string;

  projectId: string;
  projectName: string;

  releaseType:
    ReleaseType;

  releaseYear:
    number;

  catalogNumber:
    string;
}) {
  const artistFolder =
    `${args.artistSlug}--${args.artistId}`;

  const releaseTypeFolder =
    getReleaseTypeFolder(
      args.releaseType
    );

  const projectFolder =
    `${args.catalogNumber}--${sanitizeFolderName(
      args.projectName
    )}--${args.projectId}`;

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
// CONTENT TYPE VALIDATION
// ==============================

const AUDIO_TYPES =
  new Set([
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/mp4",
    "audio/x-m4a",
    "audio/aac",
    "audio/flac",
    "audio/x-flac",
  ]);

const IMAGE_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

// ==============================
// GET AUTHORIZED CONTEXT
// ==============================

async function getUploadContext(
  ctx: any,
  projectId: any
) {
  const identity =
    await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error(
      "Not authenticated"
    );
  }

  return await ctx.runQuery(
    internal.storageAccess
      .getAuthorizedReleaseUploadContext,
    {
      clerkId:
        identity.subject,

      projectId,
    }
  );
}

// ==============================
// CREATE AUDIO UPLOAD URL
// ==============================

export const getAudioUploadUrl =
  action({
    args: {
      // Kept temporarily so the
      // current uploader does not
      // need to change yet.
      artistId:
        v.id("artists"),

      projectId:
        v.id("projects"),

      projectName:
        v.string(),

      releaseType:
        v.union(
          v.literal("single"),
          v.literal("album"),
          v.literal("ep"),
          v.literal("mixtape")
        ),

      releaseYear:
        v.number(),

      catalogNumber:
        v.string(),

      fileName:
        v.string(),

      contentType:
        v.string(),
    },

    handler: async (
      ctx,
      args
    ) => {
      // ==========================
      // AUTHORIZE + GET TRUSTED
      // PROJECT DATA
      // ==========================

      const release =
        await getUploadContext(
          ctx,
          args.projectId
        );

      // ==========================
      // VALIDATE AUDIO
      // ==========================

      if (
        !AUDIO_TYPES.has(
          args.contentType
        )
      ) {
        throw new Error(
          "Unsupported audio file type"
        );
      }

      const safeName =
        sanitizeFileName(
          args.fileName
        ) || "audio-file";

      // ==========================
      // BUILD SERVER-TRUSTED PATH
      // ==========================

      const releasePath =
        buildReleasePath({
          artistId:
            release.artistId,

          artistSlug:
            release.artistSlug,

          projectId:
            release.projectId,

          projectName:
            release.projectName,

          releaseType:
            release.releaseType,

          releaseYear:
            release.releaseYear,

          catalogNumber:
            release.catalogNumber,
        });

      const key =
        `${releasePath}/tracks/${crypto.randomUUID()}-${safeName}`;

      const command =
        new PutObjectCommand({
          Bucket:
            process.env
              .R2_BUCKET_NAME!,

          Key:
            key,

          ContentType:
            args.contentType,
        });

      const uploadUrl =
        await getSignedUrl(
          R2,
          command,
          {
            expiresIn:
              15 * 60,
          }
        );

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
// CREATE ARTWORK UPLOAD URL
// ==============================

export const getImageUploadUrl =
  action({
    args: {
      // Kept temporarily so the
      // current uploader does not
      // need to change yet.
      artistId:
        v.id("artists"),

      projectId:
        v.id("projects"),

      projectName:
        v.string(),

      releaseType:
        v.union(
          v.literal("single"),
          v.literal("album"),
          v.literal("ep"),
          v.literal("mixtape")
        ),

      releaseYear:
        v.number(),

      catalogNumber:
        v.string(),

      fileName:
        v.string(),

      contentType:
        v.string(),
    },

    handler: async (
      ctx,
      args
    ) => {
      // ==========================
      // AUTHORIZE + GET TRUSTED
      // PROJECT DATA
      // ==========================

      const release =
        await getUploadContext(
          ctx,
          args.projectId
        );

      // ==========================
      // VALIDATE IMAGE
      // ==========================

      if (
        !IMAGE_TYPES.has(
          args.contentType
        )
      ) {
        throw new Error(
          "Artwork must be JPG, PNG, or WEBP"
        );
      }

      const safeName =
        sanitizeFileName(
          args.fileName
        ) || "artwork";

      // ==========================
      // BUILD SERVER-TRUSTED PATH
      // ==========================

      const releasePath =
        buildReleasePath({
          artistId:
            release.artistId,

          artistSlug:
            release.artistSlug,

          projectId:
            release.projectId,

          projectName:
            release.projectName,

          releaseType:
            release.releaseType,

          releaseYear:
            release.releaseYear,

          catalogNumber:
            release.catalogNumber,
        });

      const key =
        `${releasePath}/artwork/${crypto.randomUUID()}-${safeName}`;

      const command =
        new PutObjectCommand({
          Bucket:
            process.env
              .R2_BUCKET_NAME!,

          Key:
            key,

          ContentType:
            args.contentType,
        });

      const uploadUrl =
        await getSignedUrl(
          R2,
          command,
          {
            expiresIn:
              15 * 60,
          }
        );

      const publicUrl =
        `${process.env.R2_PUBLIC_URL}/${key}`;

      return {
        uploadUrl,
        publicUrl,
        key,
      };
    },
  });