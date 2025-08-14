'use client'
import LocationWidget from "./LocationWidget";
import { useLocationData } from "@/hooks/use-data";

export default function LocationWidgetWrapper() {
  const { data: sensorsData, isLoading, error, isError } = useLocationData();  

  if (isLoading) {
    return (
      <div className="m-2 p-4 rounded-lg bg-white border border-gray-300 shadow-md">
        Loading sensor data...
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
      <div className="shadow-md m-4 bg-gray-100 border-2 border-gray-300 rounded-lg p-8 text-gray-600 flex items-center justify-center h-96">
        <p>No data found for this ʻāina</p>
      </div>
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