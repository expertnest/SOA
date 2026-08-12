 "use client";

export default function RightSidebar() {
  return (
    <aside
      className={`
        relative
        h-full
        w-64 md:w-[260px]

        /* layered panel background */
        bg-[#0f0f0f]/70 backdrop-blur-xl
        bg-gradient-to-b from-white/[0.03] to-transparent

        text-white
        p-3 md:p-4
        flex flex-col
        overflow-y-auto
        space-y-6

        /* integrated separation (no hard border) */
        shadow-[inset_1px_0_0_rgba(255,255,255,0.04)]

        /* soft edge glow */
        before:absolute before:top-0 before:left-0 before:h-full before:w-[1px]
        before:bg-gradient-to-b before:from-white/10 before:via-white/5 before:to-transparent
        before:pointer-events-none
      `}
    >

      {/* TRENDING TRACKS */}
      <div>
        <h2 className="text-xs font-bold uppercase text-white/60 tracking-wider mb-2 text-center">
          Trending Tracks (3)
        </h2>

        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="
                flex items-center gap-3
                bg-white/[0.03] hover:bg-white/[0.06]
                rounded-lg p-2
                transition cursor-pointer
              "
            >
              <img
                src="/albumart.png"
                className="w-10 h-10 rounded-md object-cover"
              />
              <div className="leading-tight">
                <p className="text-xs font-semibold">Track {idx + 1}</p>
                <p className="text-[10px] text-white/50">Artist Name</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MERCH COLLECTION */}
      <div>
        <h2 className="text-xs font-bold uppercase text-white/60 tracking-wider mb-2 text-center">
          Merch Collection
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden rounded-lg"
            >
              <img
                src={`/clothes${idx + 1}.png`}
                className="w-full h-20 object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-white/10 transition" />
            </div>
          ))}
        </div>

        <button className="
          mt-2 w-full py-1.5 text-xs font-semibold
          bg-white text-black
          rounded-md
          hover:bg-gray-200 active:scale-95
          transition
        ">
          View All Merch
        </button>
      </div>

      {/* STAY CONNECTED */}
      <div>
        <h2 className="text-xs font-bold uppercase text-white/60 tracking-wider mb-2 text-center">
          Stay Connected
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="
            w-full px-2 py-1.5 rounded-md
            bg-white/[0.04]
            focus:bg-white/[0.06]
            text-xs text-center
            outline-none
            transition
          "
        />

        <button className="
          mt-2 w-full py-1.5 text-xs font-semibold
          bg-white text-black
          rounded-md
          hover:bg-gray-200 active:scale-95
          transition
        ">
          Subscribe
        </button>
      </div>

      {/* COMMUNITY CARD */}
      <div className="
        bg-white/[0.04]
        rounded-xl overflow-hidden
        hover:bg-white/[0.06]
        transition group
      ">
        <img
          src="/crowd.jpg"
          className="w-full h-28 object-cover group-hover:scale-105 transition duration-300"
        />

        <div className="p-3 text-center space-y-2">
          <h3 className="font-semibold text-sm text-white">
            Join the Community
          </h3>

          <p className="text-xs text-white/60 leading-snug">
            Get early access to drops, unreleased tracks, and exclusive updates from the label.
          </p>

          <div className="flex justify-center gap-2 text-[10px] text-white/40">
            <span>• Early Music</span>
            <span>• Exclusive Content</span>
            <span>• Private Drops</span>
          </div>

          <button className="
            mt-2 px-3 py-1.5 text-xs font-semibold
            bg-white text-black
            rounded-md
            hover:bg-gray-200 active:scale-95
            transition
          ">
            Join Now
          </button>
        </div>
      </div>

    </aside>
  );
}