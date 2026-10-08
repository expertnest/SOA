"use client";

import {
  ArrowUpRight,
  Flame,
  Mail,
  Music2,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";

export default function RightSidebar() {
  const trendingTracks = Array.from({ length: 5 }).map((_, index) => ({
    title: `Track ${index + 1}`,
    artist: "Artist Name",
    streams: `${12 - index}M`,
  }));

  const merchItems = Array.from({ length: 4 }).map((_, index) => ({
    image: `/clothes${index + 1}.png`,
    name: `Merch ${index + 1}`,
  }));

  return (
    <aside
      className="
        relative
        flex
        h-full
        min-h-0
        w-[230px]
        shrink-0
        flex-col
        overflow-hidden
        border-l
        border-white/[0.08]
        bg-[#12141a]
        text-white
        xl:w-[260px]
        2xl:w-[285px]
      "
    >
      {/* AMBIENT BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            -right-24
            top-16
            h-52
            w-52
            rounded-full
            bg-violet-600/[0.045]
            blur-[90px]
          "
        />

        <div
          className="
            absolute
            -left-20
            top-[48%]
            h-56
            w-56
            rounded-full
            bg-blue-600/[0.035]
            blur-[100px]
          "
        />
      </div>

      <div
        className="
          relative
          z-10
          min-h-0
          flex-1
          overflow-y-auto
          overscroll-contain
          px-3
          py-3
          [scrollbar-color:rgba(255,255,255,0.10)_transparent]
          [scrollbar-width:thin]
          xl:px-4
          xl:py-4
          [@media(max-height:820px)]:py-2.5
        "
      >
        {/* ==================================================
            TRENDING
        ================================================== */}
        <section>
          <SectionHeader
            icon={<Flame size={13} />}
            title="Trending"
            action="View all"
          />

          <div className="mt-2 space-y-1">
            {trendingTracks.map((track, index) => (
              <button
                key={track.title}
                type="button"
                className="
                  group
                  grid
                  w-full
                  grid-cols-[32px_1fr_auto]
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-transparent
                  px-1.5
                  py-1.5
                  text-left
                  transition
                  hover:border-white/[0.07]
                  hover:bg-white/[0.04]
                  xl:grid-cols-[36px_1fr_auto]
                  xl:py-2
                  [@media(max-height:820px)]:py-1
                "
              >
                <div
                  className="
                    relative
                    h-8
                    w-8
                    overflow-hidden
                    rounded-lg
                    border
                    border-white/[0.08]
                    bg-[#181b22]
                    xl:h-9
                    xl:w-9
                  "
                >
                  <img
                    src="/albumart.png"
                    alt={track.title}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition
                      duration-300
                      group-hover:scale-105
                    "
                  />

                  {index === 0 && (
                    <span
                      className="
                        absolute
                        bottom-0.5
                        right-0.5
                        flex
                        h-3.5
                        min-w-3.5
                        items-center
                        justify-center
                        rounded-full
                        bg-violet-300
                        px-1
                        text-[7px]
                        font-bold
                        text-[#111217]
                        shadow-[0_0_8px_rgba(196,181,253,0.45)]
                      "
                    >
                      1
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-[10px]
                      font-medium
                      text-white/70
                      transition
                      group-hover:text-white
                      xl:text-[11px]
                    "
                  >
                    {track.title}
                  </p>

                  <p className="mt-0.5 truncate text-[8px] text-white/30 xl:text-[9px]">
                    {track.artist}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Music2 size={9} className="text-violet-200/25" />

                  <span className="text-[8px] tabular-nums text-white/25">
                    {track.streams}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <Divider />

        {/* ==================================================
            MERCH
        ================================================== */}
        <section>
          <SectionHeader
            icon={<ShoppingBag size={13} />}
            title="Merch"
            action="Shop"
          />

          <div className="mt-2 grid grid-cols-2 gap-1.5 xl:gap-2">
            {merchItems.map(item => (
              <button
                key={item.name}
                type="button"
                className="
                  group
                  relative
                  aspect-[1.18/1]
                  overflow-hidden
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-[#181b22]
                  transition
                  hover:border-violet-400/15
                "
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="
                    h-full
                    w-full
                    object-cover
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
                    from-black/45
                    via-transparent
                    to-transparent
                  "
                />

                <div
                  className="
                    absolute
                    bottom-1.5
                    left-1.5
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-black/40
                    text-white/55
                    opacity-0
                    backdrop-blur-md
                    transition
                    group-hover:opacity-100
                  "
                >
                  <ArrowUpRight size={10} />
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="
              mt-2
              flex
              h-8
              w-full
              items-center
              justify-center
              gap-1.5
              rounded-lg
              border
              border-white/[0.08]
              bg-white/[0.035]
              text-[9px]
              font-medium
              uppercase
              tracking-[0.11em]
              text-white/50
              transition
              hover:border-violet-400/20
              hover:bg-violet-500/[0.07]
              hover:text-white
              xl:h-9
            "
          >
            View all merch
            <ArrowUpRight size={11} />
          </button>
        </section>

        <Divider />

        {/* ==================================================
            STAY CONNECTED
        ================================================== */}
        <section>
          <SectionHeader
            icon={<Mail size={13} />}
            title="Stay Connected"
          />

          <p
            className="
              mt-2
              text-[9px]
              leading-relaxed
              text-white/30
              xl:text-[10px]
            "
          >
            Get new music, drops, and SOA updates directly in your inbox.
          </p>

          <div className="mt-2 space-y-1.5">
            <input
              type="email"
              placeholder="Email address"
              className="
                h-8
                w-full
                rounded-lg
                border
                border-white/[0.08]
                bg-white/[0.035]
                px-2.5
                text-[9px]
                text-white/75
                outline-none
                transition
                placeholder:text-white/22
                focus:border-violet-400/25
                focus:bg-violet-500/[0.035]
                xl:h-9
                xl:text-[10px]
              "
            />

            <button
              type="button"
              className="
                flex
                h-8
                w-full
                items-center
                justify-center
                rounded-lg
                bg-white
                text-[9px]
                font-semibold
                text-black
                transition
                hover:bg-violet-50
                active:scale-[0.98]
                xl:h-9
                xl:text-[10px]
              "
            >
              Subscribe
            </button>
          </div>
        </section>

        <Divider />

        {/* ==================================================
            COMMUNITY
        ================================================== */}
        <section>
          <div
            className="
              group
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.08]
              bg-white/[0.025]
              transition
              hover:border-violet-400/15
              hover:bg-white/[0.035]
            "
          >
            <div
              className="
                relative
                h-20
                overflow-hidden
                xl:h-24
                [@media(max-height:820px)]:h-16
              "
            >
              <img
                src="/crowd.jpg"
                alt="SOA community"
                className="
                  h-full
                  w-full
                  object-cover
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
                  from-[#12141a]
                  via-[#12141a]/25
                  to-transparent
                "
              />

              <div
                className="
                  absolute
                  left-2.5
                  top-2.5
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-white/[0.10]
                  bg-black/40
                  px-2
                  py-1
                  text-[7px]
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-white/60
                  backdrop-blur-lg
                "
              >
                <Users size={9} />
                Community
              </div>
            </div>

            <div className="p-3">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-[11px] font-semibold text-white/85 xl:text-xs">
                    Join SOA
                  </h3>

                  <p
                    className="
                      mt-1
                      text-[8px]
                      leading-relaxed
                      text-white/32
                      xl:text-[9px]
                    "
                  >
                    Early music, private drops, and exclusive updates.
                  </p>
                </div>

                <Sparkles
                  size={13}
                  className="mt-0.5 shrink-0 text-violet-200/35"
                />
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {["Early Music", "Private Drops", "Exclusives"].map(tag => (
                  <span
                    key={tag}
                    className="
                      rounded-full
                      border
                      border-white/[0.07]
                      bg-white/[0.025]
                      px-1.5
                      py-0.5
                      text-[7px]
                      text-white/28
                    "
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className="
                  mt-2.5
                  flex
                  h-8
                  w-full
                  items-center
                  justify-center
                  gap-1.5
                  rounded-lg
                  border
                  border-violet-400/15
                  bg-violet-500/[0.065]
                  text-[9px]
                  font-medium
                  text-violet-100/75
                  transition
                  hover:border-violet-400/25
                  hover:bg-violet-500/[0.10]
                  hover:text-white
                  xl:h-9
                "
              >
                Join community
                <ArrowUpRight size={11} />
              </button>
            </div>
          </div>
        </section>

        <div className="h-3" />
      </div>
    </aside>
  );
}

function SectionHeader({
  icon,
  title,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  action?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-violet-200/40">{icon}</span>

        <h2
          className="
            truncate
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-white/42
            xl:text-[10px]
          "
        >
          {title}
        </h2>
      </div>

      {action && (
        <button
          type="button"
          className="
            shrink-0
            text-[8px]
            text-white/25
            transition
            hover:text-violet-200/70
          "
        >
          {action}
        </button>
      )}
    </div>
  );
}

function Divider() {
  return (
    <div
      className="
        my-4
        h-px
        bg-gradient-to-r
        from-transparent
        via-white/[0.08]
        to-transparent
        [@media(max-height:820px)]:my-3
      "
    />
  );
}