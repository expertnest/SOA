"use client";

import Link from "next/link";
import { Post, newsPosts } from "@/data/newPosts";
import Newsletter from "./Newsletter";

export default function NewsGrid() {
  const featured = newsPosts.find((post) => post.id === 1);
  const others = newsPosts.filter((post) => post.id !== 1);

  return (
    <div className="md:mb-18 mt-2">
      {/* --- Featured Post --- */}
      {featured && (
        <Link href={`/news/${featured.slug}`} key={featured.id}>
          <div className="relative rounded-2xl overflow-hidden h-72 md:h-120 shadow-xl border border-gray-700 hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300 flex flex-col cursor-pointer">
            <div
              className="absolute inset-0 bg-cover bg-center transform transition-transform duration-500 hover:scale-105"
              style={{ backgroundImage: `url(${featured.image})` }}
            ></div>

            <div
              className={`absolute inset-0 bg-gradient-to-br ${featured.color} opacity-20`}
            ></div>

            <div className="relative z-10 p-5 md:p-8 flex flex-col justify-end h-full">
              <span className="text-xs md:text-sm text-white/70 uppercase tracking-wider mb-2">
                {featured.date}
              </span>
              <h2 className="text-lg md:text-2xl font-extrabold text-white drop-shadow-lg leading-tight">
                {featured.headline}
              </h2>
            </div>

            <div className="absolute inset-0 pointer-events-none bg-white/5 opacity-0 hover:opacity-30 transition-opacity duration-500"></div>
          </div>
        </Link>
      )}

      {/* --- Newsletter --- */}
      <div className="mt-6">
        <Newsletter />
      </div>

      {/* --- Other Posts Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {others.map((post, index) => (
          <Link href={`/news/${post.slug}`} key={post.id}>
            <div
              className={`relative rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:scale-[1.02] transition-transform flex flex-col cursor-pointer ${
                index === 0 ? "h-44 md:h-68 mt-1 md:mt-4" : "h-44 md:h-68 mt-0 md:mt-4"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${post.image})` }}
              ></div>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${post.color} opacity-20`}
              ></div>
              <div className="relative z-10 p-2 md:p-4 flex flex-col justify-end h-full">
                <span className="text-[9px] sm:text-xs text-white/70 uppercase mb-1">
                  {post.date}
                </span>
                <h2 className="text-sm sm:text-lg font-semibold mb-1">
                  {post.headline}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* --- Subtle Read More Articles Button with Purple Gradient --- */}
      <div className="mt-8 text-center">
        <Link
          href="/news"
          className="
            inline-flex items-center gap-2 px-6 py-2 rounded-full font-semibold
            text-white text-sm
            bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600
            bg-opacity-20 hover:bg-opacity-40 transition-all duration-300
          "
        >
          Read More Articles
          <span className="text-base">→</span>
        </Link>
      </div>
    </div>
  );
}
