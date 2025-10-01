"use client"

import Link from "next/link"
import { Fragment } from "react"
import { newsPosts } from "@/data/newPosts"
import Newsletter from "./Newsletter"

export default function NewsGrid() {
  // pull out featured (id=1) and the rest
  const featured = newsPosts.find((post) => post.id === 1)
  const others = newsPosts.filter((post) => post.id !== 1)

  return (
    <>
      {/* --- Hero Section --- */}
      {featured && (
        <div
          key={featured.id}
          className="relative rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:scale-[1.02] transition-transform flex flex-col md:col-span-2 md:row-span-2"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${featured.image})` }}
          ></div>
          <div
            className={`absolute inset-0 bg-gradient-to-br ${featured.color} opacity-70`}
          ></div>
          <div className="relative z-10 p-4 md:p-6 flex flex-col justify-end h-full">
            <span className="text-xs text-white/70 uppercase mb-2">
              {featured.date}
            </span>
            <h2 className="text-xl md:text-2xl font-bold mb-2">{featured.title}</h2>
            <p className="text-sm md:text-base text-white/90 mb-2 line-clamp-3">
              {featured.excerpt}
            </p>
            <Link
              href={`/news/${featured.id}`}
              className="mt-2 text-xs md:text-sm font-bold uppercase text-white hover:text-gray-200"
            >
              Read More →
            </Link>
          </div>
        </div>
      )}

      <Newsletter />

      {/* --- Grid for the rest --- */}
      {others.map((post, index) => (
        <div
          key={post.id}
          className={`relative rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:scale-[1.02] transition-transform flex flex-col ${post.span} ${
            index === 0 ? "mt-10 md:mt-0" : ""
          } ${index === others.length - 1 ? " 4" : ""}`} // <-- pb-8 only for last
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${post.image})` }}
          ></div>
          <div
            className={`absolute inset-0 bg-gradient-to-br ${post.color} opacity-70`}
          ></div>
          <div className="relative z-10 p-2 md:p-4 flex flex-col justify-end h-full">
            <span className="text-[9px] sm:text-xs text-white/70 uppercase mb-1">
              {post.date}
            </span>
            <h2 className="text-sm sm:text-lg font-semibold mb-1">
              {post.title}
            </h2>
            <p className="text-xs sm:text-sm text-white/90 mb-1 line-clamp-3">
              {post.excerpt}
            </p>
            <Link
              href={`/news/${post.id}`}
              className="mt-1 text-[8px] sm:text-xs font-bold uppercase text-white hover:text-gray-200"
            >
              Read More →
            </Link>
          </div>
        </div>
      ))}
      <div className="w-full bg-black">

      </div>
    </>
  )
}
