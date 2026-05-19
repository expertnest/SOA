"use client";
import { useState } from "react";

export default function Music() {
  const [filter, setFilter] = useState("all");

  const tracks = [
    { name: "Midnight Echoes", album: "Afterglow", plays: "12.4M", duration: "3:12" },
    { name: "Neon Drift", album: "Neon Drift", plays: "9.1M", duration: "2:58" },
    { name: "Lost Signals", album: "Static Dreams", plays: "7.6M", duration: "3:44" },
    { name: "Cold Atmosphere", album: "Cold Atmosphere", plays: "6.2M", duration: "4:01" },
    { name: "Static Dreams", album: "Static Dreams", plays: "5.8M", duration: "3:27" },
  ];

  const albums = [
    {
      title: "Afterglow",
      year: 2024,
      image: "/album1.jpg",
    },
    {
      title: "Neon Drift",
      year: 2023,
      image: "/album2.jpg",
    },
    {
      title: "Static Dreams",
      year: 2022,
      image: "/album3.jpg",
    },
  ];

  const playlists = [
    { title: "Late Night Drive", tracks: 18 },
    { title: "Ambient Focus", tracks: 25 },
    { title: "Trap Waves", tracks: 14 },
  ];

  return (
    <div className="bg-black text-white flex flex-col gap-6 p-4 sm:p-6">

      {/* TOP SECTION (UNCHANGED) */}
      <div className="flex flex-col sm:flex-row gap-4">

        {/* LEFT */}
        <div className="w-full sm:w-1/2 bg-zinc-950 rounded-2xl p-4 flex gap-4">

          <div className="w-1/2">
            <img
              src="/headerLogo.png"
              alt="Nox Artist"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between">

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold">Nox</h1>
                <span className="text-blue-400">✔</span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-gray-400 mt-1">
                <span>Artist</span>
                <span>•</span>
                <span>Producer</span>
                <span>•</span>
                <span>Songwriter</span>
              </div>

              <p className="text-gray-300 text-xs mt-2">
                Nox is an independent artist blending ambient textures with modern trap influence.
              </p>

              <button className="mt-3 px-4 py-1.5 rounded-full text-xs font-semibold 
                bg-gradient-to-r from-blue-500 to-cyan-400 text-black
                hover:shadow-blue-500/50 transition">
                Follow
              </button>
            </div>

            <div className="flex justify-between text-xs mt-3">
              <div>
                <p className="text-gray-400">Listeners</p>
                <p className="font-semibold">1.2M</p>
              </div>
              <div>
                <p className="text-gray-400">Streams</p>
                <p className="font-semibold">48.6M</p>
              </div>
              <div>
                <p className="text-gray-400">Tracks</p>
                <p className="font-semibold">24</p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT (UNCHANGED) */}
        <div className="w-full sm:w-1/2 bg-zinc-950 rounded-2xl p-4 flex flex-col gap-4">

          <h2 className="text-lg font-semibold">Analytics</h2>

          <div className="bg-black/40 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-2">Streams (7 Days)</p>

            <svg viewBox="0 0 100 30" className="w-full h-12">
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                points="0,25 10,20 20,22 30,10 40,15 50,5 60,12 70,8 80,14 90,6 100,10"
              />
            </svg>
          </div>

          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">

            <div className="bg-black/40 rounded-xl p-3">
              <p className="text-gray-400">Growth</p>
              <p className="text-blue-400 font-semibold">+18%</p>
            </div>

            <div className="bg-black/40 rounded-xl p-3">
              <p className="text-gray-400">Avg Daily</p>
              <p className="text-blue-400 font-semibold">120K</p>
            </div>

            <div className="bg-black/40 rounded-xl p-3">
              <p className="text-gray-400">Peak</p>
              <p className="text-blue-400 font-semibold">1.2M</p>
            </div>

          </div>

        </div>
      </div>

      {/* TRACKLIST SECTION */}
      <div className="bg-zinc-950 rounded-2xl p-4 border border-blue-500/10">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">

          <h2 className="text-lg font-semibold">
            {filter === "albums"
              ? "Albums"
              : filter === "playlists"
              ? "Playlists"
              : "Popular Tracks"}
          </h2>

          <div className="flex items-center gap-2 text-xs">

            <button className="px-3 py-1 rounded-full bg-black/40 hover:bg-blue-500/20 hover:text-blue-400 transition">
              Shuffle
            </button>

            <button className="px-3 py-1 rounded-full bg-black/40 hover:bg-blue-500/20 hover:text-blue-400 transition">
              Play
            </button>

            <button className="px-3 py-1 rounded-full bg-black/40 hover:bg-blue-500/20 hover:text-blue-400 transition">
              ⋯
            </button>

          </div>
        </div>

        {/* FILTER */}
        <div className="flex items-center gap-2 mb-4 text-xs">

          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full transition ${
              filter === "all"
                ? "bg-blue-500 text-black font-semibold"
                : "bg-black/40 hover:bg-blue-500/20 hover:text-blue-400"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("albums")}
            className={`px-3 py-1 rounded-full transition ${
              filter === "albums"
                ? "bg-blue-500 text-black font-semibold"
                : "bg-black/40 hover:bg-blue-500/20 hover:text-blue-400"
            }`}
          >
            Albums
          </button>

          <button
            onClick={() => setFilter("playlists")}
            className={`px-3 py-1 rounded-full transition ${
              filter === "playlists"
                ? "bg-blue-500 text-black font-semibold"
                : "bg-black/40 hover:bg-blue-500/20 hover:text-blue-400"
            }`}
          >
            Playlists
          </button>

        </div>

        {/* CONTENT */}
        {filter === "albums" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {albums.map((a, i) => (
              <div key={i} className="bg-black/40 rounded-xl p-3 hover:bg-blue-500/10 transition">
                <img src={a.image} className="w-full h-32 object-cover rounded-lg" />
                <p className="mt-2 font-medium">{a.title}</p>
                <p className="text-xs text-gray-400">{a.year}</p>
              </div>
            ))}
          </div>

        ) : filter === "playlists" ? (
          <div className="flex flex-col gap-2">
            {playlists.map((p, i) => (
              <div key={i} className="flex justify-between bg-black/40 p-3 rounded-lg hover:bg-blue-500/10 transition">
                <p>{p.title}</p>
                <p className="text-gray-400 text-xs">{p.tracks} tracks</p>
              </div>
            ))}
          </div>

        ) : (
          <>
            {/* COLUMN HEADER */}
            <div className="grid grid-cols-12 text-xs text-gray-400 px-3 mb-2">
              <div className="col-span-1">#</div>
              <div className="col-span-6">Title</div>
              <div className="col-span-3">Album</div>
              <div className="col-span-2 text-right">⏱</div>
            </div>

            {/* TRACKS */}
            <div className="flex flex-col gap-2">

              {tracks.map((track, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 items-center px-3 py-3 rounded-lg 
                  bg-black/40 border border-transparent
                  hover:border-blue-500/40 hover:bg-blue-500/10
                  transition group"
                >

                  <div className="col-span-1 text-gray-400 group-hover:text-blue-400">
                    {i + 1}
                  </div>

                  <div className="col-span-6">
                    <p className="text-sm font-medium group-hover:text-blue-300 transition">
                      {track.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {track.plays} streams
                    </p>
                  </div>

                  <div className="col-span-3 text-xs text-gray-400">
                    {track.album}
                  </div>

                  <div className="col-span-2 flex justify-end items-center gap-3 text-xs">

                    <button className="opacity-0 group-hover:opacity-100 transition text-blue-400 hover:scale-110">
                      ▶
                    </button>

                    <button className="text-gray-400 hover:text-blue-400 hover:scale-110 transition">
                      ☆
                    </button>

                    <span className="text-gray-400">{track.duration}</span>

                  </div>

                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}