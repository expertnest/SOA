"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";
import { musicVideos } from "@/data/musicVideos";

type Video = {
  id: number;
  title: string;
  color?: string;
  thumbnail?: string;
};

type Tab = "Music Video" | "Stories" | "Reels";

export default function MusicVideos() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Music Video");

  const tabs: Tab[] = ["Music Video", "Stories", "Reels"];

  const tabData: Record<Tab, Video[]> = {
    "Music Video": musicVideos,
    Stories: musicVideos.slice(0, 3),
    Reels: musicVideos.slice(0, 4),
  };

  return (
    <div className="mt-4 md:mt-6 bg-black p-4 md:p-0">
      {/* Mobile Brand  TOP SQARESSSS*/}
      <div className="relative mb-4 md:hidden">
        {/* Top-left and top-right links */}
        <div className="w-full flex justify-between px-4 py-2 mb-2">
        {/* <a
            href="#mac-phantom"
            className="text-xs font-bold uppercase tracking-widest text-white bg-white/10 hover:bg-white/20 active:bg-white/30 px-3 py-1 rounded transition"
          >
            Mac Phantom
          </a> */}
       {/*
<a
  href="#qmilly"
  className="text-xs font-bold uppercase tracking-widest text-white bg-white/10 hover:bg-white/20 active:bg-white/30 px-3 py-1 rounded transition"
>
</a>
*/}
        </div>

        {/* Main title */}
        <div className="text-center mt-8">
          <h1 className="text-4xl font-extrabold uppercase tracking-wider text-white drop-shadow select-none">
          SOA Music
          </h1>
        </div>
      </div>

      {/* Tab selector (no dots) */}
      <div className="flex justify-center space-x-6 text-sm font-semibold text-white mb-4 md:hidden">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`focus:outline-none ${
              activeTab === tab ? "text-white" : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Horizontal Scroll of Videos */}
      <div className="flex space-x-3 overflow-x-auto pb-2 mt-6 scrollbar-hide snap-x snap-mandatory">
        {tabData[activeTab].map((mv, idx) => (
          <div
            key={mv.id}
            onClick={() => router.push(`/video-scroll?start=${idx}`)}
            className="flex-shrink-0 w-36 h-52 md:w-48 md:h-64 rounded-lg shadow-lg cursor-pointer relative transform transition-transform duration-300 hover:scale-105 flex items-end justify-center overflow-hidden border border-white/20"
          >
            {/* Thumbnail Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
              style={{
                backgroundImage: `url(${mv.thumbnail || "/placeholder.png"})`,
              }}
            ></div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50 hover:bg-black/60 transition-colors duration-300"></div>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-3 py-2 flex items-center justify-between rounded-b-lg">
              <span className="text-white font-medium text-sm truncate">{mv.title}</span>
              <FaPlay className="text-white text-base" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
