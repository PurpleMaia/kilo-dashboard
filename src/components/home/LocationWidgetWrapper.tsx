'use client'
import LocationWidget from "./LocationWidget";
import { useSensorsData } from "@/hooks/use-data";

export default function LocationWidgetWrapper() {
  const { data: sensorsData, isLoading, error, isError } = useSensorsData();  

  if (isLoading) {
    return (
      <div className="m-2 p-4 rounded-lg bg-white border border-gray-300 shadow-md">
        Loading sensor data...
      </div>
    );
  }

  if (!sensorsData || !sensorsData.locations) {
    return (
      <div className="m-2 p-4 rounded-lg bg-gray-100 border border-gray-300 text-gray-600">
        No sensor data available
      </div>
    );
  }

  if (sensorsData.locations.length === 0) {
    return (
      <div className="m-2 p-4 rounded-lg bg-blue-100 border border-blue-300 text-blue-700">
        No locations found
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