'use client'

import { useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Image from 'next/image';
import Link from 'next/link';

const videos = [
  { id: 1, title: 'Swerve', thumbnail: '/videos/swerve.jpg', url: '/videos/swerve.mp4' },
  { id: 2, title: 'Money Walk', thumbnail: '/videos/moneywalk.jpg', url: '/videos/moneywalk.mp4' },
  { id: 3, title: 'New Track', thumbnail: '/videos/newtrack.jpg', url: '/videos/newtrack.mp4' },
  { id: 4, title: 'Hit Song', thumbnail: '/videos/hitsong.jpg', url: '/videos/hitsong.mp4' },
];

const songs = [
  { id: 1, title: 'Swerve', artist: 'State of the Art', duration: '3:25' },
  { id: 2, title: 'Money Walk', artist: 'State of the Art', duration: '2:58' },
  { id: 3, title: 'New Track', artist: 'State of the Art', duration: '3:12' },
  { id: 4, title: 'Hit Song', artist: 'State of the Art', duration: '4:01' },
];

export default function MusicGallery() {
  const [currentVideo, setCurrentVideo] = useState(videos[0]);
  const [sliderRef] = useKeenSlider({
    slides: { perView: 3, spacing: 15 },
    breakpoints: {
      '(max-width: 768px)': { slides: { perView: 1, spacing: 10 } },
      '(max-width: 1024px)': { slides: { perView: 2, spacing: 15 } },
    },
  });

  return (
    <div className="relative bg-black min-h-screen overflow-hidden">
      {/* Stars Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-repeat opacity-70"></div>
      </div>

      {/* Header - absolute over background */}
      <header className="absolute top-0 left-0 w-full bg-zinc-900/80 py-6 px-6 flex flex-col items-start shadow-lg z-20">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-[0.1em] text-white">
          Music Videos
        </h1>
        <Link
          href="/"
          className="mt-2 text-white uppercase tracking-[0.2em] text-sm md:text-base font-bold cursor-pointer transition hover:text-gray-400"
        >
          &larr; Back to Menu
        </Link>
      </header>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-32 flex flex-col">
        {/* Featured Video */}
        <div className="w-full mb-8">
          <video
            key={currentVideo.id}
            controls
            src={currentVideo.url}
            className="w-full rounded-xl shadow-lg"
          />
          <h2 className="mt-4 text-xl font-bold text-white">{currentVideo.title}</h2>
        </div>

        {/* Video Slider */}
        <div ref={sliderRef} className="keen-slider mb-12">
          {videos.map((video) => (
            <div
              key={video.id}
              className="keen-slider__slide cursor-pointer relative rounded-lg overflow-hidden shadow-md"
              onClick={() => setCurrentVideo(video)}
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                width={400}
                height={225}
                className="object-cover w-full h-48"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"></div>
              <p className="mt-2 text-center text-white font-semibold">{video.title}</p>
            </div>
          ))}
        </div>

        {/* Song Playlist */}
        <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 rounded-xl p-6 shadow-lg">
  <h3 className="text-2xl font-bold text-white mb-4">Playlist</h3>
  <div className="space-y-3">
    {songs.map((song, index) => (
      <div
        key={song.id}
        className="flex items-center justify-between bg-indigo-900 hover:bg-purple-800 p-3 rounded-lg cursor-pointer transition"
      >
        <div className="flex items-center space-x-3">
          <span className="text-gray-300">{index + 1}</span>
          <div>
            <p className="text-white font-medium">{song.title}</p>
            <p className="text-gray-300 text-sm">{song.artist}</p>
          </div>
        </div>
        <span className="text-gray-300">{song.duration}</span>
      </div>
    ))}
  </div>
</div>
      </div>
    </div>
  );
}
