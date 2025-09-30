'use client'

import { Play, Pause, SkipBack, SkipForward } from "lucide-react"

export interface Song {
  id: number
  title: string
  artist: string
}

interface MusicPlayerProps {
  currentSong: Song
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
}

export default function MusicPlayer({ currentSong, isPlaying, setIsPlaying }: MusicPlayerProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-gray-700 p-3">
      <p className="text-xs text-white/70 uppercase mb-2">Now Playing</p>
      <div className="bg-zinc-800 rounded-lg p-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-pink-500 rounded"></div>
        <div className="flex-1">
          <p className="text-sm font-semibold">{currentSong.title}</p>
          <p className="text-xs text-white/60">{currentSong.artist}</p>
        </div>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>

      <div className="flex items-center justify-between mt-2 text-white/70">
        <button><SkipBack size={18} /></button>
        <div className="flex-1 h-1 mx-2 bg-gray-600 rounded">
          <div className="w-1/3 h-1 bg-pink-500 rounded"></div>
        </div>
        <button><SkipForward size={18} /></button>
      </div>
    </div>
  )
}
