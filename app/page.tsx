"use client";

export default function Home() {

  type Song = {
    title: string;
    likes: number;
    year: number;
    date: string;
  }; 

  const storyGradients = [
    "from-blue-400 to-purple-500",
    "from-blue-500 to-indigo-600",
    "from-indigo-500 to-purple-700",
    "from-blue-300 to-purple-600",
    "from-blue-600 to-violet-700",
    "from-indigo-400 to-purple-500",
  ];

  const songs: Song[] = [
    { title: "Eternal Night", likes: 1240, year: 2026, date: "Jan 24" },
    { title: "Blue Echoes", likes: 982, year: 2025, date: "Feb 02" },
    { title: "Neon Fade", likes: 1530, year: 2026, date: "Mar 10" },
    { title: "Midnight Drift", likes: 760, year: 2024, date: "Dec 18" },
    { title: "Void Runner", likes: 2040, year: 2026, date: "Apr 01" },
    { title: "Static Dreams", likes: 1102, year: 2025, date: "May 11" },
  ];
  return (
    <div className="w-full overflow-x-hidden">

      {/* HERO */}
     
      <div className="relative w-full sm:h-[35vh] md:h-[65vh] min-h-[140px] flex items-center">
        <img
          src="/headerLogo.png"
          className="absolute inset-0 w-full h-full object-cover"
          alt="header"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 flex items-center justify-between gap-4">
          <div className="text-white max-w-[85%] sm:max-w-md">
            <h1 className="text-lg sm:text-xl md:text-3xl font-bold">
              Welcome to SOA Music
            </h1>

            <p className="mt-1 text-white/70 text-xs sm:text-sm">
             Experience new music, videos, and exclusive content from your favorite SOA artists
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3 mt-3">
              <button className="px-3 sm:px-4 py-1.5 bg-blue-500 text-white text-xs rounded-md">
                Listen Now
              </button>

              <button className="px-3 sm:px-4 py-1.5 border border-blue-400 text-blue-400 text-xs rounded-md">
                Watch Video
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* MAIN */}
<div className="px-4 sm:px-6 md:px-12 py-8 space-y-10">

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* FEATURED */}
  <div>
   <h2 className="text-white text-sm font-semibold mb-4 tracking-wide">
    Featured
   </h2>
   <div className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#0B0F19] via-black/70 to-[#111827] p-4 transition-all duration-500 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10">

{/* Ambient glow */}
<div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
  <div className="absolute -top-20 right-0 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
  <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-cyan-400/5 blur-3xl" />
</div>

{/* subtle shine */}
<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />

{/* Cover */}
<div className="relative shrink-0">
  <img
    src="/assets/soalogo.png"
    className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover ring-1 ring-white/10 shadow-xl transition-transform duration-500 group-hover:scale-105"
  />

  {/* Play overlay */}
  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/90 text-white shadow-lg shadow-blue-500/30 backdrop-blur-md transition hover:bg-blue-500">
      ▶
    </button>
  </div>
</div>

{/* Info */}
<div className="flex min-w-0 flex-1 flex-col justify-between">

  {/* Top */}
  <div className="min-w-0">
    <p className="truncate text-sm font-semibold text-white tracking-wide">
      NOX — Eternal Night
    </p>

    <p className="mt-1 text-xs text-white/50">
      Featured Release
    </p>
  </div>

  {/* Bottom */}
  <div className="mt-3 flex items-center justify-between">

    <button className="text-xs font-medium text-blue-300 transition hover:text-white flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
      Play Now
    </button>

    <span className="text-[10px] tracking-wide text-white/30">
      Featured Track
    </span>
  </div>
</div>
</div>
</div>

          {/* STORIES */}
          <div>
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-white text-sm font-semibold tracking-[0.12em] uppercase">
      Stories
    </h2>

    <span className="text-[10px] text-white/30 tracking-[0.2em] uppercase">
      Live feed
    </span>
  </div>

  <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#0B0F19] via-black/70 to-[#111827] p-4">

    {/* ambient glow */}
    <div className="absolute -top-10 left-10 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
    <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-cyan-400/5 blur-3xl" />

    {/* soft top sheen */}
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />

    <div className="relative flex gap-5 overflow-x-auto pb-2 scrollbar-hide">

      {[1, 2, 3, 4, 5, 6].map((item, i) => (
        <div
          key={item}
          className="group flex min-w-[72px] flex-col items-center cursor-pointer"
        >

          {/* ring */}
          <div
            className={`p-[2px] rounded-full bg-gradient-to-tr ${
              storyGradients[i % storyGradients.length]
            } transition-transform duration-300 group-hover:scale-110`}
          >
            <div className="relative rounded-full bg-black p-[2px]">
              <img
                src="/assets/soalogo.png"
                className="h-12 w-12 rounded-full object-cover"
              />

              {/* active status */}
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black bg-green-400 animate-pulse" />
            </div>
          </div>

          {/* label */}
          <p className="mt-2 max-w-[60px] truncate text-[10px] text-white/60 transition group-hover:text-white">
            User {item}
          </p>

          {/* subtle “view” hint */}
          <span className="text-[9px] text-white/20 opacity-0 transition group-hover:opacity-100">
            view
          </span>
        </div>
      ))}

    </div>
  </div>
