"use client";

import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Disc3,
  Film,
  Globe2,
  Headphones,
  Heart,
  Instagram,
  MoonStar,
  Music2,
  Play,
  Radio,
  ShoppingBag,
  Sparkles,
  Twitter,
  Users,
  Waves,
  Youtube,
} from "lucide-react";

import type { ReactNode } from "react";

// =========================================================
// TYPES
// =========================================================

type TimelineItem = {
  year: string;
  title: string;
  text: string;
};

type MerchItem = {
  name: string;
  price: string;
  image: string;
  type: string;
};

type SocialItem = {
  name: string;
  handle: string;
  icon: ReactNode;
};

type SoundTrait = {
  title: string;
  description: string;
  icon: ReactNode;
};

// =========================================================
// DATA
// =========================================================

const artist = {
  name: "Nox",

  handle:
    "@noxsounds",

  genre:
    "Electronic / Trap",

  heroImage:
    "/headerLogo.png",

  portrait:
    "/headerLogo.png",

  bio:
    "Nox creates immersive late-night soundscapes blending cinematic synths, ambient textures, emotional melodies and futuristic trap production.",

  statement:
    "The goal is not just to make songs. It is to build a place you can disappear into.",
};

const timeline: TimelineItem[] = [
  {
    year: "2022",

    title:
      "Static Dreams",

    text:
      "The first chapter established the darker atmospheric language behind the project.",
  },

  {
    year: "2023",

    title:
      "Neon Drift",

    text:
      "The sound expanded into brighter synth work, harder drums and a more defined visual identity.",
  },

  {
    year: "2024",

    title:
      "Afterglow",

    text:
      "A more cinematic era began, connecting music, artwork and visual storytelling into one world.",
  },

  {
    year: "2026",

    title:
      "The next world",

    text:
      "The project expands beyond releases into live experiences, direct fan connection and the wider SOA universe.",
  },
];

const soundTraits: SoundTrait[] = [
  {
    title:
      "Atmosphere",

    description:
      "Wide synths, negative space and environments designed to feel larger than the song itself.",

    icon: (
      <Waves
        size={18}
      />
    ),
  },

  {
    title:
      "Pressure",

    description:
      "Heavy drums, sub energy and production built to move between headphones and live rooms.",

    icon: (
      <Radio
        size={18}
      />
    ),
  },

  {
    title:
      "Emotion",

    description:
      "Melody and texture remain at the center even when the production becomes aggressive.",

    icon: (
      <MoonStar
        size={18}
      />
    ),
  },
];

const merch: MerchItem[] = [
  {
    name:
      "Afterglow Hoodie",

    price:
      "$80",

    image:
      "/merch1.jpg",

    type:
      "Apparel",
  },

  {
    name:
      "Neon Drift Tee",

    price:
      "$45",

    image:
      "/merch2.jpg",

    type:
      "Apparel",
  },

  {
    name:
      "Static Vinyl",

    price:
      "$35",

    image:
      "/merch3.jpg",

    type:
      "Physical Music",
  },
];

const socials: SocialItem[] = [
  {
    name:
      "Instagram",

    handle:
      "@noxsounds",

    icon: (
      <Instagram
        size={17}
      />
    ),
  },

  {
    name:
      "YouTube",

    handle:
      "Nox Official",

    icon: (
      <Youtube
        size={17}
      />
    ),
  },

  {
    name:
      "Twitter / X",

    handle:
      "@noxsounds",

    icon: (
      <Twitter
        size={17}
      />
    ),
  },
];

// =========================================================
// PAGE
// =========================================================

