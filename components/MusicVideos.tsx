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
      <div className="text-center mt-6 mb-4">
        <h1 className="text-4xl font-extrabold uppercase tracking-wider text-white">
          SOA Music
        </h1>
      </div>

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

      {/* IG STORIES ROW (ONLY UI NOW) */}
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide px-2">

        {tabData[activeTab].map((video, idx) => {
          const gradient = storyGradients[idx % storyGradients.length];

          return (
            <div
              key={video.id}
              onClick={() => router.push(`/video-scroll?start=${idx}`)}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer active:scale-95 transition"
            >

              {/* Gradient Ring (IG STYLE) */}
              <div className={`p-[2.5px] rounded-full bg-gradient-to-tr ${gradient}`}>
                <div className="p-[2.5px] bg-black rounded-full">

                  {/* STORY CIRCLE */}
                  <div
                    className="w-18 h-18 md:w-20 md:h-20 rounded-full bg-cover bg-center border border-black"
                    style={{
                      backgroundImage: `url(${
                        video.thumbnail || "/placeholder.png"
                      })`,
                    }}
                  />
                </div>
              </div>

              {/* LABEL */}
              <span className="text-[11px] text-white mt-2 w-16 text-center truncate">
                {video.title}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}