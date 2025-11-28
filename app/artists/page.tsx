'use client';

import Image from "next/image";
import Link from "next/link";

const artists = [
  {
    name: "ShottiGotSwag",
    bio: "A rising star known for energetic performances and genre-bending sound. ShottiGotSwag fuses hip-hop, trap, and melodic flows that keep the crowd lit every time.",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    socials: {
      instagram: "https://instagram.com/",
      spotify: "#",
      youtube: "#",
    },
  },
  
];

export default function Artists() {
  return (
    <div className="relative w-full min-h-screen bg-black text-white flex flex-col items-center overflow-hidden px-4 py-10 sm:px-8">
      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-10">
          Featured Artists
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
          {artists.map((artist) => (
            <div
              key={artist.name}
              className="bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="relative w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-white/20">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>

              <h2 className="text-2xl font-bold mb-3">{artist.name}</h2>
              <p className="text-gray-300 text-sm mb-6">{artist.bio}</p>

              {/* Social Links */}
              <div className="flex space-x-4">
                <Link
                  href={artist.socials.instagram}
                  target="_blank"
                  className="text-gray-300 hover:text-pink-400 transition"
                >
                  Instagram
                </Link>
                <Link
                  href={artist.socials.spotify}
                  target="_blank"
                  className="text-gray-300 hover:text-green-400 transition"
                >
                  Spotify
                </Link>
                <Link
                  href={artist.socials.youtube}
                  target="_blank"
                  className="text-gray-300 hover:text-red-500 transition"
                >
                  YouTube
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black min-h-[80px]"></div>
    </div>
  );
}
