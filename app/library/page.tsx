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
        max-h-[calc(7*3rem)] mt-2
      "
    >
      {children}
    </div>
  );

  return (
    <div className="flex flex-col bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white">
      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center p-2 md:p-0 mt-2 md:mt-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`px-2.5 py-1 rounded-full text-[12px] sm:text-[13px] md:text-xs font-medium border transition ${
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
      <div className="flex flex-col flex-1 px-3 sm:px-5 gap-3 sm:gap-5 md:gap-6">
        {/* Album Art + Info */}
        <div className="flex flex-col items-center flex-shrink-0 mt-2 md:mt-6">
          <div className="w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-zinc-800 rounded-xl overflow-hidden shadow-md border border-zinc-700">
            {currentSong?.image ? (
              <img src={currentSong.image} alt={currentSong.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-[12px] sm:text-[13px] md:text-sm">
                No Art
              </div>
            )}
          </div>
          <h2 className="text-[14px] sm:text-[15px] md:text-lg font-semibold mt-2">{currentSong?.title || "No song selected"}</h2>
          <p className="text-[12px] sm:text-[13px] md:text-xs text-gray-400">{currentSong?.artist || ""}</p>
        </div>

        {/* Search */}
        <div className="relative flex-shrink-0">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Search songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-2 py-1.5 sm:py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
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
                className={`flex items-center justify-between p-2.5 sm:p-3 cursor-pointer transition ${
                  isCurrent ? "bg-gradient-to-r from-teal-500/10 to-purple-500/10" : "hover:bg-zinc-800/50"
                }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div>
                    <p className="text-[12px] sm:text-[13px] font-medium">{song.title}</p>
                    <p className="text-[11px] sm:text-[12px] text-gray-400">{song.artist}</p>
                  </div>
                </div>
                <button onClick={(e) => handleButtonClick(e, song)}>
                  {isCurrent && isPlaying ? (
                    <Pause className="text-teal-400" size={17} />
                  ) : (
                    <Play className="text-gray-400" size={17} />
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
