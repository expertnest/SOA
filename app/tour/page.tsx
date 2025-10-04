"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const tourDates = [
  { id: 1, date: "TBD", time: "TBD", city: "New York, NY", venue: "Madison Square Garden", ticket: "#" },
  { id: 2, date: "TBD", time: "TBD", city: "Boston, MA", venue: "TD Garden", ticket: "#" },
  { id: 3, date: "TBD", time: "TBD", city: "Philadelphia, PA", venue: "Wells Fargo Center", ticket: "#" },
  { id: 4, date: "TBD", time: "TBD", city: "Los Angeles, CA", venue: "Hollywood Bowl", ticket: "#" },
  { id: 5, date: "TBD", time: "TBD", city: "San Francisco, CA", venue: "Chase Center", ticket: "#" },
  { id: 6, date: "TBD", time: "TBD", city: "Chicago, IL", venue: "United Center", ticket: "#" },
  { id: 7, date: "TBD", time: "TBD", city: "Detroit, MI", venue: "Little Caesars Arena", ticket: "#" },
  { id: 8, date: "TBD", time: "TBD", city: "Miami, FL", venue: "American Airlines Arena", ticket: "#" },
  { id: 9, date: "TBD", time: "TBD", city: "Atlanta, GA", venue: "State Farm Arena", ticket: "#" },
  { id: 10, date: "TBD", time: "TBD", city: "Houston, TX", venue: "Toyota Center", ticket: "#" },
  // Extra creative stops
  { id: 11, date: "TBD", time: "TBD", city: "Nashville, TN", venue: "Bridgestone Arena", ticket: "#" },
  { id: 12, date: "TBD", time: "TBD", city: "Dallas, TX", venue: "American Airlines Center", ticket: "#" },
  { id: 13, date: "TBD", time: "TBD", city: "Seattle, WA", venue: "Climate Pledge Arena", ticket: "#" },
  { id: 14, date: "TBD", time: "TBD", city: "Denver, CO", venue: "Ball Arena", ticket: "#" },
  { id: 15, date: "TBD", time: "TBD", city: "Las Vegas, NV", venue: "T-Mobile Arena", ticket: "#" },
];

export default function TourPage() {
  return (
    <div className="relative w-full p-2 bg-black text-white flex flex-col overflow-hidden min-h-screen">
      {/* Stars background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-repeat opacity-70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 items-center w-full md:mt-10">
        {/* Table Headers (desktop only) */}
        <div className="hidden md:grid grid-cols-6 w-full max-w-5xl text-gray-300 uppercase tracking-wide mb-3 px-4 text-sm">
          <span>Date</span>
          <span>Time</span>
          <span>City</span>
          <span>Venue</span>
          <span>Tickets</span>
          <span>Details</span>
        </div>

        {/* Tour List */}
        <div className="flex flex-col w-full max-w-5xl overflow-y-auto bg-zinc-900/90 rounded-xl p-4 shadow-lg">
          {tourDates.map((tour) => (
            <div
              key={tour.id}
              className="grid grid-cols-1 md:grid-cols-6 items-center gap-3 px-4 py-3 rounded-lg border border-gray-700 hover:bg-zinc-800 transition mb-2"
            >
              <span className="font-medium text-sm">{tour.date}</span>
              <span className="text-gray-300 text-sm">{tour.time}</span>
              <span className="text-sm">{tour.city}</span>
              <span className="text-gray-300 text-sm">{tour.venue}</span>
              <Link href={tour.ticket} target="_blank" rel="noopener noreferrer">
                <Button className="mt-2 md:mt-0 px-4 py-1.5 rounded-lg bg-white text-black hover:bg-gray-200 transition text-xs">
                  Tickets
                </Button>
              </Link>
              <span className="text-gray-400 text-xs">Doors open 1h before, VIP info</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black min-h-[75px]"></div>
    </div>
  );
}
