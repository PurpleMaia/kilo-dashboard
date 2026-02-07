'use client'
import LocationWidget from "./LocationWidget";
import { useLocationData, usePublicData } from "@/hooks/use-data";

export default function LocationWidgetWrapper() {
  const { data: sensorsData, isLoading, error, isError } = useLocationData();  
  const { data: publicData } = usePublicData()

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-300 shadow-md m-2 p-4 rounded-lg h-[400px]">
        {/* Skeleton for location/sensor cards */}
        <div className="space-y-3 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-100 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="bg-white rounded p-2">
                    <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-6 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!sensorsData || !sensorsData.locations) {
    return (
      <div className="shadow-md m-4 bg-yellow-100 border-2 border-yellow-500 rounded-lg p-8 text-yellow-700 flex items-center text-center justify-center h-96">
        You are not assigned to an ʻāina, please select an ʻāina in your profile settings
      </div>
    );
  }

  if (sensorsData.locations.length === 0) {
    return (
      // <div className="shadow-md m-4 bg-gray-100 border-2 border-gray-300 rounded-lg p-8 text-gray-600 flex items-center justify-center h-96">
      //   <p>No location data found for this ʻāina</p>
      // </div>
      <>
        { publicData && 
          <LocationWidget locations={publicData?.locations} />        
        }
      </>
    );
  }

  if (isError) {
    return (
      <div className="m-2 p-4 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-700">
        {error?.message || 'An error occurred while fetching sensor data'}
      </div>
    );
  }  

  return <LocationWidget locations={sensorsData?.locations} /> 
}