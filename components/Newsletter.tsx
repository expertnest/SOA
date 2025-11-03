"use client";

export default function Newsletter() {
  return (
    <div className="flex flex-col mt-6 md:col-span-2 md:row-span-1">
      <div className="relative rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-gray-800 bg-black flex flex-col items-center justify-center text-center p-6 md:p-12 min-h-[200px] md:min-h-[260px]">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/10"></div>

        {/* Headline */}
        <h2 className="text-3xl md:text-5xl font-extrabold uppercase mb-4 md:mb-6 text-white drop-shadow-lg">
          Stay Updated
        </h2>

        {/* Description */}
        <p className="text-sm md:text-base text-gray-300 mb-6 max-w-lg px-2">
          Join the newsletter for exclusive drops, behind-the-scenes updates, and tour news delivered straight to your inbox.
        </p>

        {/* Form */}
        <form className="w-full max-w-md flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-1 transition"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm md:text-base font-semibold uppercase tracking-wide shadow-lg hover:shadow-2xl transition"
          >
            Subscribe
          </button>
        </form>

        {/* Subtle Glow */}
        <div className="absolute inset-0 pointer-events-none rounded-xl border border-white/10 shadow-[0_0_50px_10px_rgba(255,255,255,0.05)]"></div>
      </div>
    </div>
  );
}
