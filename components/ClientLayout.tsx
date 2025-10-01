"use client"

import { ReactNode } from "react"
import LeftSidebar from "@/components/LeftSidebar"
import RightSidebar from "@/components/RightSidebar"
import useIsMobile from "@/hooks/useIsMobile"
import MusicPlayer from "@/components/mobileUI/MusicPlayer"
import Navbar from "./mobileUI/Navbar"
import { MusicProvider } from "@/hooks/MusicContext"

export default function ClientLayout({ children }: { children: ReactNode }) {
  const hideSidebars = useIsMobile()

  return (
    <MusicProvider>
      <div className="relative w-full h-screen flex flex-col overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Desktop Navbar */}
          {!hideSidebars && (
            <div className="sticky top-0 z-50 flex justify-center bg-gradient-to-r from-black via-[#0a0a0a] to-black shadow-lg border-b border-gray-800">
              <div className="flex-1 max-w-[calc(100%-500px)] px-4 py-3 flex items-center justify-between">
                <div className="text-2xl font-extrabold uppercase tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] via-white to-[#00ffff] drop-shadow-[0_0_6px_rgba(0,255,255,0.6)]">
                  State of the Art
                </div>
                <nav className="hidden md:flex gap-8 text-sm md:text-base font-medium uppercase tracking-wide">
                  {["Home", "Merch", "Videos", "Tour", "Contact"].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="relative text-gray-300 hover:text-[#00ffff] transition-colors duration-200 group"
                    >
                      {item}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00ffff] transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Mobile Navbar */}
          {hideSidebars && (
           <div className="fixed top-0 left-0 right-0 z-50">
           <Navbar />
         </div>
          )}

          {/* Main Layout */}
          <div className="flex flex-1 flex-row overflow-hidden">
            
            {!hideSidebars && <LeftSidebar />}
            <main className="flex-1 overflow-y-auto pt-[70px]">{children}</main>
            {!hideSidebars && <RightSidebar />}
          </div>
        </div>

        {/* Mobile Player */}
        {hideSidebars && (
          <div className="sticky bottom-0 left-0 right-0 z-50">
            <MusicPlayer />
          </div>
        )}
      </div>
    </MusicProvider>
  )
}
