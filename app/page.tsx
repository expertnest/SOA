"use client";

import BackgroundStars from "@/components/BackgroundStars";
import MusicVideos from "@/components/MusicVideos";
import NewsGrid from "@/components/NewsGrid";

export default function Home() {
  return (
    <div className="relative w-full bg-black text-white flex flex-col overflow-hidden min-h-screen">
      <div className="absolute inset-0 z-0">
         
      </div>

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-2 md:px-4 py-4">
          <MusicVideos />
          <div className="mt-6 md:mt-8">
            <NewsGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
