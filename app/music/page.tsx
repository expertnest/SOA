"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  Clock3,
  Disc3,
  Heart,
  Instagram,
  MapPin,
  MoreHorizontal,
  Music2,
  Pause,
  Play,
  Radio,
  ShoppingBag,
  Sparkles,
  Twitter,
  Youtube,
} from "lucide-react";

// =========================================================
// TYPES
// =========================================================

type ReleaseFilter =
  | "all"
  | "albums"
  | "eps"
  | "singles";

type ReleaseItem = {
  title: string;
  year: number;
  image: string;
  tracks?: number;
  type:
    | "album"
    | "ep"
    | "single";
};

type TrackItem = {
  id: number;
  name: string;
  album: string;
  type:
    | "album"
    | "ep"
    | "single";
  plays: string;
  duration: string;
  image: string;
};

type MerchItem = {
  name: string;
  price: string;
  image: string;
};

type ShowItem = {
  city: string;
  venue: string;
  date: string;
};

// =========================================================
// PAGE
// =========================================================

export default function Music() {
  // ======================================================
  // STATE
  // ======================================================

  const [
    filter,
    setFilter,
  ] =
    useState<ReleaseFilter>(
      "all"
    );

  const [
    followed,
    setFollowed,
  ] = useState(false);

  const [
    playingTrackId,
    setPlayingTrackId,
  ] = useState<
    number | null
  >(null);

  // ======================================================
  // ARTIST
  // ======================================================

  const artist = {
    name: "Nox",
    handle: "@noxsounds",
    genre:
      "Electronic / Trap",
    bio:
      "Nox creates immersive late-night soundscapes blending cinematic synths, ambient textures, and futuristic trap energy.",
    heroImage:
      "/headerLogo.png",
  };

  // ======================================================
  // FEATURED TRACKS
  // ======================================================

  const tracks: TrackItem[] =
    [
      {
        id: 1,
        name:
          "Midnight Echoes",
        album:
          "Afterglow",
        type: "album",
        plays: "12.4M",
        duration: "3:12",
        image:
          "/album1.jpg",
      },

      {
        id: 2,
        name:
          "Neon Drift",
        album:
          "Neon Drift",
        type: "single",
        plays: "9.1M",
        duration: "2:58",
        image:
          "/album2.jpg",
      },

      {
        id: 3,
        name:
          "Lost Signals",
        album:
          "Static Dreams",
        type: "ep",
        plays: "7.6M",
        duration: "3:44",
        image:
          "/album3.jpg",
      },

      {
        id: 4,
        name:
          "Cold Atmosphere",
        album:
          "Cold Atmosphere",
        type: "single",
        plays: "6.2M",
        duration: "4:01",
        image:
          "/album1.jpg",
      },
    ];

  // ======================================================
  // RELEASES
  // ======================================================

  const releases: ReleaseItem[] =
    [
      {
        title:
          "Afterglow",
        year: 2024,
        tracks: 12,
        image:
          "/album1.jpg",
        type: "album",
      },

      {
        title:
          "Neon Drift",
        year: 2023,
        tracks: 10,
        image:
          "/album2.jpg",
        type: "album",
      },

      {
        title:
          "Static Dreams",
        year: 2022,
        tracks: 9,
        image:
          "/album3.jpg",
        type: "album",
      },

      {
        title:
          "Static Dreams",
        year: 2022,
        tracks: 6,
        image:
          "/album3.jpg",
        type: "ep",
      },

      {
        title:
          "After Hours",
        year: 2021,
        tracks: 5,
        image:
          "/album2.jpg",
        type: "ep",
      },

      {
        title:
          "Neon Drift",
        year: 2023,
        image:
          "/album2.jpg",
        type: "single",
      },

      {
        title:
          "Cold Atmosphere",
        year: 2024,
        image:
          "/album1.jpg",
        type: "single",
      },
    ];

  // ======================================================
  // MERCH
  // ======================================================

  const merch: MerchItem[] =
    [
      {
        name:
          "Afterglow Hoodie",
        price: "$80",
        image:
          "/merch1.jpg",
      },

      {
        name:
          "Nox Vinyl",
        price: "$35",
        image:
          "/merch2.jpg",
      },

      {
        name:
          "Static Tee",
        price: "$45",
        image:
          "/merch3.jpg",
      },
    ];

  // ======================================================
  // TOUR
  // ======================================================

  const upcomingShows: ShowItem[] =
    [
      {
        city:
          "Los Angeles",
        venue:
          "The Novo",
        date:
          "JUN 12",
      },

      {
        city:
          "New York",
        venue:
          "Brooklyn Mirage",
        date:
          "JUN 20",
      },

      {
        city:
          "Tokyo",
        venue:
          "Zepp Shinjuku",
        date:
          "JUL 08",
      },
    ];

  // ======================================================
  // SOCIAL
  // ======================================================

  const socialImages = [
    "/ig1.jpg",
    "/ig2.jpg",
    "/ig3.jpg",
    "/ig4.jpg",
  ];

  // ======================================================
  // FILTER RELEASES
  // ======================================================

  const filteredReleases =
    useMemo(() => {
      if (
        filter === "all"
      ) {
        return releases;
      }

      if (
        filter === "albums"
      ) {
        return releases.filter(
          release =>
            release.type ===
            "album"
        );
      }

      if (
        filter === "eps"
      ) {
        return releases.filter(
          release =>
            release.type ===
            "ep"
        );
      }

      return releases.filter(
        release =>
          release.type ===
          "single"
      );
    }, [filter]);

  // ======================================================
  // FEATURED RELEASE
  // ======================================================

  const latestRelease =
    releases[0];

  // ======================================================
  // PLAY STATE
  // ======================================================

  const handleTrackPlay = (
    id: number
  ) => {
    setPlayingTrackId(
      previous =>
        previous === id
          ? null
          : id
    );
  };

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
          AMBIENCE
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
            top-[-160px]
            h-[520px]
            w-[520px]
            rounded-full
            bg-blue-600/[0.05]
            blur-[180px]
          "
        />

        <div
          className="
            absolute
            right-[-200px]
            top-[26%]
            h-[520px]
            w-[520px]
            rounded-full
            bg-violet-600/[0.045]
            blur-[190px]
          "
        />
      </div>

      {/* ==================================================
          HERO
      ================================================== */}

      <section
        className="
          relative
          min-h-[620px]
          overflow-hidden
          border-b
          border-white/[0.06]
          sm:min-h-[680px]
          xl:min-h-[760px]
        "
      >
        {/* ARTIST IMAGE */}

        <img
          src={
            artist.heroImage
          }
          alt={
            artist.name
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

        {/* DARK OVERLAYS */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/95
            via-black/50
            to-black/20
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#050506]
            via-black/20
            to-black/15
          "
        />

        {/* AMBIENT LIGHT */}

        <div
          className="
            pointer-events-none
            absolute
            -left-32
            top-[20%]
            h-[400px]
            w-[400px]
            rounded-full
            bg-blue-600/[0.12]
            blur-[140px]
          "
        />

        <div
          className="
            pointer-events-none
            bottom-[-150px]
            right-[15%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-purple-600/[0.10]
            blur-[150px]
          "
        />

        {/* GRID TEXTURE */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.018]
            [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]
            [background-size:52px_52px]
          "
        />

        {/* HERO CONTENT */}

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[620px]
            w-full
            max-w-[1550px]
            items-end
            px-5
            pb-10
            pt-24
            sm:min-h-[680px]
            sm:px-8
            sm:pb-14
            lg:px-10
            xl:min-h-[760px]
            xl:px-12
            xl:pb-16
          "
        >
          <div
            className="
              grid
              w-full
              gap-10
              lg:grid-cols-[1fr_340px]
              xl:grid-cols-[1fr_380px]
              lg:items-end
            "
          >
            {/* ==============================================
                ARTIST IDENTITY
            ============================================== */}

            <div
              className="
                max-w-4xl
              "
            >
              {/* EYEBROW */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-violet-400/18
                    bg-violet-500/[0.055]
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
                  <BadgeCheck
                    size={11}
                  />

                  SOA Artist
                </span>

                <span
                  className="
                    rounded-full
                    border
                    border-white/[0.08]
                    bg-black/25
                    px-3
                    py-1.5
                    text-[9px]
                    uppercase
                    tracking-[0.15em]
                    text-white/35
                    backdrop-blur-xl
                  "
                >
                  {
                    artist.genre
                  }
                </span>
              </div>

              {/* NAME */}

              <h1
                className="
                  mt-5
                  text-6xl
                  font-black
                  leading-[0.88]
                  tracking-[-0.065em]
                  sm:text-7xl
                  lg:text-[92px]
                  xl:text-[110px]
                "
              >
                {
                  artist.name
                }
              </h1>

              {/* BIO */}

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
                {
                  artist.bio
                }
              </p>

              {/* ACTIONS */}

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    handleTrackPlay(
                      tracks[0].id
                    )
                  }
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
                    hover:bg-violet-50
                    active:scale-[0.98]
                  "
                >
                  {playingTrackId ===
                  tracks[0].id ? (
                    <Pause
                      size={15}
                      fill="currentColor"
                    />
                  ) : (
                    <Play
                      size={15}
                      fill="currentColor"
                      className="ml-px"
                    />
                  )}

                  {playingTrackId ===
                  tracks[0].id
                    ? "Pause"
                    : "Play"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFollowed(
                      previous =>
                        !previous
                    )
                  }
                  className={`
                    inline-flex
                    h-12
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-5
                    text-sm
                    font-medium
                    backdrop-blur-xl
                    transition

                    ${
                      followed
                        ? `
                          border-violet-400/20
                          bg-violet-500/[0.10]
                          text-violet-100
                        `
                        : `
                          border-white/[0.12]
                          bg-black/25
                          text-white/65
                          hover:bg-white/[0.05]
                          hover:text-white
                        `
                    }
                  `}
                >
                  <Heart
                    size={15}
                    fill={
                      followed
                        ? "currentColor"
                        : "none"
                    }
                  />

                  {followed
                    ? "Following"
                    : "Follow"}
                </button>

                <button
                  type="button"
                  aria-label="More artist options"
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/[0.10]
                    bg-black/25
                    text-white/40
                    backdrop-blur-xl
                    transition
                    hover:bg-white/[0.05]
                    hover:text-white
                  "
                >
                  <MoreHorizontal
                    size={17}
                  />
                </button>
              </div>

              {/* ARTIST META */}

              <div
                className="
                  mt-8
                  flex
                  flex-wrap
                  gap-x-6
                  gap-y-2
                  text-[9px]
                  uppercase
                  tracking-[0.15em]
                  text-white/22
                "
              >
                <span>
                  Electronic
                </span>

                <span>
                  Independent
                </span>

                <span>
                  SOA Music
                </span>
              </div>
            </div>

            {/* ==============================================
                LATEST RELEASE
            ============================================== */}

            <div
              className="
                hidden
                rounded-[24px]
                border
                border-white/[0.08]
                bg-black/30
                p-4
                backdrop-blur-2xl
                lg:block
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >
                <div>
                  <p
                    className="
                      text-[8px]
                      font-medium
                      uppercase
                      tracking-[0.17em]
                      text-violet-200/45
                    "
                  >
                    Latest release
                  </p>

                  <p
                    className="
                      mt-1
                      text-[9px]
                      text-white/22
                    "
                  >
                    Now available
                  </p>
                </div>

                <ArrowUpRight
                  size={14}
                  className="text-white/20"
                />
              </div>

              <div
                className="
                  mt-4
                  overflow-hidden
                  rounded-[18px]
                  border
                  border-white/[0.08]
                "
              >
                <img
                  src={
                    latestRelease.image
                  }
                  alt={
                    latestRelease.title
                  }
                  className="
                    aspect-square
                    w-full
                    object-cover
                  "
                />
              </div>

              <div
                className="
                  mt-4
                  flex
                  items-end
                  justify-between
                  gap-4
                "
              >
                <div>
                  <p
                    className="
                      text-lg
                      font-semibold
                    "
                  >
                    {
                      latestRelease.title
                    }
                  </p>

                  <p
                    className="
                      mt-1
                      text-[9px]
                      text-white/25
                    "
                  >
                    Album •{" "}
                    {
                      latestRelease.year
                    }{" "}
                    •{" "}
                    {
                      latestRelease.tracks
                    }{" "}
                    tracks
                  </p>
                </div>

                <button
                  type="button"
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-black
                    transition
                    hover:scale-105
                  "
                >
                  <Play
                    size={13}
                    fill="currentColor"
                    className="ml-px"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          MAIN CONTENT
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
          sm:px-8
          lg:px-10
          xl:px-12
        "
      >
        {/* ==================================================
            MOBILE LATEST RELEASE
        ================================================== */}

        <section
          className="
            mt-6
            lg:hidden
          "
        >
          <div
            className="
              flex
              items-center
              gap-4
              rounded-[20px]
              border
              border-white/[0.06]
              bg-white/[0.02]
              p-3
            "
          >
            <img
              src={
                latestRelease.image
              }
              alt={
                latestRelease.title
              }
              className="
                h-20
                w-20
                shrink-0
                rounded-[14px]
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
                  text-[8px]
                  uppercase
                  tracking-[0.15em]
                  text-violet-200/35
                "
              >
                Latest release
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-sm
                  font-semibold
                "
              >
                {
                  latestRelease.title
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
                  latestRelease.year
                }{" "}
                •{" "}
                {
                  latestRelease.tracks
                }{" "}
                tracks
              </p>
            </div>

            <button
              type="button"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white
                text-black
              "
            >
              <Play
                size={13}
                fill="currentColor"
              />
            </button>
          </div>
        </section>

        {/* ==================================================
            POPULAR TRACKS
        ================================================== */}

        <section
          className="
            mt-12
          "
        >
          <SectionHeader
            eyebrow="Listener favorites"
            title="Popular"
            action="View all"
          />

          <div
            className="
              mt-5
              overflow-hidden
              rounded-[22px]
              border
              border-white/[0.06]
              bg-[#09090b]
            "
          >
            {tracks.map(
              (
                track,
                index
              ) => (
                <PopularTrackRow
                  key={
                    track.id
                  }
                  track={
                    track
                  }
                  index={
                    index
                  }
                  playing={
                    playingTrackId ===
                    track.id
                  }
                  last={
                    index ===
                    tracks.length -
                      1
                  }
                  onPlay={() =>
                    handleTrackPlay(
                      track.id
                    )
                  }
                />
              )
            )}
          </div>
        </section>

        {/* ==================================================
            DISCOGRAPHY
        ================================================== */}

        <section
          className="
            mt-14
          "
        >
          <div
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
              <p
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.20em]
                  text-violet-200/35
                "
              >
                Discography
              </p>

              <h2
                className="
                  mt-1
                  text-3xl
                  font-semibold
                  tracking-[-0.04em]
                "
              >
                Releases
              </h2>
            </div>

            {/* FILTERS */}

            <div
              className="
                flex
                gap-2
                overflow-x-auto
                pb-1
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              <FilterButton
                active={
                  filter ===
                  "all"
                }
                onClick={() =>
                  setFilter(
                    "all"
                  )
                }
              >
                All
              </FilterButton>

              <FilterButton
                active={
                  filter ===
                  "albums"
                }
                onClick={() =>
                  setFilter(
                    "albums"
                  )
                }
              >
                Albums
              </FilterButton>

              <FilterButton
                active={
                  filter ===
                  "eps"
                }
                onClick={() =>
                  setFilter(
                    "eps"
                  )
                }
              >
                EPs
              </FilterButton>

              <FilterButton
                active={
                  filter ===
                  "singles"
                }
                onClick={() =>
                  setFilter(
                    "singles"
                  )
                }
              >
                Singles
              </FilterButton>
            </div>
          </div>

          {/* RELEASE SHELF */}

          <div
            className="
              mt-6
              flex
              gap-4
              overflow-x-auto
              pb-5
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {filteredReleases.map(
              (
                release,
                index
              ) => (
                <ReleaseCard
                  key={`${release.title}-${release.year}-${index}`}
                  release={
                    release
                  }
                />
              )
            )}
          </div>
        </section>

        {/* ==================================================
            ARTIST WORLD
        ================================================== */}

        <section
          className="
            mt-14
            grid
            gap-5
            xl:grid-cols-[1.25fr_0.75fr]
          "
        >
          {/* ==============================================
              ABOUT
          ============================================== */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[28px]
              border
              border-white/[0.07]
              bg-[#09090c]
              p-6
              sm:p-8
              lg:p-9
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-64
                w-64
                rounded-full
                bg-violet-600/[0.07]
                blur-[100px]
              "
            />

            <div
              className="
                relative
                z-10
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[9px]
                  uppercase
                  tracking-[0.18em]
                  text-violet-200/35
                "
              >
                <Sparkles
                  size={11}
                />

                The artist
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
                Inside the world
                of {artist.name}.
              </h2>

              <p
                className="
                  mt-5
                  max-w-2xl
                  text-sm
                  leading-7
                  text-white/38
                "
              >
                {
                  artist.bio
                }
              </p>

              <p
                className="
                  mt-4
                  max-w-2xl
                  text-sm
                  leading-7
                  text-white/28
                "
              >
                Built around atmosphere,
                digital textures and
                nocturnal energy, the
                music exists somewhere
                between intimate
                headphones and a massive
                live room.
              </p>

              <div
                className="
                  mt-7
                  flex
                  items-center
                  gap-4
                  text-white/28
                "
              >
                <button
                  type="button"
                  className="
                    transition
                    hover:text-white
                  "
                  aria-label="Instagram"
                >
                  <Instagram
                    size={17}
                  />
                </button>

                <button
                  type="button"
                  className="
                    transition
                    hover:text-white
                  "
                  aria-label="Twitter"
                >
                  <Twitter
                    size={17}
                  />
                </button>

                <button
                  type="button"
                  className="
                    transition
                    hover:text-white
                  "
                  aria-label="YouTube"
                >
                  <Youtube
                    size={17}
                  />
                </button>

                <span
                  className="
                    ml-1
                    text-[10px]
                    text-white/20
                  "
                >
                  {
                    artist.handle
                  }
                </span>
              </div>
            </div>
          </div>

          {/* ==============================================
              LISTENING CARD
          ============================================== */}

          <div
            className="
              flex
              flex-col
              justify-between
              rounded-[28px]
              border
              border-white/[0.07]
              bg-[#09090c]
              p-6
              sm:p-8
            "
          >
            <div>
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
                <Radio
                  size={18}
                />
              </div>

              <p
                className="
                  mt-6
                  text-[9px]
                  uppercase
                  tracking-[0.18em]
                  text-violet-200/35
                "
              >
                Start here
              </p>

              <h3
                className="
                  mt-2
                  text-2xl
                  font-semibold
                  tracking-[-0.035em]
                "
              >
                This is {artist.name}.
              </h3>

              <p
                className="
                  mt-3
                  text-xs
                  leading-6
                  text-white/28
                "
              >
                A quick path through
                the essential releases
                and tracks.
              </p>
            </div>

            <button
              type="button"
              className="
                mt-8
                flex
                items-center
                justify-between
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.025]
                px-4
                py-3
                text-xs
                font-medium
                text-white/55
                transition
                hover:border-violet-400/18
                hover:bg-violet-500/[0.04]
                hover:text-white
              "
            >
              Play artist radio

              <ArrowRight
                size={14}
              />
            </button>
          </div>
        </section>

        {/* ==================================================
            MERCH + TOUR
        ================================================== */}

        <section
          className="
            mt-14
            grid
            gap-10
            border-t
            border-white/[0.06]
            pt-10
            lg:grid-cols-[1.1fr_0.9fr]
          "
        >
          {/* ==============================================
              MERCH
          ============================================== */}

          <div>
            <SectionHeader
              eyebrow="Official store"
              title="Merch"
              action="Shop all"
            />

            <div
              className="
                mt-5
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-3
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
              TOUR
          ============================================== */}

          <div>
            <SectionHeader
              eyebrow="Live"
              title="Tour Dates"
              action="All dates"
            />

            <div
              className="
                mt-5
                overflow-hidden
                rounded-[22px]
                border
                border-white/[0.06]
                bg-[#09090b]
              "
            >
              {upcomingShows.map(
                (
                  show,
                  index
                ) => (
                  <TourRow
                    key={`${show.city}-${show.date}`}
                    show={
                      show
                    }
                    last={
                      index ===
                      upcomingShows.length -
                        1
                    }
                  />
                )
              )}
            </div>
          </div>
        </section>

        {/* ==================================================
            VISUAL DIARY
        ================================================== */}

        <section
          className="
            mt-14
          "
        >
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
                  uppercase
                  tracking-[0.20em]
                  text-violet-200/35
                "
              >
                Visual diary
              </p>

              <h2
                className="
                  mt-1
                  text-3xl
                  font-semibold
                  tracking-[-0.04em]
                "
              >
                {
                  artist.handle
                }
              </h2>
            </div>

            <div
              className="
                flex
                items-center
                gap-3
                text-white/22
              "
            >
              <Instagram
                size={15}
              />

              <span
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.13em]
                "
              >
                Follow
              </span>
            </div>
          </div>

          <div
            className="
              mt-5
              grid
              grid-cols-2
              gap-3
              sm:grid-cols-4
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
                    rounded-[18px]
                    border
                    border-white/[0.06]
                  "
                  aria-label={`Open social post ${
                    index + 1
                  }`}
                >
                  <img
                    src={
                      image
                    }
                    alt={`${artist.name} social ${index + 1}`}
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

                  <ArrowUpRight
                    size={15}
                    className="
                      absolute
                      right-3
                      top-3
                      translate-y-1
                      text-white
                      opacity-0
                      transition
                      group-hover:translate-y-0
                      group-hover:opacity-70
                    "
                  />
                </button>
              )
            )}
          </div>
        </section>

        {/* ==================================================
            FINAL FOLLOW CTA
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
            py-12
            text-center
            sm:px-10
            sm:py-16
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-0
              h-72
              w-72
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-violet-600/[0.10]
              blur-[120px]
            "
          />

          <div
            className="
              relative
              z-10
            "
          >
            <div
              className="
                mx-auto
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-violet-400/12
                bg-violet-500/[0.045]
                text-violet-200/45
              "
            >
              <Music2
                size={18}
              />
            </div>

            <h2
              className="
                mx-auto
                mt-5
                max-w-2xl
                text-3xl
                font-semibold
                tracking-[-0.04em]
                sm:text-4xl
              "
            >
              Stay close to{" "}
              {
                artist.name
              }.
            </h2>

            <p
              className="
                mx-auto
                mt-3
                max-w-lg
                text-sm
                leading-6
                text-white/30
              "
            >
              New music, visuals,
              merch drops and live
              dates — all in one
              place.
            </p>

            <button
              type="button"
              onClick={() =>
                setFollowed(
                  previous =>
                    !previous
                )
              }
              className={`
                mt-7
                inline-flex
                h-12
                items-center
                gap-2
                rounded-full
                px-6
                text-sm
                font-semibold
                transition
                active:scale-[0.98]

                ${
                  followed
                    ? `
                      border
                      border-violet-400/20
                      bg-violet-500/[0.09]
                      text-violet-100
                    `
                    : `
                      bg-white
                      text-black
                      hover:bg-violet-50
                    `
                }
              `}
            >
              <Heart
                size={15}
                fill={
                  followed
                    ? "currentColor"
                    : "none"
                }
              />

              {followed
                ? `Following ${artist.name}`
                : `Follow ${artist.name}`}
            </button>
          </div>
        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer
          className="
            mt-12
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
            {
              artist.name
            }{" "}
            • SOA Music
          </span>

          <span>
            Music • Visuals •
            Live • Merch
          </span>
        </footer>
      </div>
    </div>
  );
}

// =========================================================
// POPULAR TRACK
// =========================================================

function PopularTrackRow({
  track,
  index,
  playing,
  last,
  onPlay,
}: {
  track: TrackItem;
  index: number;
  playing: boolean;
  last: boolean;
  onPlay: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onPlay
      }
      className={`
        group
        grid
        w-full
        grid-cols-[34px_48px_minmax(0,1fr)_auto]
        items-center
        gap-3
        px-4
        py-3
        text-left
        transition
        hover:bg-white/[0.03]
        sm:grid-cols-[34px_48px_minmax(0,1fr)_100px_55px_auto]

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
      {/* NUMBER */}

      <div
        className="
          flex
          items-center
          justify-center
        "
      >
        {playing ? (
          <div
            className="
              flex
              h-4
              items-end
              gap-[2px]
            "
          >
            <span
              className="
                h-2
                w-[2px]
                rounded-full
                bg-blue-300
              "
            />

            <span
              className="
                h-4
                w-[2px]
                rounded-full
                bg-violet-300
              "
            />

            <span
              className="
                h-3
                w-[2px]
                rounded-full
                bg-purple-300
              "
            />
          </div>
        ) : (
          <span
            className="
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
        )}
      </div>

      {/* ART */}

      <img
        src={
          track.image
        }
        alt={
          track.album
        }
        className="
          h-12
          w-12
          rounded-xl
          object-cover
        "
      />

      {/* INFO */}

      <div
        className="
          min-w-0
        "
      >
        <p
          className={`
            truncate
            text-sm
            font-medium

            ${
              playing
                ? "text-violet-100"
                : "text-white/70 group-hover:text-white"
            }
          `}
        >
          {
            track.name
          }
        </p>

        <p
          className="
            mt-1
            truncate
            text-[9px]
            text-white/23
          "
        >
          {
            track.album
          }
        </p>
      </div>

      {/* PLAYS */}

      <span
        className="
          hidden
          text-[10px]
          tabular-nums
          text-white/22
          sm:block
        "
      >
        {
          track.plays
        }
      </span>

      {/* DURATION */}

      <span
        className="
          hidden
          text-[10px]
          tabular-nums
          text-white/22
          sm:block
        "
      >
        {
          track.duration
        }
      </span>

      {/* PLAY */}

      <div
        className={`
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          transition

          ${
            playing
              ? `
                bg-violet-200
                text-black
              `
              : `
                bg-white/[0.035]
                text-white/28
                group-hover:bg-white
                group-hover:text-black
              `
          }
        `}
      >
        {playing ? (
          <Pause
            size={11}
            fill="currentColor"
          />
        ) : (
          <Play
            size={11}
            fill="currentColor"
            className="ml-px"
          />
        )}
      </div>
    </button>
  );
}

