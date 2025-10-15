"use client"

import { useState } from "react"
import { newsPosts } from "@/data/newPosts"
import Newsletter from "./Newsletter"

// Define the type for a post
type Post = {
  id: number
  headline: string
  subheadline: string
  title: string
  date: string
  modalText: string
  image: string
  color: string
  span?: string
}

export default function NewsGrid() {
  // Update the state type to include both Post and null
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  const featured = newsPosts.find((post) => post.id === 1)
  const others = newsPosts.filter((post) => post.id !== 1)

  return (
    <>
      {/* --- Featured Post --- */}
      {featured && (
        <div
          key={featured.id}
          className="relative rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:scale-[1.02] transition-transform flex flex-col md:col-span-2 md:row-span-2 cursor-pointer"
          onClick={() => setSelectedPost(featured)}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${featured.image})` }}
          ></div>
          <div
            className={`absolute inset-0 bg-gradient-to-br ${featured.color} opacity-30`}
          ></div>
          <div className="relative z-10 p-4 md:p-6 flex flex-col justify-end h-full">
            <span className="text-xs text-white/70 uppercase mb-2">{featured.date}</span>
            <h2 className="text-xl md:text-2xl font-bold mb-2">{featured.headline}</h2>
          </div>
        </div>
      )}
 
   <Newsletter />
 
     

      {/* --- Other Posts Grid --- */}
      {others.map((post, index) => (
  <div
    key={post.id}
    className={`relative rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:scale-[1.02] transition-transform flex flex-col ${post.span} ${
      index === 0 ? "h-full md:mt-0" : ""
    } ${index === others.length - 1 ? "mb-12 md:mb-0" : ""} cursor-pointer`} // <-- add mb-24 to last post
    onClick={() => setSelectedPost(post)}
  >
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${post.image})` }}
    ></div>
    <div
      className={`absolute inset-0 bg-gradient-to-br ${post.color} opacity-30`}
    ></div>
    <div className="relative z-10 p-2 md:p-4 flex flex-col justify-end h-full">
      <span className="text-[9px] sm:text-xs text-white/70 uppercase mb-1">
        {post.date}
      </span>
      <h2 className="text-sm sm:text-lg font-semibold mb-1">{post.headline}</h2>
    </div>
  </div>
))}

      {/* --- Modal --- */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-gray-900 rounded-xl max-w-3xl w-full p-8 relative shadow-lg overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-white text-2xl font-bold"
              onClick={() => setSelectedPost(null)}
            >
              ×
            </button>
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full rounded mb-6"
            />
            <h2 className="text-2xl font-bold mb-3">{selectedPost.title}</h2>
            <span className="text-sm text-white/70 mb-4 block">{selectedPost.date}</span>
            <p className="text-white/90 whitespace-pre-line">{selectedPost.modalText}</p>
          </div>
        </div>
      )}
    </>
  )
}