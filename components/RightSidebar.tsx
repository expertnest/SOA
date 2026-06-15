"use client";

export default function RightSidebar() {
  return (
    <aside className="h-full w-64 md:w-[260px] bg-black/60 backdrop-blur-lg text-white border-l border-gray-800 p-3 md:p-4 flex flex-col shadow-lg overflow-y-auto space-y-6">

      {/* TRENDING TRACKS */}
      <div>
        <h2 className="text-xs font-bold uppercase text-white/60 tracking-wider mb-2 text-center">
          Trending Tracks (3)
        </h2>

        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg p-2 transition cursor-pointer"
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
              <div className="absolute inset-0 bg-black/30 group-hover:bg-indigo-500/10 transition" />
            </div>
          ))}
        </div>

        <button className="mt-2 w-full py-1.5 text-xs font-semibold bg-white text-black rounded-md hover:bg-gray-200 transition">
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
          className="w-full px-2 py-1.5 rounded-md bg-black/30 border border-gray-700 text-xs focus:outline-none focus:border-indigo-400 text-center"
        />

        <button className="mt-2 w-full py-1.5 text-xs font-semibold bg-white text-black rounded-md hover:bg-gray-200 transition">
          Subscribe
        </button>
      </div>

      {/* TOUR DATES CARD */}
      <div className="bg-black/40 rounded-xl overflow-hidden border border-gray-800 hover:border-white/20 transition group">
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

    <button className="mt-2 px-3 py-1.5 text-xs font-semibold bg-white text-black rounded-md hover:bg-gray-200 active:scale-95 transition">
      Join Now
    </button>
  </div>
</div>

    </aside>
  );
}