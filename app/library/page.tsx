"use client"

import { useState } from "react"
import { useMusic } from "@/hooks/MusicContext"
import { songs } from "@/data/songs"
import { Play, Pause, ArrowLeft } from "lucide-react"

export default function LibraryPage() {
  const { currentSong, playSong } = useMusic()
  const [activeTab, setActiveTab] = useState<"songs" | "playlists">("songs")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Get unique categories from songs
  const categories = [...new Set(songs.map((s) => s.category))]

  // Filter songs by selected category (if any)
  const filteredSongs = selectedCategory
    ? songs.filter((s) => s.category === selectedCategory)
    : songs

  return (
    <div className="flex flex-col p-6 h-full bg-black text-white">
      {/* Tabs */}
      <div className="flex gap-6 mb-6">
        <button
          onClick={() => {
            setActiveTab("songs")
            setSelectedCategory(null)
          }}
          className={`pb-2 font-semibold ${
            activeTab === "songs"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500 border-b-2 border-teal-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Songs
        </button>
        <button
          onClick={() => {
            setActiveTab("playlists")
            setSelectedCategory(null)
          }}
          className={`pb-2 font-semibold ${
            activeTab === "playlists"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500 border-b-2 border-purple-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Playlists
        </button>
      </div>

      {/* Album Art + Info */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-72 h-72 bg-zinc-900 rounded-2xl overflow-hidden shadow-lg">
          {currentSong?.image ? (
            <img
              src={currentSong.image}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Art
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold mt-4">
          {currentSong?.title || "No song selected"}
        </h2>
        <p className="text-gray-400">{currentSong?.artist || ""}</p>
      </div>

      {/* Content */}
      {activeTab === "songs" ? (
        // SONGS LIST
        <div className="space-y-3">
          {filteredSongs.map((song) => (
            <div
              key={song.id}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                currentSong?.id === song.id
                  ? "bg-gradient-to-r from-teal-500/20 to-purple-500/20"
                  : "hover:bg-zinc-800"
              }`}
              onClick={() => playSong(song)}
            >
              <div className="flex items-center gap-4">
                <img
                  src={song.image}
                  alt={song.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold">{song.title}</p>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
              </div>
              {currentSong?.id === song.id ? (
                <Pause className="text-teal-400" size={20} />
              ) : (
                <Play className="text-gray-400" size={20} />
              )}
            </div>
          ))}
        </div>
      ) : selectedCategory ? (
        // SONGS WITHIN SELECTED CATEGORY
        <div className="space-y-3">
          {/* Back Button */}
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft size={18} /> Back to Playlists
          </button>
          {filteredSongs.map((song) => (
            <div
              key={song.id}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                currentSong?.id === song.id
                  ? "bg-gradient-to-r from-teal-500/20 to-purple-500/20"
                  : "hover:bg-zinc-800"
              }`}
              onClick={() => playSong(song)}
            >
              <div className="flex items-center gap-4">
                <img
                  src={song.image}
                  alt={song.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold">{song.title}</p>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
              </div>
              {currentSong?.id === song.id ? (
                <Pause className="text-teal-400" size={20} />
              ) : (
                <Play className="text-gray-400" size={20} />
              )}
            </div>
          ))}
        </div>
      ) : (
        // CATEGORY LIST
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat}
              className="bg-zinc-900 rounded-xl p-6 cursor-pointer hover:bg-gradient-to-r hover:from-teal-500/20 hover:to-purple-500/20 transition"
              onClick={() => setSelectedCategory(cat)}
            >
              <h3 className="text-lg font-semibold">{cat}</h3>
              <p className="text-sm text-gray-400">
                {songs.filter((s) => s.category === cat).length} songs
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
