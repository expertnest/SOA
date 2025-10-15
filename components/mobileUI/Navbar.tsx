"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, MapPin, PlayCircle, Phone } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/news", label: "Home", icon: Home },
    { href: "/merch", label: "Merch", icon: ShoppingBag },
    { href: "/tour", label: "Tour", icon: MapPin },
    { href: "/videos", label: "Videos", icon: PlayCircle },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  return (
    <nav className="flex items-center justify-around bg-gradient-to-r from-purple-950 via-black to-indigo-950 border-t border-gray-800 p-2 text-white shadow-lg">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center text-sm transition-colors ${
              isActive ? "text-[#00FFAA]" : "text-white hover:text-[#7CFC00]"
            }`}
          >
            <Icon size={22} />
            <span className="text-xs">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
