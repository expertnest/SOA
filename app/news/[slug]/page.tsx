'use client';

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
    <div className="md:min-h-screen bg-black text-white flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-6 py-6 flex flex-col gap-6">
        {/* Post Image */}
        <img
          src={post.image}
          alt={post.title}
          className="w-full rounded-lg shadow-xl"
        />

        {/* Post Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold">{post.title}</h1>

        {/* Post Date */}
        <span className="text-sm text-gray-400">{post.date}</span>

        {/* Post Content */}
        <p className="whitespace-pre-line text-lg text-gray-200">{post.modalText}</p>

        {/* Back Button */}
        <div className="mt-8 text-left">
  <Link
    href="/"
    className="
      inline-block px-5 py-2 rounded-full font-medium text-white text-sm
      bg-black/30 hover:bg-white/10
      border border-white/20
      transition-all duration-300
    "
  >
    ← Back to Home
  </Link>
</div>
      </div>
    </div>
  );
}
