"use client";

import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CirclePlay,
  Clock3,
  Disc3,
  Eye,
  Flame,
  Heart,
  Instagram,
  Music2,
  Play,
  Radio,
  Sparkles,
  Users,
  Video,
  Youtube,
} from "lucide-react";

// =========================================================
// DATA
// =========================================================

type Song = {
  title: string;
  artist: string;
  likes: number;
  year: number;
  date: string;
  image: string;
};

type Story = {
  name: string;
  image: string;
  active?: boolean;
};

type VideoItem = {
  title: string;
  year: string;
  views: string;
  length: string;
  image: string;
};

type UpdateItem = {
  title: string;
  description: string;
  tag: string;
  date: string;
};

const songs: Song[] = [
  {
    title: "Eternal Night",
    artist: "NOX",
    likes: 1240,
    year: 2026,
    date: "Jan 24",
    image: "/assets/soalogo.png",
  },
  {
    title: "Blue Echoes",
    artist: "MacPhantom",
    likes: 982,
    year: 2025,
    date: "Feb 02",
    image: "/assets/soalogo.png",
  },
  {
    title: "Neon Fade",
    artist: "Qmilly",
    likes: 1530,
    year: 2026,
    date: "Mar 10",
    image: "/assets/soalogo.png",
  },
  {
    title: "Midnight Drift",
    artist: "MacPhantom",
    likes: 760,
    year: 2024,
    date: "Dec 18",
    image: "/assets/soalogo.png",
  },
  {
    title: "Void Runner",
    artist: "NOX",
    likes: 2040,
    year: 2026,
    date: "Apr 01",
    image: "/assets/soalogo.png",
  },
  {
    title: "Static Dreams",
    artist: "Qmilly",
    likes: 1102,
    year: 2025,
    date: "May 11",
    image: "/assets/soalogo.png",
  },
];

const stories: Story[] = [
  {
    name: "MacPhantom",
    image: "/assets/soalogo.png",
    active: true,
  },
  {
    name: "Qmilly",
    image: "/assets/soalogo.png",
    active: true,
  },
  {
    name: "Studio",
    image: "/assets/soalogo.png",
  },
  {
    name: "Live",
    image: "/assets/soalogo.png",
  },
  {
    name: "Behind",
    image: "/assets/soalogo.png",
  },
  {
    name: "SOA",
    image: "/assets/soalogo.png",
  },
];

const videos: VideoItem[] = [
  {
    title: "SWERVE",
    year: "2026",
    views: "1.2M",
    length: "3:41",
    image: "/assets/soalogo.png",
  },
  {
    title: "MONEY WALK",
    year: "2025",
    views: "842K",
    length: "2:58",
    image: "/assets/soalogo.png",
  },
  {
    title: "NEON HEART",
    year: "2026",
    views: "430K",
    length: "4:10",
    image: "/assets/soalogo.png",
  },
  {
    title: "AFTER HOURS",
    year: "2025",
    views: "690K",
    length: "3:25",
    image: "/assets/soalogo.png",
  },
];

const updates: UpdateItem[] = [
  {
    title: "New single dropping Friday",
    description:
      "Official teaser snippet released across all socials.",
    tag: "DROP",
    date: "May 24",
  },
  {
    title: "SWERVE visual premiere",
    description:
      "Cyber-noir visual experience premiering live on YouTube.",
    tag: "VIDEO",
    date: "May 28",
  },
  {
    title: "Album rollout initiated",
    description:
      "Tracklist, cover art, and merch capsule arriving next week.",
    tag: "NEWS",
    date: "June 1",
  },
];

// =========================================================
// PAGE
// =========================================================