</div>

          {/* POSTS (FIXED — SAME CONTAINER + HEARTS ADDED) */}
          <div>
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-white text-sm font-semibold tracking-[0.12em] uppercase">
      Posts
    </h2>

    <span className="text-[10px] text-white/30 tracking-[0.2em] uppercase">
      Gallery
    </span>
  </div>

  <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#0B0F19] via-black/70 to-[#111827] p-3 transition hover:border-blue-500/20">

    <div className="grid grid-cols-3 gap-2">

      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="group relative overflow-hidden rounded-2xl aspect-square"
        >

          {/* image */}
          <img
            src="/assets/soalogo.png"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* dark base overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70" />

          {/* glow hover overlay */}
          <div className="absolute inset-0 bg-blue-500/10 opacity-0 transition duration-300 group-hover:opacity-100 backdrop-blur-[2px]" />

          {/* center action */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-md shadow-xl">
              <span className="text-pink-400 text-sm">♥</span>
              <span className="text-white text-[10px] font-medium">
                12.4K
              </span>
            </div>
          </div>

          {/* top badge */}
          <div className="absolute top-2 left-2">
            <span className="rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[9px] text-white/70 backdrop-blur-md">
              Post #{item}
            </span>
          </div>

          {/* bottom info */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 transition group-hover:opacity-100">
            <p className="truncate text-[10px] font-medium text-white">
              Track Visual
            </p>

            <span className="text-[9px] text-white/40">
              2h ago
            </span>
          </div>

        </div>
      ))}

    </div>

  </div>
</div>
 
 </div>

        {/* POPULAR TRACKS */}
        <div>
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-white text-sm font-semibold tracking-[0.12em] uppercase">
      Popular Tracks
    </h2>

    <span className="text-[10px] text-white/30 tracking-[0.2em] uppercase">
      2026 Collection
    </span>
  </div>

  {/* MOBILE */}
  <div className="flex flex-col md:hidden overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-[#0B0F19] via-black/60 to-[#111827]">

    {songs.map((song, i) => (
      <div
        key={i}
        className="group relative flex items-center justify-between px-4 py-3 active:scale-[0.99] transition"
      >

        {/* active accent */}
        <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-blue-500/0 via-blue-400/70 to-purple-500/0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition" />

        {/* divider */}
        {i !== songs.length - 1 && (
          <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-white/5" />
        )}

        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-0">

          <div className="relative shrink-0">
            <img
              src="/assets/soalogo.png"
              className="h-12 w-12 rounded-xl object-cover ring-1 ring-white/10"
            />

            <div className="absolute inset-0 rounded-xl bg-blue-500/10 opacity-0 group-hover:opacity-100 transition" />
          </div>

          <div className="min-w-0 leading-tight">

            <p className="truncate text-sm font-semibold text-white">
              {song.title}
            </p>

            <div className="mt-1 flex items-center gap-2 text-[10px] text-white/40">
              <span>{song.likes} likes</span>

              <span className="text-white/10">•</span>

              <span className="text-white/30">
                {song.year || "2026"}
              </span>

              <span className="text-white/10">•</span>

              <span className="text-white/30">
                {song.date || "Jan 24"}
              </span>
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          <span className="hidden sm:inline text-[9px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/40">
            Track
          </span>

          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-blue-300 hover:bg-white/10 active:scale-95 transition">
            ▶
          </button>

        </div>
      </div>
    ))}

  </div>

  {/* DESKTOP */}
  <div className="hidden md:grid grid-cols-6 gap-4 mt-4">
    {songs.map((song, i) => (
      <div
        key={i}
        className="group relative aspect-square overflow-hidden rounded-xl border border-white/5 bg-black/30 hover:border-blue-500/40 transition"
      >
        <img
          src="/assets/soalogo.png"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70" />

        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <p className="truncate text-[10px] text-white font-medium">
            {song.title}
          </p>

          <span className="text-[9px] text-white/40">
            {song.likes}
          </span>
        </div>
      </div>
    ))}
  </div>

  {/* footer */}
  <div className="mt-4 text-center text-white/40 text-xs tracking-[0.3em]">
    2026 • NOX COLLECTION
  </div>
