"use client";

import { Home, ShoppingBag, MapPin, PlayCircle, Phone } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-around bg-black border-t border-gray-800 p-2 text-gray-400">
      {/* Home */}
      <button className="flex flex-col items-center text-sm hover:text-[#00ffff] transition-colors">
        <Home size={22} />
        <span className="text-xs">Home</span>
      </button>

      {/* Merch */}
      <button className="flex flex-col items-center text-sm hover:text-[#00ffff] transition-colors">
        <ShoppingBag size={22} />
        <span className="text-xs">Merch</span>
      </button>

      {/* Tour */}
      <button className="flex flex-col items-center text-sm hover:text-[#00ffff] transition-colors">
        <MapPin size={22} />
        <span className="text-xs">Tour</span>
      </button>

      {/* Videos */}
      <button className="flex flex-col items-center text-sm hover:text-[#00ffff] transition-colors">
        <PlayCircle size={22} />
        <span className="text-xs">Videos</span>
      </button>

      {/* Contact */}
      <button className="flex flex-col items-center text-sm hover:text-[#00ffff] transition-colors">
        <Phone size={22} />
        <span className="text-xs">Contact</span>
      </button>
    </nav>
  );
};

export default Navbar;
