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
      {/* Sticky Filters */}
      <div className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-md p-3 border-b border-zinc-800">
        <div className="flex flex-wrap gap-2 justify-center mb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                selectedCategory === cat
                  ? "bg-teal-500 text-black border-teal-500"
                  : "text-gray-400 border-gray-700 hover:text-white hover:border-gray-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-[140px]">
        {/* Album Art + Info */}
        <div className="flex flex-col items-center my-6">
          <div className="w-40 h-40 sm:w-48 sm:h-48 bg-zinc-800 rounded-xl overflow-hidden shadow-md border border-zinc-700">
            {currentSong?.image ? (
              <img src={currentSong.image} alt={currentSong.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No Art</div>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-semibold mt-3 text-center">
            {currentSong?.title || "No song selected"}
          </h2>
          <p className="text-xs text-gray-400">{currentSong?.artist || ""}</p>
        </div>

        {/* Song List */}
        <div className="space-y-1 divide-y divide-zinc-800 rounded-xl bg-zinc-900/30">
          {filteredSongs.map((song) => {
            const isCurrent = currentSong?.id === song.id;
            return (
              <div
                key={song.id}
                onClick={() => handleRowClick(song)}
                className={`flex items-center justify-between p-4 cursor-pointer transition active:scale-[0.99] ${
                  isCurrent
                    ? "bg-gradient-to-r from-teal-500/10 to-purple-500/10"
                    : "hover:bg-zinc-800/50"
                }`}
              >
                <div>
                  <p className="text-sm font-medium">{song.title}</p>
                  <p className="text-xs text-gray-400">{song.artist}</p>
                </div>
                <button
                  onClick={(e) => handleButtonClick(e, song)}
                  className="p-2 rounded-full hover:bg-zinc-800"
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
    </div>
  );
}