export default function About() {
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
          BACKGROUND AMBIENCE
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
            top-[28%]
            h-[540px]
            w-[540px]
            rounded-full
            bg-violet-600/[0.045]
            blur-[190px]
          "
        />

        <div
          className="
            absolute
            bottom-[-240px]
            left-[30%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-purple-600/[0.035]
            blur-[180px]
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
          sm:min-h-[690px]
          xl:min-h-[780px]
        "
      >
        {/* HERO IMAGE */}

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

        {/* OVERLAYS */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/95
            via-black/55
            to-black/20
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#050506]
            via-black/15
            to-black/20
          "
        />

        {/* GLOW */}

        <div
          className="
            pointer-events-none
            absolute
            -left-28
            top-[20%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-blue-600/[0.12]
            blur-[140px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-40
            right-[15%]
            h-[430px]
            w-[430px]
            rounded-full
            bg-violet-600/[0.10]
            blur-[150px]
          "
        />

        {/* GRID */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.018]
            [background-image:linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px)]
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
            pb-12
            pt-28
            sm:min-h-[690px]
            sm:px-8
            sm:pb-16
            lg:px-10
            xl:min-h-[780px]
            xl:px-12
            xl:pb-20
          "
        >
          <div
            className="
              max-w-5xl
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
                  gap-2
                  rounded-full
                  border
                  border-violet-400/18
                  bg-violet-500/[0.055]
                  px-3
                  py-1.5
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-violet-100/55
                  backdrop-blur-xl
                "
              >
                <Sparkles
                  size={10}
                />

                About The Artist
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
                  text-white/30
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
                sm:text-8xl
                lg:text-[110px]
                xl:text-[130px]
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
                  hover:bg-violet-50
                  active:scale-[0.98]
                "
              >
                <Play
                  size={15}
                  fill="currentColor"
                  className="ml-px"
                />

                Listen now

                <ArrowRight
                  size={14}
                  className="
                    transition-transform
                    group-hover:translate-x-0.5
                  "
                />
              </Link>

              <Link
                href="/contact"
                className="
                  inline-flex
                  h-12
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/[0.11]
                  bg-black/25
                  px-5
                  text-sm
                  font-medium
                  text-white/60
                  backdrop-blur-xl
                  transition
                  hover:border-violet-400/20
                  hover:bg-white/[0.05]
                  hover:text-white
                "
              >
                Contact / Booking
              </Link>
            </div>

            {/* META */}

            <div
              className="
                mt-9
                flex
                flex-wrap
                gap-x-6
                gap-y-2
                text-[9px]
                uppercase
                tracking-[0.15em]
                text-white/20
              "
            >
              <span>
                SOA Music
              </span>

              <span>
                Independent
              </span>

              <span>
                Artist • Producer
              </span>

              <span>
                {
                  artist.handle
                }
              </span>
            </div>
          </div>
        </div>
      </section>

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
          sm:px-8
          lg:px-10
          xl:px-12
        "
      >
        {/* ==================================================
            ARTIST STATEMENT
        ================================================== */}

        <section
          className="
            py-16
            sm:py-20
            lg:py-24
          "
        >
          <div
            className="
              mx-auto
              max-w-5xl
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-violet-400/12
                bg-violet-500/[0.04]
                text-violet-200/40
              "
            >
              <Music2
                size={17}
              />
            </div>

            <p
              className="
                mt-6
                text-[9px]
                font-medium
                uppercase
                tracking-[0.22em]
                text-violet-200/30
              "
            >
              Artist statement
            </p>

            <blockquote
              className="
                mx-auto
                mt-4
                max-w-4xl
                text-3xl
                font-semibold
                leading-tight
                tracking-[-0.045em]
                text-white/85
                sm:text-4xl
                lg:text-5xl
              "
            >
              “
              {
                artist.statement
              }
              ”
            </blockquote>
          </div>
        </section>

        {/* ==================================================
            STORY
        ================================================== */}

        <section
          className="
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
              lg:grid-cols-[0.95fr_1.05fr]
            "
          >
            {/* IMAGE */}

            <div
              className="
                relative
                min-h-[430px]
                overflow-hidden
                lg:min-h-[620px]
              "
            >
              <img
                src={
                  artist.portrait
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
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/65
                  via-transparent
                  to-black/10
                "
              />

              <div
                className="
                  absolute
                  bottom-5
                  left-5
                "
              >
                <span
                  className="
                    rounded-full
                    border
                    border-white/[0.10]
                    bg-black/35
                    px-3
                    py-1.5
                    text-[8px]
                    uppercase
                    tracking-[0.15em]
                    text-white/45
                    backdrop-blur-xl
                  "
                >
                  Nox / SOA
                </span>
              </div>
            </div>

            {/* COPY */}

            <div
              className="
                relative
                flex
                flex-col
                justify-center
                border-t
                border-white/[0.06]
                p-7
                sm:p-10
                lg:border-l
                lg:border-t-0
                lg:p-12
                xl:p-14
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-24
                  -top-24
                  h-72
                  w-72
                  rounded-full
                  bg-violet-600/[0.07]
                  blur-[110px]
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
                  <Globe2
                    size={12}
                  />

                  The Story
                </div>

                <h2
                  className="
                    mt-3
                    max-w-xl
                    text-4xl
                    font-semibold
                    tracking-[-0.045em]
                    sm:text-5xl
                  "
                >
                  Music built like
                  scenes.
                </h2>

                <p
                  className="
                    mt-6
                    max-w-xl
                    text-sm
                    leading-7
                    text-white/38
                  "
                >
                  Emerging from
                  underground electronic
                  influences, Nox built a
                  sound around emotional
                  synth design,
                  atmospheric bass and
                  cinematic progression.
                </p>

                <p
                  className="
                    mt-4
                    max-w-xl
                    text-sm
                    leading-7
                    text-white/28
                  "
                >
                  Every release is
                  approached like a
                  scene rather than an
                  isolated song. The
                  production, artwork,
                  visual language and
                  live environment are
                  all parts of the same
                  idea.
                </p>

                <p
                  className="
                    mt-4
                    max-w-xl
                    text-sm
                    leading-7
                    text-white/28
                  "
                >
                  Influences move through
                  ambient music, trap,
                  future-facing
                  electronic production
                  and film scores without
                  needing to belong
                  completely to any one
                  category.
                </p>

                <Link
                  href="/music"
                  className="
                    mt-7
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
                  Explore the music

                  <ArrowRight
                    size={14}
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SOUND DNA
        ================================================== */}

        <section
          className="
            mt-16
          "
        >
          <SectionHeading
            eyebrow="Sound DNA"
            title="What defines the world"
            description="The recurring ideas behind the production."
          />

          <div
            className="
              mt-6
              grid
              gap-3
              md:grid-cols-3
            "
          >
            {soundTraits.map(
              trait => (
                <SoundCard
                  key={
                    trait.title
                  }
                  {...trait}
                />
              )
            )}
          </div>
        </section>

        {/* ==================================================
            ERA / VISUAL FEATURE
        ================================================== */}

        <section
          className="
            mt-16
            grid
            gap-4
            lg:grid-cols-[1.15fr_0.85fr]
          "
        >
          {/* LARGE FEATURE */}

          <div
            className="
              group
              relative
              min-h-[500px]
              overflow-hidden
              rounded-[28px]
              border
              border-white/[0.07]
            "
          >
            <img
              src="/album1.jpg"
              alt="Afterglow era"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition
                duration-1000
                group-hover:scale-[1.025]
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/95
                via-black/20
                to-black/10
              "
            />

            <div
              className="
                absolute
                bottom-0
                left-0
                right-0
                p-6
                sm:p-8
              "
            >
              <p
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.18em]
                  text-violet-200/45
                "
              >
                Current world
              </p>

              <h2
                className="
                  mt-2
                  text-4xl
                  font-semibold
                  tracking-[-0.045em]
                "
              >
                Afterglow
              </h2>

              <p
                className="
                  mt-3
                  max-w-xl
                  text-sm
                  leading-6
                  text-white/38
                "
              >
                A darker cinematic
                chapter built around
                late-night synths,
                distortion and emotional
                space.
              </p>

              <Link
                href="/music"
                className="
                  mt-6
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
                Enter the era

                <ArrowUpRight
                  size={14}
                />
              </Link>
            </div>
          </div>

          {/* SMALL STACK */}

          <div
            className="
              grid
              gap-4
              sm:grid-cols-2
              lg:grid-cols-1
            "
          >
            <WorldCard
              icon={
                <Film
                  size={18}
                />
              }
              eyebrow="Visuals"
              title="Film is part of the music."
              description="Videos, environments and imagery expand each era beyond the record."
              href="/videos"
              action="Watch"
            />

            <WorldCard
              icon={
                <Headphones
                  size={18}
                />
              }
              eyebrow="Listening"
              title="Built for immersion."
              description="The music is designed to reward deep listening as much as immediate impact."
              href="/music"
              action="Listen"
            />
          </div>
        </section>

        {/* ==================================================
            JOURNEY
        ================================================== */}

        <section
          className="
            mt-16
          "
        >
          <SectionHeading
            eyebrow="Journey"
            title="The chapters so far"
            description="A project still in motion."
          />

          <div
            className="
              mt-8
              border-t
              border-white/[0.06]
            "
          >
            {timeline.map(
              (
                item,
                index
              ) => (
                <TimelineRow
                  key={
                    item.year
                  }
                  item={
                    item
                  }
                  index={
                    index
                  }
                  last={
                    index ===
                    timeline.length -
                      1
                  }
                />
              )
            )}
          </div>
        </section>

        {/* ==================================================
            SOA CONNECTION
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
            p-7
            sm:p-10
            lg:p-12
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -left-28
              -top-32
              h-80
              w-80
              rounded-full
              bg-blue-600/[0.08]
              blur-[120px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-36
              right-[15%]
              h-80
              w-80
              rounded-full
              bg-purple-600/[0.08]
              blur-[120px]
            "
          />

          <div
            className="
              relative
              z-10
              grid
              gap-10
              lg:grid-cols-[1fr_0.75fr]
              lg:items-end
            "
          >
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[9px]
                  uppercase
                  tracking-[0.18em]
                  text-violet-200/40
                "
              >
                <Users
                  size={12}
                />

                SOA Music
              </div>

              <h2
                className="
                  mt-3
                  max-w-3xl
                  text-4xl
                  font-semibold
                  tracking-[-0.045em]
                  sm:text-5xl
                "
              >
                The artist is only
                one part of the world.
              </h2>

              <p
                className="
                  mt-5
                  max-w-2xl
                  text-sm
                  leading-7
                  text-white/34
                "
              >
                SOA connects music,
                visuals, live moments,
                merchandise and the
                people listening to all
                of it. The goal is a
                closer relationship
                between the artist and
                the audience.
              </p>
            </div>

            <div
              className="
                flex
                flex-wrap
                gap-3
                lg:justify-end
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
                Explore SOA

                <ArrowRight
                  size={14}
                />
              </Link>

              <Link
                href="/contact"
                className="
                  inline-flex
                  h-11
                  items-center
                  rounded-full
                  border
                  border-white/[0.09]
                  bg-white/[0.025]
                  px-5
                  text-sm
                  font-medium
                  text-white/50
                  transition
                  hover:border-violet-400/18
                  hover:text-white
                "
              >
                Contact
              </Link>
            </div>
          </div>
        </section>

        {/* ==================================================
            MERCH
        ================================================== */}

        <section
          className="
            mt-16
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
            <SectionHeading
              eyebrow="Physical world"
              title="From the artist"
            />

            <Link
              href="/merch"
              className="
                hidden
                items-center
                gap-1.5
                text-[9px]
                uppercase
                tracking-[0.12em]
                text-white/22
                transition
                hover:text-white
                sm:flex
              "
            >
              View store

              <ArrowUpRight
                size={12}
              />
            </Link>
          </div>

          <div
            className="
              mt-6
              grid
              gap-4
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
        </section>

        {/* ==================================================
            CONNECT
        ================================================== */}

        <section
          className="
            mt-16
            grid
            gap-5
            lg:grid-cols-[1fr_0.85fr]
          "
        >
          {/* SOCIALS */}

          <div
            className="
              rounded-[26px]
              border
              border-white/[0.065]
              bg-[#09090b]
              p-6
              sm:p-7
            "
          >
            <div>
              <p
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.18em]
                  text-violet-200/35
                "
              >
                Connect
              </p>

              <h2
                className="
                  mt-1
                  text-3xl
                  font-semibold
                  tracking-[-0.04em]
                "
              >
                Follow the world.
              </h2>
            </div>

            <div
              className="
                mt-6
                overflow-hidden
                rounded-2xl
                border
                border-white/[0.06]
              "
            >
              {socials.map(
                (
                  social,
                  index
                ) => (
                  <SocialRow
                    key={
                      social.name
                    }
                    social={
                      social
                    }
                    last={
                      index ===
                      socials.length -
                        1
                    }
                  />
                )
              )}
            </div>
          </div>

          {/* COMMUNITY */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[26px]
              border
              border-violet-400/10
              bg-gradient-to-br
              from-violet-500/[0.045]
              to-[#09090b]
              p-6
              sm:p-7
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-64
                w-64
                rounded-full
                bg-violet-600/[0.10]
                blur-[100px]
              "
            />

            <div
              className="
                relative
                z-10
                flex
                h-full
                flex-col
                justify-between
              "
            >
              <div>
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-violet-400/12
                    bg-violet-500/[0.05]
                    text-violet-200/45
                  "
                >
                  <Heart
                    size={17}
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
                  Community
                </p>

                <h2
                  className="
                    mt-2
                    text-3xl
                    font-semibold
                    tracking-[-0.04em]
                  "
                >
                  Get closer.
                </h2>

                <p
                  className="
                    mt-4
                    max-w-md
                    text-sm
                    leading-7
                    text-white/30
                  "
                >
                  Early releases,
                  private updates,
                  behind-the-scenes
                  sessions and moments
                  that do not belong on
                  the public feed.
                </p>
              </div>

              <button
                type="button"
                className="
                  mt-8
                  inline-flex
                  h-11
                  w-fit
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
                Join community

                <ArrowRight
                  size={14}
                />
              </button>
            </div>
          </div>
        </section>

        {/* ==================================================
            FINAL CTA
        ================================================== */}

        <section
          className="
            mt-16
            border-t
            border-white/[0.06]
            py-16
            text-center
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
              bg-violet-500/[0.04]
              text-violet-200/40
            "
          >
            <Disc3
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
            The best introduction
            is still the music.
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-lg
              text-sm
              leading-6
              text-white/28
            "
          >
            Enter the catalog and
            experience the world from
            the beginning.
          </p>

          <Link
            href="/music"
            className="
              mt-7
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
            "
          >
            <Play
              size={14}
              fill="currentColor"
            />

            Listen to Nox
          </Link>
        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer
          className="
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
            Community
          </span>
        </footer>
      </div>
    </div>
  );
}

// =========================================================
// SECTION HEADING
// =========================================================

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
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
          sm:text-4xl
        "
      >
        {title}
      </h2>

      {description && (
        <p
          className="
            mt-2
            text-xs
            text-white/25
          "
        >
          {description}
        </p>
      )}
    </div>
  );
}

// =========================================================
// SOUND CARD
// =========================================================

function SoundCard({
  icon,
  title,
  description,
}: SoundTrait) {
  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-[22px]
        border
        border-white/[0.06]
        bg-[#09090b]
        p-6
        transition
        hover:border-violet-400/14
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-48
          w-48
          rounded-full
          bg-violet-600/[0.05]
          blur-[80px]
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
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-violet-400/10
            bg-violet-500/[0.035]
            text-violet-200/40
          "
        >
          {icon}
        </div>

        <h3
          className="
            mt-6
            text-lg
            font-semibold
            text-white/75
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-3
            text-[10px]
            leading-5
            text-white/27
          "
        >
          {description}
        </p>
      </div>
    </article>
  );
}

// =========================================================
// WORLD CARD
// =========================================================

function WorldCard({
  icon,
  eyebrow,
  title,
  description,
  href,
  action,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <Link
      href={
        href
      }
      className="
        group
        relative
        flex
        min-h-[240px]
        flex-col
        justify-between
        overflow-hidden
        rounded-[24px]
        border
        border-white/[0.065]
        bg-[#09090b]
        p-6
        transition
        hover:border-violet-400/15
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-24
          h-64
          w-64
          rounded-full
          bg-violet-600/[0.06]
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
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-violet-400/10
            bg-violet-500/[0.035]
            text-violet-200/40
          "
        >
          {icon}
        </div>

        <p
          className="
            mt-5
            text-[8px]
            uppercase
            tracking-[0.16em]
            text-violet-200/30
          "
        >
          {eyebrow}
        </p>

        <h3
          className="
            mt-2
            text-xl
            font-semibold
            tracking-[-0.025em]
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-3
            text-[10px]
            leading-5
            text-white/25
          "
        >
          {description}
        </p>
      </div>

      <div
        className="
          relative
          z-10
          mt-7
          flex
          items-center
          justify-between
          text-[10px]
          font-medium
          text-white/35
        "
      >
        {action}

        <ArrowUpRight
          size={13}
          className="
            transition
            group-hover:text-violet-200
          "
        />
      </div>
    </Link>
  );
}

// =========================================================
// TIMELINE ROW
// =========================================================

function TimelineRow({
  item,
  index,
  last,
}: {
  item: TimelineItem;
  index: number;
  last: boolean;
}) {
  return (
    <div
      className={`
        grid
        gap-5
        py-7
        sm:grid-cols-[90px_1fr_auto]
        sm:items-center

        ${
          !last
            ? `
              border-b
              border-white/[0.055]
            `
            : ""
        }
      `}
    >
      <div>
        <span
          className="
            text-2xl
            font-semibold
            tracking-[-0.04em]
            text-violet-100/65
          "
        >
          {item.year}
        </span>
      </div>

      <div>
        <p
          className="
            text-sm
            font-medium
            text-white/65
          "
        >
          {
            item.title
          }
        </p>

        <p
          className="
            mt-1.5
            max-w-3xl
            text-[10px]
            leading-5
            text-white/27
          "
        >
          {
            item.text
          }
        </p>
      </div>

      <span
        className="
          hidden
          text-[9px]
          tabular-nums
          text-white/12
          sm:block
        "
      >
        {String(
          index + 1
        ).padStart(
          2,
          "0"
        )}
      </span>
    </div>
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
    <Link
      href="/merch"
      className="
        group
      "
    >
      <div
        className="
          relative
          aspect-[4/5]
          overflow-hidden
          rounded-[20px]
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
            group-hover:scale-[1.035]
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
            opacity-60
          "
        />

        <span
          className="
            absolute
            left-3
            top-3
            rounded-full
            border
            border-white/[0.09]
            bg-black/35
            px-2.5
            py-1
            text-[8px]
            uppercase
            tracking-[0.11em]
            text-white/40
            backdrop-blur-xl
          "
        >
          {
            item.type
          }
        </span>

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
          <ShoppingBag
            size={14}
          />
        </div>
      </div>

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
          <p
            className="
              truncate
              text-sm
              font-medium
              text-white/70
              transition
              group-hover:text-white
            "
          >
            {
              item.name
            }
          </p>

          <span
            className="
              shrink-0
              text-sm
              font-semibold
              text-white/60
            "
          >
            {
              item.price
            }
          </span>
        </div>
      </div>
    </Link>
  );
}

// =========================================================
// SOCIAL ROW
// =========================================================

function SocialRow({
  social,
  last,
}: {
  social: SocialItem;
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
        gap-4
        bg-[#09090b]
        px-4
        py-4
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
          gap-3
        "
      >
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            bg-white/[0.025]
            text-violet-200/35
          "
        >
          {
            social.icon
          }
        </div>

        <div>
          <p
            className="
              text-xs
              font-medium
              text-white/60
              transition
              group-hover:text-white
            "
          >
            {
              social.name
            }
          </p>

          <p
            className="
              mt-1
              text-[9px]
              text-white/20
            "
          >
            {
              social.handle
            }
          </p>
        </div>
      </div>

      <ArrowUpRight
        size={14}
        className="
          text-white/12
          transition
          group-hover:text-violet-200/55
        "
      />
    </button>
  );
}