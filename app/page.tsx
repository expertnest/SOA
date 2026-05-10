"use client";

export default function Home() {
  const storyGradients = [
    "from-blue-400 to-purple-500",
    "from-blue-500 to-indigo-600",
    "from-indigo-500 to-purple-700",
    "from-blue-300 to-purple-600",
    "from-blue-600 to-violet-700",
    "from-indigo-400 to-purple-500",
  ];

  const songs = [
    { title: "Eternal Night", likes: 1240 },
    { title: "Blue Echoes", likes: 982 },
    { title: "Neon Fade", likes: 1530 },
    { title: "Midnight Drift", likes: 760 },
    { title: "Void Runner", likes: 2040 },
    { title: "Static Dreams", likes: 1102 },
  ];

  return (
    <div className="w-full overflow-x-hidden">

      {/* HERO */}
      <div className="relative w-full h-[35vh] min-h-[140px] flex items-center">
        <img
          src="/headerLogo.png"
          className="absolute inset-0 w-full h-full object-cover"
          alt="header"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 flex items-center justify-between gap-4">
          <div className="text-white max-w-[85%] sm:max-w-md">
            <h1 className="text-lg sm:text-xl md:text-3xl font-bold">
              Welcome to Nox
            </h1>

            <p className="mt-1 text-white/70 text-xs sm:text-sm">
              Dark electronic energy meets cinematic sound.
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
            <h2 className="text-white text-sm font-semibold mb-4">
              Featured
            </h2>

            <div className="bg-black/40 border border-gray-800 rounded-xl p-4 flex gap-3">
              <img
                src="/assets/soalogo.png"
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
              />

              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-white text-sm font-semibold">
                    NOX — Eternal Night
                  </p>
                  <p className="text-white/50 text-xs">
                    Featured Release
                  </p>
                </div>

                <button className="text-blue-400 text-xs">
                  Play
                </button>
              </div>
            </div>
          </div>

          {/* STORIES */}
          <div>
            <h2 className="text-white text-sm font-semibold mb-4">
              Stories
            </h2>

            <div className="bg-black/40 border border-gray-800 rounded-xl p-4">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[1, 2, 3, 4, 5, 6].map((item, i) => (
                  <div key={item} className="flex flex-col items-center min-w-[60px]">

                    <div className={`p-[3px] rounded-full bg-gradient-to-tr ${storyGradients[i % storyGradients.length]}`}>
                      <img
                        src="/assets/soalogo.png"
                        className="w-12 h-12 rounded-full object-cover border-2 border-black"
                      />
                    </div>

                    <p className="text-[9px] text-white/70 mt-1">
                      User {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* POSTS (FIXED — SAME CONTAINER + HEARTS ADDED) */}
          <div>
            <h2 className="text-white text-sm font-semibold mb-4">
              Posts
            </h2>

            <div className="bg-black/40 border border-gray-800 rounded-xl p-3 hover:border-blue-500/40 transition">

              <div className="grid grid-cols-3 gap-2 w-full">

                {[1, 2, 3].map((item) => (
                  <div key={item} className="relative group">

                    <img
                      src="/assets/soalogo.png"
                      className="w-full h-20 object-cover rounded-md"
                    />

                    {/* HEART OVERLAY */}
                    <div className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      ❤️ {Math.floor(Math.random() * 900 + 100)}
                    </div>

                    {/* HOVER HEART (IG STYLE) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <span className="text-white text-2xl drop-shadow-lg">
                        ❤️
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
  <h2 className="text-white text-sm font-semibold mb-4 tracking-wide">
    Popular Tracks
  </h2>

  {/* MOBILE */}
  <div className="flex flex-col md:hidden rounded-xl overflow-hidden border border-gray-800/60 bg-black/20">

    {songs.map((song, i) => (
      <div
        key={i}
        className="group relative flex items-center justify-between px-3 py-3 transition-all duration-200 active:scale-[0.99]"
      >
        {/* left accent line */}
        <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-blue-500/0 via-blue-400/40 to-purple-500/0 opacity-0 group-active:opacity-100 group-hover:opacity-100 transition" />

        {/* subtle divider line */}
        {i !== songs.length - 1 && (
          <div className="absolute bottom-0 left-3 right-3 h-[1px] bg-white/5" />
        )}

        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/assets/soalogo.png"
              className="w-11 h-11 rounded-md object-cover border border-white/10"
            />
            <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-blue-500/10 to-purple-500/10" />
          </div>

          <div className="leading-tight">
            <p className="text-white text-sm font-medium">
              {song.title}
            </p>
            <p className="text-white/40 text-[11px] tracking-wide">
              {song.likes} likes
            </p>
          </div>
        </div>

        <button className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs hover:bg-white/10 transition">
          ▶
        </button>
      </div>
    ))}

  </div>

  {/* DESKTOP */}
  <div className="hidden md:grid grid-cols-6 gap-4 mt-4">
    {songs.map((song, i) => (
      <div
        key={i}
        className="bg-black/40 border border-gray-800 aspect-square rounded-lg p-3 hover:border-blue-500/40 transition"
      >
        <img
          src="/assets/soalogo.png"
          className="w-full h-full object-cover rounded-md"
        />
      </div>
    ))}
  </div>

  <div className="mt-4 text-center text-white/40 text-xs tracking-[0.3em]">
    2026 • NOX COLLECTION
  </div>
</div>

        {/* MUSIC VIDEOS */}
        <div>
          <h2 className="text-white text-sm font-semibold mb-4">
            Music Videos
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-black/40 border border-gray-800 rounded-xl overflow-hidden"
              >
                <img
                  src="/assets/soalogo.png"
                  className="w-full h-28 sm:h-32 object-cover"
                />

                <div className="p-3">
                  <p className="text-white text-xs font-semibold">
                    Music Video #{item}
                  </p>
                  <p className="text-white/50 text-[10px]">
                    NOX Visuals
                  </p>
                </div>
              </div>
            ))}
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