// =========================================================
// RELEASE CARD
// =========================================================

function ReleaseCard({
  release,
}: {
  release: ReleaseItem;
}) {
  return (
    <button
      type="button"
      className="
        group
        w-[170px]
        shrink-0
        text-left
        sm:w-[190px]
        xl:w-[210px]
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
            release.image
          }
          alt={
            release.title
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
            from-black/70
            via-transparent
            to-transparent
            opacity-70
          "
        />

        <div
          className="
            absolute
            bottom-3
            right-3
            flex
            h-10
            w-10
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
      </div>

      <div
        className="
          px-1
          pt-3
        "
      >
        <p
          className="
            truncate
            text-sm
            font-semibold
            text-white/78
            transition
            group-hover:text-white
          "
        >
          {
            release.title
          }
        </p>

        <p
          className="
            mt-1
            text-[9px]
            text-white/22
          "
        >
          {release.year}
          {" • "}
          {formatReleaseType(
            release.type
          )}

          {release.tracks
            ? ` • ${release.tracks} tracks`
            : ""}
        </p>
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
            item.image
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
            transition
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
// TOUR ROW
// =========================================================

function TourRow({
  show,
  last,
}: {
  show: ShowItem;
  last: boolean;
}) {
  return (
    <button
      type="button"
      className={`
        group
        flex
        w-full
        items-center
        justify-between
        gap-5
        px-5
        py-5
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
          items-center
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
            border-violet-400/10
            bg-violet-500/[0.035]
            text-violet-200/35
          "
        >
          <CalendarDays
            size={16}
          />
        </div>

        <div>
          <p
            className="
              text-sm
              font-medium
              text-white/65
              group-hover:text-white
            "
          >
            {
              show.city
            }
          </p>

          <p
            className="
              mt-1
              flex
              items-center
              gap-1
              text-[9px]
              text-white/22
            "
          >
            <MapPin
              size={9}
            />

            {
              show.venue
            }
          </p>
        </div>
      </div>

      <div
        className="
          flex
          items-center
          gap-4
        "
      >
        <span
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.13em]
            text-violet-200/55
          "
        >
          {
            show.date
          }
        </span>

        <ArrowUpRight
          size={13}
          className="
            text-white/15
            transition
            group-hover:text-white/50
          "
        />
      </div>
    </button>
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
// FILTER
// =========================================================

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children:
    React.ReactNode;
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
// RELEASE TYPE
// =========================================================

function formatReleaseType(
  type: ReleaseItem["type"]
) {
  switch (type) {
    case "album":
      return "Album";

    case "ep":
      return "EP";

    case "single":
      return "Single";

    default:
      return "Release";
  }
}