export default function Home() {
  return (
    <div
      className="
        min-h-full
        w-full
        overflow-x-hidden
        bg-[#050506]
        text-white
      "
    >
      {/* ==================================================
          HERO
      ================================================== */}

      <section
        className="
          relative
          min-h-[520px]
          overflow-hidden
          border-b
          border-white/[0.06]
          sm:min-h-[620px]
          xl:min-h-[700px]
        "
      >
        {/* BACKGROUND IMAGE */}

        <img
          src="/headerLogo.png"
          alt="SOA Music"
          className="
            absolute
            inset-0
            h-full
            w-full
            scale-[1.02]
            object-cover
            object-center
          "
        />

        {/* CINEMATIC OVERLAYS */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/90
            via-black/45
            to-black/20
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#050506]
            via-[#050506]/15
            to-black/15
          "
        />

        {/* AMBIENT LIGHT */}

        <div
          className="
            pointer-events-none
            absolute
            -left-40
            top-[20%]
            h-[440px]
            w-[440px]
            rounded-full
            bg-blue-600/[0.12]
            blur-[150px]
          "
        />

        <div
          className="
            pointer-events-none
            bottom-[-180px]
            right-[10%]
            absolute
            h-[440px]
            w-[440px]
            rounded-full
            bg-violet-600/[0.10]
            blur-[160px]
          "
        />

        {/* GRID TEXTURE */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)]
            [background-size:48px_48px]
          "
        />

        {/* CONTENT */}

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[520px]
            w-full
            max-w-[1600px]
            items-end
            px-5
            pb-12
            pt-24
            sm:min-h-[620px]
            sm:px-8
            sm:pb-16
            lg:px-12
            xl:min-h-[700px]
            xl:px-16
            xl:pb-20
          "
        >
          <div
            className="
              max-w-4xl
            "
          >
            {/* EYEBROW */}

            <div
              className="
                mb-5
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-violet-300/20
                  bg-violet-500/[0.08]
                  text-violet-200
                "
              >
                <Sparkles
                  size={12}
                />
              </span>

              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.30em]
                  text-white/45
                "
              >
                SOA Music
              </p>

              <div
                className="
                  h-px
                  w-10
                  bg-gradient-to-r
                  from-violet-400/60
                  to-transparent
                "
              />
            </div>

            {/* TITLE */}

            <h1
              className="
                max-w-4xl
                text-4xl
                font-black
                leading-[0.95]
                tracking-[-0.055em]
                sm:text-6xl
                lg:text-7xl
                xl:text-[86px]
              "
            >
              The world behind
              <span
                className="
                  block
                  bg-gradient-to-r
                  from-white
                  via-blue-100
                  to-violet-300
                  bg-clip-text
                  text-transparent
                "
              >
                the music.
              </span>
            </h1>

            <p
              className="
                mt-6
                max-w-2xl
                text-sm
                leading-7
                text-white/45
                sm:text-base
              "
            >
              Discover new releases, visual worlds, artists,
              live moments, and exclusive content directly
              from SOA.
            </p>

            {/* ACTIONS */}

            <div
              className="
                mt-8
                flex
                flex-wrap
                gap-3
              "
            >
              <Link
                href="/music"
                className="
                  group
                  inline-flex
                  h-12
                  items-center
                  gap-2
                  rounded-full
                  bg-white
                  px-6
                  text-sm
                  font-semibold
                  text-black
                  transition
                  hover:scale-[1.02]
                  hover:bg-violet-50
                  active:scale-[0.98]
                "
              >
                <Play
                  size={15}
                  fill="currentColor"
                />

                Listen Now

                <ArrowRight
                  size={14}
                  className="
                    transition-transform
                    group-hover:translate-x-0.5
                  "
                />
              </Link>

              <Link
                href="/videos"
                className="
                  inline-flex
                  h-12
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/[0.12]
                  bg-black/25
                  px-6
                  text-sm
                  font-medium
                  text-white/75
                  backdrop-blur-xl
                  transition
                  hover:border-violet-400/30
                  hover:bg-white/[0.05]
                  hover:text-white
                "
              >
                <Video
                  size={15}
                />

                Watch
              </Link>
            </div>

            {/* MINI META */}

            <div
              className="
                mt-10
                flex
                flex-wrap
                gap-x-6
                gap-y-3
                text-[10px]
                uppercase
                tracking-[0.16em]
                text-white/25
              "
            >
              <span>
                Independent
              </span>

              <span>
                Direct-to-fan
              </span>

              <span>
                Music • Video • Live
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <main
        className="
          mx-auto
          w-full
          max-w-[1600px]
          px-5
          pb-24
          pt-8
          sm:px-8
          sm:pt-10
          lg:px-12
          xl:px-16
        "
      >
        {/* ==================================================
            TOP DISCOVERY STRIP
        ================================================== */}

        <section
          className="
            grid
            gap-4
            lg:grid-cols-[1.25fr_1fr]
          "
        >
          {/* FEATURED RELEASE */}

          <div
            className="
              group
              relative
              min-h-[300px]
              overflow-hidden
              rounded-[28px]
              border
              border-white/[0.07]
              bg-[#0a0a0d]
            "
          >
            <img
              src="/assets/soalogo.png"
              alt="Featured release"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                opacity-30
                transition
                duration-700
                group-hover:scale-[1.03]
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-black
                via-black/80
                to-black/20
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-72
                w-72
                rounded-full
                bg-blue-500/[0.09]
                blur-[100px]
              "
            />

            <div
              className="
                relative
                z-10
                flex
                min-h-[300px]
                flex-col
                justify-between
                p-6
                sm:p-8
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <span
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.23em]
                    text-violet-200/55
                  "
                >
                  Featured release
                </span>

                <span
                  className="
                    rounded-full
                    border
                    border-white/[0.08]
                    bg-black/30
                    px-3
                    py-1
                    text-[9px]
                    text-white/35
                    backdrop-blur-xl
                  "
                >
                  2026
                </span>
              </div>

              <div
                className="
                  max-w-md
                "
              >
                <p
                  className="
                    text-sm
                    text-white/35
                  "
                >
                  NOX
                </p>

                <h2
                  className="
                    mt-1
                    text-3xl
                    font-bold
                    tracking-[-0.04em]
                    sm:text-4xl
                  "
                >
                  Eternal Night
                </h2>

                <p
                  className="
                    mt-3
                    max-w-sm
                    text-xs
                    leading-6
                    text-white/40
                  "
                >
                  A cinematic late-night release built around
                  atmosphere, pressure and movement.
                </p>

                <button
                  type="button"
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:text-violet-200
                  "
                >
                  <CirclePlay
                    size={18}
                  />

                  Play release
                </button>
              </div>
            </div>
          </div>

          {/* STORIES */}

          <div
            className="
              rounded-[28px]
              border
              border-white/[0.07]
              bg-[#09090b]
              p-6
              sm:p-7
            "
          >
            <SectionTitle
              eyebrow="Community"
              title="Stories"
              action="Live feed"
            />

            <div
              className="
                mt-7
                flex
                gap-5
                overflow-x-auto
                pb-2
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {stories.map(
                story => (
                  <button
                    key={
                      story.name
                    }
                    type="button"
                    className="
                      group
                      flex
                      min-w-[68px]
                      flex-col
                      items-center
                    "
                  >
                    <div
                      className={`
                        rounded-full
                        p-[2px]

                        ${
                          story.active
                            ? `
                              bg-gradient-to-tr
                              from-blue-500
                              via-violet-500
                              to-purple-500
                            `
                            : `
                              bg-white/[0.10]
                            `
                        }
                      `}
                    >
                      <div
                        className="
                          rounded-full
                          bg-[#09090b]
                          p-[3px]
                        "
                      >
                        <div
                          className="
                            relative
                            h-14
                            w-14
                            overflow-hidden
                            rounded-full
                          "
                        >
                          <img
                            src={
                              story.image
                            }
                            alt={
                              story.name
                            }
                            className="
                              h-full
                              w-full
                              object-cover
                              transition
                              duration-300
                              group-hover:scale-105
                            "
                          />

                          {story.active && (
                            <span
                              className="
                                absolute
                                bottom-0
                                right-0
                                h-3
                                w-3
                                rounded-full
                                border-[3px]
                                border-[#09090b]
                                bg-violet-300
                              "
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className="
                        mt-2
                        max-w-[68px]
                        truncate
                        text-[9px]
                        text-white/35
                        transition
                        group-hover:text-white
                      "
                    >
                      {
                        story.name
                      }
                    </span>
                  </button>
                )
              )}
            </div>

            {/* POST PREVIEW */}

            <div
              className="
                mt-7
                border-t
                border-white/[0.06]
                pt-6
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.18em]
                      text-white/25
                    "
                  >
                    Latest post
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-medium
                      text-white/75
                    "
                  >
                    Inside the SOA world.
                  </p>
                </div>

                <ArrowUpRight
                  size={15}
                  className="text-white/25"
                />
              </div>

              <div
                className="
                  mt-4
                  grid
                  grid-cols-3
                  gap-2
                "
              >
                {[1, 2, 3].map(
                  item => (
                    <button
                      key={
                        item
                      }
                      type="button"
                      className="
                        group
                        relative
                        aspect-square
                        overflow-hidden
                        rounded-xl
                        border
                        border-white/[0.05]
                        bg-white/[0.02]
                      "
                    >
                      <img
                        src="/assets/soalogo.png"
                        alt={`Post ${item}`}
                        className="
                          h-full
                          w-full
                          object-cover
                          opacity-85
                          transition
                          duration-500
                          group-hover:scale-105
                        "
                      />

                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/60
                          to-transparent
                        "
                      />

                      <span
                        className="
                          absolute
                          bottom-2
                          left-2
                          flex
                          items-center
                          gap-1
                          text-[8px]
                          text-white/50
                        "
                      >
                        <Heart
                          size={9}
                        />

                        12.4K
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            POPULAR TRACKS
        ================================================== */}

        <section
          className="
            mt-14
          "
        >
          <LargeSectionHeader
            eyebrow="Popular now"
            title="Tracks"
            action="2026 Collection"
          />

          {/* DESKTOP */}

          <div
            className="
              mt-6
              hidden
              grid-cols-2
              gap-4
              sm:grid-cols-3
              md:grid
              xl:grid-cols-6
            "
          >
            {songs.map(
              (
                song,
                index
              ) => (
                <TrackCard
                  key={
                    song.title
                  }
                  song={
                    song
                  }
                  index={
                    index
                  }
                />
              )
            )}
          </div>

          {/* MOBILE */}

          <div
            className="
              mt-5
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.06]
              bg-[#09090b]
              md:hidden
            "
          >
            {songs.map(
              (
                song,
                index
              ) => (
                <MobileTrackRow
                  key={
                    song.title
                  }
                  song={
                    song
                  }
                  index={
                    index
                  }
                  last={
                    index ===
                    songs.length -
                      1
                  }
                />
              )
            )}
          </div>
        </section>

        {/* ==================================================
            EDITORIAL SPLIT
        ================================================== */}

        <section
          className="
            mt-16
            grid
            gap-6
            xl:grid-cols-[1.45fr_0.75fr]
          "
        >
          {/* MUSIC VIDEOS */}

          <div>
            <SectionTitle
              eyebrow="Visual archive"
              title="Music Videos"
              action="View all"
            />

            <div
              className="
                mt-5
                grid
                gap-4
                sm:grid-cols-2
              "
            >
              {videos.map(
                video => (
                  <VideoCard
                    key={
                      video.title
                    }
                    video={
                      video
                    }
                  />
                )
              )}
            </div>
          </div>

          {/* UPDATES */}

          <div>
            <SectionTitle
              eyebrow="Updates"
              title="Latest Drops"
              action="Live"
            />

            <div
              className="
                mt-5
                overflow-hidden
                rounded-[24px]
                border
                border-white/[0.07]
                bg-[#09090b]
              "
            >
              {updates.map(
                (
                  update,
                  index
                ) => (
                  <UpdateRow
                    key={
                      update.title
                    }
                    update={
                      update
                    }
                    last={
                      index ===
                      updates.length -
                        1
                    }
                  />
                )
              )}

              {/* MINI STATS */}

              <div
                className="
                  grid
                  grid-cols-3
                  border-t
                  border-white/[0.06]
                "
              >
                <MiniStat
                  label="Videos"
                  value="24"
                />

                <MiniStat
                  label="Streams"
                  value="8.4M"
                  border
                />

                <MiniStat
                  label="Fans"
                  value="112K"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            COMMUNITY BANNER
        ================================================== */}

        <section
          className="
            relative
            mt-16
            overflow-hidden
            rounded-[30px]
            border
            border-white/[0.07]
            bg-[#09090c]
            px-6
            py-10
            sm:px-10
            sm:py-12
            lg:px-12
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -left-24
              -top-24
              h-72
              w-72
              rounded-full
              bg-blue-600/[0.08]
              blur-[110px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-28
              right-10
              h-72
              w-72
              rounded-full
              bg-purple-600/[0.08]
              blur-[110px]
            "
          />

          <div
            className="
              relative
              z-10
              flex
              flex-col
              gap-8
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div
              className="
                max-w-2xl
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-violet-200/45
                "
              >
                <Radio
                  size={13}
                />

                Direct from SOA
              </div>

              <h2
                className="
                  mt-3
                  text-3xl
                  font-semibold
                  tracking-[-0.04em]
                  sm:text-4xl
                "
              >
                Music should feel closer
                to the people who make it.
              </h2>

              <p
                className="
                  mt-4
                  max-w-xl
                  text-sm
                  leading-7
                  text-white/40
                "
              >
                Follow releases, discover new visuals,
                catch live moments and support the artists
                directly.
              </p>
            </div>

            <div
              className="
                flex
                flex-wrap
                gap-3
              "
            >
              <Link
                href="/music"
                className="
                  inline-flex
                  h-11
                  items-center
                  gap-2
                  rounded-full
                  bg-white
                  px-5
                  text-sm
                  font-semibold
                  text-black
                  transition
                  hover:bg-violet-50
                "
              >
                Explore music

                <ArrowRight
                  size={14}
                />
              </Link>

              <Link
                href="/live"
                className="
                  inline-flex
                  h-11
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/[0.10]
                  bg-white/[0.025]
                  px-5
                  text-sm
                  font-medium
                  text-white/60
                  transition
                  hover:border-violet-400/25
                  hover:text-white
                "
              >
                Go live
              </Link>
            </div>
          </div>
        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer
          className="
            mt-16
            flex
            flex-col
            gap-6
            border-t
            border-white/[0.06]
            py-8
            text-[10px]
            text-white/25
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                font-medium
                tracking-[0.14em]
                text-white/40
              "
            >
              SOA MUSIC
            </p>

            <p
              className="
                mt-1
                text-white/20
              "
            >
              © 2026 SOA Music. All rights reserved.
            </p>
          </div>

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-5
            "
          >
            <button
              type="button"
              className="
                flex
                items-center
                gap-1.5
                transition
                hover:text-white
              "
            >
              <Instagram
                size={12}
              />

              Instagram
            </button>

            <button
              type="button"
              className="
                flex
                items-center
                gap-1.5
                transition
                hover:text-white
              "
            >
              <Youtube
                size={12}
              />

              YouTube
            </button>

            <Link
              href="/contact"
              className="
                transition
                hover:text-white
              "
            >
              Contact
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

// =========================================================
// LARGE SECTION HEADER
// =========================================================

function LargeSectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action: string;
}) {
  return (
    <div
      className="
        flex
        items-end
        justify-between
        gap-5
        border-b
        border-white/[0.06]
        pb-5
      "
    >
      <div>
        <p
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.25em]
            text-violet-200/45
          "
        >
          {eyebrow}
        </p>

        <h2
          className="
            mt-1
            text-3xl
            font-semibold
            tracking-[-0.04em]
          "
        >
          {title}
        </h2>
      </div>

      <span
        className="
          text-[9px]
          uppercase
          tracking-[0.17em]
          text-white/20
        "
      >
        {action}
      </span>
    </div>
  );
}

// =========================================================
// SECTION TITLE
// =========================================================

function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action: string;
}) {
  return (
    <div
      className="
        flex
        items-end
        justify-between
        gap-4
      "
    >
      <div>
        <p
          className="
            text-[9px]
            font-medium
            uppercase
            tracking-[0.22em]
            text-violet-200/40
          "
        >
          {eyebrow}
        </p>

        <h2
          className="
            mt-1
            text-lg
            font-semibold
            tracking-tight
          "
        >
          {title}
        </h2>
      </div>

      <span
        className="
          text-[9px]
          uppercase
          tracking-[0.14em]
          text-white/20
        "
      >
        {action}
      </span>
    </div>
  );
}

// =========================================================
// TRACK CARD
// =========================================================

function TrackCard({
  song,
  index,
}: {
  song: Song;
  index: number;
}) {
  return (
    <button
      type="button"
      className="
        group
        text-left
      "
    >
      <div
        className="
          relative
          aspect-square
          overflow-hidden
          rounded-[20px]
          border
          border-white/[0.06]
          bg-[#09090b]
        "
      >
        <img
          src={
            song.image
          }
          alt={
            song.title
          }
          className="
            h-full
            w-full
            object-cover
            transition
            duration-700
            group-hover:scale-[1.04]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/90
            via-black/10
            to-transparent
          "
        />

        {/* NUMBER */}

        <span
          className="
            absolute
            left-3
            top-3
            text-[9px]
            tabular-nums
            text-white/30
          "
        >
          {String(
            index + 1
          ).padStart(
            2,
            "0"
          )}
        </span>

        {/* PLAY */}

        <div
          className="
            absolute
            bottom-3
            right-3
            flex
            h-9
            w-9
            translate-y-2
            items-center
            justify-center
            rounded-full
            bg-white
            text-black
            opacity-0
            shadow-xl
            transition
            duration-300
            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >
          <Play
            size={13}
            fill="currentColor"
            className="ml-px"
          />
        </div>

        <div
          className="
            absolute
            bottom-3
            left-3
            right-14
          "
        >
          <p
            className="
              truncate
              text-xs
              font-semibold
            "
          >
            {
              song.title
            }
          </p>

          <p
            className="
              mt-1
              truncate
              text-[9px]
              text-white/35
            "
          >
            {
              song.artist
            }
          </p>
        </div>
      </div>

      <div
        className="
          mt-2
          flex
          items-center
          justify-between
          gap-2
          px-1
        "
      >
        <span
          className="
            text-[9px]
            text-white/25
          "
        >
          {song.year}
        </span>

        <span
          className="
            flex
            items-center
            gap-1
            text-[9px]
            text-white/25
          "
        >
          <Heart
            size={9}
          />

          {formatCompact(
            song.likes
          )}
        </span>
      </div>
    </button>
  );
}

// =========================================================
// MOBILE TRACK
// =========================================================

function MobileTrackRow({
  song,
  index,
  last,
}: {
  song: Song;
  index: number;
  last: boolean;
}) {
  return (
    <button
      type="button"
      className={`
        group
        relative
        flex
        w-full
        items-center
        gap-3
        px-4
        py-3
        text-left
        transition
        hover:bg-white/[0.035]

        ${
          !last
            ? `
              border-b
              border-white/[0.05]
            `
            : ""
        }
      `}
    >
      <span
        className="
          w-5
          shrink-0
          text-center
          text-[9px]
          tabular-nums
          text-white/20
        "
      >
        {String(
          index + 1
        ).padStart(
          2,
          "0"
        )}
      </span>

      <img
        src={
          song.image
        }
        alt={
          song.title
        }
        className="
          h-11
          w-11
          shrink-0
          rounded-xl
          object-cover
        "
      />

      <div
        className="
          min-w-0
          flex-1
        "
      >
        <p
          className="
            truncate
            text-sm
            font-medium
            text-white/80
          "
        >
          {
            song.title
          }
        </p>

        <p
          className="
            mt-1
            truncate
            text-[9px]
            text-white/25
          "
        >
          {song.artist}
          {" • "}
          {song.year}
        </p>
      </div>

      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-white/[0.07]
          bg-white/[0.025]
          text-violet-200/60
        "
      >
        <Play
          size={11}
          fill="currentColor"
        />
      </div>
    </button>
  );
}

// =========================================================
// VIDEO
// =========================================================

function VideoCard({
  video,
}: {
  video: VideoItem;
}) {
  return (
    <button
      type="button"
      className="
        group
        overflow-hidden
        rounded-[22px]
        border
        border-white/[0.06]
        bg-[#09090b]
        text-left
        transition
        hover:border-violet-400/15
      "
    >
      <div
        className="
          relative
          aspect-video
          overflow-hidden
        "
      >
        <img
          src={
            video.image
          }
          alt={
            video.title
          }
          className="
            h-full
            w-full
            object-cover
            transition
            duration-700
            group-hover:scale-105
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/75
            via-transparent
            to-transparent
          "
        />

        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              scale-90
              items-center
              justify-center
              rounded-full
              bg-white
              text-black
              opacity-0
              shadow-xl
              transition
              duration-300
              group-hover:scale-100
              group-hover:opacity-100
            "
          >
            <Play
              size={15}
              fill="currentColor"
              className="ml-px"
            />
          </div>
        </div>

        <span
          className="
            absolute
            bottom-3
            right-3
            rounded-md
            bg-black/75
            px-2
            py-1
            text-[9px]
            text-white/70
            backdrop-blur-md
          "
        >
          {
            video.length
          }
        </span>
      </div>

      <div
        className="
          p-4
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                text-sm
                font-semibold
                tracking-wide
                text-white/85
              "
            >
              {
                video.title
              }
            </p>

            <p
              className="
                mt-1
                text-[9px]
                text-white/25
              "
            >
              SOA Visuals
            </p>
          </div>

          <span
            className="
              text-[9px]
              text-white/25
            "
          >
            {
              video.year
            }
          </span>
        </div>

        <div
          className="
            mt-3
            flex
            items-center
            gap-2
            text-[9px]
            text-white/25
          "
        >
          <Eye
            size={10}
          />

          {
            video.views
          } views
        </div>
      </div>
    </button>
  );
}

// =========================================================
// UPDATE
// =========================================================

function UpdateRow({
  update,
  last,
}: {
  update: UpdateItem;
  last: boolean;
}) {
  return (
    <button
      type="button"
      className={`
        group
        relative
        w-full
        p-5
        text-left
        transition
        hover:bg-white/[0.025]

        ${
          !last
            ? `
              border-b
              border-white/[0.05]
            `
            : ""
        }
      `}
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div>
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                rounded-full
                border
                border-violet-400/15
                bg-violet-500/[0.05]
                px-2
                py-1
                text-[8px]
                font-medium
                tracking-[0.12em]
                text-violet-100/50
              "
            >
              {
                update.tag
              }
            </span>

            <span
              className="
                flex
                items-center
                gap-1
                text-[8px]
                text-white/20
              "
            >
              <CalendarDays
                size={9}
              />

              {
                update.date
              }
            </span>
          </div>

          <p
            className="
              mt-3
              text-sm
              font-medium
              text-white/70
              transition
              group-hover:text-white
            "
          >
            {
              update.title
            }
          </p>

          <p
            className="
              mt-2
              text-[10px]
              leading-5
              text-white/30
            "
          >
            {
              update.description
            }
          </p>
        </div>

        <ArrowUpRight
          size={14}
          className="
            mt-1
            shrink-0
            text-white/15
            transition
            group-hover:text-violet-200/60
          "
        />
      </div>
    </button>
  );
}

// =========================================================
// MINI STAT
// =========================================================

function MiniStat({
  label,
  value,
  border = false,
}: {
  label: string;
  value: string;
  border?: boolean;
}) {
  return (
    <div
      className={`
        px-3
        py-4
        text-center

        ${
          border
            ? `
              border-x
              border-white/[0.05]
            `
            : ""
        }
      `}
    >
      <p
        className="
          text-sm
          font-semibold
          text-white/75
        "
      >
        {value}
      </p>

      <p
        className="
          mt-1
          text-[8px]
          uppercase
          tracking-[0.13em]
          text-white/20
        "
      >
        {label}
      </p>
    </div>
  );
}

// =========================================================
// FORMAT
// =========================================================

function formatCompact(
  value: number
) {
  if (
    value >=
    1_000_000
  ) {
    return `${(
      value /
      1_000_000
    ).toFixed(1)}M`;
  }

  if (
    value >=
    1000
  ) {
    return `${(
      value /
      1000
    ).toFixed(1)}K`;
  }

  return value.toString();
}