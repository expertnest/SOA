"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Clock3,
  Eye,
  Film,
  Flame,
  Heart,
  Instagram,
  Pause,
  Play,
  ShoppingBag,
  Sparkles,
  ThumbsUp,
  Video as VideoIcon,
  X,
  Youtube,
} from "lucide-react";

// =========================================================
// TYPES
// =========================================================

type SortType =
  | "popular"
  | "newest"
  | "liked";

type VideoItem = {
  title: string;
  year: number;
  views: number;
  likes: number;
  thumbnail: string;
  src: string;
  type:
    | "official"
    | "film"
    | "visualizer"
    | "live";
  duration: string;
  description: string;
};

type MerchItem = {
  name: string;
  price: string;
  img: string;
};

// =========================================================
// DATA
// =========================================================

const videos: VideoItem[] = [
  {
    title:
      "Neon Nights (Official Video)",
    year: 2024,
    views: 42_000_000,
    likes: 1_200_000,
    thumbnail:
      "/vid1.jpg",
    src:
      "/video1.mp4",
    type:
      "official",
    duration:
      "3:48",
    description:
      "A neon-soaked visual world built around the energy of Neon Nights.",
  },

  {
    title:
      "Afterglow (Short Film)",
    year: 2023,
    views: 28_000_000,
    likes: 890_000,
    thumbnail:
      "/vid2.jpg",
    src:
      "/video2.mp4",
    type:
      "film",
    duration:
      "7:14",
    description:
      "A cinematic short film expanding the world behind Afterglow.",
  },

  {
    title:
      "Static Dreams Visualizer",
    year: 2022,
    views: 18_000_000,
    likes: 640_000,
    thumbnail:
      "/vid3.jpg",
    src:
      "/video3.mp4",
    type:
      "visualizer",
    duration:
      "3:31",
    description:
      "A surreal visual interpretation of Static Dreams.",
  },

  {
    title:
      "Live @ Tokyo",
    year: 2024,
    views: 12_000_000,
    likes: 510_000,
    thumbnail:
      "/vid4.jpg",
    src:
      "/video4.mp4",
    type:
      "live",
    duration:
      "18:52",
    description:
      "A live performance captured in Tokyo.",
  },
];

const merch: MerchItem[] = [
  {
    name:
      "Neon Hoodie",
    price:
      "$80",
    img:
      "/m1.jpg",
  },

  {
    name:
      "Tour Tee",
    price:
      "$45",
    img:
      "/m2.jpg",
  },

  {
    name:
      "Vinyl LP",
    price:
      "$35",
    img:
      "/m3.jpg",
  },

  {
    name:
      "Cap",
    price:
      "$30",
    img:
      "/m4.jpg",
  },
];

const socialImages = [
  "/ig1.jpg",
  "/ig2.jpg",
  "/ig3.jpg",
  "/ig4.jpg",
];

// =========================================================
// PAGE
// =========================================================

