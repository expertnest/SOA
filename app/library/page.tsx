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

  const SongListWrapper = ({ children }: { children: React.ReactNode }) => (
    <div
      className="
        space-y-1 divide-y divide-zinc-800 rounded-xl bg-zinc-900/30 
        overflow-auto
        max-h-[calc(7*3rem)] pb-6 md:max-h-full
        "
    >
      {children}
    </div>
  );

  return (
    <div className="flex flex-col   bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white">
      {/* Categories */}
      <div className="flex flex-wrap  md:mt-6 gap-2 justify-center p-4 md:p-0">
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

      {/* Scrollable Content */}
      <div className="flex flex-col flex-1 px-6 pb-[120px] gap-6">
        {/* Album Art + Info */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-48 h-48 md:mt-6 bg-zinc-800 rounded-xl overflow-hidden shadow-md border border-zinc-700">
            {currentSong?.image ? (
              <img src={currentSong.image} alt={currentSong.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No Art</div>
            )}
          </div>
          <h2 className="text-lg font-semibold mt-3">{currentSong?.title || "No song selected"}</h2>
          <p className="text-xs text-gray-400">{currentSong?.artist || ""}</p>
        </div>

        {/* Search */}
        <div className="relative flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {/* Song List */}
        <SongListWrapper>
          {filteredSongs.map((song) => {
            const isCurrent = currentSong?.id === song.id;
            return (
              <div
                key={song.id}
                onClick={() => handleRowClick(song)}
                className={`flex items-center justify-between p-3 cursor-pointer transition ${
                  isCurrent ? "bg-gradient-to-r from-teal-500/10 to-purple-500/10" : "hover:bg-zinc-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium">{song.title}</p>
                    <p className="text-xs text-gray-400">{song.artist}</p>
                  </div>
                </div>
                <button onClick={(e) => handleButtonClick(e, song)}>
                  {isCurrent && isPlaying ? (
                    <Pause className="text-teal-400" size={18} />
                  ) : (
                    <Play className="text-gray-400" size={18} />
                  )}
                </button>
              </div>
            );
          })}
        </SongListWrapper>
      </div>
    </div>
  );
}
