"use client"

export default function Newsletter() {
  return (
    <div className="flex flex-col md:col-span-2 md:row-span-1">
      <div className="relative rounded-lg overflow-hidden shadow-lg border border-gray-700 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 flex flex-col items-center justify-center text-center p-4 sm:p-6 md:p-12 min-h-[160px] md:min-h-[220px]">
        <h2 className="text-xl md:text-3xl font-bold uppercase mb-3 md:mb-4">
          Stay Updated
        </h2>
        <p className="text-xs md:text-base text-white/90 mb-4 md:mb-6 max-w-xl px-2">
          Join the newsletter to get exclusive drops, behind-the-scenes updates, and tour news delivered straight to email.
        </p>
        <form className="w-full max-w-md flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-3 py-2 md:px-4 md:py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="px-4 p-2 py-2 md:px-6 md:py-3 rounded-lg bg-black/70 hover:bg-black/50 text-xs md:text-sm font-semibold uppercase tracking-wide"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  )
}
