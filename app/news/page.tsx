'use client'

import Link from "next/link"

const newsPosts = [
  {
    id: 1,
    title: "New Single Dropping Soon",
    date: "Sep 20, 2025",
    excerpt: "Get ready — my latest track is almost here. Expect high energy, raw vibes, and a whole new sound.",
    image: "https://via.placeholder.com/800x400.png?text=Featured+News",
    color: "from-pink-500 to-red-500",
    span: "md:col-span-2 md:row-span-2", // featured story
  },
  {
    id: 2,
    title: "Behind the Scenes of the Tour",
    date: "Sep 10, 2025",
    excerpt: "A quick look at rehearsals, stage setups, and what’s been going on before the shows.",
    image: "https://via.placeholder.com/400x300.png?text=News+2",
    color: "from-blue-500 to-indigo-500",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    id: 3,
    title: "Exclusive Merch Drop",
    date: "Aug 25, 2025",
    excerpt: "Limited edition hoodies and vinyls are coming soon. Don’t sleep on this one.",
    image: "https://via.placeholder.com/400x300.png?text=News+3",
    color: "from-green-500 to-emerald-600",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    id: 4,
    title: "Studio Sessions",
    date: "Aug 1, 2025",
    excerpt: "Locking in long nights in the studio. Experimenting with new sounds and collabs.",
    image: "https://via.placeholder.com/400x300.png?text=News+4",
    color: "from-purple-500 to-fuchsia-600",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    id: 5,
    title: "Festival Announcement",
    date: "Jul 15, 2025",
    excerpt: "We’re hitting some major festivals this summer — lineup details coming soon.",
    image: "https://via.placeholder.com/400x300.png?text=News+5",
    color: "from-orange-500 to-yellow-500",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    id: 6,
    title: "Collab Teaser",
    date: "Jun 30, 2025",
    excerpt: "A sneak peek at a crazy collab coming soon — artists you won’t expect.",
    image: "https://via.placeholder.com/400x300.png?text=News+6",
    color: "from-teal-500 to-cyan-500",
    span: "md:col-span-1 md:row-span-1",
  },
  
]

export default function NewsPage() {
  return (
    <div className="relative w-full min-h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-repeat opacity-70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <header className="w-full bg-zinc-900/80 py-6 px-6 flex flex-col items-start shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-[0.1em]">
            News
          </h1>
          <Link
            href="/"
            className="mt-2 text-white uppercase tracking-[0.2em] text-sm md:text-base font-bold cursor-pointer transition hover:text-gray-400"
          >
            &larr; Back to Menu
          </Link>
        </header>

        {/* News Grid */}
        <div className="flex flex-col items-center flex-1 w-full relative z-10 px-6 pt-10 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-6 w-full max-w-6xl">
            {newsPosts.map((post) => (
              <div
                key={post.id}
                className={`relative rounded-xl overflow-hidden shadow-xl border border-gray-700 hover:scale-[1.03] transition-transform duration-300 flex flex-col ${post.span}`}
              >
                {/* Image Section */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${post.image})` }}
                ></div>

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${post.color} opacity-75`}></div>

                {/* Text Content */}
                <div className="relative z-10 p-4 flex flex-col justify-end h-full">
                  <span className="text-xs text-white/70 uppercase tracking-wide mb-1">
                    {post.date}
                  </span>
                  <h2 className="text-lg md:text-xl font-semibold mb-2">
                    {post.title}
                  </h2>
                  <p className="text-sm md:text-base text-white/90 mb-2">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/news/${post.id}`}
                    className="mt-2 text-xs md:text-sm font-bold uppercase tracking-wide text-white hover:text-gray-200 transition"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
