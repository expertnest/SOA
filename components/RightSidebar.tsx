'use client'

import { useState } from "react"
import { ChevronRight } from "lucide-react"

export default function RightSidebar() {
  const [rightCollapsed, setRightCollapsed] = useState(false)

  return (
    <aside
      className={`bg-gradient-to-b from-[#0f0f0f] via-[#111827] to-[#1f1f1f] text-white border-t md:border-t-0 md:border-l border-gray-800 p-3 md:p-4 flex flex-col transition-all duration-300 ${
        rightCollapsed ? "w-12 md:w-12" : "w-64 md:w-80"
      } flex-shrink-0`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setRightCollapsed(!rightCollapsed)}
        className="mb-2 md:mb-4 hover:text-[#00ffff] self-start transition-colors duration-200"
      >
        <ChevronRight
          size={20}
          className={`${rightCollapsed ? "rotate-180" : ""}`}
        />
      </button>

      {!rightCollapsed && (
        <>
          {/* Social Feed */}
          <div className="sticky top-0 bg-[#111827]/80 z-10 mb-2 rounded-md p-2">
            <h2 className="text-lg font-bold uppercase text-[#00ffff]">
              Social Feed
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 mb-2 md:mb-6 space-y-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <a
                key={idx}
                href="https://instagram.com"
                target="_blank"
                className="block bg-[#111827] rounded-lg shadow hover:bg-[#1f1f1f] transition-colors duration-200"
              >
                <div className="relative h-24 md:h-40 w-full">
                  <img
                    src={`https://via.placeholder.com/300x300.png?text=IG+Post+${
                      idx + 1
                    }`}
                    alt={`IG Post ${idx + 1}`}
                    className="object-cover w-full h-full rounded-t-lg"
                  />
                </div>
                <div className="p-1 md:p-2">
                  <p className="text-xs text-white/60 mb-1">@artisthandle</p>
                  <p className="text-sm font-semibold line-clamp-2">
                    Check out this latest drop!
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Tour Dates */}
          <div className="sticky top-0 bg-[#111827]/80 z-10 mb-2 rounded-md p-2">
            <h2 className="text-lg font-bold uppercase text-[#00ffff]">
              Upcoming Tour Dates
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
              {[
                {
                  date: "Oct 12, 2025",
                  city: "New York, NY",
                  venue: "Madison Square Garden",
                },
                {
                  date: "Oct 18, 2025",
                  city: "Los Angeles, CA",
                  venue: "Hollywood Bowl",
                },
                {
                  date: "Nov 2, 2025",
                  city: "Chicago, IL",
                  venue: "United Center",
                },
                {
                  date: "Nov 10, 2025",
                  city: "Miami, FL",
                  venue: "American Airlines Arena",
                },
              ].map((tour, idx) => (
                <li
                  key={idx}
                  className="p-2 bg-[#111827] rounded hover:bg-[#1f1f1f] transition-colors duration-200"
                >
                  <p className="text-xs text-white/60">{tour.date}</p>
                  <p className="text-sm font-semibold">{tour.city}</p>
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
