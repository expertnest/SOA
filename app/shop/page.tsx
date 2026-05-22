"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Flame,
  Star,
  Package,
  ArrowUpRight,
  Play,
} from "lucide-react";

export default function Merch() {
  const [filter, setFilter] = useState("all");

  const merch = [
    { name: "Neon Hoodie", price: "$80", image: "/m1.jpg", type: "apparel" },
    { name: "Tour Tee", price: "$45", image: "/m2.jpg", type: "apparel" },
    { name: "Vinyl LP", price: "$35", image: "/m3.jpg", type: "music" },
    { name: "Cap", price: "$30", image: "/m4.jpg", type: "accessory" },
    { name: "Poster Pack", price: "$25", image: "/m5.jpg", type: "collectible" },
    { name: "Limited Jacket", price: "$120", image: "/m6.jpg", type: "apparel" },
  ];

  const videos = [
    { title: "Neon Nights", thumbnail: "/vid1.jpg" },
    { title: "Afterglow", thumbnail: "/vid2.jpg" },
    { title: "Static Dreams", thumbnail: "/vid3.jpg" },
  ];

  const stats = [
    { title: "Products", value: "48", icon: Package },
    { title: "Drops", value: "12", icon: Flame },
    { title: "Top Rated", value: "4.9★", icon: Star },
    { title: "Orders", value: "25K+", icon: ShoppingBag },
  ];

  const filtered = merch.filter(
    (item) => filter === "all" || item.type === filter
  );

  return (
    <div className="min-h-screen bg-black text-white pb-24">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[180px]" />
      </div>

      <div className="mx-auto max-w-7xl p-4 sm:p-6 flex flex-col gap-6">

        {/* HERO */}
        <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-zinc-950 to-black p-4 sm:p-6">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

            <div className="flex flex-col gap-5">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black">
                Merch
              </h1>

              <p className="text-zinc-400 max-w-xl text-sm sm:text-base">
                Limited drops, exclusive designs, and official releases.
              </p>

              <button className="rounded-full bg-white px-5 py-3 text-black font-bold w-fit">
                Shop Now
              </button>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex justify-between">
                        <div className="bg-cyan-500/10 p-2 rounded-xl text-cyan-300">
                          <Icon size={18} />
                        </div>
                        <ArrowUpRight size={14} className="text-zinc-600" />
                      </div>
                      <h3 className="mt-4 text-2xl font-black">{stat.value}</h3>
                      <p className="text-xs text-zinc-500">{stat.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FEATURED PRODUCT */}
            <div className="rounded-3xl overflow-hidden border border-white/10 relative group h-[220px] sm:h-auto">
              <img src="/m1.jpg" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-xl font-bold">Neon Hoodie</h2>
                <p className="text-xs text-zinc-400 mt-1">Limited Drop</p>
              </div>
            </div>

          </div>
        </div>

        {/* FILTERS */}
        <div className="flex gap-3 flex-wrap">
          {["all", "apparel", "music", "accessory", "collectible"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm ${
                filter === f
                  ? "bg-white text-black"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item, i) => (
            <div
              key={i}
              className="group rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/60 hover:-translate-y-1 transition"
            >
              <div className="relative">
                <img src={item.image} className="h-56 w-full object-cover" />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                  <button className="bg-white text-black px-5 py-2 rounded-full font-semibold">
                    Buy
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-cyan-300 mt-1">{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* MUSIC VIDEOS (INSTEAD OF SOCIALS) */}
        <div className="mt-10 rounded-[34px] border border-white/10 bg-gradient-to-br from-zinc-950 to-black">

          <div className="border-b border-white/10 p-5">
            <h2 className="text-3xl font-black">Music Videos</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
            {videos.map((video, i) => (
              <div
                key={i}
                className="group rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/60"
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    className="h-48 w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                    <Play size={28} />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}