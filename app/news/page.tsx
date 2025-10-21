"use client";

import Link from "next/link";
import { newsPosts } from "@/data/newPosts";

export default function NewsListPage() {
  return (
    <div className="relative w-full p-2 bg-black text-white flex flex-col overflow-hidden min-h-screen">
      {/* Stars background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-repeat opacity-70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 w-full max-w-5xl mx-auto px-6 py-6 gap-6">
        {/* ===== Back to Home Button ===== */}
        <div className="text-left">
          <Link
            href="/"
            className="
              inline-block px-5 py-2 rounded-full font-medium text-white text-sm
              bg-gradient-to-r from-purple-500 to-blue-500
              bg-opacity-20 hover:bg-opacity-35
              transition-all duration-300
            "
          >
            ← Back to Home
          </Link>
        </div>

        {/* ===== Page Title ===== */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
          All News Articles
        </h1>

        {/* ===== News Grid ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsPosts.map((post) => (
            <Link href={`/news/${post.slug}`} key={post.id}>
              <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-700 hover:bg-zinc-800 transition-transform hover:scale-[1.02] cursor-pointer h-56">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${post.image})` }}
                ></div>
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${post.color} opacity-25`}
                ></div>
                <div className="relative z-10 p-4 flex flex-col justify-end h-full">
                  <span className="text-xs text-white/70 uppercase mb-1">
                    {post.date}
                  </span>
                  <h2 className="text-lg font-semibold text-white">
                    {post.headline}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Spacer */}
      <div className="bg-black min-h-[75px]"></div>
    </div>
  );
}
