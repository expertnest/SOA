"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, MapPin, PlayCircle, Phone, User } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/merch", label: "Merch", icon: ShoppingBag },
    { href: "/tour", label: "Tour", icon: MapPin },
    { href: "/videos", label: "Videos", icon: PlayCircle },
    { href: "/artists", label: "Artists", icon: User },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  return (
    <nav className="flex items-center justify-around bg-black border-b border-gray-800 p-2 text-white shadow-md">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center text-sm transition-colors duration-200 ${
              isActive
                ? "text-[#00FFAA] drop-shadow-[0_0_5px_rgba(0,255,170,0.7)]"
                : "text-white hover:text-[#00FFAA] hover:drop-shadow-[0_0_5px_rgba(0,255,170,0.5)]"
            }`}
          >
            <Icon size={24} />
            <span className="text-xs">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
