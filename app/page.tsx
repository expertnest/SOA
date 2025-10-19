"use client";

import BackgroundStars from "@/components/BackgroundStars";
import MusicVideos from "@/components/MusicVideos";
import NewsGrid from "@/components/NewsGrid";

export default function Home() {
  return (
    <div className="relative w-full bg-black text-white flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <BackgroundStars />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-row overflow-hidden">
        <div className="flex-1 overflow-y-auto px-2 md:px-4 py-0 md:pt-6 md:pb-4">
          <MusicVideos />
          <NewsGrid />
        </div>
      </div>
    </div>
  );
}
