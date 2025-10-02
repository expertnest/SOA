"use client";

import { useState } from "react";
import { useMusic } from "@/hooks/MusicContext";
import { songs } from "@/data/songs";
import { Play, Pause, ArrowLeft, Search } from "lucide-react";

export default function LibraryPage() {
  const { currentSong, playSong, isPlaying, togglePlay } = useMusic();
  const [activeTab, setActiveTab] = useState<"songs" | "playlists">("songs");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique categories
  const categories = [...new Set(songs.map((s) => s.category))];

  // Filter songs by category and search term
  const filteredSongs = songs.filter((s) => {
    const matchesCategory = selectedCategory ? s.category === selectedCategory : true;
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.artist.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle clicking a song
  const handleSongClick = (song: (typeof songs)[0]) => {
    if (currentSong?.id === song.id) {
      togglePlay(); // pause/resume if same song
    } else {
      playSong(song); // start a new song
    }
  };

  return (
    <div className="flex flex-col p-6 h-full bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white">
      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-zinc-800">
        <button
          onClick={() => {
            setActiveTab("songs");
            setSelectedCategory(null);
          }}
          className={`pb-2 text-sm font-medium tracking-wide ${
            activeTab === "songs"
              ? "text-teal-400 border-b-2 border-teal-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Songs
        </button>
        <button
          onClick={() => {
            setActiveTab("playlists");
            setSelectedCategory(null);
          }}
          className={`pb-2 text-sm font-medium tracking-wide ${
            activeTab === "playlists"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Playlists
        </button>
      </div>

      {/* Album Art + Info */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-48 h-48 bg-zinc-800 rounded-xl overflow-hidden shadow-md border border-zinc-700">
          {currentSong?.image ? (
            <img
              src={currentSong.image}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
              No Art
            </div>
          )}
        </div>
        <h2 className="text-lg font-semibold mt-3">
          {currentSong?.title || "No song selected"}
        </h2>
        <p className="text-xs text-gray-400">{currentSong?.artist || ""}</p>
      </div>

      {/* Search bar */}
      {activeTab === "songs" && (
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      )}

      {/* Content */}
      {activeTab === "songs" ? (
        // SONGS LIST
        <div className="space-y-1 divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-900/30">
          {filteredSongs.map((song) => (
            <div
              key={song.id}
              className={`flex items-center justify-between p-3 transition ${
                currentSong?.id === song.id
                  ? "bg-gradient-to-r from-teal-500/10 to-purple-500/10"
                  : "hover:bg-zinc-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={song.image}
                  alt={song.title}
                  className="w-10 h-10 rounded-lg object-cover border border-zinc-700"
                />
                <div>
                  <p className="text-sm font-medium">{song.title}</p>
                  <p className="text-xs text-gray-400">{song.artist}</p>
                </div>
              </div>
              <button onClick={() => handleSongClick(song)}>
                {currentSong?.id === song.id && isPlaying ? (
                  <Pause className="text-teal-400" size={18} />
                ) : (
                  <Play className="text-gray-400" size={18} />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : selectedCategory ? (
        // SONGS WITHIN SELECTED CATEGORY
        <div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4"
          >
            <ArrowLeft size={16} /> Back to Playlists
          </button>
          <div className="space-y-1 divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-900/30">
            {filteredSongs.map((song) => (
              <div
                key={song.id}
                className={`flex items-center justify-between p-3 transition ${
                  currentSong?.id === song.id
                    ? "bg-gradient-to-r from-teal-500/10 to-purple-500/10"
                    : "hover:bg-zinc-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-10 h-10 rounded-lg object-cover border border-zinc-700"
                  />
                  <div>
                    <p className="text-sm font-medium">{song.title}</p>
                    <p className="text-xs text-gray-400">{song.artist}</p>
                  </div>
                </div>
                <button onClick={() => handleSongClick(song)}>
                  {currentSong?.id === song.id && isPlaying ? (
                    <Pause className="text-teal-400" size={18} />
                  ) : (
                    <Play className="text-gray-400" size={18} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // CATEGORY LIST
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 cursor-pointer hover:bg-gradient-to-r hover:from-teal-500/10 hover:to-purple-500/10 transition"
              onClick={() => setSelectedCategory(cat)}
            >
              <h3 className="text-sm font-medium">{cat}</h3>
              <p className="text-xs text-gray-400">
                {songs.filter((s) => s.category === cat).length} songs
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
