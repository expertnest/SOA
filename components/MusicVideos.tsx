"use client";

import { useRouter } from "next/navigation";
import { musicVideos } from "@/data/musicVideos";
import { FaPlay } from "react-icons/fa";

export default function MusicVideos() {
  const router = useRouter();

  return (
    <div className="mt-4 md:mt-6">
      <div className="text-center mb-4 md:hidden">
        <h1 className="text-4xl font-extrabold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 drop-shadow-lg select-none">
          State of the Art
        </h1>
      </div>

      <div className="text-center">
        <h2 className="text-lg md:text-xl font-bold uppercase mb-2 flex justify-center gap-4">
          <span className="text-white">Music Videos</span>
        </h2>
      </div>

      <div className="flex space-x-3 overflow-x-auto pb-2 mt-6 scrollbar-hide snap-x snap-mandatory">
        {musicVideos.map((mv, idx) => (
          <div
            key={mv.id}
            onClick={() =>
              router.push(`/video-scroll?start=${idx}`)
            }
            className={`flex-shrink-0 w-36 h-52 md:w-48 md:h-64 rounded-lg shadow-lg bg-gradient-to-br ${mv.color} cursor-pointer relative transform transition-transform duration-300 hover:scale-105 flex items-end justify-center`}
          >
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 flex items-center justify-between rounded-b-lg">
              <span className="text-white font-medium text-sm truncate">
                {mv.title}
              </span>
              <FaPlay className="text-white text-base" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
