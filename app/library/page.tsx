"use client";

import { useState } from "react";
import { useMusic } from "@/hooks/MusicContext";
import { songs } from "@/data/songs";
import { Play, Pause, Search } from "lucide-react";

export default function LibraryPage() {
  const { currentSong, playSong, isPlaying, togglePlay } = useMusic();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [...new Set(songs.map((s) => s.category))];

  const filteredSongs = songs.filter((s) => {
    const matchesCategory = selectedCategory ? s.category === selectedCategory : true;
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.artist.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRowClick = (song: typeof songs[0]) => {
    if (currentSong?.id !== song.id) playSong(song);
  };

  const handleButtonClick = (e: React.MouseEvent, song: typeof songs[0]) => {
    e.stopPropagation();
    if (currentSong?.id === song.id) togglePlay();
    else playSong(song);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white">
      {/* Categories */}
      <div className="p-3 sm:p-4 flex flex-wrap gap-2 justify-center border-b border-zinc-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              selectedCategory === cat
                ? "bg-teal-500 text-black shadow-md"
                : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative p-3 sm:p-4 border-b border-zinc-800">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search songs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      {/* Scrollable Song List */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-28">
        {filteredSongs.map((song) => {
          const isCurrent = currentSong?.id === song.id;
          return (
            <div
              key={song.id}
              onClick={() => handleRowClick(song)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
                isCurrent ? "bg-gradient-to-r from-teal-500/10 to-purple-500/10" : "hover:bg-zinc-800/50"
              }`}
            >
              <div className="flex flex-col">
                <p className="text-sm sm:text-base font-medium line-clamp-1">{song.title}</p>
                <p className="text-xs sm:text-sm text-gray-400 line-clamp-1">{song.artist}</p>
              </div>
              <button
                onClick={(e) => handleButtonClick(e, song)}
                className="ml-3 rounded-full p-2 hover:bg-zinc-800"
              >
                {isCurrent && isPlaying ? (
                  <Pause className="text-teal-400" size={20} />
                ) : (
                  <Play className="text-gray-400" size={20} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
