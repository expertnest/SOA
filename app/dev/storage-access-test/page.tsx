"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export default function StorageAccessTestPage() {
  const getAudioUploadUrl = useAction(
    api.storage.getAudioUploadUrl
  );

  const [projectId, setProjectId] = useState("");
  const [artistId, setArtistId] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testAccess = async () => {
    if (!projectId.trim() || !artistId.trim()) {
      setResult("Enter projectId and artistId.");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const response = await getAudioUploadUrl({
        projectId:
          projectId.trim() as Id<"projects">,

        artistId:
          artistId.trim() as Id<"artists">,

        // These are still required by the current
        // action signature, but storage.ts now derives
        // the trusted values from the project itself.
        projectName: "security-test",
        releaseType: "single",
        releaseYear: 2026,
        catalogNumber: "SECURITY-TEST",

        fileName: "security-test.mp3",
        contentType: "audio/mpeg",
      });

      setResult(
        `✅ ALLOWED\nR2 key: ${response.key}`
      );
    } catch (error) {
      setResult(
        `❌ BLOCKED\n${
          error instanceof Error
            ? error.message
            : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-xl space-y-6">

        <div>
          <h1 className="text-2xl font-semibold">
            Storage Access Test
          </h1>

          <p className="mt-2 text-sm text-white/50">
            Temporary development page for testing
            R2 authorization.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Mac808 Artist ID
          </label>

          <input
            value={artistId}
            onChange={(e) =>
              setArtistId(e.target.value)
            }
            placeholder="Paste artist _id"
            className="w-full rounded-lg border border-white/10 bg-white/5 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Mac808 Project ID
          </label>

          <input
            value={projectId}
            onChange={(e) =>
              setProjectId(e.target.value)
            }
            placeholder="Paste project _id"
            className="w-full rounded-lg border border-white/10 bg-white/5 p-3"
          />
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={testAccess}
          className="rounded-lg bg-white px-5 py-3 font-medium text-black disabled:opacity-50"
        >
          {loading
            ? "Testing..."
            : "Test R2 Access"}
        </button>

        {result && (
          <pre className="whitespace-pre-wrap rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
            {result}
          </pre>
        )}

      </div>
    </main>
  );
}