export default function Videos() {
  // ======================================================
  // STATE
  // ======================================================

  const [
    sort,
    setSort,
  ] =
    useState<SortType>(
      "popular"
    );

  const [
    activeVideo,
    setActiveVideo,
  ] =
    useState<VideoItem | null>(
      null
    );

  // ======================================================
  // SORT
  // ======================================================

  const sortedVideos =
    useMemo(() => {
      return [
        ...videos,
      ].sort(
        (
          a,
          b
        ) => {
          if (
            sort ===
            "popular"
          ) {
            return (
              b.views -
              a.views
            );
          }

          if (
            sort ===
            "newest"
          ) {
            return (
              b.year -
              a.year
            );
          }

          return (
            b.likes -
            a.likes
          );
        }
      );
    }, [sort]);

  // ======================================================
  // FEATURED
  // ======================================================

  const featuredVideo =
    videos[0];

  const remainingVideos =
    sortedVideos.filter(
      video =>
        video.title !==
        featuredVideo.title
    );

  // ======================================================
  // COMPUTED STATS
  // ======================================================

  const totalViews =
    videos.reduce(
      (
        total,
        video
      ) =>
        total +
        video.views,
      0
    );

  const totalLikes =
    videos.reduce(
      (
        total,
        video
      ) =>
        total +
        video.likes,
      0
    );

  // ======================================================
  // ESC CLOSE
  // ======================================================

  useEffect(() => {
    const handler = (
      event: KeyboardEvent
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        setActiveVideo(
          null
        );
      }
    };

    window.addEventListener(
      "keydown",
      handler
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handler
      );
  }, []);

  // ======================================================
  // UI
  // ======================================================

  return (
    <div
      className="
        relative
        w-full
        bg-[#050506]
        text-white
      "
    >
      {/* ==================================================
          AMBIENT BACKGROUND
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -left-40
            -top-40
            h-[520px]
            w-[520px]
            rounded-full
            bg-blue-600/[0.045]
            blur-[180px]
          "
        />

        <div
          className="
            absolute
            -right-52
            top-[32%]
            h-[540px]
            w-[540px]
            rounded-full
            bg-violet-600/[0.05]
            blur-[190px]
          "
        />
      </div>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1550px]
          px-5
          pb-28
          pt-7
          sm:px-8
          lg:px-10
          xl:px-12
        "
      >
        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <header
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <div
              className="
                flex
                items-center
                gap-2
                text-[9px]
                font-medium
                uppercase
                tracking-[0.21em]
                text-violet-200/40
              "
            >
              <Film
                size={12}
              />

              SOA Visuals
            </div>

            <h1
              className="
                mt-2
                text-4xl
                font-black
                tracking-[-0.055em]
                sm:text-5xl
                lg:text-6xl
              "
            >
              Watch the
              <span
                className="
                  bg-gradient-to-r
                  from-blue-100
                  via-violet-100
                  to-purple-300
                  bg-clip-text
                  text-transparent
                "
              >
                {" "}
                music.
              </span>
            </h1>

            <p
              className="
                mt-3
                max-w-xl
                text-sm
                leading-6
                text-white/35
              "
            >
              Official videos,
              cinematic films,
              visualizers and live
              performances from the
              SOA world.
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-5
              text-[10px]
              text-white/25
            "
          >
            <div>
              <span
                className="
                  font-semibold
                  text-white/60
                "
              >
                {
                  videos.length
                }
              </span>{" "}
              films
            </div>

            <div>
              <span
                className="
                  font-semibold
                  text-white/60
                "
              >
                {formatCompact(
                  totalViews
                )}
              </span>{" "}
              views
            </div>
          </div>
        </header>

        {/* ==================================================
            FEATURED PREMIERE
        ================================================== */}

        <section
          className="
            relative
            mt-7
            min-h-[480px]
            overflow-hidden
            rounded-[32px]
            border
            border-white/[0.07]
            bg-[#09090d]
            sm:min-h-[560px]
            xl:min-h-[640px]
          "
        >
          {/* BACKGROUND */}

          <img
            src={
              featuredVideo.thumbnail
            }
            alt={
              featuredVideo.title
            }
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-center
            "
          />

          {/* DARK LAYERS */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-black/95
              via-black/55
              to-black/15
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/90
              via-transparent
              to-black/15
            "
          />

          {/* GLOW */}

          <div
            className="
              pointer-events-none
              absolute
              -left-20
              top-16
              h-80
              w-80
              rounded-full
              bg-blue-600/[0.12]
              blur-[120px]
            "
          />

          <div
            className="
              pointer-events-none
              -bottom-24
              right-[20%]
              absolute
              h-80
              w-80
              rounded-full
              bg-violet-600/[0.11]
              blur-[120px]
            "
          />

          {/* GRID */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-[0.02]
              [background-image:linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px)]
              [background-size:50px_50px]
            "
          />

          {/* CONTENT */}

          <div
            className="
              relative
              z-10
              flex
              min-h-[480px]
              flex-col
              justify-between
              p-6
              sm:min-h-[560px]
              sm:p-8
              lg:p-10
              xl:min-h-[640px]
              xl:p-12
            "
          >
            {/* TOP */}

            <div
              className="
                flex
                items-start
                justify-between
                gap-4
              "
            >
              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-violet-300/18
                  bg-black/30
                  px-3
                  py-1.5
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.17em]
                  text-violet-100/60
                  backdrop-blur-xl
                "
              >
                <Sparkles
                  size={10}
                />

                Featured Visual
              </span>

              <span
                className="
                  hidden
                  rounded-full
                  border
                  border-white/[0.10]
                  bg-black/25
                  px-3
                  py-1.5
                  text-[8px]
                  uppercase
                  tracking-[0.14em]
                  text-white/35
                  backdrop-blur-xl
                  sm:block
                "
              >
                Official Video
              </span>
            </div>

            {/* BOTTOM */}

            <div
              className="
                flex
                flex-col
                gap-8
                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >
              <div
                className="
                  max-w-3xl
                "
              >
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-3
                    text-[9px]
                    uppercase
                    tracking-[0.13em]
                    text-white/28
                  "
                >
                  <span>
                    {
                      featuredVideo.year
                    }
                  </span>

                  <span>
                    •
                  </span>

                  <span>
                    {
                      featuredVideo.duration
                    }
                  </span>

                  <span>
                    •
                  </span>

                  <span>
                    {formatVideoType(
                      featuredVideo.type
                    )}
                  </span>
                </div>

                <h2
                  className="
                    mt-3
                    max-w-3xl
                    text-4xl
                    font-black
                    leading-[0.97]
                    tracking-[-0.055em]
                    sm:text-5xl
                    lg:text-6xl
                    xl:text-7xl
                  "
                >
                  {
                    featuredVideo.title
                  }
                </h2>

                <p
                  className="
                    mt-5
                    max-w-xl
                    text-sm
                    leading-7
                    text-white/38
                  "
                >
                  {
                    featuredVideo.description
                  }
                </p>

                {/* META */}

                <div
                  className="
                    mt-5
                    flex
                    flex-wrap
                    gap-4
                    text-[10px]
                    text-white/28
                  "
                >
                  <span
                    className="
                      flex
                      items-center
                      gap-1.5
                    "
                  >
                    <Eye
                      size={11}
                    />

                    {formatCompact(
                      featuredVideo.views
                    )}{" "}
                    views
                  </span>

                  <span
                    className="
                      flex
                      items-center
                      gap-1.5
                    "
                  >
                    <ThumbsUp
                      size={11}
                    />

                    {formatCompact(
                      featuredVideo.likes
                    )}
                  </span>
                </div>
              </div>

              {/* PLAY */}

              <button
                type="button"
                onClick={() =>
                  setActiveVideo(
                    featuredVideo
                  )
                }
                className="
                  group
                  inline-flex
                  h-13
                  w-fit
                  items-center
                  gap-3
                  rounded-full
                  bg-white
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  text-black
                  shadow-2xl
                  transition
                  hover:scale-[1.02]
                  hover:bg-violet-50
                  active:scale-[0.98]
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
                    bg-black
                    text-white
                  "
                >
                  <Play
                    size={11}
                    fill="currentColor"
                    className="ml-px"
                  />
                </span>

                Watch now

                <ArrowRight
                  size={14}
                  className="
                    transition-transform
                    group-hover:translate-x-0.5
                  "
                />
              </button>
            </div>
          </div>
        </section>

        {/* ==================================================
            VIDEO SNAPSHOT
        ================================================== */}

        <section
          className="
            mt-4
            grid
            gap-3
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          <MiniMetric
            icon={
              <Eye
                size={15}
              />
            }
            label="Combined views"
            value={
              formatCompact(
                totalViews
              )
            }
          />

          <MiniMetric
            icon={
              <Heart
                size={15}
              />
            }
            label="Combined likes"
            value={
              formatCompact(
                totalLikes
              )
            }
          />

          <MiniMetric
            icon={
              <Film
                size={15}
              />
            }
            label="Visual archive"
            value={
              `${videos.length}`
            }
          />

          <MiniMetric
            icon={
              <Flame
                size={15}
              />
            }
            label="Latest year"
            value={
              `${Math.max(
                ...videos.map(
                  video =>
                    video.year
                )
              )}`
            }
          />
        </section>

        {/* ==================================================
            WATCH NEXT
        ================================================== */}

        <section
          className="
            mt-14
          "
        >
          <SectionHeader
            eyebrow="Visual Archive"
            title="Watch next"
            action="All visuals"
          />

          {/* SORT */}

          <div
            className="
              mt-6
              flex
              gap-2
              overflow-x-auto
              pb-1
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            <SortButton
              active={
                sort ===
                "popular"
              }
              onClick={() =>
                setSort(
                  "popular"
                )
              }
            >
              Popular
            </SortButton>

            <SortButton
              active={
                sort ===
                "newest"
              }
              onClick={() =>
                setSort(
                  "newest"
                )
              }
            >
              Newest
            </SortButton>

            <SortButton
              active={
                sort ===
                "liked"
              }
              onClick={() =>
                setSort(
                  "liked"
                )
              }
            >
              Most Liked
            </SortButton>
          </div>

          {/* GRID */}

          <div
            className="
              mt-6
              grid
              gap-x-4
              gap-y-9
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {sortedVideos.map(
              video => (
                <VideoCard
                  key={
                    video.title
                  }
                  video={
                    video
                  }
                  onOpen={() =>
                    setActiveVideo(
                      video
                    )
                  }
                />
              )
            )}
          </div>
        </section>

        {/* ==================================================
            EDITORIAL FEATURE
        ================================================== */}

        {remainingVideos[0] && (
          <section
            className="
              mt-16
              overflow-hidden
              rounded-[30px]
              border
              border-white/[0.07]
              bg-[#09090c]
            "
          >
            <div
              className="
                grid
                lg:grid-cols-[1.1fr_0.9fr]
              "
            >
              {/* IMAGE */}

              <button
                type="button"
                onClick={() =>
                  setActiveVideo(
                    remainingVideos[0]
                  )
                }
                className="
                  group
                  relative
                  min-h-[320px]
                  overflow-hidden
                  text-left
                  lg:min-h-[480px]
                "
              >
                <img
                  src={
                    remainingVideos[0]
                      .thumbnail
                  }
                  alt={
                    remainingVideos[0]
                      .title
                  }
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-700
                    group-hover:scale-[1.025]
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/75
                    via-black/5
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
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-black
                      shadow-2xl
                      transition
                      duration-300
                      group-hover:scale-110
                    "
                  >
                    <Play
                      size={18}
                      fill="currentColor"
                      className="ml-1"
                    />
                  </div>
                </div>

                <span
                  className="
                    absolute
                    bottom-5
                    left-5
                    rounded-full
                    border
                    border-white/[0.10]
                    bg-black/30
                    px-3
                    py-1.5
                    text-[8px]
                    uppercase
                    tracking-[0.14em]
                    text-white/45
                    backdrop-blur-xl
                  "
                >
                  {
                    remainingVideos[0]
                      .duration
                  }
                </span>
              </button>

              {/* COPY */}

              <div
                className="
                  flex
                  flex-col
                  justify-center
                  border-t
                  border-white/[0.06]
                  p-7
                  sm:p-9
                  lg:border-l
                  lg:border-t-0
                  lg:p-11
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-violet-400/12
                    bg-violet-500/[0.04]
                    text-violet-200/45
                  "
                >
                  <VideoIcon
                    size={18}
                  />
                </div>

                <p
                  className="
                    mt-6
                    text-[9px]
                    uppercase
                    tracking-[0.19em]
                    text-violet-200/35
                  "
                >
                  Cinema
                </p>

                <h2
                  className="
                    mt-2
                    text-3xl
                    font-semibold
                    tracking-[-0.04em]
                    sm:text-4xl
                  "
                >
                  {
                    remainingVideos[0]
                      .title
                  }
                </h2>

                <p
                  className="
                    mt-4
                    max-w-lg
                    text-sm
                    leading-7
                    text-white/32
                  "
                >
                  {
                    remainingVideos[0]
                      .description
                  }
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setActiveVideo(
                      remainingVideos[0]
                    )
                  }
                  className="
                    mt-6
                    inline-flex
                    w-fit
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:text-violet-200
                  "
                >
                  Watch film

                  <ArrowRight
                    size={14}
                  />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================
            MERCH + COMMUNITY
        ================================================== */}

        <section
          className="
            mt-16
            grid
            gap-8
            xl:grid-cols-[1.1fr_0.9fr]
          "
        >
          {/* ==============================================
              MERCH
          ============================================== */}

          <div>
            <SectionHeader
              eyebrow="From the world"
              title="Shop the visuals"
              action="View store"
            />

            <div
              className="
                mt-5
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-4
              "
            >
              {merch.map(
                item => (
                  <MerchCard
                    key={
                      item.name
                    }
                    item={
                      item
                    }
                  />
                )
              )}
            </div>
          </div>

          {/* ==============================================
              COMMUNITY
          ============================================== */}

          <div>
            <SectionHeader
              eyebrow="Community"
              title="Inside the world"
              action="@noxsounds"
            />

            <div
              className="
                mt-5
                overflow-hidden
                rounded-[24px]
                border
                border-white/[0.06]
                bg-[#09090b]
              "
            >
              {/* SOCIAL GRID */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-px
                  bg-white/[0.05]
                "
              >
                {socialImages.map(
                  (
                    image,
                    index
                  ) => (
                    <button
                      key={
                        image
                      }
                      type="button"
                      className="
                        group
                        relative
                        aspect-square
                        overflow-hidden
                        bg-[#09090b]
                      "
                      aria-label={`Open social post ${
                        index + 1
                      }`}
                    >
                      <img
                        src={
                          image
                        }
                        alt={`Social post ${
                          index + 1
                        }`}
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
                          bg-black/0
                          transition
                          group-hover:bg-black/25
                        "
                      />

                      <Instagram
                        size={14}
                        className="
                          absolute
                          right-3
                          top-3
                          text-white
                          opacity-0
                          transition
                          group-hover:opacity-60
                        "
                      />
                    </button>
                  )
                )}
              </div>

              {/* COMMUNITY CTA */}

              <div
                className="
                  border-t
                  border-white/[0.06]
                  p-5
                "
              >
                <div
                  className="
                    rounded-2xl
                    border
                    border-violet-400/10
                    bg-gradient-to-br
                    from-violet-500/[0.045]
                    to-transparent
                    p-5
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-violet-100/55
                    "
                  >
                    <Sparkles
                      size={14}
                    />

                    <p
                      className="
                        text-xs
                        font-semibold
                      "
                    >
                      Fan Community
                    </p>
                  </div>

                  <p
                    className="
                      mt-3
                      text-[10px]
                      leading-5
                      text-white/27
                    "
                  >
                    Exclusive demos,
                    early drops,
                    unreleased visual
                    material and private
                    live moments.
                  </p>

                  <button
                    type="button"
                    className="
                      mt-5
                      inline-flex
                      h-10
                      items-center
                      gap-2
                      rounded-full
                      bg-white
                      px-4
                      text-[10px]
                      font-semibold
                      text-black
                      transition
                      hover:bg-violet-50
                    "
                  >
                    Join community

                    <ArrowRight
                      size={12}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            YOUTUBE CTA
        ================================================== */}

        <section
          className="
            relative
            mt-16
            overflow-hidden
            rounded-[28px]
            border
            border-white/[0.07]
            bg-[#09090c]
            p-7
            sm:p-9
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-28
              h-72
              w-72
              rounded-full
              bg-violet-600/[0.08]
              blur-[110px]
            "
          />

          <div
            className="
              relative
              z-10
              flex
              flex-col
              gap-6
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div
              className="
                flex
                items-start
                gap-4
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  text-white/45
                "
              >
                <Youtube
                  size={19}
                />
              </div>

              <div>
                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.17em]
                    text-violet-200/35
                  "
                >
                  SOA Visuals
                </p>

                <h2
                  className="
                    mt-1
                    text-2xl
                    font-semibold
                    tracking-[-0.035em]
                  "
                >
                  Follow every visual
                  release.
                </h2>

                <p
                  className="
                    mt-2
                    max-w-lg
                    text-xs
                    leading-6
                    text-white/28
                  "
                >
                  Music videos,
                  behind-the-scenes
                  films and performances
                  can live here and
                  across SOA channels.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="
                inline-flex
                h-11
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-white/[0.08]
                bg-white/[0.03]
                px-5
                text-xs
                font-medium
                text-white/55
                transition
                hover:border-violet-400/18
                hover:bg-violet-500/[0.05]
                hover:text-white
              "
            >
              Open channel

              <ArrowUpRight
                size={13}
              />
            </button>
          </div>
        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer
          className="
            mt-14
            flex
            flex-col
            gap-2
            border-t
            border-white/[0.05]
            py-7
            text-[9px]
            text-white/18
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <span>
            SOA Music • Visuals
          </span>

          <span>
            Official videos • Films
            • Live performances
          </span>
        </footer>
      </div>

      {/* ==================================================
          VIDEO PLAYER MODAL
      ================================================== */}

      {activeVideo && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/85
            p-3
            backdrop-blur-xl
            sm:p-6
          "
          onClick={() =>
            setActiveVideo(
              null
            )
          }
        >
          <div
            className="
              relative
              w-full
              max-w-6xl
              overflow-hidden
              rounded-[24px]
              border
              border-white/[0.10]
              bg-[#050506]
              shadow-2xl
              shadow-black
            "
            onClick={
              event =>
                event.stopPropagation()
            }
          >
            {/* CLOSE */}

            <button
              type="button"
              onClick={() =>
                setActiveVideo(
                  null
                )
              }
              aria-label="Close video"
              className="
                absolute
                right-3
                top-3
                z-20
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-white/[0.10]
                bg-black/60
                text-white/55
                backdrop-blur-xl
                transition
                hover:bg-white
                hover:text-black
              "
            >
              <X
                size={16}
              />
            </button>

            {/* VIDEO */}

            <div
              className="
                bg-black
              "
            >
              <video
                src={
                  activeVideo.src
                }
                controls
                autoPlay
                playsInline
                className="
                  max-h-[72vh]
                  w-full
                  bg-black
                  object-contain
                "
              />
            </div>

            {/* INFO */}

            <div
              className="
                flex
                flex-col
                gap-5
                border-t
                border-white/[0.06]
                p-5
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:p-6
              "
            >
              <div>
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-[8px]
                    uppercase
                    tracking-[0.15em]
                    text-violet-200/35
                  "
                >
                  <Film
                    size={10}
                  />

                  {formatVideoType(
                    activeVideo.type
                  )}
                </div>

                <h3
                  className="
                    mt-2
                    text-lg
                    font-semibold
                    sm:text-xl
                  "
                >
                  {
                    activeVideo.title
                  }
                </h3>

                <div
                  className="
                    mt-2
                    flex
                    flex-wrap
                    gap-3
                    text-[9px]
                    text-white/25
                  "
                >
                  <span>
                    {
                      activeVideo.year
                    }
                  </span>

                  <span>
                    {
                      activeVideo.duration
                    }
                  </span>

                  <span>
                    {formatCompact(
                      activeVideo.views
                    )}{" "}
                    views
                  </span>
                </div>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <button
                  type="button"
                  className="
                    inline-flex
                    h-10
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/[0.07]
                    bg-white/[0.025]
                    px-4
                    text-[10px]
                    text-white/45
                    transition
                    hover:text-white
                  "
                >
                  <Heart
                    size={13}
                  />

                  {formatCompact(
                    activeVideo.likes
                  )}
                </button>

                <button
                  type="button"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/[0.07]
                    bg-white/[0.025]
                    text-white/35
                    transition
                    hover:text-white
                  "
                >
                  <ArrowUpRight
                    size={14}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================
// VIDEO CARD
// =========================================================

function VideoCard({
  video,
  onOpen,
}: {
  video: VideoItem;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onOpen
      }
      className="
        group
        text-left
      "
    >
      {/* THUMBNAIL */}

      <div
        className="
          relative
          aspect-video
          overflow-hidden
          rounded-[20px]
          border
          border-white/[0.06]
          bg-[#09090b]
          transition
          group-hover:border-violet-400/15
        "
      >
        <img
          src={
            video.thumbnail
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
            group-hover:scale-[1.035]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/80
            via-transparent
            to-black/10
          "
        />

        {/* TYPE */}

        <span
          className="
            absolute
            left-3
            top-3
            rounded-full
            border
            border-white/[0.09]
            bg-black/40
            px-2.5
            py-1
            text-[8px]
            uppercase
            tracking-[0.12em]
            text-white/45
            backdrop-blur-xl
          "
        >
          {formatVideoType(
            video.type
          )}
        </span>

        {/* DURATION */}

        <span
          className="
            absolute
            bottom-3
            right-3
            rounded-md
            bg-black/75
            px-2
            py-1
            text-[8px]
            tabular-nums
            text-white/65
            backdrop-blur-md
          "
        >
          {
            video.duration
          }
        </span>

        {/* PLAY */}

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
              h-12
              w-12
              scale-90
              items-center
              justify-center
              rounded-full
              bg-white
              text-black
              opacity-0
              shadow-2xl
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
      </div>

      {/* INFO */}

      <div
        className="
          px-1
          pt-3
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
          <h3
            className="
              line-clamp-2
              text-sm
              font-semibold
              leading-5
              text-white/75
              transition
              group-hover:text-white
            "
          >
            {
              video.title
            }
          </h3>

          <ArrowUpRight
            size={13}
            className="
              mt-1
              shrink-0
              text-white/12
              transition
              group-hover:text-violet-200/55
            "
          />
        </div>

        <div
          className="
            mt-2
            flex
            flex-wrap
            items-center
            gap-2
            text-[9px]
            text-white/20
          "
        >
          <span>
            {
              video.year
            }
          </span>

          <span>
            •
          </span>

          <span>
            {formatCompact(
              video.views
            )}{" "}
            views
          </span>

          <span>
            •
          </span>

          <span>
            {formatCompact(
              video.likes
            )}{" "}
            likes
          </span>
        </div>
      </div>
    </button>
  );
}

// =========================================================
// MERCH CARD
// =========================================================

function MerchCard({
  item,
}: {
  item: MerchItem;
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
          rounded-[18px]
          border
          border-white/[0.06]
        "
      >
        <img
          src={
            item.img
          }
          alt={
            item.name
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
            from-black/65
            via-transparent
            to-transparent
            opacity-50
          "
        />

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
          <ShoppingBag
            size={13}
          />
        </div>
      </div>

      <p
        className="
          mt-3
          truncate
          text-xs
          font-medium
          text-white/65
          transition
          group-hover:text-white
        "
      >
        {
          item.name
        }
      </p>

      <p
        className="
          mt-1
          text-[9px]
          text-white/22
        "
      >
        {
          item.price
        }
      </p>
    </button>
  );
}

// =========================================================
// MINI METRIC
// =========================================================

function MiniMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-2xl
        border
        border-white/[0.055]
        bg-white/[0.016]
        p-4
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-violet-400/10
          bg-violet-500/[0.035]
          text-violet-200/35
        "
      >
        {icon}
      </div>

      <div>
        <p
          className="
            text-sm
            font-semibold
            text-white/65
          "
        >
          {value}
        </p>

        <p
          className="
            mt-1
            text-[8px]
            uppercase
            tracking-[0.11em]
            text-white/20
          "
        >
          {label}
        </p>
      </div>
    </div>
  );
}

// =========================================================
// SECTION HEADER
// =========================================================

function SectionHeader({
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
      "
    >
      <div>
        <p
          className="
            text-[9px]
            font-medium
            uppercase
            tracking-[0.20em]
            text-violet-200/35
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

      <button
        type="button"
        className="
          flex
          items-center
          gap-1
          text-[9px]
          uppercase
          tracking-[0.12em]
          text-white/20
          transition
          hover:text-white/60
        "
      >
        {action}

        <ChevronRight
          size={13}
        />
      </button>
    </div>
  );
}

// =========================================================
// SORT BUTTON
// =========================================================

function SortButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        whitespace-nowrap
        rounded-full
        border
        px-4
        py-2
        text-[10px]
        font-medium
        transition

        ${
          active
            ? `
              border-violet-400/18
              bg-violet-500/[0.08]
              text-violet-100
            `
            : `
              border-white/[0.06]
              bg-white/[0.018]
              text-white/35
              hover:border-white/[0.10]
              hover:bg-white/[0.04]
              hover:text-white/70
            `
        }
      `}
    >
      {children}
    </button>
  );
}

// =========================================================
// VIDEO TYPE
// =========================================================

function formatVideoType(
  type: VideoItem["type"]
) {
  switch (type) {
    case "official":
      return "Official Video";

    case "film":
      return "Short Film";

    case "visualizer":
      return "Visualizer";

    case "live":
      return "Live";

    default:
      return "Video";
  }
}

// =========================================================
// COMPACT NUMBER
// =========================================================

function formatCompact(
  value: number
) {
  if (
    value >=
    1_000_000_000
  ) {
    return `${(
      value /
      1_000_000_000
    ).toFixed(1)}B`;
  }

  if (
    value >=
    1_000_000
  ) {
    return `${(
      value /
      1_000_000
    ).toFixed(
      value >=
      100_000_000
        ? 0
        : 1
    )}M`;
  }

  if (
    value >=
    1_000
  ) {
    return `${(
      value /
      1_000
    ).toFixed(1)}K`;
  }

  return value.toString();
}