'use client'
 
 
import BackgroundStars from "@/components/BackgroundStars"
import MusicVideos from "@/components/MusicVideos"
import NewsGrid from "@/components/NewsGrid"



 
 


export default function NewsPage() {
  
  return (
    <div className="relative w-full h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 z-0">
        <BackgroundStars/>
      </div>

      {/* Header */}
     

      {/* Main Layout */}
      <div className="relative z-10 flex flex-1 flex-row overflow-hidden">
        {/* Left Sidebar */}
   

        {/* Middle Scrollable Feed */}
        <div className="flex-1 overflow-y-auto px-2 md:px-4 py-4 md:pt-8 md:pb-6">
          {/* Music Videos */}
        <MusicVideos />

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 auto-rows-[180px] sm:auto-rows-[220px] gap-3 md:gap-6 w-full mt-6">
        <NewsGrid />
        </div>
        </div>

        {/* Right Sidebar */}
      
      
      </div>
  
      
    </div>
  )
}
