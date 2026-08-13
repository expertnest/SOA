"use client";

import { useState } from "react";
import {
  User,
  Image as ImageIcon,
  Loader2,
  UploadCloud,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function CreateArtistPage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // CONVEX
  // =========================

  const createArtist = useMutation(
    api.artists.createArtist
  );

  const uploadImage = useAction(
    api.storage.uploadImage
  );

  const inputClass = `
    w-full rounded-2xl border border-white/10 bg-white/[0.04]
    px-5 py-4 text-white placeholder:text-white/30 outline-none
    transition-all focus:border-purple-500/50 focus:bg-white/[0.07]
  `;

  // =========================
  // IMAGE PREVIEW
  // =========================

  const handleImage = (file: File) => {
    setImageFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // =========================
  // CREATE ARTIST
  // =========================

  const handleCreateArtist = async () => {
    if (!name.trim()) {
      alert("Enter an artist name.");
      return;
    }

    setLoading(true);

    try {
      // =========================
      // 1. UPLOAD IMAGE TO R2
      // =========================

      let imageUrl: string | undefined;

      if (imageFile) {
        console.log(
          "📤 Uploading artist image to R2..."
        );

        const buffer =
          await imageFile.arrayBuffer();

        const uploaded =
          await uploadImage({
            file: buffer,
            fileName: imageFile.name,
            contentType: imageFile.type,
          });

        imageUrl = uploaded.url;

        console.log(
          "✅ Artist image uploaded:",
          imageUrl
        );
      }

      // =========================
      // 2. CREATE ARTIST IN CONVEX
      // =========================

      console.log(
        "🎤 Creating artist in Convex..."
      );

      const artistId =
        await createArtist({
          name: name.trim(),
          bio: bio.trim() || undefined,
          image: imageUrl,
        });

      console.log(
        "✅ ARTIST CREATED:",
        artistId
      );

      // =========================
      // 3. RESET FORM
      // =========================

      setName("");
      setBio("");
      setImageFile(null);
      setImagePreview("");

      alert("Artist created successfully.");

    } catch (err) {
      console.error(
        "❌ CREATE ARTIST FAILED:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Failed to create artist."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* 🔥 Glow Background */}

      <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[160px]" />

      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[160px]" />

      <div className="relative mx-auto max-w-6xl px-6 py-12">

        {/* HEADER */}

        <div className="mb-10">

          <div className="mb-3 flex items-center gap-2 text-sm text-purple-400">
            <Sparkles size={16} />
            Artist Management
          </div>

          <h1 className="text-5xl font-bold tracking-tight">
            Create Artist
          </h1>

          <p className="mt-3 max-w-xl text-white/50">
            Add a new artist to your label and start
            building their catalog.
          </p>

        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="grid gap-8 lg:grid-cols-[380px_1fr]"
        >

          {/* =========================
              LEFT SIDE
          ========================= */}

          <div className="space-y-6">

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">

              <h2 className="mb-4 text-sm text-white/50">
                Artist Image
              </h2>

              <label className="relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-white/20 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 transition hover:border-purple-400/50">

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="artist"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center">

                    <ImageIcon
                      size={45}
                      className="mx-auto mb-4 text-white/40"
                    />

                    <p className="font-medium">
                      Upload Image
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      PNG, JPG, WEBP
                    </p>

                  </div>
                )}

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file =
                      e.target.files?.[0];

                    if (file) {
                      handleImage(file);
                    }
                  }}
                />

              </label>

            </div>

          </div>

          {/* =========================
              RIGHT SIDE
          ========================= */}

          <div className="space-y-8 rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">

            {/* BASIC INFO */}

            <section className="space-y-4">

              <div className="relative">

                <User
                  size={18}
                  className="absolute left-4 top-4 text-white/40"
                />

                <input
                  className={`${inputClass} pl-12`}
                  placeholder="Artist name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </div>

              <textarea
                className={`${inputClass} h-32 resize-none`}
                placeholder="Artist bio"
                value={bio}
                onChange={(e) =>
                  setBio(e.target.value)
                }
              />

            </section>

            {/* SUBMIT */}

            <button
              onClick={handleCreateArtist}
              disabled={loading}
              className="
                flex w-full items-center justify-center gap-3
                rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500
                py-4 font-semibold transition hover:scale-[1.01]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UploadCloud size={18} />
                  Create Artist
                </>
              )}

            </button>

          </div>

        </motion.div>

      </div>

    </div>
  );
}