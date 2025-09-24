'use client'

import Link from "next/link";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

export default function Footer() {
  const navItems = [
    { name: "Merch", href: "/merch" },
    { name: "Tour", href: "/tour" },
    { name: "Videos", href: "/videos" },
    { name: "News", href: "/news" },
    { name: "Contact", href: "/contact" },
  ];

  const socialLinks = [
    { icon: <SiTiktok size={20} />, href: "https://www.tiktok.com/@yourprofile" },
    { icon: <FaInstagram size={20} />, href: "https://www.instagram.com/yourprofile" },
    { icon: <FaYoutube size={20} />, href: "https://www.youtube.com/@yourchannel" },
  ];

  return (
    <footer className="w-full bg-gradient-to-t from-black via-[#111111] to-[#0a0a0a] text-white py-6 px-6 md:px-16 border-t border-gray-800">
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-0">

        {/* Left: Name / Logo */}
        <div className="flex-1 text-center md:text-left">
          <div className="text-lg font-bold tracking-widest uppercase">
            State of the Art
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="flex-1 flex justify-center flex-wrap gap-5">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="uppercase tracking-wider text-sm md:text-base font-semibold hover:text-gray-400 transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right: Social Links */}
        <div className="flex-1 flex flex-col items-center md:items-end gap-2">
          <div className="flex gap-4">
            {socialLinks.map((social, idx) => (
              <Link
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition hover:drop-shadow-[0_0_6px_white]"
              >
                {social.icon}
              </Link>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2 md:mt-0">
            &copy; {new Date().getFullYear()} State of the Art. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
