'use client'

import Link from "next/link"

export default function Header() {
  const navItems = [
    { name: 'Homssse', href: '/' },
    { name: 'Merch', href: '/merch' },
    { name: 'Videos', href: '/videos' },
    { name: 'Tour', href: '/tour' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="relative z-10 w-full bg-gradient-to-r from-black via-[#0a0a0a] to-black py-4 px-4 md:py-6 md:px-6 shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] via-white to-[#00ffff] drop-shadow-[0_0_6px_rgba(0,255,255,0.6)]">
          State of the Art
        </h1>

        {/* Navbar */}
        <nav className="hidden md:flex">
          <ul className="flex space-x-8 text-sm md:text-base font-medium uppercase tracking-wide">
            {navItems.map((item) => (
              <li key={item.name} className="group relative">
                <Link
                  href={item.href}
                  className="relative text-gray-300 hover:text-[#00ffff] transition-colors duration-200"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00ffff] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
