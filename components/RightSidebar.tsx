'use client'

import { useState } from "react"
import { ChevronRight } from "lucide-react"

export default function RightSidebar() {
  const [rightCollapsed, setRightCollapsed] = useState(false)

  return (
    <aside
      className={`bg-black/40 backdrop-blur-2xl text-white border-l border-gray-800 p-3 md:p-4 flex flex-col transition-all duration-300 shadow-xl ${
        rightCollapsed ? "w-12 md:w-12" : "w-64 md:w-[245px]"
      } flex-shrink-0`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setRightCollapsed(!rightCollapsed)}
        className="mb-2 md:mb-4 text-white/70 hover:text-cyan-400 self-start transition-colors duration-300"
      >
        <ChevronRight
          size={20}
          className={`${rightCollapsed ? "rotate-180" : ""}`}
        />
      </button>

      {!rightCollapsed && (
        <>
          {/* Social Feed */}
          <div className="sticky top-0 bg-black/30 backdrop-blur-sm mb-3 rounded-md p-2 shadow-inner">
            <h2 className="text-lg font-bold uppercase text-white/60 tracking-wider">
              Social Feed
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 pl-2 space-y-3 scrollbar-thin scrollbar-thumb-cyan-600 scrollbar-track-transparent">
            {Array.from({ length: 6 }).map((_, idx) => (
              <a
                key={idx}
                href="https://instagram.com"
                target="_blank"
                className="block bg-black/30 rounded-xl shadow-lg hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 border border-transparent hover:border-cyan-400 p-2 md:p-3"
              >
                <div className="relative h-24 md:h-40 w-full overflow-hidden rounded-t-xl">
                  <img
                    src={`https://via.placeholder.com/300x300.png?text=IG+Post+${
                      idx + 1
                    }`}
                    alt={`IG Post ${idx + 1}`}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                </div>
                <div className="pt-2 md:pt-3">
                  <p className="text-xs text-white/50 mb-1">@artisthandle</p>
                  <p className="text-sm font-semibold text-white/90 line-clamp-2">
                    Check out this latest drop!
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Tour Dates */}
          <div className="sticky top-0 bg-black/30 backdrop-blur-sm mt-4 mb-2 rounded-md p-2 shadow-inner">
            <h2 className="text-lg font-bold uppercase text-white/60 tracking-wider">
              Upcoming Tour Dates
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 pl-2 space-y-3 scrollbar-thin scrollbar-thumb-cyan-600 scrollbar-track-transparent">
            <ul>
              {[
                { date: "Oct 12, 2025", city: "New York, NY", venue: "Madison Square Garden" },
                { date: "Oct 18, 2025", city: "Los Angeles, CA", venue: "Hollywood Bowl" },
                { date: "Nov 2, 2025", city: "Chicago, IL", venue: "United Center" },
                { date: "Nov 10, 2025", city: "Miami, FL", venue: "American Airlines Arena" },
              ].map((tour, idx) => (
                <li
                  key={idx}
                  className="p-3 md:p-4 bg-black/30 rounded-xl shadow-lg hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 border border-transparent hover:border-cyan-400"
                >
                  <p className="text-xs text-white/50">{tour.date}</p>
                  <p className="text-sm font-semibold text-white/90">{tour.city}</p>
                  <p className="text-xs text-white/50">{tour.venue}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </aside>
  )
}
