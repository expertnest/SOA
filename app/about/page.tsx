"use client";

import {
  Headphones,
  Music2,
  Flame,
  Radio,
  Users,
  Sparkles,
  Globe,
  Instagram,
  Twitter,
  Youtube,
  ArrowUpRight,
  Play,
  ShoppingBag,
  Heart,
} from "lucide-react";

export default function About() {
  const stats = [
    { title: "Monthly Listeners", value: "18.4M", icon: Headphones },
    { title: "Total Streams", value: "742M", icon: Music2 },
    { title: "Global Rank", value: "#14", icon: Flame },
    { title: "Radio Plays", value: "128K", icon: Radio },
  ];

  const socials = [
    { name: "Instagram", icon: Instagram, handle: "@noxsounds" },
    { name: "YouTube", icon: Youtube, handle: "Nox Official" },
    { name: "Twitter / X", icon: Twitter, handle: "@noxsounds" },
  ];

  const merch = [
    { name: "Afterglow Hoodie", price: "$80", image: "/merch1.jpg" },
    { name: "Neon Drift Tee", price: "$45", image: "/merch2.jpg" },
    { name: "Static Vinyl", price: "$35", image: "/merch3.jpg" },
  ];

  const timeline = [
    { year: "2022", text: "Released debut project Static Dreams." },
    { year: "2023", text: "Neon Drift broke into global playlists." },
    { year: "2024", text: "Afterglow reached 300M+ streams." },
    { year: "2026", text: "Expanding into live shows & collaborations." },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[180px]" />
      </div>

      <div className="mx-auto max-w-6xl p-4 sm:p-6 flex flex-col gap-6">

        {/* HERO */}
        <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6 sm:p-10 relative overflow-hidden">

          <div className="absolute -top-20 -right-20 h-72 w-72 bg-cyan-500/10 blur-[120px]" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 bg-purple-500/10 blur-[120px]" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            {/* LEFT */}
            <div className="flex flex-col gap-4 max-w-2xl">

              <div className="flex items-center gap-2 text-cyan-300">
                <Sparkles size={16} />
                <p className="text-xs uppercase tracking-[0.3em]">
                  About The Artist
                </p>
              </div>

              <h1 className="text-5xl sm:text-7xl font-black tracking-tight">
                Nox
              </h1>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                Nox is a cinematic electronic artist blending ambient textures,
                futuristic trap, and late-night emotional soundscapes. Built for
                introspection, motion, and neon-lit worlds.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">

                <button className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-bold text-black flex items-center gap-2">
                  <Play size={16} fill="black" />
                  Listen Now
                </button>

                <button className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm">
                  Contact / Booking
                </button>

              </div>

            </div>

            {/* RIGHT IMAGE */}
            <div className="relative w-full sm:w-[280px]">

              <div className="rounded-3xl overflow-hidden border border-white/10">
                <img
                  src="/headerLogo.png"
                  className="h-[320px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              </div>

            </div>

          </div>

          {/* STATS */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">

            {stats.map((s, i) => {
              const Icon = s.icon;

              return (
                <div
                  key={i}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
                >

                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-2xl bg-cyan-500/10 text-cyan-300">
                      <Icon size={18} />
                    </div>

                    <ArrowUpRight size={14} className="text-zinc-600" />
                  </div>

                  <p className="mt-4 text-2xl font-black">{s.value}</p>
                  <p className="text-xs text-zinc-500">{s.title}</p>

                </div>
              );
            })}

          </div>
        </div>

        {/* BIO + TIMELINE */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* BIO */}
          <div className="rounded-[34px] border border-white/10 bg-zinc-950 p-6">

            <div className="flex items-center gap-2 text-purple-300">
              <Globe size={16} />
              <p className="text-xs uppercase tracking-[0.3em]">
                Biography
              </p>
            </div>

            <h2 className="mt-3 text-3xl font-bold">Story</h2>

            <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
              Emerging from underground electronic scenes, Nox built a signature
              sound around emotional synth design, atmospheric bass, and cinematic
              progression. Every release is designed as a “scene,” not just a song.
            </p>

            <p className="mt-4 text-sm text-zinc-400">
              Influenced by ambient, trap, future bass, and film scores, the project
              continues evolving into live audiovisual performances and immersive sets.
            </p>

          </div>

          {/* TIMELINE */}
          <div className="rounded-[34px] border border-white/10 bg-zinc-950 p-6">

            <div className="flex items-center gap-2 text-cyan-300">
              <Users size={16} />
              <p className="text-xs uppercase tracking-[0.3em]">
                Journey
              </p>
            </div>

            <h2 className="mt-3 text-3xl font-bold">Timeline</h2>

            <div className="mt-6 flex flex-col gap-4">

              {timeline.map((t, i) => (
                <div
                  key={i}
                  className="flex gap-4 border-l border-white/10 pl-4"
                >
                  <div className="text-cyan-300 font-bold">{t.year}</div>
                  <div className="text-sm text-zinc-300">{t.text}</div>
                </div>
              ))}

            </div>

          </div>

        </div>

        {/* MERCH */}
        <div className="rounded-[34px] border border-white/10 bg-zinc-950 p-6">

          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Merch</h2>

            <button className="text-sm px-4 py-2 rounded-full border border-white/10 bg-white/5">
              View Store
            </button>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-4">

            {merch.map((m, i) => (
              <div
                key={i}
                className="group rounded-3xl border border-white/10 overflow-hidden bg-zinc-900/40"
              >

                <div className="relative">
                  <img
                    src={m.image}
                    className="h-52 w-full object-cover group-hover:scale-105 transition"
                  />

                  <button className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full text-sm opacity-0 group-hover:opacity-100 transition flex items-center gap-2">
                    <ShoppingBag size={14} />
                    Buy
                  </button>
                </div>

                <div className="p-4">
                  <p className="font-medium">{m.name}</p>
                  <p className="text-cyan-300 text-sm">{m.price}</p>
                </div>

              </div>
            ))}

          </div>

        </div>

        {/* SOCIALS */}
        <div className="rounded-[34px] border border-white/10 bg-zinc-950 p-6">

          <h2 className="text-3xl font-bold">Socials</h2>

          <div className="mt-6 grid sm:grid-cols-3 gap-4">

            {socials.map((s, i) => {
              const Icon = s.icon;

              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                >

                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-cyan-300" />
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-zinc-500">{s.handle}</p>
                    </div>
                  </div>

                  <ArrowUpRight size={16} className="text-zinc-500" />

                </div>
              );
            })}

          </div>

          <div className="mt-6 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-5">

            <div className="flex items-center gap-2 text-cyan-300">
              <Heart size={16} />
              <p className="text-sm font-semibold">
                Join the Community
              </p>
            </div>

            <p className="mt-2 text-sm text-zinc-300">
              Exclusive drops, early releases, behind-the-scenes sessions,
              and private updates.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}