</div>

        {/* MUSIC VIDEOS */}
        
        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_.9fr] gap-6">
  {/* LEFT: MUSIC VIDEOS */}
  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.01] backdrop-blur-xl p-5">
    {/* glow */}
    <div className="absolute -top-24 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

    <div className="relative z-10 flex items-center justify-between mb-5">
      <div>
        <p className="text-[11px] tracking-[0.25em] uppercase text-blue-400/70">
          Visual Archive
        </p>

        <h2 className="text-white text-lg font-semibold mt-1">
          Music Videos
        </h2>
      </div>

      <button className="text-[11px] text-white/50 hover:text-white transition">
        View All
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
      {[
        {
          title: "SWERVE",
          year: "2026",
          views: "1.2M",
          length: "3:41",
        },
        {
          title: "MONEY WALK",
          year: "2025",
          views: "842K",
          length: "2:58",
        },
        {
          title: "NEON HEART",
          year: "2026",
          views: "430K",
          length: "4:10",
        },
        {
          title: "AFTER HOURS",
          year: "2025",
          views: "690K",
          length: "3:25",
        },
      ].map((video, item) => (
        <div
          key={item}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 hover:border-blue-500/40 transition-all duration-300"
        >
          {/* image */}
          <div className="relative overflow-hidden">
            <img
              src="/assets/soalogo.png"
              className="w-full h-40 object-cover group-hover:scale-105 transition duration-500"
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            {/* play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <div className="ml-1 border-l-[10px] border-l-white border-y-[6px] border-y-transparent" />
              </div>
            </div>

            {/* duration */}
            <div className="absolute bottom-3 right-3 bg-black/70 border border-white/10 px-2 py-1 rounded-md text-[10px] text-white">
              {video.length}
            </div>
          </div>

          {/* content */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-white text-sm font-semibold tracking-wide">
                  {video.title}
                </p>

                <p className="text-white/40 text-[11px] mt-0.5">
                  Directed by NOX Visuals
                </p>
              </div>

              <span className="text-[10px] text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-full">
                {video.year}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-white/45 mt-3">
              <span>{video.views} views</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>Cinematic</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* RIGHT: NEWS / DROPS */}
  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-purple-500/[0.05] to-transparent backdrop-blur-xl p-5">
    <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />

    <div className="relative z-10 flex items-center justify-between mb-5">
      <div>
        <p className="text-[11px] tracking-[0.25em] uppercase text-purple-300/70">
          Updates
        </p>

        <h2 className="text-white text-lg font-semibold mt-1">
          Latest Drops
        </h2>
      </div>

      <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
    </div>

    <div className="relative z-10 space-y-4">
      {[
        {
          title: "New single dropping Friday",
          desc: "Official teaser snippet released across all socials.",
          tag: "DROP",
          date: "May 24",
        },
        {
          title: "SWERVE visual premiere",
          desc: "Cyber-noir visual experience premiering live on YouTube.",
          tag: "VIDEO",
          date: "May 28",
        },
        {
          title: "Album rollout initiated",
          desc: "Tracklist, cover art, and merch capsule arriving next week.",
          tag: "NEWS",
          date: "June 1",
        },
      ].map((news, i) => (
        <div
          key={i}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-4 hover:border-purple-500/40 transition-all duration-300"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-purple-500/5 to-blue-500/5" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-white/70 border border-white/10 bg-white/5 px-2 py-1 rounded-full tracking-wide">
                  {news.tag}
                </span>

                <span className="text-[10px] text-white/35">
                  {news.date}
                </span>
              </div>

              <p className="text-white text-sm font-semibold leading-snug">
                {news.title}
              </p>

              <p className="text-white/45 text-[11px] mt-2 leading-relaxed">
                {news.desc}
              </p>
            </div>

            <button className="text-white/30 group-hover:text-white transition">
              ↗
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* bottom stats */}
    <div className="relative z-10 mt-6 grid grid-cols-3 gap-3">
      {[
        { label: "Videos", value: "24" },
        { label: "Streams", value: "8.4M" },
        { label: "Fans", value: "112K" },
      ].map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center"
        >
          <p className="text-white text-sm font-semibold">
            {stat.value}
          </p>

          <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  </div>
</div>
        {/* FOOTER */}
        <footer className="border-t border-gray-800 pt-6 mt-10 flex flex-col sm:flex-row justify-between items-center gap-3 text-white/40 text-xs">

          <p>© 2026 NOX. All rights reserved.</p>

          <div className="flex gap-4">
            <a className="hover:text-blue-400">Instagram</a>
            <a className="hover:text-blue-400">YouTube</a>
            <a className="hover:text-blue-400">Contact</a>
          </div>

        </footer>

      </div>
    </div>
  );
}