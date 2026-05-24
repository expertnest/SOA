"use client";

import { useState, useEffect } from "react";
import {
  Play,
  Clock3,
  Flame,
  Eye,
  ThumbsUp,
  ArrowUpRight,
  X,
  Sparkles,
} from "lucide-react";

export default function Videos() {
  const [sort, setSort] = useState("popular");
  const [activeVideo, setActiveVideo] = useState<any>(null);

  const videos = [
    {
      title: "Neon Nights (Official Video)",
      year: 2024,
      views: 42000000,
      likes: 1200000,
      thumbnail: "/vid1.jpg",
      src: "/video1.mp4",
    },
    {
      title: "Afterglow (Short Film)",
      year: 2023,
      views: 28000000,
      likes: 890000,
      thumbnail: "/vid2.jpg",
      src: "/video2.mp4",
    },
    {
      title: "Static Dreams Visualizer",
      year: 2022,
      views: 18000000,
      likes: 640000,
      thumbnail: "/vid3.jpg",
      src: "/video3.mp4",
    },
    {
      title: "Live @ Tokyo",
      year: 2024,
      views: 12000000,
      likes: 510000,
      thumbnail: "/vid4.jpg",
      src: "/video4.mp4",
    },
  ];

  const merch = [
    { name: "Neon Hoodie", price: "$80", img: "/m1.jpg" },
    { name: "Tour Tee", price: "$45", img: "/m2.jpg" },
    { name: "Vinyl LP", price: "$35", img: "/m3.jpg" },
    { name: "Cap", price: "$30", img: "/m4.jpg" },
  ];

  const sortedVideos = [...videos].sort((a, b) => {
    if (sort === "popular") return b.views - a.views;
    if (sort === "newest") return b.year - a.year;
    if (sort === "liked") return b.likes - a.likes;
    return 0;
  });

  const stats = [
    { title: "Total Views", value: "1.2B", icon: Eye },
    { title: "Subscribers", value: "8.4M", icon: Flame },
    { title: "Avg Watch Time", value: "5.2m", icon: Clock3 },
    { title: "Engagement", value: "92%", icon: ThumbsUp },
  ];

  // ESC close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pb-24">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[180px]" />
      </div>

      <div className="mx-auto max-w-7xl p-4 sm:p-6 flex flex-col gap-5 sm:gap-6">

        {/* HERO */}
        <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-zinc-950 to-black p-4 sm:p-6">
          <div className="grid gap-5 sm:gap-6 xl:grid-cols-[1.2fr_0.8fr]">

            <div className="flex flex-col gap-4 sm:gap-5">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black">Videos</h1>

              <p className="text-zinc-400 max-w-xl text-sm sm:text-base">
                Cinematic visuals, official music videos, and immersive storytelling.
              </p>

              <button className="rounded-full bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-black font-bold flex items-center gap-2 text-sm sm:text-base w-fit">
                <Play size={16} fill="black" />
                Play All
              </button>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.03] p-3 sm:p-4">
                      <div className="flex justify-between">
                        <div className="bg-cyan-500/10 p-1.5 sm:p-2 rounded-lg text-cyan-300">
                          <Icon size={16} />
                        </div>
                        <ArrowUpRight size={12} className="text-zinc-600" />
                      </div>
                      <h3 className="mt-3 text-lg sm:text-2xl font-black">{stat.value}</h3>
                      <p className="text-[10px] sm:text-xs text-zinc-500">{stat.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FEATURED */}
            <div
              onClick={() => setActiveVideo(videos[0])}
              className="cursor-pointer rounded-3xl overflow-hidden border border-white/10 relative group h-[220px] sm:h-auto"
            >
              <img src={videos[0].thumbnail} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-base sm:text-xl font-bold">{videos[0].title}</h2>
                <div className="text-xs text-zinc-400 mt-1">{videos[0].year}</div>
              </div>
            </div>

          </div>
        </div>

        {/* SORT */}
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          {["popular", "newest", "liked"].map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm ${
                sort === s ? "bg-white text-black" : "bg-white/5 border border-white/10"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {sortedVideos.map((video, i) => (
            <div
              key={i}
              onClick={() => setActiveVideo(video)}
              className="cursor-pointer group rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/60"
            >
              <img src={video.thumbnail} className="h-40 sm:h-48 w-full object-cover" />
              <div className="p-3">
                <h3 className="font-semibold text-sm sm:text-base">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* LOWER GRID (UNCHANGED EXACTLY) */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.75fr]">

          {/* MERCH */}
          <div className="overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-zinc-950 to-black">

            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Store</p>
                <h2 className="mt-1 text-3xl font-black">Merch</h2>
              </div>
              <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10">
                View All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 sm:p-5">
              {merch.map((item, i) => (
                <div key={i} className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 transition hover:-translate-y-1 hover:border-cyan-500/40">
                  <div className="relative overflow-hidden">
                    <img src={item.img} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
                    <button className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black opacity-0 transition group-hover:opacity-100">
                      Buy
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="font-medium">{item.name}</p>
                    <p className="mt-1 text-sm text-cyan-300">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SOCIAL + COMMUNITY */}
          <div className="overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-zinc-950 to-black">

            <div className="border-b border-white/10 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Social Feed</p>
                  <h2 className="mt-1 text-3xl font-black">Instagram</h2>
                </div>
                <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10">
                  @noxsounds
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="flex min-w-max gap-4 p-4 sm:p-5">
                {["/ig1.jpg", "/ig2.jpg", "/ig3.jpg", "/ig4.jpg"].map((img, i) => (
                  <div key={i} className="w-[190px] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60">
                    <img src={img} className="h-[240px] w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 p-5">
              <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Sparkles size={16} />
                  <p className="text-sm font-semibold">Fan Community</p>
                </div>

                <p className="mt-3 text-sm text-zinc-300">
                  Exclusive demos, early merch drops, unreleased content, and private livestreams.
                </p>

                <button className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black">
                  Join Community
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* MODAL */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 z-10 rounded-full bg-white/10 p-2 hover:bg-white/20"
            >
              <X size={18} />
            </button>

            <video
              src={activeVideo.src}
              controls
              autoPlay
              className="w-full max-h-[75vh] bg-black"
            />

            <div className="p-4 border-t border-white/10">
              <h3 className="text-lg font-bold">{activeVideo.title}</h3>
              <p className="text-xs text-zinc-400">{activeVideo.year}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}