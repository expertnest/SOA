"use client";

import Link from "next/link";
import { Home, ShoppingBag, MapPin, PlayCircle, Phone } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-around bg-black border-t border-gray-800 p-2 text-gray-400">
      {/* Home */}
      <Link
        href="/news"
        className="flex flex-col items-center text-sm hover:text-[#00ffff] transition-colors"
      >
        <Home size={22} />
        <span className="text-xs">Home</span>
      </Link>

      {/* Merch */}
      <Link
        href="/merch"
        className="flex flex-col items-center text-sm hover:text-[#00ffff] transition-colors"
      >
        <ShoppingBag size={22} />
        <span className="text-xs">Merch</span>
      </Link>

      {/* Tour */}
      <Link
        href="/tour"
        className="flex flex-col items-center text-sm hover:text-[#00ffff] transition-colors"
      >
        <MapPin size={22} />
        <span className="text-xs">Tour</span>
      </Link>

      {/* Library / Videos */}
      <Link
        href="/videos"
        className="flex flex-col items-center text-sm hover:text-[#00ffff] transition-colors"
      >
        <PlayCircle size={22} />
        <span className="text-xs">Videos</span>
      </Link>

      {/* Contact */}
      <Link
        href="/contact"
        className="flex flex-col items-center text-sm hover:text-[#00ffff] transition-colors"
      >
        <Phone size={22} />
        <span className="text-xs">Contact</span>
      </Link>
    </nav>
  );
};

export default Navbar;
