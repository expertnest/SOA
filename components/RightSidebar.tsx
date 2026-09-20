 
"use client";

export default function RightSidebar() {
  return (
    <aside
      className="
        relative
        h-full
        w-64 md:w-[260px]
        bg-[#0d0d0d]
        text-white
        p-3 md:p-4
        flex flex-col
        overflow-y-auto
        space-y-6

        border-l
        border-zinc-800/70
      "
    >
      {/* =====================================================
          TRENDING TRACKS
      ===================================================== */}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Trending Tracks
          </h2>

          <span className="text-[10px] text-zinc-600">
            3
          </span>
        </div>

        <div className="space-y-1.5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="
                group
                flex
                items-center
                gap-3
                rounded-lg
                p-2

                bg-zinc-900/60
                hover:bg-zinc-800/80

                border
                border-zinc-800/70

                transition
                cursor-pointer
              "
            >
              <div className="relative shrink-0">
                <img
                  src="/albumart.png"
                  alt={`Track ${idx + 1}`}
                  className="w-10 h-10 rounded-md object-cover"
                />

                {idx === 0 && (
                  <span className="
                    absolute
                    -top-1
                    -right-1
                    text-[8px]
                    font-bold
                    bg-cyan-400
                    text-black
                    rounded-full
                    px-1.5
                    py-0.5
                  ">
                    #1
                  </span>
                )}
              </div>

              <div className="min-w-0 leading-tight">
                <p className="
                  text-xs
                  font-semibold
                  text-zinc-200
                  truncate
                  group-hover:text-white
                  transition
                ">
                  Track {idx + 1}
                </p>

                <p className="text-[10px] text-zinc-500 truncate">
                  Artist Name
                </p>
              </div>

              <span className="ml-auto text-[9px] text-zinc-600">
                {12 - idx}M
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          MERCH COLLECTION
      ===================================================== */}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Merch
          </h2>

          <button
            type="button"
            className="text-[10px] text-zinc-500 hover:text-zinc-300 transition"
          >
            View all
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="
                relative
                group
                overflow-hidden
                rounded-lg
                bg-zinc-900
                border
                border-zinc-800/70
              "
            >
              <img
                src={`/clothes${idx + 1}.png`}
                alt={`Merch item ${idx + 1}`}
                className="
                  w-full
                  h-20
                  object-cover
                  group-hover:scale-105
                  transition
                  duration-500
                "
              />

              <div className="
                absolute
                inset-0
                bg-black/20
                group-hover:bg-black/5
                transition
              " />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="
            mt-2
            w-full
            py-1.5
            text-xs
            font-semibold

            bg-zinc-200
            text-black

            rounded-md

            hover:bg-white
            active:scale-95

            transition
          "
        >
          View All Merch
        </button>
      </div>

      {/* =====================================================
          STAY CONNECTED
      ===================================================== */}

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
          Stay Connected
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="
            w-full
            px-3
            py-2
            rounded-md

            bg-zinc-900
            border
            border-zinc-800

            text-xs
            text-zinc-200
            placeholder:text-zinc-600

            text-left
            outline-none

            focus:border-zinc-600
            focus:bg-zinc-800

            transition
          "
        />

        <button
          type="button"
          className="
            mt-2
            w-full
            py-1.5

            text-xs
            font-semibold

            bg-zinc-200
            text-black

            rounded-md

            hover:bg-white
            active:scale-95

            transition
          "
        >
          Subscribe
        </button>
      </div>

      {/* =====================================================
          COMMUNITY
      ===================================================== */}

      <div
        className="
          bg-zinc-900/60
          border
          border-zinc-800/70
          rounded-xl
          overflow-hidden
          hover:bg-zinc-900
          transition
        "
      >
        <div className="relative overflow-hidden">
          <img
            src="/crowd.jpg"
            alt="SOA community"
            className="
              w-full
              h-28
              object-cover
              group-hover:scale-105
              transition
              duration-300
            "
          />

          <div className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/50
            to-transparent
          " />
        </div>

        <div className="p-3 text-center">
          <h3 className="font-semibold text-sm text-zinc-100">
            Join the Community
          </h3>

          <p className="text-xs text-zinc-500 leading-snug mt-2">
            Get early access to drops, unreleased tracks, and exclusive
            updates from the label.
          </p>

          <div className="flex justify-center gap-2 mt-3 text-[9px] text-zinc-600">
            <span>• Early Music</span>
            <span>• Exclusive Content</span>
            <span>• Private Drops</span>
          </div>

          <button
            type="button"
            className="
              mt-3
              px-4
              py-1.5

              text-xs
              font-semibold

              bg-zinc-200
              text-black

              rounded-md

              hover:bg-white
              active:scale-95

              transition
            "
          >
            Join Now
          </button>
        </div>
      </div>
    </aside>
  );
}
 
