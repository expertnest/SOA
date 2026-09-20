 
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
    {
      title: "Eternal Night",
      likes: 1240,
      year: 2026,
      date: "Jan 24",
    },
    {
      title: "Blue Echoes",
      likes: 982,
      year: 2025,
      date: "Feb 02",
    },
    {
      title: "Neon Fade",
      likes: 1530,
      year: 2026,
      date: "Mar 10",
    },
    {
      title: "Midnight Drift",
      likes: 760,
      year: 2024,
      date: "Dec 18",
    },
    {
      title: "Void Runner",
      likes: 2040,
      year: 2026,
      date: "Apr 01",
    },
    {
      title: "Static Dreams",
      likes: 1102,
      year: 2025,
      date: "May 11",
    },
  ];

  return (
    <div className="w-full overflow-x-hidden bg-[#050505] text-white">
      {/* =====================================================
          SUBTLE PAGE GLOW
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[30%] top-[-180px] h-[420px] w-[420px] rounded-full bg-blue-500/[0.035] blur-[180px]" />

        <div className="absolute right-[-100px] top-[45%] h-[360px] w-[360px] rounded-full bg-purple-500/[0.025] blur-[170px]" />
      </div>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative w-full overflow-hidden border-b border-zinc-800/80">
        <div className="relative h-[280px] sm:h-[390px] md:h-[560px]">
          <img
            src="/headerLogo.png"
            className="absolute inset-0 h-full w-full object-cover"
            alt="SOA Music"
          />

          {/* dark cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-[#050505]" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-black/25" />

          <div className="relative z-10 flex h-full items-end px-4 pb-7 sm:px-6 sm:pb-10 md:px-12 md:pb-14">
            <div className="max-w-2xl">
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-blue-300">
                SOA MUSIC
              </p>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl md:text-6xl">
                The world behind the music.
              </h1>

              <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/55 sm:text-sm md:text-base">
                Experience new music, videos, artists, live moments,
                and exclusive content from SOA.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="
                    rounded-full
                    bg-white
                    px-4
                    py-2.5
                    text-xs
                    font-bold
                    text-black

                    transition
                    hover:bg-zinc-200
                    active:scale-95

                    sm:px-5
                  "
                >
                  Listen Now
                </button>

                <button
                  type="button"
                  className="
                    rounded-full
                    border
                    border-zinc-700
                    bg-black/30
                    px-4
                    py-2.5
                    text-xs
                    font-semibold
                    text-white/80
                    backdrop-blur-md

                    transition
                    hover:border-zinc-500
                    hover:text-white
                    active:scale-95

                    sm:px-5
                  "
                >
                  Watch Video
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="space-y-12 px-4 py-8 sm:px-6 sm:py-10 md:px-12">
        {/* ===================================================
            FEATURED / STORIES / POSTS
        =================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* =================================================
              FEATURED
          ================================================= */}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Featured
              </h2>

              <span className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
                Spotlight
              </span>
            </div>

            <div className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-zinc-800/80
              bg-[#0a0a0a]
              p-4

              transition
              hover:border-zinc-700
            ">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/[0.05] blur-3xl" />

              <div className="relative flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src="/assets/soalogo.png"
                    alt="SOA featured"
                    className="
                      h-16
                      w-16
                      rounded-2xl
                      object-cover

                      ring-1
                      ring-zinc-700/60

                      sm:h-20
                      sm:w-20
                    "
                  />

                  <button
                    type="button"
                    aria-label="Play featured track"
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center

                      rounded-2xl

                      bg-black/45

                      opacity-0
                      backdrop-blur-[2px]

                      transition

                      group-hover:opacity-100
                    "
                  >
                    <span className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-black
                    ">
                      ▶
                    </span>
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold tracking-wide text-white">
                    NOX — Eternal Night
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Featured Release
                  </p>

                  <button
                    type="button"
                    className="
                      mt-3
                      text-xs
                      font-medium
                      text-blue-300

                      transition
                      hover:text-white
                    "
                  >
                    Play Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              STORIES
          ================================================= */}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Stories
              </h2>

              <span className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
                Live feed
              </span>
            </div>

            <div className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-zinc-800/80
              bg-[#0a0a0a]
              p-4
            ">
              <div className="absolute -left-10 top-0 h-24 w-24 rounded-full bg-blue-500/[0.05] blur-3xl" />

              <div className="relative flex gap-5 overflow-x-auto pb-1 scrollbar-hide">
                {[1, 2, 3, 4, 5, 6].map(
                  (item, i) => (
                    <button
                      type="button"
                      key={item}
                      className="
                        group
                        flex
                        min-w-[60px]
                        flex-col
                        items-center
                        text-center
                      "
                    >
                      <div
                        className={`
                          rounded-full
                          bg-gradient-to-tr
                          p-[2px]

                          transition
                          duration-300
                          group-hover:scale-105

                          ${
                            storyGradients[
                              i %
                                storyGradients.length
                            ]
                          }
                        `}
                      >
                        <div className="rounded-full bg-[#080808] p-[2px]">
                          <div className="relative">
                            <img
                              src="/assets/soalogo.png"
                              alt={`User ${item}`}
                              className="
                                h-11
                                w-11
                                rounded-full
                                object-cover
                              "
                            />

                            <span className="
                              absolute
                              bottom-0
                              right-0
                              h-2.5
                              w-2.5
                              rounded-full
                              border-2
                              border-[#080808]
                              bg-green-400
                            " />
                          </div>
                        </div>
                      </div>

                      <p className="
                        mt-2
                        max-w-[60px]
                        truncate
                        text-[9px]
                        text-zinc-500
                        transition
                        group-hover:text-white
                      ">
                        User {item}
                      </p>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              POSTS
          ================================================= */}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Posts
              </h2>

              <span className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
                Gallery
              </span>
            </div>

            <div className="
              rounded-2xl
              border
              border-zinc-800/80
              bg-[#0a0a0a]
              p-3
            ">
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((item) => (
                  <button
                    type="button"
                    key={item}
                    className="
                      group
                      relative
                      aspect-square
                      overflow-hidden
                      rounded-xl
                    "
                    aria-label={`Open post ${item}`}
                  >
                    <img
                      src="/assets/soalogo.png"
                      alt={`SOA post ${item}`}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-500
                        group-hover:scale-105
                      "
                    />

                    <div className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/65
                      via-transparent
                      to-transparent
                    " />

                    <div className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      opacity-0
                      transition
                      group-hover:opacity-100
                    ">
                      <div className="
                        rounded-full
                        border
                        border-zinc-700
                        bg-black/45
                        px-2.5
                        py-1
                        text-[9px]
                        text-white
                        backdrop-blur-md
                      ">
                        ♥ 12.4K
                      </div>
                    </div>

                    <div className="
                      absolute
                      bottom-2
                      left-2
                      text-[9px]
                      text-white/55
                    ">
                      Post #{item}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            POPULAR TRACKS
        =================================================== */}

        <section>
          <div className="mb-4 flex items-end justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-blue-300">
                Popular
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                Tracks
              </h2>
            </div>

            <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-700">
              2026 Collection
            </span>
          </div>

          {/* MOBILE */}

          <div className="
            overflow-hidden
            rounded-2xl
            border
            border-zinc-800/80
            bg-[#090909]

            md:hidden
          ">
            {songs.map(
              (song, i) => (
                <div
                  key={i}
                  className="
                    group
                    relative
                    flex
                    items-center
                    justify-between
                    px-4
                    py-3

                    transition
                    hover:bg-zinc-900/80

                    active:scale-[0.99]
                  "
                >
                  {i !==
                    songs.length - 1 && (
                    <div className="
                      absolute
                      bottom-0
                      left-4
                      right-4
                      h-px
                      bg-zinc-800/70
                    " />
                  )}

                  <div className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  ">
                    <div className="relative shrink-0">
                      <img
                        src="/assets/soalogo.png"
                        alt={song.title}
                        className="
                          h-11
                          w-11
                          rounded-xl
                          object-cover
                        "
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="
                        truncate
                        text-sm
                        font-semibold
                        text-zinc-200
                        group-hover:text-white
                      ">
                        {song.title}
                      </p>

                      <div className="
                        mt-1
                        flex
                        items-center
                        gap-2
                        text-[9px]
                        text-zinc-600
                      ">
                        <span>
                          {song.likes} likes
                        </span>

                        <span className="text-zinc-800">
                          •
                        </span>

                        <span>
                          {song.year}
                        </span>

                        <span className="text-zinc-800">
                          •
                        </span>

                        <span>
                          {song.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label={`Play ${song.title}`}
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      border
                      border-zinc-800

                      bg-zinc-900

                      text-blue-300

                      transition

                      hover:border-zinc-700
                      hover:bg-zinc-800

                      active:scale-95
                    "
                  >
                    ▶
                  </button>
                </div>
              )
            )}
          </div>

          {/* DESKTOP */}

          <div className="
            mt-4
            hidden
            gap-4

            md:grid
            md:grid-cols-3
            lg:grid-cols-6
          ">
            {songs.map(
              (song, i) => (
                <button
                  type="button"
                  key={i}
                  className="
                    group
                    relative
                    aspect-square
                    overflow-hidden
                    rounded-2xl
                    border
                    border-zinc-800/80
                    bg-[#090909]
                    text-left

                    transition

                    hover:border-zinc-700
                  "
                >
                  <img
                    src="/assets/soalogo.png"
                    alt={song.title}
                    className="
                      h-full
                      w-full
                      object-cover

                      transition
                      duration-500

                      group-hover:scale-105
                    "
                  />

                  <div className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black
                    via-black/10
                    to-transparent
                  " />

                  <div className="
                    absolute
                    bottom-3
                    left-3
                    right-3
                  ">
                    <p className="
                      truncate
                      text-[10px]
                      font-semibold
                      text-white
                    ">
                      {song.title}
                    </p>

                    <p className="
                      mt-1
                      text-[8px]
                      text-zinc-500
                    ">
                      {song.likes} likes
                    </p>
                  </div>
                </button>
              )
            )}
          </div>

          <div className="
            mt-4
            text-center
            text-[9px]
            uppercase
            tracking-[0.28em]
            text-zinc-700
          ">
            2026 · SOA MUSIC
          </div>
        </section>

        {/* ===================================================
            MUSIC VIDEOS + LATEST DROPS
        =================================================== */}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          {/* =================================================
              MUSIC VIDEOS
          ================================================= */}

          <div className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-zinc-800/80
            bg-[#090909]
            p-5
          ">
            <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-blue-500/[0.04] blur-3xl" />

            <div className="
              relative
              z-10
              mb-5
              flex
              items-center
              justify-between
            ">
              <div>
                <p className="
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  text-blue-300
                ">
                  Visual Archive
                </p>

                <h2 className="
                  mt-1
                  text-lg
                  font-semibold
                  text-white
                ">
                  Music Videos
                </h2>
              </div>

              <button
                type="button"
                className="
                  text-[10px]
                  text-zinc-500
                  transition
                  hover:text-white
                "
              >
                View All
              </button>
            </div>

            <div className="
              relative
              z-10
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
            ">
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
              ].map(
                (video, item) => (
                  <button
                    key={item}
                    type="button"
                    className="
                      group
                      overflow-hidden
                      rounded-2xl
                      border
                      border-zinc-800/80
                      bg-black/30
                      text-left

                      transition

                      hover:border-zinc-700
                    "
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src="/assets/soalogo.png"
                        alt={video.title}
                        className="
                          h-40
                          w-full
                          object-cover

                          transition
                          duration-500

                          group-hover:scale-105
                        "
                      />

                      <div className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black
                        via-transparent
                        to-transparent
                      " />

                      <div className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        opacity-0
                        transition
                        group-hover:opacity-100
                      ">
                        <div className="
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          text-black
                        ">
                          ▶
                        </div>
                      </div>

                      <div className="
                        absolute
                        bottom-3
                        right-3
                        rounded-md
                        border
                        border-zinc-700
                        bg-black/70
                        px-2
                        py-1
                        text-[9px]
                        text-white/80
                      ">
                        {video.length}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      ">
                        <div>
                          <p className="
                            text-sm
                            font-semibold
                            tracking-wide
                            text-white
                          ">
                            {video.title}
                          </p>

                          <p className="
                            mt-0.5
                            text-[10px]
                            text-zinc-600
                          ">
                            Directed by NOX Visuals
                          </p>
                        </div>

                        <span className="
                          rounded-full
                          border
                          border-zinc-800
                          bg-zinc-900
                          px-2
                          py-1
                          text-[9px]
                          text-zinc-500
                        ">
                          {video.year}
                        </span>
                      </div>

                      <div className="
                        mt-3
                        flex
                        items-center
                        gap-3
                        text-[9px]
                        text-zinc-600
                      ">
                        <span>
                          {video.views} views
                        </span>

                        <span className="h-1 w-1 rounded-full bg-zinc-800" />

                        <span>
                          Cinematic
                        </span>
                      </div>
                    </div>
                  </button>
                )
              )}
            </div>
          </div>

          {/* =================================================
              LATEST DROPS
          ================================================= */}

          <div className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-zinc-800/80
            bg-[#090909]
            p-5
          ">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-purple-500/[0.04] blur-3xl" />

            <div className="
              relative
              z-10
              mb-5
              flex
              items-center
              justify-between
            ">
              <div>
                <p className="
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  text-purple-300/80
                ">
                  Updates
                </p>

                <h2 className="
                  mt-1
                  text-lg
                  font-semibold
                  text-white
                ">
                  Latest Drops
                </h2>
              </div>

              <div className="
                h-2
                w-2
                rounded-full
                bg-green-400
              " />
            </div>

            <div className="relative z-10 space-y-3">
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
              ].map(
                (news, i) => (
                  <button
                    type="button"
                    key={i}
                    className="
                      group
                      relative
                      w-full
                      overflow-hidden
                      rounded-xl
                      border
                      border-zinc-800/80
                      bg-black/20
                      p-4
                      text-left

                      transition

                      hover:border-zinc-700
                      hover:bg-zinc-900/50
                    "
                  >
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div>
                        <div className="
                          mb-2
                          flex
                          items-center
                          gap-2
                        ">
                          <span className="
                            rounded-full
                            border
                            border-zinc-800
                            bg-zinc-900
                            px-2
                            py-1
                            text-[8px]
                            font-medium
                            tracking-wide
                            text-zinc-500
                          ">
                            {news.tag}
                          </span>

                          <span className="
                            text-[9px]
                            text-zinc-700
                          ">
                            {news.date}
                          </span>
                        </div>

                        <p className="
                          text-sm
                          font-semibold
                          leading-snug
                          text-zinc-200
                          group-hover:text-white
                        ">
                          {news.title}
                        </p>

                        <p className="
                          mt-2
                          text-[10px]
                          leading-relaxed
                          text-zinc-600
                        ">
                          {news.desc}
                        </p>
                      </div>

                      <span className="
                        shrink-0
                        text-sm
                        text-zinc-700
                        transition
                        group-hover:text-zinc-400
                      ">
                        ↗
                      </span>
                    </div>
                  </button>
                )
              )}
            </div>

            {/* STATS */}

            <div className="
              relative
              z-10
              mt-5
              grid
              grid-cols-3
              gap-2
            ">
              {[
                {
                  label: "Videos",
                  value: "24",
                },
                {
                  label: "Streams",
                  value: "8.4M",
                },
                {
                  label: "Fans",
                  value: "112K",
                },
              ].map(
                (stat) => (
                  <div
                    key={stat.label}
                    className="
                      rounded-xl
                      border
                      border-zinc-800/80
                      bg-white/[0.015]
                      p-3
                      text-center
                    "
                  >
                    <p className="
                      text-sm
                      font-semibold
                      text-white
                    ">
                      {stat.value}
                    </p>

                    <p className="
                      mt-1
                      text-[8px]
                      uppercase
                      tracking-[0.16em]
                      text-zinc-700
                    ">
                      {stat.label}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="
          flex
          flex-col
          items-center
          justify-between
          gap-3

          border-t
          border-zinc-800/80

          pt-6

          text-[10px]
          text-zinc-700

          sm:flex-row
        ">
          <p>
            © 2026 SOA MUSIC. All rights reserved.
          </p>

          <div className="flex gap-5">
            <button
              type="button"
              className="transition hover:text-zinc-300"
            >
              Instagram
            </button>

            <button
              type="button"
              className="transition hover:text-zinc-300"
            >
              YouTube
            </button>

            <button
              type="button"
              className="transition hover:text-zinc-300"
            >
              Contact
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
 
