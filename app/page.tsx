"use client";

import BackgroundStars from "@/components/BackgroundStars";
import MusicVideos from "@/components/MusicVideos";
import NewsGrid from "@/components/NewsGrid";

export default function Home() {
  return (
    <div className="relative w-full bg-black text-white flex flex-col overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 z-0">
        <BackgroundStars />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex flex-1 flex-row overflow-hidden">
        {/* Middle Feed (no own scroll, let parent scroll) */}
        <div className="flex-1 px-2 md:px-4 py-4 md:pt-8 md:pb-6">
          {/* Music Videos */}
          <MusicVideos />

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 auto-rows-[180px] sm:auto-rows-[220px] gap-3 md:gap-6 w-full mt-6">
            <NewsGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
