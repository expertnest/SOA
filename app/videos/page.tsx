"use client";

import { FaPlay } from "react-icons/fa";

const videoData = {
  "Music Videos": [
    { id: 1, title: "Hit Track 1" },
    { id: 2, title: "Hit Track 2" },
    { id: 3, title: "Hit Track 3" },
    { id: 4, title: "Hit Track 4" },
    { id: 5, title: "Hit Track 5" },
    { id: 6, title: "Hit Track 6" },
  ],
  Podcasts: [
    { id: 7, title: "Podcast Ep. 1" },
    { id: 8, title: "Podcast Ep. 2" },
    { id: 9, title: "Podcast Ep. 3" },
    { id: 10, title: "Podcast Ep. 4" },
    { id: 11, title: "Podcast Ep. 5" },
    { id: 12, title: "Podcast Ep. 6" },
  ],
  "Behind the Scenes": [
    { id: 13, title: "BTS 1" },
    { id: 14, title: "BTS 2" },
    { id: 15, title: "BTS 3" },
    { id: 16, title: "BTS 4" },
    { id: 17, title: "BTS 5" },
  ],
  "Live Performances": [
    { id: 18, title: "Live Show 1" },
    { id: 19, title: "Live Show 2" },
    { id: 20, title: "Live Show 3" },
    { id: 21, title: "Live Show 4" },
    { id: 22, title: "Live Show 5" },
  ],
  Stories: [
    { id: 23, title: "Story 1" },
    { id: 24, title: "Story 2" },
    { id: 25, title: "Story 3" },
    { id: 26, title: "Story 4" },
    { id: 27, title: "Story 5" },
  ],
};

const colors = [
  "from-gray-900 to-gray-800",
  "from-red-900 to-red-700",
  "from-purple-900 to-purple-700",
  "from-indigo-900 to-indigo-700",
  "from-black to-gray-900",
];

export default function VideoContents() {
  const categories = Object.entries(videoData);

  return (
    <div className="bg-black  text-white px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-bold mb-6">Video Library</h1>

      {categories.map(([category, videos], idx) => (
        <div
          key={category}
          className={`mb-10 ${
            idx === categories.length - 1 ? " " : ""
          }`} 
        >
          <h2 className="text-xl font-semibold mb-3">{category}</h2>
          <VideoRow videos={videos} />
        </div>
      ))}
    </div>
  );
}

function VideoRow({ videos }: { videos: { id: number; title: string }[] }) {
  return (
    <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
      {videos.map((video, idx) => {
        const colorClass = colors[idx % colors.length];
        return (
          <div
            key={video.id}
            className={`flex-shrink-0 
              w-56 h-32   /* mobile */
              sm:w-64 sm:h-36   /* tablet */
              lg:w-80 lg:h-44   /* desktop bigger */
              rounded-md shadow-lg bg-gradient-to-br ${colorClass} 
              cursor-pointer snap-start relative 
              transform transition-transform duration-300 hover:scale-105`}
          >
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 flex items-center justify-between">
              <span className="text-white font-medium text-sm truncate">
                {video.title}
              </span>
              <FaPlay className="text-white text-base" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
