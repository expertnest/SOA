'use client'

import { musicVideos } from "@/data/musicVideos"

export default function MusicVideos() {
  return (
    <div className="mt-6">
    <h2 className="text-lg md:text-xl font-bold uppercase mb-2 flex space-x-4">
      <span className="text-white">Music Videos</span>
      <span className="text-white/50 hover:text-white cursor-pointer">Shorts</span>
      <span className="text-white/50 hover:text-white cursor-pointer">Podcasts</span>
    </h2>
    <div className="flex space-x-3 overflow-x-auto pb-2 mt-6">
      {musicVideos.map((mv) => (
        <div key={mv.id} className={`flex-shrink-0 w-48 h-64 rounded-lg shadow bg-gradient-to-br ${mv.color} flex items-center justify-center cursor-pointer`}>
          <p className="text-white font-bold text-center">{mv.title}</p>
        </div>
      ))}
    </div>
  </div>
  )
}
