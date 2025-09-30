'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"

const tourDates = [
  { id: 1, date: "Oct 12, 2025", time: "8:00 PM", city: "New York, NY", venue: "Madison Square Garden", ticket: "https://example.com/nyc" },
  { id: 2, date: "Oct 13, 2025", time: "7:30 PM", city: "Boston, MA", venue: "TD Garden", ticket: "https://example.com/boston" },
  { id: 3, date: "Oct 15, 2025", time: "8:00 PM", city: "Philadelphia, PA", venue: "Wells Fargo Center", ticket: "https://example.com/philadelphia" },
  { id: 4, date: "Oct 19, 2025", time: "7:30 PM", city: "Los Angeles, CA", venue: "Hollywood Bowl", ticket: "https://example.com/la" },
  { id: 5, date: "Oct 21, 2025", time: "8:00 PM", city: "San Francisco, CA", venue: "Chase Center", ticket: "https://example.com/sf" },
  { id: 6, date: "Oct 26, 2025", time: "8:00 PM", city: "Chicago, IL", venue: "United Center", ticket: "https://example.com/chicago" },
  { id: 7, date: "Oct 28, 2025", time: "8:30 PM", city: "Detroit, MI", venue: "Little Caesars Arena", ticket: "https://example.com/detroit" },
  { id: 8, date: "Nov 2, 2025", time: "9:00 PM", city: "Miami, FL", venue: "American Airlines Arena", ticket: "https://example.com/miami" },
  { id: 9, date: "Nov 5, 2025", time: "8:00 PM", city: "Atlanta, GA", venue: "State Farm Arena", ticket: "https://example.com/atlanta" },
  { id: 10, date: "Nov 8, 2025", time: "8:00 PM", city: "Houston, TX", venue: "Toyota Center", ticket: "https://example.com/houston" },
  { id: 11, date: "Oct 26, 2025", time: "8:00 PM", city: "Chicago, IL", venue: "United Center", ticket: "https://example.com/chicago" },
  { id: 12, date: "Oct 28, 2025", time: "8:30 PM", city: "Detroit, MI", venue: "Little Caesars Arena", ticket: "https://example.com/detroit" },
  { id: 13, date: "Nov 2, 2025", time: "9:00 PM", city: "Miami, FL", venue: "American Airlines Arena", ticket: "https://example.com/miami" },
  { id: 14, date: "Nov 5, 2025", time: "8:00 PM", city: "Atlanta, GA", venue: "State Farm Arena", ticket: "https://example.com/atlanta" },
  { id: 15, date: "Nov 8, 2025", time: "8:00 PM", city: "Houston, TX", venue: "Toyota Center", ticket: "https://example.com/houston" },
]

export default function TourPage() {
  return (
    <div className="relative w-full max-h-screen bg-black text-white flex flex-col overflow-hidden mt-6">
      {/* Stars background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-repeat opacity-70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <header className="w-full bg-zinc-900/80 py-6 px-6 flex flex-col items-start shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-[0.1em]">
            Tour Dates
          </h1>
          <Link
            href="/"
            className="mt-2 text-white uppercase tracking-[0.2em] text-sm md:text-base font-bold cursor-pointer transition hover:text-gray-400"
          >
            &larr; Back to Menu
          </Link>
        </header>

        {/* Table + List container */}
        <div className="flex flex-col items-center flex-1 w-full relative z-10">
          {/* Table Headers */}
          <div className="hidden md:grid grid-cols-6 w-full max-w-5xl text-gray-300 uppercase tracking-wide mb-3 px-4 text-sm mt-6">
            <span>Date</span>
            <span>Time</span>
            <span>City</span>
            <span>Venue</span>
            <span>Tickets</span>
            <span>Details</span>
          </div>

          {/* Solid background list container */}
          <div className="flex flex-col w-full max-w-5xl overflow-y-auto h-[75vh] bg-zinc-900/90 rounded-xl p-4 shadow-lg">
            {tourDates.map((tour) => (
              <div
                key={tour.id}
                className="grid grid-cols-1 md:grid-cols-6 items-center gap-3 px-4 py-3 rounded-lg border border-gray-700 hover:bg-zinc-800 transition mb-2"
              >
                <span className="font-medium text-sm">{tour.date}</span>
                <span className="text-gray-300 text-sm">{tour.time}</span>
                <span className="text-sm">{tour.city}</span>
                <span className="text-gray-300 text-sm">{tour.venue}</span>
                <Link href={tour.ticket} passHref  >
  <Button className="mt-2 md:mt-0 px-4 py-1.5 rounded-lg bg-white text-black hover:bg-gray-200 transition text-xs">
    Tickets
  </Button>
</Link>
                <span className="text-gray-400 text-xs">
                  Doors open 1h before, VIP info
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
