"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  Ticket,
  Flame,
  Users,
  Globe,
  ArrowUpRight,
} from "lucide-react";

export default function Tour() {
  const [filter, setFilter] = useState("upcoming");

  const shows = [
    {
      city: "Los Angeles, CA",
      venue: "Hollywood Palladium",
      date: "Aug 12, 2026",
      status: "selling",
    },
    {
      city: "New York, NY",
      venue: "Brooklyn Steel",
      date: "Aug 18, 2026",
      status: "sold",
    },
    {
      city: "Chicago, IL",
      venue: "Aragon Ballroom",
      date: "Aug 25, 2026",
      status: "selling",
    },
    {
      city: "London, UK",
      venue: "O2 Forum",
      date: "Sep 2, 2026",
      status: "limited",
    },
  ];

  const stats = [
    { title: "Shows", value: "48", icon: Calendar },
    { title: "Cities", value: "32", icon: MapPin },
    { title: "Fans", value: "120K+", icon: Users },
    { title: "Countries", value: "12", icon: Globe },
  ];

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

            {/* LEFT */}
            <div className="flex flex-col gap-5">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black">
                Tour
              </h1>

              <p className="text-zinc-400 max-w-xl text-sm sm:text-base">
                Live shows, global stages, and unforgettable nights.
                Catch the next experience near you.
              </p>

              <button className="rounded-full bg-white px-5 py-3 text-black font-bold flex items-center gap-2 w-fit">
                <Ticket size={16} />
                Get Tickets
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

            {/* FEATURED TOUR */}
            <div className="rounded-3xl overflow-hidden border border-white/10 relative group h-[220px] sm:h-auto">
              <img
                src="/tour.jpg"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-xl font-bold">
                  World Tour 2026
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  North America • Europe • Asia
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* FILTER */}
        <div className="flex gap-3 flex-wrap">
          {["upcoming", "past"].map((f) => (
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

        {/* SHOW LIST */}
        <div className="grid gap-4">

          {shows.map((show, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-zinc-900/60 p-4 hover:-translate-y-1 transition"
            >

              <div>
                <h3 className="text-lg font-semibold">
                  {show.city}
                </h3>
                <p className="text-sm text-zinc-400">
                  {show.venue}
                </p>
              </div>

              <div className="text-sm text-zinc-400">
                {show.date}
              </div>

              <div className="flex items-center gap-3">

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    show.status === "sold"
                      ? "bg-red-500/20 text-red-400"
                      : show.status === "limited"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {show.status === "sold"
                    ? "Sold Out"
                    : show.status === "limited"
                    ? "Limited"
                    : "Tickets"}
                </span>

                <button className="rounded-full bg-white px-4 py-2 text-black text-sm font-semibold hover:scale-105 transition">
                  Buy
                </button>

              </div>
            </div>
          ))}

        </div>

        {/* LOWER GRID */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.75fr]">

          {/* TOUR MERCH */}
          <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-zinc-950 to-black p-6">
            <h2 className="text-3xl font-black mb-4">Tour Merch</h2>
            <p className="text-zinc-400 text-sm">
              Exclusive drops only available on tour.
            </p>
          </div>

          {/* FAN CTA */}
          <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-zinc-950 to-black p-6">
            <h2 className="text-3xl font-black mb-4">VIP Access</h2>
            <p className="text-zinc-400 text-sm">
              Meet & greet, backstage passes, and early entry.
            </p>

            <button className="mt-4 rounded-full bg-white px-5 py-2 text-black text-sm font-semibold">
              Upgrade
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}