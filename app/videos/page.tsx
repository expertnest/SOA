"use client";

import { useState, useRef } from "react";
import { FaPlay } from "react-icons/fa";

const videoData = {
  "Music Videos": [
    { id: 1, title: "Hit Track 1", url: "https://www.youtube.com/embed/abc1" },
    { id: 2, title: "Hit Track 2", url: "https://www.youtube.com/embed/abc2" },
    { id: 3, title: "Hit Track 3", url: "https://www.youtube.com/embed/abc3" },
  ],
  Podcasts: [
    { id: 7, title: "Podcast Ep. 1", url: "https://www.youtube.com/embed/pod1" },
    { id: 8, title: "Podcast Ep. 2", url: "https://www.youtube.com/embed/pod2" },
  ],
  "Behind the Scenes": [
    { id: 13, title: "BTS 1", url: "https://www.youtube.com/embed/bts1" },
  ],
  "Live Performances": [
    { id: 18, title: "Live Show 1", url: "https://www.youtube.com/embed/live1" },
  ],
  Stories: [
    { id: 23, title: "Story 1", url: "https://www.youtube.com/embed/story1" },
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
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);

  const allVideos = categories.flatMap(([_, vids]) => vids);

  const handleUpArrow = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      videoRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDownArrow = () => {
    if (currentIndex < allVideos.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      videoRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (!videoContainerRef.current) return;
    const scrollTop = videoContainerRef.current.scrollTop;
    const newIndex = Math.round(scrollTop / window.innerHeight);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="bg-black text-white px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-bold mb-6">Video Library</h1>

      {categories.map(([category, videos], idx) => (
        <div
          key={category}
          className={`mb-10 ${idx === categories.length - 1 ? "pb-24 sm:pb-32" : ""}`}
        >
          <h2 className="text-xl font-semibold mb-3">{category}</h2>
          <VideoRow
            videos={videos}
            onClick={(id) => {
              setSelectedVideo(id);
              const index = allVideos.findIndex((v) => v.id === id);
              setCurrentIndex(index);
            }}
          />
        </div>
      ))}

      {selectedVideo !== null && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Close Button - lowered on mobile */}
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-16 sm:top-4 right-4 text-white text-3xl z-50 bg-black/50 hover:bg-black/70 rounded-full w-12 h-12 flex items-center justify-center"
          >
            ✕
          </button>

          <div className="w-full h-full relative flex items-center justify-center">
            {/* Scrollable video container */}
            <div
              ref={videoContainerRef}
              className="w-full h-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
              onScroll={handleScroll}
            >
              {allVideos.map((video, idx) => (
                <div
                  key={video.id}
                  ref={(el: HTMLDivElement | null) => {
                    videoRefs.current[idx] = el;
                  }}
                  className="w-full h-screen flex items-center justify-center snap-start"
                >
                  <iframe
                    src={video.url}
                    title={video.title}
                    className="w-full h-full sm:w-96 sm:h-[600px] md:w-[400px] lg:w-[500px] lg:h-[700px]"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>

            {/* Subtle Up/Down arrows */}
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col space-y-3 z-50">
              <button
                onClick={handleUpArrow}
                className="bg-white/10 hover:bg-white/20 text-white text-xl p-2 rounded transition"
              >
                ↑
              </button>
              <button
                onClick={handleDownArrow}
                className="bg-white/10 hover:bg-white/20 text-white text-xl p-2 rounded transition"
              >
                ↓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VideoRow({
  videos,
  onClick,
}: {
  videos: { id: number; title: string; url: string }[];
  onClick: (id: number) => void;
}) {
  return (
    <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
      {videos.map((video, idx) => {
        const colorClass = colors[idx % colors.length];
        return (
          <div
            key={video.id}
            onClick={() => onClick(video.id)}
            className={`flex-shrink-0 w-56 h-32 sm:w-64 sm:h-36 lg:w-80 lg:h-44 rounded-md shadow-lg bg-gradient-to-br ${colorClass} cursor-pointer snap-start relative transform transition-transform duration-300 hover:scale-105`}
          >
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 flex items-center justify-between">
              <span className="text-white font-medium text-sm truncate">{video.title}</span>
              <FaPlay className="text-white text-base" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
