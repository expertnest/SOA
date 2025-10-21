"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { newsPosts } from "@/data/newPosts";
import * as React from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function NewsPostPage({ params }: PageProps) {
  const { slug } = React.use(params);
  const post = newsPosts.find((p) => p.slug === slug);

  // scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) return notFound();

  return (
    <div className="md:min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-black text-white flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-6 py-6 flex flex-col gap-6">
        <img
          src={post.image}
          alt={post.title}
          className="w-full rounded-lg shadow-lg"
        />
        <h1 className="text-3xl md:text-4xl font-extrabold">{post.title}</h1>
        <span className="text-sm text-gray-300">{post.date}</span>
        <p className="whitespace-pre-line text-lg">{post.modalText}</p>

        <div className="mt-8 text-center">
          <Link
            href="/news"
            className="
              inline-block px-6 py-3 rounded-full font-semibold text-white text-sm
              bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500
              bg-opacity-20 hover:bg-opacity-40
              transition-all duration-300
            "
          >
            ← Back to Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
