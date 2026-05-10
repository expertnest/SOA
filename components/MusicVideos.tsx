"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { musicVideos } from "@/data/musicVideos";

type Video = {
  id: number;
  title: string;
  thumbnail?: string;
};

type Tab = "Music Video" | "Stories" | "Reels";

const storyGradients = [
  "from-pink-500 via-red-500 to-yellow-500",
  "from-purple-500 via-pink-500 to-red-500",
  "from-blue-500 via-cyan-400 to-green-400",
  "from-yellow-400 via-orange-500 to-pink-500",
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-green-400 via-emerald-500 to-cyan-500",
];

export default function MusicVideos() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Music Video");

  const tabs: Tab[] = ["Music Video", "Stories", "Reels"];

  const tabData: Record<Tab, Video[]> = {
    "Music Video": musicVideos,
    Stories: musicVideos.slice(0, 6),
    Reels: musicVideos.slice(0, 6),
  };

  return (
    <div className="mt-4 md:mt-6 bg-black p-4 md:p-0">

      {/* HEADER */}
    

      {/* TABS */}
      <div className="flex justify-center space-x-6 text-sm font-semibold text-white mb-6 md:hidden">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`transition ${
              activeTab === tab ? "text-white" : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* IG STORIES ROW (ONLY UI NOW)
      
      
      
      
      
      
      
      
      
      
      
      
      
      */}
 

    </div>
  );
}