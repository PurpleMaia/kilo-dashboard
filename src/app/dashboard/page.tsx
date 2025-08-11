'use client'
import WeatherWidget from "@/components/home/WeatherWidget";
import MahinaWidget from "@/components/home/MahinaWidget";
import RecentUploadWidget from "@/components/home/RecentUploadWidget";
import SolsticeWidget from "@/components/home/SolsticeWidget";
import KiloNotes from "@/components/home/KiloNotesWidget";
import LocationWidgetWrapper from "@/components/home/LocationWidgetWrapper";

export default function Page() {    
    return (
        <div className="min-h-screen flex">
        <div className="flex-1 flex flex-col">

        
        <div className="flex-1 p-3 md:p-6">
          <div className="max-w-full space-y-6">
            {/* Main Content - Side by Side Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Left Column - Sensor Readings */}
              <div className="space-y-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Sensor Readings</h2>
                <div className="h-96">
                  <LocationWidgetWrapper />              
                </div>
              </div>
              
              {/* Right Column - Diary Entries */}
              <div className="space-y-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Kilo Notes</h2>
                <div className="h-96">
                  <KiloNotes />
                </div>
              </div>
            </div>
            
            {/* Top Widgets Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <WeatherWidget />
              <SolsticeWidget />
              <MahinaWidget />
              <RecentUploadWidget />              
            </div>
            

            {/* Placeholder for future component */}
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">Data Insights w/ KILO LLM will go here</p>
            </div>            

          </div>
        </div>
      </div>
    </div>
    );
}